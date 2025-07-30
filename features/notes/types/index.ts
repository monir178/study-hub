export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  roomId: string;
  isLocked?: boolean;
  lockedBy?: string;
  version: number;
}

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
  content?: string;
  roomId: string;
}

export interface UpdateNoteRequest {
  id: string;
  title?: string;
  content?: string;
  operations?: NoteOperation[];
  version: number;
}

export interface NotePermissions {
  canEdit: boolean;
  canDelete: boolean;
  canLock: boolean;
  canExport: boolean;
}

export interface ExportOptions {
  format: "markdown" | "pdf";
  includeMetadata?: boolean;
}
