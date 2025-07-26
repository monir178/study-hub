// Admin dashboard types
export interface DashboardStats {
  users: {
    total: number;
    roles: Record<string, number>;
    recentCount: number;
  };
  sessions: {
    active: number;
    total: number;
  };
  rooms: {
    total: number;
    active: number;
  };
  messages: {
    total: number;
    today: number;
  };
}

export interface SystemSettings {
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  maxRoomSize: number;
  sessionTimeout: number;
}

export interface AdminAnalytics {
  userGrowth: Array<{
    date: string;
    count: number;
  }>;
  roomActivity: Array<{
    date: string;
    activeRooms: number;
    totalSessions: number;
  }>;
  messageVolume: Array<{
    date: string;
    count: number;
  }>;
}
