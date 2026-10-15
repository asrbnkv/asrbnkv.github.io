"use client";

import clsx from "clsx";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { TextButton } from "@/components/Button";
import { CANNES_DAY } from "@/content/cases/cannes";
import type { CaseDayStrip } from "@/content/cases/types";
import { onceInView } from "@/lib/inView";
import { prefersReducedMotion } from "@/lib/motion";
import t from "@/styles/type.module.css";
import styles from "./DayStrip.module.css";

const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};
const SPAN = /(\d{2}:\d{2})–(\d{2}:\d{2})/;
const DAY_START = toMin(CANNES_DAY.start);
const DAY_END = toMin(CANNES_DAY.end);
/** The film the skip removes: "L'Inconnue", second in the plan (c_alt shows its two alternatives). */
const SKIP = 1;

interface Slot {
  start: number;
  end: number;
}

/** Read each film's slot off its time string; the fourth (title cut off on the screen) ends the day, and its length closes the app's own total. */
function slots(films: CaseDayStrip["films"]): Slot[] {
  const known = films.map((f) => f.time.match(SPAN));
  const counted = known.reduce((sum, m) => (m ? sum + toMin(m[2]) - toMin(m[1]) : sum), 0);
  return known.map((m) =>
    m ? { start: toMin(m[1]), end: toMin(m[2]) } : { start: DAY_END - (CANNES_DAY.minutes.plan - counted), end: DAY_END },
  );
}

/** A fraction of the day, to 5 places (0.01px on the widest strip; no long digit runs in the HTML). */
const frac = (minutes: number) => Math.round((minutes / (DAY_END - DAY_START)) * 1e5) / 1e5;

const place = (s: Slot) =>
  ({
    "--x": frac(s.start - DAY_START),
    "--w": frac(s.end - s.start),
  }) as CSSProperties;

const said = (counters: CaseDayStrip["counters"]["plan"]) => counters.map((c) => `${c.value} ${c.word}`).join(" · ");

/**
 * The day strip (03 §7.4): one festival day from the Cannes plan, drawn to
 * a linear time scale from 08:45 to 22:50, every value read off the app's
 * own screens. The skip is the page's live thing: press it and
 * "L'Inconnue" leaves the plan, the two real alternatives open under its
 * slot (from the slot's own start) and the tally re-counts (3 films, 5h 37m
 * in the dark). On wider screens the alternatives' lane is always reserved,
 * so nothing below it moves: not the tally the reader is watching, not the
 * button under the pointer. On phones the tally and the button lead the
 * strip and the lane opens at its foot (0fr → 1fr), so again nothing above
 * the change moves. Every change is a transition, so a quick second press
 * retargets mid-flight. Without JS the button is absent and a sentence says the same.
 * The drawing is aria-hidden; a hidden sentence gives the day in words and
 * a polite live region speaks the new tally.
 */
export function DayStrip({ strip }: { strip: CaseDayStrip }) {
  const ref = useRef<HTMLElement>(null);
  const [skipped, setSkipped] = useState(false);
  const [viaKey, setViaKey] = useState(false);
  const films = slots(strip.films);
  const alts = strip.alternatives.map((a) => {
    const m = a.time.match(SPAN);
    return { ...a, slot: m ? { start: toMin(m[1]), end: toMin(m[2]) } : films[SKIP] };
  });

  useEffect(() => {
    const el = ref.current;
    if (!el || el.hasAttribute("data-in")) return;
    if (prefersReducedMotion()) {
      el.setAttribute("data-in", "");
      return;
    }
    return onceInView(el, () => el.setAttribute("data-in", ""), { threshold: 0.25, rootMargin: "0px 0px -6% 0px" });
  }, []);

  const live = skipped
    ? `${said(strip.counters.skipped)}. ${strip.alternatives.map((a) => `${a.title}, ${a.time}, ${a.venue}: ${a.note}`).join(". ")}.`
    : said(strip.counters.plan);

  return (
    <figure
      ref={ref}
      className={styles.strip}
      data-skipped={skipped ? "" : undefined}
      data-via-key={viaKey ? "" : undefined}
    >
      <div className={styles.drawing} aria-hidden="true">
        <div className={styles.track}>
          {films.map((slot, i) => (
            <span
              key={strip.films[i].title}
              className={styles.bar}
              data-skip={i === SKIP ? "" : undefined}
              style={{ ...place(slot), "--k": i } as CSSProperties}
            />
          ))}
        </div>
        <div className={styles.labels}>
          {strip.films.map((film, i) => (
            <span
              key={film.title}
              className={clsx(t.small, styles.label)}
              data-end={i === strip.films.length - 1 ? "" : undefined}
              data-skip={i === SKIP ? "" : undefined}
              style={{ ...place(films[i]), "--k": i } as CSSProperties}
            >
              <span className={styles.title}>{film.title}</span>
              <span className={styles.when}>{film.venue ? `${film.time} · ${film.venue}` : film.time}</span>
            </span>
          ))}
        </div>
        <ol className={clsx(t.small, styles.list)}>
          {strip.films.map((film, i) => (
            <li key={film.title} data-skip={i === SKIP ? "" : undefined}>
              <span className={t.tabular}>{film.time}</span> · <span className={styles.title}>{film.title}</span>
              {film.venue ? ` · ${film.venue}` : null}
            </li>
          ))}
        </ol>
        <div className={styles.alts} data-on={skipped ? "" : undefined}>
          <div className={styles.altsInner}>
            {alts.map((alt, j) => (
              <span key={alt.title} className={styles.alt} style={{ ...place(alt.slot), "--j": j } as CSSProperties}>
                <span className={styles.altBar} />
                <span className={clsx(t.small, styles.altLabel)}>
                  <span className={styles.title}>{alt.title}</span> · {alt.time} · {alt.venue}: {alt.note}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.tally}>
        <div className={styles.counters} aria-hidden="true">
          {(["plan", "skipped"] as const).map((key) => (
            <p
              key={key}
              className={clsx(t.statement, styles.counterLine)}
              data-off={(key === "skipped") !== skipped ? "" : undefined}
            >
              {strip.counters[key].map((c, i) => (
                <span key={c.word}>
                  {i > 0 ? <span className={styles.sep}> · </span> : null}
                  <strong className={styles.value}>{c.value}</strong> {c.word}
                </span>
              ))}
            </p>
          ))}
        </div>
        <TextButton
          className={styles.skip}
          onClick={(e) => {
            setViaKey(e.detail === 0);
            setSkipped((s) => !s);
          }}
        >
          {skipped ? strip.keep : strip.skip}
        </TextButton>
      </div>
      <p className={clsx(t.body, styles.noScript)}>{strip.noScript}</p>
      <p className="visually-hidden" aria-live="polite">
        {live}
      </p>

      <figcaption className={clsx(t.small, t.muted, styles.caption)}>
        <span className="visually-hidden">{strip.sentence} </span>
        {strip.caption}
      </figcaption>
    </figure>
  );
}
