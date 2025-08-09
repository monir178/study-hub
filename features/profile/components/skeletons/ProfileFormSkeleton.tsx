"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProfileFormSkeleton() {
  return (
    <div
      className="min-h-screen flex justify-center items-center bg-background"
      data-testid="profile-form-skeleton"
    >
      <div className="max-w-4xl lg:min-w-4xl mx-auto">
        <div className="space-y-8" data-testid="skeleton-main-container">
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
                {/* Left Side - Profile Picture and Basic Info */}
                <div className="flex justify-center lg:justify-start items-center">
                  <div className="flex w-full flex-col gap-4">
                    {/* Profile Picture Skeleton */}
                    <div
                      className="text-center lg:text-left space-y-4"
                      data-testid="skeleton-profile-picture"
                    >
                      <div className="flex flex-col items-center justify-center gap-4">
                        <div className="relative inline-block">
                          <Skeleton
                            className="h-24 w-24 md:h-28 md:w-28 lg:h-32 lg:w-32 rounded-full"
                            data-testid="skeleton-avatar"
                          />
                        </div>
                        <div className="flex justify-center lg:justify-start gap-2">
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
                      className="space-y-6"
                      data-testid="skeleton-basic-fields"
                    >
                      {/* Full Name */}
                      <div data-testid="skeleton-field">
                        <Skeleton className="h-4 w-20 mb-2" />
                        <Skeleton className="h-10 w-full" />
                      </div>

                      {/* Email */}
                      <div data-testid="skeleton-field">
                        <Skeleton className="h-4 w-12 mb-2" />
                        <Skeleton className="h-10 w-full" />
                      </div>

                      {/* Phone Number */}
                      <div data-testid="skeleton-field">
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side - Personal Information and Address */}
                <div className="space-y-6">
                  {/* Personal Information Card */}
                  <Card data-testid="skeleton-personal-info-card">
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
                        {/* Gender */}
                        <div>
                          <Skeleton className="h-4 w-16 mb-2" />
                          <Skeleton className="h-10 w-full" />
                        </div>
                        {/* Date of Birth */}
                        <div>
                          <Skeleton className="h-4 w-24 mb-2" />
                          <Skeleton className="h-10 w-full" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Address Information Card */}
                  <Card data-testid="skeleton-address-info-card">
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
                        {/* Street - spans 2 columns */}
                        <div className="lg:col-span-2">
                          <Skeleton className="h-4 w-20 mb-2" />
                          <Skeleton className="h-10 w-full" />
                        </div>
                        {/* City */}
                        <div>
                          <Skeleton className="h-4 w-16 mb-2" />
                          <Skeleton className="h-10 w-full" />
                        </div>
                        {/* Region */}
                        <div>
                          <Skeleton className="h-4 w-20 mb-2" />
                          <Skeleton className="h-10 w-full" />
                        </div>
                        {/* Postal Code */}
                        <div>
                          <Skeleton className="h-4 w-24 mb-2" />
                          <Skeleton className="h-10 w-full" />
                        </div>
                        {/* Country */}
                        <div>
                          <Skeleton className="h-4 w-18 mb-2" />
                          <Skeleton className="h-10 w-full" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-4 pt-8 border-t justify-end"
            data-testid="skeleton-submit-buttons"
          >
            <Skeleton
              className="h-10 w-32 sm:w-auto"
              data-testid="skeleton-submit-button"
            />
            <Skeleton
              className="h-10 w-28 sm:w-auto"
              data-testid="skeleton-reset-button"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
