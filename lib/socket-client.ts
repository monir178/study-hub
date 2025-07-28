"use client";

import { io, Socket } from "socket.io-client";

class SocketManager {
  private socket: Socket | null = null;
  private static instance: SocketManager;

  private constructor() {}

  static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  connect(): Socket {
    if (!this.socket || !this.socket.connected) {
      this.socket = io(
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        {
          path: "/api/socket/io",
          addTrailingSlash: false,
          transports: ["websocket", "polling"],
        },
      );

      this.socket.on("connect", () => {
        console.log("Connected to socket server:", this.socket?.id);
      });

      this.socket.on("disconnect", (reason) => {
        console.log("Disconnected from socket server:", reason);
      });

      this.socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
      });
    }

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const socketManager = SocketManager.getInstance();
export const getSocket = () => socketManager.getSocket();
export const connectSocket = () => socketManager.connect();
export const disconnectSocket = () => socketManager.disconnect();
