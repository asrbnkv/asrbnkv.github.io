"use client";

import { useRef, type HTMLAttributes, type ReactNode } from "react";
import { useRetroChoreography } from "./choreography";
import { useRowLinks } from "./rowLinks";

type DataAttributes = { [key: `data-${string}`]: string | undefined };

/**
 * The retro chapter's <section>: server-rendered children, one client
 * choreography over them (choreography.ts) and the lessons as targets of
 * their case links (rowLinks.ts). It carries data-reveal-root so
 * the system's hidden states (globals.css) apply to its data-reveal parts,
 * which no other script reveals.
 */
export function RetroStage({
  children,
  ...rest
}: HTMLAttributes<HTMLElement> & DataAttributes & { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  useRetroChoreography(ref);
  useRowLinks(ref);
  return (
    <section ref={ref} data-reveal-root="" {...rest}>
      {children}
    </section>
  );
}
