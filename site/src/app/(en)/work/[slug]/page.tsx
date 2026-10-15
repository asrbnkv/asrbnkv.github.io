import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CASE_SLUGS, isCaseSlug } from "@/content";
import { caseMetadata } from "@/lib/seo";
import { CaseStudyPage } from "@/views/CaseStudyPage";

export const dynamicParams = false;

export function generateStaticParams() {
  return CASE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return isCaseSlug(slug) ? caseMetadata("en", slug) : {};
}

export default async function Page({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  if (!isCaseSlug(slug)) notFound();
  return <CaseStudyPage locale="en" slug={slug} />;
}
