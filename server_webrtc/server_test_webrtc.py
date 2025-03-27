import asyncio
import json
import logging
import os
import cv2
import fractions
import time
from aiohttp import web
import websockets
from av import VideoFrame
import numpy as np
import threading

from aiortc import (
    MediaStreamTrack,
    RTCPeerConnection,
    RTCSessionDescription,
    RTCIceCandidate,
    RTCRtpCodecParameters,
    RTCRtpTransceiver,
)
from aiortc.contrib.media import MediaBlackhole, MediaPlayer, MediaRecorder

# Configurer le logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("webrtc-server")

# Dictionnaire pour stocker les connexions peer
peer_connections = {}
# Dictionnaire pour stocker les frames reçues des clients
received_frames = {}


class TestVideoStreamTrack(MediaStreamTrack):
    kind = "video"

    def __init__(self, track_id=0):
        super().__init__()
        self.counter = 0
        self.track_id = track_id
        self.colors = [
            (0, 0, 255),    # Rouge
            (0, 255, 0),    # Vert
            (255, 0, 0),    # Bleu
            (0, 255, 255),  # Jaune
            (255, 0, 255),  # Magenta
        ]
        self.color = self.colors[track_id % len(self.colors)]
        logger.info(f"TestVideoStreamTrack #{track_id} initialized")

    async def recv(self):
        self.counter += 1
        if self.counter % 30 == 0:  # Log toutes les 30 frames
            logger.info(f"TestVideoStreamTrack #{self.track_id}.recv() appelée - frame #{self.counter}")

        # Créer une image test
        img = np.zeros((480, 640, 3), np.uint8)

        # Dessiner un rectangle qui se déplace
        x = (self.counter % 100) * 5
        cv2.rectangle(img, (x, 200), (x + 100, 300), self.color, -1)

        # Ajouter un texte
        cv2.putText(
            img,
            f"Stream #{self.track_id} - Frame {self.counter}",
            (20, 50),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            (255, 255, 255),
            2,
        )

        # Convertir en frame vidéo
        frame = VideoFrame.from_ndarray(img, format="bgr24")
        frame.pts = self.counter * 3000  # 30fps
        frame.time_base = fractions.Fraction(1, 90000)  # Base de temps standard

        return frame


class VideoStreamTrack(MediaStreamTrack):
    """
    Une classe de piste vidéo personnalisée qui génère des frames vidéo.
    """

    kind = "video"

    def __init__(self, video_source=0):
        super().__init__()
        self.video_source = video_source
        self.cap = cv2.VideoCapture(video_source)
        self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
        self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

        # Vérifier si la caméra est ouverte
        if not self.cap.isOpened():
            raise ValueError(f"Impossible d'ouvrir la source vidéo {video_source}")
        logger.info(f"Caméra ouverte: {video_source}")

    async def recv(self):
        logger.info("VideoStreamTrack.recv() appelée")
        # Lire une frame de la caméra
        ret, frame = self.cap.read()
        if not ret:
            # Si la lecture échoue, réinitialiser la caméra ou utiliser une image par défaut
            self.cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
            ret, frame = self.cap.read()
            if not ret:
                # Image noire si tout échoue
                frame = np.zeros((480, 640, 3), np.uint8)

        # Convertir le format BGR d'OpenCV en RGB pour VideoFrame
        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # Créer un VideoFrame à partir de la frame
        video_frame = VideoFrame.from_ndarray(frame, format="rgb24")
        video_frame.pts = int(time.time() * 1000)  # Timestamp en millisecondes
        video_frame.time_base = fractions.Fraction(
            1, 1000
        )  # Base de temps en millisecondes

        return video_frame


class RemoteStreamTrack(MediaStreamTrack):
    """
    Pour recevoir des pistes du client et les afficher
    """
    def __init__(self, track, client_id):
        super().__init__()
        self.track = track
        self.client_id = client_id
        self.kind = track.kind
        self._queue = asyncio.Queue()
        self._task = asyncio.create_task(self._forward())
        
    async def _forward(self):
        try:
            while True:
                frame = await self.track.recv()
                await self._queue.put(frame)
                
                # Si c'est une frame vidéo, la convertir pour l'afficher
                if self.kind == "video" and hasattr(frame, "to_ndarray"):
                    try:
                        # Convertir la frame vidéo en image numpy
                        img = frame.to_ndarray(format="bgr24")
                        
                        # Stocker l'image pour l'affichage
                        received_frames[self.client_id] = img
                    except Exception as e:
                        logger.error(f"Erreur lors de la conversion de la frame: {e}")
        except asyncio.CancelledError:
            pass
        except Exception as e:
            logger.error(f"Erreur dans RemoteStreamTrack._forward: {e}")
        
    async def recv(self):
        return await self._queue.get()


def parse_candidate(candidate_str):
    """Parse an ICE candidate string into components needed by aiortc."""
    parts = candidate_str.split()

    # Extraire les composants de base
    foundation = parts[0].split(":")[1]
    component = int(parts[1])
    protocol = parts[2]
    priority = int(parts[3])
    ip = parts[4]
    port = int(parts[5])
    type = parts[7]

    return {
        "component": component,
        "foundation": foundation,
        "ip": ip,
        "port": port,
        "priority": priority,
        "protocol": protocol,
        "type": type,
    }


