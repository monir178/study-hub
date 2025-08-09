"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Lock } from "lucide-react";

const joinRoomSchemaFactory = (t: (key: string) => string) =>
  z.object({
    password: z.string().min(1, t("validation.passwordRequired")),
  });

interface JoinRoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJoin: (password: string) => void;
  roomName: string;
  isLoading?: boolean;
}

export function JoinRoomDialog({
  open,
  onOpenChange,
  onJoin,
  roomName,
  isLoading = false,
}: JoinRoomDialogProps) {
  const t = useTranslations("rooms.joinRoomDialog");

  const joinRoomSchema = useMemo(() => joinRoomSchemaFactory(t), [t]);
  type JoinRoomFormData = z.infer<typeof joinRoomSchema>;

  const form = useForm<JoinRoomFormData>({
    resolver: zodResolver(joinRoomSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = (data: JoinRoomFormData) => {
    onJoin(data.password);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isLoading) {
      onOpenChange(newOpen);
      if (!newOpen) {
        form.reset();
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-orange-600" />
            {t("title")}
          </DialogTitle>
          <DialogDescription>
            "{roomName}" {t("description")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("passwordLabel")}</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={t("passwordPlaceholder")}
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isLoading}
                className="flex-1"
              >
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? t("joining") : t("joinButton")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
