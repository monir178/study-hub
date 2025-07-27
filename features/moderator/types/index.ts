// ===============================================
// MODERATOR TYPES
// ===============================================

export interface ModeratorStats {
  users: {
    total: number;
    active: number;
    newThisWeek: number;
  };
  sessions: {
    total: number;
    thisWeek: number;
    moderated: number;
  };
  reports: {
    pending: number;
    resolved: number;
    dismissed: number;
  };
  content: {
    reviewed: number;
    flagged: number;
    approved: number;
  };
}

export interface Report {
  id: string;
  type: "USER" | "CONTENT" | "SESSION" | "OTHER";
  status: "PENDING" | "RESOLVED" | "DISMISSED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  title: string;
  description: string;
  reportedBy: {
    id: string;
    name: string;
    email: string;
  };
  reportedUser?: {
    id: string;
    name: string;
    email: string;
  };
  targetId?: string; // ID of the reported content/session/etc.
  evidence?: string[]; // URLs to screenshots, etc.
  moderatorNotes?: string;
  assignedTo?: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface CreateReportData {
  type: "USER" | "CONTENT" | "SESSION" | "OTHER";
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  title: string;
  description: string;
  reportedUserId?: string;
  targetId?: string;
  evidence?: string[];
}

export interface UpdateReportData {
  status?: "PENDING" | "RESOLVED" | "DISMISSED";
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  moderatorNotes?: string;
  assignedToId?: string;
}

export interface ModeratorActivity {
  id: string;
  moderatorId: string;
  moderatorName: string;
  action:
    | "REPORT_RESOLVED"
    | "REPORT_DISMISSED"
    | "USER_WARNED"
    | "USER_SUSPENDED"
    | "CONTENT_REMOVED"
    | "SESSION_MODERATED";
  description: string;
  targetType: "USER" | "CONTENT" | "SESSION" | "REPORT";
  targetId: string;
  createdAt: string;
}

// Re-export User type for convenience
export type { User } from "@/features/users/types";
