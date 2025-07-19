import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:8001"; // Update with your backend URL

class SocketService {
  socket = null;

  connect(userId) {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, { query: { userId } });

      this.socket.on("connect", () => console.log("Connected to socket"));
      this.socket.on("disconnect", () => console.log("Disconnected from socket"));
    }
  }

  joinThread(threadId, userId) {
    this.socket?.emit("join-thread", { threadId, userId });
  }

  sendMessage(messageData) {
    this.socket?.emit("send-message", messageData);
  }

  onNewMessage(callback) {
    this.socket?.on("new-message", callback);
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }
}

export default new SocketService();
