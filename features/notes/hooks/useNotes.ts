import { useCallback } from "react";
import { useApiQuery, useApiMutation, useCacheUtils } from "@/lib/api/hooks";
import { queryKeys } from "@/lib/query/keys";
import { NotesService } from "../services/notes.service";
import { Note, CreateNoteRequest, UpdateNoteRequest } from "../types";
import { useAuth } from "@/lib/hooks/useAuth";

export function useNotes(
  roomId: string,
  room?: {
    id: string;
    name: string;
    isPublic: boolean;
    creatorId: string;
    members: Array<{
      userId: string;
      user: {
        id: string;
        name: string;
        email: string;
      };
    }>;
  },
) {
  const { invalidate } = useCacheUtils();
  const { user: currentUser } = useAuth();

  // Get all notes for the room
  const {
    data: notes = [],
    isLoading,
    error,
  } = useApiQuery({
    queryKey: queryKeys.roomNotes(roomId),
    queryFn: () => NotesService.getNotesByRoomId(roomId),
  });

  // Create note mutation
  const createMutation = useApiMutation({
    mutationFn: (data: CreateNoteRequest) => NotesService.createNote(data),
    options: {
      onSuccess: () => {
        console.log("Note created, invalidating cache");
        invalidate(queryKeys.roomNotes(roomId));
      },
    },
  });

  // Update note mutation
  const updateMutation = useApiMutation({
    mutationFn: ({
      noteId,
      data,
    }: {
      noteId: string;
      data: UpdateNoteRequest;
    }) => NotesService.updateNote(roomId, noteId, data),
    options: {
      onSuccess: (updatedNote, { noteId }) => {
        console.log("Note updated, invalidating cache");
        // Invalidate both the room notes list and the individual note
        invalidate(queryKeys.roomNotes(roomId));
        invalidate(queryKeys.roomNote(roomId, noteId));
      },
    },
  });

  // Delete note mutation
  const deleteMutation = useApiMutation({
    mutationFn: (noteId: string) => NotesService.deleteNote(roomId, noteId),
    options: {
      onSuccess: () => {
        console.log("Note deleted, invalidating cache");
        invalidate(queryKeys.roomNotes(roomId));
      },
    },
  });

  // Export mutations
  const exportMarkdownMutation = useApiMutation({
    mutationFn: (noteId: string) =>
      NotesService.exportAsMarkdown(roomId, noteId),
  });

  const exportPDFMutation = useApiMutation({
    mutationFn: (noteId: string) => NotesService.exportAsPDF(roomId, noteId),
  });

  // Create note function
  const createNote = useCallback(
    (
      title: string,
      content: string,
      onSuccess?: (createdNote: Note) => void,
    ) => {
      console.log("Creating note:", { roomId, title, content });
      const data: CreateNoteRequest = { roomId, title, content };
      createMutation.mutate(data, {
        onSuccess: (createdNote) => {
          onSuccess?.(createdNote);
        },
      });
    },
    [roomId, createMutation],
  );

  // Update note function
  const updateNote = useCallback(
    (noteId: string, title: string, content: string) => {
      const data: UpdateNoteRequest = { title, content, roomId };
      updateMutation.mutate({ noteId, data });
    },
    [updateMutation, roomId],
  );

  // Delete note function
  const deleteNote = useCallback(
    async (noteId: string) => {
      return await deleteMutation.mutateAsync(noteId);
    },
    [deleteMutation],
  );

  // Export functions
  const exportAsMarkdown = useCallback(
    (noteId: string) => {
      exportMarkdownMutation.mutate(noteId);
    },
    [exportMarkdownMutation],
  );

  const exportAsPDF = useCallback(
    (noteId: string) => {
      exportPDFMutation.mutate(noteId);
    },
    [exportPDFMutation],
  );

  // Get permissions for a specific note
  const getPermissions = useCallback(
    (note?: Note) => {
      if (!room || !currentUser) {
        return {
          canEdit: false,
          canDelete: false,
          canExport: true,
          canRead: true,
        };
      }

      // Note creator can always edit and delete
      const isCreator = note?.createdBy === currentUser.id;

      // Room owner can edit and delete any note
      const isRoomOwner = room.creatorId === currentUser.id;

      // Admins and moderators can edit and delete
      const isAdminOrModerator =
        currentUser.role === "ADMIN" || currentUser.role === "MODERATOR";

      // In public rooms, everyone can edit
      const canEditInPublic = room.isPublic;

      // In private rooms, only members can edit
      const canEditInPrivate = room.members?.some(
        (member) => member.userId === currentUser.id,
      );

      const canEdit =
        isCreator ||
        isRoomOwner ||
        isAdminOrModerator ||
        (room.isPublic ? canEditInPublic : canEditInPrivate);
      const canDelete = isCreator || isRoomOwner || isAdminOrModerator;

      return {
        canEdit,
        canDelete,
        canExport: true,
        canRead: true,
      };
    },
    [room, currentUser],
  );

  return {
    notes,
    isLoading,
    error,
    createNote,
    updateNote,
    deleteNote,
    exportAsMarkdown,
    exportAsPDF,
    getPermissions,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isExportingMarkdown: exportMarkdownMutation.isPending,
    isExportingPDF: exportPDFMutation.isPending,
  };
}
