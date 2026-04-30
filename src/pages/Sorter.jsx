import { useNavigate } from "react-router-dom";
import { useEffect, useReducer, useState, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { gsap } from "gsap";
import { useRankStore } from "../store/useRankStore";
import { init, reducer } from "../lib/mergeSortMachine";
import { useMagnetic } from "../lib/animations";

import { ArrowLeft, RotateCcw, Undo2, Info } from "lucide-react";
import SplitTitle from "../components/SplitTitle";
import ProfileModal from "../components/ProfileModal";

const IMAGE_FALLBACK = "https://placehold.co/400x600?text=KLP48";

export default function Sorter() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { members, setRanking } = useRankStore();

  useEffect(() => {
    if (!members || members.length < 2) {
      navigate("/");
    }
  }, [members, navigate]);

  const [state, dispatch] = useReducer(reducer, members, init);
  const [selectedProfile, setSelectedProfile] = useState(null);

  const restart = useCallback(() => {
    dispatch({ type: "RESET", members });
  }, [members]);

  useEffect(() => {
    if (state.done && state.ranking) {
      setRanking(state.ranking);
      navigate("/results");
    }
  }, [state.done, state.ranking, setRanking, navigate]);

  const equalRef = useMagnetic({ strength: 0.25 });
  const stageRef = useRef(null);
  const [showHotkeys, setShowHotkeys] = useState(false);

  /* ---------- KEYBOARD SHORTCUTS ----------
     ← / A           pick left
     → / D           pick right
     Space / =       tie
     Z / Backspace   undo
     R               restart
     ?               toggle hotkey overlay                                  */
  useEffect(() => {
    const onKey = (e) => {
      // Don't intercept while user is typing in an input/select.
      const target = e.target;
      if (target instanceof HTMLElement) {
        const tag = target.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable) return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      switch (e.key) {
        case "ArrowLeft":
        case "a":
        case "A":
          e.preventDefault();
          dispatch({ type: "PICK_LEFT" });
          break;
        case "ArrowRight":
        case "d":
        case "D":
          e.preventDefault();
          dispatch({ type: "PICK_RIGHT" });
          break;
        case " ":
        case "=":
          e.preventDefault();
          dispatch({ type: "PICK_TIE" });
          break;
        case "z":
        case "Z":
        case "Backspace":
          e.preventDefault();
          dispatch({ type: "UNDO" });
          break;
        case "r":
        case "R":
          e.preventDefault();
          dispatch({ type: "RESET", members });
          break;
        case "?":
          setShowHotkeys((v) => !v);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [members]);

  useEffect(() => {
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !stageRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".sorter-controls > *", { y: -20, opacity: 0, stagger: 0.08, duration: 0.5 })
        .from(".sorter-greet", { y: 12, opacity: 0, duration: 0.4 }, "-=0.2")
        .from(".sorter-title .letter", {
          y: 40, opacity: 0, rotate: -6,
          stagger: 0.03, duration: 0.55, ease: "back.out(1.6)",
        }, "-=0.2")
        .from(".sorter-progress", { scaleX: 0, transformOrigin: "left center", duration: 0.6 }, "-=0.2")
        .from(".sorter-left", { x: -80, opacity: 0, rotate: -8, duration: 0.7, ease: "back.out(1.4)" }, "-=0.3")
        .from(".sorter-right", { x: 80, opacity: 0, rotate: 8, duration: 0.7, ease: "back.out(1.4)" }, "<")
        .from(".sorter-vs", { scale: 0, opacity: 0, rotate: 180, duration: 0.6, ease: "back.out(2)" }, "-=0.4")
        .from(".sorter-equal", { y: 20, opacity: 0, duration: 0.4 }, "-=0.3")
        .from(".sorter-hint", { opacity: 0, duration: 0.4 }, "-=0.2");
    }, stageRef);

    return () => ctx.revert();
  }, []);

  // Animate card swap when the pair changes
  const pairKey = `${state.left[0]?.id ?? ""}-${state.right[0]?.id ?? ""}`;
  useEffect(() => {
    if (!stageRef.current) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        [".sorter-left", ".sorter-right"],
        { scale: 0.92, opacity: 0.5 },
        { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(1.6)", stagger: 0.05 }
      );
    }, stageRef);
    return () => ctx.revert();
  }, [pairKey]);

  if (members.length < 2) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-kawaii font-kawaii font-bold text-ink">
        {t("notEnoughMembers")}
      </div>
    );
  }

  if (!state.left.length || !state.right.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-kawaii font-script text-2xl text-ink">
        {t("preparing")}…
      </div>
    );
  }

  const estimated = Math.ceil(members.length * Math.log2(members.length));
  const safeComparisons = Math.min(state.comparisons, estimated);
  const progress = Math.round((safeComparisons / estimated) * 100);

  const L = state.left[0];
  const R = state.right[0];

  return (
    <div className="min-h-screen bg-kawaii text-ink relative overflow-hidden font-sans pb-12">

      {/* Soft gradient blobs */}
      <div className="absolute -top-32 -left-20 w-[28rem] h-[28rem] bg-sakura-200/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 -right-24 w-[24rem] h-[24rem] bg-emerald-300/40 rounded-full blur-3xl pointer-events-none" />

      {/* Sparkles */}
      <div aria-hidden="true" className="absolute top-12 left-[8%] text-3xl text-sakura-500 animate-twinkle">✦</div>
      <div aria-hidden="true" className="absolute top-32 right-[10%] text-2xl text-emerald-500 animate-twinkle" style={{ animationDelay: "1s" }}>✦</div>
      <div aria-hidden="true" className="absolute bottom-16 left-[12%] text-2xl text-sakura-400 animate-twinkle" style={{ animationDelay: "0.5s" }}>✦</div>

      <div ref={stageRef} className="max-w-6xl mx-auto relative z-10 px-4 pt-6">

        {/* TOP CONTROL BAR */}
        <div className="sorter-controls flex justify-between items-center flex-wrap gap-2 sm:gap-3 mb-6">
          <button
            onClick={() => navigate("/")}
            className="btn-pop bg-white px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-kawaii font-bold text-ink flex items-center gap-1.5"
          >
            <ArrowLeft className="h-4 w-4 flex-shrink-0" />
            {t("back")}
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => dispatch({ type: "UNDO" })}
              disabled={!state.history.length}
              className="btn-pop bg-white px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-kawaii font-bold text-ink flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Undo2 className="h-4 w-4 flex-shrink-0" />
              {t("undo")}
            </button>

            <button
              onClick={restart}
              className="btn-pop-pink bg-white px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-kawaii font-bold text-sakura-700 flex items-center gap-1.5"
            >
              <RotateCcw className="h-4 w-4 flex-shrink-0" />
              {t("restart")}
            </button>
          </div>
        </div>

        {/* TITLE */}
        <div className="text-center mb-6 space-y-2">
          <div className="sorter-greet font-script text-xl text-sakura-600">choose your fave ♡</div>
          <h1 className="sorter-title font-kawaii font-bold text-2xl sm:text-4xl md:text-5xl text-emerald-600 squiggle-underline drop-shadow-[2px_2px_0_#be185d] sm:drop-shadow-[3px_3px_0_#be185d] inline-block break-words px-2">
            <SplitTitle text={t("chooseOne")} />
          </h1>

          {/* Progress as chunky sticker frame */}
          <div className="sorter-progress max-w-md mx-auto pt-3">
            <div className="sticker bg-white p-2 rounded-full">
              <div className="bg-cream-deep rounded-full h-3 overflow-hidden">
                <div
                  className="h-3 bg-gradient-to-r from-sakura-300 via-sakura-400 to-emerald-400 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <p className="text-xs text-ink/60 mt-2 font-kawaii font-bold">
              {t("progress", { comparisons: safeComparisons, progress })}
            </p>
          </div>
        </div>

        {/* COMPARISON GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch">

          {/* LEFT POLAROID */}
          <div className="sorter-left order-1">
            <ComparisonCard
              member={L}
              tilt={-3}
              onPick={() => dispatch({ type: "PICK_LEFT" })}
              onInfo={() => setSelectedProfile(L)}
              t={t}
            />
          </div>

          {/* CENTER */}
          <div className="order-3 lg:order-2 col-span-2 lg:col-span-1 flex flex-col items-center justify-center gap-5">
            <div className="sorter-vs relative">
              <div className="absolute inset-0 bg-sakura-300 rounded-full blur-2xl scale-150 opacity-60" />
              <div className="relative font-kawaii font-bold text-6xl sm:text-7xl lg:text-8xl text-emerald-600 drop-shadow-[3px_3px_0_#be185d] sm:drop-shadow-[5px_5px_0_#be185d] animate-float">
                VS
              </div>
            </div>

            <button
              ref={equalRef}
              onClick={() => dispatch({ type: "PICK_TIE" })}
              className="sorter-equal btn-pop-pink bg-gradient-to-r from-sakura-300 to-sakura-500 px-8 py-4 text-lg font-kawaii font-bold rounded-full text-white"
            >
              ⚖️ {t("equal")}
            </button>

            <p className="sorter-hint font-script text-base text-ink/50">
              can't decide? tap equal
            </p>
          </div>

          {/* RIGHT POLAROID */}
          <div className="sorter-right order-2 lg:order-3">
            <ComparisonCard
              member={R}
              tilt={3}
              onPick={() => dispatch({ type: "PICK_RIGHT" })}
              onInfo={() => setSelectedProfile(R)}
              t={t}
            />
          </div>
        </div>

        {/* Keyboard hint chip — only shown on devices with a fine pointer */}
        <div className="hidden md:flex justify-center mt-8">
          <button
            onClick={() => setShowHotkeys((v) => !v)}
            className="sticker bg-white/80 px-4 py-2 rounded-full text-xs font-kawaii font-bold text-ink/70 inline-flex items-center gap-2 hover:bg-white transition"
          >
            <Kbd>←</Kbd> <Kbd>→</Kbd> <Kbd>space</Kbd>
            <span className="font-script text-base">press ? for shortcuts</span>
          </button>
        </div>
      </div>

      <footer className="relative z-10 mt-12 pb-6 text-center font-script text-base text-ink/60">
        © 2026 <span className="font-kawaii font-bold text-emerald-600">Malvin Evano</span> · made with 💚 + 🌸
      </footer>

      {showHotkeys && (
        <HotkeyOverlay onClose={() => setShowHotkeys(false)} />
      )}

      <ProfileModal
        member={selectedProfile}
        isOpen={!!selectedProfile}
        onClose={() => setSelectedProfile(null)}
      />
    </div>
  );
}

