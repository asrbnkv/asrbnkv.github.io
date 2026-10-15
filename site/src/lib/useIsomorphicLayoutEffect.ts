import { useEffect, useLayoutEffect } from "react";

/** useLayoutEffect in the browser, useEffect during prerender (no warning). */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
