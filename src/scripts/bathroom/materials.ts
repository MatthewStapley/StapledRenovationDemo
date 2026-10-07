// 02 Materials. Selection works everywhere (mouse, touch, keyboard) and is
// set up once; motion (entrance, tilt) is set up per matchMedia run.
import { gsap } from "gsap";
import { $, $$, prefersReducedMotion, trackPointer, type Cleanup, type Conditions } from "./utils";

interface StyleData {
  id: string;
  name: string;
  tagline: string;
  tint: string;
  palette: { name: string; hex: string }[];
}

export function initMaterialControls() {
  const sec = $("[data-mat]");
  const group = $("[data-mat-group]");
  const data = $("[data-mat-data]");
  if (!sec || !group || !data) return;

  const styles: StyleData[] = JSON.parse(data.textContent || "[]");
  const chips = $$<HTMLButtonElement>("[data-mat-chip]", group);
  const imgs = $$<HTMLImageElement>("[data-mat-img]", sec);
  const texts = $$("[data-mat-text]", sec);
  const credits = $$("[data-mat-credit]", sec);
  const swatchChips = $$("[data-swatch-chip]", sec);
  const swatchNames = $$("[data-swatch-name]", sec);
  const live = $("[data-mat-live]", sec);
  let current = 0;

  const select = (index: number, moveFocus = false) => {
    if (index === current) {
      if (moveFocus) chips[index].focus();
      return;
    }
    const prev = current;
    current = index;
    const style = styles[index];
    const reduce = prefersReducedMotion();

    chips.forEach((chip, i) => {
      chip.setAttribute("aria-checked", String(i === index));
      chip.tabIndex = i === index ? 0 : -1;
    });
    if (moveFocus) chips[index].focus();

    // Photograph: incoming image wipes up over the current one.
    const incoming = imgs[index];
    const outgoing = imgs[prev];
    gsap.killTweensOf([incoming, outgoing]);
    imgs.forEach((img, i) => {
      img.setAttribute("aria-hidden", String(i !== index));
      if (i !== index && i !== prev) gsap.set(img, { zIndex: 0, visibility: "hidden" });
    });
    gsap.set(outgoing, { zIndex: 1 });
    gsap.set(incoming, { zIndex: 2, visibility: "visible" });
    if (reduce) {
      gsap.set(incoming, { clipPath: "none", scale: 1 });
      gsap.set(outgoing, { visibility: "hidden" });
    } else {
      gsap.fromTo(
        incoming,
        { clipPath: "inset(100% 0% 0% 0%)", scale: 1.14 },
        { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 1.2, ease: "expo.inOut" }
      );
      gsap.fromTo(
        outgoing,
        { scale: 1 },
        {
          scale: 1.06,
          duration: 1.2,
          ease: "expo.inOut",
          onComplete: () => gsap.set(outgoing, { visibility: "hidden", scale: 1 }),
        }
      );
    }
    incoming.removeAttribute("aria-hidden");

    // Copy: old lines lift out of their masks, new lines rise in.
    const oldText = texts[prev];
    const newText = texts[index];
    const oldLines = $$(":scope > * > span", oldText);
    const newLines = $$(":scope > * > span", newText);
    gsap.killTweensOf([...oldLines, ...newLines]);
    newText.hidden = false;
    newText.removeAttribute("aria-hidden");
    oldText.setAttribute("aria-hidden", "true");
    if (reduce) {
      oldText.hidden = true;
      gsap.set([...oldLines, ...newLines], { clearProps: "all" });
    } else {
      gsap.set(newLines, { yPercent: 110, opacity: 0 });
      gsap.to(oldLines, {
        yPercent: -110,
        opacity: 0,
        duration: 0.45,
        stagger: 0.05,
        ease: "power2.in",
        onComplete: () => {
          oldText.hidden = true;
          gsap.set(oldLines, { clearProps: "all" });
        },
      });
      gsap.to(newLines, { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.07, ease: "expo.out", delay: 0.35 });
    }

    // Palette, tint and credit.
    style.palette.forEach((swatch, i) => {
      if (reduce) {
        gsap.set(swatchChips[i], { backgroundColor: swatch.hex });
        swatchNames[i].textContent = swatch.name;
      } else {
        gsap.to(swatchChips[i], {
          backgroundColor: swatch.hex,
          duration: 0.8,
          delay: 0.1 + i * 0.07,
          ease: "power2.inOut",
        });
        gsap.to(swatchNames[i], {
          opacity: 0,
          y: -6,
          duration: 0.2,
          delay: i * 0.07,
          onComplete: () => {
            swatchNames[i].textContent = swatch.name;
            gsap.fromTo(swatchNames[i], { y: 6 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" });
          },
        });
      }
    });
    gsap.to(sec, { backgroundColor: style.tint, duration: reduce ? 0 : 1.2, ease: "power2.inOut" });
    credits.forEach((c, i) => (c.hidden = i !== index));
    if (live) live.textContent = `${style.name} selected. ${style.tagline}`;
  };

  chips.forEach((chip, i) => chip.addEventListener("click", () => select(i)));

  // Radio-group keyboard pattern: arrows move and select, Home/End jump.
  group.addEventListener("keydown", (event) => {
    const last = chips.length - 1;
    const map: Record<string, number> = {
      ArrowRight: current === last ? 0 : current + 1,
      ArrowDown: current === last ? 0 : current + 1,
      ArrowLeft: current === 0 ? last : current - 1,
      ArrowUp: current === 0 ? last : current - 1,
      Home: 0,
      End: last,
    };
    if (event.key in map) {
      event.preventDefault();
      select(map[event.key], true);
    }
  });
}

export function materials({ motion, desktop, finePointer }: Conditions): Cleanup {
  const sec = $("[data-mat]");
  if (!sec || !motion) return;

  const chips = $$("[data-mat-chip]", sec);
  const frame = $("[data-mat-frame]", sec);

  // Entrance: heading rises, samples are dealt from a stack, photo opens.
  gsap
    .timeline({
      defaults: { ease: "expo.out" },
      scrollTrigger: { trigger: sec, start: "top 65%", toggleActions: "play none none none" },
    })
    .fromTo($$("[data-mat-line]", sec), { yPercent: 110 }, { yPercent: 0, duration: 1.3, stagger: 0.1 }, 0)
    .fromTo($$("[data-mat-reveal]", sec), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, stagger: 0.12 }, 0.2)
    .fromTo(frame, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "expo.inOut" }, 0.05);

  gsap.fromTo(
    chips,
    {
      x: (i) => (1 - i) * 90,
      y: 70,
      rotate: (i) => (i - 1) * 9,
      opacity: 0,
    },
    {
      x: 0,
      y: 0,
      rotate: 0,
      opacity: 1,
      duration: 1.3,
      ease: "expo.out",
      stagger: 0.09,
      scrollTrigger: { trigger: $("[data-mat-group]", sec), start: "top 85%", toggleActions: "play none none none" },
    }
  );

  // Tactile tilt + sheen on each sample (desktop mouse only).
  if (desktop && finePointer) {
    const cleanups = chips.map((chip) => {
      const body = $("[data-chip-body]", chip)!;
      gsap.set(body, { transformPerspective: 700 });
      const rx = gsap.quickTo(body, "rotationX", { duration: 0.6, ease: "power3.out" });
      const ry = gsap.quickTo(body, "rotationY", { duration: 0.6, ease: "power3.out" });
      return trackPointer(
        chip,
        (cx, cy) => {
          rx(cy * -14);
          ry(cx * 16);
          body.style.setProperty("--sx", `${(cx + 0.5) * 100}%`);
          body.style.setProperty("--sy", `${(cy + 0.5) * 100}%`);
        },
        () => {
          rx(0);
          ry(0);
        }
      );
    });
    return () => cleanups.forEach((fn) => fn());
  }
}
