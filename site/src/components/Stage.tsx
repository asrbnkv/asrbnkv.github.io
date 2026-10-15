import clsx from "clsx";
import type { CSSProperties, ReactNode } from "react";
import { getDictionary, MEDIA, type Locale, type MediaId } from "@/content";
import { Reveal } from "./Reveal";
import styles from "./Stage.module.css";

/**
 * The screen stage and its plates (01-system.md §8.1).
 *
 *   <Stage>                                  full-bleed ink band, hard cuts
 *     <Plate id="roadmap" size="L" locale={locale} />
 *     <Plate id="ai" size="S" locale={locale} />
 *   </Stage>
 *
 * The section places plates on its own columns and offsets (one to three
 * per stage, staggered, never a row of identical boxes; the Cannes trio is
 * the model). Plates M, S and XS settle from 0.94 with opacity once they
 * enter; L scales 0.92 → 1 with the scroll (CSS view timeline). Every plate
 * is a <figure data-ui> with its caption under it (dict.media[id].caption).
 */
export function Stage({
  children,
  className,
  as: Tag = "div",
  style,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section";
  style?: CSSProperties;
}) {
  return (
    <Reveal as={Tag} data-field="ink" className={clsx(styles.stage, className)} style={style}>
      {children}
    </Reveal>
  );
}

const PLATE_CLASS = { L: styles.l, "L-wide": styles.lWide, M: styles.m, S: styles.s, XS: styles.xs } as const;

/** A raster for a plate: a MEDIA entry's file, or a static import (StaticImageData fits). */
export interface PlateImage {
  src: string;
  width: number;
  height: number;
}

export function Plate({
  id,
  locale,
  size,
  caption = true,
  alt,
  image,
  phone,
  eager = false,
  sizes,
  className,
  style,
}: {
  id: Exclude<MediaId, "portrait">;
  locale: Locale;
  size: "L" | "L-wide" | "M" | "S" | "XS";
  /** true: dict.media[id].caption under the screen · false: none · a string: the chapter's own caption. */
  caption?: boolean | string;
  /** The chapter's own alt text (else dict.media[id].alt). */
  alt?: string;
  /** Another graded file of the same screen (an art-directed crop; else MEDIA[id]). */
  image?: PlateImage;
  /** A phone crop (<600px), served through <picture>; the alt still describes the screen. */
  phone?: PlateImage;
  /** The first stage plate above the fold only. */
  eager?: boolean;
  /** The <img> sizes hint; defaults from the plate size. */
  sizes?: string;
  className?: string;
  style?: CSSProperties;
}) {
  const m = image ?? MEDIA[id];
  const words = getDictionary(locale).media[id];
  const shownCaption = typeof caption === "string" ? caption : caption ? words.caption : undefined;
  const hint =
    sizes ??
    (size === "XS" ? "146px" : size === "S" ? "(min-width: 1024px) 33vw, 50vw" : size === "M" ? "(min-width: 1024px) 50vw, 100vw" : "100vw");
  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={m.src}
      width={m.width}
      height={m.height}
      alt={alt ?? words.alt}
      sizes={hint}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : undefined}
      decoding="async"
    />
  );
  return (
    <figure
      className={clsx(styles.plate, PLATE_CLASS[size], className)}
      style={style}
      data-ui=""
      data-plate={size}
      data-reveal={size === "L" || size === "L-wide" ? "fade" : "settle"}
    >
      {phone ? (
        <picture>
          <source media="(max-width: 599px)" srcSet={phone.src} width={phone.width} height={phone.height} />
          {img}
        </picture>
      ) : (
        img
      )}
      {shownCaption ? <figcaption className={styles.caption}>{shownCaption}</figcaption> : null}
    </figure>
  );
}

/**
 * The moving picture (01 §8.2): the real Cannes day plan panned inside a 1:1
 * window by the reader's scroll (linear, the window's view timeline from 75%
 * entered until its top meets the bar, so the whole walk is read in view).
 * It arrives like a plate: the window settles from 0.94 (top edge fixed)
 * while the figure and its caption only fade.
 * Static top without scroll-timeline support and under reduced motion.
 * Pass `timeline="--human"` to drive it from a chapter's own view-timeline.
 */
export function Pan({
  id = "c_day",
  locale,
  timeline,
  alt,
  caption,
  className,
}: {
  id?: "c_day" | "c_rhythm" | "c_alt";
  locale: Locale;
  timeline?: string;
  /** The window's name, when the chapter has its own words (else dict.media[id].alt). */
  alt?: string;
  /** The caption, when the chapter has its own words (else dict.media[id].caption). */
  caption?: string;
  className?: string;
}) {
  const m = MEDIA[id];
  const media = getDictionary(locale).media[id];
  const words = { alt: alt ?? media.alt, caption: caption ?? media.caption };
  return (
    <figure className={clsx(styles.pan, className)} data-ui="" data-reveal="fade">
      <div
        className={styles.window}
        role="img"
        aria-label={words.alt}
        style={{ "--pan-ratio": m.width / m.height, ...(timeline ? { "--pan-timeline": timeline } : {}) } as CSSProperties}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={m.src} width={m.width} height={m.height} alt="" loading="lazy" decoding="async" />
      </div>
      {words.caption ? <figcaption className={styles.caption}>{words.caption}</figcaption> : null}
    </figure>
  );
}
