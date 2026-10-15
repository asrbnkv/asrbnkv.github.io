import clsx from "clsx";
import { getDictionary, MEDIA, type Locale } from "@/content";
import styles from "./Bust.module.css";

/**
 * The portrait as a glyph (01-system.md §7.1, §8.3): his CV photo cut out
 * with a real alpha matte, standing on the role line's baseline.
 *
 * - "hero": clamp(4rem, display step × 0.9, 5.375rem): 86px at 1440, 64px at 390.
 * - "small": 64px (About, beside the facts).
 *
 * Never taller than 86 CSS px (the source is 193×173 and is never
 * upscaled). Sits on paper or stone only. Loaded eagerly: it is above the
 * fold. Place it OUTSIDE the h1 so the heading's name stays clean.
 */
export function Bust({
  locale,
  size = "hero",
  className,
  alt,
}: {
  locale: Locale;
  size?: "hero" | "small";
  className?: string;
  /** Defaults to dict.media.portrait.alt ("Artem Serebryannikov"). */
  alt?: string;
}) {
  const m = MEDIA.portrait;
  return (
    // A plain <img>: the file is already the right size and never optimised.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={m.src}
      width={m.width}
      height={m.height}
      alt={alt ?? getDictionary(locale).media.portrait.alt}
      className={clsx(styles.bust, size === "small" && styles.small, className)}
      loading="eager"
      decoding="async"
      draggable={false}
    />
  );
}
