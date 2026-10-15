import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "@/content";
import { parseLabPath } from "@/lab/parseLabPath";
import { LAB_IDS, LAB_INDEX, LAB_REGISTRY } from "@/lab/registry";

/** DEV-ONLY: the lab index and the system pages (specimen, og); sections have their own routes (see registry.tsx). */
export const dynamicParams = false;

export function generateStaticParams() {
  return [
    { path: [] },
    ...LAB_IDS.flatMap((id) => [{ path: [id] }, { path: [id, "fr"] }]),
  ];
}

export default async function LabPage({
  params,
}: {
  params: Promise<{ path?: string[] }>;
}) {
  const { path } = await params;
  const route = parseLabPath(path);

  if (route.kind === "missing") notFound();

  if (route.kind === "index") {
    return (
      <main id="main" style={{ padding: "var(--gutter)", display: "grid", gap: "var(--space-s)" }}>
        <h1 style={{ fontSize: "var(--step-1)" }}>Lab</h1>
        <ul>
          {LAB_INDEX.map(({ id, title }) => (
            <li key={id}>
              {title}: <Link href={`/lab/${id}/`}>en</Link> <Link href={`/lab/${id}/fr/`}>fr</Link>
            </li>
          ))}
        </ul>
      </main>
    );
  }

  const Section = LAB_REGISTRY[route.id].component;
  return (
    <main id="main" data-lab-section={route.id}>
      <Section locale={route.locale} dict={getDictionary(route.locale)} />
    </main>
  );
}
