import type { Metadata } from "next";
import { homeMetadata } from "@/lib/seo";
import { HomePage } from "@/views/HomePage";

export const metadata: Metadata = homeMetadata("en");

export default function Page() {
  return <HomePage locale="en" />;
}
