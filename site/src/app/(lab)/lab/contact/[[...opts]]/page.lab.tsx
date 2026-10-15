import { LAB_PARAMS, labSectionPage } from "@/lab/labSectionPage";
import { Contact } from "@/sections/Contact/Contact";

/** DEV-ONLY: /lab/contact/ and /lab/contact/fr/ (+ runway/, bar/: see lab/labSectionPage.tsx). */
export const dynamicParams = false;

export function generateStaticParams() {
  return LAB_PARAMS;
}

export default labSectionPage("contact", Contact);
