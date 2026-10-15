import { Bar } from "@/components/Bar";
import { adjacentCases, getDictionary, type CaseSlug, type Locale, type RouteKey } from "@/content";
import { CaseArtefact, CaseQuote, CaseRetro } from "@/sections/CaseStudy/Closing";
import { CaseContext, CaseUsers } from "@/sections/CaseStudy/Context";
import { CaseCover } from "@/sections/CaseStudy/Cover";
import { caseView } from "@/sections/CaseStudy/model";
import { CaseNext } from "@/sections/CaseStudy/Next";
import { CaseResult } from "@/sections/CaseStudy/Result";
import { CaseWork } from "@/sections/CaseStudy/Work";
import { Contact } from "@/sections/Contact/Contact";
import { Footer } from "@/sections/Footer/Footer";

/**
 * The case-study page (03-case-and-pages.md), shared by "/work/<slug>/" and
 * "/fr/work/<slug>/". The spine runs in the order a Product Owner works:
 * the card (what he walked into, the users' own stories), the conversation
 * (what he did), the confirmation (what changed), then the PO artefact, the
 * retro and the next case. A block with no source content does not exist;
 * the field per block is fixed, so neighbours never share one:
 *
 *   cover paper · context stone · users paper · work ink · result paper
 *   · quote ink · artefact ink · retro stone · next ink · close orange · footer ink
 *
 * Arrival through the cross-document view transition (03 §9.2): this
 * listener runs before first paint and marks <html data-arrive="vt">, so
 * the cover skips its load beat and shows the pair parted while the work
 * index's dots fly into it; "done" when the transition has finished, so the
 * run draws. Reduced motion never opts into view transitions (globals.css).
 * It also marks data-beat-done once the cover's load beat is over (1.1s, at
 * once on a view-transition arrival): a chapter already in view at load
 * holds its entrance until then, so the first second belongs to the cover.
 */
const ARRIVE =
  '(function(){var d=document.documentElement;setTimeout(function(){d.dataset.beatDone=""},1100);' +
  'addEventListener("pagereveal",function(e){if(!e.viewTransition)return;d.dataset.beatDone="";' +
  'd.dataset.arrive="vt";e.viewTransition.finished.then(function(){d.dataset.arrive="done"},function(){d.dataset.arrive="done"})})})();';

export function CaseStudyPage({ locale, slug }: { locale: Locale; slug: CaseSlug }) {
  const dict = getDictionary(locale);
  const route: RouteKey = { page: "case", slug };
  const view = caseView(slug, locale, dict);
  const { next } = adjacentCases(slug);
  const props = { locale, dict, route };

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: ARRIVE }} />
      <Bar
        locale={locale}
        route={route}
        variant="case"
        caseLabel={view.years ? `${view.copy.shortTitle}, ${view.years}` : view.copy.shortTitle}
      />
      <main id="main" data-curtain-main="">
        <CaseCover view={view} />
        <CaseContext view={view} />
        <CaseUsers view={view} />
        <CaseWork view={view} />
        <CaseResult view={view} />
        <CaseQuote view={view} />
        <CaseArtefact view={view} />
        <CaseRetro view={view} />
        <CaseNext view={view} next={next} />
        <Contact {...props} />
      </main>
      <Footer {...props} />
    </>
  );
}
