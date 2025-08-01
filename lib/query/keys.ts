/**
 * Query Keys for TanStack Query
 *
 * Organized query keys following TanStack Query best practices
 * https://tkdodo.eu/blog/effective-react-query-keys
 */

// Base query keys
export const queryKeys = {
  // Users
  users: ["users"] as const,
  user: (id: string) => [...queryKeys.users, id] as const,
  userProfile: () => [...queryKeys.users, "profile"] as const,

  // Admin
  admin: ["admin"] as const,
  adminDashboard: () => [...queryKeys.admin, "dashboard"] as const,
  adminDashboardStats: () => [...queryKeys.adminDashboard(), "stats"] as const,
  adminSettings: () => [...queryKeys.admin, "settings"] as const,
  adminAnalytics: (timeRange?: string) =>
    timeRange
      ? ([...queryKeys.admin, "analytics", timeRange] as const)
      : ([...queryKeys.admin, "analytics"] as const),

  // Rooms
  rooms: ["rooms"] as const,
  room: (id: string) => [...queryKeys.rooms, id] as const,
  roomMembers: (roomId: string) =>
    [...queryKeys.room(roomId), "members"] as const,
  myRooms: () => [...queryKeys.rooms, "my"] as const,
  publicRooms: () => [...queryKeys.rooms, "public"] as const,

  // Messages
  messages: ["messages"] as const,
  roomMessages: (roomId: string) =>
    [...queryKeys.messages, "room", roomId] as const,

  // Notes
  notes: ["notes"] as const,
  note: (id: string) => [...queryKeys.notes, id] as const,
  userNotes: (userId: string) => [...queryKeys.notes, "user", userId] as const,
  roomNotes: (roomId: string) => [...queryKeys.rooms, roomId, "notes"] as const,
  roomNote: (roomId: string, noteId: string) =>
    [...queryKeys.rooms, roomId, "notes", noteId] as const,

  // Timer/Sessions
  sessions: ["sessions"] as const,
  userSessions: (userId: string) =>
    [...queryKeys.sessions, "user", userId] as const,
  activeSessions: () => [...queryKeys.sessions, "active"] as const,

  // Timer
  timer: (roomId: string) => [...queryKeys.rooms, roomId, "timer"] as const,

  // Moderator
  moderator: ["moderator"] as const,
  moderatorStats: () => [...queryKeys.moderator, "stats"] as const,
  moderatorActivity: () => [...queryKeys.moderator, "activity"] as const,
  reports: (status?: string) =>
    status
      ? ([...queryKeys.moderator, "reports", status] as const)
      : ([...queryKeys.moderator, "reports"] as const),
  report: (id: string) => [...queryKeys.reports(), id] as const,
} as const; // Query key factory functions for dynamic keys
export const createQueryKeys = {
  // Paginated queries
  usersPaginated: (
    page: number,
    limit: number,
    filters?: Record<string, unknown>,
  ) => [...queryKeys.users, "paginated", { page, limit, filters }] as const,

  // Search queries
  usersSearch: (searchTerm: string, role?: string) =>
    [...queryKeys.users, "search", searchTerm, role || ""] as const,

  // Filtered queries
  usersFiltered: (filters: Record<string, unknown>) =>
    [...queryKeys.users, "filtered", filters] as const,
};
