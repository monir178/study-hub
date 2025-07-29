import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Pusher from "pusher";

// Initialize Pusher
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

// POST - Join room
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
    } else {
      // Check room capacity
      if (room.members.length >= room.maxMembers) {
        return NextResponse.json(
          { success: false, error: "Room is full" },
          { status: 400 },
        );
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
    }

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
    await pusher.trigger(`room-${roomId}-members`, "member-joined", {
      roomId,
      member: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        role: session.user.role,
        status: "ONLINE",
      },
      memberCount: updatedRoom.members.length,
      onlineMembers: updatedRoom.members.filter((m) => m.status === "ONLINE")
        .length,
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
