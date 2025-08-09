import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UnifiedEmailService } from "@/lib/email/unified-email.service";
import { z } from "zod";

const schema = z.object({ email: z.string().email() });

function generateOtp(): string {
  return Array.from({ length: 6 })
    .map(() => Math.floor(Math.random() * 10))
    .join("");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = schema.parse(body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "No user found with this email address" },
        { status: 404 },
      );
    }

    const otp = generateOtp();
    const expires = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes

    await prisma.emailVerificationCode.upsert({
      where: { email },
      update: {
        code: otp,
        purpose: "RESET_PASSWORD",
        expiresAt: expires,
      },
      create: {
        email,
        code: otp,
        purpose: "RESET_PASSWORD",
        expiresAt: expires,
      },
    });

    // Send OTP email using unified service
    const emailResult = await UnifiedEmailService.sendOtpEmail(
      email,
      otp,
      user.name || undefined,
    );

    if (!emailResult.success) {
      console.error("Failed to send password reset email:", emailResult.error);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to send reset code email",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      expiresInSeconds: 120, // 2 minutes
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: "Invalid email" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
