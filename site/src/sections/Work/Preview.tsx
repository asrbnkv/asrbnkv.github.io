import clsx from "clsx";
import type { StaticImageData } from "next/image";
import type { ReactNode } from "react";
import { DotField } from "@/components/DotField";
import { TypeSetPair } from "@/components/Marks";
import { Pair } from "@/components/Pair";
import { MEDIA, PAIRS, type CaseSlug, type Dictionary } from "@/content";
import { WORK_FIELDS, WORK_INDEX, type WorkCrop } from "@/content/sections/work";
import aiMenu from "./media/ai-menu.stage.webp";
import filmCard from "./media/film-card.stage.webp";
import flSites from "./media/fl-sites.stage.webp";
import s from "./Stage.module.css";

/** The index's tighter stage crops (boxes and grade: WORK_CROPS in content/sections/work.ts). */
const CROPS: Record<WorkCrop, StaticImageData> = {
  "ai-menu": aiMenu,
  "film-card": filmCard,
  "fl-sites": flSites,
};

/**
 * One case's picture (02 §4.3–4.5, 01 §7.12, §8.1): a 16:10 ink stage, the
 * dark room every screen is lit in, shared by the hover plate and the
 * inline rows. Screens are contained and centred, never upscaled; drawings
 * carry their few words under what they label. In the plate, one Small
 * line inside the stage's bottom edge carries the row's number.
 *
 * Always aria-hidden by its parent: the case page shows the same pictures
 * with their alt text, and the row's link already names the case with its
 * number. Without JS the dot fields and the pair simply show.
 */
function Stage({
  kind,
  variant,
  caption,
  children,
}: {
  kind: string;
  variant: "plate" | "inline";
  caption?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className={s.stage} data-kind={kind} data-variant={variant} data-captioned={caption ? "" : undefined}>
      <div className={s.body} data-stage-body="">
        {children}
      </div>
      {caption ? <p className={s.caption}>{caption}</p> : null}
    </div>
  );
}

function Screen({ img, className }: { img: { src: string; width: number; height: number }; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={clsx(s.screen, className)}
      src={img.src}
      width={img.width}
      height={img.height}
      alt=""
      loading="lazy"
      decoding="async"
      data-ui=""
    />
  );
}

export function Preview({
  slug,
  dict,
  variant,
}: {
  slug: CaseSlug;
  dict: Dictionary;
  /** plate: the hover plate (named in its bottom edge) · inline: a row's own picture. */
  variant: "plate" | "inline";
}) {
  const plate = WORK_INDEX[slug].plate;
  const copy = dict.home.work;
  // The plate covers its row's metric block while it shows: it carries the
  // row's number in its bottom edge instead, so the figure stays in view.
  const row = copy.rows[slug];
  const caption =
    variant === "plate" ? (
      <>
        <b className={s.captionValue}>{row.metric}</b> {row.caption}
      </>
    ) : undefined;

  if (plate.kind === "screen") {
    return (
      <Stage kind="screen" variant={variant} caption={caption}>
        <Screen img={CROPS[plate.crop]} />
      </Stage>
    );
  }

  if (plate.kind === "phone") {
    // The product's own screen beside the number it moved: DAU ×1 → ×2 in
    // three months, drawn to scale (the shared pair, 01 §7.6).
    return (
      <Stage kind="phone" variant={variant} caption={caption}>
        <div className={s.phoneRow}>
          <Screen img={MEDIA[plate.media]} className={s.phone} />
          {variant === "plate" ? (
            <Pair
              size="M"
              data={PAIRS[plate.pair]}
              copy={dict.home.pairs[plate.pair]}
              labels="attached"
              motion="static"
              className={s.pair}
            />
          ) : (
            // A row's own picture is too small for the scale and its labels:
            // the same two values, type-set (the row's figure is right there).
            <p className={s.typeset}>
              <TypeSetPair
                before={dict.home.pairs[plate.pair].before.value}
                after={dict.home.pairs[plate.pair].after.value}
                joiner={dict.common.to}
                strike={false}
                motion="static"
              />
            </p>
          )}
        </div>
      </Stage>
    );
  }

  if (plate.kind === "sum") {
    // The Havaianas sum (03 §7.1): three weekly sources, one model, and what
    // the model gives; the one orange output is the upsell recommendations
    // that moved the 2× (on a small stage it is the only one shown).
    const sum = dict.projects.havaianas.sum;
    return (
      <Stage kind="sum" variant={variant} caption={caption}>
        <div className={s.sumDrawing}>
          {/* one term per item: each line is its own unit, never one wrapped headline */}
          <ul className={s.sum}>
            {sum?.terms.map((term) => (
              <li key={term.text} className={clsx(s.sumLine, term.op === "=" && s.sumTotal)}>
                <span className={s.sumOp}>{term.op}</span>
                <span>{term.text}</span>
              </li>
            ))}
          </ul>
          <ul className={s.outputs}>
            {sum?.outputs.map((o) => (
              <li key={o.text} className={clsx(s.output, o.after && s.outputAfter)}>
                <i className={s.outDot} />
                {o.text}
              </li>
            ))}
          </ul>
        </div>
      </Stage>
    );
  }

  if (plate.kind === "accounts") {
    const crm = dict.projects["appbazar-crm"].unitField;
    return (
      <Stage kind="accounts" variant={variant} caption={caption}>
        <div className={s.drawing}>
          <DotField
            className={s.field}
            segments={WORK_FIELDS.accounts}
            cols={10}
            label={crm?.sentence ?? copy.plateCaptions.field}
            caption={copy.plateCaptions.field}
          />
        </div>
      </Stage>
    );
  }

  // Retention: about 97 in 100 kept, against the 60 to 70 management expected.
  const pay = dict.projects["appbazar-payments"].dotFields;
  return (
    <Stage kind="retention" variant={variant} caption={caption}>
      <div className={s.drawing}>
        <div className={s.fields}>
          <DotField
            className={s.field}
            segments={WORK_FIELDS.kept}
            cols={10}
            label={pay?.kept ?? copy.plateCaptions.kept}
            caption={copy.plateCaptions.kept}
          />
          <DotField
            className={clsx(s.field, s.expected)}
            segments={WORK_FIELDS.expected}
            cols={10}
            label={pay?.expected ?? copy.plateCaptions.expected}
            caption={copy.plateCaptions.expected}
          />
        </div>
      </div>
    </Stage>
  );
}
