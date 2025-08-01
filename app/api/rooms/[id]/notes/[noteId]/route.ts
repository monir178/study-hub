import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: Return a specific note
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; noteId: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: roomId, noteId } = await params;

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

    // Get the specific note
    const note = await prisma.note.findFirst({
      where: {
        id: noteId,
        roomId,
      },
      include: {
        creator: true,
      },
    });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: note,
    });
  } catch (error) {
    console.error("Error fetching note:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// PATCH: Update a specific note
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; noteId: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: roomId, noteId } = await params;
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

    // Get the note
    const note = await prisma.note.findFirst({
      where: {
        id: noteId,
        roomId,
      },
    });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    // Check if user can edit the note
    const canEdit = await checkNoteEditPermissions(room, currentUser, note);
    if (!canEdit) {
      return NextResponse.json(
        { error: "You don't have permission to edit this note" },
        { status: 403 },
      );
    }

    // Update the note
    const updatedNote = await prisma.note.update({
      where: { id: noteId },
      data: {
        title,
        content,
        version: {
          increment: 1,
        },
      },
      include: {
        creator: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedNote,
    });
  } catch (error) {
    console.error("Error updating note:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// DELETE: Delete a specific note
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; noteId: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: roomId, noteId } = await params;

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

    // Get the note
    const note = await prisma.note.findFirst({
      where: {
        id: noteId,
        roomId,
      },
    });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    // Check if user can delete the note
    const canDelete = await checkNoteDeletePermissions(room, currentUser, note);
    if (!canDelete) {
      return NextResponse.json(
        { error: "You don't have permission to delete this note" },
        { status: 403 },
      );
    }

    // Delete the note
    await prisma.note.delete({
      where: { id: noteId },
    });

    return NextResponse.json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting note:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Helper function to check note edit permissions
async function checkNoteEditPermissions(
  room: {
    creatorId: string;
    isPublic: boolean;
    members: Array<{
      userId: string;
    }>;
  },
  currentUser: {
    id: string;
    role: string;
  },
  note: {
    createdBy: string;
  },
) {
  // Note creator can always edit
  if (note.createdBy === currentUser.id) {
    return true;
  }

  // Room owner can edit any note
  if (room.creatorId === currentUser.id) {
    return true;
  }

  // Admins and moderators can edit
  if (currentUser.role === "ADMIN" || currentUser.role === "MODERATOR") {
    return true;
  }

  // For private rooms, only room members can edit
  if (!room.isPublic) {
    const isMember = room.members.some(
      (member) => member.userId === currentUser.id,
    );
    return isMember;
  }

  // For public rooms, everyone can edit
  return true;
}

// Helper function to check note delete permissions
async function checkNoteDeletePermissions(
  room: {
    creatorId: string;
    members: Array<{
      userId: string;
      role: string;
    }>;
  },
  currentUser: {
    id: string;
    role: string;
  },
  note: {
    createdBy: string;
  },
) {
  // Note creator can always delete
  if (note.createdBy === currentUser.id) {
    return true;
  }

  // Room owner can delete any note
  if (room.creatorId === currentUser.id) {
    return true;
  }

  // Admins can delete any note
  if (currentUser.role === "ADMIN") {
    return true;
  }

  // Moderators can delete notes in their rooms
  if (currentUser.role === "MODERATOR") {
    const isMember = room.members.some(
      (member) =>
        member.userId === currentUser.id && member.role === "MODERATOR",
    );
    return isMember;
  }

  return false;
}
