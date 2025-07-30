import { useApiQuery } from "@/lib/api/hooks/use-api-query";
import { useApiMutation } from "@/lib/api/hooks/use-api-mutation";
import { useCacheUtils } from "@/lib/api/hooks/use-cache-utils";
import { CreateNoteRequest, UpdateNoteRequest } from "../types";
import { NotesService } from "../services/notes.service";

export function useNotes(roomId: string) {
  const cacheUtils = useCacheUtils();

  const query = useApiQuery({
    queryKey: ["notes", roomId],
    queryFn: () => NotesService.getNotes(roomId),
    options: {
      enabled: !!roomId,
      staleTime: 30000, // 30 seconds
    },
  });

  const createMutation = useApiMutation({
    mutationFn: (data: CreateNoteRequest) => NotesService.createNote(data),
    successMessage: "Note created successfully",
    options: {
      onSuccess: (newNote) => {
        cacheUtils.appendToList(["notes", roomId], newNote);
      },
    },
  });

  const updateMutation = useApiMutation({
    mutationFn: (data: UpdateNoteRequest) => NotesService.updateNote(data),
    options: {
      onSuccess: (updatedNote) => {
        cacheUtils.updateInList(["notes", roomId], updatedNote.id, updatedNote);
      },
    },
  });

  const deleteMutation = useApiMutation({
    mutationFn: (noteId: string) => NotesService.deleteNote(noteId),
    successMessage: "Note deleted successfully",
    options: {
      onSuccess: (_, noteId) => {
        cacheUtils.removeFromList(["notes", roomId], noteId);
      },
    },
  });

  const lockMutation = useApiMutation({
    mutationFn: ({ noteId, lock }: { noteId: string; lock: boolean }) =>
      NotesService.lockNote(noteId, lock),
    options: {
      onSuccess: (updatedNote) => {
        cacheUtils.updateInList(["notes", roomId], updatedNote.id, updatedNote);
      },
    },
  });

  return {
    notes: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    createNote: createMutation.mutate,
    updateNote: updateMutation.mutate,
    deleteNote: deleteMutation.mutate,
    lockNote: lockMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isLocking: lockMutation.isPending,
    refetch: query.refetch,
  };
}
