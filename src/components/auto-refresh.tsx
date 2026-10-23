"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

// shortcut: polling every 10s, move to SSE/websockets if many screens are open
const AutoRefresh = () => {
  const router = useRouter();
  useEffect(() => {
    const interval = setInterval(() => router.refresh(), 10_000);
    return () => clearInterval(interval);
  }, [router]);
  return null;
};

export default AutoRefresh;
