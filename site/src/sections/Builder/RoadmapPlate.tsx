"use client";

import { useEffect, useRef } from "react";

interface Raster {
  src: string;
  width: number;
  height: number;
}

/**
 * The builder's L plate: the roadmap on the shared stage treatment (Stage's
 * `.l` scale with the scroll, the caption never scales). Written here
 * because below 1280px it shows the art-directed crop through <picture>.
 *
 * Its light-up draws the screen in along its time axis (Builder.module.css)
 * once two things hold: the chapter's reveal has released the plate, and
 * the picture is decoded. `data-ready` marks the second, so the words never
 * arrive beside an empty stage on a slow or deferred image load; a 2.5s
 * guard lights it regardless. Without JS (no html.js) nothing waits.
 */
export function RoadmapPlate({
  className,
  captionClassName,
  image,
  crop,
  alt,
  caption,
}: {
  className: string;
  captionClassName: string;
  image: Raster;
  crop: Raster;
  alt: string;
  caption: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const figure = ref.current;
    const img = figure?.querySelector("img");
    if (!figure || !img) return;
    let live = true;
    const ready = () => {
      if (live) figure.dataset.ready = "";
    };
    const guard = window.setTimeout(ready, 2500);
    if (img.complete && img.naturalWidth > 0) ready();
    else img.decode().then(ready, ready);
    return () => {
      live = false;
      window.clearTimeout(guard);
    };
  }, []);

  return (
    <figure ref={ref} className={className} data-ui="" data-plate="L" data-reveal="fade">
      <picture>
        <source media="(max-width: 1279.98px)" srcSet={crop.src} width={crop.width} height={crop.height} />
        <img src={image.src} width={image.width} height={image.height} alt={alt} loading="lazy" decoding="async" />
      </picture>
      <figcaption className={captionClassName}>{caption}</figcaption>
    </figure>
  );
}
