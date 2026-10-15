// Run axe-core (WCAG 2.2 AA tags) on dev-server paths.
//   node scripts/a11y.mjs / /fr/ /work/cannes/ /lab/hero/
// Starts nothing: run scripts/ensure-dev.sh first. Exits 1 on violations.
import { chromium } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";

const base = process.env.BASE_URL || "http://localhost:3000";
const paths = process.argv.slice(2);
if (!paths.length) paths.push("/", "/fr/");

const browser = await chromium.launch();
let failed = 0;
for (const width of [1440, 390]) {
  const context = await browser.newContext({ viewport: { width, height: width >= 768 ? 900 : 844 } });
  const page = await context.newPage();
  for (const p of paths) {
    await page.goto(base + p, { waitUntil: "networkidle" });
    // Let the load beat and entrances finish (≤1.5s): axe would read text
    // caught mid-fade as low contrast.
    await page.waitForTimeout(1800);
    const res = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    for (const v of res.violations) {
      failed++;
      console.log(`[${width}] ${p} ${v.impact} ${v.id}: ${v.help}`);
      for (const n of v.nodes.slice(0, 5)) console.log(`    ${n.target.join(" ")}  ${n.failureSummary?.split("\n")[1] ?? ""}`);
    }
    if (!res.violations.length) console.log(`[${width}] ${p} ok`);
  }
  await context.close();
}
await browser.close();
process.exit(failed ? 1 : 0);
