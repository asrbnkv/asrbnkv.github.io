import { LAB_PARAMS, labSectionPage } from "@/lab/labSectionPage";
import { Work } from "@/sections/Work/Work";

/** DEV-ONLY: /lab/work/ and /lab/work/fr/ (+ runway/, bar/: see lab/labSectionPage.tsx). */
export const dynamicParams = false;

export function generateStaticParams() {
  return LAB_PARAMS;
}

export default labSectionPage("work", Work);
