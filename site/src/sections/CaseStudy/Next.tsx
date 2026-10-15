import clsx from "clsx";
import { Reveal } from "@/components/Reveal";
import { ANCHORS, caseHref, homeHref, type CaseSlug } from "@/content";
import t from "@/styles/type.module.css";
import c from "./Case.module.css";
import { caseView, oneLine, type CaseView } from "./model";
import { NextLink } from "./NextLink";
import styles from "./Next.module.css";

/**
 * Next case (03 §5.2), ink: one link block. The next case's figure at the
 * giant step (S covers fit to cols 1–6, the others to the measure), then
 * its S mark, carrying tr-<next>-a/-b into that cover, before its H1 at the
 * statement step, and its meta. A figure that leaves the right of the
 * measure free (S on cols 1–6, the 97% on 1–7) takes the lockup beside it,
 * on its baseline. No Email me here: the orange close follows.
 * Under the block, "All work" to the home's index. Order wraps.
 */
export function CaseNext({ view, next }: { view: CaseView; next: CaseSlug }) {
  const { locale, dict } = view;
  const n = caseView(next, locale, dict);
  return (
    <Reveal as="section" data-field="ink" aria-labelledby="next-title" className={c.chapter}>
      <h2 id="next-title" data-reveal="" className={clsx(t.display, c.h2)}>
        {dict.caseStudy.next}
      </h2>
      <NextLink
        href={caseHref(locale, next)}
        name={`${dict.caseStudy.nextLabel} ${oneLine(n.copy.h1)}`}
        h1={n.copy.h1}
        meta={n.copy.meta}
        figure={n.figure}
        lockup={n.layout.cover === "S" ? "side" : n.layout.cover === "C" ? "beside" : "stack"}
        descends={Boolean(n.layout.descends)}
        vt={{ a: `tr-${next}-a`, b: `tr-${next}-b` }}
      />
      <p data-reveal="ui" className={styles.all}>
        <a href={homeHref(locale, ANCHORS.work)} className={clsx(t.ui, c.textLink)}>
          {dict.caseStudy.allWork}
        </a>
      </p>
    </Reveal>
  );
}
