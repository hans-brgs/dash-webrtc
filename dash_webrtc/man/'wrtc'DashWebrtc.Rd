% Auto-generated: do not edit by hand
\name{'wrtc'DashWebrtc}

\alias{'wrtc'DashWebrtc}

\title{DashWebrtc component}

\description{
ExampleComponent is an example component. It takes a property, `label`, and displays it. It renders an input with the property `value` which is editable by the user.
}

\usage{
'wrtc'DashWebrtc(id=NULL, autoStart=NULL, availableMediaDevices=NULL,
capture=NULL, debug=NULL, errorMessage=NULL, hasError=NULL,
iceServersConfig=NULL, incomingMediaElementsId=NULL,
mediaDevicesConstraints=NULL, outgoingMediaElementsId=NULL,
polite=NULL, refreshMediaDevices=NULL,
signalingMaxRetries=NULL, signalingOpeningMessage=NULL,
signalingRetryInterval=NULL, signalingUrl=NULL, status=NULL)
}

\arguments{
\item{id}{Character. The ID used to identify this component in Dash callbacks.}

\item{autoStart}{Logical. Démarer automatiquement la capture}

\item{availableMediaDevices}{Named list. Propriété utilisée pour renvoyer la liste des périphériques médias disponibles.
Déclenchée par la méthode getMediaDevices().}

\item{capture}{Logical. Contrôle l'état de capture (true = démarrer, false = arrêter)}

\item{debug}{Logical. Debug mode for conditional logging.}

\item{errorMessage}{Character. Message d'erreur actuel (le cas échéant)}

\item{hasError}{Logical. Si une erreur est survenue}

\item{iceServersConfig}{Lists containing elements 'iceservers', 'icecandidatepoolsize', 'icetransportpolicy'.
those elements have the following types:
  - iceservers (optional): . iceservers has the following type: list of lists containing elements 'urls', 'username', 'credential'.
those elements have the following types:
  - urls (character | list of characters; required)
  - username (character; optional)
  - credential (character; optional)s
  - icecandidatepoolsize (numeric; optional)
  - icetransportpolicy (a value equal to: 'all', 'relay'; optional). Configuration des serveurs ICE utilisés pour les connexions WebRTC.
Permet de personnaliser les serveurs STUN/TURN pour traverser les NAT et firewalls.
Si non fourni, une configuration par défaut avec des serveurs publics est utilisée.}

\item{incomingMediaElementsId}{Unnamed list. ID de l'élément audio/video HTML à connecter au flux entrant}

\item{mediaDevicesConstraints}{Named list. Contraintes de capture des médias (audio, vidéo), voir https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
L'objet est un dictionnaire de clés (audio, video) avec des valeurs de contraintes. 
Par défault on capture seulement l'audio : { audio: true, video: false }
Exemple :
{ audio: { echoCancellation: true, noiseSuppression: true }, video: { width: 1280, height: 720 } }}

\item{outgoingMediaElementsId}{Unnamed list. ID de l'élément audio/video HTML à connecter au flux sortant}

\item{polite}{Logical. Controle si le composant doit attendre de recevoir une offre avant d'en créer une (true, polie) ou si il peut initier une offre sans attendre (false, impolie).}

\item{refreshMediaDevices}{Numeric. Déclenche l'énumération des périphériques médias.
Incrémentez cette valeur pour lancer l'énumération.}

\item{signalingMaxRetries}{Numeric. Nombre maximal de tentatives de reconnexion de la connection websocket en cas d'échec.
@default 3
@type {number}}

\item{signalingOpeningMessage}{Named list. Message d'ouverture à envoyer lors de la connexion.
@default null
@type {Object}
@example
{
        "type": "join",
        "room": "my-room"
      }}

\item{signalingRetryInterval}{Numeric. Intervalle entre les tentatives de reconnexion en millisecondes.
@default 1000
@type {number}
@example}

\item{signalingUrl}{Character. URL du serveur de signalisation WebSocket.}

\item{status}{Character. Status actuel (le cas échéant)}
}

\value{named list of JSON elements corresponding to React.js properties and their values}

