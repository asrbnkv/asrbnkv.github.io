import clsx from "clsx";
import { DotField } from "@/components/DotField";
import { Pair } from "@/components/Pair";
import { Reveal } from "@/components/Reveal";
import { Rich } from "@/components/Rich";
import { StatRow } from "@/components/StatRow";
import { FREELANCE, PAIRS, localizeFigure } from "@/content";
import t from "@/styles/type.module.css";
import c from "./Case.module.css";
import { DayStrip } from "./DayStrip";
import { Lines } from "./Lines";
import { casePairCopy, type CaseView } from "./model";
import styles from "./Result.module.css";

/**
 * "What changed" / "Where it stands" / "Two AI projects" (03 §3.4): the
 * confirmation, on paper. Movement 1 is a split row (H2; lead and body).
 * Movement 2, after --space-4xl, is the case's chart margin to margin, drawn
 * from its real numbers only (pairs, dot fields, the day strip). Movement 3
 * is the stat row. Charts sit on paper, never on stone.
 */
export function CaseResult({ view }: { view: CaseView }) {
  const { locale, copy, headings } = view;
  const hasText = Boolean(copy.changedLead || copy.changedBody);
  return (
    <Reveal as="section" data-field="paper" aria-labelledby="result-title" className={c.chapter}>
      <div className={clsx(c.grid, c.split)}>
        <h2 id="result-title" data-reveal="" className={clsx(t.display, c.h2)}>
          <Lines text={headings.result} />
        </h2>
        {hasText ? (
          <div className={c.text}>
            {copy.changedLead ? (
              <p data-reveal="" className={clsx(t.statement, c.lead)}>
                {copy.changedLead}
              </p>
            ) : null}
            {copy.changedBody ? (
              <p data-reveal="" className={clsx(t.body, c.body)}>
                <Rich text={copy.changedBody} locale={locale} />
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      <ResultChart view={view} />

      {copy.statRow?.length ? (
        <div data-reveal="fade" className={clsx(c.stats, c.statsReveal)}>
          <StatRow items={copy.statRow} className={clsx(c.statRow, copy.statRow.length === 2 && c.two)} />
        </div>
      ) : null}

      {copy.related ? (
        <p data-reveal="" className={clsx(t.small, c.related)}>
          <Rich text={copy.related} locale={locale} />
        </p>
      ) : null}
    </Reveal>
  );
}

function ResultChart({ view }: { view: CaseView }) {
  const { slug, locale, dict, project, freelance } = view;

  if (slug === "appbazar-product" && project?.pairs) {
    const { changed, tested } = project.pairs;
    return (
      <>
        <div data-reveal="fade" className={c.second}>
          <Pair size="M" data={PAIRS.mau} copy={casePairCopy(changed, "0")} />
          <p className={clsx(t.small, t.muted, styles.pairCaption)}>{changed.caption}</p>
        </div>
        {project.abTest ? (
          <div className={clsx(c.grid, c.split, c.second, styles.tested)}>
            <h3 data-reveal="" className={clsx(t.statement, styles.h3)}>
              {dict.caseStudy.headings.tested}
            </h3>
            <p data-reveal="" className={clsx(t.body, styles.testedText)}>
              {project.abTest}
            </p>
            <div data-reveal="fade" className={styles.testedPair}>
              <Pair size="M" data={PAIRS.abWording} copy={casePairCopy(tested, "0")} />
              <p className={clsx(t.small, t.muted, styles.pairCaption)}>{tested.caption}</p>
            </div>
          </div>
        ) : null}
      </>
    );
  }

  if (project?.dotFields) {
    const f = project.dotFields;
    return (
      <div className={clsx(c.grid, c.second, styles.fields)}>
        <DotField
          className={styles.fieldA}
          segments={[
            { kind: "before", count: 60 },
            { kind: "faint", count: 10 },
            { kind: "empty", count: 30 },
          ]}
          label={f.sentence}
          caption={f.expected}
        />
        <DotField
          className={styles.fieldB}
          segments={[
            { kind: "after", count: 97 },
            { kind: "before", count: 3 },
          ]}
          label=""
          caption={f.kept}
        />
        <p data-reveal="" className={clsx(t.small, styles.fieldsNote)}>
          {f.note}
        </p>
      </div>
    );
  }

  if (project?.unitField) {
    const u = project.unitField;
    return (
      <div className={clsx(c.grid, c.second, styles.fields)}>
        <DotField className={styles.fieldA} segments={[{ kind: "after", count: 80 }]} label={u.sentence} caption={u.caption} />
        <ul className={styles.markets}>
          {u.markets.map((market) => (
            <li key={market} data-reveal="" className={clsx(t.statement, styles.market)}>
              {market}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (project?.dayStrip) {
    return (
      <div data-reveal="fade" className={c.second}>
        <DayStrip strip={project.dayStrip} />
      </div>
    );
  }

  if (freelance) {
    const { agent, cv } = freelance.aiProjects;
    return (
      <div className={clsx(c.grid, styles.duo)}>
        <article aria-labelledby="ai-agent" className={styles.duoA}>
          <h3 id="ai-agent" data-reveal="" className={clsx(t.statement, styles.h3)}>
            {agent.title}
          </h3>
          <p data-reveal="" className={clsx(t.body, styles.duoText)}>
            {agent.body}
          </p>
          <div className={styles.duoFigure}>
            <DotField
              segments={[{ kind: "after", count: Number(FREELANCE.campaigns) }]}
              cols={5}
              label={agent.fieldSentence}
              caption={agent.fieldCaption}
            />
          </div>
        </article>
        <article aria-labelledby="ai-cv" className={styles.duoB}>
          <h3 id="ai-cv" data-reveal="" className={clsx(t.statement, styles.h3)}>
            {cv.title}
          </h3>
          <p data-reveal="" className={clsx(t.body, styles.duoText)}>
            {cv.body}
          </p>
          <p data-reveal="" className={styles.duoFigure}>
            <span className={clsx(t.statementStrong, styles.duoValue)}>
              {localizeFigure(FREELANCE.resumeConversion, locale)}
            </span>
            <span className={clsx(t.small, t.muted)}>{cv.caption}</span>
          </p>
        </article>
      </div>
    );
  }

  return null;
}
