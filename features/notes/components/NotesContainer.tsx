"use client";

import React, { useState } from "react";
import { useNotes } from "../hooks/useNotes";
import { NotesList } from "./NotesList";
import { Note, NotesContainerProps } from "../types";

export function NotesContainer({ roomId, room }: NotesContainerProps) {
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);

  const {
    notes,
    isLoading,
    createNote,
    updateNote,
    deleteNote,
    exportAsMarkdown,
    exportAsPDF,
    getPermissions,
    isCreating,
    isUpdating,
    isDeleting,
  } = useNotes(roomId, room);

  // Get the current selected note from the notes array (always fresh data)
  const selectedNote = selectedNoteId
    ? notes.find((note) => note.id === selectedNoteId) || null
    : null;

  const handleNoteSelect = (note: Note) => {
    console.log("NotesContainer: selected note", note);
    setSelectedNoteId(note.id);
    setIsMinimized(true);
  };

  const handleCreateNote = () => {
    setSelectedNoteId(null);
    setIsMinimized(true);
  };

  const handleBackToList = () => {
    setSelectedNoteId(null);
    setIsMinimized(false);
  };

  const handleSave = (content: string, title: string) => {
    if (selectedNote) {
      updateNote(selectedNote.id, title, content);
    } else {
      createNote(title, content, (createdNote) => {
        // Set the selectedNoteId to the newly created note so subsequent saves update it
        setSelectedNoteId(createdNote.id);
      });
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await deleteNote(noteId);
      if (selectedNote?.id === noteId) {
        setSelectedNoteId(null);
        setIsMinimized(false);
      }
    } catch (error) {
      console.error("Failed to delete note:", error);
      throw error; // Re-throw to let the dialog handler know about the error
    }
  };

  const handleExportMarkdown = () => {
    if (selectedNote) {
      exportAsMarkdown(selectedNote.id);
    }
  };

  const handleExportPDF = () => {
    if (selectedNote) {
      exportAsPDF(selectedNote.id);
    }
  };

  return (
    <NotesList
      notes={notes}
      isLoading={isLoading}
      onNoteSelect={handleNoteSelect}
      onCreateNote={handleCreateNote}
      onDeleteNote={handleDeleteNote}
      permissions={getPermissions()}
      room={room}
      isDeleting={isDeleting}
      onDeleteSuccess={() => {
        // Handle any cleanup after successful deletion
        console.log("Note deleted successfully");
      }}
      onBackToList={handleBackToList}
      showBackButton={isMinimized}
      selectedNote={selectedNote}
      isMinimized={isMinimized}
      onSave={handleSave}
      onExportMarkdown={handleExportMarkdown}
      onExportPDF={handleExportPDF}
      isSaving={isUpdating || isCreating}
    />
  );
}
