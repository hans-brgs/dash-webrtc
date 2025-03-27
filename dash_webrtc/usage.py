import dash_webrtc
from dash import (
    Dash,
    callback,
    html,
    Input,
    Output,
    _dash_renderer,
    State,
    callback_context,
    no_update,
    dcc,
)
import dash_mantine_components as dmc
from dash_extensions import WebSocket
import json
import dash_webrtc.DashWebrtc
from uuid import uuid4

_dash_renderer._set_react_version("18.2.0")

# Générer un ID unique pour cette instance
client_id = str(uuid4())[:8]  # Utiliser les 8 premiers caractères de l'UUID

polite = False

def emitter():

    def video_element(id, label=None):
        return dmc.Stack(
            [
                html.Video(
                    id=f"video-element-{id}",
                    controls=True,
                    autoPlay=True,
                    width="100%",
                    height="100%",
                    style={"backgroundColor": "#000"},
                ),
                dmc.Text(label or f"Vidéo {id}", size="sm"),
            ],
        )

    return dmc.Stack(
        children=[
            dmc.Group(
                [
                    dmc.Title(f"Appel Vidéo - Client {client_id}", order=2),
                    dmc.Badge(id="status-display", color="gray", size="lg"),
                ],
            ),
            # Notre composant DashWebrtc
            dash_webrtc.DashWebrtc(
                id="webrtc-component",
                debug=True,
                incomingMediaElementsId=[
                    f"video-element-{id}" for id in range(1, 4)
                ],  # éléments 1-3 pour vidéos distantes
                outgoingMediaElementsId=["video-element-0"],  # élément 0 pour la vidéo locale
                autoStart=False,
                mediaDevicesConstraints={
                    "audio": True,
                    "video": {"width": {"ideal": 640}, "height": {"ideal": 480}},
                },
                signalingUrl=f"ws://localhost:3000/",
            ),
            # Sélecteur de caméra
            dmc.Group(
                [
                    dmc.Select(
                        id="camera-select",
                        label="Sélectionner une caméra",
                        placeholder="Caméra par défaut",
                        data=[],  # Sera rempli dynamiquement
                        style={"width": "250px"},
                    ),
                    dmc.Select(
                        id="microphone-select",
                        label="Sélectionner un microphone",
                        placeholder="Caméra par défaut",
                        data=[],  # Sera rempli dynamiquement
                        style={"width": "250px"},
                    ),
                    dmc.Button(
                        "Rafraîchir les périoériques",
                        id="refresh-devices-btn",
                        variant="outline",
                        size="sm",
                    ),
                    # Store pour conserver les données
                    dcc.Store(id="devices-store")
                ]
            ),
            # Contrôles
            dmc.Group(
                children=[
                    dmc.Button("Démarrer la caméra", id="start-button", color="green"),
                    dmc.Button("Arrêter", id="stop-button", color="red"),
                ],
            ),
            # Espace pour afficher les vidéos
            dmc.Grid(
                children=[
                    dmc.GridCol([video_element(0, "Ma caméra")], span=6),
                    dmc.GridCol([video_element(1, "Participant 1")], span=6),
                    dmc.GridCol([video_element(2, "Participant 2")], span=6),
                    dmc.GridCol([video_element(3, "Participant 3")], span=6),
                ],
                gutter="md",
            ),
        ],
        h="100%",
        p="md",
    )


app = Dash(__name__, external_stylesheets=dmc.styles.ALL)

app.layout = dmc.MantineProvider(
    children=[
        dmc.Group(
            children=[emitter()],
            h="90vh",
            w="100%",
            align="center",
            justify="center",
            gap=0,
        )
    ],
)


# Callbacks


# Callback pour démarrer la connexion
@app.callback(
    Output("webrtc-component", "capture"),
    Input("start-button", "n_clicks"),
    prevent_initial_call=True,
)
def start_webrtc(n_clicks):
    trigger = callback_context.triggered[0]["prop_id"]

    # Ne démarrer que si le bouton start a été cliqué ET la WebSocket est connectée
    print(trigger)
    if trigger == "start-button.n_clicks":
        print("start")
        return True

    return no_update


# Callback pour arrêter la connexion
@app.callback(
    Output("webrtc-component", "capture", allow_duplicate=True),
    Input("stop-button", "n_clicks"),
    prevent_initial_call=True,
)
def stop_webrtc(n_clicks):
    if n_clicks:
        return False
    return no_update


