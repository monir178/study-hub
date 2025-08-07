"use client";

import { ReactNode } from "react";
import { useSessionSync } from "@/lib/hooks/useSessionSync";

/**
 * Component that handles session synchronization with Redux
 * Must be placed inside both SessionProvider and Redux Provider
 */
export function SessionSyncProvider({ children }: { children: ReactNode }) {
  // This hook will automatically sync session to Redux
  useSessionSync();

  return <>{children}</>;
}
