"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

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
import { ProfileFormSkeleton } from "./skeletons";
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
  const t = useTranslations("profile.form");
  const commonT = useTranslations("common");

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
    try {
      // Handle image upload first if there's a selected image
      let imageUrl = user?.image || "";

      if (selectedImage) {
        setIsUploadingImage(true);
        try {
          const uploadResult =
            await UserService.uploadProfilePicture(selectedImage);
          imageUrl = uploadResult.url;
          toast.success(t("profileUpdated"));
        } catch (uploadError) {
          console.error("Upload error:", uploadError);
          toast.error(t("uploadFailed"));
          return;
        } finally {
          setIsUploadingImage(false);
        }
      }

      // Update profile with form data and new image URL
      const updateData = {
        ...data,
        image: imageUrl,
      };

      await updateProfile(updateData);
      toast.success(t("profileUpdated"));
      setSelectedImage(null); // Clear selected image after successful update
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(t("updateFailed"));
    }
  };

  if (isLoading) {
    return <ProfileFormSkeleton />;
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        data-testid="profile-form-error"
      >
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>
            {t("failedToLoad")} {t("tryRefresh")}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!user) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        data-testid="profile-form-error"
      >
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>
            {t("failedToLoad")} {t("tryRefresh")}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const isSubmitting = isPending || isUploadingImage;

  return (
    <div className="min-h-screen flex justify-center items-center bg-background">
      {/* Custom styles for phone input */}
      <style dangerouslySetInnerHTML={{ __html: phoneInputStyles }} />

      <div className="max-w-5xl mx-auto ">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
            data-testid="profile-form"
          >
            {/* First Row - Profile Picture and Basic Info */}
            <Card className="w-full ">
              <CardHeader>
                <CardTitle>{t("basicInformation")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col w-full lg:flex-row gap-8 justify-between">
                  {/* Profile Picture - Left Side */}
                  <div className="flex justify-center lg:justify-start items-center">
                    <div className="flex  w-full flex-col gap-4 ">
                      <ProfilePicture
                        user={user}
                        selectedFile={selectedImage}
                        onFileSelect={setSelectedImage}
                      />
                      {/* Basic Info - Right Side */}
                      <div className="space-y-6">
                        {/* Full Name */}
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("fullName")}</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={t("fullNamePlaceholder")}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Email (Read-only) */}
                        <div>
                          <FormLabel>{commonT("email")}</FormLabel>
                          <Input
                            value={user.email}
                            disabled
                            className="bg-muted"
                          />
                        </div>

                        {/* Phone Number */}
                        <FormField
                          control={form.control}
                          name="phoneNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("phoneNumber")}</FormLabel>
                              <FormControl>
                                <div className="phone-input-wrapper">
                                  <PhoneInput
                                    placeholder={t("phoneNumberPlaceholder")}
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
                    </div>
                  </div>

                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>{t("personalInformation")}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <PersonalInformation user={user} />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>{t("addressInformation")}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <PersonalAddress user={user} />
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Section */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t justify-end">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="sm:w-auto w-full"
                data-testid="submit-button"
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isUploadingImage
                  ? t("uploading")
                  : isPending
                    ? t("updating")
                    : t("updateProfile")}
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
                data-testid="reset-button"
              >
                {t("resetChanges")}
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
