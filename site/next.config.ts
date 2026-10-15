import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

/**
 * Static export for GitHub Pages (https://asrbnkv.github.io, user site, no basePath).
 *
 * The lab (/lab/<section>/) is DEV-ONLY: its route files are named
 * page.lab.tsx / layout.lab.tsx and "lab.tsx" is a page extension only in the
 * development-server phase. `next build` never sees them, so they cannot ship.
 */
export default function config(phase: string): NextConfig {
  const isDevServer = phase === PHASE_DEVELOPMENT_SERVER;
  return {
    output: "export",
    trailingSlash: true,
    images: { unoptimized: true },
    reactStrictMode: true,
    pageExtensions: isDevServer ? ["lab.tsx", "tsx", "ts"] : ["tsx", "ts"],
    // Keep the dev badge out of screenshots.
    devIndicators: false,
    experimental: {
      // One 404 for an app with several root layouts (en, fr, lab).
      globalNotFound: true,
      // Next 16.4 type-checks builds with the tsc CLI by default, which does
      // NOT filter out .next/dev/types. Those dev types include the dev-only
      // lab routes and clash with the build's route types, so any build after
      // a dev session would fail. The in-process checker filters them.
      useTypeScriptCli: false,
    },
  };
}
