import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { ApiResponse, ApiError } from "@/lib/api/types";

const joinRoomSchema = z.object({
  password: z.string().optional(),
});

// POST /api/rooms/[id]/join - Join a room
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
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
    const { password } = joinRoomSchema.parse(body);

    const room = await prisma.studyRoom.findUnique({
      where: { id: params.id },
      include: {
        members: true,
        _count: { select: { members: true } },
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

    // Check if already a member
    const existingMember = room.members.find(
      (member) => member.userId === session.user.id,
    );
    if (existingMember) {
      // Update status to online if already a member
      await prisma.roomMember.update({
        where: { id: existingMember.id },
        data: { status: "ONLINE" },
      });

      return NextResponse.json({
        success: true,
        data: null,
        message: "Already a member, status updated to online",
      } satisfies ApiResponse<null>);
    }

    // Check room capacity
    if (room._count.members >= room.maxMembers) {
      return NextResponse.json(
        {
          success: false,
          error: "Room is full",
        } satisfies ApiError,
        { status: 400 },
      );
    }

    // Check password if room is private
    if (!room.isPublic && room.password && room.password !== password) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid password",
        } satisfies ApiError,
        { status: 401 },
      );
    }

    // Add user to room
    await prisma.roomMember.create({
      data: {
        userId: session.user.id,
        roomId: params.id,
        role: "MEMBER",
        status: "ONLINE",
      },
    });

    // Create system message
    await prisma.message.create({
      data: {
        content: `${session.user.name || session.user.email} joined the room`,
        type: "SYSTEM",
        authorId: session.user.id,
        roomId: params.id,
      },
    });

    return NextResponse.json({
      success: true,
      data: null,
      message: "Successfully joined the room",
    } satisfies ApiResponse<null>);
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

    console.error("Error joining room:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to join room",
      } satisfies ApiError,
      { status: 500 },
    );
  }
}

// DELETE /api/rooms/[id]/join - Leave a room
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
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

    // Room creator cannot leave their own room
    if (room.creatorId === session.user.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Room creator cannot leave the room",
        } satisfies ApiError,
        { status: 400 },
      );
    }

    const member = await prisma.roomMember.findFirst({
      where: {
        userId: session.user.id,
        roomId: params.id,
      },
    });

    if (!member) {
      return NextResponse.json(
        {
          success: false,
          error: "You are not a member of this room",
        } satisfies ApiError,
        { status: 400 },
      );
    }

    // Remove user from room
    await prisma.roomMember.delete({
      where: { id: member.id },
    });

    // Create system message
    await prisma.message.create({
      data: {
        content: `${session.user.name || session.user.email} left the room`,
        type: "SYSTEM",
        authorId: session.user.id,
        roomId: params.id,
      },
    });

    return NextResponse.json({
      success: true,
      data: null,
      message: "Successfully left the room",
    } satisfies ApiResponse<null>);
  } catch (error) {
    console.error("Error leaving room:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to leave room",
      } satisfies ApiError,
      { status: 500 },
    );
  }
}
