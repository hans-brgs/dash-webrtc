# AUTO GENERATED FILE - DO NOT EDIT

export 'wrtc'_dashwebrtc

"""
    'wrtc'_dashwebrtc(;kwargs...)

A DashWebrtc component.
ExampleComponent is an example component.
It takes a property, `label`, and
displays it.
It renders an input with the property `value`
which is editable by the user.
Keyword arguments:
- `id` (String; optional): The ID used to identify this component in Dash callbacks.
- `autoStart` (Bool; optional): Démarer automatiquement la capture
- `availableMediaDevices` (Dict; optional): Propriété utilisée pour renvoyer la liste des périphériques médias disponibles.
Déclenchée par la méthode getMediaDevices().
- `capture` (Bool; optional): Contrôle l'état de capture (true = démarrer, false = arrêter)
- `debug` (Bool; optional): Debug mode for conditional logging.
- `errorMessage` (String; optional): Message d'erreur actuel (le cas échéant)
- `hasError` (Bool; optional): Si une erreur est survenue
- `iceServersConfig` (optional): Configuration des serveurs ICE utilisés pour les connexions WebRTC.
Permet de personnaliser les serveurs STUN/TURN pour traverser les NAT et firewalls.
Si non fourni, une configuration par défaut avec des serveurs publics est utilisée.. iceServersConfig has the following type: lists containing elements 'iceServers', 'iceCandidatePoolSize', 'iceTransportPolicy'.
Those elements have the following types:
  - `iceServers` (optional): . iceServers has the following type: Array of lists containing elements 'urls', 'username', 'credential'.
Those elements have the following types:
  - `urls` (String | Array of Strings; required)
  - `username` (String; optional)
  - `credential` (String; optional)s
  - `iceCandidatePoolSize` (Real; optional)
  - `iceTransportPolicy` (a value equal to: 'all', 'relay'; optional)
- `incomingMediaElementsId` (Array; optional): ID de l'élément audio/video HTML à connecter au flux entrant
- `mediaDevicesConstraints` (Dict; optional): Contraintes de capture des médias (audio, vidéo), voir https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
L'objet est un dictionnaire de clés (audio, video) avec des valeurs de contraintes. 
Par défault on capture seulement l'audio : { audio: true, video: false }
Exemple :
{ audio: { echoCancellation: true, noiseSuppression: true }, video: { width: 1280, height: 720 } }
- `outgoingMediaElementsId` (Array; optional): ID de l'élément audio/video HTML à connecter au flux sortant
- `polite` (Bool; optional): Controle si le composant doit attendre de recevoir une offre avant d'en créer une (true, polie) ou si il peut initier une offre sans attendre (false, impolie).
- `refreshMediaDevices` (Real; optional): Déclenche l'énumération des périphériques médias.
Incrémentez cette valeur pour lancer l'énumération.
- `signalingMaxRetries` (Real; optional): Nombre maximal de tentatives de reconnexion de la connection websocket en cas d'échec.
@default 3
@type {number}
- `signalingOpeningMessage` (Dict; optional): Message d'ouverture à envoyer lors de la connexion.
@default null
@type {Object}
@example
{
        "type": "join",
        "room": "my-room"
      }
- `signalingRetryInterval` (Real; optional): Intervalle entre les tentatives de reconnexion en millisecondes.
@default 1000
@type {number}
@example
- `signalingUrl` (String; optional): URL du serveur de signalisation WebSocket.
- `status` (String; optional): Status actuel (le cas échéant)
"""
function 'wrtc'_dashwebrtc(; kwargs...)
        available_props = Symbol[:id, :autoStart, :availableMediaDevices, :capture, :debug, :errorMessage, :hasError, :iceServersConfig, :incomingMediaElementsId, :mediaDevicesConstraints, :outgoingMediaElementsId, :polite, :refreshMediaDevices, :signalingMaxRetries, :signalingOpeningMessage, :signalingRetryInterval, :signalingUrl, :status]
        wild_props = Symbol[]
        return Component("'wrtc'_dashwebrtc", "DashWebrtc", "dash_webrtc", available_props, wild_props; kwargs...)
end

