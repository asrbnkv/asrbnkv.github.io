import clsx from "clsx";
import { Reveal } from "@/components/Reveal";
import { Plate } from "@/components/Stage";
import { MEDIA } from "@/content";
import t from "@/styles/type.module.css";
import c from "./Case.module.css";
import { Lines } from "./Lines";
import type { CaseView } from "./model";
import { RetroLine } from "./RetroLine";
import styles from "./Closing.module.css";
import w from "./Work.module.css";

/**
 * The quote (03 §4), Havaianas only: "the god of Excel" as one centred
 * display line on a full ink field, the case pages' one centred moment and
 * one declared rest. The heading is visually hidden; nothing else moves.
 */
export function CaseQuote({ view }: { view: CaseView }) {
  const quote = view.project?.quote;
  if (!quote) return null;
  const text = view.locale === "fr" ? `« ${quote.text} »` : `“${quote.text}”`;
  return (
    <Reveal as="section" data-field="ink" aria-labelledby="quote-title" className={styles.quote}>
      <h2 id="quote-title" className="visually-hidden">
        {quote.heading}
      </h2>
      <figure className={styles.quoteFigure}>
        <blockquote data-reveal="" className={styles.blockquote}>
          <p className={clsx(t.display, styles.quoteLine)}>{text}</p>
        </blockquote>
        <figcaption data-reveal="" className={clsx(t.small, t.muted, styles.source)}>
          {quote.source}
        </figcaption>
      </figure>
    </Reveal>
  );
}

/**
 * The PO artefact (03 §6), job tracker only: "From MVP to launch", the
 * roadmap he drew up, as an L-wide plate scaled by the scroll, with its
 * full-size file one click away.
 */
export function CaseArtefact({ view }: { view: CaseView }) {
  const roadmap = view.project?.roadmap;
  if (!roadmap) return null;
  return (
    <Reveal as="section" data-field="ink" aria-labelledby="artefact-title" className={c.chapter}>
      <div className={clsx(c.grid, c.split)}>
        <h2 id="artefact-title" data-reveal="" className={clsx(t.display, c.h2)}>
          <Lines text={roadmap.h2} />
        </h2>
        <div className={c.text}>
          <p data-reveal="" className={clsx(t.body, styles.artefactText)}>
            {roadmap.body}
          </p>
        </div>
      </div>
      <div className={clsx(c.second, styles.artefactPlate)}>
        <Plate id="roadmap" size="L-wide" locale={view.locale} className={w.topOrigin} />
        <a href={MEDIA.roadmap.src} className={clsx(t.ui, c.textLink, styles.open)}>
          {roadmap.openFull}
        </a>
      </div>
    </Reveal>
  );
}

/**
 * The retro (03 §5.1), stone: the lesson is the H2, the imperative itself.
 * The reason sits on cols 8–12 on the H2's last baseline; under it, in
 * Small, the frame "What I'd do differently" (the field name under the
 * entry, never an eyebrow), tied to the H2 by aria-describedby.
 */
export function CaseRetro({ view }: { view: CaseView }) {
  const retro = view.copy.retro;
  if (!retro) return null;
  return (
    <Reveal as="section" data-field="stone" aria-labelledby="retro-title" className={c.chapter}>
      <div className={clsx(c.grid, styles.retro)}>
        <RetroLine id="retro-title" describedBy="retro-frame" className={clsx(t.display, c.h2, styles.retroLine)}>
          {retro.line}
        </RetroLine>
        <p data-reveal="" className={clsx(t.body, styles.reason)}>
          {retro.reason}
        </p>
        <p id="retro-frame" data-reveal="" className={clsx(t.small, t.muted, styles.frame)}>
          {view.dict.caseStudy.retroFrame}
        </p>
      </div>
    </Reveal>
  );
}
