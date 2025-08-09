"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function PersonalAddressSkeleton() {
  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      data-testid="personal-address-skeleton"
    >
      {/* Street */}
      <div className="lg:col-span-2" data-testid="skeleton-street-field">
        <Skeleton
          className="h-4 w-24 mb-2"
          data-testid="skeleton-street-label"
        />
        <Skeleton className="h-10 w-full" data-testid="skeleton-street-input" />
      </div>

      {/* City */}
      <div data-testid="skeleton-city-field">
        <Skeleton className="h-4 w-12 mb-2" data-testid="skeleton-city-label" />
        <Skeleton className="h-10 w-full" data-testid="skeleton-city-input" />
      </div>

      {/* Region */}
      <div data-testid="skeleton-region-field">
        <Skeleton
          className="h-4 w-20 mb-2"
          data-testid="skeleton-region-label"
        />
        <Skeleton className="h-10 w-full" data-testid="skeleton-region-input" />
      </div>

      {/* Postal Code */}
      <div data-testid="skeleton-postal-code-field">
        <Skeleton
          className="h-4 w-20 mb-2"
          data-testid="skeleton-postal-code-label"
        />
        <Skeleton
          className="h-10 w-full"
          data-testid="skeleton-postal-code-input"
        />
      </div>

      {/* Country */}
      <div data-testid="skeleton-country-field">
        <Skeleton
          className="h-4 w-16 mb-2"
          data-testid="skeleton-country-label"
        />
        <Skeleton
          className="h-10 w-full"
          data-testid="skeleton-country-input"
        />
      </div>
    </div>
  );
}
