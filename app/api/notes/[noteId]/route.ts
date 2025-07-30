import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";

interface RouteParams {
  params: Promise<{ noteId: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
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

    const note = await prisma.note.findUnique({
      where: { id: noteId },
      include: {
        room: {
          include: {
            members: {
              where: { userId: user.id },
            },
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

    const noteWithVersion = {
      ...note,
      version: Math.floor(new Date(note.updatedAt).getTime() / 1000),
    };

    return NextResponse.json(noteWithVersion);
  } catch (error) {
    console.error("Error fetching note:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
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

    const { title, content } = await request.json();

    const existingNote = await prisma.note.findUnique({
      where: { id: noteId },
      include: {
        room: {
          include: {
            members: {
              where: { userId: user.id },
            },
          },
        },
      },
    });

    if (!existingNote) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    // Check if user has access to the room
    if (existingNote.room.members.length === 0) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Check if note is locked (implement lock logic here if needed)
    // For now, we'll skip version conflict checking for simplicity

    const updatedNote = await prisma.note.update({
      where: { id: noteId },
      data: {
        ...(title && { title }),
        ...(content && { content }),
      },
    });

    const noteWithVersion = {
      ...updatedNote,
      version: Math.floor(new Date(updatedNote.updatedAt).getTime() / 1000),
    };

    // Broadcast note update to room members
    await pusherServer.trigger(
      `room-${existingNote.roomId}-notes`,
      "note-updated",
      {
        note: noteWithVersion,
        userId: user.id,
        userName: user.name,
      },
    );

    return NextResponse.json(noteWithVersion);
  } catch (error) {
    console.error("Error updating note:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
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

    // Check if user has permission to delete (room creator or admin/moderator)
    const member = note.room.members[0];
    const canDelete =
      note.room.creator.id === user.id ||
      member.role === "ADMIN" ||
      member.role === "MODERATOR";

    if (!canDelete) {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }

    await prisma.note.delete({
      where: { id: noteId },
    });

    // Broadcast note deletion to room members
    await pusherServer.trigger(`room-${note.roomId}-notes`, "note-deleted", {
      noteId,
      userId: user.id,
      userName: user.name,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting note:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
