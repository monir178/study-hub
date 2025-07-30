import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get("roomId");

    if (!roomId) {
      return NextResponse.json(
        { error: "Room ID is required" },
        { status: 400 },
      );
    }

    // Check if user is a member of the room
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const roomMember = await prisma.roomMember.findUnique({
      where: {
        userId_roomId: {
          userId: user.id,
          roomId: roomId,
        },
      },
    });

    if (!roomMember) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const notes = await prisma.note.findMany({
      where: { roomId },
      orderBy: { updatedAt: "desc" },
    });

    // Transform notes to include version (using updatedAt as version for now)
    const notesWithVersion = notes.map((note) => ({
      ...note,
      version: Math.floor(new Date(note.updatedAt).getTime() / 1000),
    }));

    return NextResponse.json(notesWithVersion);
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { title, content = "", roomId } = await request.json();

    if (!title || !roomId) {
      return NextResponse.json(
        { error: "Title and room ID are required" },
        { status: 400 },
      );
    }

    // Check if user is a member of the room
    const roomMember = await prisma.roomMember.findUnique({
      where: {
        userId_roomId: {
          userId: user.id,
          roomId: roomId,
        },
      },
    });

    if (!roomMember) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const note = await prisma.note.create({
      data: {
        title,
        content,
        roomId,
      },
    });

    const noteWithVersion = {
      ...note,
      version: Math.floor(new Date(note.updatedAt).getTime() / 1000),
    };

    // Broadcast note creation to room members
    await pusherServer.trigger(`room-${roomId}-notes`, "note-created", {
      note: noteWithVersion,
      userId: user.id,
      userName: user.name,
    });

    return NextResponse.json(noteWithVersion, { status: 201 });
  } catch (error) {
    console.error("Error creating note:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
