import { apiClient } from "@/lib/api/client";
import { User, CreateUserData, UpdateUserData } from "../types";

export class UserService {
  private static readonly BASE_PATH = "/users";

  // Get all users (admin only)
  static async getUsers(): Promise<User[]> {
    return apiClient.get<User[]>(this.BASE_PATH);
  }

  // Get user by ID
  static async getUserById(id: string): Promise<User> {
    return apiClient.get<User>(`${this.BASE_PATH}/${id}`);
  }

  // Get current user profile
  static async getProfile(): Promise<User> {
    return apiClient.get<User>(`${this.BASE_PATH}/profile`);
  }

  // Create new user
  static async createUser(userData: CreateUserData): Promise<User> {
    return apiClient.post<User>(this.BASE_PATH, userData);
  }

  // Update user
  static async updateUser(id: string, userData: UpdateUserData): Promise<User> {
    return apiClient.put<User>(`${this.BASE_PATH}/${id}`, userData);
  }

  // Update current user profile
  static async updateProfile(userData: Partial<UpdateUserData>): Promise<User> {
    return apiClient.patch<User>(`${this.BASE_PATH}/profile`, userData);
  }

  // Delete user
  static async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`${this.BASE_PATH}/${id}`);
  }
}
