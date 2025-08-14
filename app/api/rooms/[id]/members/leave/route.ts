import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { triggerChatMessage, triggerMemberUpdate } from "@/lib/pusher";

// POST - Leave room
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

    // Find user's membership
    const member = room.members.find(
      (member) => member.userId === session.user.id,
    );

    if (!member) {
      return NextResponse.json(
        { success: false, error: "Not a member of this room" },
        { status: 400 },
      );
    }

    // Remove user from room
    await prisma.roomMember.delete({
      where: { id: member.id },
    });

    // Create system message
    const systemMessage = await prisma.message.create({
      data: {
        content: `${session.user.name || session.user.email} left the room`,
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

    // Trigger member update for room
    await triggerMemberUpdate(roomId, "member-left", {
      member: {
        id: session.user.id,
        name: session.user.name || session.user.email || "Unknown User",
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
    console.error("Error leaving room:", error);
    return NextResponse.json(
      { success: false, error: "Failed to leave room" },
      { status: 500 },
    );
  }
}
