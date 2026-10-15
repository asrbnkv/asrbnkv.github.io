import type { ComponentType } from "react";
import { notFound } from "next/navigation";
import { Bar } from "@/components/Bar";
import { ANCHORS, getDictionary, type Locale } from "@/content";
import { foldScript } from "@/lib/fold";
import type { SectionProps } from "@/sections/types";

const MODES = ["runway", "bar"] as const;

/** Every lab URL of a section (static export: options live in the path). */
export const LAB_PARAMS = [[], ["fr"], ...MODES.flatMap((m) => [[m], ["fr", m]])].map((opts) => ({ opts }));

/**
 * DEV-ONLY page of one section in isolation.
 *
 *   /lab/<id>/          the chapter alone, no bar, one viewport if it fits
 *   /lab/<id>/runway/   + 150svh of runway after it, so the document scrolls
 *                       (scrubbed moves: the flight, the partings)
 *   /lab/<id>/bar/      + the home bar before it (its field following, the
 *                       hand-off), the home's first-screen rule and the
 *                       runway
 *   /lab/<id>/fr/…      the same in French
 *   /lab/footer/        the footer after a stand-in close (100svh of
 *                       orange in <main data-curtain-main>), so the curtain
 *                       and the homecoming play as on the home
 */
export function labSectionPage(id: string, Section: ComponentType<SectionProps>) {
  return async function LabSectionPage({ params }: { params: Promise<{ opts?: string[] }> }) {
    const { opts = [] } = await params;
    const fr = opts[0] === "fr";
    const mode = opts[fr ? 1 : 0];
    if (opts.length > (fr ? 2 : 1) || (mode !== undefined && !(MODES as readonly string[]).includes(mode))) notFound();
    const locale: Locale = fr ? "fr" : "en";
    const withBar = mode === "bar";
    if (id === "footer") {
      // The footer is a curtain under <main> (01 §7.15): it shows only once
      // the page lifts off it. A stand-in close (100svh of orange, the
      // home's last chapter) lifts off so the curtain and the homecoming
      // can be seen here; scroll to the end.
      return (
        <>
          {withBar ? <Bar locale={locale} route={{ page: "home" }} variant="home" /> : null}
          <main id="main" data-lab-section={id} data-curtain-main="">
            <section
              id="contact"
              data-field="orange"
              aria-label="Lab stand-in for the close"
              style={{ minHeight: "100svh" }}
            />
          </main>
          <Section locale={locale} dict={getDictionary(locale)} />
        </>
      );
    }
    return (
      <>
        {withBar ? <Bar locale={locale} route={{ page: "home" }} variant="home" /> : null}
        <main id="main" data-lab-section={id}>
          <Section locale={locale} dict={getDictionary(locale)} />
          {withBar && id === "hero" ? <script dangerouslySetInnerHTML={{ __html: foldScript(ANCHORS.top) }} /> : null}
        </main>
        {mode ? <div aria-hidden="true" data-lab-runway="" style={{ height: "150svh" }} /> : null}
      </>
    );
  };
}

