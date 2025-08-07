"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

import { ProfilePicture } from "./ProfilePicture";
import { PersonalInformation } from "./PersonalInformation";
import { PersonalAddress } from "./PersonalAddress";
import {
  useUserProfile,
  useUpdateProfile,
} from "@/features/users/hooks/useUsers";
import { UserService } from "@/features/users/services/user.service";
import { ProfileFormData, profileSchema } from "@/features/profile/types";

// Custom styles for phone input to prevent overlapping
const phoneInputStyles = `
  .phone-input-wrapper .PhoneInputInput {
    border: none !important;
    outline: none !important;
    background: transparent !important;
    font-size: 0.875rem !important;
    width: 100% !important;
    box-shadow: none !important;
  }
  .phone-input-wrapper .PhoneInputCountrySelect {
    border: none !important;
    background: transparent !important;
    margin-right: 8px !important;
  }
  .phone-input-wrapper .PhoneInput {
    position: relative !important;
    z-index: 1 !important;
  }
`;

export function ProfileForm() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Use existing user profile hook - no duplication!
  const { data: user, isLoading, error } = useUserProfile();

  const { mutateAsync: updateProfile, isPending } = useUpdateProfile();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      gender: undefined,
      dateOfBirth: undefined,
      street: "",
      city: "",
      region: "",
      postalCode: "",
      country: "",
    },
  });

  // Initialize form when user data loads
  useEffect(() => {
    if (user) {
      const formData = {
        name: user.name || "",
        phoneNumber: user.phoneNumber || "",
        gender: user.gender as
          | "MALE"
          | "FEMALE"
          | "OTHER"
          | "PREFER_NOT_TO_SAY"
          | undefined,
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth) : undefined,
        street: user.street || "",
        city: user.city || "",
        region: user.region || "",
        postalCode: user.postalCode || "",
        country: user.country || "",
      };

      form.reset(formData);
    }
  }, [user, form]);

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;

    try {
      let imageUrl = user.image;

      // Upload image first if selected
      if (selectedImage) {
        setIsUploadingImage(true);
        try {
          const uploadResult =
            await UserService.uploadProfilePicture(selectedImage);
          imageUrl = uploadResult.url;
        } catch (uploadError) {
          console.error("Image upload failed:", uploadError);
          toast.error("Failed to upload image. Please try again.");
          return;
        } finally {
          setIsUploadingImage(false);
        }
      }

      // Update profile with form data and new image URL
      await updateProfile({
        ...data,
        image: imageUrl,
      });

      toast.success("Profile updated successfully!");
      setSelectedImage(null);
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>
            Failed to load profile data. Please refresh the page and try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>
            User data not found. Please log in again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const isSubmitting = isPending || isUploadingImage;

  return (
    <div className="min-h-screen bg-background">
      {/* Custom styles for phone input */}
      <style dangerouslySetInnerHTML={{ __html: phoneInputStyles }} />

      <div className="max-w-7xl mx-auto ">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Profile Settings
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your account settings and profile information.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* First Row - Profile Picture and Basic Info */}
            <Card className="w-full ">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col w-full lg:flex-row gap-8 justify-between">
                  {/* Profile Picture - Left Side */}
                  <div className="flex justify-center lg:justify-start items-center">
                    <ProfilePicture
                      user={user}
                      selectedFile={selectedImage}
                      onFileSelect={setSelectedImage}
                    />
                  </div>

                  {/* Basic Info - Right Side */}
                  <div className="space-y-6">
                    {/* Full Name */}
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your full name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Email (Read-only) */}
                    <div>
                      <FormLabel>Email</FormLabel>
                      <Input value={user.email} disabled className="bg-muted" />
                    </div>

                    {/* Phone Number */}
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <div className="phone-input-wrapper">
                              <PhoneInput
                                placeholder="Enter phone number"
                                value={field.value || ""}
                                onChange={field.onChange}
                                defaultCountry="US"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-6">
                    <PersonalInformation user={user} />
                    <PersonalAddress user={user} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Second Row - Additional Information */}
            {/* <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent>
                <PersonalInformation user={user} />
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-6">Address</h3>
                  <PersonalAddress user={user} />
                </div>
              </CardContent>
            </Card> */}

            {/* Submit Section */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t justify-end">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="sm:w-auto w-full"
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isUploadingImage
                  ? "Uploading..."
                  : isPending
                    ? "Updating..."
                    : "Update Profile"}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  setSelectedImage(null);
                }}
                disabled={isSubmitting}
                className="sm:w-auto w-full"
              >
                Reset Changes
              </Button>
            </div>

            {form.formState.errors.root && (
              <Alert variant="destructive">
                <AlertDescription>
                  {form.formState.errors.root.message}
                </AlertDescription>
              </Alert>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}
