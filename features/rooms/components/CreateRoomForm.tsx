"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
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

// Zod schema for form validation
const createRoomSchema = z
  .object({
    name: z
      .string()
      .min(1, "Room name is required")
      .max(100, "Room name must be less than 100 characters"),
    description: z
      .string()
      .max(500, "Description must be less than 500 characters")
      .optional()
      .or(z.literal("")),
    isPublic: z.boolean(),
    maxMembers: z
      .number()
      .min(2, "Max members must be at least 2")
      .max(50, "Max members cannot exceed 50"),
    password: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      // If room is private, password is required
      if (!data.isPublic && (!data.password || data.password.trim() === "")) {
        return false;
      }
      return true;
    },
    {
      message: "Password is required for private rooms",
      path: ["password"],
    },
  );

type CreateRoomFormData = z.infer<typeof createRoomSchema>;

interface CreateRoomFormProps {
  onSuccess?: (roomId: string) => void;
  onCancel?: () => void;
}

export function CreateRoomForm({ onSuccess, onCancel }: CreateRoomFormProps) {
  const createRoom = useCreateRoom();

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
          Create Study Room
        </CardTitle>
        <CardDescription>
          Set up a new collaborative study space for you and your peers
        </CardDescription>
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
                  <FormLabel>Room Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Mathematics Study Group"
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe what you'll be studying and any specific goals..."
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
                  <FormLabel>Room Visibility</FormLabel>
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
                            {field.value ? "Public Room" : "Private Room"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {field.value
                              ? "Anyone can find and join this room"
                              : "Only people with the password can join"}
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
                    <FormLabel>Room Password *</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter a secure password"
                        disabled={createRoom.isPending}
                        {...field}
                      />
                    </FormControl>
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
                  <FormLabel>Maximum Members: {field.value}</FormLabel>
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
                    <span>
                      Recommended: 5-15 members for optimal collaboration
                    </span>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Room Features Info */}
            <Alert>
              <AlertDescription>
                Your room will include: Real-time chat, collaborative notes,
                synchronized Pomodoro timer, and member management tools.
              </AlertDescription>
            </Alert>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={createRoom.isPending}
                className="flex-1"
              >
                {createRoom.isPending ? "Creating..." : "Create Room"}
              </Button>
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={createRoom.isPending}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
