import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ConnectionStatus from '../models/connectionStatus';
import logger from '../utils/logger';
import SignalingWsClient from '../services/SignalingWsClient';

/**
 * ExampleComponent is an example component.
 * It takes a property, `label`, and
 * displays it.
 * It renders an input with the property `value`
 * which is editable by the user.
 */
export default class DashWebrtc extends Component {

    constructor(props) {
        super(props);

        // Ice configuration for WebRTC connection (STUN/TURN servers)
        this.iceConfig = this.props.iceServersConfig || {
            iceServers: [
                // STUN servers
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' },
                // TURN servers
                {
                    urls: 'turn:openrelay.metered.ca:80',
                    username: 'openrelayproject',
                    credential: 'openrelayproject'
                }
            ],
            iceCandidatePoolSize: 10, // Number of ICE candidates to gather before sending an offer
            iceTransportPolicy: 'all' // 'relay' for TURN only, 'all' for both STUN and TURN
        };

        // Init RTRCPeerConnection
        this.pc = new RTCPeerConnection(this.iceConfig);
        // Add event handlers for the RTCPeerConnection object
        this.pc.onicecandidate = this.handleIceCandidate.bind(this); // ICE candidate event handler
        this.pc.onconnectionstatechange = this.handleConnectionStateChange.bind(this); // Connection state event handler
        this.pc.onnegotiationneeded = this.handleNegotiationNeeded.bind(this); // Negotiation needed event handler
        this.pc.ontrack = this.handleAddTrack.bind(this); // Track added event handler
        this.pc.onicegatheringstatechange = this.handleIceGatheringStateChange.bind(this); // ICE gathering state event handler

        // Init Signaling WebSocket client & connect
        this.signalingClient = new SignalingWsClient(
            this.props.signalingUrl,              // Signaling server URL
            this.props.signalingServerProtocols,        // Signaling server protocols
            this.props.debug,                           // Debug mode
            this.props.signalingServerMaxRetries,       // Max retries
            this.props.signalingServerRetryInterval,    // Retry interval
            this.props.signalingServerOpeningMessage    // Opening message to send, on websocket connection
        )
        this.signalingClient.onConnectionStatusChange = this.handleSignalingConnectionStatusChange.bind(this);
        this.signalingClient.onMessage = this.handleSignalingMessage.bind(this);

        // Init logger
        this.logger = logger('DashWebrtc', this.props.debug);

        // 'this.state' is a special property that is built into all React components
        // It is part of the component's state management system.
        // When the state of a component changes, the component will automatically re-render.
        this.state = {
            status: ConnectionStatus.CLOSED, // Initial status
            error: null, // No error initially
        };

        // Variables to store incoming and outgoing media streams
        this.incomingMediaStreams = new Map();
        this.outgoingMediaStreams = null;

        // Variable to indicate if an offer is being madee
        this.makingOffer = false;

        // Variable to indicate that the offer should be ignored because an offer is already in progress
        this.ignoreIncomingOffer = false;

        // Variable to indicate if the remote offer configuration is in progress
        this.isSettingRemoteAnswerPending = false;

        // Variable to indicate the politeness mode
        this.polite = this.props.polite || null;

    }

    // ============================== Signaling Client - Event Handlers ==============================

