import { apiClient } from "@/lib/api/client";
import { UserNote } from "../types";

export interface UserNotesResponse {
  notes: UserNote[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export class UserNotesService {
  // Get all notes for the logged-in user from public study rooms
  static async getUserNotes(
    page: number = 1,
    limit: number = 10,
  ): Promise<UserNotesResponse> {
    const response = await apiClient.get<UserNotesResponse>(
      `/users/notes?page=${page}&limit=${limit}`,
    );
    return response;
  }
}
