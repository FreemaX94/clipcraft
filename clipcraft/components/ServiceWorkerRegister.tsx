"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    // Defer until idle to avoid contending with the ffmpeg.wasm load
    const handle = (window as Window & {
      requestIdleCallback?: (cb: () => void) => number;
    }).requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1500));
    handle(() => {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .catch(() => {
          // Silently ignore — the app works without the SW. We just lose
          // the install prompt on browsers that require an active SW.
        });
    });
  }, []);
  return null;
}
