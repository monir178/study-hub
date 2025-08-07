"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function PersonalAddressSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Street */}
      <div className="lg:col-span-2">
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* City */}
      <div>
        <Skeleton className="h-4 w-12 mb-2" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Region */}
      <div>
        <Skeleton className="h-4 w-20 mb-2" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Postal Code */}
      <div>
        <Skeleton className="h-4 w-20 mb-2" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Country */}
      <div>
        <Skeleton className="h-4 w-16 mb-2" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}
