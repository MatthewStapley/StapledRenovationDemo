import { gsap } from "gsap";

/** Breakpoint, motion and pointer state for the current gsap.matchMedia run. */
export interface Conditions {
  desktop: boolean;
  mobile: boolean;
  motion: boolean;
  finePointer: boolean;
}

/** A section's setup may return a cleanup for anything GSAP doesn't own. */
export type Cleanup = (() => void) | void;

export const $ = <T extends Element = HTMLElement>(sel: string, scope: ParentNode = document) =>
  scope.querySelector<T>(sel);

export const $$ = <T extends Element = HTMLElement>(sel: string, scope: ParentNode = document) =>
  Array.from(scope.querySelectorAll<T>(sel));

export const barHeight = () => $("[data-demo-bar]")?.offsetHeight ?? 0;

export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Pointer tracking with automatic cleanup. `onMove` receives the pointer
 * position as -0.5..0.5 offsets from the centre of `area` (or the viewport).
 */
export function trackPointer(
  target: HTMLElement,
  onMove: (cx: number, cy: number, event: PointerEvent) => void,
  onLeave?: () => void,
  area: "element" | "viewport" = "element"
): () => void {
  const move = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    let nx: number;
    let ny: number;
    if (area === "viewport") {
      nx = event.clientX / window.innerWidth;
      ny = event.clientY / window.innerHeight;
    } else {
      const r = target.getBoundingClientRect();
      nx = (event.clientX - r.left) / r.width;
      ny = (event.clientY - r.top) / r.height;
    }
    onMove(nx - 0.5, ny - 0.5, event);
  };
  const leave = () => onLeave?.();
  target.addEventListener("pointermove", move);
  target.addEventListener("pointerleave", leave);
  return () => {
    target.removeEventListener("pointermove", move);
    target.removeEventListener("pointerleave", leave);
  };
}

/** Smoothly tween CSS custom properties (numbers with a unit) on an element. */
export function cssVarTo(el: HTMLElement, vars: Record<string, number>, unit = "", duration = 0.9) {
  const proxy: Record<string, number> = {};
  for (const key of Object.keys(vars)) {
    proxy[key] = parseFloat(getComputedStyle(el).getPropertyValue(key)) || 0;
  }
  return gsap.to(proxy, {
    ...vars,
    duration,
    ease: "power3.out",
    overwrite: true,
    onUpdate: () => {
      for (const key of Object.keys(vars)) el.style.setProperty(key, `${proxy[key]}${unit}`);
    },
  });
}
