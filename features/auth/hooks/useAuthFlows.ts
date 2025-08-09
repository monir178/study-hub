"use client";

import { useApiMutation } from "@/lib/api/hooks/use-api-mutation";
import { AuthService } from "@/features/auth/services/auth.service";
import type {
  ResetPasswordRequest,
  StartEmailFlowRequest,
  VerifyEmailCodeRequest,
} from "@/features/auth/types";

export function useStartEmailVerification() {
  return useApiMutation<{ success: boolean }, StartEmailFlowRequest>({
    mutationFn: AuthService.startEmailFlow,
    successMessage: "Verification code sent",
  });
}

export function useVerifyEmailCode() {
  return useApiMutation<{ success: boolean }, VerifyEmailCodeRequest>({
    mutationFn: AuthService.verifyEmailCode,
    successMessage: "Email verified",
  });
}

export function useSendSignInOtp() {
  return useApiMutation<{ success: boolean }, { email: string }>({
    mutationFn: ({ email }) => AuthService.sendOtp(email),
    successMessage: "OTP sent",
  });
}

export function useForgotPassword() {
  return useApiMutation<{ success: boolean }, { email: string }>({
    mutationFn: ({ email }) => AuthService.forgotPassword(email),
    successMessage: "Reset code sent",
  });
}

export function useResetPassword() {
  return useApiMutation<{ success: boolean }, ResetPasswordRequest>({
    mutationFn: AuthService.resetPassword,
    successMessage: "Password updated",
  });
}

// Signup OTP flow hooks
export function useStartRegistration() {
  return useApiMutation({
    mutationFn: AuthService.registerStart,
  });
}

export function useVerifyRegistration() {
  return useApiMutation({
    mutationFn: AuthService.registerVerify,
  });
}
