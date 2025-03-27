import logger from "../utils/logger";

export default class SignalingWsClient {

	constructor(url, protocols = "json", debugMode = false, maxRetries = 3, retryInterval = 1000, openingMessage = null) {
		// Set the class properties
		this.url = url;
		this.debugMode = debugMode;
		this.maxRetries = maxRetries;
		this.retryInterval = retryInterval;
		this.openingMessage = openingMessage;
		// Add logger to the class
		this.logger = logger("SignalingWsClient", debugMode);
		this.ws = null;
		this.connectionStatus = null;
		this.onMessage = null;
		this.onConnectionStatusChange = null;
	}

	async connect() {
		let retries = 0;

		// Attempt to create a new WebSocket connection
		const attemptConnection = async () => {
			this.logger.log("info", "Attempting to connect to WebSocket server", { url: this.url });
			try {
				// Create a new WebSocket connection
				return await new Promise((resolve, reject) => {
					const ws = new WebSocket(this.url);
					this.connectionStatus = "CONNECTING";
					if (this.onConnectionStatusChange) {
						this.onConnectionStatusChange(this.connectionStatus);
					}
					this.logger.log("info", "WebSocket connection in progress");
					// If the connection is on open, resolve the promise and return the connection
					ws.onopen = () => {
						this.logger.log("info", "WebSocket connection established");
						this.connectionStatus = "CONNECTED";
						if (this.onConnectionStatusChange) {
							this.onConnectionStatusChange(this.connectionStatus);
						}
						this.ws = ws;

						// Send the opening message
						if (this.openingMessage) {
							this.logger.log("info", "Sending opening message");
							this.send(this.openingMessage);
						}
						
						// Setup event listeners
						this._setupEventListeners(ws);
						resolve(ws);
					};

					// If the connection is closed, reject the promise
					ws.onerror = (error) => reject(error);

					// Timeout for connection
					setTimeout(() => {
						if (ws.readyState !== WebSocket.OPEN) {
							ws.close();
							this.connectionStatus = "FAILED";
							if (this.onConnectionStatusChange) {
								this.onConnectionStatusChange(this.connectionStatus);
							}
							reject(new Error("Connection timeout"));
						}
					}, 3000);
				});
			} catch (error) {
				// If the connection fails, retry until the maximum number of retries is reached
				// or throw an error if the maximum number of retries is reached
				if (retries >= this.maxRetries) {
					throw new Error(`Failed to connect after ${retries} attempts: ${error.message}`);
				} else {
					this.logger.log("warn", `Failed to connect: ${error.message}. Retrying in ${this.retryInterval}ms`);
					retries++;
					await new Promise((resolve) => setTimeout(resolve, this.retryInterval));
					return attemptConnection();
				}
			};
		};
		
		return attemptConnection();
	}

	_setupEventListeners(ws) {
		ws.onmessage = (event) => {
			this.logger.log("info", "Received message", { event });
			if (this.onMessage) {
				this.onMessage(JSON.parse(event.data));
			}
		};

		ws.onclose = (event) => {
			this.logger.log("info", "WebSocket connection closed", { event });
			this.connectionStatus = "CLOSED";
			if (this.onConnectionStatusChange) {
				this.onConnectionStatusChange(this.connectionStatus);
			}
		};

		ws.onerror = (event) => {
			this.logger.log("error", "WebSocket connection error", { event });
			this.connectionStatus = "FAILED";
			if (this.onConnectionStatusChange) {
				this.onConnectionStatusChange(this.connectionStatus);
			}
		};
	}

	send(message) {
		if (this.ws && this.ws.readyState === WebSocket.OPEN) {
			const data = typeof message === "object" ? JSON.stringify(message) : message;
			this.ws.send(data);
			this.logger.log("info", "Sending message", message);
		} else {
			this.logger.log("warn", "WebSocket connection is not open. Cannot send message", { message });
		}
	}

	close() {
		if (this.ws) {
			// Preparing to close the connection
			this.logger.log("info", "Closing WebSocket connection");
			this.connectionStatus = "CLOSING";
			if (this.onConnectionStatusChange) {
				this.onConnectionStatusChange(this.connectionStatus);
			}

			// Close the connection
			this.ws.close();
			this.logger.log("info", "WebSocket connection closed");
			this.connectionStatus = "CLOSED";
			if (this.onConnectionStatusChange) {
				this.onConnectionStatusChange(this.connectionStatus);
			}

			// Reset the class properties
			this.url = null;
			this.ws = null;
			this.onConnectionStatusChange = null;
			this.onMessage = null;
		}
	}

		
}
