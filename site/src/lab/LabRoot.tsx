import type { ReactNode } from "react";
import { RootDocument } from "@/components/RootDocument";

/**
 * DEV-ONLY root document of a section's lab route (/lab/<id>/, /lab/<id>/fr/).
 * Every section has its own route folder (app/(lab)/lab/<id>/[[...opts]]/),
 * so a section that does not compile breaks only its own lab page.
 */
export async function LabRoot({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ opts?: string[] }>;
}) {
  const { opts } = await params;
  return (
    <RootDocument locale={opts?.[0] === "fr" ? "fr" : "en"} skipLink={false}>
      {children}
    </RootDocument>
  );
}
