// ===============================================
// MODERATOR TYPES (Based on available Prisma models)
// ===============================================

export interface ModeratorStats {
  users: {
    total: number;
    newThisWeek: number;
    byRole: {
      users: number;
      moderators: number;
      admins: number;
    };
  };
  rooms: {
    total: number;
    public: number;
    private: number;
    activeToday: number;
  };
  sessions: {
    total: number;
    activeNow: number;
    completedToday: number;
    byType: {
      pomodoro: number;
      custom: number;
      break: number;
    };
  };
  messages: {
    totalToday: number;
    totalThisWeek: number;
  };
}

export interface RecentUser {
  id: string;
  name: string | null;
  email: string;
  role: "USER" | "MODERATOR" | "ADMIN";
  createdAt: string;
}

export interface RecentRoom {
  id: string;
  name: string;
  description: string | null;
  isPublic: boolean;
  maxMembers: number;
  createdAt: string;
  creator: {
    name: string | null;
    email: string;
  };
  _count: {
    members: number;
  };
}

export interface RecentSession {
  id: string;
  type: "POMODORO" | "CUSTOM" | "BREAK";
  status: "ACTIVE" | "PAUSED" | "COMPLETED" | "CANCELLED";
  duration: number;
  startedAt: string;
  endedAt: string | null;
  user: {
    name: string | null;
    email: string;
  };
  room: {
    name: string;
  };
}

export interface RecentMessage {
  id: string;
  content: string;
  type: "TEXT" | "SYSTEM" | "FILE";
  createdAt: string;
  author: {
    name: string | null;
    email: string;
  };
  room: {
    name: string;
  };
}

export interface ModeratorDashboardData {
  stats: ModeratorStats;
  recentUsers: RecentUser[];
  recentRooms: RecentRoom[];
  recentSessions: RecentSession[];
  recentMessages: RecentMessage[];
}

export interface ModeratorActivity {
  id: string;
  type:
    | "USER_WARNED"
    | "USER_BANNED"
    | "USER_UNBANNED"
    | "ROOM_MODERATED"
    | "REPORT_RESOLVED";
  description: string;
  timestamp: string;
  moderator: {
    name: string | null;
    email: string;
  };
  target?: {
    type: "USER" | "ROOM" | "REPORT";
    id: string;
    name: string;
  };
}

// Re-export User type for convenience
export type { User } from "@/features/users/types";
