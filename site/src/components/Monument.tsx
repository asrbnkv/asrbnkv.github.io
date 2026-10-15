import clsx from "clsx";
import type { CSSProperties } from "react";
import styles from "./Monument.module.css";
import { MonumentHomecoming } from "./MonumentHomecoming";

/**
 * "Artëm" (01-system.md §3.4): the page's only mark. The e is a plain e
 * wrapping two drawn dots, so the dots can leave (the flight) and come home
 * (the footer). Always aria-hidden: the name is carried by an aria-label
 * (the hero h1) or by text nearby (the footer row).
 *
 *   hero    ink, load beat ("ARTEM becomes Artëm": each letter rises out of
 *           a mask at the baseline at full ink, then the dots drop in);
 *           width-bound, bleeds 0.05em off the right edge; put it inside the
 *           h1 (as="span").
 *   footer  paper letters on ink, orange dots that drop home when 35% visible
 *           (as="p").
 *   fallen  the 404: "Artem", both dots lying on the baseline after the m.
 *
 * The component is its own inline-size container (--step-monument uses cqi),
 * so give it the full width of the viewport: no inline padding on its parent.
 * The parent must clip the bleed with overflow: clip (never hidden).
 *
 * The flight finds the hero's dots through data-monument-dot="l" | "r".
 * The dots are inline (zero-advance inline-blocks after the e), never
 * absolutely positioned: a block-level box inside the word would split it
 * for innerText, find-in-page and reader modes ("Arte / m").
 */
export function Monument({
  variant = "hero",
  as: Tag = "span",
  beat = variant === "hero",
  className,
}: {
  variant?: "hero" | "footer" | "fallen";
  as?: "span" | "p" | "div";
  /** Play the load beat (hero only by default). */
  beat?: boolean;
  className?: string;
}) {
  // The masked rise (Monument.module.css): 30ms apart, transform only, so
  // overlapping joins never compound two half-transparent glyphs.
  const delay = (i: number) => (beat ? ({ "--letter-delay": `${i * 30}ms` } as CSSProperties) : undefined);
  const letter = (ch: string, i: number, extra?: string) => (
    <span className={clsx(styles.letter, extra)} style={delay(i)}>
      {ch}
    </span>
  );

  return (
    <Tag
      className={clsx(
        styles.frame,
        variant === "footer" && styles.footer,
        variant === "fallen" && styles.fallen,
        beat && styles.beat,
        className,
      )}
      aria-hidden="true"
      data-monument={variant}
    >
      <span className={styles.line}>
        {letter("A", 0, styles.a)}
        {letter("r", 1, styles.r)}
        {letter("t", 2)}
        <span className={clsx(styles.letter, styles.e)} style={delay(3)}>
          e
          {variant === "fallen" ? null : (
            <>
              <i
                className={clsx(styles.dot, styles.dotL)}
                data-monument-dot="l"
                style={{ "--drop-delay": "620ms" } as CSSProperties}
              />
              <i
                className={clsx(styles.dot, styles.dotR)}
                data-monument-dot="r"
                style={{ "--drop-delay": "680ms" } as CSSProperties}
              />
            </>
          )}
        </span>
        {letter("m", 4)}
        {variant === "fallen" ? (
          <>
            <i className={clsx(styles.fallenDot, styles.fallenDotL)} />
            <i className={clsx(styles.fallenDot, styles.fallenDotR)} />
          </>
        ) : null}
      </span>
      {variant === "footer" ? <MonumentHomecoming /> : null}
    </Tag>
  );
}
