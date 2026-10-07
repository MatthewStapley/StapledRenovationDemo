// 05 Gallery: the stacked deck fans out into the grid as it scrolls into
// view; cards tilt toward the cursor; a native-<dialog> lightbox handles
// viewing (focus trap + return, Esc, arrow keys, swipe).
import { gsap } from "gsap";
import { $, $$, prefersReducedMotion, trackPointer, type Cleanup, type Conditions } from "./utils";

interface GalleryData {
  full: { src: string; srcset: string };
  alt: string;
  caption: string;
  credit: { name: string; href: string };
}

const deckAngles = [-9, 6, -3, 11, -7, 4, -12, 8];

export function initLightbox() {
  const sec = $("[data-gal]");
  const dialog = $<HTMLDialogElement>("[data-lightbox]");
  const data = $("[data-gal-data]");
  if (!sec || !dialog || !data) return;

  const items: GalleryData[] = JSON.parse(data.textContent || "[]");
  const cards = $$<HTMLButtonElement>("[data-gal-card]", sec);
  const img = $<HTMLImageElement>("[data-lb-img]", dialog)!;
  const frame = $("[data-lb-frame]", dialog)!;
  const count = $("[data-lb-count]", dialog)!;
  const title = $("[data-lb-title]", dialog)!;
  const credit = $<HTMLAnchorElement>("[data-lb-credit]", dialog)!;
  let index = 0;
  let opener: HTMLElement | null = null;

  const preload = (i: number) => {
    const pre = new Image();
    const { src, srcset } = items[(i + items.length) % items.length].full;
    pre.sizes = "100vw";
    pre.srcset = srcset;
    pre.src = src;
  };

  const render = (i: number, direction = 0) => {
    index = (i + items.length) % items.length;
    const item = items[index];
    const apply = () => {
      img.srcset = item.full.srcset;
      img.src = item.full.src;
      img.alt = item.alt;
      count.textContent = `${index + 1} / ${items.length}`;
      title.textContent = item.caption;
      credit.textContent = `${item.credit.name} / Unsplash`;
      credit.href = item.credit.href;
    };

    if (prefersReducedMotion() || direction === 0) {
      apply();
      if (!prefersReducedMotion()) {
        gsap.fromTo(img, { opacity: 0, scale: 0.97 }, { opacity: 1, scale: 1, duration: 0.6, ease: "power3.out" });
      }
    } else {
      gsap.to(img, {
        opacity: 0,
        x: -40 * direction,
        duration: 0.22,
        ease: "power2.in",
        onComplete: () => {
          apply();
          const show = () =>
            gsap.fromTo(img, { x: 40 * direction, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: "power3.out" });
          if (img.complete) show();
          else img.addEventListener("load", show, { once: true });
        },
      });
    }
    preload(index + 1);
    preload(index - 1);
  };

  cards.forEach((card, i) =>
    card.addEventListener("click", () => {
      opener = card;
      render(i);
      dialog.showModal();
    })
  );

  $("[data-lb-prev]", dialog)!.addEventListener("click", () => render(index - 1, -1));
  $("[data-lb-next]", dialog)!.addEventListener("click", () => render(index + 1, 1));
  $("[data-lb-close]", dialog)!.addEventListener("click", () => dialog.close());

  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      render(index + 1, 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      render(index - 1, -1);
    }
  });

  // Click outside the photo and controls closes.
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog || event.target === frame) dialog.close();
  });

  dialog.addEventListener("close", () => opener?.focus());

  // Swipe between photos on touch screens.
  let startX = 0;
  frame.addEventListener("pointerdown", (event) => (startX = event.clientX));
  frame.addEventListener("pointerup", (event) => {
    const dx = event.clientX - startX;
    if (event.pointerType !== "mouse" && Math.abs(dx) > 50) render(index + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
  });
}

export function gallery({ motion, desktop, finePointer }: Conditions): Cleanup {
  const sec = $("[data-gal]");
  const grid = $("[data-gal-grid]");
  if (!sec || !grid || !motion) return;

  gsap.fromTo(
    $$("[data-gal-line]", sec),
    { yPercent: 110 },
    {
      yPercent: 0,
      duration: 1.3,
      stagger: 0.1,
      ease: "expo.out",
      scrollTrigger: { trigger: sec, start: "top 70%", toggleActions: "play none none none" },
    }
  );

  // Fan: every card starts at the grid's centre as one loose stack.
  const cards = $$("[data-gal-card]", grid);
  const spread = desktop ? 1 : 0.6;
  gsap.fromTo(
    cards,
    {
      x: (_, el: HTMLElement) => grid.clientWidth / 2 - (el.offsetLeft + el.offsetWidth / 2),
      y: (_, el: HTMLElement) => grid.clientHeight / 2 - (el.offsetTop + el.offsetHeight / 2),
      rotate: (i) => deckAngles[i % deckAngles.length] * spread,
      scale: 0.86,
    },
    {
      x: 0,
      y: 0,
      rotate: 0,
      scale: 1,
      ease: "power2.inOut",
      stagger: { each: 0.04, from: "end" },
      scrollTrigger: {
        trigger: grid,
        start: desktop ? "top 92%" : "top 95%",
        end: desktop ? "top 22%" : "top 35%",
        scrub: 0.8,
        invalidateOnRefresh: true,
      },
    }
  );

  // Cards tilt toward the cursor (desktop mouse only).
  if (desktop && finePointer) {
    const cleanups = cards.map((card) => {
      const tilt = $("[data-gal-tilt]", card)!;
      gsap.set(tilt, { transformPerspective: 800 });
      const rx = gsap.quickTo(tilt, "rotationX", { duration: 0.6, ease: "power3.out" });
      const ry = gsap.quickTo(tilt, "rotationY", { duration: 0.6, ease: "power3.out" });
      return trackPointer(
        card,
        (cx, cy) => (rx(cy * -10), ry(cx * 12)),
        () => (rx(0), ry(0))
      );
    });
    return () => cleanups.forEach((fn) => fn());
  }
}