    async handleSignalingMessage(message) {
        try {
            // Check if the RTCPeerConnection is available
            if (!this.pc) {
                return;
            }

            const { description, candidate, role } = message; // Destructure the message object

            // Check if the message contains a description or a candidate
            if (description) {
                this.logger.log('log', 'Received description signaling message:', description);

                // Check if we are ready to process an offer
                // If the signaling state is 'stable' or we are waiting for a remote answer, we are ready
                const readyForOffer =
                    !this.makingOffer &&
                    (this.pc.signalingState === "stable" || this.isSettingRemoteAnswerPending);

                // An offer collision occurs when an offer is received while we are still processing an offer
                const offerCollision = description.type === "offer" && !readyForOffer;

                // Check if we are in polite mode
                if (!this.polite || !typeof this.polite === 'boolean') {
                    throw new Error('Invalid politeness mode. Must be a boolean value. This property is required. Should be set by the user or the signaling server.');
                }

                // If we are the sender (polite = false), we are impolite and will ignore incoming offers
                this.ignoreIncomingOffer = !this.polite && offerCollision;
                if (this.ignoreIncomingOffer) {
                    return; // Ignore the offer and wait for the next one
                }

                // Apply the remote description (offer or answer)
                // For an answer, we mark that we are configuring it
                this.isSettingRemoteAnswerPending = description.type === "answer";
                await this.pc.setRemoteDescription(description);
                this.isSettingRemoteAnswerPending = false;

                // If we received an offer, create an answer
                if (description.type === "offer") {
                    await this.pc.setLocalDescription();

                    // Send the answer to the remote peer
                    this.logger.log('log', 'Sending answer to remote peer:', this.pc.localDescription);
                    this.signalingClient.send({ description: this.pc.localDescription });
                }
                // Handle ICE
            } else if (candidate) {
                this.logger.log('log', 'Received candidate signaling message:', candidate);
                try {
                    await this.pc.addIceCandidate(candidate);
                } catch (err) {
                    if (!this.ignoreIncomingOffer) {
                        throw err;
                    }
                }
            } else if (role) {
                const { polite } = role;
                if (!polite) {
                    this.logger.log('warn', 'Invalid role signaling message. No `polite` found :', message);
                } else if (!typeof polite === 'boolean') {
                    this.logger.log('warn', 'Invalid role signaling message. `polite` must be a boolean :', message);
                } else {
                    this.polite = polite;
                    this.logger.log('log', 'Politeness mode updated:', this.polite);
                }
            } else {
                this.logger.log('warn', 'Invalid signaling message. No `description` or `candidate` found:', message);
            }
        } catch (err) {
            this.logger.log('error', 'Error handling signaling message:', err);
            this.setState({
                status: ConnectionStatus.ERROR,
                error: `Signaling error: ${err.message}`
            });
        }
    }

    handleSignalingConnectionStatusChange(status) {
        this.logger.log('log', 'Signaling connection status:', status);
    }

    // ============================== RTCPeerConnection - Event Handlers ==============================


    /**
     * Handle ICE candidate events.
     * @param {RTCPeerConnectionIceEvent} event - ICE candidate event
     * @returns {void}
     */
    handleIceCandidate(event) {
        this.logger.log('log', 'handleIceCandidate event:', event);
        this.signalingClient.send({ candidate: event.candidate });
    }

    /**
     * Handle connection state changes.
     * @param {Event} event - Connection state change event
     * @returns {void}
     */
    handleConnectionStateChange(event) {
        if (!this.pc) {
            return;
        }
        const state = this.pc.connectionState;
        this.logger.log('log', 'RTCPeerConnection state:', state);

        switch (state) {
            case 'new':
                this.setState({
                    status: ConnectionStatus.NEW
                });
                break;
            case 'connecting':
                this.setState({
                    status: ConnectionStatus.CONNECTING
                });
                break;
            case 'connected':
                this.setState({
                    status: ConnectionStatus.CONNECTED
                });
                break;
            case 'failed':
                this.setState({
                    status: ConnectionStatus.FAILED
                });
                break;
            case 'closed':
                this.setState({
                    status: ConnectionStatus.CLOSED
                });
                break;
        }
    }

