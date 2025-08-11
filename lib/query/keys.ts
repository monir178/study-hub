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
  userDashboard: () => [...queryKeys.userProfile(), "dashboard"] as const,
  userDashboardStats: () => [...queryKeys.userDashboard(), "stats"] as const,
  userStudyTime: () => [...queryKeys.userDashboard(), "study-time"] as const,
  userSessionTypes: () =>
    [...queryKeys.userDashboard(), "session-types"] as const,
  userRoomActivity: () =>
    [...queryKeys.userDashboard(), "room-activity"] as const,

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
  joinedRooms: () => [...queryKeys.rooms, "joined"] as const,

  // Messages
  messages: ["messages"] as const,
  roomMessages: (roomId: string) =>
    [...queryKeys.messages, "room", roomId] as const,

  // Notes
  notes: ["notes"] as const,
  note: (id: string) => [...queryKeys.notes, id] as const,
  userNotes: (userId: string) => [...queryKeys.notes, "user", userId] as const,
  userNotesPaginated: (page: number, limit: number) =>
    [...queryKeys.notes, "user", "paginated", { page, limit }] as const,
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
  moderatorDashboard: () => [...queryKeys.moderator, "dashboard"] as const,
  moderatorStats: () => [...queryKeys.moderator, "stats"] as const,
  moderatorActivity: () => [...queryKeys.moderator, "activity"] as const,
  moderatorRecentUsers: () => [...queryKeys.moderator, "recent-users"] as const,
  moderatorRecentRooms: () => [...queryKeys.moderator, "recent-rooms"] as const,
  moderatorRecentSessions: () =>
    [...queryKeys.moderator, "recent-sessions"] as const,
  reports: (status?: string) =>
    status
      ? ([...queryKeys.moderator, "reports", status] as const)
      : ([...queryKeys.moderator, "reports"] as const),
  report: (id: string) => [...queryKeys.reports(), id] as const,
} as const; // Query key factory functions for dynamic keys
export const createQueryKeys = {
  // Paginated queries
  usersPaginated: (page: number, pageSize: number) =>
    [...queryKeys.users, "paginated", { page, pageSize }] as const,

  // Search queries
  usersSearch: (searchTerm: string, role?: string) =>
    [...queryKeys.users, "search", searchTerm, role || ""] as const,

  // Paginated search queries
  usersSearchPaginated: (
    searchTerm: string,
    role?: string,
    page: number = 1,
    pageSize: number = 10,
  ) =>
    [
      ...queryKeys.users,
      "search",
      "paginated",
      { searchTerm, role: role || "", page, pageSize },
    ] as const,

  // Filtered queries
  usersFiltered: (filters: Record<string, unknown>) =>
    [...queryKeys.users, "filtered", filters] as const,
};
