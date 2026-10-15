import Image from "next/image";
import { getDictionary, MEDIA, type Locale, type MediaId } from "@/content";

/**
 * One of his real images, with intrinsic size and localized alt text.
 * Screenshots keep their own interface chrome: the root carries data-ui so
 * the design inspector knows it is a real interface fragment.
 */
export function MediaImage({
  id,
  locale,
  className,
  sizes = "100vw",
  eager = false,
}: {
  id: MediaId;
  locale: Locale;
  className?: string;
  sizes?: string;
  /** Above-the-fold image: load eagerly with high fetch priority. */
  eager?: boolean;
}) {
  const m = MEDIA[id];
  const { alt } = getDictionary(locale).media[id];
  return (
    <Image
      src={m.src}
      width={m.width}
      height={m.height}
      alt={alt}
      sizes={sizes}
      className={className}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : "auto"}
      data-ui={id === "portrait" ? undefined : ""}
    />
  );
}
