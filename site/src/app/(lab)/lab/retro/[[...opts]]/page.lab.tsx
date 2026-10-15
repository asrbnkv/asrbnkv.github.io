import { LAB_PARAMS, labSectionPage } from "@/lab/labSectionPage";
import { Retro } from "@/sections/Retro/Retro";

/** DEV-ONLY: /lab/retro/ and /lab/retro/fr/ (+ runway/, bar/: see lab/labSectionPage.tsx). */
export const dynamicParams = false;

export function generateStaticParams() {
  return LAB_PARAMS;
}

export default labSectionPage("retro", Retro);
