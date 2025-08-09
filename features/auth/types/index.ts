export type EmailPurpose = "VERIFY_EMAIL" | "RESET_PASSWORD" | "SIGN_IN_OTP";

export interface StartEmailFlowRequest {
  email: string;
  purpose: EmailPurpose;
}

export interface VerifyEmailCodeRequest {
  email: string;
  code: string;
  purpose: EmailPurpose;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
}

export interface ApiSuccess {
  success: true;
  message?: string;
}

export interface ApiFailure {
  success: false;
  message: string;
}

export type ApiResult = ApiSuccess | ApiFailure;
