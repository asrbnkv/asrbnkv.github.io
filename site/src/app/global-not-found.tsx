import type { Metadata, Viewport } from "next";
import { RootDocument } from "@/components/RootDocument";
import { notFoundMetadata, VIEWPORT } from "@/lib/seo";
import { NotFoundView } from "@/views/NotFoundView";

/**
 * The 404 for every unmatched URL (exported as out/404.html, which GitHub
 * Pages serves). One file for both languages: the boot script switches
 * <html lang> to fr under /fr/ before paint (03 §11).
 */
export const metadata: Metadata = notFoundMetadata();
export const viewport: Viewport = VIEWPORT;

export default function GlobalNotFound() {
  return (
    <RootDocument locale="en" fr404>
      <NotFoundView />
    </RootDocument>
  );
}
