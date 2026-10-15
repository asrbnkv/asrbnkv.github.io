import type { Metadata, Viewport } from "next";
import { RootDocument } from "@/components/RootDocument";
import { homeMetadata, VIEWPORT } from "@/lib/seo";

/** Root layout for French routes ("/fr/", "/fr/work/<slug>/"): <html lang="fr">. */
export const metadata: Metadata = homeMetadata("fr");
export const viewport: Viewport = VIEWPORT;

export default function FrenchRootLayout({ children }: LayoutProps<"/">) {
  return <RootDocument locale="fr">{children}</RootDocument>;
}
