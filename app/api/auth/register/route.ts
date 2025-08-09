import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, validatePassword } from "@/lib/auth/password";
import { UnifiedEmailService } from "@/lib/email/unified-email.service";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["USER", "MODERATOR", "ADMIN"]).optional().default("USER"),
  otp: z.string().length(6).optional(),
});

function generateOtp(): string {
  return Array.from({ length: 6 })
    .map(() => Math.floor(Math.random() * 10))
    .join("");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = registerSchema.parse(body);

    // Common: reject if user already exists when finishing or starting
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User with this email already exists" },
        { status: 409 },
      );
    }

    // Step 1: No OTP provided → send OTP and return
    if (!validatedData.otp) {
      // Validate password strength up-front so users don't verify with a weak password
      const passwordValidation = validatePassword(validatedData.password);
      if (!passwordValidation.isValid) {
        return NextResponse.json(
          {
            success: false,
            message: "Password does not meet requirements",
            errors: passwordValidation.errors,
          },
          { status: 400 },
        );
      }

      const otp = generateOtp();
      const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes

      await prisma.emailVerificationCode.upsert({
        where: { email: validatedData.email },
        update: { code: otp, purpose: "VERIFY_EMAIL", expiresAt },
        create: {
          email: validatedData.email,
          code: otp,
          purpose: "VERIFY_EMAIL",
          expiresAt,
        },
      });

      // Send OTP email
      const emailResult = await UnifiedEmailService.sendOtpEmail(
        validatedData.email,
        otp,
        validatedData.name,
      );

      if (!emailResult.success) {
        return NextResponse.json(
          { success: false, message: "Failed to send verification code" },
          { status: 500 },
        );
      }

      return NextResponse.json({
        success: true,
        message: "Verification code sent. Please check your email.",
        requireOtp: true,
        expiresInSeconds: 120,
      });
    }

    // Step 2: OTP provided → verify and create user
    const record = await prisma.emailVerificationCode.findUnique({
      where: { email: validatedData.email },
    });

    if (
      !record ||
      record.code !== validatedData.otp ||
      record.purpose !== "VERIFY_EMAIL" ||
      record.expiresAt < new Date()
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired verification code" },
        { status: 400 },
      );
    }

    const passwordValidation = validatePassword(validatedData.password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Password does not meet requirements",
          errors: passwordValidation.errors,
        },
        { status: 400 },
      );
    }

    const hashedPassword = await hashPassword(validatedData.password);

    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        role: validatedData.role,
        emailVerified: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        emailVerified: true,
      },
    });

    await prisma.emailVerificationCode.delete({
      where: { email: validatedData.email },
    });

    // Optional: send welcome email after successful registration
    try {
      await UnifiedEmailService.sendWelcomeEmail(
        user.email,
        user.name || undefined,
      );
    } catch {
      // Do not fail on email error
    }

    return NextResponse.json({
      success: true,
      message: "Account created successfully",
      user,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid data provided",
          errors: error.issues?.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
