import { useNavigate } from "react-router-dom";
import { useEffect, useReducer, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useRankStore } from "../store/useRankStore";
import { init, reducer } from "../lib/mergeSortMachine";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, RotateCcw, Undo2, Info } from "lucide-react";
import ProfileModal from "../components/ProfileModal";

const IMAGE_FALLBACK = "https://placehold.co/400x600?text=KLP48";

export default function Sorter() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { members, setRanking } = useRankStore();

  /* ---------- REDIRECT IF EMPTY ---------- */
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

  /* ---------- SAVE RANKING WHEN DONE ---------- */
  useEffect(() => {
    if (state.done && state.ranking) {
      setRanking(state.ranking);
      navigate("/results");
    }
  }, [state.done, state.ranking, setRanking, navigate]);

  /* ---------- STATES ---------- */
  if (members.length < 2) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {t("notEnoughMembers")}
      </div>
    );
  }

  if (!state.left.length || !state.right.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {t("preparing")}
      </div>
    );
  }

  const estimated = Math.ceil(members.length * Math.log2(members.length));
  const safeComparisons = Math.min(state.comparisons, estimated);
  const progress = Math.round((safeComparisons / estimated) * 100);

  const L = state.left[0];
  const R = state.right[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-100 to-emerald-200 px-4 py-8 relative overflow-hidden aurora-emerald">

      {/* Floating idol particles */}
      <div className="idol-particles" aria-hidden="true">
        <span /><span /><span /><span /><span /><span />
        <span /><span /><span /><span /><span /><span />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">

        {/* TITLE */}
        <div className="text-center mb-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight idol-text-shine drop-shadow">
            {t("chooseOne")}
          </h1>
          <p className="text-sm text-gray-600">
            {t("progress", { comparisons: safeComparisons, progress })}
          </p>

          {/* Progress Bar */}
          <div className="mt-2 w-full bg-white/60 rounded-full h-2 overflow-hidden">
            <div
              className="h-2 bg-gradient-to-r from-emerald-400 to-green-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex justify-center gap-2 flex-wrap mb-6">
          <Button variant="outline" onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("back")}
          </Button>

          <Button
            variant="outline"
            onClick={() => dispatch({ type: "UNDO" })}
            disabled={!state.history.length}
          >
            <Undo2 className="mr-2 h-4 w-4" />
            {t("undo")}
          </Button>

          <Button variant="outline" onClick={restart}>
            <RotateCcw className="mr-2 h-4 w-4" />
            {t("restart")}
          </Button>
        </div>

        {/* COMPARISON GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch">

          {/* LEFT */}
          <Card
            onClick={() => dispatch({ type: "PICK_LEFT" })}
            className="order-1 cursor-pointer hover:scale-105 transition shadow-2xl rounded-3xl overflow-hidden glass-card idol-shimmer relative group"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedProfile(L);
              }}
              className="absolute top-3 right-3 z-10 p-2 bg-white/80 hover:bg-emerald-500 hover:text-white text-emerald-600 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition duration-300"
            >
              <Info className="w-5 h-5" />
            </button>
            <img
              src={L.imageUrl}
              alt={L.name}
              onError={(e) => { e.target.src = IMAGE_FALLBACK; }}
              className="w-full h-[220px] sm:h-[300px] lg:h-[480px] object-cover"
            />
            <div className="p-4 text-center">
              <h3 className="font-bold text-lg text-emerald-700">{L.name}</h3>
              <p className="text-xs text-gray-500">
                {t("generationLabel", { gen: L.generation })}
              </p>
            </div>
          </Card>

          {/* CENTER */}
          <div className="order-3 lg:order-2 col-span-2 lg:col-span-1 flex flex-col items-center justify-center gap-4">
            <div className="text-5xl font-black font-display idol-text-shine drop-shadow animate-float">VS</div>

            <Button
              onClick={() => dispatch({ type: "PICK_TIE" })}
              className="px-8 py-4 text-lg font-black rounded-full text-white shadow-2xl border-2 border-white hover:scale-110 transition bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 idol-glow-pulse"
            >
              {t("equal")}
            </Button>
          </div>

          {/* RIGHT */}
          <Card
            onClick={() => dispatch({ type: "PICK_RIGHT" })}
            className="order-2 lg:order-3 cursor-pointer hover:scale-105 transition shadow-2xl rounded-3xl overflow-hidden glass-card idol-shimmer relative group"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedProfile(R);
              }}
              className="absolute top-3 right-3 z-10 p-2 bg-white/80 hover:bg-emerald-500 hover:text-white text-emerald-600 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition duration-300"
            >
              <Info className="w-5 h-5" />
            </button>
            <img
              src={R.imageUrl}
              alt={R.name}
              onError={(e) => { e.target.src = IMAGE_FALLBACK; }}
              className="w-full h-[220px] sm:h-[300px] lg:h-[480px] object-cover"
            />
            <div className="p-4 text-center">
              <h3 className="font-bold text-lg text-emerald-700">{R.name}</h3>
              <p className="text-xs text-gray-500">
                {t("generationLabel", { gen: R.generation })}
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="w-full py-6 text-center text-xs sm:text-sm text-gray-500">
        © 2026 <span className="font-semibold text-emerald-600">Malvin Evano</span> • Fan-made project
      </footer>

      {/* Profile Modal */}
      <ProfileModal
        member={selectedProfile}
        isOpen={!!selectedProfile}
        onClose={() => setSelectedProfile(null)}
      />
    </div>
  );
}
