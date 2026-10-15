// Post-build checks on site/out (run by `npm run verify`).
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scripts = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(scripts, "..");
const out = path.join(root, "out");
const slugs = ["havaianas", "appbazar-product", "appbazar-crm", "appbazar-payments", "job-tracker", "cannes", "freelance"];
const expected = [
  ["index.html", "en"],
  ["fr/index.html", "fr"],
  ["404.html", "en"],
  ...slugs.flatMap((s) => [[`work/${s}/index.html`, "en"], [`fr/work/${s}/index.html`, "fr"]]),
];
const errors = [];

for (const [file, lang] of expected) {
  const p = path.join(out, file);
  if (!fs.existsSync(p)) { errors.push(`missing ${file}`); continue; }
  const html = fs.readFileSync(p, "utf8");
  const m = html.match(/<html[^>]*\blang="([^"]+)"/);
  if (!m || m[1] !== lang) errors.push(`${file}: <html lang> is ${m?.[1]} (want ${lang})`);
  if (file !== "404.html" && !/rel="canonical"/.test(html)) errors.push(`${file}: no canonical`);
  if (file !== "404.html" && !/hrefLang="fr"/.test(html)) errors.push(`${file}: no hreflang`);
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
    d.isDirectory() ? walk(path.join(dir, d.name)) : [path.join(dir, d.name)],
  );
}
const files = walk(out);
for (const f of files) {
  const rel = path.relative(out, f);
  if (/(^|\/)lab(\/|$)/.test(rel)) errors.push(`lab route leaked into export: ${rel}`);
  if (/\.(html|txt)$/.test(f)) {
    const s = fs.readFileSync(f, "utf8");
    if (s.includes("data-lab-section")) errors.push(`lab markup in ${rel}`);
    // Never publish a phone number (FR formats).
    if (/(\+33|0033)\s?[1-9]([ .-]?\d{2}){4}|\b0[1-9]([ .-]?\d{2}){4}\b/.test(s.replace(/<script[\s\S]*?<\/script>/g, "")))
      errors.push(`possible phone number in ${rel}`);
  }
}

// The CV PDF: out/ must ship exactly the redacted copy in public/, never the
// source CV, whose "Tel.:" line prints his phone number. Hashes are recorded
// by ../.aaa/derived/cv/redact_cv.py in scripts/cv-hashes.json.
const CV = "Artem_Serebryannikov_CV.pdf";
const UNREDACTED = "ddfdcc1ae41a91aae0bb55a00f983068888430e5d9340bcdefa1316cdcca08ee";
const sha = (p) => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const hashFile = path.join(scripts, "cv-hashes.json");
const known = fs.existsSync(hashFile) ? JSON.parse(fs.readFileSync(hashFile, "utf8")) : {};
const forbidden = new Set([UNREDACTED, ...(known.forbidden ?? [])]);
const cvPublic = path.join(root, "public", CV);
const cvOut = path.join(out, CV);
if (!fs.existsSync(cvPublic)) errors.push(`missing public/${CV}`);
if (!fs.existsSync(cvOut)) errors.push(`missing out/${CV}`);
if (fs.existsSync(cvPublic) && fs.existsSync(cvOut)) {
  const hPublic = sha(cvPublic);
  const hOut = sha(cvOut);
  if (forbidden.has(hPublic)) errors.push(`public/${CV} is the unredacted CV (phone number): run redact_cv.py`);
  if (forbidden.has(hOut)) errors.push(`out/${CV} is the unredacted CV (phone number): rebuild the export`);
  if (hOut !== hPublic) errors.push(`out/${CV} differs from public/${CV}: stale export, rebuild`);
  if (known.allowed && hPublic !== known.allowed)
    errors.push(`public/${CV} is not the redacted CV recorded in scripts/cv-hashes.json`);
}

if (errors.length) {
  console.error("check-export FAILED:\n  " + errors.join("\n  "));
  process.exit(1);
}
console.log(`check-export OK: ${expected.length} pages, ${files.length} files, no lab, no phone, CV redacted.`);
