import { NextRequest, NextResponse } from "next/server";
import { UnifiedEmailService } from "@/lib/email/unified-email.service";
import { z } from "zod";

// Validation schemas
const baseEmailSchema = z.object({
  to: z.string().email("Invalid email address"),
  firstName: z.string().optional(),
});

const welcomeEmailSchema = baseEmailSchema;

const passwordResetSchema = baseEmailSchema.extend({
  resetToken: z.string().min(1, "Reset token is required"),
});

const verificationSchema = baseEmailSchema.extend({
  verificationToken: z.string().min(1, "Verification token is required"),
});

const otpSchema = baseEmailSchema.extend({
  otp: z.string().min(1, "OTP is required"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, ...data } = body;

    let result;

    switch (type) {
      case "welcome":
        const welcomeData = welcomeEmailSchema.parse(data);
        result = await UnifiedEmailService.sendWelcomeEmail(
          welcomeData.to,
          welcomeData.firstName,
        );
        break;

      case "password-reset":
        const resetData = passwordResetSchema.parse(data);
        result = await UnifiedEmailService.sendPasswordResetEmail(
          resetData.to,
          resetData.resetToken,
          resetData.firstName,
        );
        break;

      case "verification":
        const verificationData = verificationSchema.parse(data);
        result = await UnifiedEmailService.sendVerificationEmail(
          verificationData.to,
          verificationData.verificationToken,
          verificationData.firstName,
        );
        break;

      case "otp":
        const otpData = otpSchema.parse(data);
        result = await UnifiedEmailService.sendOtpEmail(
          otpData.to,
          otpData.otp,
          otpData.firstName,
        );
        break;

      default:
        return NextResponse.json(
          {
            error:
              "Invalid email type. Must be: welcome, password-reset, verification, or otp",
          },
          { status: 400 },
        );
    }

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to send email" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: `${type} email sent successfully`,
      data: result.data,
    });
  } catch (error) {
    console.error("Email send error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// GET endpoint to check email service status
export async function GET() {
  try {
    const status = UnifiedEmailService.getServiceStatus();

    return NextResponse.json({
      success: true,
      status,
      message: status.canSendToAnyEmail
        ? "Email service configured for sending to any address"
        : "Gmail SMTP not configured. Please set GMAIL_USER and GMAIL_APP_PASSWORD environment variables.",
    });
  } catch (error) {
    console.error("Email status check error:", error);
    return NextResponse.json(
      { error: "Failed to check email service status" },
      { status: 500 },
    );
  }
}
