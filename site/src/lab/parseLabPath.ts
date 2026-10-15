import type { Locale } from "@/content";
import { isLabSectionId, type LabSectionId } from "./registry";

export type LabRoute =
  | { kind: "index"; locale: Locale }
  | { kind: "section"; id: LabSectionId; locale: Locale }
  | { kind: "missing"; locale: Locale };

/** [] -> index, [id] -> section in English, [id, "fr"] -> section in French. */
export function parseLabPath(path: string[] | undefined): LabRoute {
  const [id, lang, ...rest] = path ?? [];
  const locale: Locale = lang === "fr" ? "fr" : "en";
  if (id === undefined) return { kind: "index", locale: "en" };
  if (rest.length > 0 || (lang !== undefined && lang !== "fr") || !isLabSectionId(id)) {
    return { kind: "missing", locale };
  }
  return { kind: "section", id, locale };
}
