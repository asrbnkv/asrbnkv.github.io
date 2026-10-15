import type { Metadata } from "next";
import type { ReactNode } from "react";
import { RootDocument } from "@/components/RootDocument";
import { parseLabPath } from "@/lab/parseLabPath";

/**
 * DEV-ONLY root layout for the lab. The ".lab.tsx" extension is only a page
 * extension under `next dev` (see next.config.ts), so production builds
 * ignore this folder entirely.
 * Do not use the generated LayoutProps<...> helper here: lab routes do not
 * exist in production route types.
 */
export const metadata: Metadata = { title: "Lab", robots: { index: false } };

export default async function LabRootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ path?: string[] }>;
}) {
  const { path } = await params;
  const { locale } = parseLabPath(path);
  return (
    <RootDocument locale={locale} skipLink={false}>
      {children}
    </RootDocument>
  );
}
