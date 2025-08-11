"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, Key, Hash } from "lucide-react";
import { useJoinRoom } from "../hooks/useRooms";

interface JoinPrivateRoomDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function JoinPrivateRoomDialog({
  isOpen,
  onOpenChange,
}: JoinPrivateRoomDialogProps) {
  const t = useTranslations("rooms.joinPrivate");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const [roomId, setRoomId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const joinRoom = useJoinRoom();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!roomId.trim()) {
      setError("Room ID is required");
      return;
    }

    try {
      await joinRoom.mutateAsync({
        roomId: roomId.trim(),
        data: { password: password.trim() || undefined },
      });

      // Success - close dialog and navigate to room
      onOpenChange(false);
      setRoomId("");
      setPassword("");
      router.push(`/dashboard/rooms/${roomId.trim()}`);
    } catch (error) {
      // Handle specific error messages (prefer structured error first)
      const anyErr = error as { message?: string; error?: string };
      const apiMsg = anyErr?.message || anyErr?.error || "";
      const normalized = apiMsg.toLowerCase();
      if (normalized.includes("password is required")) {
        setError("Password is required");
      } else if (
        normalized.includes("invalid password") ||
        normalized.includes("password")
      ) {
        setError("Incorrect password");
      } else if (normalized.includes("not found")) {
        setError("Room not found");
      } else if (normalized.includes("full")) {
        setError("Room is full");
      } else {
        setError("Failed to join room. Please try again.");
      }
    }
  };

  const handleClose = () => {
    setRoomId("");
    setPassword("");
    setError("");
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            {t("title")}
          </DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="roomId" className="flex items-center gap-2">
              <Hash className="w-4 h-4" />
              {t("roomId")}
            </Label>
            <Input
              id="roomId"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder={t("roomIdPlaceholder")}
              className="font-mono"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2">
              <Key className="w-4 h-4" />
              {t("password")}
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("passwordPlaceholder")}
            />
            <p className="text-xs text-muted-foreground">
              {t("passwordOptional")}
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={joinRoom.isPending}
            >
              {tCommon("cancel")}
            </Button>
            <Button
              type="submit"
              disabled={joinRoom.isPending || !roomId.trim()}
            >
              {joinRoom.isPending ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t("joining")}
                </span>
              ) : (
                t("joinRoom")
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
