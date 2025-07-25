import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface StudyRoom {
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  maxMembers: number;
  createdAt: string;
  updatedAt: string;
  creatorId: string;
  members: unknown[];
  _count?: {
    members: number;
    messages: number;
    notes: number;
  };
}

interface RoomsState {
  rooms: StudyRoom[];
  currentRoom: StudyRoom | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: RoomsState = {
  rooms: [],
  currentRoom: null,
  isLoading: false,
  error: null,
};

const roomsSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {
    setRooms: (state, action: PayloadAction<StudyRoom[]>) => {
      state.rooms = action.payload;
      state.error = null;
    },
    setCurrentRoom: (state, action: PayloadAction<StudyRoom | null>) => {
      state.currentRoom = action.payload;
    },
    addRoom: (state, action: PayloadAction<StudyRoom>) => {
      state.rooms.push(action.payload);
    },
    updateRoom: (state, action: PayloadAction<StudyRoom>) => {
      const index = state.rooms.findIndex(
        (room) => room.id === action.payload.id,
      );
      if (index !== -1) {
        state.rooms[index] = action.payload;
      }
    },
    removeRoom: (state, action: PayloadAction<string>) => {
      state.rooms = state.rooms.filter((room) => room.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setRooms,
  setCurrentRoom,
  addRoom,
  updateRoom,
  removeRoom,
  setLoading,
  setError,
} = roomsSlice.actions;

export default roomsSlice.reducer;
