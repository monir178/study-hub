import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "USER" | "MODERATOR" | "ADMIN";
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: "USER" | "MODERATOR" | "ADMIN";
  }
}

export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  role: "USER" | "MODERATOR" | "ADMIN";
  createdAt: string;
  updatedAt: string;
}

export interface StudyRoom {
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  maxMembers: number;
  createdAt: string;
  updatedAt: string;
  creatorId: string;
  creator: User;
  members: RoomMember[];
  _count?: {
    members: number;
    messages: number;
    notes: number;
  };
}

export interface RoomMember {
  id: string;
  role: "MEMBER" | "MODERATOR" | "ADMIN";
  status: "ONLINE" | "OFFLINE" | "STUDYING" | "BREAK";
  joinedAt: string;
  userId: string;
  user: User;
  roomId: string;
}

export interface Message {
  id: string;
  content: string;
  type: "TEXT" | "SYSTEM" | "FILE";
  createdAt: string;
  authorId: string;
  author: User;
  roomId: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  roomId: string;
}

export interface StudySession {
  id: string;
  duration: number;
  type: "POMODORO" | "CUSTOM" | "BREAK";
  status: "ACTIVE" | "PAUSED" | "COMPLETED" | "CANCELLED";
  startedAt: string;
  endedAt?: string;
  userId: string;
  user: User;
  roomId: string;
}

export interface SocketEvents {
  // Room events
  "room:join": { roomId: string; userId: string };
  "room:leave": { roomId: string; userId: string };
  "room:member-status": {
    roomId: string;
    userId: string;
    status: RoomMember["status"];
  };

  // Chat events
  "chat:message": Message;
  "chat:typing": { roomId: string; userId: string; isTyping: boolean };

  // Timer events
  "timer:sync": {
    roomId: string;
    remainingTime: number;
    isActive: boolean;
    type: string;
  };
  "timer:start": { roomId: string; duration: number; type: string };
  "timer:pause": { roomId: string };
  "timer:resume": { roomId: string };
  "timer:stop": { roomId: string };

  // Notes events
  "notes:update": { roomId: string; noteId: string; content: string };
  "notes:cursor": { roomId: string; userId: string; position: number };
}

export interface NextApiResponseServerIO extends Response {
  socket: {
    server: {
      io: unknown;
    };
  };
}
