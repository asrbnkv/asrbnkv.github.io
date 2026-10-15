"use client";

import { useEffect } from "react";

/**
 * Mounted once per document by RootDocument. Marks the motion layer as
 * booted (html.motion-ready), which disarms the boot script's 4s safety net
 * that would otherwise drop html.js and show every hidden state.
 */
export function MotionRoot() {
  useEffect(() => {
    document.documentElement.classList.add("motion-ready");
  }, []);
  return null;
}
