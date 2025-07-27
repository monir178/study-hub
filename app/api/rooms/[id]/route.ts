import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { ApiResponse, ApiError } from "@/lib/api/types";

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

    const room = await prisma.studyRoom.findUnique({
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
        _count: {
          select: { members: true, messages: true, notes: true },
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

    // Check if user has access to this room
    const isMember = room.members.some(
      (member) => member.userId === session.user.id,
    );
    if (!room.isPublic && !isMember) {
      return NextResponse.json(
        {
          success: false,
          error: "Access denied",
        } satisfies ApiError,
        { status: 403 },
      );
    }

    const roomWithStatus = {
      ...room,
      memberCount: room._count.members,
      messageCount: room._count.messages,
      noteCount: room._count.notes,
      isJoined: isMember,
      onlineMembers: room.members.filter(
        (member) => member.status === "ONLINE" || member.status === "STUDYING",
      ).length,
      userRole: isMember
        ? room.members.find((member) => member.userId === session.user.id)?.role
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

    const room = await prisma.studyRoom.findUnique({
      where: { id: params.id },
      select: { creatorId: true },
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

    // Only room creator can delete the room
    if (room.creatorId !== session.user.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Permission denied",
        } satisfies ApiError,
        { status: 403 },
      );
    }

    await prisma.studyRoom.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      data: null,
      message: "Room deleted successfully",
    } satisfies ApiResponse<null>);
  } catch (error) {
    console.error("Error deleting room:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete room",
      } satisfies ApiError,
      { status: 500 },
    );
  }
}
