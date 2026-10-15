"use client";

import { useEffect, useRef } from "react";
import styles from "./Closing.module.css";

/**
 * The retro H2, the page's one authored typographic moment (03 §9.3): its
 * lines rise 90ms apart out of a mask, opacity untouched. Each word is an
 * inline block whose bottom edge (with 0.08em for descenders) clips its
 * inner word; once the face has loaded, each takes its line's index (--l)
 * from where it was set, so a line's words rise together, in order,
 * whatever the width. The heading stays one heading to assistive tech and
 * is simply set without JS or under reduced motion.
 */
export function RetroLine({
  id,
  describedBy,
  className,
  children,
}: {
  id: string;
  describedBy: string;
  className?: string;
  children: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cancelled = false;
    const index = () => {
      if (cancelled) return;
      const words = Array.from(el.querySelectorAll<HTMLElement>("[data-w]"));
      const tops: number[] = [];
      for (const w of words) {
        const top = w.offsetTop;
        let line = tops.findIndex((t) => Math.abs(t - top) < 4);
        if (line === -1) line = tops.push(top) - 1;
        w.style.setProperty("--l", String(line));
      }
    };
    index();
    document.fonts?.ready.then(index).catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [children]);

  const words = children.split(" ");
  return (
    <h2
      ref={ref}
      id={id}
      aria-describedby={describedBy}
      data-reveal="fade"
      className={`${className ?? ""} ${styles.lineRise}`}
    >
      {words.map((word, i) => (
        <span key={i}>
          {i > 0 ? " " : null}
          <span data-w="" className={styles.word}>
            <span className={styles.wordInner}>{word}</span>
          </span>
        </span>
      ))}
    </h2>
  );
}
