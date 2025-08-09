"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function ProfilePictureSkeleton() {
  return (
    <div
      className="flex flex-col items-center space-y-4"
      data-testid="profile-picture-skeleton"
    >
      <div className="relative" data-testid="skeleton-avatar-container">
        <Skeleton
          className="w-32 h-32 rounded-full"
          data-testid="skeleton-avatar"
        />
        <Skeleton
          className="absolute bottom-0 right-0 w-8 h-8 rounded-full"
          data-testid="skeleton-avatar-badge"
        />
      </div>
      <div className="flex gap-2" data-testid="skeleton-action-buttons">
        <Skeleton className="h-9 w-24" data-testid="skeleton-upload-button" />
        <Skeleton className="h-9 w-20" data-testid="skeleton-remove-button" />
      </div>
      <Skeleton className="h-3 w-40" data-testid="skeleton-status-text" />
    </div>
  );
}
