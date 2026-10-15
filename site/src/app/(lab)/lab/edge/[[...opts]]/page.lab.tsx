import { LAB_PARAMS, labSectionPage } from "@/lab/labSectionPage";
import { Edge } from "@/sections/Edge/Edge";

/** DEV-ONLY: /lab/edge/ and /lab/edge/fr/ (+ runway/, bar/: see lab/labSectionPage.tsx). */
export const dynamicParams = false;

export function generateStaticParams() {
  return LAB_PARAMS;
}

export default labSectionPage("edge", Edge);
