"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FileText, Plus, ChevronRight } from "lucide-react";
import { NotesHeaderProps } from "../types";

export function NotesHeader({
  notesCount,
  showBackButton,
  onBackToList,
  onCreateNote,
  permissions,
}: NotesHeaderProps) {
  const t = useTranslations("notes");

  return (
    <div className="flex-shrink-0 p-6 pb-4 border-b" data-testid="notes-header">
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
              {t("back")}
            </Button>
          )}
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {t("title")} ({notesCount})
          </h2>
        </div>
        {permissions.canEdit && onCreateNote && (
          <Button
            size="sm"
            onClick={onCreateNote}
            className="flex items-center gap-1"
            data-testid="notes-new-btn"
          >
            <Plus className="w-4 h-4" />
            {t("newNote")}
          </Button>
        )}
      </div>
    </div>
  );
}
