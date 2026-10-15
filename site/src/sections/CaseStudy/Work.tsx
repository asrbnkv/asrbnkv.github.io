import clsx from "clsx";
import { Pan, Plate } from "@/components/Stage";
import { Reveal } from "@/components/Reveal";
import { MEDIA } from "@/content";
import { Month } from "@/sections/Method/Month";
import t from "@/styles/type.module.css";
import c from "./Case.module.css";
import type { CaseView } from "./model";
import { SumDrawing } from "./SumDrawing";
import styles from "./Work.module.css";

/**
 * "What I did" / "What I built" / "What I made" (03 §3.3): the conversation,
 * on ink. Movement 1 is a split row (the H2; the actions as a markerless
 * list, then the stack line with its field name under it). Movement 2, after
 * --space-4xl, is the case's picture: its real screens on the ink stage
 * (01 §8.1, §6), or its sum drawing where no screen exists (§7.1).
 */
export function CaseWork({ view }: { view: CaseView }) {
  const { copy, stack, headings } = view;
  // One trigger for the chapter (01 §5.2): the H2, then the actions row by
  // row (45ms, 03 §9.3), then the stack line, in reading order.
  return (
    <Reveal as="section" stagger={45} data-field="ink" aria-labelledby="work-title" className={c.chapter}>
      <div className={clsx(c.grid, c.split)}>
        <h2 id="work-title" data-reveal="" className={clsx(t.display, c.h2)}>
          {headings.work}
        </h2>
        <div className={c.text}>
          <ul className={styles.actions}>
            {copy.actions.map((action) => (
              <li key={action} data-reveal="" className={clsx(t.body, styles.action)}>
                {action}
              </li>
            ))}
          </ul>
          <dl data-reveal="" className={clsx(t.small, styles.stack)}>
            <dt className={t.muted}>{stack.label}</dt>
            <dd>{stack.items.join(" · ")}</dd>
          </dl>
        </div>
      </div>
      <div className={c.second}>
        <WorkPicture view={view} />
      </div>
    </Reveal>
  );
}

function WorkPicture({ view }: { view: CaseView }) {
  const { slug, locale, dict, project, layout } = view;
  const openFull = (src: string, label: string) => (
    <a href={src} className={clsx(t.ui, c.textLink, styles.open)}>
      {label}
    </a>
  );

  if (project?.sum && layout.sumFit) {
    return <SumDrawing sum={project.sum} fit={layout.sumFit[locale]} />;
  }

  if (slug === "appbazar-product" && project?.month) {
    // The month in dots on cols 1–5, the phone screen at its native 146px on
    // col 8 (a column of air between them), "How I prioritised" on cols 1–7
    // under the dots (03 §3.3).
    return (
      <div className={clsx(c.grid, styles.loop)}>
        <div className={styles.month}>
          <Month copy={{ ...dict.home.method.month, ...project.month }} />
        </div>
        <Plate id="ab_feed" size="XS" locale={locale} className={styles.phone} />
        {project.prioritization ? (
          <div className={styles.rice}>
            <h3 data-reveal="" className={clsx(t.statement, styles.h3)}>
              {dict.caseStudy.headings.prioritised}
            </h3>
            <p data-reveal="" className={clsx(t.body, styles.riceText)}>
              {project.prioritization}
            </p>
          </div>
        ) : null}
      </div>
    );
  }

  if (slug === "job-tracker") {
    return (
      <div className={clsx(c.grid, styles.duo)}>
        <Plate id="add" size="L" locale={locale} className={clsx(styles.duoMain, styles.topOrigin)} />
        <Plate id="ai" size="S" locale={locale} className={styles.duoSide} />
      </div>
    );
  }

  if (slug === "cannes") {
    return (
      <div className={clsx(c.grid, styles.trio)}>
        <div className={styles.trioPan}>
          <Pan id="c_day" locale={locale} />
          {project?.pan ? openFull(MEDIA.c_day.src, project.pan.openFull) : null}
        </div>
        <Plate id="c_alt" size="M" locale={locale} className={styles.trioAlt} />
        <Plate id="c_film" size="S" locale={locale} className={styles.trioFilm} />
      </div>
    );
  }

  if (slug === "freelance") {
    return (
      <div className={styles.wide}>
        <Plate id="fl_slide" size="L-wide" locale={locale} className={styles.topOrigin} />
        {openFull(MEDIA.fl_slide.src, dict.caseStudy.openFull)}
      </div>
    );
  }

  return null;
}
