import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { ApiResponse, ApiError } from "@/lib/api/types";

// Helper function to check if user can delete a room
async function checkDeletePermission(
  userId: string,
  roomId: string,
): Promise<boolean> {
  try {
    // Get user's role
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) return false;

    // Admin can delete any room
    if (user.role === "ADMIN") return true;

    // Get room details with creator info
    const room = await prisma.studyRoom.findUnique({
      where: { id: roomId },
      include: {
        creator: {
          select: { role: true },
        },
      },
    });

    if (!room) return false;

    // Room creator can always delete
    if (room.creatorId === userId) return true;

    // Moderator can delete rooms except those created by Admin
    if (user.role === "MODERATOR") {
      return room.creator.role !== "ADMIN";
    }

    return false;
  } catch (error) {
    console.error("Error checking delete permission:", error);
    return false;
  }
}

const updateRoomSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  isPublic: z.boolean().optional(),
  maxMembers: z.number().min(2).max(50).optional(),
  password: z.string().optional(),
});

// GET /api/rooms/[id] - Get room details
export async function GET(
  request: NextRequest,
  { params: paramsPromise }: { params: Promise<{ id: string }> },
) {
  try {
    const params = await paramsPromise;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        } satisfies ApiError,
        { status: 401 },
      );
    }

    // Add diagnostic information for debugging
    const diagnostic = await prisma.studyRoom.findUnique({
      where: { id: params.id },
      include: {
        creator: {
          select: { id: true, name: true, image: true, role: true },
        },
        members: {
          include: {
            user: {
              select: { id: true, name: true, image: true },
            },
          },
          orderBy: { joinedAt: "asc" },
        },
        notes: {
          select: { id: true, title: true, updatedAt: true },
          orderBy: { updatedAt: "desc" },
          take: 5,
        },
        studySessions: {
          select: { id: true, status: true, startedAt: true },
          orderBy: { startedAt: "desc" },
          take: 10,
        },
        messages: {
          select: { id: true, type: true, createdAt: true },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        _count: {
          select: {
            members: true,
            messages: true,
            notes: true,
            studySessions: true,
          },
        },
      },
    });

    if (!diagnostic) {
      return NextResponse.json(
        {
          success: false,
          error: "Room not found",
        } satisfies ApiError,
        { status: 404 },
      );
    }

    // Check if user has access to this room
    const isMember = diagnostic.members.some(
      (member) => member.userId === session.user.id,
    );
    if (!diagnostic.isPublic && !isMember) {
      return NextResponse.json(
        {
          success: false,
          error: "Access denied",
        } satisfies ApiError,
        { status: 403 },
      );
    }

    const roomWithStatus = {
      ...diagnostic,
      memberCount: diagnostic._count.members,
      messageCount: diagnostic._count.messages,
      noteCount: diagnostic._count.notes,
      isJoined: isMember,
      onlineMembers: diagnostic.members.filter(
        (member) => member.status === "ONLINE" || member.status === "STUDYING",
      ).length,
      userRole: isMember
        ? diagnostic.members.find((member) => member.userId === session.user.id)
            ?.role
        : null,
    };

    return NextResponse.json({
      success: true,
      data: roomWithStatus,
    } satisfies ApiResponse<typeof roomWithStatus>);
  } catch (error) {
    console.error("Error fetching room:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch room",
      } satisfies ApiError,
      { status: 500 },
    );
  }
}