def display_frames():
    """
    Fonction exécutée dans un thread séparé pour afficher les frames reçues
    """
    while True:
        try:
            # Créer une image combinée pour tous les flux reçus
            if received_frames:
                # Déterminer la disposition des fenêtres
                num_frames = len(received_frames)
                if num_frames == 1:
                    rows, cols = 1, 1
                elif num_frames <= 4:
                    rows, cols = 2, 2
                else:
                    rows = (num_frames + 2) // 3
                    cols = 3
                
                # Créer une image composite
                frame_width, frame_height = 320, 240  # Taille réduite pour l'affichage combiné
                combined_frame = np.zeros((rows * frame_height, cols * frame_width, 3), dtype=np.uint8)
                
                for i, (client_id, frame) in enumerate(received_frames.items()):
                    if frame is not None:
                        row = i // cols
                        col = i % cols
                        
                        # Redimensionner l'image pour l'affichage combiné
                        resized = cv2.resize(frame, (frame_width, frame_height))
                        
                        # Ajouter un texte d'identification
                        cv2.putText(
                            resized, 
                            f"Client {client_id[-4:]}", 
                            (10, 20),
                            cv2.FONT_HERSHEY_SIMPLEX, 
                            0.5, 
                            (255, 255, 255), 
                            1
                        )
                        
                        # Placer dans l'image combinée
                        combined_frame[
                            row * frame_height:(row + 1) * frame_height,
                            col * frame_width:(col + 1) * frame_width
                        ] = resized
                
                # Afficher l'image combinée
                cv2.imshow("Flux vidéo reçus", combined_frame)
            
            # Attendre une touche (avec un délai court pour permettre la mise à jour)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
        except Exception as e:
            logger.error(f"Erreur dans display_frames: {e}")
        time.sleep(0.033)  # Environ 30 FPS


async def handle_websocket(websocket):
    """
    Gère les connexions WebSocket pour la signalisation.
    """
    client_id = f"client_{id(websocket)}"
    logger.info(f"Nouveau client connecté: {client_id}")

    # Créer une nouvelle connexion RTCPeerConnection
    pc = RTCPeerConnection()

    peer_connections[client_id] = pc
    logger.info(f"RTCPeerConnection créée pour {client_id}")

    # Ajouter plusieurs pistes vidéo (3 flux de test)
    for i in range(3):
        video_track = TestVideoStreamTrack(track_id=i)
        pc.addTrack(video_track)
        logger.info(f"Piste vidéo #{i} ajoutée pour {client_id}")

    # # Configurer les gestionnaires d'événements pour recevoir les pistes du client
    # @pc.on("track")
    # def on_track(track):
    #     logger.info(f"Nouvelle piste reçue de {client_id}: {track.kind}")
        
    #     if track.kind == "video":
    #         # Créer un wrapper pour la piste reçue
    #         remote_track = RemoteStreamTrack(track, client_id)
            
    #         # Initialiser l'entrée dans le dictionnaire des frames reçues
    #         received_frames[client_id] = None
            
    #         @track.on("ended")
    #         async def on_ended():
    #             logger.info(f"Piste terminée pour {client_id}")
    #             if client_id in received_frames:
    #                 del received_frames[client_id]

    # Créer l'offre immédiatement
    offer = await pc.createOffer()
    await pc.setLocalDescription(offer)
    logger.info(f"Offre créée et définie comme description locale")

    # Envoyer l'offre au client
    await websocket.send(
        json.dumps(
            {
                "description": {
                    "sdp": pc.localDescription.sdp,
                    "type": pc.localDescription.type,
                }
            }
        )
    )
    logger.info(f"Offre envoyée au client")

    try:
        async for message in websocket:
            try:
                data = json.loads(message)
                logger.info(f"Message reçu de {client_id}: {data.keys()}")

                if "description" in data:
                    # Ici, on attend une réponse (answer) du client
                    description = data["description"]

                    if description["type"] == "answer":
                        logger.info(f"Réponse SDP reçue")
                        answer = RTCSessionDescription(
                            sdp=description["sdp"], type=description["type"]
                        )
                        await pc.setRemoteDescription(answer)
                        logger.info(f"Réponse définie comme description distante")
                    else:
                        logger.warning(
                            f"Reçu une description de type {description['type']} mais attendait une réponse"
                        )

                elif "candidate" in data:
                    candidate_str = data["candidate"]
                    logger.info(f"Candidat ICE reçu")

                    candidate = parse_candidate(candidate_str)
                    print(candidate)
                    candidate = RTCIceCandidate(
                        component=candidate["component"],
                        foundation=candidate["foundation"],
                        ip=candidate["ip"],
                        port=candidate["port"],
                        priority=candidate["priority"],
                        protocol=candidate["protocol"],
                        type=candidate["type"],
                        sdpMid=data["sdpMid"],
                        sdpMLineIndex=data["sdpMLineIndex"],
                    )
                    await pc.addIceCandidate(candidate)
                    logger.info(f"Candidat ICE ajouté")

            except Exception as e:
                logger.error(f"Erreur de traitement du message: {e}")

    except websockets.exceptions.ConnectionClosed:
        logger.info(f"Client déconnecté: {client_id}")
    finally:
        # Nettoyer la connexion
        if client_id in peer_connections:
            pc = peer_connections[client_id]
            await pc.close()
            del peer_connections[client_id]
        
        # Supprimer les frames reçues
        if client_id in received_frames:
            del received_frames[client_id]


async def main():
    # Démarrer le thread d'affichage des frames
    display_thread = threading.Thread(target=display_frames, daemon=True)
    display_thread.start()
    
    # Démarrer le serveur WebSocket
    server = await websockets.serve(
        handle_websocket, "0.0.0.0", 3000, ping_timeout=None
    )

    logger.info("Serveur WebSocket démarré sur ws://0.0.0.0:3000")
    await server.wait_closed()


if __name__ == "__main__":
    try:
        asyncio.run(main())
    finally:
        # S'assurer que toutes les fenêtres OpenCV sont fermées
        cv2.destroyAllWindows()