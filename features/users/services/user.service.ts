import { apiClient } from "@/lib/api/client";
import { User, CreateUserData, UpdateUserData } from "../types";

export class UserService {
  private static readonly BASE_PATH = "/users";

  // Get all users (admin only)
  static async getUsers(): Promise<User[]> {
    return apiClient.get<User[]>(this.BASE_PATH);
  }

  // Search users (admin/moderator only)
  static async searchUsers(query: string, role?: string): Promise<User[]> {
    const params = new URLSearchParams();
    if (query) params.append("q", query);
    if (role && role !== "all") params.append("role", role);

    const queryString = params.toString();
    const url = queryString
      ? `${this.BASE_PATH}/search?${queryString}`
      : `${this.BASE_PATH}/search`;

    return apiClient.get<User[]>(url);
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
    return apiClient.patch<User>(`${this.BASE_PATH}/${id}`, userData);
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
