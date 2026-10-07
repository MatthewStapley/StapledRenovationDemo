// 06 The final invitation: the drafted frame draws itself, the message
// settles in, and a warm light follows the cursor across the charcoal.
import { gsap } from "gsap";
import { $, $$, cssVarTo, trackPointer, type Cleanup, type Conditions } from "./utils";

export function invitation({ motion, desktop, finePointer }: Conditions): Cleanup {
  const sec = $("[data-inv]");
  if (!sec || !motion) return;

  const edges = $$("[data-inv-edge]", sec);
  gsap
    .timeline({
      defaults: { ease: "expo.out" },
      scrollTrigger: { trigger: $(".fb-inv__inner", sec), start: "top 70%", toggleActions: "play none none none" },
    })
    .fromTo(
      edges,
      { scaleX: (_, el: HTMLElement) => (el.dataset.invEdge === "x" ? 0 : 1), scaleY: (_, el: HTMLElement) => (el.dataset.invEdge === "y" ? 0 : 1) },
      { scaleX: 1, scaleY: 1, duration: 0.9, stagger: 0.35, ease: "power2.inOut" },
      0
    )
    .fromTo($$("[data-inv-line]", sec), { yPercent: 110 }, { yPercent: 0, duration: 1.4, stagger: 0.12 }, 0.35)
    .fromTo($$("[data-inv-fade]", sec), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.12 }, 0.6);

  if (desktop && finePointer) {
    return trackPointer(sec, (cx, cy) => cssVarTo(sec, { "--lx": (cx + 0.5) * 100, "--ly": (cy + 0.5) * 100 }, "%", 1.4));
  }
}
