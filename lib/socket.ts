import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";
import { NextApiResponseServerIO } from "@/types";

export const config = {
  api: {
    bodyParser: false,
  },
};

const SocketHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const httpServer: NetServer = res.socket.server as unknown as NetServer;
    const io = new ServerIO(httpServer, {
      path: "/api/socket/io",
      addTrailingSlash: false,
      cors: {
        origin: process.env.NEXTAUTH_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
      },
    });

    // Socket event handlers
    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      // Room management
      socket.on("room:join", ({ roomId, userId }) => {
        socket.join(roomId);
        socket.to(roomId).emit("room:member-joined", { userId });
        console.log(`User ${userId} joined room ${roomId}`);
      });

      socket.on("room:leave", ({ roomId, userId }) => {
        socket.leave(roomId);
        socket.to(roomId).emit("room:member-left", { userId });
        console.log(`User ${userId} left room ${roomId}`);
      });

      // Chat events
      socket.on("chat:message", (message) => {
        socket.to(message.roomId).emit("chat:message", message);
      });

      socket.on("chat:typing", ({ roomId, userId, isTyping }) => {
        socket.to(roomId).emit("chat:typing", { userId, isTyping });
      });

      // Timer events
      socket.on("timer:sync", (data) => {
        socket.to(data.roomId).emit("timer:sync", data);
      });

      socket.on("timer:start", (data) => {
        socket.to(data.roomId).emit("timer:start", data);
      });

      socket.on("timer:pause", (data) => {
        socket.to(data.roomId).emit("timer:pause", data);
      });

      socket.on("timer:resume", (data) => {
        socket.to(data.roomId).emit("timer:resume", data);
      });

      socket.on("timer:stop", (data) => {
        socket.to(data.roomId).emit("timer:stop", data);
      });

      // Notes events
      socket.on("notes:update", (data) => {
        socket.to(data.roomId).emit("notes:update", data);
      });

      socket.on("notes:cursor", (data) => {
        socket.to(data.roomId).emit("notes:cursor", data);
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });

    res.socket.server.io = io;
  }
  // res.end() - handled by Next.js
};

export default SocketHandler;