    /**
     * Handle the 'negotiationneeded' event.
     * This event is triggered when the RTCPeerConnection needs to create an offer. 
     * Here it will always create an offer, because the negotiationneeded event is triggered when the RTCPeerConnection is in the 'stable' state.
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Perfect_negotiation#handling_the_negotiationneeded_event}
     * @param {Event} event - Negotiation needed event
     * @returns {void}
     * @async
     * @private
     */
    async handleNegotiationNeeded(event) {
        // Check if the RTCPeerConnection is available
        if (!this.pc) {
            return;
        }

        this.logger.log('log', 'handleNegotiationNeeded event:', event);
        try {
            this.makingOffer = true;
            // seltLocalDescription : Crée automatiquement une offre ou une réponse en fonction de l'état actuel de la connexion (signalingState)
            await this.pc.setLocalDescription()
            // Send the offer to the remote peer
            this.logger.log('log', 'Sending offer to remote peer:', this.pc.localDescription);
            this.signalingClient.send({ description: this.pc.localDescription });
        }
        catch (error) {
            this.logger.log('error', 'Error during negotiation:', error);
            this.setState({
                status: ConnectionStatus.FAILED,
                error: `Error during negotiation: ${error.message}`
            });
        } finally {
            this.makingOffer = false;
        }
    }


    /**
     * Handle ICE gathering state changes.
     * warn: This method implement the non-trickle ICE technique.
     * This approach waits for all ICE candidates to be collected before sending the complete offer.
     * This avoids sending each ICE candidate individually via the 'onicecandidate' event, which is problematic with Dash's setProps because:
     * 1. Multiple candidates arrive in rapid succession
     * 2. React/Dash updates are too slow to process each candidate
     * 3. Successive setProps calls overwrite previous candidates
     * This technique ensures all candidates are included in the SDP offer in a single message.
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Perfect_negotiation#handling_ice_gathering_state_changes}
     * @see {@link https://datatracker.ietf.org/doc/html/draft-ietf-mmusic-trickle-ice-02#section-1}
     * @param {Event} event - ICE gathering state change event
     * @returns {void}
     * @private
     */
    handleIceGatheringStateChange(event) {
        // Check if the RTCPeerConnection is available
        if (!this.pc) {
            return;
        }

        // Get the current ICE gathering state
        const state = this.pc.iceGatheringState;
        this.logger.log('log', 'IceGathering state:', state);

        // Handle the ICE gathering state
        switch (state) {
            case 'new':
                break;
            case 'gathering':
                break;
            // When ICE gathering is complete, send the full offer with all candidates
            case 'complete':
                // if (this.pc.localDescription && this.props.polite === 'sender') {
                //     this.logger.log('log', 'ICE gathering complete, sending full offer with all candidates', this.pc.localDescription);
                //     if (this.props.setProps) {
                //         this.props.setProps({
                //             outgoingSignalingMessage: { description: this.pc.localDescription }
                //         });
                //     }
                // } else {
                //     this.logger.log('log', 'ICE gathering complete, waiting for offer', this.pc.localDescription);
                // }
                break;
            default:
                break;
        }
    }

    /**
     * Handle the addition of a new track to the RTCPeerConnection. 
     * @param {RTCTrackEvent} event - Track event
     * @returns {void}
     * @private
     */
    handleAddTrack(event) {
        const { track, streams } = event;

        this.logger.log('log', `Received track: ${track.id}, kind: ${track.kind}`);
        this.logger.log('log', `Streams received with track: ${streams.length}`);

        try {
            // Check if there are any streams
            if (!streams || streams.length === 0) {
                this.logger.log('warn', 'No streams found for the track:', track.kind);
                return;
            }

            this.logger.log('log', `First stream ID: ${streams[0].id}, track count: ${streams[0].getTracks().length}`);

            // Wait for the track to become active (unmute) before adding it to the media element
            track.onunmute = () => {
                this.logger.log('log', `Track is unmuted: ${track.kind}, id: ${track.id}`);
                this.connectStreamsToElements(streams[0], this.props.incomingMediaElementsId);
            };

        } catch (error) {
            this.logger.log('error', 'Error handling new track:', error);

            // Mettre a jour l'état avec l'erreur
            this.setState({
                status: ConnectionStatus.ERROR,
                error: `Error handling new track: ${error.message}`
            });
        }
    }

