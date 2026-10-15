import { LAB_PARAMS, labSectionPage } from "@/lab/labSectionPage";
import { Proof } from "@/sections/Proof/Proof";

/** DEV-ONLY: /lab/proof/ and /lab/proof/fr/ (+ runway/, bar/: see lab/labSectionPage.tsx). */
export const dynamicParams = false;

export function generateStaticParams() {
  return LAB_PARAMS;
}

export default labSectionPage("proof", Proof);
