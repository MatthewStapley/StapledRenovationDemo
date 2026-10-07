// 03 The transformation: one scrubbed timeline across the sticky stage.
//   Measure  — the floor plan draws in, labels and first notes appear.
//   Plan     — the plan folds away; the traced elevation draws in.
//   Specify  — a scan line sweeps across, wiping the photograph in.
//   Finish   — the drawing fades; the finished room settles.
import { gsap } from "gsap";
import { $, $$, barHeight, trackPointer, type Cleanup, type Conditions } from "./utils";

export function transformation({ motion, desktop, finePointer }: Conditions): Cleanup {
  const sec = $("[data-tf]");
  if (!sec || !motion) return;

  const stage = $("[data-tf-stage]", sec)!;
  const paper = $("[data-tf-paper]", sec)!;
  const photo = $("[data-tf-photo]", sec)!;
  const img = $("[data-tf-img]", sec)!;
  const scan = $("[data-tf-scan]", sec)!;
  const plan = $<SVGSVGElement>("[data-tf-plan]", sec)!;
  const elev = $<SVGSVGElement>("[data-tf-elev]", sec)!;
  const planDraws = $$<SVGElement>("[data-draw]", plan);
  const elevDraws = $$<SVGElement>("[data-draw]", elev);
  const labels = $("[data-tf-labels]", sec);
  const steps = $$("[data-tf-step]", sec);
  const progress = $("[data-tf-progress]", sec);
  const callouts = (at: number) => $$(`[data-tf-callout="${at}"]`, sec);

  // Drafting state before the scene starts.
  gsap.set([...planDraws, ...elevDraws], { strokeDasharray: 1, strokeDashoffset: 1 });
  gsap.set(plan, { opacity: 1, transformOrigin: "50% 100%" });
  gsap.set(elev, { opacity: 1, color: "#2a2622", mixBlendMode: "normal" });
  gsap.set(labels, { opacity: 0 });
  gsap.set(photo, { clipPath: "inset(0% 100% 0% 0%)" });
  gsap.set(img, { scale: 1.08 });
  gsap.set($$("[data-tf-callout]", sec), { opacity: 0, y: 10 });

  let activeStep = -1;
  const setStep = (p: number) => {
    const step = p < 0.27 ? 0 : p < 0.58 ? 1 : p < 0.8 ? 2 : 3;
    if (step === activeStep) return;
    activeStep = step;
    steps.forEach((el, i) => {
      if (i === step) el.setAttribute("aria-current", "step");
      else el.removeAttribute("aria-current");
    });
  };
  setStep(0);

  const calloutIn = { opacity: 1, y: 0, duration: 0.35, stagger: 0.25, ease: "power2.out" };
  const calloutOut = { opacity: 0, y: -8, duration: 0.3, ease: "power2.in" };

  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: sec,
      start: () => `top ${barHeight()}`,
      end: "bottom bottom",
      scrub: 0.7,
      invalidateOnRefresh: true,
      onUpdate: (self) => setStep(self.progress),
    },
  });

  tl
    // 01 Measure
    .to(planDraws, { strokeDashoffset: 0, duration: 1.4, stagger: 0.1, ease: "power1.inOut" }, 0)
    .to(labels, { opacity: 1, duration: 0.5 }, 1.5)
    .to(callouts(0), calloutIn, 1.4)
    // 02 Plan: fold the plan down, draw the elevation up.
    .to(callouts(0), calloutOut, 2.7)
    .to(plan, { opacity: 0, scaleY: 0.35, y: 60, duration: 0.8, ease: "power2.in" }, 2.8)
    .to(elevDraws, { strokeDashoffset: 0, duration: 1.4, stagger: 0.06, ease: "power1.inOut" }, 3.1)
    .to(callouts(1), calloutIn, 4.3)
    .to(callouts(1), calloutOut, 5.9)
    // 03 Specify: scan line wipes the photograph in behind the drawing.
    .set(elev, { mixBlendMode: "screen" }, 6.1)
    .to(elev, { color: "#fffaf2", duration: 0.4 }, 6.1)
    .set(scan, { opacity: 1 }, 6.2)
    .fromTo(scan, { left: "0%" }, { left: "100%", duration: 2, ease: "power1.inOut" }, 6.2)
    .to(photo, { clipPath: "inset(0% 0% 0% 0%)", duration: 2, ease: "power1.inOut" }, 6.2)
    .to(paper, { opacity: 0, duration: 2 }, 6.2)
    .to(img, { scale: 1, duration: 3.4, ease: "power1.out" }, 6.2)
    .to(callouts(2), calloutIn, 7.2)
    .set(scan, { opacity: 0 }, 8.2)
    // 04 Finish: the drawing lifts away, leaving the room.
    .to(elev, { opacity: 0, duration: 1 }, 8.3)
    .to(callouts(3), calloutIn, 8.7)
    // Short hold at the end so the finished room can be read.
    .to({}, { duration: 0.9 }, 9.6);

  if (progress) {
    tl.fromTo(progress, { scaleX: 0 }, { scaleX: 1, duration: tl.duration(), ease: "none" }, 0);
  }

  // Cursor: drawing layers sit slightly in front of the photo. (The plan's
  // y is owned by the timeline, so the drawings only move horizontally.)
  if (desktop && finePointer) {
    const layers = [plan, elev].map((el) => gsap.quickTo(el, "x", { duration: 0.8, ease: "power3.out" }));
    const imgX = gsap.quickTo(img, "x", { duration: 1, ease: "power3.out" });
    const imgY = gsap.quickTo(img, "y", { duration: 1, ease: "power3.out" });
    return trackPointer(
      stage,
      (cx, cy) => {
        layers.forEach((x) => x(cx * 16));
        imgX(cx * -10);
        imgY(cy * -8);
      },
      () => {
        layers.forEach((x) => x(0));
        imgX(0);
        imgY(0);
      }
    );
  }
}
