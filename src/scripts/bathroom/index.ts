// FORM Bathrooms page orchestration.
//
// Every section's motion is created inside one gsap.matchMedia() run, in
// page order, so ScrollTrigger measures later sections after the hero pin's
// spacer exists. When the breakpoint, motion preference or pointer type
// changes, GSAP reverts all of it and each section's returned cleanup
// removes its own listeners. Interactions that must work with or without
// motion (materials selection, lightbox, enquiry dialog) are set up once.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { $, $$, type Conditions } from "./utils";
import { hero } from "./hero";
import { possibilities } from "./possibilities";
import { initMaterialControls, materials } from "./materials";
import { transformation } from "./transformation";
import { details } from "./details";
import { gallery, initLightbox } from "./gallery";
import { invitation } from "./invitation";

gsap.registerPlugin(ScrollTrigger);

function initEnquiryDialog() {
  const dialog = $<HTMLDialogElement>("[data-enquiry-dialog]");
  if (!dialog) return;
  $$("[data-enquiry-open]").forEach((button) => button.addEventListener("click", () => dialog.showModal()));
  // Clicking the backdrop (the dialog element itself) closes it.
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
}

export function initBathroom() {
  initEnquiryDialog();
  initMaterialControls();
  initLightbox();

  const mm = gsap.matchMedia();
  mm.add(
    {
      desktop: "(min-width: 900px)",
      mobile: "(max-width: 899px)",
      motion: "(prefers-reduced-motion: no-preference)",
      finePointer: "(hover: hover) and (pointer: fine)",
    },
    (context) => {
      const conditions = context.conditions as unknown as Conditions;
      const cleanups = [hero, possibilities, materials, transformation, details, gallery, invitation].map((setup) =>
        setup(conditions)
      );
      return () => cleanups.forEach((fn) => fn?.());
    }
  );

  // Web fonts change text heights; re-measure once they're in.
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}
