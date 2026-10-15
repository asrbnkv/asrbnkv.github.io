import clsx from "clsx";
import { Pair, type PairProps } from "@/components/Pair";
import styles from "./RowPair.module.css";

/**
 * The pair that ends a loop row (02 §6.1, the Test step), drawn to scale on
 * the loop's measure. It parts on entry (Pair `entry`, 01 §6.3: once its row
 * has risen and the pair is in view; drawn parted without JS and under
 * reduced motion).
 *
 * Both ends of the scale are marked (01 §7.6): the Pair sets its 0 under
 * the measure's start, and this row sets the maximum (`max`, "×2") under its
 * end in the same style, so 0 · ×1 · about ×1.5 · ×2 reads as one honest
 * scale. The ends never move; only the two dots part. The caption names the
 * measure and the scale in words, and the hidden sentence states the result.
 * On a measure too short to keep the two labels centred on their dots
 * (under 590px, 640px in French: 768–1279 and phones), the labels become
 * the Pair's legend under the drawing (RowPair.module.css).
 */
export function RowPair({ className, max, ...pair }: Omit<PairProps, "motion"> & { max: string }) {
  return (
    <div className={clsx(styles.row, className)} data-row-pair="">
      <Pair {...pair} motion="entry" />
      <span className={styles.max} aria-hidden="true">
        <span className={styles.tick} />
        <span className={styles.value}>{max}</span>
      </span>
    </div>
  );
}
