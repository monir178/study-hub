import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";

interface RouteParams {
  params: Promise<{ noteId: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
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

    const operation = await request.json();

    // Verify user has access to the note
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

    if (!note || note.room.members.length === 0) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Store the operation in database for conflict resolution
    await prisma.noteEdit.create({
      data: {
        operation: JSON.stringify(operation),
        userId: user.id,
        noteId: noteId,
      },
    });

    // Broadcast operation to other users
    await pusherServer.trigger(`note-${noteId}`, "operation", {
      ...operation,
      userId: user.id,
      userName: user.name,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error broadcasting operation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
