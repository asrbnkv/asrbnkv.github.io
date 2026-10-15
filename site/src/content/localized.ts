import type { Locale } from "./locales";

/** A value written once per locale. TypeScript refuses a module that misses one. */
export type Localized<T> = Readonly<Record<Locale, T>>;