// PUT /api/rooms/[id] - Update room
export async function PUT(
  request: NextRequest,
  { params: paramsPromise }: { params: Promise<{ id: string }> },
) {
  try {
    const params = await paramsPromise;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        } satisfies ApiError,
        { status: 401 },
      );
    }

    const body = await request.json();
    const validatedData = updateRoomSchema.parse(body);

    // Check if user is room creator or admin
    const room = await prisma.studyRoom.findUnique({
      where: { id: params.id },
      include: {
        members: {
          where: { userId: session.user.id },
        },
      },
    });

    if (!room) {
      return NextResponse.json(
        {
          success: false,
          error: "Room not found",
        } satisfies ApiError,
        { status: 404 },
      );
    }

    const userMember = room.members[0];
    const canEdit =
      room.creatorId === session.user.id ||
      userMember?.role === "ADMIN" ||
      userMember?.role === "MODERATOR";

    if (!canEdit) {
      return NextResponse.json(
        {
          success: false,
          error: "Permission denied",
        } satisfies ApiError,
        { status: 403 },
      );
    }

    const updatedRoom = await prisma.studyRoom.update({
      where: { id: params.id },
      data: validatedData,
      include: {
        creator: {
          select: { id: true, name: true, image: true, role: true },
        },
        members: {
          include: {
            user: {
              select: { id: true, name: true, image: true },
            },
          },
        },
        _count: {
          select: { members: true, messages: true },
        },
      },
    });

    const roomWithStatus = {
      ...updatedRoom,
      memberCount: updatedRoom._count.members,
      messageCount: updatedRoom._count.messages,
      isJoined: true,
      onlineMembers: updatedRoom.members.filter(
        (member) => member.status === "ONLINE" || member.status === "STUDYING",
      ).length,
    };

    return NextResponse.json({
      success: true,
      data: roomWithStatus,
      message: "Room updated successfully",
    } satisfies ApiResponse<typeof roomWithStatus>);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          message: error.issues.map((e) => e.message).join(", "),
        } satisfies ApiError,
        { status: 400 },
      );
    }

    console.error("Error updating room:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update room",
      } satisfies ApiError,
      { status: 500 },
    );
  }
}

// DELETE /api/rooms/[id] - Delete room
export async function DELETE(
  request: NextRequest,
  { params: paramsPromise }: { params: Promise<{ id: string }> },
) {
  try {
    const params = await paramsPromise;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        } satisfies ApiError,
        { status: 401 },
      );
    }

    // Check if user can delete the room first
    const canDelete = await checkDeletePermission(session.user.id, params.id);
    if (!canDelete) {
      return NextResponse.json(
        {
          success: false,
          error: "Permission denied",
        } satisfies ApiError,
        { status: 403 },
      );
    }

    // Verify room exists before attempting deletion
    const roomExists = await prisma.studyRoom.findUnique({
      where: { id: params.id },
      select: { id: true },
    });

    if (!roomExists) {
      return NextResponse.json(
        {
          success: false,
          error: "Room not found",
        } satisfies ApiError,
        { status: 404 },
      );
    }

    // Use a transaction to ensure atomic deletion
    await prisma.$transaction(async (tx) => {
      // Delete related records first to avoid cascade issues
      await tx.studySession.deleteMany({
        where: { roomId: params.id },
      });

      await tx.noteEdit.deleteMany({
        where: {
          note: {
            roomId: params.id,
          },
        },
      });

      await tx.note.deleteMany({
        where: { roomId: params.id },
      });

      await tx.message.deleteMany({
        where: { roomId: params.id },
      });

      await tx.roomMember.deleteMany({
        where: { roomId: params.id },
      });

      // Finally delete the room
      await tx.studyRoom.delete({
        where: { id: params.id },
      });
    });

    return NextResponse.json({
      success: true,
      data: null,
      message: "Room deleted successfully",
    } satisfies ApiResponse<null>);
  } catch (error) {
    console.error("Error deleting room:", error);

    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes("timeout")) {
        return NextResponse.json(
          {
            success: false,
            error: "Delete operation timed out. Please try again.",
          } satisfies ApiError,
          { status: 408 },
        );
      }

      if (error.message.includes("foreign key")) {
        return NextResponse.json(
          {
            success: false,
            error: "Cannot delete room due to existing references.",
          } satisfies ApiError,
          { status: 409 },
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete room. Please try again.",
      } satisfies ApiError,
      { status: 500 },
    );
  }
}
