"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";
import { NotesEmptyStateProps } from "../types";

export function NotesEmptyState({
  searchQuery,
  permissions,
  onCreateNote,
  room,
}: NotesEmptyStateProps) {
  const t = useTranslations("notes");

  return (
    <div
      className="flex flex-col items-center justify-center h-full text-center"
      data-testid="notes-empty-state-root"
    >
      <FileText className="w-12 h-12 text-muted-foreground mb-4" />
      <h3 className="font-medium mb-2">
        {searchQuery ? t("noNotesFound") : t("noNotesYet")}
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        {searchQuery
          ? t("tryAdjustingSearch")
          : permissions.canEdit
            ? t("createFirstNote")
            : t("noNotesAvailable")}
      </p>
      {permissions.canEdit && !searchQuery ? (
        <Button
          onClick={onCreateNote}
          className="flex items-center gap-2"
          data-testid="notes-empty-create"
        >
          <Plus className="w-4 h-4" />
          {t("createNote")}
        </Button>
      ) : (
        <p className="text-xs text-muted-foreground">
          {room?.isPublic ? t("needLoginToCreate") : t("onlyMembersCanCreate")}
        </p>
      )}
    </div>
  );
}
