import { LAB_PARAMS, labSectionPage } from "@/lab/labSectionPage";
import { Builder } from "@/sections/Builder/Builder";

/** DEV-ONLY: /lab/builder/ and /lab/builder/fr/ (+ runway/, bar/: see lab/labSectionPage.tsx). */
export const dynamicParams = false;

export function generateStaticParams() {
  return LAB_PARAMS;
}

export default labSectionPage("builder", Builder);
