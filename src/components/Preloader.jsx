import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

/**
 * Full-screen preloader with a GSAP intro and exit.
 *
 * Lifecycle:
 *   1. Plays an intro timeline (~1.6s) on mount — letter stagger, dot bounce, bar fill.
 *   2. Once `ready` is true AND the intro has finished, plays an exit timeline.
 *   3. On exit complete, calls `onDone` which removes the component from the tree.
 *
 * `ready` is set by the parent when it has finished its own boot work.
 * If the parent boots faster than the intro (likely), the preloader still
 * shows for the minimum duration so it doesn't flash.
 */
export default function Preloader({ ready = true, onDone }) {
  const root = useRef(null);
  const word = useRef(null);
  const bar = useRef(null);
  const dots = useRef(null);
  const [introDone, setIntroDone] = useState(false);

  // INTRO timeline
  useEffect(() => {
    if (!root.current) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setIntroDone(true);
      return;
    }

    const ctx = gsap.context(() => {
      const letters = word.current.querySelectorAll(".letter");

      const tl = gsap.timeline({ onComplete: () => setIntroDone(true) });

      tl.from(letters, {
        y: 60,
        opacity: 0,
        rotate: -8,
        duration: 0.65,
        stagger: 0.06,
        ease: "back.out(1.7)",
      })
        .from(
          ".pre-sub",
          { y: 12, opacity: 0, duration: 0.5, ease: "power2.out" },
          "-=0.3"
        )
        .from(
          dots.current.children,
          {
            scale: 0,
            stagger: 0.08,
            duration: 0.4,
            ease: "back.out(2)",
          },
          "-=0.3"
        )
        .fromTo(
          bar.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 1.0, ease: "power2.inOut" },
          "-=0.4"
        );

      // Continuous dot bounce after intro
      gsap.to(dots.current.children, {
        y: -8,
        duration: 0.45,
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.12, repeat: -1, yoyo: true },
        ease: "power1.inOut",
      });
    }, root);

    return () => ctx.revert();
  }, []);

  // EXIT — wait for both ready + introDone
  useEffect(() => {
    if (!ready || !introDone || !root.current) return;

    const ctx = gsap.context(() => {
      gsap.to(".pre-content", {
        y: -40,
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
      });
      gsap.to(root.current, {
        opacity: 0,
        duration: 0.6,
        delay: 0.25,
        ease: "power2.inOut",
        onComplete: () => onDone?.(),
      });
      // Cream curtain pulls up
      gsap.to(".pre-curtain", {
        yPercent: -100,
        duration: 0.9,
        delay: 0.3,
        ease: "power3.inOut",
      });
    }, root);

    return () => ctx.revert();
  }, [ready, introDone, onDone]);

  const word1 = "KLP48".split("");
  const word2 = "Sorter".split("");

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-kawaii overflow-hidden font-sans"
      aria-hidden="true"
    >
      {/* Sliding cream curtain layer (covers content as it pulls up on exit) */}
      <div className="pre-curtain absolute inset-0 bg-cream-deep pointer-events-none" />

      {/* Soft blobs */}
      <div className="absolute -top-32 -left-20 w-[28rem] h-[28rem] bg-sakura-200/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-24 w-[24rem] h-[24rem] bg-emerald-300/50 rounded-full blur-3xl pointer-events-none" />

      <div className="pre-content relative z-10 flex flex-col items-center gap-6 px-6 text-center">

        {/* Sparkle accent */}
        <div className="font-script text-2xl text-sakura-600">welcome ♡</div>

        {/* Word with per-letter spans */}
        <h1
          ref={word}
          className="font-kawaii font-bold leading-[0.9] tracking-tight"
          aria-label="KLP48 Sorter"
        >
          <span className="block text-5xl sm:text-7xl text-emerald-600 drop-shadow-[3px_3px_0_#be185d]">
            {word1.map((ch, i) => (
              <span key={`w1-${i}`} className="letter inline-block">
                {ch}
              </span>
            ))}
          </span>
          <span className="block text-4xl sm:text-6xl text-sakura-500 squiggle-underline mt-1">
            {word2.map((ch, i) => (
              <span key={`w2-${i}`} className="letter inline-block">
                {ch}
              </span>
            ))}
          </span>
        </h1>

        <p className="pre-sub font-script text-lg text-ink/60">
          loading your oshi…
        </p>

        {/* Bouncing dots */}
        <div ref={dots} className="flex gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
          <span className="w-3 h-3 rounded-full bg-sakura-400 inline-block" />
          <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
        </div>

        {/* Bar that fills */}
        <div className="sticker bg-white p-1 rounded-full w-56 sm:w-72">
          <div className="bg-cream-deep rounded-full h-2 overflow-hidden">
            <div
              ref={bar}
              className="h-2 bg-gradient-to-r from-emerald-400 to-sakura-400 origin-left"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