    /**
     * Connect incoming media streams to HTML media elements.
     * @param {Array} elementsId - Array of HTML media element IDs
     * @returns {void}
     * @private
     */
    connectStreamsToElements(mediaStream, elementsId) {
        if (!mediaStream || !elementsId) {
            this.logger.log('warn', 'No incoming media streams or element IDs to connect');
            return;
        }

        try {
            // Get the audio and video tracks
            const audioTracks = mediaStream.getAudioTracks();
            if (audioTracks.length > 1) {
                this.logger.log('warn', 'Multiple audio tracks found. Only the first one will be used.');
            }

            const videoTracks = mediaStream.getVideoTracks();
            if (videoTracks.length > 1) {
                this.logger.log('warn', 'Multiple video tracks found. Separate them into different streams.');
            }

            // Limit to the number of available elements
            let elementIndex = 0;
            // Create a new MediaStream with the video track
            videoTracks.forEach((track) => {
                // Create a new MediaStream for the track
                this.incomingMediaStreams.set(elementIndex, new MediaStream());

                // Add the track to the stream
                this.incomingMediaStreams.get(elementIndex).addTrack(track);
            });

            // Connect the tracks to the media elements
            let isFirst = true;
            elementIndex = 0
            audioTracks.forEach((track) => {
                if (!this.incomingMediaStreams.get(elementIndex)) {
                    this.incomingMediaStreams.set(elementIndex, new MediaStream());
                }

                // Add the audio track if it's the first video track
                if (isFirst && audioTracks.length > elementIndex) {
                    this.incomingMediaStreams.get(elementIndex).addTrack(track);
                    isFirst = false;
                } else if (!isFirst) {
                    this.logger.log('warn', 'Multiple audio tracks found. This implementation only supports one audio track.');
                }
            });

            // Check if there are more streams than elements
            if (this.incomingMediaStreams.size > elementsId.length) {
                this.logger.log('warn', 'Not enough media elements to connect all tracks');
            }

            // Connect the streams to the elements
            elementsId.forEach((id, index) => {
                if (document.getElementById(id)) {
                    const mediaElement = document.getElementById(id);
                    mediaElement.srcObject = this.incomingMediaStreams.get(index);
                    this.logger.log('log', `Media element ${id} connected to stream:`, this.incomingMediaStreams.get(index));
                }
            });

        } catch (error) {
            this.logger.log('error', `Error connecting stream ${mediaStream.id} to element:`, error);
        }
    };


    /**
     * Disconnect incoming media streams from HTML media elements.
     * @param {Array} elementsId - Array of HTML media element IDs
     * @returns {void}
     * @private
     */
    disconnectStreamsToElements(elementsId) {
        console.log('disconnectStreamsToElements', elementsId);

        // If no incoming media streams or elements are specified, return
        if (!elementsId) {
            this.logger.log('warn', 'No incoming media elements to disconnect');
            return;
        }

        // Disconnect the media streams from the elements
        elementsId.forEach(id => {
            if (document.getElementById(id)) {
                const mediaElement = document.getElementById(id);
                // Stop the media element
                if (mediaElement.srcObject) {
                    mediaElement.pause();
                }

                // Disconnect the stream
                mediaElement.srcObject = null;
                this.logger.log('log', 'Media element disconnected:', id);
            }
        });

    }

    /**
     * Validate constraints for media devices. 
     * @private
     */
    validateContraints() {
        // Validate and set default constraints if needed
        const constraints = this.props.mediaDevicesConstraints;

        console.log('validateContraints', constraints);

        // Validate that at least one media type is requested
        if (!constraints.audio && !constraints.video) {
            throw new Error('At least one media type must be requested. Modify the `mediaDevicesConstraints` prop.');
        }

        // Validate constraint format
        if (constraints.audio && typeof constraints.audio !== 'boolean' && typeof constraints.audio !== 'object') {
            throw new Error('Invalid audio constraints format. Modify the `mediaDevicesConstraints` prop.');
        }
        if (constraints.video && typeof constraints.video !== 'boolean' && typeof constraints.video !== 'object') {
            throw new Error('Invalid video constraints format. Modify the `mediaDevicesConstraints` prop.');
        }
    }

