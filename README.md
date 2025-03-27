# dash-webrtc

A WebRTC component for Dash applications that enables real-time audio and video communication.

## 🚧 Project Status

This component is under active development. Core functionality is implemented and working, but the API may evolve.

## Features

- **WebRTC Perfect Negotiation** - Correct handling of offer collisions and concurrent negotiation
- **WebSocket Signaling** - Built-in WebSocket client for signaling with customizable configuration
- **Trickle ICE Support** - Efficient ICE candidate gathering and transmission
- **Media Device Management** - API for device enumeration and selection
- **Polite/Impolite Peer Roles** - Properly handles asymmetric negotiation roles
- **Configurable Media Constraints** - Control over audio/video parameters
- **Multi-stream Support** - Connect multiple media elements to incoming/outgoing streams

## Technical Implementation

- React component architecture integrated with Dash callback system
- WebSocket signaling channel with automatic reconnection capabilities
- Proper media track handling with device selection
- RTCPeerConnection state management following WebRTC best practices
- SDP offer/answer exchange with ICE candidate handling

## Installation

```bash
pip install dash-webrtc
```

## Configuration Options
The component supports several configuration options:
```python
	dash_webrtc.DashWebrtc(
	    id="webrtc",
	    # Signaling configuration
	    signalingUrl="ws://localhost:3000",
	
	    # WebRTC configuration
	    iceServersConfig={
	        "iceServers": [
	            {"urls": "stun:stun.l.google.com:19302"},
	            {
	                "urls": "turn:your.turn.server",
	                "username": "username", 
	                "credential": "password"
	            }
	        ],
	        "iceCandidatePoolSize": 10
	    },
	
	    # Media configuration
	    mediaDevicesConstraints={
	        "audio": {
	            "echoCancellation": True,
	            "noiseSuppression": True
	        },
	        "video": {
	            "width": {"ideal": 1280},
	            "height": {"ideal": 720}
	        }
	    },
	
	    # UI integration
	    outgoingMediaElementsId=["local-video"],
	    incomingMediaElementsId=["remote-video"],
	
	    # Behavior
	    polite=True,  # This peer will be polite during negotiation
	    autoStart=True,
	    debug=True
	)
```

## Requirements
- Dash 2.0+
- A WebSocket signaling server
- Modern browser with WebRTC support

## License
MIT

## Contributors
Hans