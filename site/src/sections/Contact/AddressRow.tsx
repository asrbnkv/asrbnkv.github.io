"use client";

import { Fragment, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { TextButton } from "@/components/Button";
import styles from "./Contact.module.css";

/**
 * The address row (02-home.md §10.1, 01 §7.14): the mailto at the measure,
 * the page's one size outside the scale, and Copy 24px after it, on its
 * baseline.
 *
 * - The address is set letter by letter (aria-hidden; the link carries the
 *   address as its name), so the letters can rise out of their own line
 *   (Contact.module.css). Under 600px the line breaks at the @ through a
 *   <wbr>, so a copied selection is still one address.
 * - Its underline is a drawn rule, 0.04em thick at baseline + 0.12em, laid
 *   on a twin of the address in transparent ink: one segment per letter,
 *   none under a descender, its neighbours stopping 0.06em clear of the g's
 *   tail (skip-ink, the same in every browser). The rule draws in one
 *   stroke and thickens on hover; the rising letters never move it.
 * - Copy writes the address with navigator.clipboard. Its label keeps the
 *   letters "Copy" and "Copied" share in place and crossfades only the rest
 *   (160ms through a 2px blur) for 1.6s; a polite live region says "Address
 *   copied". Without a clipboard (or when it refuses) it selects the address
 *   (ink on paper, the field's selection) and says "Address selected".
 * - Copy exists only under html.js (it cannot work without script).
 */
const COPIED_FOR = 1600;

/** Depth each letter rises from, past its line box (em): a scattered start
 *  that settles into one baseline. Fixed, so server and client agree. */
const DEPTHS = [0.06, 0.32, 0.14, 0.4, 0.22, 0.04, 0.28, 0.18, 0.36, 0.1, 0.3, 0.02, 0.24, 0.38, 0.12, 0.34, 0.08];

/** Letters whose tails cross the rule: no segment under them. */
const DESCENDER = /[gjpqy]/u;

/** How many leading letters two labels share ("Cop|y", "Cop|ied"; "Copi|er", "Copi|é"). */
function sharedPrefix(a: string, b: string): number {
  let n = 0;
  while (n < a.length && n < b.length && a[n] === b[n]) n++;
  return n;
}

interface AddressRowProps {
  email: string;
  href: string;
  labels: { copy: string; copied: string; copiedLive: string; selectedLive: string };
}

export function AddressRow({ email, href, labels }: AddressRowProps) {
  const glyphsRef = useRef<HTMLSpanElement>(null);
  const timer = useRef(0);
  const frame = useRef(0);
  const [copied, setCopied] = useState(false);
  const [live, setLive] = useState("");

  useEffect(
    () => () => {
      window.clearTimeout(timer.current);
      cancelAnimationFrame(frame.current);
    },
    [],
  );

  /** Empty the region first, so a repeated press is announced again. */
  const announce = (text: string) => {
    setLive("");
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => setLive(text));
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setCopied(false);
      setLive("");
    }, COPIED_FOR);
  };

  const selectAddress = () => {
    const el = glyphsRef.current;
    const selection = window.getSelection();
    if (!el || !selection) return;
    const range = document.createRange();
    range.selectNodeContents(el);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  const onCopy = async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("clipboard unavailable");
      await navigator.clipboard.writeText(email);
    } catch {
      selectAddress();
      announce(labels.selectedLive);
      return;
    }
    setCopied(true);
    announce(labels.copiedLive);
  };

  // "asrbnkv@" | "gmail.com": the phone breaks the line at the @.
  const chars = Array.from(email);
  const at = chars.indexOf("@") + 1;
  const halves = at > 0 && at < chars.length ? [chars.slice(0, at), chars.slice(at)] : [chars];
  const startOf = (h: number) => (h > 0 ? halves[0].length : 0);

  const layer = (glyph: (ch: string, i: number) => ReactNode, halfClass: string) =>
    halves.map((half, h) => (
      <Fragment key={h}>
        {h > 0 ? <wbr /> : null}
        <span className={halfClass}>{half.map((ch, j) => glyph(ch, startOf(h) + j))}</span>
      </Fragment>
    ));

  const n = sharedPrefix(labels.copy, labels.copied);

  return (
    <div className={styles.addressRow} data-handoff="">
      <p className={styles.addressCell}>
        <span
          className={styles.addressPart}
          data-reveal="mask"
          data-reveal-at="0.9"
          data-reveal-key="address"
          data-reveal-span="550"
        >
          <a href={href} className={styles.address} aria-label={email}>
            <span ref={glyphsRef} className={styles.glyphLayer} aria-hidden="true">
              {layer(
                (ch, i) => (
                  <span
                    key={i}
                    className={styles.glyph}
                    style={{ "--i": i, "--g-extra": `${DEPTHS[i % DEPTHS.length]}em` } as CSSProperties}
                  >
                    {ch}
                  </span>
                ),
                styles.half,
              )}
            </span>
            <span className={styles.ruleLayer} aria-hidden="true">
              {layer(
                (ch, i) => (
                  <span
                    key={i}
                    className={styles.ruleGlyph}
                    data-skip={DESCENDER.test(ch) ? "" : undefined}
                    data-skip-end={DESCENDER.test(chars[i + 1] ?? "") ? "" : undefined}
                    data-skip-start={DESCENDER.test(chars[i - 1] ?? "") ? "" : undefined}
                  >
                    {ch}
                  </span>
                ),
                styles.ruleHalf,
              )}
            </span>
          </a>
        </span>
      </p>
      <span className={styles.copyCell} data-reveal="ui" data-reveal-with="address">
        <TextButton onClick={onCopy} className={styles.copy} data-copied={copied ? "" : undefined}>
          <span className="visually-hidden">{copied ? labels.copied : labels.copy}</span>
          <span className={styles.copyFace} aria-hidden="true">
            {n > 0 ? <span className={styles.copyPrefix}>{labels.copy.slice(0, n)}</span> : null}
            <span className={styles.copySuffixes}>
              <span className={styles.copySuffix}>{labels.copy.slice(n)}</span>
              <span className={styles.copySuffix}>{labels.copied.slice(n)}</span>
            </span>
          </span>
        </TextButton>
      </span>
      <span role="status" className="visually-hidden">
        {live}
      </span>
    </div>
  );
}
