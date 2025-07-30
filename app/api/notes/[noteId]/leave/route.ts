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

    const { userId } = await request.json();

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

    // Broadcast user left to other users
    await pusherServer.trigger(`note-${noteId}`, "user-left", {
      id: userId,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error leaving note:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
