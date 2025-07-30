import { configureStore } from "@reduxjs/toolkit";
import authSlice from "@/features/auth/store/authSlice";
import roomsSlice from "@/features/rooms/store/roomsSlice";
import chatSlice from "@/features/chat/store/chatSlice";
import notesSlice from "@/features/notes/store/notesSlice";
import usersSlice from "@/features/users/store/usersSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    rooms: roomsSlice,
    chat: chatSlice,
    notes: notesSlice,
    users: usersSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
