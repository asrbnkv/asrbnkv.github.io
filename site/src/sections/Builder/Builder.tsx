import clsx from "clsx";
import { Reveal } from "@/components/Reveal";
import { Plate, Stage } from "@/components/Stage";
import stage from "@/components/Stage.module.css";
import { ANCHORS, caseHref, FREELANCE, MEDIA } from "@/content";
import t from "@/styles/type.module.css";
import type { SectionProps } from "../types";
import styles from "./Builder.module.css";
import { RoadmapPlate } from "./RoadmapPlate";
// Art-directed crops in the one screen grade, each with its provenance JSON
// beside it (crops of the graded stage files, no line of UI text cut).
// The roadmap, Month 2 to Month 5: legible below 1280px, where the whole
// chart would print its labels under 11px.
import roadmapCrop from "./media/roadmap-phone.stage.webp";
// The New application form cut to its one click (title, job link,
// Auto-fill, helper line): the empty fields under it are dropped.
import addOneClick from "./media/add-oneclick.stage.webp";
// The AI menu in 4:3, inside the list cards' corners: the AI button, its
// open menu and the Applied rows above and below.
import aiMenu from "./media/ai-menu.stage.webp";

/**
 * `builder`: "When no tool fits, I build one" (02-home.md §5).
 *
 * Stone, then one full-bleed ink stage band with hard cuts (01 §8.1), then
 * stone again. On the stage, two rows on one spine from 1024px: the roadmap
 * (L) with the one-click block on its top edge; from the roadmap's bottom
 * edge, the AI menu (S) under the block, corner to corner with the screen,
 * and the New application strip (M) under the roadmap, its right edge on
 * the spine and its bottom on S's. The three screens print their interface
 * at one size. Phones get the roadmap crop and the form strip edge to edge.
 * Back on stone: two poster facts, each one sentence whose text sits on
 * the value's baseline, and one link that closes the pair.
 *
 * Motion: the heading lines and the statement rise 70ms apart. The roadmap
 * draws in once along its time axis (a clip, Month 1 to the Launch flag)
 * and scales 0.92 → 1 with the scroll (the shared stage scale, CSS only);
 * its block hangs on that same trigger, four parts 45ms apart after 210ms.
 * S settles from its AI button, M from its Auto-fill button. Each fact
 * rises value, then text. Reduced motion and no JS: all at rest.
 */
export function Builder({ locale, dict }: SectionProps) {
  const copy = dict.home.builder;

  return (
    <Reveal
      as="section"
      id={ANCHORS.builder}
      data-field="stone"
      aria-labelledby="builder-title"
      className={styles.root}
    >
      <div className={styles.intro}>
        <h2 id="builder-title" className={clsx(t.display, styles.title)}>
          {headlineLines(copy.h2).map((line, i) => (
            <span key={line} data-reveal="" className={styles.line}>
              {i > 0 ? " " : null}
              {line}
            </span>
          ))}
        </h2>
        <p data-reveal="" className={clsx(t.statement, styles.statement)}>
          {copy.statement}
        </p>
      </div>

      <Stage className={styles.band}>
        {/* L: the roadmap on the shared stage treatment (crop below 1280px). */}
        <RoadmapPlate
          className={clsx(stage.plate, stage.l, styles.plateL)}
          captionClassName={stage.caption}
          image={MEDIA.roadmap}
          crop={roadmapCrop}
          alt={copy.roadmapAlt}
          caption={copy.roadmapCaption}
        />

        {/* The screen's words: no observer of its own (it hangs on L's). */}
        <div className={styles.oneClick}>
          <p className={clsx(t.statement, styles.oneClickLine)}>
            <span className={styles.oneClickPart}>{copy.oneClick[0]}</span>{" "}
            <span className={styles.oneClickPart}>{copy.oneClick[1]}</span>
          </p>
          <p className={clsx(t.body, styles.oneClickBody)}>{copy.oneClickBody}</p>
          <p className={clsx(t.small, t.muted, styles.next)}>{copy.next}</p>
          <p className={clsx(t.body, styles.readCase)}>
            <a href={caseHref(locale, "job-tracker")} className={styles.link}>
              {copy.readCase}
              <span className="visually-hidden">: {dict.projects["job-tracker"].title}</span>
            </a>
          </p>
        </div>

        {/* S: the AI menu, opened from its AI button. */}
        <Plate
          id="ai"
          size="S"
          locale={locale}
          image={aiMenu}
          caption={copy.aiCaption}
          sizes="(min-width: 1280px) 23vw, (min-width: 600px) 46vw, 100vw"
          className={styles.plateS}
        />

        {/* M: the New application form, cut to the one click itself. */}
        <Plate
          id="add"
          size="M"
          locale={locale}
          image={addOneClick}
          sizes="(min-width: 1280px) 47vw, (min-width: 600px) 70vw, 100vw"
          className={styles.plateM}
        />
      </Stage>

      <div className={styles.facts}>
        <p data-reveal="" className={styles.fact}>
          <span className={clsx(t.display, styles.value)}>{FREELANCE.campaigns}</span>{" "}
          <span className={clsx(t.body, styles.factText)}>{copy.agent}</span>
        </p>
        <p data-reveal="" className={styles.fact}>
          <span className={clsx(t.display, styles.value)}>{FREELANCE.sitesCount}</span>{" "}
          <span className={clsx(t.body, styles.factText)}>{copy.sites}</span>
        </p>
        <p data-reveal="" className={clsx(t.small, styles.factsMore)}>
          <a href={caseHref(locale, "freelance")} className={styles.link}>
            {copy.factsLink}
          </a>
        </p>
      </div>
    </Reveal>
  );
}

/** The authored two-line break of the H2: after its first comma (EN and FR). */
function headlineLines(h2: string): string[] {
  const at = h2.indexOf(", ");
  return at < 0 ? [h2] : [h2.slice(0, at + 1), h2.slice(at + 2)];
}
