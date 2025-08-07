"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function ProfilePictureSkeleton() {
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Skeleton className="w-32 h-32 rounded-full" />
        <Skeleton className="absolute bottom-0 right-0 w-8 h-8 rounded-full" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-20" />
      </div>
      <Skeleton className="h-3 w-40" />
    </div>
  );
}
