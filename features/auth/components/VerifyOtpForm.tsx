"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
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

interface RegisterResponse {
  success: boolean;
  message: string;
  requireOtp?: boolean;
  expiresInSeconds?: number;
}

export function VerifyOtpForm() {
  const t = useTranslations("auth.signUpForm");
  const router = useRouter();
  const searchParams = useSearchParams();

  const [otp, setOtp] = useState("");
  const [serverError, setServerError] = useState("");
  const [countdown, setCountdown] = useState<number>(0);

  const pending = useMemo(() => getPendingSignup(), []);

  useEffect(() => {
    if (!pending) {
      router.replace("/auth/signup");
      return;
    }
    const remaining = Math.max(
      0,
      Math.floor((pending.expiresAt - Date.now()) / 1000),
    );
    setCountdown(remaining);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const id = setInterval(
      () => setCountdown((s) => (s > 0 ? s - 1 : 0)),
      1000,
    );
    return () => clearInterval(id);
  }, [countdown]);

  const verifyMutation = useApiMutation<RegisterResponse, { otp: string }>({
    mutationFn: async ({ otp }) => {
      if (!pending) throw { message: t("registrationFailed") };
      return AuthService.registerVerify({
        name: pending.name,
        email: pending.email,
        password: pending.password,
        role: "USER",
        otp,
      });
    },
    successMessage: t("accountCreated"),
  });

  const onVerify = async () => {
    setServerError("");
    try {
      const result = await verifyMutation.mutateAsync({ otp });
      if (result.success && pending) {
        clearPendingSignup();
        const signInResult = await signIn("credentials", {
          email: pending.email,
          password: pending.password,
          redirect: false,
        });
        if (signInResult?.ok) {
          router.push("/dashboard");
          router.refresh();
        } else {
          router.push("/auth/signin");
        }
      }
    } catch (error: unknown) {
      setServerError(
        (error as { message?: string })?.message || t("otpInvalid"),
      );
    }
  };

  const resendMutation = useApiMutation<RegisterResponse, void>({
    mutationFn: async () => {
      if (!pending) throw { message: t("registrationFailed") };
      return AuthService.registerStart({
        name: pending.name,
        email: pending.email,
        password: pending.password,
        role: "USER",
      });
    },
  });

  const onResend = async () => {
    setServerError("");
    try {
      const result = await resendMutation.mutateAsync();
      const expires = result.expiresInSeconds ?? 120;
      if (pending) {
        savePendingSignup(
          {
            name: pending.name,
            email: pending.email,
            password: pending.password,
          },
          expires,
        );
      }
      setCountdown(expires);
    } catch (error: unknown) {
      setServerError(
        (error as { message?: string })?.message || t("registrationFailed"),
      );
    }
  };

  const email = searchParams.get("email") || pending?.email || "";

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("otpTitle")}</CardTitle>
        <CardDescription>
          {t.rich("otpDescription", {
            email: () => <span className="font-medium">{email}</span>,
          })}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {serverError && (
          <Alert variant="destructive">
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        )}

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
