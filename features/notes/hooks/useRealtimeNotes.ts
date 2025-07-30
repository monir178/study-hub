import { useEffect } from "react";
import { pusherClient } from "@/lib/pusher";
import { useCacheUtils } from "@/lib/api/hooks/use-cache-utils";
import { Note } from "../types";

export function useRealtimeNotes(roomId: string) {
  const cacheUtils = useCacheUtils();

  useEffect(() => {
    if (!roomId) return;

    const channel = pusherClient.subscribe(`room-${roomId}-notes`);

    // Handle note creation
    channel.bind(
      "note-created",
      (data: { note: Note; userId: string; userName: string }) => {
        cacheUtils.appendToList(["notes", roomId], data.note);
      },
    );

    // Handle note updates
    channel.bind(
      "note-updated",
      (data: { note: Note; userId: string; userName: string }) => {
        cacheUtils.updateInList(["notes", roomId], data.note.id, data.note);
      },
    );

    // Handle note deletion
    channel.bind(
      "note-deleted",
      (data: { noteId: string; userId: string; userName: string }) => {
        cacheUtils.removeFromList(["notes", roomId], data.noteId);
      },
    );

    // Handle note lock changes
    channel.bind(
      "note-lock-changed",
      (data: {
        noteId: string;
        isLocked: boolean;
        lockedBy: string | null;
        lockedByName: string | null;
        userId: string;
        userName: string;
      }) => {
        // Update the note with lock status
        const cachedNotes = cacheUtils.getCached<Note[]>(["notes", roomId]);
        if (cachedNotes) {
          const updatedNotes = cachedNotes.map((note) =>
            note.id === data.noteId
              ? { ...note, isLocked: data.isLocked, lockedBy: data.lockedBy }
              : note,
          );
          cacheUtils.update(["notes", roomId], updatedNotes);
        }
      },
    );

    return () => {
      pusherClient.unsubscribe(`room-${roomId}-notes`);
    };
  }, [roomId, cacheUtils]);
}
