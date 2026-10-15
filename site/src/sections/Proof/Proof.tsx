import clsx from "clsx";
import { Fragment, type CSSProperties } from "react";
import { textButtonClass } from "@/components/Button";
import { DotField } from "@/components/DotField";
import { Figure } from "@/components/Figure";
import { TypeSetPair } from "@/components/Marks";
import { Pair } from "@/components/Pair";
import { Reveal } from "@/components/Reveal";
import { Plate } from "@/components/Stage";
import { StatRow } from "@/components/StatRow";
import {
  ANCHORS,
  caseHref,
  FIGURES,
  localizeFigure,
  MEDIA,
  PAIRS,
  PROJECTS,
  type Dictionary,
  type FigureId,
  type Locale,
} from "@/content";
import type { ProofCopy, SceneHead } from "@/content/sections/proof";
import t from "@/styles/type.module.css";
import type { SectionProps } from "../types";
import styles from "./Proof.module.css";
import { Scene } from "./Scene";
import s from "./Scenes.module.css";

/**
 * The proof chapter, "Shipped, then measured" (02-home.md §3): ink, a
 * centred title card (the page's one centred moment and its one rest), then
 * four number scenes, each its own composition so no neighbours share one:
 *   A over its scale (+100%) · B quote poster (2×) · C on its dot (97%, the
 *   climax) · D unit field (80+).
 * Every scene tells its mess, then its number. Every word is in the HTML;
 * pairs and the field are aria-hidden drawings with their sentences; figures
 * are real text. Motion: Scene.tsx (partings, the field's count) and
 * useSceneEnter.ts (entrances).
 */
export function Proof({ locale, dict }: SectionProps) {
  const copy = dict.home.proof;
  return (
    <Reveal as="section" id={ANCHORS.results} data-field="ink" aria-labelledby="proof-title" className={styles.root}>
      <div className={styles.card}>
        <h2 id="proof-title" data-reveal className={clsx(t.display, styles.title)}>
          {copy.h2}
        </h2>
        <p data-reveal className={clsx(t.statement, styles.statement)}>
          {copy.statement}
        </p>
      </div>
      <SceneA locale={locale} dict={dict} copy={copy} />
      <SceneB locale={locale} dict={dict} copy={copy} />
      <SceneC locale={locale} dict={dict} copy={copy} />
      <SceneD locale={locale} dict={dict} copy={copy} />
    </Reveal>
  );
}

type SceneProps = { locale: Locale; dict: Dictionary; copy: ProofCopy };

/** The measure (h3, statement step). */
function Title({ id, children }: { id: string; children: string }) {
  return (
    <h3 id={id} data-reveal className={clsx(t.statement, styles.h3)}>
      {children}
    </h3>
  );
}

/** The case reference (Small, muted), under its h3. */
function Ref({ head, className }: { head: SceneHead; className?: string }) {
  return (
    <p data-reveal className={clsx(t.small, t.muted, styles.ref, className)}>
      {head.ref}
    </p>
  );
}

/** "Read the case", named by its case title for assistive tech; it fades in. */
function CaseLink({ figure, locale, dict, copy, className }: SceneProps & { figure: FigureId; className?: string }) {
  const slug = FIGURES[figure].case;
  return (
    <p data-reveal="fade" className={clsx(styles.link, className)}>
      <a href={caseHref(locale, slug)} className={textButtonClass} data-scene-link="">
        {copy.readCase}
        <span className="visually-hidden">
          {copy.readCaseSep}
          {dict.projects[slug].title}
        </span>
      </a>
    </p>
  );
}

/**
 * A giant figure by the fit rule. Its wrapper is the scene's cue: the figure
 * rises from behind its own baseline once the stage has arrived, and a real
 * pointer over it replays the parting. `--fit` is the figure's ink width in
 * em for this locale; the composition sizes the wrapper (its measure).
 */
