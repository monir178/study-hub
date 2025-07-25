export interface User {
  id: string;
  name?: string;
  email: string;
  emailVerified?: Date;
  image?: string;
  password?: string;
  role: "USER" | "MODERATOR" | "ADMIN";
  locale: string;
  theme: "LIGHT" | "DARK" | "SYSTEM";
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  name?: string;
  email: string;
  image?: string;
  role: "USER" | "MODERATOR" | "ADMIN";
  locale: string;
  theme: "LIGHT" | "DARK" | "SYSTEM";
}

export interface UpdateUserData {
  name?: string;
  image?: string;
  locale?: string;
  theme?: "LIGHT" | "DARK" | "SYSTEM";
}

export interface UserStats {
  totalStudyTime: number;
  totalSessions: number;
  currentStreak: number;
  longestStreak: number;
  joinedRooms: number;
  createdRooms: number;
}
