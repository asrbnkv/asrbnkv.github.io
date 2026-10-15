/**
 * Every real image the site ships (01-system.md §8, §11), with intrinsic
 * pixel size, its fixed crop, the plates it may take and its provenance.
 * Files live in public/media/. Alt text and captions are per locale in the
 * dictionary (`dict.media[id]`): the id is the alt key.
 *
 * - Screens are graded once for the ink stage (.aaa/derived/stage/make-stage.py:
 *   saturation 0.85, levels ink #0E0F0F to paper #F3F3F0) and never upscaled.
 * - The portrait is the CV photo cut out with a real alpha matte; show it at
 *   86 CSS px tall or smaller.
 * - Never shipped: list, dash, stats (his own job search, with redactions).
 * - The provenance line is embedded next to each raster
 *   (kept with the source assets, outside the repo).
 */

/** Stage plate sizes (01 §8.1, 03 §14 A4): L 7–8 cols, L-wide margin to margin, M 4–6, S 3–4, XS the phone screen. */
export type PlateSize = "L" | "L-wide" | "M" | "S" | "XS" | "pan" | "glyph";

export interface MediaEntry {
  src: string;
  width: number;
  height: number;
  /** The case it belongs to (a CaseSlug), or null. */
  project: string | null;
  kind: "screen" | "portrait";
  plates: readonly PlateSize[];
  /** Fixed crop in source px [left, top, right, bottom], or null. */
  crop: readonly [number, number, number, number] | null;
  /** Provenance: the source file and the treatment. */
  origin: string;
  treatment: string;
  /** Radius a real interface fragment keeps at its displayed size (data-ui). */
  uiRadius?: number;
}

const GRADE = "Tréma screen grade v1 (saturation 0.85, levels ink #0E0F0F to paper #F3F3F0)";

export const MEDIA = {
  roadmap: {
    src: "/media/roadmap.stage.webp",
    width: 1500,
    height: 853,
    project: "job-tracker",
    kind: "screen",
    plates: ["L", "L-wide"],
    crop: null,
    origin: ".aaa/source-assets/roadmap.webp",
    treatment: GRADE,
  },
  add: {
    src: "/media/add.stage.webp",
    width: 1255,
    height: 790,
    project: "job-tracker",
    kind: "screen",
    plates: ["M", "L"],
    crop: [24, 26, 1279, 816],
    origin: ".aaa/source-assets/add.webp",
    treatment: GRADE,
  },
  ai: {
    src: "/media/ai.stage.webp",
    width: 854,
    height: 568,
    project: "job-tracker",
    kind: "screen",
    plates: ["S", "M"],
    crop: null,
    origin: ".aaa/source-assets/ai.webp",
    treatment: GRADE,
  },
  c_day: {
    src: "/media/c_day.stage.webp",
    width: 1154,
    height: 1686,
    project: "cannes",
    kind: "screen",
    plates: ["pan", "M"],
    crop: null,
    origin: ".aaa/source-assets/c_day.webp",
    treatment: GRADE,
  },
  c_rhythm: {
    src: "/media/c_rhythm.stage.webp",
    width: 1154,
    height: 1686,
    project: "cannes",
    kind: "screen",
    plates: ["M"],
    crop: null,
    origin: ".aaa/source-assets/c_rhythm.webp",
    treatment: GRADE,
  },
  c_alt: {
    src: "/media/c_alt.stage.webp",
    width: 1154,
    height: 1686,
    project: "cannes",
    kind: "screen",
    plates: ["M"],
    crop: null,
    origin: ".aaa/source-assets/c_alt.webp",
    treatment: GRADE,
  },
  /** The swap's slot alone (02 §9): a fixed crop of the c_alt screen. */
  c_alt_slot: {
    src: "/media/c_alt-slot.stage.webp",
    width: 1154,
    height: 446,
    project: "cannes",
    kind: "screen",
    plates: ["M"],
    crop: [0, 1107, 1154, 1553],
    origin: ".aaa/source-assets/c_alt.webp",
    treatment: GRADE,
  },
  c_film: {
    src: "/media/c_film.stage.webp",
    width: 1138,
    height: 760,
    project: "cannes",
    kind: "screen",
    plates: ["S", "M"],
    crop: [8, 54, 1146, 814],
    origin: ".aaa/source-assets/c_film.webp",
    treatment: GRADE,
  },
  ab_feed: {
    src: "/media/ab_feed.stage.webp",
    width: 146,
    height: 312,
    project: "appbazar-product",
    kind: "screen",
    plates: ["XS"],
    crop: [300, 49, 446, 361],
    origin: ".aaa/source-assets/ab_feed.webp",
    treatment: GRADE,
    uiRadius: 14,
  },
  fl_slide: {
    src: "/media/fl_slide.stage.webp",
    width: 1700,
    height: 652,
    project: "freelance",
    kind: "screen",
    plates: ["L", "L-wide"],
    crop: [0, 160, 1700, 812],
    origin: ".aaa/source-assets/fl_slide.webp",
    treatment: GRADE,
  },
  portrait: {
    src: "/media/portrait-cutout.webp",
    width: 193,
    height: 173,
    project: null,
    kind: "portrait",
    plates: ["glyph"],
    crop: null,
    origin: ".aaa/source-assets/portrait-cv-254.png",
    treatment: "Apple Vision subject matte, straight bust cut at y=186, green despill; not upscaled",
  },
} as const satisfies Record<string, MediaEntry>;

export type MediaId = keyof typeof MEDIA;
export const MEDIA_IDS = Object.keys(MEDIA) as MediaId[];
