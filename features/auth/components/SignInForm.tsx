"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
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
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Github, Mail } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useForgotPassword } from "@/features/auth/hooks/useAuthFlows";
import { savePendingPasswordReset } from "@/features/auth/utils/pendingPasswordReset";

type SignInFormData = {
  email: string;
  password: string;
};

export function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isRequestingReset, setIsRequestingReset] = useState(false);
  const router = useRouter();
  const t = useTranslations("auth.signInForm");
  const tAuth = useTranslations("auth");

  const forgotPasswordMutation = useForgotPassword();

  // Create validation schema with translations
  const signInSchema = z.object({
    email: z
      .string()
      .email(
        t("validation.emailInvalid") || "Please enter a valid email address",
      ),
    password: z
      .string()
      .min(1, t("validation.passwordRequired") || "Password is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    setError("");

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError(t("invalidCredentials"));
      } else {
        // Small delay to ensure session is properly established
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 100);
      }
    } catch {
      setError(t("errorOccurred"));
    }
  };

  const handleOAuthSignIn = async (provider: "google" | "github") => {
    try {
      await signIn(provider, { callbackUrl: "/dashboard" });
    } catch {
      setError(t("oauthFailed"));
    }
  };

  const handleForgotPassword = async (email: string) => {
    if (!email) {
      setError(t("emailRequired") || "Please enter your email address");
      return;
    }

    setIsRequestingReset(true);
    setError("");

    try {
      await forgotPasswordMutation.mutateAsync({ email });
      // Save to localStorage with 2 minutes expiry
      savePendingPasswordReset({ email }, 120);
      // Redirect to verify OTP page
      router.push(
        `/auth/verify-otp?email=${encodeURIComponent(email)}&flow=reset`,
      );
    } catch (error: unknown) {
      const errorMessage = (error as { message?: string })?.message;
      if (
        errorMessage?.includes("no user found") ||
        errorMessage?.includes("not found")
      ) {
        setError(t("userNotFound") || "No user found with this email address");
      } else {
        setError(
          t("resetFailed") || "Failed to send reset code. Please try again.",
        );
      }
    } finally {
      setIsRequestingReset(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{tAuth("email")}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t("emailPlaceholder")}
              {...register("email")}
              disabled={isSubmitting}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{tAuth("password")}</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder={t("passwordPlaceholder")}
                {...register("password")}
                disabled={isSubmitting}
                className={errors.password ? "border-red-500" : ""}
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
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? t("signingIn") : tAuth("signIn")}
          </Button>

          <div className="text-center">
            <Button
              type="button"
              variant="link"
              className="p-0 h-auto text-sm"
              onClick={() => {
                const form = document.getElementById(
                  "email",
                ) as HTMLInputElement;
                handleForgotPassword(form?.value || "");
              }}
              disabled={isSubmitting || isRequestingReset}
            >
              {isRequestingReset
                ? t("sendingResetCode") || "Sending reset code..."
                : t("forgotPassword") || "Forgot password?"}
            </Button>
          </div>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              {tAuth("orContinueWith")}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            onClick={() => handleOAuthSignIn("google")}
            disabled={isSubmitting}
          >
            <Mail className="mr-2 h-4 w-4" />
            Google
          </Button>
          <Button
            variant="outline"
            onClick={() => handleOAuthSignIn("github")}
            disabled={isSubmitting}
          >
            <Github className="mr-2 h-4 w-4" />
            GitHub
          </Button>
        </div>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">
            {tAuth("dontHaveAccount")}{" "}
          </span>
          <Link href="/auth/signup" className="text-primary hover:underline">
            {tAuth("signUp")}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
