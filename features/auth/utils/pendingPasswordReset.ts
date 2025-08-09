"use client";

export interface PendingPasswordResetData {
  email: string;
  token?: string; // Will be set after OTP verification
  expiresAt: number; // epoch ms
  flow: "FORGOT_PASSWORD";
}

const STORAGE_KEY = "pendingPasswordReset";

function getStorage(): Storage | null {
  try {
    // Prefer localStorage to survive reloads reliably
    return typeof window !== "undefined" ? window.localStorage : null;
  } catch {
    return null;
  }
}

export function savePendingPasswordReset(
  data: Omit<PendingPasswordResetData, "expiresAt" | "flow">,
  expiresInSeconds: number,
) {
  const payload: PendingPasswordResetData = {
    ...data,
    flow: "FORGOT_PASSWORD",
    expiresAt: Date.now() + Math.max(1, expiresInSeconds) * 1000,
  };
  const storage = getStorage();
  storage?.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function getPendingPasswordReset(): PendingPasswordResetData | null {
  try {
    const storage = getStorage();
    const raw = storage?.getItem(STORAGE_KEY) ?? null;
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PendingPasswordResetData;
    if (
      !parsed?.email ||
      !parsed?.expiresAt ||
      parsed?.flow !== "FORGOT_PASSWORD"
    ) {
      return null;
    }
    if (parsed.expiresAt <= Date.now()) {
      // expired
      storage?.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function updatePendingPasswordResetExpiry(expiresInSeconds: number) {
  const current = getPendingPasswordReset();
  if (!current) return;
  const updated: PendingPasswordResetData = {
    ...current,
    expiresAt: Date.now() + Math.max(1, expiresInSeconds) * 1000,
  };
  const storage = getStorage();
  storage?.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function updatePendingPasswordResetToken(token: string) {
  const current = getPendingPasswordReset();
  if (!current) return;
  const updated: PendingPasswordResetData = {
    ...current,
    token,
  };
  const storage = getStorage();
  storage?.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function clearPendingPasswordReset() {
  const storage = getStorage();
  storage?.removeItem(STORAGE_KEY);
}
