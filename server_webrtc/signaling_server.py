import asyncio
import websockets
import json
import logging

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("signaling")

# Stocker toutes les connexions websocket dans une seule liste
clients = {}

async def signaling_server(websocket):
    """
    Fonction simplifiée de gestion des connexions WebSocket.
    Tous les clients sont dans une seule "room" implicite.
    """
    # Générer un ID unique pour ce client
    client_id = f"client_{id(websocket)}"
    logger.info(f"Nouveau client connecté: {client_id}")

    # Déterminer si ce client est polite ou non
    # Le premier client est l'initiateur (sender), les autres sont des récepteurs (receiver)
    if len(clients) == 0:
        polite_status = False  # Premier client = initiateur
    else:
        polite_status = True  # Autres clients = récepteurs
    
    # Stocker les informations du client
    clients[websocket] = {"id": client_id, "polite": polite_status}
    
    # Informer le client de son statut de politesse
    await websocket.send(json.dumps({"role": {"polite" : polite_status}}))
    logger.info(f"Client {client_id} assigné comme {polite_status}")

    # Informer les autres clients qu'un nouveau client s'est connecté
    join_message = {"type": "system", "action": "join", "client": client_id}
    for client in clients:
        if client != websocket:  # Ne pas envoyer à soi-même
            try:
                await client.send(json.dumps(join_message))
            except Exception as e:
                logger.error(f"Erreur lors de l'envoi du message de connexion: {e}")

    try:
        async for message in websocket:
            try:
                # Transmettre le message à tous les autres clients
                data = json.loads(message)

                # Ajouter l'ID du client s'il n'est pas déjà présent
                if "sender" not in data:
                    data["sender"] = client_id

                # Créer un log avec moins de détails pour ne pas polluer la console
                log_data = {k: v for k, v in data.items() if k != "description"}
                if "description" in data:
                    log_data["description"] = {
                        "type": data["description"].get("type", "unknown")
                    }

                logger.info(f"Message reçu de {client_id}: {log_data}")

                # Transférer aux autres clients
                message_str = json.dumps(data)
                for client in clients:
                    if client != websocket:  # Ne pas renvoyer au client d'origine
                        await client.send(message_str)
            except json.JSONDecodeError:
                logger.error(f"Message invalide reçu: {message[:50]}...")
            except Exception as e:
                logger.error(f"Erreur de traitement du message: {e}")
    finally:
        # Nettoyer quand un client se déconnecte
        if websocket in clients:
            leave_client_id = clients[websocket]["id"]
            
            # Informer les autres clients que ce client a quitté
            leave_message = {
                "type": "system",
                "action": "leave",
                "client": leave_client_id,
            }

            # Supprimer le client du dictionnaire
            del clients[websocket]
            logger.info(f"Client déconnecté: {leave_client_id}")

            # Informer les autres clients du départ
            for client in clients:
                try:
                    await client.send(json.dumps(leave_message))
                except Exception as e:
                    logger.error(f"Erreur lors de l'envoi du message de déconnexion: {e}")


async def main():
    logger.info("Démarrage du serveur de signalisation sur ws://0.0.0.0:3000")
    async with websockets.serve(signaling_server, "0.0.0.0", 3000):
        await asyncio.Future()  # Exécuter indéfiniment


if __name__ == "__main__":
    asyncio.run(main())