    /**
    * Updates the outgoing media stream when constraints change.
    * Handles multiple tracks per media type and ensures proper track replacement.
    * @returns {Promise<void>}
    * @async
    * @private
    */
    async updateOutgoingMediaStreams() {
        try {
            // Validate constraints
            this.validateContraints();

            // Get a new media stream with the updated constraints
            const newStream = await navigator.mediaDevices.getUserMedia(this.props.mediaDevicesConstraints);

            // Store previous tracks for cleanup
            const previousTracks = this.outgoingMediaStreams?.getTracks() || [];

            // Get all tracks from the new stream
            const newVideoTracks = newStream.getVideoTracks();
            const newAudioTracks = newStream.getAudioTracks();

            this.logger.log('log', `New media stream acquired: ${newVideoTracks.length} video tracks, ${newAudioTracks.length} audio tracks`);

            if (!this.pc) {
                this.logger.log('warn', 'No RTCPeerConnection available for track update');
                return;
            }

            // Get all current senders
            const senders = this.pc.getSenders();

            // Create tracking arrays for replaced tracks
            const replacedVideoTracks = [];
            const replacedAudioTracks = [];

            // First pass: replace existing tracks where possible
            for (const sender of senders) {
                if (!sender.track) continue;

                if (sender.track.kind === 'video' && newVideoTracks.length > 0) {
                    // Find a video track that hasn't been used yet
                    const unusedTrack = newVideoTracks.find(track =>
                        !replacedVideoTracks.includes(track.id));

                    if (unusedTrack) {
                        this.logger.log('log', `Replacing video track ${sender.track.id} with ${unusedTrack.id}`);
                        await sender.replaceTrack(unusedTrack);
                        replacedVideoTracks.push(unusedTrack.id);
                    }
                }
                else if (sender.track.kind === 'audio' && newAudioTracks.length > 0) {
                    // Find an audio track that hasn't been used yet
                    const unusedTrack = newAudioTracks.find(track =>
                        !replacedAudioTracks.includes(track.id));

                    if (unusedTrack) {
                        this.logger.log('log', `Replacing audio track ${sender.track.id} with ${unusedTrack.id}`);
                        await sender.replaceTrack(unusedTrack);
                        replacedAudioTracks.push(unusedTrack.id);
                    }
                }
            }

            // Second pass: add any new tracks that weren't used as replacements
            for (const track of newVideoTracks) {
                if (!replacedVideoTracks.includes(track.id)) {
                    this.logger.log('log', `Adding new video track: ${track.id}`);
                    this.pc.addTrack(track, newStream);
                }
            }

            for (const track of newAudioTracks) {
                if (!replacedAudioTracks.includes(track.id)) {
                    this.logger.log('log', `Adding new audio track: ${track.id}`);
                    this.pc.addTrack(track, newStream);
                }
            }

            // Update the outgoing media streams reference
            this.outgoingMediaStreams = newStream;

            // Set the media stream to the outgoing media element
            this.connectStreamsToElements(this.outgoingMediaStreams, this.props.outgoingMediaElementsId);

            // Stop and remove previous tracks
            for (const track of previousTracks) {
                track.stop();
            }
        } catch (error) {
            this.logger.log('error', 'Error updating media stream:', error);
            this.setState({
                status: ConnectionStatus.ERROR,
                error: `Error updating media stream: ${error.message}`
            });
        }
    }


