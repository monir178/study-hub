import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { triggerChatMessage, triggerMemberUpdate } from "@/lib/pusher";
import { z } from "zod";

const joinRoomSchema = z.object({
  password: z.string().optional(),
});

// POST - Join room (merged functionality)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: roomId } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    // Parse request body for password
    const body = await request.json().catch(() => ({}));
    const { password } = joinRoomSchema.parse(body);

    // Get room
    const room = await prisma.studyRoom.findUnique({
      where: { id: roomId },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!room) {
      return NextResponse.json(
        { success: false, error: "Room not found" },
        { status: 404 },
      );
    }

    // Check if user is already a member
    const existingMember = room.members.find(
      (member) => member.userId === session.user.id,
    );

    if (existingMember) {
      // Update status to ONLINE
      await prisma.roomMember.update({
        where: { id: existingMember.id },
        data: { status: "ONLINE" },
      });

      return NextResponse.json({
        success: true,
        message: "Already a member, status updated to online",
      });
    }

    // Check room capacity
    if (room.members.length >= room.maxMembers) {
      return NextResponse.json(
        { success: false, error: "Room is full" },
        { status: 400 },
      );
    }

    // Check password if room is private
    if (!room.isPublic && room.password) {
      if (!password || password.trim().length === 0) {
        return NextResponse.json(
          { success: false, error: "Password is required" },
          { status: 400 },
        );
      }
      if (room.password !== password) {
        return NextResponse.json(
          { success: false, error: "Invalid password" },
          { status: 400 },
        );
      }
    }

    // Add user to room
    await prisma.roomMember.create({
      data: {
        userId: session.user.id,
        roomId: roomId,
        status: "ONLINE",
        role: "MEMBER",
      },
    });

    // Create system message
    const systemMessage = await prisma.message.create({
      data: {
        content: `${session.user.name || session.user.email} joined the room`,
        type: "SYSTEM",
        authorId: session.user.id,
        roomId: roomId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            role: true,
          },
        },
      },
    });

    // Broadcast system message via Pusher
    await triggerChatMessage(roomId, {
      id: systemMessage.id,
      content: systemMessage.content,
      type: systemMessage.type,
      createdAt: systemMessage.createdAt,
      author: systemMessage.author,
    });

    // Get updated room data
    const updatedRoom = await prisma.studyRoom.findUnique({
      where: { id: roomId },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!updatedRoom) {
      return NextResponse.json(
        { success: false, error: "Failed to get updated room data" },
        { status: 500 },
      );
    }

    // Trigger Pusher event for member update
    await triggerMemberUpdate(roomId, "member-joined", {
      member: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        role: session.user.role,
      },
      memberCount: updatedRoom.members.length,
      members: updatedRoom.members.map((member) => ({
        id: member.id,
        user: {
          id: member.user.id,
          name: member.user.name,
          image: member.user.image,
        },
        role: member.role,
      })),
    });

    return NextResponse.json({
      success: true,
      room: updatedRoom,
    });
  } catch (error) {
    console.error("Error joining room:", error);
    return NextResponse.json(
      { success: false, error: "Failed to join room" },
      { status: 500 },
    );
  }
}
