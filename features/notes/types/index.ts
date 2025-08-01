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
  };
}

// Type for when no note exists yet
export type NoteOrNull = Note | null;

// Type for multiple notes
export type NotesList = Note[];

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
