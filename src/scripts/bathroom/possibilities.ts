// 01 The possibilities: letters rise in as the panel arrives, the dimension
// line draws while the stage holds, then the lines split apart (top line
// up, bottom line down) as the materials section scrolls in.
import { gsap } from "gsap";
import { $, $$, barHeight, cssVarTo, trackPointer, type Cleanup, type Conditions } from "./utils";

export function possibilities({ motion, desktop, finePointer }: Conditions): Cleanup {
  const sec = $("[data-poss]");
  const next = $("[data-mat]");
  if (!sec || !motion) return;

  const charsA = $$('[data-poss-line="a"] [data-poss-char]', sec);
  const charsB = $$('[data-poss-line="b"] [data-poss-char]', sec);
  const meta = $$("[data-poss-meta]", sec);
  const dim = $("[data-poss-dim]", sec);

  // Enter: scrubbed to the panel's rise, so the words arrive with it.
  gsap
    .timeline({
      scrollTrigger: {
        trigger: sec,
        start: "top 80%",
        end: () => `top ${barHeight() + 1}`,
        scrub: 0.8,
        invalidateOnRefresh: true,
      },
    })
    .fromTo(
      charsA,
      { yPercent: 118, rotate: 7 },
      { yPercent: 0, rotate: 0, ease: "power3.out", duration: 0.6, stagger: 0.035 },
      0
    )
    .fromTo(
      charsB,
      { yPercent: 118, rotate: 7 },
      { yPercent: 0, rotate: 0, ease: "power3.out", duration: 0.6, stagger: 0.035 },
      0.22
    )
    .fromTo(meta, { opacity: 0, y: 28 }, { opacity: 1, y: 0, ease: "power2.out", duration: 0.5, stagger: 0.2 }, 0.3);

  // Hold: the dimension line measures out under the type while it's read.
  if (dim) {
    gsap.fromTo(
      dim,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: sec,
          start: () => `top ${barHeight()}`,
          end: "bottom bottom",
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      }
    );
  }

  // Exit: the lines part as the next scene arrives.
  if (next) {
    gsap
      .timeline({
        scrollTrigger: { trigger: next, start: "top bottom", end: "top 30%", scrub: 0.8 },
      })
      .fromTo(charsA, { yPercent: 0 }, { yPercent: -118, ease: "power2.in", duration: 0.6, stagger: 0.03, immediateRender: false }, 0)
      .fromTo(
        charsB,
        { yPercent: 0 },
        { yPercent: 118, ease: "power2.in", duration: 0.6, stagger: { each: 0.03, from: "end" }, immediateRender: false },
        0.05
      )
      .fromTo(meta, { opacity: 1 }, { opacity: 0, duration: 0.4, immediateRender: false }, 0)
      .fromTo(dim, { opacity: 1 }, { opacity: 0, duration: 0.4, immediateRender: false }, 0);
  }

  // Cursor: the two lines drift against each other, like layered planes.
  if (desktop && finePointer) {
    return trackPointer(
      sec,
      (cx) => cssVarTo(sec, { "--mx": cx * 2 }),
      () => cssVarTo(sec, { "--mx": 0 }),
      "viewport"
    );
  }
}
