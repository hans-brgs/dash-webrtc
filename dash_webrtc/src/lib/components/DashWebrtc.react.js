import React from 'react';
import PropTypes from 'prop-types';
import { DashWebrtc as RealComponent } from '../LazyLoader';

/**
 * ExampleComponent is an example component.
 * It takes a property, `label`, and
 * displays it.
 * It renders an input with the property `value`
 * which is editable by the user.
 */
const DashWebrtc = (props) => {
    return (
        <React.Suspense fallback={null}>
            <RealComponent {...props}/>
        </React.Suspense>
    );
};


// Ici on définit les propriétés par défaut du composant qui seront utilisé à l'initialisation
DashWebrtc.defaultProps = {
    debug: false,
    polite: true, // 'sender' ou 'receiver'
    autoStart: false, // Démarre automatiquement ?
    capture: false,
    refreshMediaDevices: 0,
    availableMediaDevices: null,
    mediaDevicesConstraints: { audio: true, video: true },
    iceServersConfig: null,
    incomingMediaElementsId: null,
    outgoingMediaElementsId: null,
    signalingUrl: null,
    signalingMaxRetries: 3,
    signalingRetryInterval: 1000,
};

DashWebrtc.propTypes = {

    // ============================== Dash Core Components ==============================

    /**
     * The ID used to identify this component in Dash callbacks.
     */
    id: PropTypes.string,

    /**
     * Debug mode for conditional logging.
     */
    debug: PropTypes.bool,

    /**
     * Si une erreur est survenue
     */
    hasError: PropTypes.bool,

    /**
     * Message d'erreur actuel (le cas échéant)
     */
    errorMessage: PropTypes.string,

    /**
     * Status actuel (le cas échéant)
     */
    status: PropTypes.string,

    /**
     * Dash-assigned callback that should be called to report property changes
     * to Dash, to make them available for callbacks.
     */
    setProps: PropTypes.func,

    // ============================== WebRTC Configuration ==============================

    /**
    * Configuration des serveurs ICE utilisés pour les connexions WebRTC.
    * Permet de personnaliser les serveurs STUN/TURN pour traverser les NAT et firewalls.
    * Si non fourni, une configuration par défaut avec des serveurs publics est utilisée.
    */
    iceServersConfig: PropTypes.shape({
        iceServers: PropTypes.arrayOf(PropTypes.shape({
            urls: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.arrayOf(PropTypes.string)
            ]).isRequired,
            username: PropTypes.string,
            credential: PropTypes.string
        })),
        iceCandidatePoolSize: PropTypes.number,
        iceTransportPolicy: PropTypes.oneOf(['all', 'relay'])
    }),

    /**
    * Controle si le composant doit attendre de recevoir une offre avant d'en créer une (true, polie) ou si il peut initier une offre sans attendre (false, impolie).
    */
    polite: PropTypes.bool,

    /**
     * Contraintes de capture des médias (audio, vidéo), voir https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
     * L'objet est un dictionnaire de clés (audio, video) avec des valeurs de contraintes. 
     * Par défault on capture seulement l'audio : { audio: true, video: false }
     * Exemple :
     * { audio: { echoCancellation: true, noiseSuppression: true }, video: { width: 1280, height: 720 } }
     */
    mediaDevicesConstraints: PropTypes.object,

    /**
     * Démarer automatiquement la capture
     */
    autoStart: PropTypes.bool,

    /**
     *  Contrôle l'état de capture (true = démarrer, false = arrêter)
     */
    capture: PropTypes.bool,

    /**
     * ID de l'élément audio/video HTML à connecter au flux entrant
     */
    incomingMediaElementsId: PropTypes.array,

    /**
     * ID de l'élément audio/video HTML à connecter au flux sortant
     */
    outgoingMediaElementsId: PropTypes.array,

    // ============================== Media Devices ==============================

    /**
     * Propriété utilisée pour renvoyer la liste des périphériques médias disponibles.
     * Déclenchée par la méthode getMediaDevices().
     */
    availableMediaDevices: PropTypes.object,

    /**
     * Déclenche l'énumération des périphériques médias.
     * Incrémentez cette valeur pour lancer l'énumération.
     */
    refreshMediaDevices: PropTypes.number,


    // ============================== Signaling WebSocket Client ==============================
    /**
     * URL du serveur de signalisation WebSocket.
     */
    signalingUrl: PropTypes.string.isRequired,

    /** 
     * Nombre maximal de tentatives de reconnexion de la connection websocket en cas d'échec.
     * @default 3
     * @type {number}
     */
    signalingMaxRetries: PropTypes.number,

    /**
     * Intervalle entre les tentatives de reconnexion en millisecondes.
     * @default 1000
     * @type {number}
     * @example
     */
    signalingRetryInterval: PropTypes.number,

    /**
     * Message d'ouverture à envoyer lors de la connexion.
     * @default null
     * @type {Object}
     * @example
     * {
        "type": "join",
        "room": "my-room"
      }
     */
    signalingOpeningMessage: PropTypes.object
};

export default DashWebrtc;

export const defaultProps = DashWebrtc.defaultProps;
export const propTypes = DashWebrtc.propTypes;
