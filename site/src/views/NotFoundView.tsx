import clsx from "clsx";
import { Bar } from "@/components/Bar";
import { ButtonLink, textButtonClass } from "@/components/Button";
import { Monument } from "@/components/Monument";
import {
  ANCHORS,
  getDictionary,
  homeHref,
  LOCALE_META,
  LOCALES,
  mailtoHref,
} from "@/content";
import { Footer } from "@/sections/Footer/Footer";
import t from "@/styles/type.module.css";
import styles from "./NotFoundView.module.css";

/**
 * The 404 (01-system.md §7.16, 03 §11): one static 404.html for both
 * languages (GitHub Pages serves it for every unknown URL). The boot script
 * sets <html lang> and data-lang from the path before paint; with JS only
 * the matching block shows ([data-nf]), without JS both show, EN first.
 *
 * The monument reads "Artem" with its two dots fallen on the baseline; the
 * footer below brings them home, orange, in "Artëm": the page's one joke is
 * a bookend.
 */
export function NotFoundView() {
  return (
    <>
      <Bar locale="en" route={{ page: "home" }} variant="404" />
      <main id="main" data-curtain-main="" data-field="paper" className={styles.main}>
        <Monument variant="fallen" as="div" beat={false} className={styles.monument} />
        {LOCALES.map((locale) => {
          const dict = getDictionary(locale);
          const nf = dict.notFound;
          return (
            <section
              key={locale}
              lang={LOCALE_META[locale].htmlLang}
              data-nf={locale}
              className={styles.block}
              aria-labelledby={`nf-title-${locale}`}
            >
              <h1 id={`nf-title-${locale}`} className={clsx(t.statement, styles.title)}>
                {nf.title}
              </h1>
              <div className={styles.actions}>
                <ButtonLink href={mailtoHref(dict.chrome.emailSubject)}>{dict.chrome.emailMe}</ButtonLink>
                <a href={homeHref(locale)} className={textButtonClass}>
                  {nf.home}
                </a>
                <a href={homeHref(locale, ANCHORS.work)} className={textButtonClass}>
                  {nf.work}
                </a>
              </div>
            </section>
          );
        })}
      </main>
      {LOCALES.map((locale) => (
        <Footer
          key={locale}
          locale={locale}
          dict={getDictionary(locale)}
          route={{ page: "home" }}
          nfLang
          curtain={false}
        />
      ))}
    </>
  );
}