function SceneFigure({
  figure,
  locale,
  className,
  align,
  inkRightTo,
  style,
}: {
  figure: FigureId;
  locale: Locale;
  className: string;
  align?: "start" | "end";
  inkRightTo?: string;
  style?: CSSProperties;
}) {
  const f = FIGURES[figure];
  return (
    <div
      data-enter="mask"
      data-scene-figure=""
      className={clsx(styles.figure, styles.mask, className)}
      style={{ "--fit": f.fit[locale], "--ink-l": f.inkLeft[locale], ...style } as CSSProperties}
    >
      <Figure value={f.value[locale]} fit={f.fit[locale]} inkLeft={f.inkLeft[locale]} align={align} inkRightTo={inkRightTo} />
    </div>
  );
}

/**
 * A · over its scale. The mess (top right, beside the measure), +100% with
 * the real screen standing on its cap line, the DAU pair across the full
 * measure, and the period's other figures as one line beside the scale.
 */
function SceneA(props: SceneProps) {
  const { locale, dict, copy } = props;
  const stats = PROJECTS["appbazar-product"].stats.map((stat, i) => ({
    value: localizeFigure(stat.value, locale),
    caption: copy.a.stats[i],
  }));
  return (
    <Scene
      labelledBy="proof-a-title"
      className={s.a}
      scrubShare={0.6}
      style={
        {
          "--shot-w": `${MEDIA.ab_feed.width}px`,
          "--shot-h": `${MEDIA.ab_feed.height}px`,
          "--fit": FIGURES.dau.fit[locale],
        } as CSSProperties
      }
    >
      <div className={clsx(styles.head, s.aHead)}>
        <Title id="proof-a-title">{copy.a.h3}</Title>
        <Ref head={copy.a} />
      </div>
      <div className={s.aStory}>
        <p data-reveal className={clsx(t.body, styles.copy, s.aCopy)}>
          {copy.a.copy}
        </p>
        <CaseLink {...props} figure="dau" className={s.sceneLink} />
      </div>
      <SceneFigure figure="dau" locale={locale} className={s.aFigure} />
      <div className={s.aShot} data-cue-delay="200">
        <Plate id="ab_feed" size="XS" locale={locale} />
      </div>
      {/* No entrance of its own: the parting is the pair's entrance. */}
      <div className={s.aPair}>
        <Pair size="L" data={PAIRS.dau} copy={dict.home.pairs.dau} motion="scrub" />
      </div>
      <div className={s.aStats} data-enter="stats" data-cue-delay="320">
        <StatRow items={stats} className={styles.stats} />
      </div>
    </Scene>
  );
}

/** The managers' words, word by word from behind their baseline; the opening mark hangs from 1024px. */
function Quote({ text, marks }: { text: string; marks: readonly [string, string] }) {
  const bare = (m: string) => m.replace(/[\s  ]/g, "");
  const [open, close] = [bare(marks[0]), bare(marks[1])];
  // French keeps its U+202F inside the guillemets, inside the measure.
  const padOpen = marks[0].slice(marks[0].indexOf(open) + open.length);
  const padClose = marks[1].slice(0, marks[1].indexOf(close));
  const words = text.split(" ");
  return (
    <p>
      {words.map((word, i) => (
        <Fragment key={i}>
          {i > 0 ? " " : null}
          <span className={styles.word} style={{ "--w": i } as CSSProperties}>
            <span>
              {i === 0 ? (
                <>
                  <span className={s.hang}>{open}</span>
                  {padOpen}
                </>
              ) : null}
              {word}
              {i === words.length - 1 ? `${padClose}${close}` : null}
            </span>
          </span>
        </Fragment>
      ))}
    </p>
  );
}

