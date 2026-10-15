import clsx from "clsx";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { SITE } from "@/content";
import styles from "./Button.module.css";

/**
 * Buttons and button-like links (01-system.md §7.4–7.5).
 *
 *   <ButtonLink href={mailtoHref(dict.chrome.emailSubject)}>{dict.chrome.emailMe}</ButtonLink>
 *   <ButtonLink size="bar" …>             the bar's 40px Email me
 *   <ButtonLink block …>                  full width (phone hero, the close)
 *   <TextButton onClick={copy}>Copy</TextButton>
 *   <CvLink label={dict.chrome.cvLong} note={dict.chrome.cvNote} />
 *
 * A mailto is a link styled as a button. Colours follow the field the
 * button sits on (tokens.css data-field sets).
 */
type ButtonSize = "default" | "bar";

interface ButtonLook {
  size?: ButtonSize;
  /** Full width of its container. */
  block?: boolean;
}

/** Class names for a primary button, for the rare custom element. */
export function buttonClass({ size = "default", block = false }: ButtonLook = {}): string {
  return clsx(styles.button, size === "bar" && styles.bar, block && styles.block);
}

export function ButtonLink({
  size,
  block,
  className,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & ButtonLook) {
  return <a className={clsx(buttonClass({ size, block }), className)} {...rest} />;
}

export function Button({
  size,
  block,
  className,
  type = "button",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & ButtonLook) {
  return <button type={type} className={clsx(buttonClass({ size, block }), className)} {...rest} />;
}

/** Text button: Copy, Menu, Show more. `size="body"` sets it at body size (the close's ways, 02 §10.1). */
export function TextButton({
  className,
  type = "button",
  size = "ui",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { size?: "ui" | "body" }) {
  return <button type={type} className={clsx(styles.text, size === "body" && styles.textBody, className)} {...rest} />;
}

export const textButtonClass = styles.text;
/** Add to textButtonClass for the body-size variant. */
export const textButtonBodyClass = styles.textBody;

/**
 * The CV download: the link, then what the file is in Small, tied to the
 * link with aria-describedby (01 §7.5). `id` must be unique on the page.
 */
export function CvLink({
  label,
  note,
  id,
  size = "ui",
  className,
  children,
}: {
  label: string;
  note?: string;
  id: string;
  /** "body": the link at body size (the close, 02 §10.1); the note stays Small. */
  size?: "ui" | "body";
  className?: string;
  children?: ReactNode;
}) {
  const noteId = `${id}-note`;
  return (
    <span className={clsx(styles.withNote, className)}>
      <a
        id={id}
        href={SITE.cv.href}
        download={SITE.cv.downloadName}
        aria-describedby={note ? noteId : undefined}
        className={clsx(styles.text, size === "body" && styles.textBody)}
      >
        {label}
      </a>
      {note ? (
        <span id={noteId} className={styles.note}>
          {note}
        </span>
      ) : null}
      {children}
    </span>
  );
}

/**
 * A text link with its one-line description in Small under it (01 §7.5:
 * LinkedIn and the AI twin in the phone menu). The target stays 44px tall;
 * the description is tied to it by aria-describedby.
 */
export function NoteLink({
  href,
  label,
  note,
  id,
  className,
}: {
  href: string;
  label: string;
  note: string;
  id: string;
  className?: string;
}) {
  const noteId = `${id}-note`;
  return (
    <span className={clsx(styles.noteBelow, className)}>
      <a id={id} href={href} aria-describedby={noteId} className={styles.text}>
        {label}
      </a>
      <span id={noteId} className={styles.note}>
        {note}
      </span>
    </span>
  );
}
