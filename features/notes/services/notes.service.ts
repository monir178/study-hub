import { apiClient } from "@/lib/api/client";
import {
  Note,
  CreateNoteRequest,
  UpdateNoteRequest,
  CollaborativeEdit,
  NoteUser,
} from "../types";

export class NotesService {
  private static readonly BASE_PATH = "/notes";

  // Get all notes for a room
  static async getNotes(roomId: string): Promise<Note[]> {
    return apiClient.get<Note[]>(`${this.BASE_PATH}?roomId=${roomId}`);
  }

  // Get a specific note
  static async getNote(noteId: string): Promise<Note> {
    return apiClient.get<Note>(`${this.BASE_PATH}/${noteId}`);
  }

  // Create a new note
  static async createNote(data: CreateNoteRequest): Promise<Note> {
    return apiClient.post<Note>(this.BASE_PATH, data);
  }

  // Update a note
  static async updateNote(data: UpdateNoteRequest): Promise<Note> {
    return apiClient.put<Note>(`${this.BASE_PATH}/${data.id}`, data);
  }

  // Delete a note
  static async deleteNote(noteId: string): Promise<void> {
    await apiClient.delete(`${this.BASE_PATH}/${noteId}`);
  }

  // Lock/unlock a note
  static async lockNote(noteId: string, lock: boolean): Promise<Note> {
    return apiClient.patch<Note>(`${this.BASE_PATH}/${noteId}/lock`, { lock });
  }

  // Export note
  static async exportNote(
    noteId: string,
    format: "markdown" | "pdf",
  ): Promise<Blob> {
    return apiClient.get<Blob>(
      `${this.BASE_PATH}/${noteId}/export?format=${format}`,
      {
        responseType: "blob",
      },
    );
  }

  // Real-time collaboration methods
  static async broadcastOperation(
    noteId: string,
    edit: CollaborativeEdit,
  ): Promise<void> {
    await apiClient.post(`${this.BASE_PATH}/${noteId}/operations`, edit);
  }

  static async broadcastCursor(
    noteId: string,
    data: { userId: string; selection: unknown },
  ): Promise<void> {
    await apiClient.post(`${this.BASE_PATH}/${noteId}/cursor`, data);
  }

  static async joinNote(noteId: string, user: NoteUser): Promise<void> {
    await apiClient.post(`${this.BASE_PATH}/${noteId}/join`, user);
  }

  static async leaveNote(noteId: string, userId: string): Promise<void> {
    await apiClient.post(`${this.BASE_PATH}/${noteId}/leave`, { userId });
  }
}
