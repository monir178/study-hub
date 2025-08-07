"use client";

import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/features/users/types";

interface ProfilePictureProps {
  user: User;
  selectedFile: File | null;
  onFileSelect: (file: File | null) => void;
  className?: string;
}

export function ProfilePicture({
  user,
  selectedFile,
  onFileSelect,
  className,
}: ProfilePictureProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const t = useTranslations("profile.form");

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error(t("validation.imageTypeInvalid"));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t("validation.imageSizeInvalid"));
        return;
      }

      // Create preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onFileSelect(file);
    }
  };

  const handleRemoveSelection = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const getUserInitials = () => {
    const name = user.name || user.email;
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const displayImage = previewUrl || user.image;

  return (
    <div className={`text-center lg:text-left space-y-4 ${className}`}>
      {/* Avatar Display */}
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="relative inline-block">
          <Avatar className="h-24 w-24 md:h-28 md:w-28 lg:h-32 lg:w-32">
            <AvatarImage
              className="object-cover"
              src={displayImage || undefined}
              alt={user.name || "Profile"}
            />
            <AvatarFallback className="text-lg md:text-xl">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center lg:justify-start gap-2">
          <Button
            onClick={triggerFileInput}
            variant="outline"
            size="sm"
            type="button"
          >
            <Upload className="h-4 w-4 mr-2" />
            {selectedFile ? t("changePhoto") : t("uploadPhoto")}
          </Button>

          {(selectedFile || user.image) && (
            <Button
              onClick={handleRemoveSelection}
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive"
              type="button"
            >
              <X className="h-4 w-4 mr-2" />
              {selectedFile ? "Cancel" : t("removePhoto")}
            </Button>
          )}
        </div>
      </div>

      {/* Selection Status */}
      {selectedFile && (
        <div className="text-sm text-center lg:text-left">
          <p className="text-green-600 font-medium">New image selected</p>
          <p className="text-muted-foreground">
            Click "{t("updateProfile")}" to save changes
          </p>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
