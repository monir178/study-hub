"use client";

import { useState } from "react";
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
import { Eye, EyeOff, Github, Mail, User } from "lucide-react";
import { signIn } from "next-auth/react";
import { Link } from "@/i18n/navigation";
import { useApiMutation } from "@/lib/api/hooks/use-api-mutation";

type SignUpFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

interface RegisterResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
  };
}

export function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const t = useTranslations("auth.signUpForm");
  const tAuth = useTranslations("auth");

  // Create validation schema with translations
  const signUpSchema = z
    .object({
      name: z.string().min(2, t("validation.nameMinLength")),
      email: z.string().email(t("validation.emailInvalid")),
      password: z
        .string()
        .min(8, t("validation.passwordMinLength"))
        .regex(/(?=.*[a-z])/, t("validation.passwordLowercase"))
        .regex(/(?=.*[A-Z])/, t("validation.passwordUppercase"))
        .regex(/(?=.*\d)/, t("validation.passwordNumber"))
        .regex(/(?=.*[@$!%*?&])/, t("validation.passwordSpecial")),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("validation.passwordsNoMatch"),
      path: ["confirmPassword"],
    });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const registerMutation = useApiMutation<RegisterResponse, SignUpFormData>({
    mutationFn: async (data) => {
      // Use fetch directly to avoid API client response format issues
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name.trim(),
          email: data.email.toLowerCase().trim(),
          password: data.password,
          role: "USER", // Automatically assign USER role
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Registration failed");
      }

      return result;
    },
    successMessage: t("accountCreated"),
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const result = await registerMutation.mutateAsync(data);

      if (result.success) {
        setSuccess(true);

        // Auto sign-in immediately after successful registration
        const signInResult = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (signInResult?.ok) {
          router.push("/dashboard");
          router.refresh();
        } else {
          // If auto sign-in fails, redirect to sign-in page
          router.push(
            `/auth/signin?message=${encodeURIComponent(t("registrationSuccess"))}`,
          );
        }
      }
    } catch (error: unknown) {
      // Handle server validation errors
      if (
        error &&
        typeof error === "object" &&
        "errors" in error &&
        Array.isArray(
          (error as { errors: { field?: string; message: string }[] }).errors,
        )
      ) {
        (
          error as { errors: { field?: string; message: string }[] }
        ).errors.forEach((err: { field?: string; message: string }) => {
          if (err.field) {
            setError(err.field as keyof SignUpFormData, {
              type: "server",
              message: err.message,
            });
          }
        });
      }
    }
  };

  const handleOAuthSignUp = async (provider: "google" | "github") => {
    try {
      await signIn(provider, { callbackUrl: "/dashboard" });
    } catch (error) {
      console.error("OAuth sign up failed:", error);
    }
  };

  if (success) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <User className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-800">
                {t("accountCreated")}
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                {t("welcomeMessage")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {registerMutation.error && (
          <Alert variant="destructive">
            <AlertDescription>
              {registerMutation.error.response?.data?.message ||
                t("registrationFailed")}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name">{t("fullName")}</Label>
            <Input
              id="name"
              type="text"
              placeholder={t("fullNamePlaceholder")}
              {...register("name")}
              disabled={isSubmitting}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Email Field */}
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

          {/* Password Field */}
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

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{tAuth("confirmPassword")}</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder={t("confirmPasswordPlaceholder")}
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
            {isSubmitting ? t("creatingAccount") : t("createAccount")}
          </Button>
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
            onClick={() => handleOAuthSignUp("google")}
            disabled={isSubmitting}
          >
            <Mail className="mr-2 h-4 w-4" />
            Google
          </Button>
          <Button
            variant="outline"
            onClick={() => handleOAuthSignUp("github")}
            disabled={isSubmitting}
          >
            <Github className="mr-2 h-4 w-4" />
            GitHub
          </Button>
        </div>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">
            {tAuth("alreadyHaveAccount")}{" "}
          </span>
          <Link href="/auth/signin" className="text-primary hover:underline">
            {tAuth("signIn")}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
