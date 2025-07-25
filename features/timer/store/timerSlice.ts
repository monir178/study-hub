import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TimerState {
  remainingTime: number; // in seconds
  isActive: boolean;
  isPaused: boolean;
  type: "POMODORO" | "SHORT_BREAK" | "LONG_BREAK" | "CUSTOM";
  duration: number; // original duration in seconds
  roomId: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: TimerState = {
  remainingTime: 25 * 60, // 25 minutes default
  isActive: false,
  isPaused: false,
  type: "POMODORO",
  duration: 25 * 60,
  roomId: null,
  isLoading: false,
  error: null,
};

const timerSlice = createSlice({
  name: "timer",
  initialState,
  reducers: {
    setTimer: (
      state,
      action: PayloadAction<{
        remainingTime: number;
        isActive: boolean;
        type: TimerState["type"];
        duration: number;
        roomId: string;
      }>,
    ) => {
      const { remainingTime, isActive, type, duration, roomId } =
        action.payload;
      state.remainingTime = remainingTime;
      state.isActive = isActive;
      state.type = type;
      state.duration = duration;
      state.roomId = roomId;
      state.isPaused = false;
      state.error = null;
    },
    startTimer: (
      state,
      action: PayloadAction<{
        duration: number;
        type: TimerState["type"];
        roomId: string;
      }>,
    ) => {
      const { duration, type, roomId } = action.payload;
      state.duration = duration;
      state.remainingTime = duration;
      state.type = type;
      state.roomId = roomId;
      state.isActive = true;
      state.isPaused = false;
    },
    pauseTimer: (state) => {
      state.isActive = false;
      state.isPaused = true;
    },
    resumeTimer: (state) => {
      state.isActive = true;
      state.isPaused = false;
    },
    stopTimer: (state) => {
      state.isActive = false;
      state.isPaused = false;
      state.remainingTime = state.duration;
    },
    tick: (state) => {
      if (state.isActive && state.remainingTime > 0) {
        state.remainingTime -= 1;
      }
      if (state.remainingTime === 0) {
        state.isActive = false;
      }
    },
    setRemainingTime: (state, action: PayloadAction<number>) => {
      state.remainingTime = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetTimer: (state) => {
      state.remainingTime = state.duration;
      state.isActive = false;
      state.isPaused = false;
    },
  },
});

export const {
  setTimer,
  startTimer,
  pauseTimer,
  resumeTimer,
  stopTimer,
  tick,
  setRemainingTime,
  setLoading,
  setError,
  resetTimer,
} = timerSlice.actions;

export default timerSlice.reducer;
