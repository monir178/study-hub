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
import { LogOut } from "lucide-react";

interface SignOutDialogState {
  isOpen: boolean;
  isSigningOut: boolean;
}

interface SignOutDialogProps {
  state: SignOutDialogState;
  onOpenChange: (open: boolean) => void;
  onSignOut: () => void;
  translationNamespace?: string;
}

export function SignOutDialog({
  state,
  onOpenChange,
  onSignOut,
  translationNamespace = "navbar",
}: SignOutDialogProps) {
  const t = useTranslations(translationNamespace);

  return (
    <AlertDialog
      open={state.isOpen}
      onOpenChange={(open) => {
        if (!state.isSigningOut) {
          onOpenChange(open);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <LogOut className="h-5 w-5" />
            {t("signOutConfirmTitle")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("signOutConfirmDescription")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={state.isSigningOut}>
            {t("cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onSignOut}
            disabled={state.isSigningOut}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {state.isSigningOut ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                {t("signingOut")}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                {t("signOut")}
              </div>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
