"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNotes } from "@/features/notes/hooks/useNotes";
import { useRealtimeNotes } from "@/features/notes/hooks/useRealtimeNotes";
import { useAuth } from "@/lib/hooks/useAuth";
import { NotesSidebar } from "@/features/notes/components/NotesSidebar";
import { CollaborativeEditor } from "@/features/notes/components/CollaborativeEditor";

interface CollaborativeNotesProps {
  roomId: string;
}

export function CollaborativeNotes({ roomId }: CollaborativeNotesProps) {
  const { user } = useAuth();
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  const { notes, isLoading, createNote, deleteNote, lockNote } =
    useNotes(roomId);

  // Enable real-time updates for notes
  useRealtimeNotes(roomId);

  const selectedNote = notes.find((note) => note.id === selectedNoteId) || null;

  // Check if user can moderate (admin/moderator)
  const canModerate = user?.role === "ADMIN" || user?.role === "MODERATOR";

  const handleCreateNote = (title: string) => {
    createNote({
      title,
      content: JSON.stringify([
        {
          type: "paragraph",
          children: [{ text: "" }],
        },
      ]),
      roomId,
    });
  };

  const handleSelectNote = (noteId: string) => {
    setSelectedNoteId(noteId);
  };

  const handleDeleteNote = (noteId: string) => {
    deleteNote(noteId);
    if (selectedNoteId === noteId) {
      setSelectedNoteId(null);
    }
  };

  const handleToggleLock = (noteId: string, locked: boolean) => {
    lockNote({ noteId, lock: locked });
  };

  return (
    <div className="h-full">
      {/* Mobile Layout */}
      <div className="block lg:hidden h-full">
        {selectedNoteId ? (
          <div className="h-full flex flex-col">
            {/* Mobile Header with Back Button */}
            <div className="flex items-center gap-2 p-4 border-b bg-background">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedNoteId(null)}
                className="p-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <span className="font-medium truncate">
                {selectedNote?.title || "Note"}
              </span>
            </div>

            {/* Mobile Editor */}
            <div className="flex-1 min-h-0">
              <CollaborativeEditor
                note={selectedNote}
                roomId={roomId}
                canLock={canModerate}
                isLocked={selectedNote?.isLocked || false}
                onLock={(locked) => {
                  if (selectedNote) {
                    handleToggleLock(selectedNote.id, locked);
                  }
                }}
              />
            </div>
          </div>
        ) : (
          <NotesSidebar
            notes={notes}
            selectedNoteId={selectedNoteId}
            onSelectNote={handleSelectNote}
            onCreateNote={handleCreateNote}
            onDeleteNote={handleDeleteNote}
            onToggleLock={handleToggleLock}
            isLoading={isLoading}
            canModerate={canModerate}
          />
        )}
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:grid lg:grid-cols-3 gap-6 h-full">
        {/* Notes Sidebar */}
        <div className="lg:col-span-1">
          <NotesSidebar
            notes={notes}
            selectedNoteId={selectedNoteId}
            onSelectNote={handleSelectNote}
            onCreateNote={handleCreateNote}
            onDeleteNote={handleDeleteNote}
            onToggleLock={handleToggleLock}
            isLoading={isLoading}
            canModerate={canModerate}
          />
        </div>

        {/* Collaborative Editor */}
        <div className="lg:col-span-2">
          <CollaborativeEditor
            note={selectedNote}
            roomId={roomId}
            canLock={canModerate}
            isLocked={selectedNote?.isLocked || false}
            onLock={(locked) => {
              if (selectedNote) {
                handleToggleLock(selectedNote.id, locked);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