    async addMediaTracksToPeerConnection() {
        try {
            // Get the available media devices
            this.outgoingMediaStreams = await navigator.mediaDevices.getUserMedia(this.props.mediaDevicesConstraints);
            this.logger.log('log', 'Media devices enumerated:', this.outgoingMediaStreams);
            // Add the tracks to the peer connection
            if (this.outgoingMediaStreams) {
                for (const track of this.outgoingMediaStreams.getTracks()) {
                    this.logger.log('log', 'Adding track to connection:', track.kind, track.id);
                    this.pc.addTrack(track, this.outgoingMediaStreams);
                }
            } else {
                this.logger.log('warn', 'No media devices available');
            }
        } catch (error) {
            this.logger.log('error', 'Error adding media tracks to peer connection:', error);
            this.setState({
                status: ConnectionStatus.ERROR,
                error: `Error adding media tracks to peer connection: ${error.message}`
            });
        }
    }

    // Méthode pour se connecter au serveur de signalisation
    async connectToSignalingServer() {
        try {
            if (!this.signalingClient) {
                throw new Error('SignalingClient is not initialized');
            }

            this.logger.log('log', 'Connecting to signaling server...');
            await this.signalingClient.connect();

        } catch (error) {
            this.logger.log('error', 'Connection to signaling server failed:', error);
            this.setState({
                status: ConnectionStatus.ERROR,
                error: `Connection to signaling server failed: ${error.message}`
            });
        }
    }


    /**
     * Start the WebRTC connection.
     * @returns {Promise<void>}
     * @async
     * @private
     */
    async start() {
        try {
            // Validate media constraints 
            this.validateContraints();

            // Get the available media devices and add the tracks to the peer connection  
            await this.addMediaTracksToPeerConnection();

            // Set the media stream to the outgoing media element
            this.connectStreamsToElements(this.outgoingMediaStreams, this.props.outgoingMediaElementsId);

        } catch (error) {
            this.logger.log('error', 'Error starting WebRTC:', error);

            // Mettre a jour l'état avec l'erreur
            this.setState({
                status: ConnectionStatus.ERROR,
                error: `Error starting WebRTC: ${error.message}`
            })
        }
    }

    /**
 * Récupère la liste des périphériques audio et vidéo disponibles.
 * Cette méthode peut être déclenchée depuis Dash via un callback.
 */
    async getMediaDevices() {
        try {
            this.logger.log('log', 'Getting available media devices...');

            // Vérifier si l'API MediaDevices est disponible
            if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
                throw new Error('MediaDevices API not supported in this browser');
            }

            // Sur certains navigateurs, il faut d'abord demander l'accès aux périphériques
            // pour obtenir leurs labels (noms)
            let stream = null;
            try {
                // Demander un accès temporaire aux périphériques
                stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
            } catch (error) {
                this.logger.log('warn', 'Could not get media access to enumerate devices with labels:', error);
                // On continue quand même, mais les labels seront peut-être vides
            }

            // Récupérer la liste des périphériques
            const devices = await navigator.mediaDevices.enumerateDevices();

            // Arrêter le stream temporaire s'il existe
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }

            // Filtrer et formater les périphériques
            const videoDevices = devices
                .filter(device => device.kind === 'videoinput')
                .map(device => ({
                    deviceId: device.deviceId,
                    label: device.label || `Caméra ${device.deviceId.slice(0, 8)}...`,
                    groupId: device.groupId
                }));

            const audioDevices = devices
                .filter(device => device.kind === 'audioinput')
                .map(device => ({
                    deviceId: device.deviceId,
                    label: device.label || `Microphone ${device.deviceId.slice(0, 8)}...`,
                    groupId: device.groupId
                }));

            // Résultat final
            const result = {
                videoDevices,
                audioDevices
            };

            // Envoyer le résultat via setProps
            if (this.props.setProps) {
                this.props.setProps({
                    availableMediaDevices: result
                });
            }

