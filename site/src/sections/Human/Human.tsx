import clsx from "clsx";
import type { CSSProperties } from "react";
import { Reveal } from "@/components/Reveal";
import { Pan, Plate } from "@/components/Stage";
import { ANCHORS, caseHref, type Locale } from "@/content";
import { CANNES_DAY } from "@/content/cases/cannes";
import type { CaseDayStrip } from "@/content/cases/types";
import t from "@/styles/type.module.css";
import type { SectionProps } from "../types";
import styles from "./Human.module.css";

/**
 * The `human` chapter: "7h 56m in the dark" (02-home.md §9).
 *
 * Claim: off the clock he still builds. At the Cannes Film Festival he built
 *   an app that planned his three days, and his own planner counts 7h 56m in
 *   the dark.
 * Idea: the page is the app, enlarged. The headline is the planner's own
 *   counter and the day under it is the planner's own rhythm bar, drawn to
 *   scale from the screen's values: four films whose lengths add up to the
 *   headline. The reader's scroll walks the real day plan through its window
 *   (`Pan`, 01 §8.2, the chapter's one scroll-linked move) until the screen
 *   locks into the page: its counter on the H2's baseline, its rhythm bar on
 *   the drawn day's line. Without scroll timelines and under reduced motion
 *   the window holds that lock.
 * Field: ink, a dark room for a cinema story and the stage for the screens.
 *
 * Below: c_alt whole (an M plate: the same day with one film skipped,
 *   re-tallied to 5h 37m, its two alternatives in the slot) and c_film (an S
 *   plate: a film card), staggered.
 *
 * Words: dict.home.human; the day's titles and its sentence in words:
 * dict.projects.cannes.dayStrip (the case's own, read off the screens);
 * the screens' alt text and captions: dict.media. No year is printed.
 */
export function Human({ locale, dict }: SectionProps) {
  const copy = dict.home.human;
  const { time, spoken, rest } = copy.h2Parts;
  const strip = dict.projects.cannes.dayStrip;
  // One text run (a continuous underline); the title never breaks inside,
  // so a two-line link breaks after the colon.
  const caseLink = `${copy.readCase} ${dict.projects.cannes.title.replace(/ /g, " ")}`;
  return (
    <Reveal
      as="section"
      id={ANCHORS.offTheClock}
      data-field="ink"
      aria-labelledby="human-title"
      className={styles.root}
    >
      {/* One line rises as one unit; "in the dark" comes out of the dark
          once the time has landed (opacity only, Human.module.css). */}
      <h2 id="human-title" data-reveal="" className={clsx(t.display, styles.title)}>
        <span aria-hidden="true">{time}</span>
        <span className="visually-hidden">{spoken}</span>{" "}
        <span className={styles.rest}>{rest}</span>
      </h2>
      {strip ? <Day strip={strip} locale={locale} /> : null}
      <p data-reveal="" className={clsx(t.statement, styles.statement)}>
        {copy.statement}
      </p>
      <p data-reveal="" className={clsx(t.body, styles.note)}>
        {copy.body}
      </p>
      <p data-reveal="" className={clsx(t.body, styles.case)}>
        <a href={caseHref(locale, "cannes")}>{caseLink}</a>
      </p>

      <Pan locale={locale} alt={copy.panAlt} caption={copy.panCaption} className={styles.pan} />

      {/* One reveal part: the two screens settle as one batch, M then S. */}
      <div data-reveal="" className={styles.plates}>
        <Plate id="c_alt" size="M" locale={locale} className={styles.alt} />
        <Plate id="c_film" size="S" locale={locale} className={styles.film} />
      </div>
    </Reveal>
  );
}

const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};
const SPAN = /(\d{2}:\d{2})–(\d{2}:\d{2})/;
const DAY_START = toMin(CANNES_DAY.start);
const DAY_END = toMin(CANNES_DAY.end);

/** A length in the H2's own form: "2h 20m" / « 2 h 20 ». */
function length(minutes: number, locale: Locale) {
  const h = Math.floor(minutes / 60);
  const m = String(minutes % 60).padStart(2, "0");
  return locale === "fr" ? `${h} h ${m}` : `${h}h ${m}m`;
}

/**
 * The day, drawn (the planner's rhythm bar at the page's scale): 08:45 at
 * the start edge, 22:50 at the end edge, linear. Each film is a lit bar at
 * its slot, named under it with its length; the fourth film's title is cut
 * off on the screen, so it stays a label, and its length closes the app's
 * own total (140 + 139 + 82 + 115 = 476 minutes, 7h 56m; 03 §7.4). The
 * drawing is aria-hidden: the day is said in words (the case's sentence).
 */
function Day({ strip, locale }: { strip: CaseDayStrip; locale: Locale }) {
  const known = strip.films.map((f) => f.time.match(SPAN));
  const counted = known.reduce((sum, m) => (m ? sum + toMin(m[2]) - toMin(m[1]) : sum), 0);
  const films = strip.films.map((f, i) => {
    const m = known[i];
    const start = m ? toMin(m[1]) : DAY_END - (CANNES_DAY.minutes.plan - counted);
    const end = m ? toMin(m[2]) : DAY_END;
    return { title: f.title, start, end };
  });
  const span = DAY_END - DAY_START;
  return (
    <div data-reveal="" className={styles.day}>
      <p className="visually-hidden">{strip.sentence}</p>
      <div aria-hidden="true" className={styles.films}>
        {films.map((f, i) => (
          <div
            key={f.title}
            className={styles.slot}
            data-last={i === films.length - 1 ? "" : undefined}
            style={{ "--x": (f.start - DAY_START) / span, "--w": (f.end - f.start) / span } as CSSProperties}
          >
            <span className={styles.bar} />
            <span className={clsx(t.smallStrong, styles.name)}>{f.title}</span>
            <span className={clsx(t.small, t.muted, t.tabular, styles.length)}>{length(f.end - f.start, locale)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
