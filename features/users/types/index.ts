export interface User {
  id: string;
  name: string | null;
  email: string;
  emailVerified: string | null; // ISO string instead of Date
  image: string | null;
  imageSource: "UPLOAD" | "GOOGLE" | "GITHUB";
  password: string | null;
  role: "USER" | "MODERATOR" | "ADMIN";
  locale: string;
  theme: "LIGHT" | "DARK" | "SYSTEM";

  // Additional profile fields
  phoneNumber: string | null;
  gender: "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY" | null;
  dateOfBirth: string | null; // ISO string instead of Date

  // Address fields
  street: string | null;
  city: string | null;
  region: string | null;
  postalCode: string | null;
  country: string | null;

  createdAt: string; // ISO string instead of Date
  updatedAt: string; // ISO string instead of Date
}

export interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  imageSource: "UPLOAD" | "GOOGLE" | "GITHUB";
  role: "USER" | "MODERATOR" | "ADMIN";
  locale: string;
  theme: "LIGHT" | "DARK" | "SYSTEM";

  // Additional profile fields
  phoneNumber: string | null;
  gender: "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY" | null;
  dateOfBirth: Date | null;

  // Address fields
  street: string | null;
  city: string | null;
  region: string | null;
  postalCode: string | null;
  country: string | null;

  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateUserData {
  name?: string | null;
  image?: string | null;
  locale?: string;
  theme?: "LIGHT" | "DARK" | "SYSTEM";
  role?: "USER" | "MODERATOR" | "ADMIN";

  // Additional profile fields
  phoneNumber?: string | null;
  gender?: "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY" | null;
  dateOfBirth?: Date | null;

  // Address fields
  street?: string | null;
  city?: string | null;
  region?: string | null;
  postalCode?: string | null;
  country?: string | null;
}

export interface CreateUserData {
  name?: string | null;
  email: string;
  password: string;
  role?: "USER" | "MODERATOR" | "ADMIN";
  locale?: string;
  theme?: "LIGHT" | "DARK" | "SYSTEM";

  // Additional profile fields
  phoneNumber?: string | null;
  gender?: "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY" | null;
  dateOfBirth?: Date | null;

  // Address fields
  street?: string | null;
  city?: string | null;
  region?: string | null;
  postalCode?: string | null;
  country?: string | null;
}

export interface UserStats {
  totalStudyTime: number;
  totalSessions: number;
  currentStreak: number;
  longestStreak: number;
  joinedRooms: number;
  createdRooms: number;
}

// Dashboard specific types
export interface UserDashboardStats {
  totalStudyTime: number;
  totalSessions: number;
  createdRooms: number;
  privateRooms: number;
  joinedRoomsCount: number;
  averageSessionTime: number;
}

export interface StudySession {
  id: string;
  duration: number;
  type: "POMODORO" | "CUSTOM" | "BREAK";
  status: "ACTIVE" | "PAUSED" | "COMPLETED" | "CANCELLED";
  startedAt: string;
  endedAt: string | null;
  phase: string;
  remaining: number;
  session: number;
  totalSessions: number;
  controlledBy: string | null;
  userId: string;
  roomId: string;
}

export interface RoomMember {
  id: string;
  role: "MEMBER" | "MODERATOR" | "ADMIN";
  status: "ONLINE" | "OFFLINE" | "STUDYING" | "BREAK";
  joinedAt: string;
  userId: string;
  roomId: string;
  room: {
    id: string;
    name: string;
    description: string | null;
    isPublic: boolean;
    maxMembers: number;
    createdAt: string;
    updatedAt: string;
    creatorId: string;
    creator: {
      name: string | null;
      image: string | null;
    };
    members: Array<{
      id: string;
      role: "MEMBER" | "MODERATOR" | "ADMIN";
      status: "ONLINE" | "OFFLINE" | "STUDYING" | "BREAK";
      joinedAt: string;
      userId: string;
      roomId: string;
      user: {
        name: string | null;
        image: string | null;
      };
    }>;
  };
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  roomId: string;
  createdBy: string;
  room: {
    name: string;
  };
}

export interface StudyTimeByDay {
  startedAt: string;
  _sum: {
    duration: number | null;
  };
}

export interface SessionTypeDistribution {
  type: "POMODORO" | "CUSTOM" | "BREAK";
  _count: {
    type: number;
  };
}

export interface RoomActivity {
  roomId: string;
  _count: {
    roomId: number;
  };
}

export interface TrendData {
  change: string;
  trend: "up" | "down" | "neutral";
  changeCount: number;
}

export interface DashboardTrends {
  studyTime: TrendData;
  sessions: TrendData;
  rooms: TrendData;
  createdRooms: TrendData;
  privateRooms: TrendData;
}

export interface StudyStreak {
  current: number;
  max: number;
  days: number;
}

export interface UserDashboardData {
  stats: UserDashboardStats;
  trends: DashboardTrends;
  streak: StudyStreak;
  recentSessions: StudySession[];
  recentRooms: RoomMember[];
  recentNotes: Note[];
  studyTimeByDay: StudyTimeByDay[];
  sessionTypes: SessionTypeDistribution[];
  roomActivity: RoomActivity[];
}
