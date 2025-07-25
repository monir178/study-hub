import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Message {
  id: string;
  content: string;
  type: "TEXT" | "SYSTEM" | "FILE";
  createdAt: string;
  authorId: string;
  author: {
    id: string;
    name?: string;
    image?: string;
  };
  roomId: string;
}

interface ChatState {
  messages: Record<string, Message[]>; // roomId -> messages
  typingUsers: Record<string, string[]>; // roomId -> userIds
  isLoading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  messages: {},
  typingUsers: {},
  isLoading: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setMessages: (
      state,
      action: PayloadAction<{ roomId: string; messages: Message[] }>,
    ) => {
      const { roomId, messages } = action.payload;
      state.messages[roomId] = messages;
      state.error = null;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      const message = action.payload;
      if (!state.messages[message.roomId]) {
        state.messages[message.roomId] = [];
      }
      state.messages[message.roomId].push(message);
    },
    setTypingUsers: (
      state,
      action: PayloadAction<{ roomId: string; userIds: string[] }>,
    ) => {
      const { roomId, userIds } = action.payload;
      state.typingUsers[roomId] = userIds;
    },
    addTypingUser: (
      state,
      action: PayloadAction<{ roomId: string; userId: string }>,
    ) => {
      const { roomId, userId } = action.payload;
      if (!state.typingUsers[roomId]) {
        state.typingUsers[roomId] = [];
      }
      if (!state.typingUsers[roomId].includes(userId)) {
        state.typingUsers[roomId].push(userId);
      }
    },
    removeTypingUser: (
      state,
      action: PayloadAction<{ roomId: string; userId: string }>,
    ) => {
      const { roomId, userId } = action.payload;
      if (state.typingUsers[roomId]) {
        state.typingUsers[roomId] = state.typingUsers[roomId].filter(
          (id) => id !== userId,
        );
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearRoomData: (state, action: PayloadAction<string>) => {
      const roomId = action.payload;
      delete state.messages[roomId];
      delete state.typingUsers[roomId];
    },
  },
});

export const {
  setMessages,
  addMessage,
  setTypingUsers,
  addTypingUser,
  removeTypingUser,
  setLoading,
  setError,
  clearRoomData,
} = chatSlice.actions;

export default chatSlice.reducer;
