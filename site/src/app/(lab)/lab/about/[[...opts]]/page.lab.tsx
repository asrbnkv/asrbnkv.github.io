import { LAB_PARAMS, labSectionPage } from "@/lab/labSectionPage";
import { About } from "@/sections/About/About";

/** DEV-ONLY: /lab/about/ and /lab/about/fr/ (+ runway/, bar/: see lab/labSectionPage.tsx). */
export const dynamicParams = false;

export function generateStaticParams() {
  return LAB_PARAMS;
}

export default labSectionPage("about", About);
