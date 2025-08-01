"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";
import { NotesEmptyStateProps } from "../types";

export function NotesEmptyState({
  searchQuery,
  permissions,
  onCreateNote,
  room,
}: NotesEmptyStateProps) {
  return (
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
        <Button onClick={onCreateNote} className="flex items-center gap-2">
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
  );
}
