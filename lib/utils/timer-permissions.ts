import { prisma } from "@/lib/prisma";

/**
 * Check if a user can control a room's timer based on role hierarchy:
 * - ADMIN: Can control any room (including their own)
 * - MODERATOR: Can control USER rooms (including their own) but NOT other MODERATOR or ADMIN rooms
 * - USER: Can only control their own rooms
 */
export async function canControlRoomTimer(
  userId: string,
  userRole: string,
  roomId: string,
): Promise<boolean> {
  // Get room and creator information
  const room = await prisma.studyRoom.findUnique({
    where: { id: roomId },
    select: {
      creatorId: true,
      creator: {
        select: {
          role: true,
        },
      },
    },
  });

  if (!room) {
    return false;
  }

  const { creatorId, creator } = room;
  const creatorRole = creator.role;

  // ADMIN can control any room
  if (userRole === "ADMIN") {
    return true;
  }

  // MODERATOR can control USER rooms and their own room, but not other MODERATOR or ADMIN rooms
  if (userRole === "MODERATOR") {
    // Can control their own room
    if (userId === creatorId) {
      return true;
    }
    // Can control USER rooms only
    return creatorRole === "USER";
  }

  // USER can only control their own room
  if (userRole === "USER") {
    return userId === creatorId;
  }

  return false;
}
