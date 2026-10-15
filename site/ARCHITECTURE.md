# Architecture

Artem Serebryannikov's personal site. Next.js 16 App Router, TypeScript strict, CSS Modules + global tokens, statically exported to `out/` for GitHub Pages (`https://asrbnkv.github.io`, user site, no basePath). The visual system is **Tréma** (`../.aaa/brief/design-spec.md` → `design-spec/01-system.md`, `02-home.md`, `03-case-and-pages.md`; the direction contract wins on thesis and signature move).

Product truth: `../PRODUCT.md`. Content truth: `../.aaa/brief/content-source.md` and `../.aaa/brief/legacy-content.json`. Never invent a fact, never publish his phone number.

Next.js 16 differs from older versions. Before using an API you are unsure of, read `node_modules/next/dist/docs/` (see `AGENTS.md`).

## Versions (exact pins, `.npmrc` has `save-exact=true`)

| Package | Version |
|---|---|
| next / eslint-config-next | 16.4.1 (Turbopack for dev and build) |
| react / react-dom | 19.3.1 |
| typescript | 5.9.3 |
| gsap (ScrollTrigger) | 3.15.0, loaded only by components that scrub (`lib/gsap.ts`) |
| lenis | 1.3.26, installed but NOT used: scrolling is native (01 §5.2) |
| clsx | 2.1.1 |
| eslint | 9.39.5 (flat config) |
| playwright / @axe-core/playwright | 1.64.1 / 4.13.0 |

## Folder map

```
site/
  public/
    media/                 graded screens *.stage.webp + portrait-cutout.webp (+ provenance .json sidecars)
    og-en.png og-fr.png    1200×630 social cards (rendered from /lab/og/)
    favicon.svg favicon-32.png icon-192.png apple-touch-icon.png   the tréma
    Artem_Serebryannikov_CV.pdf
  src/
    app/                   ROUTES ONLY (thin files): (en)/, (fr)/fr/, (lab)/lab/ (dev only), global-not-found.tsx
    views/                 page compositions: HomePage.tsx (chapter order), CaseStudyPage.tsx (case shell), NotFoundView.tsx
    sections/<Pascal>/     one folder per home chapter: <Pascal>.tsx + <Pascal>.module.css
      types.ts             SectionProps = { locale, dict, route? }
    components/            the shared Tréma components (catalogue below)
    content/               the content layer (all words and facts)
      sections/<id>.ts     the words of one home chapter ({ en, fr }), owned by that section's agent
      sections/index.ts    composes them into dict.home (+ dict.home.pairs)
      cases/<slug>.ts      the words of one case ({ en, fr }), cases/labels.ts, cases/types.ts
      en.ts fr.ts          shared words: chrome, meta, profile labels, media alt text, 404
      dictionary.ts        types + buildDictionary(locale) (composition)
      site.ts media.ts projects.ts profile.ts home.ts pairs.ts stories.ts format.ts routes.ts locales.ts
    lab/                   registry.tsx (every section + specimen + og), specimen/, og/, parseLabPath.ts
    lib/                   motion.ts (constants), gsap.ts, inView.ts, boot.ts, seo.ts
    styles/                tokens.css, globals.css, type.module.css, fonts.ts, fonts/ (woff2 + OFL)
```

Never create `src/pages/`: that name switches on the Pages Router.

## Routing and i18n

