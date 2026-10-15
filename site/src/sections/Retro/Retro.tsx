import clsx from "clsx";
import { ANCHORS, caseHref, FREELANCE, formatPeriod, PROJECTS } from "@/content";
import { RETRO_ORDER } from "@/content/sections/retro";
import t from "@/styles/type.module.css";
import type { SectionProps } from "../types";
import { KeepCompounds, MaskedWords, toPhrases, type Phrases } from "./MaskedText";
import styles from "./Retro.module.css";
import { RetroStage } from "./RetroStage";

/**
 * `retro`: What I'd do differently (02-home.md §7). Stone field.
 *
 * Claim: he judges his own work, one lesson from each of six projects, each
 * linked to its case.
 *
 * 1440: H2 on columns 1–9, the statement on 1–7, then the poster wall (01
 * §7.13): six imperatives at the display step on 1–8, each reason on 9–12
 * standing on its line's last baseline, its case cited under it with the
 * case's years, as the bar of a case page names it ("Havaianas, 2023–25").
 * Under 1100 the reason and the case step in under their line: 1024, 768
 * and 390 are their own compositions (Retro.module.css).
 *
 * No numbers, no bullets: a plain <ul>, each item two <p> and a link whose
 * accessible name is "Read the case: <short title>, <years>". With a fine
 * pointer the whole lesson leads to the case (rowLinks.ts); the link stays
 * the one control. Motion: RetroStage runs the chapter's one choreography
 * (choreography.ts).
 */
interface PosterItem {
  slug: string;
  phrases: Phrases;
  reason: string;
  /** The case's citation, the link's visible text: "Havaianas, 2023–25". */
  cite: string;
  href: string;
}

export function Retro({ locale, dict }: SectionProps) {
  const copy = dict.home.retro;
  const items: PosterItem[] = RETRO_ORDER.map((slug) => {
    const title = slug === "freelance" ? dict.freelance.shortTitle : dict.projects[slug].shortTitle;
    const span = slug === "freelance" ? FREELANCE.period : PROJECTS[slug].period;
    // EN "2023–25"; FR in full ("2023–2025"); ongoing: "2025–now", « depuis 2025 ».
    const years = span ? formatPeriod(span, dict.common.present, { short: locale === "en" }) : null;
    return {
      slug,
      phrases: toPhrases(copy.items[slug].line),
      reason: copy.items[slug].reason,
      cite: years ? `${title}, ${years}` : title,
      href: caseHref(locale, slug),
    };
  });

  return (
    <RetroStage id={ANCHORS.retro} data-field="stone" aria-labelledby="retro-title" className={styles.root}>
      <h2 id="retro-title" data-retro-head="" data-masked="" className={clsx(t.display, styles.title, styles.masked)}>
        <MaskedWords phrases={toPhrases(copy.h2)} />
      </h2>
      <p data-reveal="" data-retro-statement="" className={clsx(t.statement, styles.statement)}>
        {copy.statement}
      </p>
      {/* role="list": Safari drops list semantics from a list without bullets. */}
      <ul role="list" className={styles.wall}>
        {items.map((item) => (
          <li key={item.slug} data-poster="" className={styles.item}>
            <p data-masked="" className={clsx(t.display, styles.line, styles.masked)}>
              <MaskedWords phrases={item.phrases} />
            </p>
            <div className={styles.aside}>
              <p data-reveal="ui" className={clsx(t.body, styles.reason)}>
                <KeepCompounds text={item.reason} />
              </p>
              {/* The fade lives on a wrapper: the link keeps its own hover,
                  press and focus transitions, even mid-entrance. */}
              <span data-reveal="fade" className={clsx(t.small, styles.cite)}>
                <a href={item.href} className={styles.link}>
                  <span className="visually-hidden">{copy.readCase} </span>
                  {item.cite}
                </a>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </RetroStage>
  );
}
