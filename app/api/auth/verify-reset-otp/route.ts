import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import crypto from "crypto";

const schema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
});

export async function PUT(req: NextRequest) {
  try {
    const { email, otp } = schema.parse(await req.json());

    // Find the OTP record
    const record = await prisma.emailVerificationCode.findUnique({
      where: { email },
    });

    if (
      !record ||
      record.code !== otp ||
      record.purpose !== "RESET_PASSWORD" ||
      record.expiresAt < new Date()
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired OTP" },
        { status: 400 },
      );
    }

    // Generate a reset token for the password reset step
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Update the record with the reset token and extend expiry for password reset
    await prisma.emailVerificationCode.update({
      where: { email },
      data: {
        code: resetToken,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes for password reset
      },
    });

    return NextResponse.json({
      success: true,
      token: resetToken,
      message: "OTP verified successfully",
    });
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
