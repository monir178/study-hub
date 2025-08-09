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
    const { email } = schema.parse(await req.json());
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ success: true });

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await prisma.emailVerificationCode.upsert({
      where: { email },
      update: { code: otp, purpose: "SIGN_IN_OTP", expiresAt },
      create: { email, code: otp, purpose: "SIGN_IN_OTP", expiresAt },
    });

    // Send OTP email using unified service
    const emailResult = await UnifiedEmailService.sendOtpEmail(
      email,
      otp,
      user.name || undefined,
    );

    if (!emailResult.success) {
      console.error("Failed to send OTP email:", emailResult.error);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to send OTP email",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
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
