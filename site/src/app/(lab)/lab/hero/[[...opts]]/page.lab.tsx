import { LAB_PARAMS, labSectionPage } from "@/lab/labSectionPage";
import { Hero } from "@/sections/Hero/Hero";

/** DEV-ONLY: /lab/hero/ and /lab/hero/fr/ (+ runway/, bar/: see lab/labSectionPage.tsx). */
export const dynamicParams = false;

export function generateStaticParams() {
  return LAB_PARAMS;
}

export default labSectionPage("hero", Hero);
