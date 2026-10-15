import localFont from "next/font/local";

/**
 * The two faces of the Tréma system (01-system.md §3.1), self-hosted from
 * src/styles/fonts/ (subset woff2 built by .aaa/derived/fonts/make-fonts.py;
 * the OFL licences ship beside them).
 *
 *   League Spartan, wght 500–800: the monument, figures, H1/H2, role line,
 *     statements, wordmark (500 statement · 700 display · 800 monument/figures)
 *   Figtree, wght 400–600: body, small, UI, labels, captions
 *     (400 body · 500 small emphasis · 600 UI and values)
 *
 * No third face, no italics, no monospace.
 */
const display = localFont({
  src: "./fonts/LeagueSpartan-Trema.woff2",
  weight: "500 800",
  style: "normal",
  variable: "--font-display-face",
  display: "swap",
  preload: true,
  adjustFontFallback: "Arial",
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
});

const text = localFont({
  src: "./fonts/Figtree-Trema.woff2",
  weight: "400 600",
  style: "normal",
  variable: "--font-text-face",
  display: "swap",
  preload: true,
  adjustFontFallback: "Arial",
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
});

/** Applied to <html> by every root layout (en, fr, lab, 404). */
export const fontVariables = [display.variable, text.variable].join(" ");

/**
 * The generated font-family lists, for code that must name the face
 * (document.fonts.load in the boot script, canvas measureText in Figure).
 */
export const FONT_FAMILY = {
  display: display.style.fontFamily,
  text: text.style.fontFamily,
} as const;
