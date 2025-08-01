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
    >
      <CardContent className="p-4">
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
      </CardContent>
    </Card>
  );
}
