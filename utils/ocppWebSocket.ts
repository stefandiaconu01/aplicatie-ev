class OCPPWebSocket {
  private socket: WebSocket | null = null;
  private serverUrl: string;
  private eventListeners: { [key: string]: (data: any) => void } = {};

  constructor(serverUrl: string) {
    this.serverUrl = serverUrl;
  }

//modarem: C6E20CCC23CATETRVT
//venetic: C6E12BCC23ZRKUWYRD

// Connect to the WebSocket server
  connect() {
    this.socket = new WebSocket(this.serverUrl, ["ocpp1.6"]);

    this.socket.onopen = () => {
      console.log("WebSocket connected to OCPP server!");
      this.sendMessage("DataTransfer", {
        vendorId: "phone_app_vendor",
        messageId: "RemoteStartTransactionRequestF",
        data: JSON.stringify({ station_id: "C6E20CCC23CATETRVT", connector_id: 2 }),
      });

      this.sendMessage("DataTransfer", {
        vendorId: "phone_app_vendor",
        messageId: "RemoteStopTransactionRequestF",
        data: JSON.stringify({
          station_id: "C6E12BCC23ZRKUWYRD",
          connector_id: 1,
          transaction_id: 100569,
        }),
      });
    };

    //la remotestoprequest: ii dau doar transaction_id
    //la remotestartrequest: ii dau doar statia (sub forma de sn) si connector_id

    this.socket.onmessage = (event) => {
      console.log("Raw WebSocket message received:", event.data);
      try {
        const data = JSON.parse(event.data);

        // If message has "type", pass it to the correct event listener
        if (data.type && this.eventListeners[data.type]) {
          this.eventListeners[data.type](data);
        } else {
          console.warn("Received unexpected WebSocket message:", data);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    this.socket.onclose = (event) => {
      console.warn("WebSocket closed, reconnecting in 3s...", event.reason);
      setTimeout(() => this.connect(), 3000);
    };
  }

  // Send a message to the WebSocket server
  sendMessage(action: string, payload: object = {}) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const messageId = `msg-${Date.now()}`; //unique ID
      const ocppMessage = [2, messageId, action, payload];

      this.socket.send(JSON.stringify(ocppMessage));
      console.log(`Sent OCPP message:`, ocppMessage);
    } else {
      console.warn("Cannot send message, WebSocket is not open!");
    }
  }

  // Register event listeners for different message types
  on(eventType: string, callback: (data: any) => void) {
    this.eventListeners[eventType] = callback;
  }

  // Close WebSocket connection manually
  close() {
    if (this.socket) {
      this.socket.close();
    }
  }
}

const phone_id = "phone_app";
// de modificat - vezi daca merge cu duckdns...
const OCPPClient = new OCPPWebSocket(`ws://192.168.27.10:8765/${phone_id}`);

export default OCPPClient;
