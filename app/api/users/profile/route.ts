import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().nullable().optional(),
  image: z.string().url().nullable().optional(),
  locale: z.enum(["en", "es"]).optional(),
  theme: z.enum(["LIGHT", "DARK", "SYSTEM"]).optional(),

  // Additional profile fields
  phoneNumber: z.string().nullable().optional(),
  gender: z
    .enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"])
    .nullable()
    .optional(),
  dateOfBirth: z
    .string()
    .datetime()
    .nullable()
    .optional()
    .transform((val) => (val ? new Date(val) : null)),

  // Address fields
  street: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  region: z.string().nullable().optional(),
  postalCode: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
});

// GET /api/users/profile - Get current user profile
export async function GET(_request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        role: true,
        locale: true,
        theme: true,

        // Additional profile fields
        phoneNumber: true,
        gender: true,
        dateOfBirth: true,

        // Address fields
        street: true,
        city: true,
        region: true,
        postalCode: true,
        country: true,

        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// PATCH /api/users/profile - Update current user profile
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updateProfileSchema.parse(body);

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: validatedData,
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        role: true,
        locale: true,
        theme: true,

        // Additional profile fields
        phoneNumber: true,
        gender: true,
        dateOfBirth: true,

        // Address fields
        street: true,
        city: true,
        region: true,
        postalCode: true,
        country: true,

        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.issues },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
