"use client";

import clsx from "clsx";
import { Figure } from "@/components/Figure";
import { PairMark, replayMark } from "@/components/Marks";
import { canHover } from "@/lib/motion";
import t from "@/styles/type.module.css";
import { Lines } from "./Lines";
import styles from "./Next.module.css";

/**
 * The next-case link: figure, mark, H1 and meta as one <a> named
 * "Next case: <H1>". After an S figure (2×, 80+, 15+, on cols 1–6) or the
 * 97% (on cols 1–7) the mark, H1 and meta stand on cols 8–12 on the
 * figure's baseline, the S cover's own lockup; otherwise they follow under
 * the figure. Hover (fine pointer): the figure
 * leans 8px towards the next page, the H1's underline goes to 100% and the
 * mark replays the end of its parting (at most once per 2s). Press: the
 * block scales to 0.985. Keyboard focus shows the block at rest at once,
 * the mark parted, with no entrance (03 §9.3).
 */
export function NextLink({
  href,
  name,
  h1,
  meta,
  figure,
  lockup,
  descends,
  vt,
}: {
  href: string;
  name: string;
  h1: string;
  meta: string;
  figure: { value: string; fit: number; inkLeft: number };
  /** side: S figures on cols 1–6 · beside: the C figure on cols 1–7 · stack: under the figure. */
  lockup: "side" | "beside" | "stack";
  descends: boolean;
  vt: { a: string; b: string };
}) {
  return (
    <a
      href={href}
      aria-label={name}
      className={clsx(styles.link, lockup !== "stack" && styles.lockupSide, lockup === "beside" && styles.lockupBeside)}
      onPointerEnter={(e) => {
        if (canHover()) replayMark(e.currentTarget.querySelector<HTMLElement>("[data-pair-mark]"));
      }}
      onFocus={(e) => {
        if (!e.currentTarget.matches(":focus-visible")) return;
        e.currentTarget.querySelector<HTMLElement>("[data-pair-mark]")?.setAttribute("data-parted", "");
      }}
    >
      <span
        data-reveal=""
        className={clsx(
          styles.figure,
          lockup === "side" && styles.side,
          lockup === "beside" && styles.beside,
          descends && styles.descends,
        )}
      >
        <Figure
          as="span"
          value={figure.value}
          fit={figure.fit}
          inkLeft={figure.inkLeft}
          className={styles.figureFrame}
        />
      </span>
      <span className={styles.lockup}>
        <span data-reveal="" className={clsx(t.statement, styles.head)}>
          <PairMark vt={vt} className={styles.mark} />
          <span className={styles.title}>
            <Lines text={h1} />
          </span>
        </span>
        <span data-reveal="" className={clsx(t.small, t.muted, styles.meta)}>
          {meta}
        </span>
      </span>
    </a>
  );
}
