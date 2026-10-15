import { Bar } from "@/components/Bar";
import { PersonJsonLd } from "@/components/JsonLd";
import { ANCHORS, getDictionary, type Locale, type RouteKey } from "@/content";
import { foldScript } from "@/lib/fold";
import { About } from "@/sections/About/About";
import { Builder } from "@/sections/Builder/Builder";
import { Contact } from "@/sections/Contact/Contact";
import { Edge } from "@/sections/Edge/Edge";
import { Footer } from "@/sections/Footer/Footer";
import { Hero } from "@/sections/Hero/Hero";
import { Human } from "@/sections/Human/Human";
import { Method } from "@/sections/Method/Method";
import { Proof } from "@/sections/Proof/Proof";
import { Retro } from "@/sections/Retro/Retro";
import { Work } from "@/sections/Work/Work";

/**
 * The home, shared by "/" and "/fr/" (02-home.md §0). The chapter order
 * lives here and nowhere else: one argument in eleven chapters, neighbours
 * never sharing a field (paper, stone, ink, paper, stone, paper, stone,
 * paper, ink, orange, then the ink footer).
 *
 * <main> is opaque and above the sticky footer, so the orange close lifts
 * off it like a curtain (01 §7.15). Each chapter is its own
 * <section id data-field> (its id is the anchor).
 */
const ROUTE: RouteKey = { page: "home" };

export function HomePage({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const props = { locale, dict, route: ROUTE };
  return (
    <>
      <PersonJsonLd locale={locale} />
      <Bar locale={locale} route={ROUTE} variant="home" />
      <main id="main" data-curtain-main="">
        <Hero {...props} />
        {/* Before first paint: the fold never cuts the first chapter (lib/fold.ts). */}
        <script dangerouslySetInnerHTML={{ __html: foldScript(ANCHORS.top) }} />
        <Edge {...props} />
        <Proof {...props} />
        <Work {...props} />
        <Builder {...props} />
        <Method {...props} />
        <Retro {...props} />
        <About {...props} />
        <Human {...props} />
        <Contact {...props} />
      </main>
      <Footer {...props} />
    </>
  );
}
