import clsx from "clsx";
import type { CSSProperties } from "react";
import { Bar } from "@/components/Bar";
import { Figure } from "@/components/Figure";
import { Monument } from "@/components/Monument";
import { FIGURES, getDictionary, LOCALES } from "@/content";
import { Footer } from "@/sections/Footer/Footer";
import type { SectionProps } from "@/sections/types";
import t from "@/styles/type.module.css";
import s from "./Specimen.module.css";
import { Charts, Controls, Figures, Media, MonumentCheck, Pairs, Portraits } from "./SpecimenParts";

/**
 * DEV-ONLY: /lab/specimen/ and /lab/specimen/fr/. The whole Tréma system on
 * one page: palette roles, the five type steps with real copy in both
 * languages, controls in every state on every field, the pair family,
 * figures on their dots, the monument check, the stage, the portrait, and
 * the real bar and footer. Lab labels are tooling, not site copy.
 */
const PALETTE = [
  ["--paper", "#F3F3F0", "ground · hero, reading chapters"],
  ["--stone", "#E3E3DE", "tone step · context, interactive chapters"],
  ["--ink", "#0E0F0F", "all running text · number scenes, stage, footer"],
  ["--orange", "#F24A00", "the action, every after dot, the close"],
  ["--orange-hover", "#FF5C17", "hover of the orange button (6.21:1 with ink)"],
  ["--muted", "#5D5F5C", "secondary text on paper 5.80 / stone 5.01"],
  ["--muted-on-ink", "#9A9B97", "secondary text on ink 6.86"],
  ["--band", "#6E706C", "graphics only: before dot, forecast capsule"],
  ["--ink-step", "#1E1F1F", "state only: pressed ink buttons"],
] as const;

export function Specimen({ locale }: SectionProps) {
  const other = LOCALES.map((l) => getDictionary(l));
  return (
    <>
      <Bar locale={locale} route={{ page: "home" }} variant="home" />

      <section data-field="paper" className={s.block}>
        <div className={s.head}>
          <h1 className={t.display}>Tréma specimen</h1>
          <p className={t.body}>Tokens: src/styles/tokens.css · faces: src/styles/fonts.ts · components: src/components.</p>
        </div>
        <div className={s.grid}>
          {PALETTE.map(([token, hex, role]) => (
            <div key={token} className={s.swatch}>
              <span className={s.chip} style={{ background: `var(${token})` } as CSSProperties} />
              <span className={t.value}>{token}</span>
              <span className={s.note}>
                {hex} · {role}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section data-field="stone" className={s.block}>
        <h2 className={t.display}>Steps</h2>
        <div className={s.full}>
          <Monument variant="hero" as="div" beat={false} />
        </div>
        <div className={s.steps}>
          <div className={s.bilingual}>
            {LOCALES.map((l) => (
              <Figure key={l} value={FIGURES.dau.value[l]} fit={FIGURES.dau.fit[l]} inkLeft={FIGURES.dau.inkLeft[l]} />
            ))}
          </div>
          {(
            [
              ["display · LS 700 · 42–96", t.display, (d: (typeof other)[number]) => d.home.builder.h2],
              ["statement · LS 500 · 22–32", t.statement, (d: (typeof other)[number]) => d.home.hero.statement],
              ["body · Figtree 400 · 17–19", t.body, (d: (typeof other)[number]) => d.home.builder.oneClickBody],
              ["small · Figtree 400 · 15", t.small, (d: (typeof other)[number]) => d.home.edge.clientsContext.partners],
              ["ui · Figtree 600 · 17", t.ui, (d: (typeof other)[number]) => `${d.chrome.emailMe} · ${d.chrome.cvLong}`],
            ] as const
          ).map(([label, cls, pick]) => (
            <div key={label} className={s.step}>
              <div className={s.bilingual}>
                {other.map((d) => (
                  <p key={d.locale} lang={d.locale} className={clsx(cls)}>
                    {pick(d)}
                  </p>
                ))}
              </div>
              <span className={s.note}>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={s.block} data-field="paper">
        <h2 className={t.display}>Controls</h2>
        <div className={s.full}>
          <Controls locale={locale} />
        </div>
      </section>

      <section className={s.block} data-field="paper">
        <h2 className={t.display}>Pairs</h2>
        <Pairs locale={locale} />
      </section>

      <section className={s.block} data-field="paper">
        <h2 className={t.display}>Figures</h2>
        <Figures locale={locale} />
        <MonumentCheck />
      </section>

      <section className={s.block} data-field="stone">
        <h2 className={t.display}>Stage, pan, portrait</h2>
        <Media locale={locale} />
        <div className={s.full}>
          <Portraits locale={locale} />
        </div>
        <Charts locale={locale} />
      </section>

      {/* Wrapped so the curtain footer lays out statically inside the lab's <main>. */}
      <div>
        <Footer locale={locale} dict={getDictionary(locale)} route={{ page: "home" }} />
      </div>
    </>
  );
}
