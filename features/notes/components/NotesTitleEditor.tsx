"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, Check, X } from "lucide-react";
import { NotesTitleEditorProps } from "../types";

export function NotesTitleEditor({
  title,
  isEditing,
  onTitleChange,
  onStartEdit,
  onSave,
  onCancel,
  permissions,
}: NotesTitleEditorProps) {
  if (isEditing) {
    return (
      <div className="flex items-center gap-2 flex-1">
        <Input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSave();
            } else if (e.key === "Escape") {
              onCancel();
            }
          }}
          className="text-lg font-semibold "
          autoFocus
        />
        <Button size="sm" variant="ghost" onClick={onSave}>
          <Check className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="ghost" onClick={onCancel}>
          <X className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 flex-1 ">
      <h1
        className="text-lg font-semibold cursor-pointer  transition-colors underline"
        onClick={() => permissions.canEdit && onStartEdit()}
      >
        {title}
      </h1>
      {permissions.canEdit && (
        <Button
          size="sm"
          variant="ghost"
          onClick={onStartEdit}
          className="p-1 h-auto"
        >
          <Edit2 className="w-3 h-3" />
        </Button>
      )}
    </div>
  );
}
