import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  roomId: string;
}

interface NotesState {
  notes: Record<string, Note[]>; // roomId -> notes
  currentNote: Note | null;
  collaborators: Record<string, { userId: string; cursor: number }[]>; // noteId -> collaborators
  isLoading: boolean;
  error: string | null;
}

const initialState: NotesState = {
  notes: {},
  currentNote: null,
  collaborators: {},
  isLoading: false,
  error: null,
};

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    setNotes: (
      state,
      action: PayloadAction<{ roomId: string; notes: Note[] }>,
    ) => {
      const { roomId, notes } = action.payload;
      state.notes[roomId] = notes;
      state.error = null;
    },
    setCurrentNote: (state, action: PayloadAction<Note | null>) => {
      state.currentNote = action.payload;
    },
    addNote: (state, action: PayloadAction<Note>) => {
      const note = action.payload;
      if (!state.notes[note.roomId]) {
        state.notes[note.roomId] = [];
      }
      state.notes[note.roomId].push(note);
    },
    updateNote: (state, action: PayloadAction<Note>) => {
      const updatedNote = action.payload;
      if (state.notes[updatedNote.roomId]) {
        const index = state.notes[updatedNote.roomId].findIndex(
          (note) => note.id === updatedNote.id,
        );
        if (index !== -1) {
          state.notes[updatedNote.roomId][index] = updatedNote;
        }
      }
      if (state.currentNote && state.currentNote.id === updatedNote.id) {
        state.currentNote = updatedNote;
      }
    },
    removeNote: (
      state,
      action: PayloadAction<{ roomId: string; noteId: string }>,
    ) => {
      const { roomId, noteId } = action.payload;
      if (state.notes[roomId]) {
        state.notes[roomId] = state.notes[roomId].filter(
          (note) => note.id !== noteId,
        );
      }
      if (state.currentNote && state.currentNote.id === noteId) {
        state.currentNote = null;
      }
    },
    updateNoteContent: (
      state,
      action: PayloadAction<{ noteId: string; content: string }>,
    ) => {
      const { noteId, content } = action.payload;
      if (state.currentNote && state.currentNote.id === noteId) {
        state.currentNote.content = content;
      }
      // Update in notes array as well
      Object.keys(state.notes).forEach((roomId) => {
        const noteIndex = state.notes[roomId].findIndex(
          (note) => note.id === noteId,
        );
        if (noteIndex !== -1) {
          state.notes[roomId][noteIndex].content = content;
        }
      });
    },
    setCollaborators: (
      state,
      action: PayloadAction<{
        noteId: string;
        collaborators: { userId: string; cursor: number }[];
      }>,
    ) => {
      const { noteId, collaborators } = action.payload;
      state.collaborators[noteId] = collaborators;
    },
    updateCollaboratorCursor: (
      state,
      action: PayloadAction<{
        noteId: string;
        userId: string;
        cursor: number;
      }>,
    ) => {
      const { noteId, userId, cursor } = action.payload;
      if (!state.collaborators[noteId]) {
        state.collaborators[noteId] = [];
      }
      const collaboratorIndex = state.collaborators[noteId].findIndex(
        (c) => c.userId === userId,
      );
      if (collaboratorIndex !== -1) {
        state.collaborators[noteId][collaboratorIndex].cursor = cursor;
      } else {
        state.collaborators[noteId].push({ userId, cursor });
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearRoomNotes: (state, action: PayloadAction<string>) => {
      const roomId = action.payload;
      delete state.notes[roomId];
    },
  },
});

export const {
  setNotes,
  setCurrentNote,
  addNote,
  updateNote,
  removeNote,
  updateNoteContent,
  setCollaborators,
  updateCollaboratorCursor,
  setLoading,
  setError,
  clearRoomNotes,
} = notesSlice.actions;

export default notesSlice.reducer;
