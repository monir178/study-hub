import { apiClient } from "@/lib/api/client";
import {
  User,
  CreateUserData,
  UpdateUserData,
  PaginatedUsersResponse,
} from "../types";

export class UserService {
  private static readonly BASE_PATH = "/users";

  // Get all users (admin only) - with pagination
  static async getUsers(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<PaginatedUsersResponse> {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("pageSize", pageSize.toString());

    return apiClient.get<PaginatedUsersResponse>(
      `${this.BASE_PATH}?${params.toString()}`,
    );
  }

  // Search users (admin/moderator only) - with pagination
  static async searchUsers(
    query: string,
    role?: string,
    page: number = 1,
    pageSize: number = 10,
  ): Promise<PaginatedUsersResponse> {
    const params = new URLSearchParams();
    if (query) params.append("q", query);
    if (role && role !== "all") params.append("role", role);
    params.append("page", page.toString());
    params.append("pageSize", pageSize.toString());

    return apiClient.get<PaginatedUsersResponse>(
      `${this.BASE_PATH}/search?${params.toString()}`,
    );
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
    // When updating profile image via upload, mark it as UPLOAD source
    const updateData = { ...userData };
    if (
      updateData.image &&
      !updateData.image.includes("googleusercontent.com") &&
      !updateData.image.includes("githubusercontent.com")
    ) {
      (updateData as { imageSource?: string }).imageSource = "UPLOAD";
    }
    return apiClient.patch<User>(`${this.BASE_PATH}/profile`, updateData);
  }

  // Upload profile picture
  static async uploadProfilePicture(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload/profile", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to upload image");
    }

    const result = await response.json();
    return { url: result.data.url };
  }

  // Delete user
  static async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`${this.BASE_PATH}/${id}`);
  }
}
