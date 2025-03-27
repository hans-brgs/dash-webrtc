import asyncio
import json
import logging
import numpy as np
from scipy import signal
import websockets
from aiortc import MediaStreamTrack, RTCPeerConnection, RTCSessionDescription
from RealtimeSTT import AudioToTextRecorder

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("webrtc-transcription")

# Stockage des connexions actives
peer_connections = {}
transcribers = {}


class AudioTranscriptionTrack(MediaStreamTrack):
    """
    Piste qui reçoit l'audio du client et le transcrit
    """
    kind = "audio"

    def __init__(self, track, client_id):
        super().__init__()
        self.track = track
        self.client_id = client_id
        self._queue = asyncio.Queue()
        
        # Initialiser le transcripteur
        transcribers[client_id] = AudioToTextRecorder(
            use_microphone=False,
            model="base",    # Options: tiny, base, small, medium, large
            language="fr",   # Langue de transcription
        )
        
        # Démarrer le traitement audio
        self._task = asyncio.create_task(self._process_audio())
        logger.info(f"Transcripteur initialisé pour {client_id}")
        
    async def _process_audio(self):
        """Traite les frames audio reçues et effectue la transcription"""
        try:
            # Buffer pour accumuler les données audio
            audio_buffer = bytearray()
            
            while True:
                # Recevoir la frame audio
                frame = await self.track.recv()
                
                try:
                    # Extraire les données audio
                    audio_data = frame.to_ndarray()
                    sample_rate = frame.sample_rate
                    
                    # Convertir au format requis (16kHz, 16-bit, mono)
                    pcm_data = self._convert_audio_format(audio_data, sample_rate)
                    
                    # Ajouter au buffer
                    audio_buffer.extend(pcm_data.tobytes())
                    
                    # Si assez de données sont accumulées, transcrire
                    if len(audio_buffer) >= 4096:
                        transcriber = transcribers[self.client_id]
                        transcriber.feed_audio(bytes(audio_buffer))
                        
                        # Obtenir la transcription
                        text = transcriber.text()
                        
                        # Afficher la transcription si elle n'est pas vide
                        if text:
                            logger.info(f"Transcription [{self.client_id}]: {text}")
                            
                            # Envoyer la transcription au client
                            if hasattr(peer_connections[self.client_id], "websocket"):
                                await peer_connections[self.client_id].websocket.send(
                                    json.dumps({
                                        "type": "transcription",
                                        "text": text,
                                        "final": transcriber.is_final()
                                    })
                                )
                        
                        # Conserver un petit chevauchement pour la continuité
                        # mais vider la majeure partie du buffer
                        audio_buffer = audio_buffer[-1024:]
                    
                except Exception as e:
                    logger.error(f"Erreur de traitement audio: {e}")
                
                # Placer aussi la frame dans la file d'attente
                await self._queue.put(frame)
                
        except asyncio.CancelledError:
            logger.info(f"Traitement audio annulé pour {self.client_id}")
        except Exception as e:
            logger.error(f"Erreur dans le traitement audio: {e}")
            
    def _convert_audio_format(self, audio_data, sample_rate):
        """Convertit l'audio au format requis par RealtimeSTT (16kHz, 16-bit, mono)"""
        # Convertir en mono si stéréo
        if len(audio_data.shape) > 1 and audio_data.shape[1] > 1:
            audio_mono = np.mean(audio_data, axis=1)
        else:
            audio_mono = audio_data.flatten()
        
        # Rééchantillonner à 16kHz si nécessaire
        target_rate = 16000
        if sample_rate != target_rate:
            audio_resampled = signal.resample(
                audio_mono, 
                int(len(audio_mono) * target_rate / sample_rate)
            )
        else:
            audio_resampled = audio_mono
        
        # Convertir en int16
        if audio_resampled.dtype != np.int16:
            if np.issubdtype(audio_resampled.dtype, np.floating):
                audio_resampled = np.clip(audio_resampled, -1.0, 1.0)
                audio_resampled = (audio_resampled * 32767).astype(np.int16)
            else:
                audio_resampled = audio_resampled.astype(np.int16)
        
        return audio_resampled
        
    async def recv(self):
        """Méthode requise par MediaStreamTrack"""
        return await self._queue.get()


