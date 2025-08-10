"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { useApiMutation } from "@/lib/api/hooks/use-api-mutation";
import { AuthService } from "@/features/auth/services/auth.service";
import { signIn } from "next-auth/react";
import {
  getPendingSignup,
  clearPendingSignup,
  savePendingSignup,
} from "@/features/auth/utils/pendingSignup";
import {
  getPendingPasswordReset,
  updatePendingPasswordResetToken,
  updatePendingPasswordResetExpiry,
} from "@/features/auth/utils/pendingPasswordReset";

interface AuthResponse {
  success: boolean;
  message?: string;
  requireOtp?: boolean;
  expiresInSeconds?: number;
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
  };
}

export function VerifyOtpForm() {
  const t = useTranslations("auth.signUpForm");
  const router = useRouter();
  const searchParams = useSearchParams();

  const [otp, setOtp] = useState("");

  const [countdown, setCountdown] = useState<number>(0);

  const flow = searchParams.get("flow") || "signup"; // 'signup' or 'reset'
  const [isInitialized, setIsInitialized] = useState(false);

  const pending = useMemo(() => {
    if (flow === "reset") {
      return getPendingPasswordReset();
    }
    return getPendingSignup();
  }, [flow]);

  useEffect(() => {
    // Only redirect on initial load, not on locale changes
    if (!isInitialized) {
      setIsInitialized(true);
      if (!pending) {
        router.replace(flow === "reset" ? "/auth/signin" : "/auth/signup");
        return;
      }
    }

    if (pending) {
      const remaining = Math.max(
        0,
        Math.floor((pending.expiresAt - Date.now()) / 1000),
      );
      setCountdown(remaining);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending, isInitialized]);

  useEffect(() => {
    if (countdown <= 0) return;
    const id = setInterval(
      () => setCountdown((s) => (s > 0 ? s - 1 : 0)),
      1000,
    );
    return () => clearInterval(id);
  }, [countdown]);

  const verifyMutation = useApiMutation<AuthResponse, { otp: string }>({
    mutationFn: async ({ otp }) => {
      if (!pending) throw { message: t("registrationFailed") };

      if (flow === "reset") {
        // For password reset, verify OTP and get reset token
        const response = await AuthService.verifyResetOtp({
          email: pending.email,
          otp,
        });
        return response;
      } else {
        // For signup, verify registration
        return AuthService.registerVerify({
          name: (pending as { name: string }).name,
          email: pending.email,
          password: (pending as { password: string }).password,
          role: "USER",
          otp,
        });
      }
    },
    successMessage: flow === "reset" ? t("otpVerified") : t("accountCreated"),
  });

  const onVerify = async () => {
    try {
      const result = await verifyMutation.mutateAsync({ otp });

      if (result && result.success && pending) {
        if (flow === "reset") {
          // For password reset flow
          const resetToken = result.token || otp; // Use returned token or OTP as token
          updatePendingPasswordResetToken(resetToken);

          // Redirect to reset password page
          router.push(
            `/auth/reset-password?email=${encodeURIComponent(pending.email)}&token=${encodeURIComponent(resetToken)}`,
          );
        } else {
          // For signup flow
          clearPendingSignup();
          const signInResult = await signIn("credentials", {
            email: pending.email,
            password: (pending as { password: string }).password,
            redirect: false,
          });
          if (signInResult?.ok) {
            router.push("/dashboard");
            router.refresh();
          } else {
            router.push("/auth/signin");
          }
        }
      }
    } catch {}
  };

  const resendMutation = useApiMutation<AuthResponse, void>({
    mutationFn: async () => {
      if (!pending) throw { message: t("registrationFailed") };

      if (flow === "reset") {
        // For password reset, resend reset OTP
        return AuthService.forgotPassword(pending.email);
      } else {
        // For signup, resend registration OTP
        return AuthService.registerStart({
          name: (pending as { name: string }).name,
          email: pending.email,
          password: (pending as { password: string }).password,
          role: "USER",
        });
      }
    },
  });

  const onResend = async () => {
    try {
      const result = await resendMutation.mutateAsync();
      const expires = result.expiresInSeconds ?? 120;
      if (pending) {
        if (flow === "reset") {
          // Update password reset expiry
          updatePendingPasswordResetExpiry(expires);
        } else {
          // Update signup expiry
          savePendingSignup(
            {
              name: (pending as { name: string }).name,
              email: pending.email,
              password: (pending as { password: string }).password,
            },
            expires,
          );
        }
      }
      setCountdown(expires);
    } catch {}
  };

  const email = searchParams.get("email") || pending?.email || "";

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {flow === "reset"
            ? t("resetOtpTitle") || "Verify Reset Code"
            : t("otpTitle")}
        </CardTitle>
        <CardDescription>
          {flow === "reset"
            ? t("resetOtpDescription") ||
              `We sent a verification code to ${email}. Enter it below to reset your password.`
            : t.rich("otpDescription", {
                email: () => <span className="font-medium">{email}</span>,
              })}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="otp">{t("otpLabel")}</Label>
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(val) => setOtp(val.replace(/\D/g, "").slice(0, 6))}
              disabled={verifyMutation.isPending}
              aria-label={t("otpLabel")}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            {t("timeRemaining")} {countdown}
            {t("secondsAbbrev")}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={onVerify}
            disabled={otp.length !== 6 || verifyMutation.isPending}
            className="flex-1"
          >
            {verifyMutation.isPending ? t("verifying") : t("verify")}
          </Button>
          <Button
            variant="outline"
            onClick={onResend}
            disabled={countdown > 0 || resendMutation.isPending}
            className="w-40"
          >
            {countdown > 0 ? t("resendingDisabled") : t("resendCode")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
