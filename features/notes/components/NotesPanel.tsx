"use client";

import React, { useState, useCallback, useEffect } from "react";
import { SlateEditor } from "./SlateEditor";
import { NotesPanelProps } from "../types";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Download,
  Save,
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
import { NotesTitleEditor } from "./NotesTitleEditor";
import { formatLastSaved } from "../utils";

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
  const [lastSavedText, setLastSavedText] = useState<string | null>(null);

  // Update title when note changes
  useEffect(() => {
    if (note?.title) {
      setTitleValue(note.title);
    }
  }, [note?.title]);

  // Update last saved text when note changes
  useEffect(() => {
    const updateLastSaved = async () => {
      const text = await formatLastSaved(note?.updatedAt);
      setLastSavedText(text);
    };
    updateLastSaved();
  }, [note?.updatedAt]);

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
        <NotesTitleEditor
          title={titleValue}
          isEditing={isEditingTitle}
          onTitleChange={setTitleValue}
          onStartEdit={() => setIsEditingTitle(true)}
          onSave={handleTitleSave}
          onCancel={handleTitleCancel}
          permissions={permissions}
        />

        <div className="text-sm text-muted-foreground">{lastSavedText}</div>
      </div>

      {/* Editor */}
      <div className="flex-1 min-h-0 px-4 pb-4">
        <div className="h-full">
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
    </div>
  );
}
