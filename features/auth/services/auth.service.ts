import { apiClient } from "@/lib/api/client";
import type {
  ResetPasswordRequest,
  StartEmailFlowRequest,
  VerifyEmailCodeRequest,
  ApiResult,
} from "@/features/auth/types";

export const AuthService = {
  // Signup (OTP) flow - use fetch to keep API response shape (no data wrapper)
  registerStart: async (data: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw json;
    return json as {
      success: boolean;
      message: string;
      requireOtp?: boolean;
      expiresInSeconds?: number;
      user?: {
        id: string;
        name: string;
        email: string;
        role: string;
        createdAt: string;
      };
    };
  },
  registerVerify: async (data: {
    name: string;
    email: string;
    password: string;
    otp: string;
    role?: string;
  }) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw json;
    return json as {
      success: boolean;
      message: string;
      requireOtp?: boolean;
      expiresInSeconds?: number;
      user?: {
        id: string;
        name: string;
        email: string;
        role: string;
        createdAt: string;
      };
    };
  },
  startEmailFlow: (data: StartEmailFlowRequest) =>
    apiClient.post<ApiResult>("/auth/verify-email", data),
  verifyEmailCode: (data: VerifyEmailCodeRequest) =>
    apiClient.put<ApiResult>("/auth/verify-email", data),
  sendOtp: (email: string) =>
    apiClient.post<ApiResult>("/auth/send-otp", { email }),
  forgotPassword: (email: string) =>
    apiClient.post<ApiResult>("/auth/forgot-password", { email }),
  resetPassword: (data: ResetPasswordRequest) =>
    apiClient.post<ApiResult>("/auth/reset-password", data),

  // Unified email service methods
  sendPasswordResetEmail: (
    email: string,
    resetToken: string,
    firstName?: string,
  ) =>
    apiClient.post<ApiResult>("/email/send", {
      type: "password-reset",
      to: email,
      resetToken,
      firstName,
    }),

  sendVerificationEmail: (
    email: string,
    verificationToken: string,
    firstName?: string,
  ) =>
    apiClient.post<ApiResult>("/email/send", {
      type: "verification",
      to: email,
      verificationToken,
      firstName,
    }),

  sendOtpEmail: (email: string, otp: string, firstName?: string) =>
    apiClient.post<ApiResult>("/email/send", {
      type: "otp",
      to: email,
      otp,
      firstName,
    }),

  sendWelcomeEmail: (email: string, firstName?: string) =>
    apiClient.post<ApiResult>("/email/send", {
      type: "welcome",
      to: email,
      firstName,
    }),
};
