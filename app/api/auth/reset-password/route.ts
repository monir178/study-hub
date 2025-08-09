import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, validatePassword } from "@/lib/auth/password";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  token: z.string().min(32), // Reset token is 32 characters
  newPassword: z.string().min(8),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, token, newPassword } = schema.parse(body);

    const validate = validatePassword(newPassword);
    if (!validate.isValid) {
      return NextResponse.json(
        { success: false, message: "Weak password", errors: validate.errors },
        { status: 400 },
      );
    }

    const record = await prisma.emailVerificationCode.findUnique({
      where: { email },
    });
    if (
      !record ||
      record.code !== token ||
      record.purpose !== "RESET_PASSWORD" ||
      record.expiresAt < new Date()
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 400 },
      );
    }

    const hashed = await hashPassword(newPassword);
    await prisma.user.update({ where: { email }, data: { password: hashed } });
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
