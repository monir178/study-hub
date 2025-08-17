"use client";

import React, { useState, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NotesPanel } from "./NotesPanel";
import { NoteCard } from "./NoteCard";
import { NotesHeader } from "./NotesHeader";
import { NotesSearch } from "./NotesSearch";
import { NotesEmptyState } from "./NotesEmptyState";
import { DeleteDialog } from "./DeleteDialog";
import { NotesListProps, DeleteDialogState } from "../types";

export function NotesList({
  notes,
  isLoading,
  onNoteSelect,
  onCreateNote,
  onDeleteNote,
  permissions,
  room,
  isDeleting,
  onDeleteSuccess,
  onBackToList,
  showBackButton = false,
  selectedNote,
  isMinimized = false,
  onSave,
  onExportMarkdown,
  onExportPDF,
  isSaving = false,
}: NotesListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [hasUnsavedChanges] = useState(false);
  const [deleteDialogState, setDeleteDialogState] = useState<DeleteDialogState>(
    {
      isOpen: false,
      isDeleting: false,
      noteId: null,
      noteTitle: "",
    },
  );

  // Handle delete room function (like StudyRoomCard)
  const handleDeleteNote = async () => {
    if (!deleteDialogState.noteId || !onDeleteNote) return;

    setDeleteDialogState((prev) => ({
      ...prev,
      isDeleting: true,
    }));

    try {
      await onDeleteNote(deleteDialogState.noteId);
      // Close dialog after successful deletion
      setDeleteDialogState((prev) => ({
        ...prev,
        isOpen: false,
        isDeleting: false,
      }));
      onDeleteSuccess?.();
    } catch (error) {
      console.error("Failed to delete note:", error);
      // Reset deleting state on error
      setDeleteDialogState((prev) => ({
        ...prev,
        isDeleting: false,
      }));
    }
  };

  // Filter notes based on search query
  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notes;

    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [notes, searchQuery]);

  // If minimized and we have a selected note, show the editor
  if (isMinimized && selectedNote && onSave) {
    return (
      <div className="h-full">
        <NotesPanel
          note={selectedNote}
          isLoading={isLoading}
          editorState={{
            isEditing: false,
            isSaving: isSaving,
            hasUnsavedChanges: hasUnsavedChanges,
          }}
          permissions={permissions}
          onSave={onSave!}
          onExportMarkdown={onExportMarkdown!}
          onExportPDF={onExportPDF!}
          onBack={onBackToList!}
          isSaving={isSaving}
        />
      </div>
    );
  }

  // If minimized and creating a new note
  if (isMinimized && !selectedNote && onSave) {
    return (
      <div className="h-full">
        <NotesPanel
          note={undefined}
          isLoading={isLoading}
          editorState={{
            isEditing: false,
            isSaving: isSaving,
            hasUnsavedChanges: hasUnsavedChanges,
          }}
          permissions={permissions}
          onSave={onSave!}
          onExportMarkdown={onExportMarkdown!}
          onExportPDF={onExportPDF!}
          onBack={onBackToList!}
          isSaving={isSaving}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-full flex flex-col" data-testid="notes-list-loading">
        <div className="flex-shrink-0 p-4 sm:p-6 pb-4 border-b">
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="flex-1 p-4 sm:p-6">
          <div className="space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col" data-testid="notes-list">
      {/* Header */}
      <NotesHeader
        notesCount={filteredNotes.length}
        showBackButton={showBackButton}
        onBackToList={onBackToList}
        onCreateNote={onCreateNote}
        permissions={permissions}
      />

      {/* Content */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Search Input - Fixed at top */}
        <NotesSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Scrollable Content Area */}
        <ScrollArea className="flex-1 px-4 sm:px-6 pb-4 sm:pb-6 overflow-hidden">
          {filteredNotes.length > 0 ? (
            <div className="space-y-3" data-testid="notes-list-items">
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onSelect={onNoteSelect}
                  permissions={permissions}
                  isDeleting={isDeleting}
                  onDeleteClick={(noteId, noteTitle) => {
                    setDeleteDialogState({
                      isOpen: true,
                      isDeleting: false,
                      noteId,
                      noteTitle,
                    });
                  }}
                />
              ))}
            </div>
          ) : (
            <NotesEmptyState
              searchQuery={searchQuery}
              permissions={permissions}
              onCreateNote={onCreateNote}
              room={room}
              data-testid="notes-empty-state"
            />
          )}
        </ScrollArea>

        {/* Delete Note Dialog */}
        <DeleteDialog
          state={deleteDialogState}
          onOpenChange={(open) => {
            if (!deleteDialogState.isDeleting) {
              setDeleteDialogState((prev) => ({ ...prev, isOpen: open }));
            }
          }}
          onDelete={handleDeleteNote}
        />
      </div>
    </div>
  );
}
