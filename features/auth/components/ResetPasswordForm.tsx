"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff } from "lucide-react";
import { useResetPassword } from "@/features/auth/hooks/useAuthFlows";
import {
  getPendingPasswordReset,
  clearPendingPasswordReset,
} from "@/features/auth/utils/pendingPasswordReset";

type ResetPasswordFormData = {
  newPassword: string;
  confirmPassword: string;
};

export function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("auth.resetPassword");
  const tAuth = useTranslations("auth");

  const pending = getPendingPasswordReset();
  const email = searchParams.get("email") || pending?.email || "";
  const token = searchParams.get("token") || pending?.token || "";

  // Create validation schema with translations
  const resetPasswordSchema = z
    .object({
      newPassword: z
        .string()
        .min(
          8,
          t("validation.passwordTooShort") ||
            "Password must be at least 8 characters",
        )
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          t("validation.passwordWeak") ||
            "Password must contain uppercase, lowercase and number",
        ),
      confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("validation.passwordMismatch") || "Passwords do not match",
      path: ["confirmPassword"],
    });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const resetPasswordMutation = useResetPassword();

  // Use useEffect for initial redirect logic instead of inline
  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
      if (!pending || !email || !token) {
        router.replace("/auth/signin");
        return;
      }
    }
  }, [isInitialized, pending, email, token, router]);

  // Show loading or redirect if not initialized or missing data
  if (!isInitialized || !pending || !email || !token) {
    return null;
  }

  const onSubmit = async (data: ResetPasswordFormData) => {
    setError("");

    try {
      await resetPasswordMutation.mutateAsync({
        email,
        token,
        newPassword: data.newPassword,
      });

      // Clear pending reset data
      clearPendingPasswordReset();

      // Redirect to signin with success message
      router.push("/auth/signin?message=password-reset-success");
    } catch (error: unknown) {
      const errorMessage = (error as { message?: string })?.message;
      if (
        errorMessage?.includes("expired") ||
        errorMessage?.includes("invalid")
      ) {
        setError(
          t("tokenExpired") ||
            "Reset token has expired. Please request a new one.",
        );
      } else {
        setError(
          t("resetFailed") || "Failed to reset password. Please try again.",
        );
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title") || "Reset Password"}</CardTitle>
        <CardDescription>
          {t("description") || "Enter your new password below"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword">
              {t("newPassword") || "New Password"}
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                placeholder={
                  t("newPasswordPlaceholder") || "Enter new password"
                }
                {...register("newPassword")}
                disabled={isSubmitting}
                className={errors.newPassword ? "border-red-500" : ""}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isSubmitting}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.newPassword && (
              <p className="text-sm text-red-500">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">
              {t("confirmPassword") || "Confirm Password"}
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder={
                  t("confirmPasswordPlaceholder") || "Confirm new password"
                }
                {...register("confirmPassword")}
                disabled={isSubmitting}
                className={errors.confirmPassword ? "border-red-500" : ""}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isSubmitting}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting
              ? t("resetting") || "Resetting..."
              : t("resetPassword") || "Reset Password"}
          </Button>
        </form>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">
            {t("rememberPassword") || "Remember your password?"}{" "}
          </span>
          <Button
            variant="link"
            className="p-0 h-auto text-sm"
            onClick={() => router.push("/auth/signin")}
          >
            {tAuth("signIn") || "Sign In"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
