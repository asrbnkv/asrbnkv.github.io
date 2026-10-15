import clsx from "clsx";
import { Fragment } from "react";
import { Bust } from "@/components/Bust";
import { ButtonLink, CvLink } from "@/components/Button";
import { Flight } from "@/components/Flight";
import { Monument } from "@/components/Monument";
import { Pair } from "@/components/Pair";
import { ANCHORS, mailtoHref, PAIRS } from "@/content";
import t from "@/styles/type.module.css";
import type { SectionProps } from "../types";
import styles from "./Hero.module.css";

/**
 * The `hero` chapter: "Artëm / Product Owner" (02-home.md §1).
 *
 * Claim: in one second, Artëm, Product Owner, Paris, three languages, one
 *   number (DAU ×1 → ×2 at AppBazar) and the action.
 * Field: paper · anchor #top.
 *
 * One grid, three compositions (Hero.module.css):
 *   ≥ 1024   the poster: the facts stand on the role line's baseline
 *            (column 9); the pair across the full measure; statement and
 *            actions share the bottom row; the rows fill the first screen.
 *   600–1023 name, pair, statement, facts, actions.
 *   < 600    the phone's own order: the hard number right under the role
 *            line, then statement, facts, a full-width Email me (short
 *            phones: the actions move up).
 *
 * DOM order is the reading order (name, facts, number, statement, action);
 * the grid only moves things visually, and nothing focusable moves. The
 * children stay direct children of #top in this order: lib/fold.ts reads
 * them by index (the pair is the 3rd, the statement the 4th).
 *
 * The h1's text reads "Artem Product Owner" (a space between its lines);
 * its aria-label names him in full. The statement keeps its sentences in
 * spans: from 1280px each takes its own line.
 *
 * Contract kept for the system: the h1 holds the monument and the role (the
 * bust stays outside it); the Pair keeps id "hero-pair" for <Flight>; the
 * actions keep id "hero-actions" and data-handoff for the bar; the role
 * line, the bust and the facts carry data-flight-avoid; <Flight> stays the
 * last child (its layer sits above the type, inside this field). The pair
 * passes lead="both" (×1 and ×2 at the statement step).
 * The load beat (01 §6.1): the monument's masked rise (Monument), the role
 * and bust (data-beat), the facts row by row, then the statement and the
 * actions as one opacity step (data-beat="fade"); delays live in the CSS.
 */
/** The statement's sentences (the copy stays one string). */
const sentences = (text: string) => text.split(/(?<=[.!?])\s+(?=\S)/);

export function Hero({ locale, dict }: SectionProps) {
  const copy = dict.home.hero;
  return (
    <section id={ANCHORS.top} data-field="paper" aria-labelledby="hero-title" className={styles.root}>
      <div className={styles.name}>
        <h1 id="hero-title" aria-label={copy.h1Label} className={styles.h1}>
          <Monument variant="hero" />{" "}
          <span className={clsx(t.display, styles.role)} data-role="" data-beat="" data-flight-avoid="">
            {copy.role}
          </span>
        </h1>
        <span className={styles.bust} data-beat="" data-flight-avoid="">
          <Bust locale={locale} alt={copy.bustAlt} />
        </span>
        {/* The bust's one treatment: greyscale with a little more contrast,
            its matte eroded by half a pixel (no light fringe on the hair). */}
        <svg className={styles.tone} aria-hidden="true" focusable="false">
          <filter id="hero-bust-tone" colorInterpolationFilters="sRGB" x="0" y="0" width="100%" height="100%">
            <feColorMatrix type="saturate" values="0" result="grey" />
            <feComponentTransfer in="grey" result="tone">
              <feFuncR type="linear" slope="1.08" intercept="-0.04" />
              <feFuncG type="linear" slope="1.08" intercept="-0.04" />
              <feFuncB type="linear" slope="1.08" intercept="-0.04" />
            </feComponentTransfer>
            <feMorphology in="SourceAlpha" operator="erode" radius="0.5" result="matte" />
            <feComposite in="tone" in2="matte" operator="in" />
          </filter>
        </svg>
      </div>

      <ul className={clsx(t.body, styles.facts)} data-flight-avoid="">
        {copy.facts.map((fact) => (
          <li key={fact} data-beat="">
            {fact}
          </li>
        ))}
      </ul>

      <Pair
        id="hero-pair"
        size="M"
        data={PAIRS.dau}
        copy={dict.home.pairs.dau}
        motion="load"
        lead="both"
        className={styles.pair}
      />

      <p className={clsx(t.statement, styles.statement)} data-beat="fade">
        {sentences(copy.statement).map((line, i) => (
          <Fragment key={line}>
            {i > 0 ? " " : null}
            <span className={styles.sentence}>{line}</span>
          </Fragment>
        ))}
      </p>

      <div id="hero-actions" data-handoff="" className={styles.actions}>
        <div className={styles.cta} data-beat="fade">
          <ButtonLink href={mailtoHref(copy.ctaSubject)} className={styles.button}>
            {copy.cta}
          </ButtonLink>
        </div>
        <div className={styles.cv} data-beat="fade">
          <CvLink id="hero-cv" label={copy.cv} note={copy.cvNote} />
        </div>
      </div>

      <Flight heroId={ANCHORS.top} pairId="hero-pair" />
    </section>
  );
}
