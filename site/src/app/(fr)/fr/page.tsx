import type { Metadata } from "next";
import { homeMetadata } from "@/lib/seo";
import { HomePage } from "@/views/HomePage";

export const metadata: Metadata = homeMetadata("fr");

export default function Page() {
  return <HomePage locale="fr" />;
}
