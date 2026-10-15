import { LAB_PARAMS, labSectionPage } from "@/lab/labSectionPage";
import { Footer } from "@/sections/Footer/Footer";

/** DEV-ONLY: /lab/footer/ and /lab/footer/fr/ (+ runway/, bar/: see lab/labSectionPage.tsx). */
export const dynamicParams = false;

export function generateStaticParams() {
  return LAB_PARAMS;
}

export default labSectionPage("footer", Footer);
