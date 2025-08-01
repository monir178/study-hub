import { apiClient } from "@/lib/api/client";
import {
  Note,
  CreateNoteRequest,
  UpdateNoteRequest,
  NotesList,
} from "../types";

export class NotesService {
  // Get all notes for a room
  static async getNotesByRoomId(roomId: string): Promise<NotesList> {
    const response = await apiClient.get<NotesList>(`/rooms/${roomId}/notes`);
    return response;
  }

  // Get a specific note by ID
  static async getNoteById(roomId: string, noteId: string): Promise<Note> {
    const response = await apiClient.get<Note>(
      `/rooms/${roomId}/notes/${noteId}`,
    );
    return response;
  }

  // Create a new note
  static async createNote(data: CreateNoteRequest): Promise<Note> {
    return apiClient.post<Note>(`/rooms/${data.roomId}/notes`, data);
  }

  // Update an existing note
  static async updateNote(
    roomId: string,
    noteId: string,
    data: UpdateNoteRequest,
  ): Promise<Note> {
    return apiClient.patch<Note>(`/rooms/${roomId}/notes/${noteId}`, data);
  }

  // Delete a note
  static async deleteNote(roomId: string, noteId: string): Promise<void> {
    return apiClient.delete(`/rooms/${roomId}/notes/${noteId}`);
  }

  // Export note as markdown
  static async exportAsMarkdown(roomId: string, noteId: string): Promise<void> {
    const response = await fetch(
      `/api/rooms/${roomId}/notes/${noteId}/export?format=markdown`,
    );
    if (!response.ok) {
      throw new Error("Failed to export as markdown");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;

    // Try to get filename from Content-Disposition header
    const contentDisposition = response.headers.get("Content-Disposition");
    let filename = "note.md";
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }

    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  // Export note as PDF
  static async exportAsPDF(roomId: string, noteId: string): Promise<void> {
    const response = await fetch(
      `/api/rooms/${roomId}/notes/${noteId}/export?format=pdf`,
    );
    if (!response.ok) {
      throw new Error("Failed to export as PDF");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;

    // Try to get filename from Content-Disposition header
    const contentDisposition = response.headers.get("Content-Disposition");
    let filename = "note.pdf";
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }

    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}
