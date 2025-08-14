"use client";

import { ErrorPage } from "@/features/shared/components";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function LocaleError({ error, reset }: ErrorProps) {
  return <ErrorPage error={error} reset={reset} />;
}
