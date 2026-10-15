import { LAB_PARAMS, labSectionPage } from "@/lab/labSectionPage";
import { Human } from "@/sections/Human/Human";

/** DEV-ONLY: /lab/human/ and /lab/human/fr/ (+ runway/, bar/: see lab/labSectionPage.tsx). */
export const dynamicParams = false;

export function generateStaticParams() {
  return LAB_PARAMS;
}

export default labSectionPage("human", Human);
