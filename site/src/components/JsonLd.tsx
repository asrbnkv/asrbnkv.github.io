import {
  absoluteUrl,
  getDictionary,
  homeHref,
  MEDIA,
  SITE,
  SPOKEN_LANGUAGES,
  type Locale,
} from "@/content";

/**
 * schema.org Person for the home (and any page that wants it). Facts only,
 * from the content layer: name, role, city, LinkedIn, languages. Never the
 * phone number.
 */
export function PersonJsonLd({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE.name,
    givenName: SITE.givenName,
    familyName: SITE.familyName,
    jobTitle: "Product Owner",
    description: dict.meta.siteDescription,
    url: absoluteUrl(homeHref(locale)),
    email: `mailto:${SITE.email}`,
    image: absoluteUrl(MEDIA.portrait.src),
    address: { "@type": "PostalAddress", addressLocality: SITE.city, addressCountry: "FR" },
    sameAs: [SITE.links.linkedin],
    knowsLanguage: [...SPOKEN_LANGUAGES],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