- English at `/`, French at `/fr/`. Cases: `/work/<slug>/` and `/fr/work/<slug>/`, in the argument's order `CASE_SLUGS`: appbazar-product, havaianas, appbazar-payments, appbazar-crm, job-tracker, cannes, freelance.
- **Two route groups, two root layouts** (`(en)`, `(fr)`), each rendering `<html lang>` through `components/RootDocument.tsx`. Moving between `/` and `/fr/` is a full page load.
- **Links are plain `<a>`**, never `next/link`: every page-to-page navigation is a full document load, so the cross-document view transition runs (01 §6.6: the work-index marks' dots fly into the case cover). Build hrefs with `href(locale, route)`, `homeHref(locale, ANCHORS.x)`, `caseHref(locale, slug)`; never hand-write `/fr/...`.
- **Anchors** (`ANCHORS`): top, stories, results, work, builder, method, retro, about, off-the-clock, contact. A chapter's `<section id>` is its anchor.
- **404**: `global-not-found.tsx` → `out/404.html` for every unknown URL, both languages. The boot script switches `<html lang>`/`data-lang` to fr under `/fr/` before paint; `[data-nf="en"|"fr"]` blocks show by `html[data-lang]` (both without JS).
- **SEO** (`lib/seo.ts`): `homeMetadata(locale)`, `caseMetadata(locale, slug)`, `notFoundMetadata()`; canonical, hreflang en/fr/x-default, Open Graph (`profile` home, `article` cases) with `/og-<locale>.png`, Twitter large card, icons, `VIEWPORT` (theme-color starts on paper; the bar retints it per field). The home renders schema.org `Person` (`components/JsonLd.tsx`).

## Content layer (`src/content`, import from `@/content`)

`getDictionary(locale)` returns the composed dictionary after `typography.ts` has polished every string (’ for apostrophes; in French U+202F before `? ! ; %`, U+00A0 before `:`, U+202F inside « »). Type plain text.

| Where | What | Owner |
|---|---|---|
| `sections/<id>.ts` | `export interface <Pascal>Copy` + `export const <id>: Localized<<Pascal>Copy> = { en, fr }`, read as `dict.home.<id>`. Seeded with the spec's measured copy deck. Facts used only by that chapter may live here as exported constants. | that section's agent |
| `cases/<slug>.ts`, `cases/freelance.ts`, `cases/labels.ts`, `cases/types.ts` | the case words (`dict.projects[slug]`, `dict.freelance`, `dict.caseStudy`) and their types | the case-study agent |
| `en.ts`, `fr.ts` | shared words (`SharedDictionary`): `meta`, `common`, `chrome` (bar, menu, CTA, CV, language switch), `person`, profile labels (`experience`, `education`, `certifications`, `skills`, `languages`), `media` alt/captions, `notFound` | design-system / content owner |
| `pairs.ts` | `dict.home.pairs.{dau,mau,abWording,retention}`: `measure` (name), `zero` ("0", "0%"), before/after labels, `legend` (measure + scale: the line under the pair and the phone legend's last line), hidden sentence | shared |
| `home.ts` | `PAIRS` (scaled pairs: before or band, after, max) and `FIGURES` (value, measured ink `fit`, `inkLeft`, per locale) | shared |
| `site.ts` | `SITE` (email, links, CV; `SITE.name` is the plain "Artem" of machine-readable places), `DISPLAY_NAME` (the one visible spelling, "Artëm Serebryannikov", also `dict.person.name`), `mailtoHref(subject, body?)`, `SPOKEN_LANGUAGES` | shared |
| `media.ts` | `MEDIA[id]`: src, intrinsic size, plates, crop, provenance. Alt text = `dict.media[id]` | shared |
| `projects.ts`, `profile.ts`, `format.ts`, `stories.ts` | case facts, profile facts, period/date formatting, `splitStory`/`joinStory` (user story → three hanging clauses) | shared |

Rules: no literal copy in components (lab tooling excepted); TypeScript refuses a module missing a language; facts (numbers, years, names) change only with a source in `content-source.md`. `localizeFigure(value, locale)` writes shared figures the French way.

The final EN + FR copy deck (every slot, side by side, with each headline's character count and measured fit at 1440 · 1100 · 768 · 390) is `../.aaa/brief/copy-deck.md`. Re-measure any rewrite with `node ../.aaa/derived/copyfit/measure.mjs <batch.json>`; every headline stays at two lines or fewer at every width in both languages. Case modules follow the 03 §10 template shape (`cases/types.ts`: `h1` with "\n" as the authored break, `cover`, `lead`, `contextBody`, `names`, `actions`, `changedLead`, `changedBody` (absent on Cannes), `related` (a Small line after the result: the AppBazar payments and CRM cases point to the product case; render it), `statRow`, `retro`; `contextBody` is absent on the freelance page, plus per-case drawings and the Cannes day strip).

## The Tréma system (styles)

- **Tokens** (`styles/tokens.css`, 01 §13): colour roles `--paper --stone --ink --orange --orange-hover --muted --muted-on-ink --band --ink-step` (scaffold aliases `--ground --ink-muted --accent --surface-1/2 --on-accent` still work); type steps `--step-monument --step-display --step-2 --step-1 --step-0 --step--1` (+ leading, tracking, weights; the monument is width-bound at every viewport, `(100cqi − margin) / 2.6224`, so the m always crosses the right edge by 0.05em: on a short screen the hero's statement and actions fall below the fold and the bar's Email me carries the action; the footer stops being sticky rather than shrink it); grid `--margin --gutter --columns` (4/8/12); space `--space-3xs…4xl --section-gap`, lists of display-step items `--list-gap` (64/48: between items, at least twice the gap inside one) and `--item-trailer` (12: an item's Small trailer to its own item); `--bar` (64/56); layers `--z-*`; pair sizes `--pair-d-s/m/l`, `--dot-run` (the mask that draws every pair's run of dots); motion `--ease-* --dur-* --stagger* --rise* --press-scale*`.
- **Fields** (01 §2.2): every chapter is `<section data-field="paper|stone|ink|orange">`. The attribute sets `--field-bg --field-ink --field-muted --field-before --field-after --focus-color --btn-bg --btn-ink --btn-bg-hover --selection-* --caret --theme-color`, so components never ask where they are. Neighbours never share a field; orange only once (the close); charts never on stone (put them in a paper panel).
- **Type classes** (`styles/type.module.css`): `t.display` (H2, case H1, role, poster lines), `t.statement` / `t.statementStrong` (≤25-word `<p>`), `t.body`, `t.small`, `t.ui`, `t.muted`, `t.value`, `t.tabular`, `t.nowrap`. Compose them: `className={clsx(t.display, styles.title)}`. Five sizes, far apart: 540 / 96 / 32 / 19 / 15 at 1440.
- **Faces** (`styles/fonts.ts`): League Spartan 500–800 (display) and Figtree 400–600 (text), self-hosted subset woff2, `display: swap`, preloaded, Arial-adjusted fallbacks. `FONT_FAMILY` exposes the generated family lists.
- **Browser surfaces** (`styles/globals.css`, 01 §9): selection orange/ink (ink/paper on orange), caret, focus ring 2px in the field's focus colour at 3px, scrollbar in the field under the bar (`html[data-bar-field]`), chapter jumps land on the field's top edge (`scroll-margin-top` on `main > section[id]`), `.visually-hidden` and `.visually-hidden-inline`, underlines 0.07em at 0.2em, 40% → 100% on hover, lining figures, tabular only in `.tabular`, placeholder at `--placeholder-alpha` (60%, 86% on orange), tap highlight off, links press to opacity 0.7 (140ms), print styles, reduced-motion clamp (keyframes clamped; transitions keep only opacity and colour), skip link (drops into the bar band, over the wordmark slot).

## Motion grammar

- **Content is visible without JS.** The inline boot script (`lib/boot.ts`, in `<head>` before paint) adds `html.js`; hidden states exist only under `html.js` and `(prefers-reduced-motion: no-preference)`. It adds `html.fonts-ready` when the display face loads (≤700ms). If the motion layer (`MotionRoot`) has not booted after 4s it removes `html.js`, so nothing can stay hidden.
- **Load beat:** `data-beat` + `style={{ "--beat-delay": "160ms" }}` rises an element 28px once fonts are ready (`data-beat="fade"`: opacity only). Never on a control (wrap it).
- **Chapter entrances:** `<Reveal as="section" …>` with `data-reveal` children (`""` rise 24px, `"fade"`, `"settle"` from 0.94, `"ui"` 8px): once, when the part's untransformed top crosses 92% of the viewport (`REVEAL_LINE`; `line` / `data-reveal-line`, 1 for pinned stages), parts already on screen at mount at once; one page-wide queue in document order with a release clock (70ms stagger, 5-part cascades). `useReveal(ref, stagger?, line?)` for your own element. Each part fires `REVEAL_EVENT` when it starts.
- **Once-only triggers:** `onceInView(el, cb, options)` (`lib/inView.ts`), one shared IntersectionObserver per option set (`REVEAL_OBSERVER`, the default, = the chapter's line; on a still-hidden `[data-reveal]` part it is measured on the untransformed box, like `<Reveal>`, via `revealTravel(el)`). `onceRevealedInView(el, cb)`: in view AND 240ms after its `[data-reveal]` part starts rising (Pair entry, marks, DotField use it). `onHoverIntent(el, cb)`: replays on a real fine-pointer hover only. Never a scroll listener.
- **Scrubs** (only: the flight, the proof scenes' partings ≥1024px, the L-plate scale, the day-plan pan): GSAP + ScrollTrigger from `lib/gsap.ts` (`registerGsap()`, eases `trema.out` / `trema.inOut`, `SCRUB = 0.6`), inside `gsap.context()` reverted on cleanup; CSS `animation-timeline: view()` for the plate scale and the pan. `position: sticky` for pins, never GSAP pin. Never call `ScrollTrigger.refresh()` from a resize or mutation callback: `requestRefresh()` (one refresh after 150ms of quiet) or `refreshOnResize()` (shared body observer, ≥2px).
- **Feedback:** press `scale(0.97)` 140ms, hover 180ms only under `(hover:hover) and (pointer:fine)`, UI 240ms. Curves only from the tokens; no bounce, no ease-in, no `transition: all`, nothing from scale(0).
- **Native scroll.** `components/SmoothScroll.tsx` (Lenis) must stay unmounted.
- **First screen (01 §3.4, measured):** `lib/fold.ts` runs inline after the hero (HomePage), before paint, at fonts-ready and on a change of width or `svh`. The first hero block after the name that the fold would cut (or leave under 24px of clearance; 48px under the pair's labels) gets `margin-top` through `html[data-fold="n"] #top > :nth-child(n)`, so it and everything after it start below the fold and the bar carries Email me. Keep the hero's blocks as direct children of `#top`.
- **View transitions (01 §6.6):** names exist only for the navigation in progress (`lib/viewTransitions.ts`, inline in `<head>`). `PairMark` and `TypeSetPair vt` keep their names in `data-vt`. On pageswap, only the mark in the clicked link is named; on pagereveal, a case keeps its cover's names if it was carried and every other `tr-*` is muted. Names and mutes are rules in one `<style id="vt-carry">` (never inline styles on React-owned nodes: that is a hydration mismatch), removed when the transition ends. The old page fades out in 120ms, the new one fades in over 200ms from 80ms, and the dots fly for 420ms.

## Components (`src/components`, compose, never fork)

| Component | Spec | Use |
|---|---|---|
| `Bar` (+ `BarBehaviour`) | 01 §7.2–7.3 | one per page, before `<main>`; `variant="home" | "case" | "404"`. Follows the field under it, retints theme-color, marks the current chapter, hosts the phone menu (popover; its toggle reads Close / Fermer while open, with `aria-expanded`, and the bar's switch and Email me step aside for the sheet's own). Its Email me hides while any `[data-handoff]` group is in view: put `data-handoff` on every content Email me group (`#hero-actions`, `#contact-actions`). The hand-off never shares a frame: on show the links slide first and the button follows 120ms later; on hide the button fades out first and the links follow 80ms later. The 404 variant holds CV and the switch to the other locale's home. |
| `ButtonLink`, `Button`, `TextButton`, `CvLink`, `NoteLink`, `buttonClass`, `textButtonClass` | 01 §7.4 | square primary (56px, field colours), `size="bar"`, `block`; text buttons (`size="body"` for body size); the CV link with its Small note (`size="body"`); a text link with its Small description under it |
| `LanguageSwitch` | 01 §7.5 | same route, other locale; `form="short"` (FR/EN) or `"long"`; named by aria-label, visible word first ("FR, version française") |
| `Monument` | 01 §3.4, §6.1, §6.5; 03 §11 | "Artëm": `variant="hero"` (load beat, flight source), `"footer"` (orange dots come home at 35%), `"fallen"` (404). Give it the full viewport width; the parent clips the bleed with `overflow: clip`. |
| `Bust` | 01 §7.1, §8.3 | the cut-out portrait glyph, 86px max (`size="small"` 64px); outside the h1 |
| `Pair` (+ `pairMotion`: `setPairProgress`, `releasePair`, `replayPair`, `pairGeometry`) | 01 §7.6, §6.3 | Pair v2. `size` S/M/L, `data={PAIRS.x}`, `copy={dict.home.pairs.x}`, `motion` load/entry/scrub/static/manual (manual: rests until you set `data-parted` on `[data-pair]`), `labels` attached/legend/none, `measure`, `inlineValue`, `anchorId` (final after-dot box for `Figure inkRightTo`), `vt` names (the cover's, permanent), `lead` (M: the one number, its after value at the statement step; the zero and before labels drop so every description shares a baseline; `lead="both"`: both values at the statement step, the hero's). The label band holds values only: x(0) is a 0.25d band dot with its value (`copy.zero`, `data-pair-label="start"`). From 600px, the measure and scale (`copy.legend`) are one Small line under the band, from the before dot's centre, where the run starts (`[data-pair-measure]`; `caption` replaces it; `--pair-measure-float: 1` makes it take no height) |
| `PairMark`, `replayMark`, `TypeSetPair` | 01 §7.6 S, §7.7, 03 A5 | the S emblem (`vt={{ a: "tr-<slug>-a", b: "tr-<slug>-b" }}`, held in `data-vt`, named only for the navigation in progress); "~~Days~~ ●—● about two hours" (`strike={false}` for spans, `joiner={dict.common.to}`, `vt` like PairMark's, `partDelay`/`partDuration` in ms) |
| `Figure` | 01 §3.5, 03 A2 | giant figure by the fit rule (`fit`, `inkLeft` from `FIGURES`/content), French half-size U+202F, `inkRightTo` ±1px, `coverRest` for case covers |
| `Flight` (+ `flightRoute`) | 01 §6.2, 02 H2 | the signature: `<Flight heroId="top" pairId="hero-pair" />`, mounted by the hero. Put `data-flight-avoid` on what the dots must not cross (the role line, the bust, the facts): each dot's route is chosen per layout to clear their text boxes by 2px at every scroll position (a lane beside an obstacle when the spec's route would cross one; single file right of the bust on phones; behind them under ~375px, where no lane exists). Phones: 100–140px of trigger. Colour fills each dot from its centre before it reaches the e's x-height |
| `Stage`, `Plate`, `Pan` | 01 §8.1–8.2, 03 A4 | full-bleed ink band; plates L / L-wide (scroll-linked scale of the screen, origin `--stage-origin`, default bottom-left / centre), M / S / XS (settle); `Plate` takes `caption` (bool or your string), `alt`, `image` (another file or a static import), `phone` (a <600px crop); the Cannes day plan panned by the scroll (`alt`, `caption` override `dict.media[id]`; the window settles, the figure fades) |
| `DotField` | 01 §7.9 | one dot one unit, segments after/before/faint/empty, rows arrive once (`rowDelay`, default 12ms), the caption after the last row; space it with your className |
| `StatRow`, `StoryCard` | 03 A3, A1; 01 §7.10 | stat row (values over Small captions); a user story as three hanging clauses (`splitStory`; `labelId` on the first clause for `aria-labelledby`) |
| `Reveal`, `useReveal` | 01 §5.2 | chapter entrances (a part taller than the viewport needs 15% of a viewport in view; `data-reveal-threshold` overrides) |
| `Rich`, `MediaImage`, `PersonJsonLd`, `RootDocument`, `MotionRoot` | | rich text, images, JSON-LD, the document shell |

Sections build what only they use (Stories tablist, the scenes, the work index, the month in dots, the route, the poster wall, the close's composer) inside their own folder.

## The lab (dev only)

- `http://localhost:3000/lab/` index · `/lab/<id>/` English · `/lab/<id>/fr/` French · `/lab/<id>/runway/` (+150svh after the chapter, for scrubbed moves) · `/lab/<id>/bar/` (the home bar before it, the runway after it, and on the hero the first-screen rule). Each home section has its own route (`app/(lab)/lab/<id>/[[...opts]]/`), so a broken section breaks only its own lab page; `specimen` (the whole system: palette, steps EN+FR, controls in every state on every field, pairs, figures, monument check, stage, portrait, bar and footer) and `og` (the 1200×630 card) live in the catch-all.
- Lab route files are `*.lab.tsx`, a page extension only under `next dev`, so `next build` never ships them (`check-export.mjs` verifies). Do not use `LayoutProps`/`PageProps` helpers in lab files.
- Social cards: `node ../.aaa/tools/shoot.mjs --url http://localhost:3000/lab/og/ --out <dir> --name og-en --widths 1200 --heights 630`, copy to `public/og-<locale>.png`.

## File ownership (parallel agents)

- **A section agent edits only `src/sections/<Pascal>/` and `src/content/sections/<id>.ts`.** Nothing else: not the registry (every section is already registered), not `views/`, not shared content, not components. It may add files inside its own folder and fields/constants inside its own content module. A need for a shared change (a token, a component variant, a shared fact or word) goes to the design-system owner.
- **The case-study agent** owns `src/views/CaseStudyPage.tsx` (+ `.module.css`), `src/views/case/*` (its own components), and `src/content/cases/*`. It reuses `Bar`, `Contact`, `Footer` and the shared components.
- **Design-system / integration owner:** `src/styles/*`, `src/components/*`, `src/lib/*`, `src/lab/*`, `src/app/*`, `src/views/HomePage.tsx`, `src/views/NotFoundView.tsx`, shared `src/content/*` files, `next.config.ts`, `public/`.
- Never edit `node_modules`, `.next`, `out`.

## Commands (run in `site/`)

| Command | What |
|---|---|
| `bash scripts/ensure-dev.sh` | start the shared dev server on :3000 only if silent; never start a second one, never kill it |
| `node ../.aaa/tools/shoot.mjs --url <url> --out <dir> --name <prefix> [--widths 1440,768,390] [--full] [--scroll-frames auto] [--reduced-motion]` | screenshots |
| `node scripts/a11y.mjs / /fr/ /lab/<id>/` | axe WCAG 2.2 AA at 1440 and 390 |
| `npm run typecheck` · `npm run lint` · `npm run build` | `next typegen` + tsc · ESLint · static export |
| `npm run verify` | typecheck + lint + build + `check-export.mjs` (pages, lang, canonical, hreflang, no lab, no phone number) |

## Gotchas

1. **Dev types break builds (Next 16.4).** Keep `experimental.useTypeScriptCli: false` and `tsconfig.typecheck.json` (excludes `.next/dev`).
2. **Root layouts in route groups are typed as route "/"**: use `LayoutProps<"/">` in `(fr)/layout.tsx` too.
3. **`next/image` `priority` is deprecated in 16**: `MediaImage` takes `eager`. Plates and the bust use plain `<img>` with intrinsic sizes.
4. **`next lint` no longer exists**; `npm run lint` runs ESLint. The React Compiler rules are on: no `setState` directly in an effect body (use `useSyncExternalStore` or a timer), no refs passed through `createElement`.
5. **`"use client"` on a utility module** turns its exports into client references. Keep it off `lib/` modules. `lib/motion.ts` has no GSAP import on purpose: import GSAP only from `lib/gsap.ts` in components that scrub.
6. **The bar is sticky in flow**: the hero's top is at `--bar`, not 0. The flight starts at an absolute 16px of scroll.
7. **Size containers trap `position: fixed`** (layout containment): the hero, the monument and the pair drawing are `container-type: inline-size`; the flight therefore portals its layer to `<body>`.
8. **Full-page screenshots and the curtain**: `--full` captures at scroll 0, so the sticky footer sits behind `<main>` and its slot at the end looks empty. Check the end of a page with `--scroll-frames 100`. A page whose `<main>` can be shorter than the viewport passes `curtain={false}` to `Footer` (the 404 does), so the fold cuts the footer, never `<main>`'s edge. On desktop the footer is at least `100svh − bar − section-gap + 8px` tall, so at the end of a page the band under the bar shows only the last chapter's bottom padding: keep that padding ≥ `--section-gap`.
9. **iCloud duplicates**: the repo lives in a synced Desktop; files named `* 2.*` can appear in `.next/types` and `out/` and break typecheck. Delete the generated duplicates.
10. The global reduced-motion rule clamps keyframe animations and limits transitions to opacity and colour (a transform, clip-path or filter change lands at once); JS motion checks `prefersReducedMotion()` itself (the flight listens for changes and restores the static marks).
11. **The CSS minifier merges selector lists.** A rule whose selector list holds a `:has()` selector, placed next to a rule with the same declarations, came out merged with its `:has()` half dropped (the phone menu's labels). Write such states as separate rules with distinct declarations, and check the served CSS when a `:has()` state does nothing.
12. **`[data-field]` is a global selector.** It paints the field's background and sets its colour and tokens on whatever carries it (globals.css, tokens.css). Never use `data-field="…"` for anything but a field: name other states `data-blank`, `data-kind`, etc. BarBehaviour follows every `[data-field]` under the bar's bottom line, mounted late or not.
13. **Write the file before the import.** While any module fails to compile, Turbopack answers 500 on every route of the shared dev server, isolated lab routes included. Create the imported file (even a stub) first, then add the import.
14. **Turbopack can serve a stale CSS-module class map** after a stylesheet is moved and a new file is created under the old name: classes that exist only in the new file resolve to "". Give the stylesheet a new filename (or touch the importing module) instead of restarting the shared server. The same staleness once served an old lab layout (`<html lang="en">` on /lab/<id>/fr/) until LabRoot was touched.

