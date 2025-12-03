const UploadEvent = {
  System: 'system',
  End: 'uploadEnd',
  Start: 'uploadStart',
};

class EventMessage {
  constructor(from, type, value) {
    this.from = from;
    this.type = type;
    this.value = value;
  }
}

class UploadEventNotifier {
  events = [];
  handlers = [];

  constructor() {
    let port = window.location.port;
    const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
    const url = port ? `${protocol}://${window.location.hostname}:${port}/ws` : `${protocol}://${window.location.hostname}/ws`;
    this.socket = new WebSocket(url);
    this.socket.onopen = (event) => {
      this.receiveEvent(new EventMessage('Started', UploadEvent.System, { msg: 'connected' }));
    };
    this.socket.onclose = (event) => {
      this.receiveEvent(new EventMessage('Startup', UploadEvent.System, { msg: 'disconnected' }));
    };
    this.socket.onmessage = async (msg) => {
      try {
        let data = msg.data;

        // If data is a Blob, read it as text first
        if (data instanceof Blob) {
          data = await data.text();
        }

        const event = JSON.parse(data);
        console.log("WebSocket received event:", event);
        this.receiveEvent(event);
      } catch (error) {
        console.error("Error processing WebSocket message:", error, "Raw message:", msg.data);
      }
    };
  }

  broadcastEvent(from, type, value) {
    const event = new EventMessage(from, type, value);
    console.log("WebSocket sending event:", event);

    // Only send if socket is connected
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(event));
    } else {
      console.warn('WebSocket not connected. Current state:', this.socket.readyState);
    }
  }

  addHandler(handler) {
    this.handlers.push(handler);
  }

  removeHandler(handler) {
    this.handlers = this.handlers.filter((h) => h !== handler);
  }

  receiveEvent(event) {
    this.events.push(event);

    this.handlers.forEach((handler) => {
      handler(event);
    });
  }
}

const UploadNotifier = new UploadEventNotifier();
export { UploadEvent, UploadNotifier };
