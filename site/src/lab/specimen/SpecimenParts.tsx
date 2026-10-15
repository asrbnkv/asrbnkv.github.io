import clsx from "clsx";
import { Bust } from "@/components/Bust";
import { Button, ButtonLink, CvLink, TextButton } from "@/components/Button";
import { DotField } from "@/components/DotField";
import { Figure } from "@/components/Figure";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { PairMark, TypeSetPair } from "@/components/Marks";
import { Monument } from "@/components/Monument";
import { Pair } from "@/components/Pair";
import { Pan, Plate, Stage } from "@/components/Stage";
import { StatRow, StoryCard } from "@/components/StatRow";
import { FIGURES, getDictionary, localizeFigure, mailtoHref, PAIRS, PROJECTS, splitStory, type Locale } from "@/content";
import t from "@/styles/type.module.css";
import s from "./Specimen.module.css";

/* DEV-ONLY: the parts of the specimen. Lab labels are tooling, not site copy. */

export function Controls({ locale }: { locale: Locale }) {
  const c = getDictionary(locale).chrome;
  const states = [
    { label: "rest", cls: "" },
    { label: "hover", cls: s.hover },
    { label: "focus", cls: s.focus },
    { label: "active", cls: s.active },
  ];
  return (
    <div className={s.fields}>
      {(["paper", "stone", "ink", "orange"] as const).map((field) => (
        <div key={field} data-field={field} className={s.field}>
          <p className={s.note}>{field}</p>
          <div className={s.row}>
            {states.map((st) => (
              <span key={st.label} className={s.stack}>
                <ButtonLink href={mailtoHref(c.emailSubject)} className={st.cls}>
                  {c.emailMe}
                </ButtonLink>
                <span className={s.note}>{st.label}</span>
              </span>
            ))}
          </div>
          <div className={s.row}>
            <ButtonLink size="bar" href={mailtoHref(c.emailSubject)}>
              {c.emailMe}
            </ButtonLink>
            <Button>{c.cvLong}</Button>
            <TextButton>{getDictionary(locale).home.contact.copy}</TextButton>
            <TextButton className={s.linkHover}>{c.menu}</TextButton>
            <TextButton className={s.linkActive}>{c.menu}</TextButton>
          </div>
          <p className={t.body}>
            Inline <a href="#links">link at rest</a>, <a href="#links" className={s.linkHover}>hovered</a>,{" "}
            <a href="#links" className={s.focus}>focused</a>, <a href="#links" className={s.linkActive}>pressed</a>.
          </p>
          <div className={s.row}>
            <CvLink id={`cv-${field}`} label={c.cvLong} note={c.cvNote} />
            <LanguageSwitch locale={locale} route={{ page: "home" }} />
            <LanguageSwitch locale={locale} route={{ page: "home" }} form="long" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function Pairs({ locale }: { locale: Locale }) {
  const pairs = getDictionary(locale).home.pairs;
  const joiner = getDictionary(locale).common.to;
  return (
    <div className={s.stack}>
      <p className={s.note}>M · DAU, drawn parted (static) · then at rest in the tréma arrangement (scrub, undriven)</p>
      <div className={s.measure}>
        <Pair size="M" data={PAIRS.dau} copy={pairs.dau} motion="static" />
      </div>
      <div className={s.measure}>
        <Pair size="M" data={PAIRS.dau} copy={pairs.dau} motion="scrub" />
      </div>
      <p className={s.note}>M · lead: the one number, its after value at the statement step (opt-in; the band grows ~12px)</p>
      <div className={s.measure}>
        <Pair size="M" data={PAIRS.dau} copy={pairs.dau} motion="static" lead />
      </div>
      <p className={s.note}>L · DAU, parts once on entry (40% visible) · L · retention with the 60–70% capsule</p>
      <Pair size="L" data={PAIRS.dau} copy={pairs.dau} motion="entry" />
      <Pair size="L" data={PAIRS.retention} copy={pairs.retention} motion="entry" />
      <p className={s.note}>M · MAU, legend mode · S · A/B wording on a 120px measure with one inline value</p>
      <div className={s.measure}>
        <Pair size="M" data={PAIRS.mau} copy={pairs.mau} labels="legend" motion="static" />
      </div>
      <div className={s.s120}>
        <Pair size="S" data={PAIRS.abWording} measure="120px" inlineValue={pairs.abWording.after.value} motion="entry" />
      </div>
      <div data-field="ink" className={s.field}>
        <p className={s.note}>On ink · M · A/B wording</p>
        <div className={s.measure}>
          <Pair size="M" data={PAIRS.abWording} copy={pairs.abWording} motion="entry" />
        </div>
        <div className={s.row}>
          <PairMark motion="static" />
          <PairMark />
          <PairMark size="M" />
        </div>
      </div>
      <p className={s.note}>Marks (S, M) · type-set pairs, struck and span (03 A5)</p>
      <div className={s.row}>
        <PairMark motion="static" />
        <PairMark size="M" motion="static" />
      </div>
      <p className={t.statement}>
        <TypeSetPair before={locale === "fr" ? "Des jours" : "Days"} after={locale === "fr" ? "environ deux heures" : "about two hours"} joiner={joiner} />
      </p>
      <p className={t.display}>
        <TypeSetPair before="2025" after="2026" joiner={joiner} strike={false} />
      </p>
    </div>
  );
}

export function Figures({ locale }: { locale: Locale }) {
  const pairs = getDictionary(locale).home.pairs;
  const f = FIGURES;
  return (
    <div className={s.figures}>
      <Figure value={f.dau.value[locale]} fit={f.dau.fit[locale]} inkLeft={f.dau.inkLeft[locale]} />
      <div data-field="ink" className={clsx(s.field, s.figureOnDot)}>
        <p className={s.note}>97% on its dot: the last ink ends on the after dot&apos;s right edge (±1px)</p>
        <Figure
          value={f.retention.value[locale]}
          fit={f.retention.fit[locale]}
          inkLeft={f.retention.inkLeft[locale]}
          align="end"
          inkRightTo={`spec-97-${locale}`}
        />
        <Pair size="L" data={PAIRS.retention} copy={pairs.retention} motion="static" anchorId={`spec-97-${locale}`} />
      </div>
      <StatRow
        items={PROJECTS["appbazar-product"].stats.map((st) => ({
          value: localizeFigure(st.value, locale),
          caption: getDictionary(locale).projects["appbazar-product"].stats[st.id],
        }))}
      />
    </div>
  );
}

export function MonumentCheck() {
  return (
    <div className={clsx(s.stack, s.check)}>
      <div className={s.verify}>
        <Monument variant="hero" as="div" beat={false} />
        {/* The same letter boxes and opened joins as Monument (A +0.012em,
            r +0.0265em), so only the ë's own dots differ from the drawn ones. */}
        <span className={s.verifyGlyph} aria-hidden="true">
          <span className={s.verifyA}>A</span>
          <span className={s.verifyR}>r</span>
          <span>t</span>
          <span>ë</span>
          <span>m</span>
        </span>
      </div>
      <p className={clsx(s.note, s.caption)}>
        Verification (01 §3.4): the font&apos;s own ë in orange at 50% over the drawn dots, 400px.
      </p>
      <div className={s.full}>
        <Monument variant="fallen" as="div" beat={false} />
      </div>
    </div>
  );
}

export function Media({ locale }: { locale: Locale }) {
  return (
    <Stage className={s.full}>
      <div className={s.plates}>
        <div className={s.plateL}>
          <Plate id="roadmap" size="L" locale={locale} />
        </div>
        <div className={s.plateXS}>
          <Plate id="ab_feed" size="XS" locale={locale} />
        </div>
        <div className={s.plateS}>
          <Plate id="ai" size="S" locale={locale} />
        </div>
        <div className={s.plateM}>
          <Plate id="add" size="M" locale={locale} />
        </div>
        <div className={s.pan}>
          <Pan locale={locale} />
        </div>
      </div>
    </Stage>
  );
}

export function Portraits({ locale }: { locale: Locale }) {
  return (
    <div className={s.portraits}>
      {(["paper", "stone", "ink"] as const).map((field) => (
        <div key={field} data-field={field} className={s.portrait}>
          <Bust locale={locale} />
          <Bust locale={locale} size="small" />
          <span className={s.note}>{field}</span>
        </div>
      ))}
    </div>
  );
}

export function Charts({ locale }: { locale: Locale }) {
  const story = getDictionary(locale).projects["appbazar-product"].stories?.[0] ?? "";
  const clauses = splitStory(story, locale);
  return (
    <div className={s.grid}>
      <div data-field="ink" className={s.field}>
        <DotField segments={[{ kind: "after", count: 80 }]} label="80 dots, one per account." caption="One dot, one account." />
      </div>
      <div data-field="paper" className={s.field}>
        <DotField segments={[{ kind: "after", count: 97 }, { kind: "before", count: 3 }]} label="97 kept, 3 lost." />
        <DotField
          segments={[{ kind: "before", count: 60 }, { kind: "faint", count: 10 }, { kind: "empty", count: 30 }]}
          label="60 to 70 expected."
        />
      </div>
      <div data-field="paper" className={s.field}>
        {clauses ? <StoryCard clauses={clauses} /> : <p className={s.note}>Story does not split: {story}</p>}
      </div>
    </div>
  );
}
