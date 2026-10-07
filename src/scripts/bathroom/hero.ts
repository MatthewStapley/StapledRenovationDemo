// Hero motion (unchanged from stage 1): intro, desktop pin with the photo
// opening to full-bleed, mobile widen, cursor light and depth.
import { gsap } from "gsap";
import { $, $$, barHeight, type Cleanup, type Conditions } from "./utils";

export function hero({ desktop, mobile, motion, finePointer }: Conditions): Cleanup {
  const root = document.documentElement;
  const main = $("[data-fb]");
  const hero = $("[data-hero]");
  if (!main || !hero) return;

  root.classList.add("fb-ready");
  if (!motion) return;

  const media = $("[data-hero-media]", hero)!;
  const frame = $("[data-hero-frame]", hero)!;
  const depth = $("[data-hero-depth]", hero)!;
  const scale = $("[data-hero-scale]", hero)!;
  const scrim = $("[data-hero-scrim]", hero)!;
  const veil = $("[data-hero-veil]", hero)!;
  const outGroups = $$("[data-hero-out]", hero);
  const inItems = $$("[data-hero-in]", hero);

  // Frame rect relative to the hero, as a clip-path inset string.
  const frameInset = () => {
    const h = hero.getBoundingClientRect();
    const f = frame.getBoundingClientRect();
    return `inset(${f.top - h.top}px ${h.right - f.right}px ${h.bottom - f.bottom}px ${f.left - h.left}px)`;
  };

  // Intro: masked headline lines rise, the photo's veil lifts.
  gsap
    .timeline({ defaults: { ease: "expo.out" } })
    .set(veil, { scaleY: 1 })
    .fromTo(inItems, { yPercent: 105, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.4, stagger: 0.07 }, 0.1)
    .to(veil, { scaleY: 0, duration: 1.6, ease: "expo.inOut" }, 0)
    .fromTo(scale, { scale: 1.2 }, { scale: 1.14, duration: 2.2, ease: "power3.out" }, 0);

  const cleanups: (() => void)[] = [];

  // Desktop: pin, open the frame to full-bleed, lift the copy out.
  if (desktop) {
    main.classList.add("is-pinned");
    cleanups.push(() => main.classList.remove("is-pinned"));

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: hero,
        start: () => `top ${barHeight()}`,
        end: () => `+=${window.innerHeight * 1.6}`,
        pin: true,
        scrub: 1.1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    tl.fromTo(
      media,
      { clipPath: frameInset },
      { clipPath: "inset(0px 0px 0px 0px)", duration: 0.6, ease: "power2.inOut", immediateRender: false },
      0
    )
      // Same duration and ease as the clip, so the photo's left edge never
      // overtakes the opening frame.
      .fromTo(hero, { "--pan": "27%" }, { "--pan": "0%", duration: 0.6, ease: "power2.inOut", immediateRender: false }, 0)
      .fromTo(scale, { scale: 1.14 }, { scale: 1.04, duration: 1, ease: "power1.out", immediateRender: false }, 0)
      .to(
        outGroups,
        { y: () => -window.innerHeight * 0.55, opacity: 0, duration: 0.34, stagger: 0.03, ease: "sine.inOut" },
        0.02
      )
      .to(scrim, { opacity: 1, duration: 0.4 }, 0.6);

  }

  // Mobile: no pin. The photo widens to the screen edges as it scrolls in.
  if (mobile) {
    const gutter = () => parseFloat(getComputedStyle(main).getPropertyValue("--fb-gutter")) || 20;
    gsap.fromTo(
      media,
      { clipPath: () => `inset(0px ${gutter()}px 0px ${gutter()}px)` },
      {
        clipPath: "inset(0px 0px 0px 0px)",
        ease: "none",
        immediateRender: false,
        scrollTrigger: { trigger: media, start: "top 85%", end: "center 50%", scrub: 0.8, invalidateOnRefresh: true },
      }
    );
    gsap.fromTo(
      scale,
      { scale: 1.14 },
      {
        scale: 1.02,
        ease: "none",
        immediateRender: false,
        scrollTrigger: { trigger: media, start: "top bottom", end: "bottom top", scrub: 0.8 },
      }
    );
  }

  // Cursor light and depth (desktop, fine pointer only).
  if (desktop && finePointer) {
    gsap.set(depth, { transformPerspective: 1400 });
    const ease = { duration: 1.1, ease: "power3.out" };
    const moveX = gsap.quickTo(depth, "x", ease);
    const moveY = gsap.quickTo(depth, "y", ease);
    const tiltX = gsap.quickTo(depth, "rotationX", ease);
    const tiltY = gsap.quickTo(depth, "rotationY", ease);
    const light = { x: 70, y: 40 };
    const lightTo = (x: number, y: number) =>
      gsap.to(light, {
        x,
        y,
        duration: 0.9,
        ease: "power3.out",
        overwrite: true,
        onUpdate: () => {
          hero.style.setProperty("--lx", `${light.x}%`);
          hero.style.setProperty("--ly", `${light.y}%`);
        },
      });

    const onMove = (event: PointerEvent) => {
      const rect = hero.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / rect.width;
      const ny = (event.clientY - rect.top) / rect.height;
      const cx = nx - 0.5;
      const cy = ny - 0.5;
      moveX(cx * -18);
      moveY(cy * -12);
      tiltY(cx * 2.2);
      tiltX(cy * -1.6);
      lightTo(nx * 100, ny * 100);
      hero.classList.add("is-lit");
    };
    const onLeave = () => {
      moveX(0);
      moveY(0);
      tiltX(0);
      tiltY(0);
      hero.classList.remove("is-lit");
    };

    hero.addEventListener("pointermove", onMove);
    hero.addEventListener("pointerleave", onLeave);
    cleanups.push(() => {
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
      hero.classList.remove("is-lit");
    });
  }

  return () => cleanups.forEach((fn) => fn());
}
