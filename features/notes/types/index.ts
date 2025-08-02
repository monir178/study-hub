export interface Note {
  id: string;
  title: string;
  content: string; // Slate.js JSON content
  createdAt: string;
  updatedAt: string;
  version: number;
  roomId: string;
  createdBy: string;
  creator: {
    id: string;
    name: string;
    email: string;
    role: string;
    image?: string;
  };
}

// Type for when no note exists yet
export type NoteOrNull = Note | null;

// Type for multiple notes
export type NotesList = Note[];

// Type for user notes with room information
export interface UserNote extends Note {
  room: {
    id: string;
    name: string;
    isPublic: boolean;
    members: Array<{
      userId: string;
    }>;
  };
}

export type UserNotesList = UserNote[];

export interface NoteOperation {
  type:
    | "insert_text"
    | "delete_text"
    | "insert_node"
    | "remove_node"
    | "set_node";
  path: number[];
  offset?: number;
  text?: string;
  node?: unknown;
  properties?: unknown;
  newProperties?: unknown;
}

export interface CollaborativeEdit {
  id: string;
  operation: NoteOperation;
  userId: string;
  userName?: string;
  timestamp: string;
  version: number;
}

export interface NoteUser {
  id: string;
  name: string;
  image?: string;
  cursor?: {
    anchor: { path: number[]; offset: number };
    focus: { path: number[]; offset: number };
  };
  selection?: unknown;
  isActive: boolean;
}

export interface CreateNoteRequest {
  title: string;
  content: string;
  roomId: string;
}

export interface UpdateNoteRequest {
  title?: string;
  content?: string;
  roomId: string;
}

export interface NotePermissions {
  canEdit: boolean;
  canDelete: boolean;
  canExport: boolean;
  canRead: boolean;
}

export interface ExportOptions {
  format: "markdown" | "pdf";
  includeMetadata?: boolean;
}

export interface NoteEditorState {
  isEditing: boolean;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  lastSavedAt?: Date;
}

// Component-specific types
export interface RoomInfo {
  id: string;
  name: string;
  isPublic: boolean;
  creatorId: string;
  members: Array<{
    userId: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  }>;
}

export interface NotesContainerProps {
  roomId: string;
  room?: RoomInfo;
}

export interface NotesListProps {
  notes: Note[];
  isLoading: boolean;
  onNoteSelect: (note: Note) => void;
  onCreateNote: () => void;
  onDeleteNote?: (noteId: string) => void;
  permissions: NotePermissions;
  room?: RoomInfo;
  isDeleting?: boolean;
  onDeleteSuccess?: () => void;
  onBackToList?: () => void;
  showBackButton?: boolean;
  selectedNote?: Note | null;
  isMinimized?: boolean;
  onSave?: (content: string, title: string) => void;
  onExportMarkdown?: () => void;
  onExportPDF?: () => void;
  isSaving?: boolean;
}

export interface NotesPanelProps {
  note?: Note;
  isLoading: boolean;
  editorState: NoteEditorState;
  permissions: NotePermissions;
  onSave: (content: string, title: string) => void;
  onExportMarkdown: () => void;
  onExportPDF: () => void;
  onBack: () => void;
  isSaving: boolean;
}

export interface SlateEditorProps {
  note?: Note;
  isLoading: boolean;
  editorState: NoteEditorState;
  permissions: NotePermissions;
  onSave: (content: string, title: string) => void;
  onExportMarkdown?: () => void;
  onExportPDF?: () => void;
  onChange?: (content: string, title: string) => void;
  hideHeader?: boolean;
  isSaving: boolean;
}

export interface DeleteDialogState {
  isOpen: boolean;
  isDeleting: boolean;
  noteId: string | null;
  noteTitle: string;
}

export interface NoteCardProps {
  note: Note;
  onSelect: (note: Note) => void;
  onDelete?: (noteId: string) => void;
  permissions: NotePermissions;
  isDeleting?: boolean;
  onDeleteClick: (noteId: string, noteTitle: string) => void;
}

export interface NotesHeaderProps {
  notesCount: number;
  showBackButton: boolean;
  onBackToList?: () => void;
  onCreateNote?: () => void;
  permissions: NotePermissions;
}

export interface NotesSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export interface NotesEmptyStateProps {
  searchQuery: string;
  permissions: NotePermissions;
  onCreateNote?: () => void;
  room?: RoomInfo;
}

export interface NotesToolbarProps {
  permissions: NotePermissions;
  activeTools: Set<string>;
  onToggleMark: (format: string) => void;
  onToggleBlock: (format: string) => void;
  onExportMarkdown?: () => void;
  onExportPDF?: () => void;
}

export interface NotesTitleEditorProps {
  title: string;
  isEditing: boolean;
  onTitleChange: (title: string) => void;
  onStartEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  permissions: NotePermissions;
}
