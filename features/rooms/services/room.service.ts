import { apiClient } from "@/lib/api/client";
import { Room, CreateRoomData, UpdateRoomData } from "../types";

export class RoomService {
  private static readonly BASE_PATH = "/rooms";

  // Get all rooms (admin view)
  static async getRooms(): Promise<Room[]> {
    return apiClient.get<Room[]>(this.BASE_PATH);
  }

  // Get room by ID
  static async getRoomById(id: string): Promise<Room> {
    return apiClient.get<Room>(`${this.BASE_PATH}/${id}`);
  }

  // Get current user's rooms
  static async getMyRooms(): Promise<Room[]> {
    return apiClient.get<Room[]>(`${this.BASE_PATH}/my`);
  }

  // Get public rooms
  static async getPublicRooms(): Promise<Room[]> {
    return apiClient.get<Room[]>(`${this.BASE_PATH}/public`);
  }

  // Create new room
  static async createRoom(data: CreateRoomData): Promise<Room> {
    return apiClient.post<Room>(this.BASE_PATH, data);
  }

  // Update room
  static async updateRoom(id: string, data: UpdateRoomData): Promise<Room> {
    return apiClient.put<Room>(`${this.BASE_PATH}/${id}`, data);
  }

  // Delete room
  static async deleteRoom(id: string): Promise<void> {
    await apiClient.delete(`${this.BASE_PATH}/${id}`);
  }

  // Join room
  static async joinRoom(id: string): Promise<void> {
    await apiClient.post(`${this.BASE_PATH}/${id}/join`);
  }

  // Leave room
  static async leaveRoom(id: string): Promise<void> {
    await apiClient.post(`${this.BASE_PATH}/${id}/leave`);
  }
}
