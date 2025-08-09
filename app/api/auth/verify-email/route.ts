import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UnifiedEmailService } from "@/lib/email/unified-email.service";
import { z } from "zod";

const startSchema = z.object({ email: z.string().email() });
const verifySchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});

function generateVerificationCode(): string {
  return Array.from({ length: 6 })
    .map(() => Math.floor(Math.random() * 10))
    .join("");
}

export async function POST(req: NextRequest) {
  // Start verification
  try {
    const { email } = startSchema.parse(await req.json());
    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.emailVerificationCode.upsert({
      where: { email },
      update: { code, purpose: "VERIFY_EMAIL", expiresAt },
      create: { email, code, purpose: "VERIFY_EMAIL", expiresAt },
    });

    // Send verification email using unified service
    const emailResult = await UnifiedEmailService.sendOtpEmail(
      email,
      code,
      undefined, // We don't have firstName at this point
    );

    if (!emailResult.success) {
      console.error("Failed to send verification email:", emailResult.error);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to send verification email",
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

export async function PUT(req: NextRequest) {
  // Verify code
  try {
    const { email, code } = verifySchema.parse(await req.json());
    const record = await prisma.emailVerificationCode.findUnique({
      where: { email },
    });
    if (
      !record ||
      record.code !== code ||
      record.purpose !== "VERIFY_EMAIL" ||
      record.expiresAt < new Date()
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired code" },
        { status: 400 },
      );
    }
    await prisma.user.update({
      where: { email },
      data: { emailVerified: new Date() },
    });
    await prisma.emailVerificationCode.delete({ where: { email } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: "Invalid input" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
