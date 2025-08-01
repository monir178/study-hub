"use client";

import React from "react";
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
          <AlertDialogTitle>Delete Note</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{state.noteTitle}"? This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={state.isDeleting}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onDelete}
            disabled={state.isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {state.isDeleting ? (
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
  );
}
