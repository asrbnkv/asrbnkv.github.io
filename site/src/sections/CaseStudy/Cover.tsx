import clsx from "clsx";
import type { CSSProperties } from "react";
import { Figure } from "@/components/Figure";
import { TypeSetPair } from "@/components/Marks";
import { Pair } from "@/components/Pair";
import { PAIRS, localizeFigure } from "@/content";
import t from "@/styles/type.module.css";
import { casePairCopy, COVER_REST, linesOf, type CaseView } from "./model";
import styles from "./Cover.module.css";

/** The load beat's start for one element (01 §5.2, 03 §9.1). */
const beat = (ms: number) => ({ "--beat-delay": `${ms}ms` }) as CSSProperties;

/**
 * A type-set cover pair parts over 600ms (03 §9.1), timed from hydration
 * (about 120ms into the beat) so it parts at about 500ms like a scaled pair.
 * Its inline dots carry tr-<slug>-a/-b through data-vt: the page-swap
 * script names them, with the unhashed class "trema", only for the
 * navigation in progress (01 §6.6, 03 §9.2).
 */
const COVER_PART = { delay: 380, duration: 600 } as const;

/**
 * The cover (03 §2): the case in one number. H1 on columns 1–7, the tagline
 * and meta on 8–12 (cap tops aligned); the figure at the giant step aligned
 * by its ink, in one of four variants (P over its scale, C on its dot, S
 * side, T stacked). Content-sized, so the next field shows at the fold.
 *
 * The cover pair carries the view-transition names tr-<slug>-a/-b, so the
 * work index's dots land on it (01 §6.6, 03 §9.2). Load beat ≤ 1.5s; without
 * JS everything is already in place.
 */
export function CaseCover({ view }: { view: CaseView }) {
  const { slug, locale, dict, copy, layout, figure } = view;
  const variant = layout.cover;
  const vt = { a: `tr-${slug}-a`, b: `tr-${slug}-b` };
  const lines = linesOf(copy.h1);
  const { caption, pair, typeSet, context } = copy.cover;
  const isScaled = variant === "P" || variant === "C";

  const typeSetPair = typeSet ? (
    <p className={clsx(t.statement, styles.typeSet)} data-cover-typeset="">
      <TypeSetPair
        before={typeSet.before}
        after={typeSet.after}
        joiner={dict.common.to}
        strike={layout.strike}
        vt={vt}
        partDelay={COVER_PART.delay}
        partDuration={COVER_PART.duration}
      />
    </p>
  ) : null;

  const contextLine = context ? <p className={clsx(t.small, styles.context)}>{context}</p> : null;

  return (
    <section
      id="top"
      data-field="paper"
      aria-labelledby="case-title"
      className={styles.cover}
      data-variant={variant}
      data-locale={locale}
      data-descends={layout.descends ? "" : undefined}
    >
      <h1 id="case-title" className={clsx(t.display, styles.h1)}>
        {lines.map((line, i) => (
          <span key={line} className={styles.line} data-beat="" style={beat(i * 70)}>
            {i > 0 ? " " : null}
            {line}
          </span>
        ))}
      </h1>

      <div className={styles.aside}>
        <p className={clsx(t.statement, styles.tagline)} data-beat="" style={beat(70)}>
          {copy.tagline}
        </p>
        <p className={clsx(t.small, t.muted, styles.meta)} data-beat="" style={beat(140)}>
          {copy.meta}
        </p>
      </div>

      <div className={styles.figure} data-beat="" style={beat(160)}>
        <Figure
          value={figure.value}
          fit={figure.fit}
          inkLeft={figure.inkLeft}
          coverRest={COVER_REST[variant]}
          align={variant === "C" ? "end" : "start"}
          inkRightTo={variant === "C" ? "cover-anchor" : undefined}
          className={styles.figureFrame}
        />
      </div>

      {variant === "C" && caption ? (
        <div className={styles.side} data-beat="" style={beat(300)}>
          <p className={clsx(t.statement, styles.caption)}>{caption}</p>
        </div>
      ) : null}

      {variant === "S" ? (
        <div className={styles.side} data-beat="" style={beat(300)}>
          {caption ? <p className={clsx(t.statement, styles.caption)}>{caption}</p> : null}
          {typeSetPair}
          {contextLine}
        </div>
      ) : null}

      {isScaled && pair ? (
        <div className={styles.pair} data-beat="fade" style={beat(300)}>
          <Pair
            size="M"
            data={variant === "C" ? PAIRS.retention : PAIRS.dau}
            copy={casePairCopy(pair, variant === "C" ? localizeFigure("0%", locale) : "0")}
            motion="load"
            vt={vt}
            anchorId={variant === "C" ? "cover-anchor" : undefined}
          />
          <p className={clsx(t.small, t.muted, styles.pairCaption)}>{pair.caption}</p>
        </div>
      ) : null}

      {variant === "T" ? (
        <>
          <div className={styles.lowerStart} data-beat="" style={beat(300)}>
            {typeSetPair}
          </div>
          <div className={styles.lowerEnd} data-beat="" style={beat(340)}>
            {contextLine}
          </div>
        </>
      ) : null}
    </section>
  );
}