/** B · quote poster: the story top left, 2× on the right margin, the managers' words under it. A Z. */
function SceneB(props: SceneProps) {
  const { locale, dict, copy } = props;
  const quote = dict.projects.havaianas.quote;
  return (
    <Scene
      labelledBy="proof-b-title"
      className={s.b}
      pin="short"
      style={{ "--fit": FIGURES.upsell.fit[locale] } as CSSProperties}
    >
      <div className={s.bText}>
        <div className={styles.head}>
          <Title id="proof-b-title">{copy.b.h3}</Title>
          <Ref head={copy.b} />
        </div>
        <p data-reveal className={clsx(t.body, styles.copy, s.bCopy)}>
          {copy.b.copy}
        </p>
        <CaseLink {...props} figure="upsell" className={s.sceneLink} />
      </div>
      {/* the days the copy starts from, answered beside the figure, on its baseline */}
      <p data-reveal data-cue-delay="200" className={clsx(t.display, s.bTypeset)}>
        <TypeSetPair before={copy.b.typeSet.before} after={copy.b.typeSet.after} joiner={copy.b.typeSet.joiner} />
      </p>
      <span id="proof-b-edge" className={s.edge} aria-hidden="true" />
      <SceneFigure figure="upsell" locale={locale} className={s.bFigure} align="end" inkRightTo="proof-b-edge" />
      {quote ? (
        <figure className={s.quote}>
          <blockquote data-enter="words" data-cue-delay="300" data-cue-pin="" className={clsx(t.statementStrong, styles.words, s.quoteText)}>
            <Quote text={quote.text} marks={copy.b.quoteMarks} />
          </blockquote>
          <figcaption data-reveal="fade" data-cue-delay="620" data-cue-pin="" className={clsx(t.small, t.muted, s.attribution)}>
            {copy.b.attribution}
          </figcaption>
        </figure>
      ) : null}
    </Scene>
  );
}

/** C · on its dot (the climax): 97% stands on its after dot, the 60–70% forecast drawn as a capsule. */
function SceneC(props: SceneProps) {
  const { locale, dict, copy } = props;
  return (
    <Scene
      labelledBy="proof-c-title"
      className={s.c}
      style={
        {
          "--after": PAIRS.retention.after / PAIRS.retention.max,
          "--fit": FIGURES.retention.fit[locale],
        } as CSSProperties
      }
    >
      <div className={s.cText}>
        <div className={styles.head}>
          <Title id="proof-c-title">{copy.c.h3}</Title>
          <Ref head={copy.c} />
        </div>
        <p data-reveal className={clsx(t.body, styles.copy)}>
          {copy.c.copy}
        </p>
        <CaseLink {...props} figure="retention" className={s.sceneLink} />
      </div>
      <SceneFigure
        figure="retention"
        locale={locale}
        className={s.cFigure}
        align="end"
        inkRightTo="proof-c-dot"
      />
      {/* No entrance of its own: the crossing is the pair's entrance. */}
      <div className={s.cPair}>
        <Pair size="L" data={PAIRS.retention} copy={dict.home.pairs.retention} motion="scrub" anchorId="proof-c-dot" />
      </div>
    </Scene>
  );
}

/** D · unit field: 80+, the struck "No CRM", one dot per account (counted in under the reader's scroll), the four markets. */
function SceneD(props: SceneProps) {
  const { locale, dict, copy } = props;
  const { before, after, spoken } = copy.d.typeSet;
  // The words read in place of the inline pair: "to" in English, ", puis" in French.
  const joiner =
    spoken.startsWith(before) && spoken.endsWith(after)
      ? spoken.slice(before.length, spoken.length - after.length).trim() || dict.common.to
      : dict.common.to;
  return (
    <Scene
      labelledBy="proof-d-title"
      className={s.d}
      count
      style={{ "--fit": FIGURES.accounts.fit[locale] } as CSSProperties}
    >
      <div className={s.dText}>
        <div className={styles.head}>
          <Title id="proof-d-title">{copy.d.h3}</Title>
          <Ref head={copy.d} />
        </div>
        <p data-reveal className={clsx(t.body, styles.copy)}>
          {copy.d.copy}
        </p>
        <CaseLink {...props} figure="accounts" className={s.sceneLink} />
      </div>
      <SceneFigure figure="accounts" locale={locale} className={s.dFigure} />
      <p data-reveal data-cue-delay="200" className={clsx(t.statement, s.typeset)}>
        <TypeSetPair before={before} after={after} joiner={joiner} />
      </p>
      {/* The scene counts the field in (Scene.tsx): row by row, under the reader's scroll when pinned. */}
      <div className={s.field} data-field-host="" data-cue-delay="360">
        <DotField segments={[{ kind: "after", count: 80 }]} cols={10} label={copy.d.fieldSentence} caption={copy.d.fieldCaption} />
      </div>
      <div data-reveal data-cue-delay="280" className={s.markets}>
        <p className={clsx(t.body, s.marketsList)}>{copy.d.markets}</p>
        <p className={clsx(t.small, t.muted)}>{copy.d.marketsCaption}</p>
      </div>
    </Scene>
  );
}