            this.logger.log('log', 'Media devices enumerated:', result);
            return result;

        } catch (error) {
            this.logger.log('error', 'Error enumerating media devices:', error);

            // Envoyer l'erreur via setProps
            if (this.props.setProps) {
                this.props.setProps({
                    hasError: true,
                    errorMessage: `Error enumerating media devices: ${error.message}`
                });
            }

            return {
                videoDevices: [],
                audioDevices: [],
                error: error.message
            };
        }
    }

    stop() {
        try {
            // Arrêter tous les flux media
            if (this.outgoingMediaStreams) {
                this.outgoingMediaStreams.getTracks().forEach(track => track.stop());
            }

            // Arrêter la connexion
            if (this.pc) {
                this.pc.close();
                this.pc = null;
            }

            // Arreter le signaling client
            if (this.signalingClient) {
                this.signalingClient.close();
                this.signalingClient = null;
            }

            // Déconnecter les flux des éléments media
            if (this.props.incomingMediaElementsId) {
                this.disconnectStreamsToElements(this.props.incomingMediaElementsId);
            }
            if (this.props.outgoingMediaElementsId) {
                this.disconnectStreamsToElements(this.props.outgoingMediaElementsId);
            }

            // Mettre à jour l'état
            this.setState({
                status: ConnectionStatus.CLOSED,
                error: null,
            });
        } catch (error) {
            this.logger.log('error', 'Error stopping capture:', error);

            // Mettre a jour l'état avec l'erreur
            this.setState({
                status: ConnectionStatus.ERROR,
                error: `Error stopping capture: ${error.message}`
            })
        }
    }

    // Methode de cycle de vie du composant
    componentDidMount() {
        // Connexion au serveur de signalisation
        this.connectToSignalingServer()
        
        // Si autoStart est true, démarrer la capture automatiquement
        if (this.props.autoStart) {
            this.start();
        }
    }

    async componentDidUpdate(prevProps, prevState) {
        // Surveiller les changement de la propriété 'capture'
        if (this.props.capture !== prevProps.capture) {
            if (this.props.capture === true) {
                this.start();
            } else {
                this.stop();
            }
        }

        if (this.props.mediaDevicesConstraints !== prevProps.mediaDevicesConstraints) {
            this.logger.log('log', 'Media constraints changed:', this.props.mediaDevicesConstraints);
            await this.updateOutgoingMediaStreams();
        }
        // Surveiller la réception des messages de signalisation
        if (this.props.incomingSignalingMessage !== prevProps.incomingSignalingMessage) {

            // Si un message de signalisation est reçu, le traiter

            if (this.props.incomingSignalingMessage !== null) {
                this.logger.log('log', 'Signaling message received:', this.props.incomingSignalingMessage);
                await this.handleSignalingMessage(this.props.incomingSignalingMessage);
            }
        }

        // Lorsque l'état change, mettre à jour les props correspondantes
        if (this.state.status !== prevState.status && this.props.setProps) {
            this.props.setProps({
                status: this.state.status
            });
        }

        // Détecter quand refreshMediaDevices change pour déclencher l'énumération des périphériques
        if (this.props.refreshMediaDevices !== prevProps.refreshMediaDevices) {
            this.logger.log('log', 'Media devices refresh triggered');
            this.getMediaDevices();
        }

        if (this.props.polite !== prevProps.polite) {
            this.logger.log('log', 'Politeness mode changed:', this.props.polite);
            this.polite = this.props.polite;
        }

        // Lorsque que l'erreur change ou apprait, mettre à joiur les props correspondantes
        if (this.state.error !== prevState.error && this.props.setProps) {
            this.props.setProps({
                hasError: true,
                errorMessage: this.state.error
            });
        }
    }

    componentWillUnmount() {
        // Nettoyer les ressources quand le composant est détruit
        this.stop();
    }

    // Methode obligatoire qui retourne l'interface utilisateur du composant
    render() {
        return (null);
    }
}

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

