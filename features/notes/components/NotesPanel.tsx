"use client";

import React, { useState, useCallback, useEffect } from "react";
import { SlateEditor } from "./SlateEditor";
import { Note, NoteEditorState } from "../types";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Download,
  Save,
  Edit2,
  Check,
  X,
  Loader2,
  FileText,
  FileDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Input } from "@/components/ui/input";
import { formatDistanceToNow } from "date-fns";

interface NotesPanelProps {
  note?: Note;
  isLoading: boolean;
  editorState: NoteEditorState;
  permissions: {
    canEdit: boolean;
    canExport: boolean;
    canRead: boolean;
  };
  onSave: (content: string, title: string) => void;
  onExportMarkdown: () => void;
  onExportPDF: () => void;
  onBack: () => void;
  isSaving: boolean;
}

export function NotesPanel({
  note,
  isLoading,
  editorState,
  permissions,
  onSave,
  onExportMarkdown,
  onExportPDF,
  onBack,
  isSaving,
}: NotesPanelProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(note?.title || "Untitled Note");
  const [editorContent, setEditorContent] = useState("");

  // Update title when note changes
  useEffect(() => {
    if (note?.title) {
      setTitleValue(note.title);
    }
  }, [note?.title]);

  const handleTitleSave = useCallback(() => {
    // Just exit edit mode, don't save to database
    setIsEditingTitle(false);
  }, []);

  const handleTitleCancel = useCallback(() => {
    setTitleValue(note?.title || "Untitled Note");
    setIsEditingTitle(false);
  }, [note?.title]);

  const handleBackClick = useCallback(() => {
    onBack();
  }, [onBack]);

  const handleEditorChange = useCallback((content: string, _title: string) => {
    setEditorContent(content);
  }, []);

  const handleSave = useCallback(() => {
    onSave(editorContent, titleValue);
  }, [onSave, editorContent, titleValue]);

  const formatLastSaved = useCallback(() => {
    if (!note?.updatedAt) return null;

    try {
      const updatedAt = new Date(note.updatedAt);
      return `Saved ${formatDistanceToNow(updatedAt, { addSuffix: true })}`;
    } catch {
      return null;
    }
  }, [note?.updatedAt]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header Row 1: Back button, Download dropdown, Save button */}
      <div className="flex items-center justify-between p-4 border-b">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBackClick}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <div className="flex items-center gap-2">
          {permissions.canExport && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onExportPDF}>
                  <FileDown className="w-4 h-4 mr-2" />
                  Download as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onExportMarkdown}>
                  <FileText className="w-4 h-4 mr-2" />
                  Download as Markdown
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {permissions.canEdit && (
            <Button
              onClick={handleSave}
              disabled={isSaving}
              size="sm"
              className="flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Header Row 2: Note title and last saved info */}
      <div className="flex items-center justify-between p-4 pb-2">
        <div className="flex items-center gap-2 flex-1">
          {isEditingTitle ? (
            <div className="flex items-center gap-2 flex-1">
              <Input
                value={titleValue}
                onChange={(e) => setTitleValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleTitleSave();
                  } else if (e.key === "Escape") {
                    handleTitleCancel();
                  }
                }}
                className="text-lg font-semibold"
                autoFocus
              />
              <Button size="sm" variant="ghost" onClick={handleTitleSave}>
                <Check className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={handleTitleCancel}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 flex-1">
              <h1
                className="text-lg font-semibold cursor-pointer hover:text-blue-600 transition-colors"
                onClick={() => permissions.canEdit && setIsEditingTitle(true)}
              >
                {titleValue}
              </h1>
              {permissions.canEdit && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditingTitle(true)}
                  className="p-1 h-auto"
                >
                  <Edit2 className="w-3 h-3" />
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="text-sm text-muted-foreground">{formatLastSaved()}</div>
      </div>

      {/* Editor */}
      <div className="flex-1 px-4 pb-4">
        <SlateEditor
          note={note}
          isLoading={isLoading}
          editorState={editorState}
          permissions={permissions}
          onSave={onSave}
          onChange={handleEditorChange}
          hideHeader={true}
          isSaving={isSaving}
        />
      </div>
    </div>
  );
}
