"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Slider } from "@/components/ui/slider";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Globe, Lock, Users, Plus } from "lucide-react";
import { useCreateRoom } from "../hooks/useRooms";

// Zod schema factory for form validation with translations
const createRoomSchemaFactory = (t: (key: string) => string) =>
  z
    .object({
      name: z
        .string()
        .min(1, t("validation.nameRequired"))
        .min(3, t("validation.nameMinLength"))
        .max(50, t("validation.nameMaxLength")),
      description: z
        .string()
        .max(200, t("validation.descriptionMaxLength"))
        .optional()
        .or(z.literal("")),
      isPublic: z.boolean(),
      maxMembers: z
        .number()
        .min(2, t("validation.maxMembersMin"))
        .max(50, t("validation.maxMembersMax")),
      password: z.string().optional().or(z.literal("")),
    })
    .refine(
      (data) => {
        // If room is private, password is required
        if (!data.isPublic && (!data.password || data.password.trim() === "")) {
          return false;
        }
        if (!data.isPublic && data.password && data.password.length < 6) {
          return false;
        }
        return true;
      },
      {
        message: t("validation.passwordMinLength"),
        path: ["password"],
      },
    );

interface CreateRoomFormProps {
  onSuccess?: (roomId: string) => void;
  onCancel?: () => void;
}

export function CreateRoomForm({ onSuccess, onCancel }: CreateRoomFormProps) {
  const t = useTranslations("rooms.createRoomForm");
  const createRoom = useCreateRoom();

  const createRoomSchema = useMemo(() => createRoomSchemaFactory(t), [t]);

  type CreateRoomFormData = z.infer<typeof createRoomSchema>;

  const form = useForm<CreateRoomFormData>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      name: "",
      description: "",
      isPublic: true,
      maxMembers: 10,
      password: "",
    },
  });

  const onSubmit = async (data: CreateRoomFormData) => {
    try {
      const room = await createRoom.mutateAsync({
        ...data,
        password: data.isPublic ? undefined : data.password,
      });

      if (onSuccess) {
        onSuccess(room.id);
      }
    } catch {
      // Error is handled by the mutation hook
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          {t("title")}
        </CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Room Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("nameLabel")} *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("namePlaceholder")}
                      disabled={createRoom.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("descriptionLabel")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("descriptionPlaceholder")}
                      disabled={createRoom.isPending}
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Room Visibility */}
            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("publicLabel")}</FormLabel>
                  <FormControl>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {field.value ? (
                          <Globe className="w-5 h-5 text-green-600" />
                        ) : (
                          <Lock className="w-5 h-5 text-orange-600" />
                        )}
                        <div>
                          <p className="font-medium">
                            {field.value ? t("publicLabel") : t("privateLabel")}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {field.value
                              ? t("publicDescription")
                              : t("privateDescription")}
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={createRoom.isPending}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password for Private Rooms */}
            {!form.watch("isPublic") && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("passwordLabel")} *</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={t("passwordPlaceholder")}
                        disabled={createRoom.isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {t("passwordDescription")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Max Members */}
            <FormField
              control={form.control}
              name="maxMembers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("maxMembersLabel")}: {field.value}
                  </FormLabel>
                  <FormControl>
                    <div className="px-2">
                      <Slider
                        value={[field.value]}
                        onValueChange={([value]) => field.onChange(value)}
                        min={2}
                        max={50}
                        step={1}
                        disabled={createRoom.isPending}
                        className="w-full"
                      />
                    </div>
                  </FormControl>
                  <FormDescription className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{t("maxMembersDescription")}</span>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 w-fit ml-auto">
              <Button
                type="submit"
                disabled={createRoom.isPending}
                className="flex-1"
              >
                {createRoom.isPending ? t("creating") : t("createButton")}
              </Button>
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={createRoom.isPending}
                >
                  {t("cancel")}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
