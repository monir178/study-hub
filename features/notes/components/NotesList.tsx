"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NotesPanel } from "./NotesPanel";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  FileText,
  Plus,
  ChevronRight,
  Users,
  Lock,
  Trash2,
  Search,
  User,
} from "lucide-react";
import { Note } from "../types";

// Utility function to extract plain text from Slate.js content
const extractTextFromSlateContent = (content: string): string => {
  try {
    const parsed = JSON.parse(content);

    const extractText = (nodes: unknown[]): string => {
      return nodes
        .map((node) => {
          const nodeObj = node as { text?: string; children?: unknown[] };
          if (nodeObj.text !== undefined) {
            return nodeObj.text;
          }
          if (nodeObj.children && Array.isArray(nodeObj.children)) {
            return extractText(nodeObj.children);
          }
          return "";
        })
        .join("");
    };

    if (Array.isArray(parsed)) {
      return extractText(parsed);
    }

    return content; // Fallback to original content if parsing fails
  } catch {
    // If it's not valid JSON, assume it's plain text
    return content;
  }
};

interface NotesListProps {
  notes: Note[];
  isLoading: boolean;
  onNoteSelect: (note: Note) => void;
  onCreateNote: () => void;
  onDeleteNote?: (noteId: string) => void;
  permissions: {
    canEdit: boolean;
    canExport: boolean;
    canRead: boolean;
  };
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
  };
  isDeleting?: boolean;
  onDeleteSuccess?: () => void;
  onBackToList?: () => void;
  showBackButton?: boolean;
  selectedNote?: Note | null;
  isMinimized?: boolean;
  onSave?: (content: string, title: string) => void;
  onExportMarkdown?: () => void;
  onExportPDF?: () => void;
  isSaving?: boolean;
}

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
  const [deleteDialogState, setDeleteDialogState] = useState<{
    isOpen: boolean;
    isDeleting: boolean;
    noteId: string | null;
    noteTitle: string;
  }>({
    isOpen: false,
    isDeleting: false,
    noteId: null,
    noteTitle: "",
  });

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

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .replace(",", "")
      .replace(" at ", " at ");
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
      <div className="h-full flex flex-col">
        <div className="flex-shrink-0 p-6 pb-4 border-b">
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="flex-1 p-6">
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
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 p-6 pb-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {showBackButton && onBackToList && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBackToList}
                className="h-8 px-2 text-xs"
              >
                <ChevronRight className="w-3 h-3 mr-1 rotate-180" />
                Back
              </Button>
            )}
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Notes ({filteredNotes.length})
            </h2>
          </div>
          {permissions.canEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={onCreateNote}
              className="flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              New Note
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Search Input - Fixed at top */}
        <div className="p-6 pb-4 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Scrollable Content Area */}
        <ScrollArea className="flex-1 px-6 pb-6 overflow-hidden">
          {filteredNotes.length > 0 ? (
            <div className="space-y-3">
              {filteredNotes.map((note) => (
                <Card
                  key={note.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors relative"
                  onClick={() => onNoteSelect(note)}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col">
                      {/* Main content */}
                      <div className="flex-1">
                        <h3 className="font-medium text-sm mb-1">
                          {note.title}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {(() => {
                            const plainText = extractTextFromSlateContent(
                              note.content,
                            );
                            return plainText.length > 100
                              ? `${plainText.substring(0, 100)}...`
                              : plainText || "No content";
                          })()}
                        </p>
                      </div>

                      {/* Top-right arrow icon */}
                      <div className="absolute top-3 right-3">
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>

                      {/* Bottom section with metadata and actions */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            <Users className="w-3 h-3 mr-1" />
                            Shared
                          </Badge>
                          {!permissions.canEdit && (
                            <Badge variant="secondary" className="text-xs">
                              <Lock className="w-3 h-3 mr-1" />
                              Read Only
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {formatDate(note.updatedAt)}
                          </span>
                          {note.creator && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <User className="w-3 h-3" />
                              <span>{note.creator.name}</span>
                            </div>
                          )}
                        </div>

                        {/* Bottom-right delete button */}
                        <div className="flex items-center">
                          {onDeleteNote && permissions.canEdit && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteDialogState({
                                  isOpen: true,
                                  isDeleting: false,
                                  noteId: note.id,
                                  noteTitle: note.title,
                                });
                              }}
                              disabled={isDeleting}
                              className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                            >
                              {isDeleting ? (
                                <div className="w-3 h-3 border-2 border-destructive border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Trash2 className="w-3 h-3" />
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <FileText className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="font-medium mb-2">
                {searchQuery ? "No notes found" : "No notes yet"}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery
                  ? "Try adjusting your search terms"
                  : permissions.canEdit
                    ? "Create the first note for this room"
                    : "No notes available in this room"}
              </p>
              {permissions.canEdit && !searchQuery ? (
                <Button
                  onClick={onCreateNote}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create Note
                </Button>
              ) : (
                <p className="text-xs text-muted-foreground">
                  {room?.isPublic
                    ? "You need to be logged in to create notes"
                    : "Only room members can create notes in private rooms"}
                </p>
              )}
            </div>
          )}
        </ScrollArea>

        {/* Delete Note Dialog */}
        <AlertDialog
          open={deleteDialogState.isOpen}
          onOpenChange={(open) => {
            if (!deleteDialogState.isDeleting) {
              setDeleteDialogState((prev) => ({ ...prev, isOpen: open }));
            }
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Note</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{deleteDialogState.noteTitle}"?
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleteDialogState.isDeleting}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteNote}
                disabled={deleteDialogState.isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleteDialogState.isDeleting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Deleting...
                  </div>
                ) : (
                  "Delete"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
