"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Users, Lock, Trash2, User } from "lucide-react";
import { NoteCardProps } from "../types";
import { formatDate, getNotePreview } from "../utils";

export function NoteCard({
  note,
  onSelect,
  permissions,
  isDeleting,
  onDeleteClick,
}: NoteCardProps) {
  return (
    <Card
      className="cursor-pointer hover:bg-muted/50 transition-colors relative"
      onClick={() => onSelect(note)}
      data-testid="note-card"
    >
      <CardContent className="p-3 sm:p-4">
        <div className="flex flex-col">
          {/* Main content */}
          <div className="flex-1">
            <h3 className="font-medium text-sm mb-1">{note.title}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {getNotePreview(note.content)}
            </p>
          </div>

          {/* Top-right arrow icon */}
          <div className="absolute top-3 right-3">
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1 flex-wrap">
                <Badge variant="outline" className="text-xs">
                  <Users className="w-3 h-3 mr-1" />
                  <span>Shared</span>
                </Badge>
                {!permissions.canEdit && (
                  <Badge variant="secondary" className="text-xs">
                    <Lock className="w-3 h-3 mr-1" />
                    <span className="hidden sm:inline">Read Only</span>
                    <span className="sm:hidden">RO</span>
                  </Badge>
                )}
              </div>
              {note.creator && (
                <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                  <User className="w-3 h-3" />
                  <span className="truncate max-w-20 sm:max-w-none text-xs">
                    {note.creator.name}
                  </span>
                </div>
              )}
            </div>

            {/* Second row: Date and creator */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="truncate">{formatDate(note.updatedAt)}</span>
              {/* Delete button */}
              <div className="flex items-center flex-shrink-0">
                {permissions.canEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteClick(note.id, note.title);
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
        </div>
      </CardContent>
    </Card>
  );
}
