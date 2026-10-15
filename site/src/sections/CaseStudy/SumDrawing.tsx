"use client";

import clsx from "clsx";
import { useEffect, useRef, type CSSProperties } from "react";
import type { CaseSum } from "@/content/cases/types";
import { onceInView } from "@/lib/inView";
import { prefersReducedMotion } from "@/lib/motion";
import styles from "./SumDrawing.module.css";

/**
 * The sum drawing (03 §7.1): the cases with no screens draw their system as
 * an invoice sum set in type. Terms one per line at the display step,
 * operators in a fixed 0.62em column, the sum line a gap lower (no rule).
 * A 3px connector runs from the sum's ink to column 8, where the outputs
 * follow as dots with labels; at most one dot is orange (the output that
 * moved the case's number). Phones: the connector turns vertical.
 *
 * The drawing is aria-hidden; the hidden sentence says the same in words.
 * Motion, once in view: terms rise line by line (90ms), the connector
 * draws, the outputs rise (45ms), the orange dot drops last. Without JS and
 * under reduced motion it is simply drawn.
 */
export function SumDrawing({ sum, fit }: { sum: CaseSum; fit: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || el.hasAttribute("data-in")) return;
    if (prefersReducedMotion()) {
      el.setAttribute("data-in", "");
      return;
    }
    return onceInView(el, () => el.setAttribute("data-in", ""), {
      threshold: 0.2,
      rootMargin: "0px 0px -6% 0px",
    });
  }, []);

  const terms = sum.terms.filter((term) => term.op !== "=");
  const total = sum.terms.find((term) => term.op === "=");
  const n = terms.length + (total ? 1 : 0);

  return (
    <figure className={styles.sum} style={{ "--sum-fit": fit, "--n": n } as CSSProperties}>
      <div ref={ref} className={styles.drawing} aria-hidden="true" data-sum-drawing="">
        {terms.map((term, i) => (
          <div key={term.text} className={styles.row} style={{ "--i": i } as CSSProperties}>
            <p className={styles.term}>
              <span className={styles.op}>{term.op}</span>
              <span className={styles.word}>{term.text}</span>
            </p>
            {term.role ? <p className={styles.role}>{term.role}</p> : null}
          </div>
        ))}

        {total ? (
          <div className={clsx(styles.row, styles.total)} style={{ "--i": terms.length } as CSSProperties}>
            <p className={styles.term}>
              <span className={styles.op}>{total.op}</span>
              <span className={styles.word}>{total.text}</span>
              <span className={styles.wire} />
            </p>
            <span className={styles.wireDown} />
            <div className={styles.outputs}>
              <ul className={styles.list}>
                {sum.outputs.map((output, j) => (
                  <li
                    key={output.text}
                    className={styles.output}
                    data-after={output.after ? "" : undefined}
                    style={{ "--j": j } as CSSProperties}
                  >
                    <span className={styles.dot} />
                    <span>{output.text}</span>
                  </li>
                ))}
              </ul>
              {sum.outputsCaption ? <p className={styles.caption}>{sum.outputsCaption}</p> : null}
            </div>
          </div>
        ) : null}
      </div>
      <figcaption className="visually-hidden">{sum.sentence}</figcaption>
    </figure>
  );
}
