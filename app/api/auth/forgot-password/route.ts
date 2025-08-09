import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UnifiedEmailService } from "@/lib/email/unified-email.service";
import { z } from "zod";

const schema = z.object({ email: z.string().email() });

function generateResetToken(): string {
  return Array.from({ length: 32 })
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join("");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = schema.parse(body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Return success to prevent user enumeration
      return NextResponse.json({ success: true });
    }

    const resetToken = generateResetToken();
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await prisma.emailVerificationCode.upsert({
      where: { email },
      update: {
        code: resetToken,
        purpose: "RESET_PASSWORD",
        expiresAt: expires,
      },
      create: {
        email,
        code: resetToken,
        purpose: "RESET_PASSWORD",
        expiresAt: expires,
      },
    });

    // Send password reset email using unified service
    const emailResult = await UnifiedEmailService.sendPasswordResetEmail(
      email,
      resetToken,
      user.name || undefined,
    );

    if (!emailResult.success) {
      console.error("Failed to send password reset email:", emailResult.error);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to send password reset email",
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
