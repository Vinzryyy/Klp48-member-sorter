import { useNavigate } from "react-router-dom";
import { useEffect, useReducer, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useRankStore } from "../store/useRankStore";
import { init, reducer } from "../lib/mergeSortMachine";

import { ArrowLeft, RotateCcw, Undo2, Info } from "lucide-react";
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

      <div className="max-w-6xl mx-auto relative z-10 px-4 pt-6">

        {/* TOP CONTROL BAR */}
        <div className="flex justify-between items-center flex-wrap gap-3 mb-6">
          <button
            onClick={() => navigate("/")}
            className="btn-pop bg-white px-4 py-2 rounded-full text-sm font-kawaii font-bold text-ink flex items-center gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("back")}
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => dispatch({ type: "UNDO" })}
              disabled={!state.history.length}
              className="btn-pop bg-white px-4 py-2 rounded-full text-sm font-kawaii font-bold text-ink flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Undo2 className="h-4 w-4" />
              {t("undo")}
            </button>

            <button
              onClick={restart}
              className="btn-pop-pink bg-white px-4 py-2 rounded-full text-sm font-kawaii font-bold text-sakura-700 flex items-center gap-1.5"
            >
              <RotateCcw className="h-4 w-4" />
              {t("restart")}
            </button>
          </div>
        </div>

        {/* TITLE */}
        <div className="text-center mb-6 space-y-2">
          <div className="font-script text-xl text-sakura-600">choose your fave ♡</div>
          <h1 className="font-kawaii font-bold text-3xl sm:text-5xl text-emerald-600 squiggle-underline drop-shadow-[3px_3px_0_#be185d] inline-block">
            {t("chooseOne")}
          </h1>

          {/* Progress as chunky sticker frame */}
          <div className="max-w-md mx-auto pt-3">
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
          <ComparisonCard
            member={L}
            tilt={-3}
            order="order-1"
            onPick={() => dispatch({ type: "PICK_LEFT" })}
            onInfo={() => setSelectedProfile(L)}
            t={t}
          />

          {/* CENTER */}
          <div className="order-3 lg:order-2 col-span-2 lg:col-span-1 flex flex-col items-center justify-center gap-5">
            <div className="relative">
              <div className="absolute inset-0 bg-sakura-300 rounded-full blur-2xl scale-150 opacity-60" />
              <div className="relative font-kawaii font-bold text-7xl sm:text-8xl text-emerald-600 drop-shadow-[5px_5px_0_#be185d] animate-float">
                VS
              </div>
            </div>

            <button
              onClick={() => dispatch({ type: "PICK_TIE" })}
              className="btn-pop-pink bg-gradient-to-r from-sakura-300 to-sakura-500 px-8 py-4 text-lg font-kawaii font-bold rounded-full text-white"
            >
              ⚖️ {t("equal")}
            </button>

            <p className="font-script text-base text-ink/50">
              can't decide? tap equal
            </p>
          </div>

          {/* RIGHT POLAROID */}
          <ComparisonCard
            member={R}
            tilt={3}
            order="order-2 lg:order-3"
            onPick={() => dispatch({ type: "PICK_RIGHT" })}
            onInfo={() => setSelectedProfile(R)}
            t={t}
          />
        </div>
      </div>

      <footer className="relative z-10 mt-12 pb-6 text-center font-script text-base text-ink/60">
        © 2026 <span className="font-kawaii font-bold text-emerald-600">Malvin Evano</span> · made with 💚 + 🌸
      </footer>

      <ProfileModal
        member={selectedProfile}
        isOpen={!!selectedProfile}
        onClose={() => setSelectedProfile(null)}
      />
    </div>
  );
}

function ComparisonCard({ member, tilt, order, onPick, onInfo, t }) {
  return (
    <div className={`${order} relative`}>
      <button
        onClick={onPick}
        className="polaroid w-full block focus:outline-none"
        style={{ "--tilt": `${tilt}deg` }}
        aria-label={`Pick ${member.name}`}
      >
        <img
          src={member.imageUrl}
          alt={member.name}
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