function Kbd({ children }) {
  return (
    <kbd className="inline-flex items-center justify-center min-w-[1.5rem] h-6 px-1.5 bg-cream border-2 border-ink rounded-md text-[10px] font-kawaii font-bold text-ink shadow-[1px_1px_0_#064e3b]">
      {children}
    </kbd>
  );
}

function HotkeyOverlay({ onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const rows = [
    { keys: ["←", "A"], label: "Pick left" },
    { keys: ["→", "D"], label: "Pick right" },
    { keys: ["Space", "="], label: "Tie / Equal" },
    { keys: ["Z", "⌫"], label: "Undo" },
    { keys: ["R"], label: "Restart" },
    { keys: ["?"], label: "Toggle this overlay" },
    { keys: ["Esc"], label: "Close overlay" },
  ];

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="sticker bg-white rounded-3xl p-6 max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-kawaii font-bold text-xl text-ink mb-1">Shortcuts</h3>
        <p className="font-script text-base text-ink/60 mb-4">go fast ♡</p>
        <ul className="space-y-2.5">
          {rows.map((r) => (
            <li key={r.label} className="flex items-center justify-between gap-3">
              <span className="font-kawaii font-bold text-sm text-ink/80">{r.label}</span>
              <span className="flex gap-1.5">
                {r.keys.map((k, i) => (
                  <Kbd key={i}>{k}</Kbd>
                ))}
              </span>
            </li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="btn-pop bg-cream w-full mt-5 py-2 rounded-full font-kawaii font-bold text-ink text-sm"
        >
          Got it
        </button>
      </div>
    </div>
  );
}

function ComparisonCard({ member, tilt, onPick, onInfo, t }) {
  return (
    <div className="relative">
      <button
        onClick={onPick}
        className="polaroid w-full block focus:outline-none"
        style={{ "--tilt": `${tilt}deg` }}
        aria-label={`Pick ${member.name}`}
      >
        <img
          src={member.imageUrl}
          alt={member.name}
          loading="eager"
          decoding="async"
          fetchPriority="high"
          onError={(e) => { e.target.src = IMAGE_FALLBACK; }}
          className="w-full h-[220px] sm:h-[300px] lg:h-[440px] object-cover bg-cream"
        />
        <div className="absolute bottom-1 left-0 right-0 text-center px-2">
          <div className="font-kawaii font-bold text-base sm:text-lg text-ink truncate">
            {member.name}
          </div>
          <div className="font-script text-sm text-ink/60">
            {t("generationLabel", { gen: member.generation })}
          </div>
        </div>
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); onInfo(); }}
        className="absolute top-3 right-3 z-20 p-2 bg-white border-2 border-ink rounded-full shadow-[2px_2px_0_#064e3b] text-ink hover:bg-sakura-100 transition"
        aria-label="Show profile"
      >
        <Info className="w-4 h-4" />
      </button>
    </div>
  );
}
