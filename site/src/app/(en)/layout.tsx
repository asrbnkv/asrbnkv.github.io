import type { Metadata, Viewport } from "next";
import { RootDocument } from "@/components/RootDocument";
import { homeMetadata, VIEWPORT } from "@/lib/seo";

/** Root layout for English routes ("/", "/work/<slug>/"): <html lang="en">. */
export const metadata: Metadata = homeMetadata("en");
export const viewport: Viewport = VIEWPORT;

export default function EnglishRootLayout({ children }: LayoutProps<"/">) {
  return <RootDocument locale="en">{children}</RootDocument>;
}
