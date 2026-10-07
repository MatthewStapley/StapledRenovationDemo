// 04 The finishing details: each image mask opens from its own direction,
// then its text card slides into position over the edge. Images drift at
// different scroll speeds and lean away from the cursor for depth.
import { gsap } from "gsap";
import { $, $$, trackPointer, type Cleanup, type Conditions } from "./utils";

const closedMask: Record<string, string> = {
  up: "inset(100% 0% 0% 0%)",
  right: "inset(0% 100% 0% 0%)",
  centre: "inset(50% 50% 50% 50%)",
};

export function details({ motion, desktop, finePointer }: Conditions): Cleanup {
  const sec = $("[data-det]");
  if (!sec || !motion) return;

  const head = $(".fb-det__head", sec);
  gsap
    .timeline({ defaults: { ease: "expo.out" }, scrollTrigger: { trigger: head, start: "top 75%", toggleActions: "play none none none" } })
    .fromTo($$("[data-det-line]", sec), { yPercent: 110 }, { yPercent: 0, duration: 1.3, stagger: 0.1 }, 0)
    .fromTo($$("[data-det-fade]", sec), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1, stagger: 0.12 }, 0.15);

  const items = $$("[data-det-item]", sec);
  items.forEach((item, i) => {
    const mask = $("[data-det-mask]", item)!;
    const img = $("[data-det-img]", item)!;
    const card = $("[data-det-card]", item)!;
    const dir = item.dataset.dir ?? "up";
    const fromSide = desktop ? (i === 1 ? -1 : 1) : i % 2 === 0 ? 1 : -1;

    gsap
      .timeline({ scrollTrigger: { trigger: item, start: desktop ? "top 72%" : "top 82%", toggleActions: "play none none none" } })
      .fromTo(
        mask,
        { clipPath: closedMask[dir] },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.inOut" },
        0
      )
      .fromTo(img, { scale: 1.3 }, { scale: 1, duration: 2, ease: "expo.out" }, 0.1)
      .fromTo(
        card,
        { x: 70 * fromSide, y: 40, rotate: 2.5 * fromSide, opacity: 0 },
        { x: 0, y: 0, rotate: 0, opacity: 1, duration: 1.2, ease: "expo.out" },
        0.75
      );
  });

  // Each image drifts at its own speed while the section scrolls past.
  const drifts = $$("[data-det-drift]", sec);
  drifts.forEach((drift) => {
    const depth = Number(drift.dataset.depth ?? 1);
    gsap.fromTo(
      drift,
      { yPercent: -5 * depth },
      {
        yPercent: 5 * depth,
        ease: "none",
        scrollTrigger: { trigger: drift.parentElement, start: "top bottom", end: "bottom top", scrub: 0.6 },
      }
    );
  });

  // Cursor: images lean away from the pointer by their depth.
  if (desktop && finePointer) {
    const movers = drifts.map((drift) => ({
      depth: Number(drift.dataset.depth ?? 1),
      x: gsap.quickTo(drift, "x", { duration: 1.1, ease: "power3.out" }),
      y: gsap.quickTo(drift, "y", { duration: 1.1, ease: "power3.out" }),
    }));
    return trackPointer(
      sec,
      (cx, cy) => movers.forEach((m) => (m.x(cx * -28 * m.depth), m.y(cy * -18 * m.depth))),
      () => movers.forEach((m) => (m.x(0), m.y(0))),
      "viewport"
    );
  }
}
