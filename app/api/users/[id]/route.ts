import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateUserSchema = z.object({
  name: z.string().optional(),
  image: z.string().url().optional(),
  locale: z.enum(["en", "es"]).optional(),
  theme: z.enum(["LIGHT", "DARK", "SYSTEM"]).optional(),
  role: z.enum(["USER", "MODERATOR", "ADMIN"]).optional(),
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
        if (validatedData.role === "ADMIN") {
          return NextResponse.json(
            { error: "Forbidden: Moderator cannot assign admin role" },
            { status: 403 },
          );
        }
        if (targetUser.role !== "USER" && validatedData.role === "MODERATOR") {
          return NextResponse.json(
            { error: "Forbidden: Can only promote users to moderator" },
            { status: 403 },
          );
        }
      }
    }

    // Profile update permissions (non-role fields)
    const profileFields = { ...validatedData };
    delete profileFields.role;

    if (Object.keys(profileFields).length > 0) {
      // Check if user can update profile fields (own profile or admin)
      if (session.user.id !== id && session.user.role !== "ADMIN") {
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
        image: true,
        role: true,
        locale: true,
        theme: true,
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
