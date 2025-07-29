import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { triggerChatMessage } from "@/lib/pusher";
import { ApiResponse, ApiError } from "@/lib/api/types";
import { z } from "zod";

const createMessageSchema = z.object({
  content: z.string().min(1).max(2000),
  type: z.enum(["TEXT", "SYSTEM", "FILE"]).default("TEXT"),
  roomId: z.string(),
  fileUrl: z.string().optional(),
  fileName: z.string().optional(),
  fileType: z.string().optional(),
});

// POST /api/messages - Create a new message
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        } satisfies ApiError,
        { status: 401 },
      );
    }

    const body = await request.json();
    const validatedData = createMessageSchema.parse(body);

    // Check if user is a member of the room
    const roomMember = await prisma.roomMember.findUnique({
      where: {
        userId_roomId: {
          userId: session.user.id,
          roomId: validatedData.roomId,
        },
      },
    });

    if (!roomMember) {
      return NextResponse.json(
        {
          success: false,
          error: "You are not a member of this room",
        } satisfies ApiError,
        { status: 403 },
      );
    }

    // For FILE type messages, ensure content contains the URL
    let messageContent = validatedData.content;
    if (validatedData.type === "FILE" && validatedData.fileUrl) {
      // If content is not a URL but fileUrl is provided, use fileUrl as content
      if (!messageContent.startsWith("http")) {
        messageContent = validatedData.fileUrl;
      }
    }

    // Create the message
    const message = await prisma.message.create({
      data: {
        content: messageContent,
        type: validatedData.type,
        authorId: session.user.id,
        roomId: validatedData.roomId,
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

    // Trigger real-time update
    await triggerChatMessage(validatedData.roomId, {
      id: message.id,
      content: message.content,
      type: message.type,
      createdAt: message.createdAt,
      author: message.author,
    });

    return NextResponse.json({
      success: true,
      data: message,
      message: "Message sent successfully",
    } satisfies ApiResponse<typeof message>);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          message: error.issues.map((e) => e.message).join(", "),
        } satisfies ApiError,
        { status: 400 },
      );
    }

    console.error("Error creating message:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send message",
      } satisfies ApiError,
      { status: 500 },
    );
  }
}

// GET /api/messages - Get messages for a room
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        } satisfies ApiError,
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get("roomId");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    if (!roomId) {
      return NextResponse.json(
        {
          success: false,
          error: "Room ID is required",
        } satisfies ApiError,
        { status: 400 },
      );
    }

    // Check if user is a member of the room
    const roomMember = await prisma.roomMember.findUnique({
      where: {
        userId_roomId: {
          userId: session.user.id,
          roomId: roomId,
        },
      },
    });

    if (!roomMember) {
      return NextResponse.json(
        {
          success: false,
          error: "You are not a member of this room",
        } satisfies ApiError,
        { status: 403 },
      );
    }

    // Get messages with pagination
    const messages = await prisma.message.findMany({
      where: {
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
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      skip: offset,
    });

    // Get total count for pagination
    const totalCount = await prisma.message.count({
      where: {
        roomId: roomId,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        messages: messages.reverse(), // Show oldest first
        pagination: {
          total: totalCount,
          limit,
          offset,
          hasMore: offset + limit < totalCount,
        },
      },
    } satisfies ApiResponse<{
      messages: typeof messages;
      pagination: {
        total: number;
        limit: number;
        offset: number;
        hasMore: boolean;
      };
    }>);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch messages",
      } satisfies ApiError,
      { status: 500 },
    );
  }
}
