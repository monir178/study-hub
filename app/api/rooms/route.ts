import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { ApiResponse, ApiError } from "@/lib/api/types";
import { TimerStore } from "@/lib/timer/server/timer-store";

const createRoomSchema = z.object({
  name: z
    .string()
    .min(1, "Room name is required")
    .max(100, "Room name too long"),
  description: z.string().max(500, "Description too long").optional(),
  isPublic: z.boolean().default(true),
  maxMembers: z.number().min(2).max(50).default(10),
  password: z.string().optional(),
});

// GET /api/rooms - List all public rooms or user's rooms
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
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const myRooms = searchParams.get("myRooms") === "true";

    const skip = (page - 1) * limit;

    const where = myRooms
      ? {
          creatorId: session.user.id, // Only rooms created by the current user
        }
      : {
          isPublic: true,
          ...(search && {
            OR: [
              { name: { contains: search, mode: "insensitive" as const } },
              {
                description: { contains: search, mode: "insensitive" as const },
              },
            ],
          }),
        };

    const [rooms, total] = await Promise.all([
      prisma.studyRoom.findMany({
        where,
        include: {
          creator: {
            select: { id: true, name: true, image: true, role: true },
          },
          members: {
            include: {
              user: {
                select: { id: true, name: true, image: true },
              },
            },
          },
          _count: {
            select: { members: true, messages: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.studyRoom.count({ where }),
    ]);

    const roomsWithStatus = rooms.map((room) => ({
      ...room,
      memberCount: room._count.members,
      messageCount: room._count.messages,
      isJoined: room.members.some(
        (member) => member.userId === session.user.id,
      ),
      onlineMembers: room.members.filter(
        (member) => member.status === "ONLINE" || member.status === "STUDYING",
      ).length,
    }));

    return NextResponse.json({
      success: true,
      data: {
        rooms: roomsWithStatus,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    } satisfies ApiResponse<{
      rooms: typeof roomsWithStatus;
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    }>);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch rooms",
      } satisfies ApiError,
      { status: 500 },
    );
  }
}

// POST /api/rooms - Create a new study room
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
    const validatedData = createRoomSchema.parse(body);

    // Check if user has reached room creation limit (optional)
    const userRoomCount = await prisma.studyRoom.count({
      where: { creatorId: session.user.id },
    });

    if (userRoomCount >= 10) {
      // Limit to 10 rooms per user
      return NextResponse.json(
        {
          success: false,
          error: "Room creation limit reached",
        } satisfies ApiError,
        { status: 400 },
      );
    }

    const room = await prisma.studyRoom.create({
      data: {
        ...validatedData,
        creatorId: session.user.id,
        members: {
          create: {
            userId: session.user.id,
            role: "ADMIN",
            status: "ONLINE",
          },
        },
      },
      include: {
        creator: {
          select: { id: true, name: true, image: true },
        },
        members: {
          include: {
            user: {
              select: { id: true, name: true, image: true },
            },
          },
        },
        _count: {
          select: { members: true, messages: true },
        },
      },
    });

    // Initialize default timer for the new room
    await TimerStore.setTimer(room.id, {
      roomId: room.id,
      phase: "focus",
      remaining: 25 * 60, // 25 minutes
      isRunning: false,
      isPaused: false,
      controlledBy: "",
      session: 1,
      totalSessions: 4,
    });

    const roomWithStatus = {
      ...room,
      memberCount: room._count.members,
      messageCount: room._count.messages,
      isJoined: true,
      onlineMembers: 1,
    };

    return NextResponse.json(
      {
        success: true,
        data: roomWithStatus,
        message: "Room created successfully",
      } satisfies ApiResponse<typeof roomWithStatus>,
      { status: 201 },
    );
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

    console.error("Error creating room:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create room",
      } satisfies ApiError,
      { status: 500 },
    );
  }
}
