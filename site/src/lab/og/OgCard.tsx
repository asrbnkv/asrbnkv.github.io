import { Bust } from "@/components/Bust";
import { PairMark } from "@/components/Marks";
import { Monument } from "@/components/Monument";
import type { SectionProps } from "@/sections/types";
import styles from "./OgCard.module.css";

/**
 * DEV-ONLY (lab): the social card, rendered to public/og-<locale>.png with
 *   node ../.aaa/tools/shoot.mjs --url http://localhost:3000/lab/og/<fr/> \
 *     --widths 1200 --heights 630 --settle 800
 * then stamped with its provenance line (01 §11).
 */
export function OgCard({ locale, dict }: SectionProps) {
  const dau = dict.home.pairs.dau;
  return (
    <div className={styles.card} data-field="paper" data-og="">
      <Monument variant="hero" as="div" beat={false} className={styles.monument} />
      <p className={styles.role}>{dict.home.hero.role}</p>
      <Bust locale={locale} size="small" className={styles.bust} alt={dict.home.hero.bustAlt} />
      <div className={styles.foot}>
        <p className={styles.line}>{dict.meta.ogLine}</p>
        <p className={styles.proof}>
          {dau.measure} {dau.before.value}
          <PairMark size="M" length={4.5} motion="static" className={styles.mark} />
          <span className="visually-hidden"> {dict.common.to} </span>
          {dau.after.value} {dau.after.text}
        </p>
      </div>
    </div>
  );
}
