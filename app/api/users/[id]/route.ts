import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateUserSchema = z.object({
  name: z.string().nullable().optional(),
  image: z.string().url().nullable().optional(),
  locale: z.enum(["en", "es"]).optional(),
  theme: z.enum(["LIGHT", "DARK", "SYSTEM"]).optional(),
  role: z.enum(["USER", "MODERATOR", "ADMIN"]).optional(),

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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Validate request body
    const validatedData = updateUserSchema.parse(body);

    // Get the target user to check current role
    const targetUser = await prisma.user.findUnique({
      where: { id },
      select: { id: true, role: true },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Role update permissions
    if (validatedData.role) {
      // Only admin and moderator can change roles
      if (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR") {
        return NextResponse.json(
          { error: "Forbidden: Cannot change roles" },
          { status: 403 },
        );
      }

      // Admin role cannot be changed by anyone except themselves
      if (targetUser.role === "ADMIN" && session.user.id !== id) {
        return NextResponse.json(
          { error: "Forbidden: Cannot change admin role" },
          { status: 403 },
        );
      }

      // Only admin can assign admin role
      if (validatedData.role === "ADMIN" && session.user.role !== "ADMIN") {
        return NextResponse.json(
          { error: "Forbidden: Only admin can assign admin role" },
          { status: 403 },
        );
      }

      // Moderator can only promote users to moderator, not to admin
      if (session.user.role === "MODERATOR") {
        console.log("Moderator attempting role change:", {
          sessionUserRole: session.user.role,
          targetUserId: id,
          targetUserRole: targetUser.role,
          requestedRole: validatedData.role,
        });

        if (validatedData.role === "ADMIN") {
          console.log("❌ Blocked: Moderator trying to assign admin role");
          return NextResponse.json(
            { error: "Forbidden: Moderator cannot assign admin role" },
            { status: 403 },
          );
        }

        // Moderator can only promote USER to MODERATOR
        if (targetUser.role !== "USER") {
          console.log(
            "❌ Blocked: Target user is not USER role, target role:",
            targetUser.role,
          );
          return NextResponse.json(
            { error: "Forbidden: Can only promote users to moderator" },
            { status: 403 },
          );
        }

        // Moderator can only assign MODERATOR role to users
        if (validatedData.role !== "MODERATOR") {
          console.log(
            "❌ Blocked: Trying to assign non-moderator role:",
            validatedData.role,
          );
          return NextResponse.json(
            { error: "Forbidden: Can only promote users to moderator role" },
            { status: 403 },
          );
        }

        console.log("✅ Moderator role change approved");
      }
    }

    // Profile update permissions (non-role fields)
    const profileFields = { ...validatedData };
    delete profileFields.role;

    console.log("Profile fields check:", {
      profileFieldsCount: Object.keys(profileFields).length,
      profileFields: Object.keys(profileFields),
      sessionUserId: session.user.id,
      targetUserId: id,
      sessionUserRole: session.user.role,
    });

    if (Object.keys(profileFields).length > 0) {
      // Check if user can update profile fields (own profile, admin, or moderator changing roles)
      const canUpdateProfile =
        session.user.id === id || // Own profile
        session.user.role === "ADMIN" || // Admin can update anyone
        (session.user.role === "MODERATOR" && validatedData.role); // Moderator changing roles

      if (!canUpdateProfile) {
        console.log("❌ Blocked: Profile update permission denied");
        return NextResponse.json(
          { error: "Forbidden: Cannot update other user's profile" },
          { status: 403 },
        );
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id },
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
    console.error("Error updating user:", error);

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

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admin can delete users
    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: Only admin can delete users" },
        { status: 403 },
      );
    }

    const { id } = await params;

    // Get the target user to check role
    const targetUser = await prisma.user.findUnique({
      where: { id },
      select: { id: true, role: true },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Admin users cannot be deleted
    if (targetUser.role === "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: Cannot delete admin users" },
        { status: 403 },
      );
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
