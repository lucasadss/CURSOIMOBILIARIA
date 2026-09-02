"use client";

import { useEffect, useState } from "react";

/** True after the first client render — gate persisted-store reads on this. */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
