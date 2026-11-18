"use client";
import { useEffect } from "react";

export function VisitTracker() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem("mtx_v")) return;
      sessionStorage.setItem("mtx_v", "1");
    } catch {}
    fetch("/api/track", { method: "POST", keepalive: true }).catch(() => {});
  }, []);
  return null;
}
