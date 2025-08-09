"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProfileFormSkeleton() {
  return (
    <div
      className="min-h-screen bg-background"
      data-testid="profile-form-skeleton"
    >
      {/* Header */}
      <div className="mb-8" data-testid="skeleton-header">
        <Skeleton className="h-8 w-48 mb-2" data-testid="skeleton-title" />
        <Skeleton className="h-4 w-96" data-testid="skeleton-subtitle" />
      </div>

      <div
        className="max-w-7xl mx-auto space-y-8"
        data-testid="skeleton-main-container"
      >
        {/* Basic Information Card */}
        <Card className="w-full" data-testid="skeleton-basic-info-card">
          <CardHeader>
            <CardTitle>
              <Skeleton
                className="h-6 w-32"
                data-testid="skeleton-basic-info-title"
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col w-full lg:flex-row gap-8 justify-between">
              {/* Profile Picture Skeleton */}
              <div
                className="flex justify-center lg:justify-start items-center"
                data-testid="skeleton-profile-picture"
              >
                <div className="flex flex-col items-center space-y-4">
                  <Skeleton
                    className="w-32 h-32 rounded-full"
                    data-testid="skeleton-avatar"
                  />
                  <div className="flex gap-2">
                    <Skeleton
                      className="h-9 w-24"
                      data-testid="skeleton-upload-button"
                    />
                    <Skeleton
                      className="h-9 w-20"
                      data-testid="skeleton-remove-button"
                    />
                  </div>
                </div>
              </div>

              {/* Basic Info Fields */}
              <div
                className="space-y-6 flex-1"
                data-testid="skeleton-basic-fields"
              >
                <div data-testid="skeleton-field">
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>

                <div data-testid="skeleton-field">
                  <Skeleton className="h-4 w-12 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>

                <div data-testid="skeleton-field">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information Card */}
        <Card className="w-full" data-testid="skeleton-personal-info-card">
          <CardHeader>
            <CardTitle>
              <Skeleton
                className="h-6 w-40"
                data-testid="skeleton-personal-info-title"
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              data-testid="skeleton-personal-info-fields"
            >
              <div>
                <Skeleton className="h-4 w-16 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address Information Card */}
        <Card className="w-full" data-testid="skeleton-address-info-card">
          <CardHeader>
            <CardTitle>
              <Skeleton
                className="h-6 w-36"
                data-testid="skeleton-address-info-title"
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              data-testid="skeleton-address-info-fields"
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div
          className="flex flex-col sm:flex-row gap-4 pt-8 border-t justify-end"
          data-testid="skeleton-submit-buttons"
        >
          <Skeleton
            className="h-10 w-32"
            data-testid="skeleton-submit-button"
          />
          <Skeleton className="h-10 w-28" data-testid="skeleton-reset-button" />
        </div>
      </div>
    </div>
  );
}