# Callback pour afficher l'état de la connexion
@app.callback(
    [Output("status-display", "children"), Output("status-display", "color")],
    [
        Input("webrtc-component", "status"),
        Input("webrtc-component", "errorMessage"),
    ],
)
def update_status(status, error):
    if error:
        return f"Erreur: {error}", "red"
    return no_update, no_update
    
@app.callback(
    Output("webrtc-component", "mediaDevicesConstraints"),
    [Input("camera-select", "value"), Input("microphone-select", "value")],
    State("webrtc-component", "mediaDevicesConstraints"),
    prevent_initial_call=True
)
def update_camera_device(camera, microphone, current_constraints):
    if not camera and not microphone:
        return no_update
    
    # Copier les contraintes actuelles
    updated_constraints = current_constraints.copy() if current_constraints else {"audio": {}, "video": {}}
    
    # S'assurer que video est un dictionnaire
    if updated_constraints["video"] is True:
        updated_constraints["video"] = {}
        
    if updated_constraints["audio"] is True:
        updated_constraints["audio"] = {}
    
    # Mettre à jour l'ID de la caméra
    print(camera, microphone)
    updated_constraints["video"]["deviceId"] = {"exact": camera}
    updated_constraints["audio"]["deviceId"] = {"exact": microphone}
    
    print(f"Nouvelles contraintes: {updated_constraints}")
    return updated_constraints

# Callback pour mettre à jour les sélecteurs avec les périphériques disponibles
@app.callback(
    [
        Output("camera-select", "data"),
        Output("microphone-select", "data"),
        Output("devices-store", "data")
    ],
    [Input("webrtc-component", "availableMediaDevices")],
    prevent_initial_call=True
)
def update_device_selectors(devices):
    print("Mise à jour des périphériques")
    if not devices:
        return [], [], None
    
    # Créer les options pour les sélecteurs
    camera_options = [
        {"value": device["deviceId"], "label": device["label"]}
        for device in devices["videoDevices"]
    ]
    
    microphone_options = [
        {"value": device["deviceId"], "label": device["label"]}
        for device in devices["audioDevices"]
    ]
    
    return camera_options, microphone_options, devices

# Callback pour déclencher l'énumération des périphériques
@app.callback(
    Output("webrtc-component", "refreshMediaDevices"),
    [Input("refresh-devices-btn", "n_clicks")],
    [State("webrtc-component", "refreshMediaDevices")]
)
def refresh_devices(n_clicks, current_value):
    print("Rafraîchir les périphériques")
    if not n_clicks:
        print("Pas de clic")
        return no_update
    print(f"Clic détecté: {(current_value or 0) + 1}")
    return (current_value or 0) + 1


# Helper pour l'horodatage
def import_time():
    from datetime import datetime

    return datetime.now()


def main():
    import argparse
    import ssl
    from pathlib import Path

    parser = argparse.ArgumentParser()
    parser.add_argument("--port", type=int, default=8050)
    parser.add_argument("--polite", type=int, default=False)
    parser.add_argument("--https", action="store_true", help="Enable HTTPS")
    args = parser.parse_args()

    # Si la politesse n'est pas spécifiée, la déterminer automatiquement
    global polite
    if args.polite is not None:
        polite = bool(int(args.polite))
    else:
        polite = args.port != 8050
    print(f"Mode poli: {polite}")

    # Configuration SSL pour HTTPS (nécessaire sur mobile)
    ssl_context = None
    if args.https:
        # Créer un certificat auto-signé si nécessaire
        cert_file = Path("cert.pem")
        key_file = Path("key.pem")

        if not cert_file.exists() or not key_file.exists():
            print("Generating self-signed certificate for HTTPS...")
            import subprocess

            subprocess.run(
                [
                    "openssl",
                    "req",
                    "-new",
                    "-x509",
                    "-keyout",
                    key_file,
                    "-out",
                    cert_file,
                    "-days",
                    "365",
                    "-nodes",
                    "-subj",
                    "/CN=localhost",
                ]
            )

        ssl_context = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
        ssl_context.load_cert_chain(cert_file, key_file)
        print(f"HTTPS enabled on port {args.port}")

    # Démarrer l'application avec ou sans HTTPS
    app.run(debug=True, host="0.0.0.0", port=args.port, ssl_context=ssl_context)


if __name__ == "__main__":
    main()
