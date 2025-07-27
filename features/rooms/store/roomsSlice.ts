import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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

  // Reset Actions
  resetFilters,
  resetDialogs,
} = roomsSlice.actions;

export default roomsSlice.reducer;
