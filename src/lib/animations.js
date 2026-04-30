import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * Run a GSAP timeline once on mount. Cleans up on unmount.
 * The factory receives a fresh timeline and the container ref's element.
 */
export function useGsapTimeline(factory, deps = []) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    if (typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      factory(tl, ref.current);
    }, ref);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}

/**
 * Stagger-reveal direct children of the ref'd element.
 * Used for grids and card rows.
 */
export function useStaggerReveal({
  selector = "> *",
  from = { y: 30, opacity: 0, scale: 0.95 },
  to = { y: 0, opacity: 1, scale: 1 },
  stagger = 0.06,
  duration = 0.7,
  ease = "back.out(1.4)",
  delay = 0,
} = {}) {
  return useGsapTimeline((tl, el) => {
    const children = el.querySelectorAll(selector);
    if (!children.length) return;
    tl.fromTo(children, from, { ...to, duration, ease, stagger, delay });
  });
}

/**
 * Magnetic hover — element follows the cursor within a small radius.
 * Useful on chunky CTA buttons.
 */
export function useMagnetic({ strength = 0.3 } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - (rect.left + rect.width / 2)) * strength;
      const y = (e.clientY - (rect.top + rect.height / 2)) * strength;
      gsap.to(el, { x, y, duration: 0.4, ease: "power2.out" });
    };

    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [strength]);

  return ref;
}
