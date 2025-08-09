"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function PersonalInformationSkeleton() {
  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      data-testid="personal-information-skeleton"
    >
      {/* Gender */}
      <div data-testid="skeleton-gender-field">
        <Skeleton
          className="h-4 w-16 mb-2"
          data-testid="skeleton-gender-label"
        />
        <Skeleton className="h-10 w-full" data-testid="skeleton-gender-input" />
      </div>

      {/* Date of Birth */}
      <div data-testid="skeleton-date-of-birth-field">
        <Skeleton
          className="h-4 w-24 mb-2"
          data-testid="skeleton-date-of-birth-label"
        />
        <Skeleton
          className="h-10 w-full"
          data-testid="skeleton-date-of-birth-input"
        />
      </div>
    </div>
  );
}