async def handle_websocket(websocket):
    """Gère une connexion WebSocket entrante"""
    client_id = f"client_{id(websocket)}"
    logger.info(f"Nouveau client connecté: {client_id}")
    
    # Créer une nouvelle connexion peer
    pc = RTCPeerConnection()
    pc.websocket = websocket  # Référence au websocket pour envoyer les transcriptions
    peer_connections[client_id] = pc
    
    # Configurer le gestionnaire pour les pistes entrantes
    @pc.on("track")
    def on_track(track):
        logger.info(f"Piste reçue du client {client_id}: {track.kind}")
        
        if track.kind == "audio":
            # Créer un processeur de transcription pour cette piste audio
            audio_processor = AudioTranscriptionTrack(track, client_id)
            
            @track.on("ended")
            async def on_ended():
                logger.info(f"Piste audio terminée pour {client_id}")
                if client_id in transcribers:
                    final_text = transcribers[client_id].text(True)  # Récupérer la transcription finale
                    logger.info(f"Transcription finale [{client_id}]: {final_text}")
                    
                    # Envoyer la transcription finale au client
                    await websocket.send(json.dumps({
                        "type": "transcription",
                        "text": final_text,
                        "final": True
                    }))
                    
                    del transcribers[client_id]
    
    try:
        # Traiter les messages du client
        async for message in websocket:
            try:
                data = json.loads(message)
                
                # Si on reçoit une description SDP (offer)
                if "description" in data:
                    description = data["description"]
                    logger.info(f"Description SDP reçue du client {client_id}")
                    
                    # Définir la description distante
                    await pc.setRemoteDescription(
                        RTCSessionDescription(sdp=description["sdp"], type=description["type"])
                    )
                    
                    # Créer une réponse
                    if description["type"] == "offer":
                        answer = await pc.createAnswer()
                        await pc.setLocalDescription(answer)
                        
                        # Envoyer la réponse au client
                        await websocket.send(json.dumps({
                            "description": {
                                "sdp": pc.localDescription.sdp,
                                "type": pc.localDescription.type
                            }
                        }))
                        logger.info(f"Réponse SDP envoyée au client {client_id}")
                
                # Si on reçoit un candidat ICE
                elif "candidate" in data:
                    candidate = data["candidate"]
                    if candidate:
                        logger.info(f"Candidat ICE reçu du client {client_id}")
                        await pc.addIceCandidate(candidate)
                
                # Si on reçoit une commande
                elif "command" in data:
                    command = data["command"]
                    logger.info(f"Commande reçue du client {client_id}: {command}")
                    
                    if command == "reset" and client_id in transcribers:
                        # Réinitialiser la transcription
                        transcribers[client_id].reset()
                        await websocket.send(json.dumps({
                            "type": "transcription",
                            "text": "",
                            "final": True
                        }))
            
            except json.JSONDecodeError:
                logger.error(f"Message JSON invalide reçu de {client_id}")
            except Exception as e:
                logger.error(f"Erreur de traitement du message: {e}")
                
    except websockets.exceptions.ConnectionClosed:
        logger.info(f"Client déconnecté: {client_id}")
    
    finally:
        # Nettoyer les ressources
        if client_id in peer_connections:
            await peer_connections[client_id].close()
            del peer_connections[client_id]
        
        if client_id in transcribers:
            del transcribers[client_id]


async def main():
    """Point d'entrée principal du serveur"""
    # Vérifier les dépendances
    try:
        import RealtimeSTT
    except ImportError:
        logger.error("RealtimeSTT n'est pas installé. Veuillez l'installer avec: pip install RealtimeSTT")
        return
    
    # Démarrer le serveur WebSocket
    server = await websockets.serve(
        handle_websocket, 
        "0.0.0.0",  # Écouter sur toutes les interfaces
        3000,       # Port WebSocket
        ping_timeout=None  # Désactiver les timeouts de ping
    )
    
    logger.info("Serveur de transcription WebRTC démarré sur ws://0.0.0.0:3000")
    await server.wait_closed()


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("Serveur arrêté par l'utilisateur")