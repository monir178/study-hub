export interface Room {
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  maxParticipants: number;
  currentParticipants: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  participants?: Array<{
    id: string;
    name: string;
    role: "OWNER" | "MODERATOR" | "PARTICIPANT";
  }>;
}

export interface CreateRoomData {
  name: string;
  description?: string;
  isPublic: boolean;
  maxParticipants: number;
  tags?: string[];
}

export interface UpdateRoomData {
  name?: string;
  description?: string;
  isPublic?: boolean;
  maxParticipants?: number;
  tags?: string[];
}
