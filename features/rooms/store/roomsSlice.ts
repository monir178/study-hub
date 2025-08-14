import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Member data for real-time updates
interface RoomMember {
  id: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
  role: string;
}

// Client state only - server data handled by TanStack Query
interface RoomsState {
  // UI State
  selectedRoomId: string | null;
  showCreateRoomDialog: boolean;
  showJoinRoomDialog: boolean;
  showDeleteRoomDialog: boolean;

  // Filters and Search
  searchQuery: string;
  roleFilter: string;
  currentTab: "public" | "my-rooms";

  // Pagination
  currentPage: number;
  itemsPerPage: number;

  // Real-time connection
  isConnected: boolean;
  connectionError: string | null;

  // Real-time member counts by room ID
  memberCounts: Record<string, number>;
  // Real-time member lists by room ID
  roomMembers: Record<string, RoomMember[]>;
}

const initialState: RoomsState = {
  // UI State
  selectedRoomId: null,
  showCreateRoomDialog: false,
  showJoinRoomDialog: false,
  showDeleteRoomDialog: false,

  // Filters and Search
  searchQuery: "",
  roleFilter: "all",
  currentTab: "public",

  // Pagination
  currentPage: 1,
  itemsPerPage: 12,

  // Real-time connection
  isConnected: false,
  connectionError: null,

  // Real-time member counts
  memberCounts: {},
  // Real-time member lists
  roomMembers: {},
};

const roomsSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {
    // UI State Actions
    setSelectedRoom: (state, action: PayloadAction<string | null>) => {
      state.selectedRoomId = action.payload;
    },
    setShowCreateRoomDialog: (state, action: PayloadAction<boolean>) => {
      state.showCreateRoomDialog = action.payload;
    },
    setShowJoinRoomDialog: (state, action: PayloadAction<boolean>) => {
      state.showJoinRoomDialog = action.payload;
    },
    setShowDeleteRoomDialog: (state, action: PayloadAction<boolean>) => {
      state.showDeleteRoomDialog = action.payload;
    },

    // Filter and Search Actions
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 1; // Reset to first page when searching
    },
    setRoleFilter: (state, action: PayloadAction<string>) => {
      state.roleFilter = action.payload;
      state.currentPage = 1; // Reset to first page when filtering
    },
    setCurrentTab: (state, action: PayloadAction<"public" | "my-rooms">) => {
      state.currentTab = action.payload;
      state.currentPage = 1; // Reset to first page when changing tabs
    },

    // Pagination Actions
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload;
      state.currentPage = 1; // Reset to first page when changing page size
    },

    // Real-time Connection Actions
    setConnectionStatus: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
      if (action.payload) {
        state.connectionError = null;
      }
    },
    setConnectionError: (state, action: PayloadAction<string | null>) => {
      state.connectionError = action.payload;
      if (action.payload) {
        state.isConnected = false;
      }
    },

    // Real-time Member Count Actions
    setMemberCount: (
      state,
      action: PayloadAction<{ roomId: string; count: number }>,
    ) => {
      state.memberCounts[action.payload.roomId] = action.payload.count;
    },
    updateMemberCount: (
      state,
      action: PayloadAction<{ roomId: string; delta: number }>,
    ) => {
      const current = state.memberCounts[action.payload.roomId] || 0;
      state.memberCounts[action.payload.roomId] = Math.max(
        0,
        current + action.payload.delta,
      );
    },
    clearMemberCount: (state, action: PayloadAction<string>) => {
      delete state.memberCounts[action.payload];
    },

    // Real-time Member List Actions
    setRoomMembers: (
      state,
      action: PayloadAction<{ roomId: string; members: RoomMember[] }>,
    ) => {
      state.roomMembers[action.payload.roomId] = action.payload.members;
    },
    addRoomMember: (
      state,
      action: PayloadAction<{ roomId: string; member: RoomMember }>,
    ) => {
      const currentMembers = state.roomMembers[action.payload.roomId] || [];
      // Check if member already exists
      const memberExists = currentMembers.some(
        (m) => m.user.id === action.payload.member.user.id,
      );
      if (!memberExists) {
        state.roomMembers[action.payload.roomId] = [
          ...currentMembers,
          action.payload.member,
        ];
      }
    },
    removeRoomMember: (
      state,
      action: PayloadAction<{ roomId: string; userId: string }>,
    ) => {
      const currentMembers = state.roomMembers[action.payload.roomId] || [];
      state.roomMembers[action.payload.roomId] = currentMembers.filter(
        (m) => m.user.id !== action.payload.userId,
      );
    },
    clearRoomMembers: (state, action: PayloadAction<string>) => {
      delete state.roomMembers[action.payload];
    },

    // Reset Actions
    resetFilters: (state) => {
      state.searchQuery = "";
      state.roleFilter = "all";
      state.currentPage = 1;
    },
    resetDialogs: (state) => {
      state.showCreateRoomDialog = false;
      state.showJoinRoomDialog = false;
      state.showDeleteRoomDialog = false;
    },
  },
});

export const {
  // UI State Actions
  setSelectedRoom,
  setShowCreateRoomDialog,
  setShowJoinRoomDialog,
  setShowDeleteRoomDialog,

  // Filter and Search Actions
  setSearchQuery,
  setRoleFilter,
  setCurrentTab,

  // Pagination Actions
  setCurrentPage,
  setItemsPerPage,

  // Real-time Connection Actions
  setConnectionStatus,
  setConnectionError,

  // Real-time Member Count Actions
  setMemberCount,
  updateMemberCount,
  clearMemberCount,

  // Real-time Member List Actions
  setRoomMembers,
  addRoomMember,
  removeRoomMember,
  clearRoomMembers,

  // Reset Actions
  resetFilters,
  resetDialogs,
} = roomsSlice.actions;

export default roomsSlice.reducer;
export type { RoomMember };
