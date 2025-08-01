import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: Return all notes for the room
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: roomId } = await params;

    // Get the room and check if user has access
    const room = await prisma.studyRoom.findUnique({
      where: { id: roomId },
      include: {
        members: {
          include: {
            user: true,
          },
        },
        creator: true,
      },
    });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // Check if user is a member of the room
    const userMember = room.members.find(
      (member) => member.user.email === session.user.email,
    );

    if (!userMember && !room.isPublic) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Get all notes for this room
    const notes = await prisma.note.findMany({
      where: { roomId },
      include: {
        creator: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: notes,
    });
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST: Create a new note
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: roomId } = await params;
    const { title, content } = await request.json();

    // Get the room and check permissions
    const room = await prisma.studyRoom.findUnique({
      where: { id: roomId },
      include: {
        members: {
          include: {
            user: true,
          },
        },
        creator: true,
      },
    });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // Get current user
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user can create notes
    const canCreate = await checkNoteCreatePermissions(room, currentUser);
    if (!canCreate) {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }

    // Create the note
    console.log("Creating note with data:", {
      title,
      content,
      roomId,
      createdBy: currentUser.id,
    });
    const note = await prisma.note.create({
      data: {
        title: title || "Untitled Note",
        content: content || "",
        roomId,
        createdBy: currentUser.id,
      },
      include: {
        creator: true,
      },
    });

    console.log("Created note:", note);
    return NextResponse.json({
      success: true,
      data: note,
    });
  } catch (error) {
    console.error("Error creating note:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Helper function to check note creation permissions
async function checkNoteCreatePermissions(
  room: {
    creatorId: string;
    isPublic: boolean;
    members: Array<{
      user: { id: string };
      role: string;
    }>;
  },
  currentUser: {
    id: string;
    role: string;
  },
) {
  // Room owner can create notes
  if (room.creatorId === currentUser.id) {
    return true;
  }

  // Admins and moderators can create notes
  if (currentUser.role === "ADMIN" || currentUser.role === "MODERATOR") {
    return true;
  }

  // In public rooms, any member can create notes
  if (room.isPublic) {
    return true;
  }

  // In private rooms, only room members with appropriate roles can create notes
  const userMember = room.members.find(
    (member) => member.user.id === currentUser.id,
  );

  if (userMember) {
    return ["ADMIN", "MODERATOR", "MEMBER"].includes(userMember.role);
  }

  return false;
}
