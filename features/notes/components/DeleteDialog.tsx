"use client";

import React from "react";
import { useTranslations } from "next-intl";
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
import { DeleteDialogState } from "../types";

interface DeleteDialogProps {
  state: DeleteDialogState;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
}

export function DeleteDialog({
  state,
  onOpenChange,
  onDelete,
}: DeleteDialogProps) {
  const t = useTranslations("notes");

  return (
    <AlertDialog
      open={state.isOpen}
      onOpenChange={(open) => {
        if (!state.isDeleting) {
          onOpenChange(open);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("deleteConfirmTitle")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("deleteConfirmDescription", { noteTitle: state.noteTitle })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={state.isDeleting}>
            {t("cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onDelete}
            disabled={state.isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {state.isDeleting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                {t("deleting")}
              </div>
            ) : (
              t("delete")
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
