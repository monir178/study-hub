import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";

interface RouteParams {
  params: Promise<{ noteId: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { noteId } = await params;
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { lock } = await request.json();

    const note = await prisma.note.findUnique({
      where: { id: noteId },
      include: {
        room: {
          include: {
            members: {
              where: { userId: user.id },
            },
            creator: true,
          },
        },
      },
    });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    // Check if user has access to the room
    if (note.room.members.length === 0) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Check if user has permission to lock/unlock (room creator or admin/moderator)
    const member = note.room.members[0];
    const canLock =
      note.room.creator.id === user.id ||
      member.role === "ADMIN" ||
      member.role === "MODERATOR";

    if (!canLock) {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }

    // For now, we'll store lock status in a separate field or use a different approach
    // Since the current schema doesn't have isLocked field, we'll simulate it
    // In a real implementation, you'd add isLocked and lockedBy fields to the Note model

    const noteWithLockStatus = {
      ...note,
      isLocked: lock,
      lockedBy: lock ? user.id : null,
      version: Math.floor(new Date(note.updatedAt).getTime() / 1000),
    };

    // Broadcast lock status change to room members
    await pusherServer.trigger(
      `room-${note.roomId}-notes`,
      "note-lock-changed",
      {
        noteId,
        isLocked: lock,
        lockedBy: lock ? user.id : null,
        lockedByName: lock ? user.name : null,
        userId: user.id,
        userName: user.name,
      },
    );

    return NextResponse.json(noteWithLockStatus);
  } catch (error) {
    console.error("Error toggling note lock:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
