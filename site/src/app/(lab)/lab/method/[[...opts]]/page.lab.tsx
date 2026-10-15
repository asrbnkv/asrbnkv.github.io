import { LAB_PARAMS, labSectionPage } from "@/lab/labSectionPage";
import { Method } from "@/sections/Method/Method";

/** DEV-ONLY: /lab/method/ and /lab/method/fr/ (+ runway/, bar/: see lab/labSectionPage.tsx). */
export const dynamicParams = false;

export function generateStaticParams() {
  return LAB_PARAMS;
}

export default labSectionPage("method", Method);
