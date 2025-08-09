"use client";

export interface PendingSignupData {
  name: string;
  email: string;
  password: string;
  expiresAt: number; // epoch ms
}

const STORAGE_KEY = "pendingSignup";

function getStorage(): Storage | null {
  try {
    // Prefer localStorage to survive reloads reliably
    return typeof window !== "undefined" ? window.localStorage : null;
  } catch {
    return null;
  }
}

export function savePendingSignup(
  data: Omit<PendingSignupData, "expiresAt">,
  expiresInSeconds: number,
) {
  const payload: PendingSignupData = {
    ...data,
    expiresAt: Date.now() + Math.max(1, expiresInSeconds) * 1000,
  };
  const storage = getStorage();
  storage?.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function getPendingSignup(): PendingSignupData | null {
  try {
    const storage = getStorage();
    const raw = storage?.getItem(STORAGE_KEY) ?? null;
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PendingSignupData;
    if (
      !parsed?.email ||
      !parsed?.password ||
      !parsed?.name ||
      !parsed?.expiresAt
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

export function updatePendingExpiry(expiresInSeconds: number) {
  const current = getPendingSignup();
  if (!current) return;
  const updated: PendingSignupData = {
    ...current,
    expiresAt: Date.now() + Math.max(1, expiresInSeconds) * 1000,
  };
  const storage = getStorage();
  storage?.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function clearPendingSignup() {
  const storage = getStorage();
  storage?.removeItem(STORAGE_KEY);
}
