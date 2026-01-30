import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, RotateCcw, Undo2 } from "lucide-react";

/**
 * Interactive Merge Sort (FULL RANKING, WITH UNDO)
 */
export default function Sorter() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const members = state?.members || [];

  const [stack, setStack] = useState([]);
  const [left, setLeft] = useState([]);
  const [right, setRight] = useState([]);
  const [merged, setMerged] = useState([]);
  const [comparisons, setComparisons] = useState(0); // ✅ MUST be number
  const [history, setHistory] = useState([]);

  /* ---------- INIT (FIXED) ---------- */
  useEffect(() => {
    if (members.length < 2) return;

    const shuffled = [...members].sort(() => Math.random() - 0.5);
    setStack(shuffled.map((m) => [m]));

    // ✅ RESET EVERYTHING WHEN ENTER SORTER
    setLeft([]);
    setRight([]);
    setMerged([]);
    setHistory([]);
    setComparisons(0);
  }, [members]);

  /* ---------- LOAD NEXT MERGE ---------- */
  useEffect(() => {
    if (left.length || right.length || merged.length) return;

    if (stack.length === 1) {
      navigate("/results", { state: { ranking: stack[0] } });
      return;
    }

    if (stack.length >= 2) {
      const [a, b, ...rest] = stack;
      setLeft(a);
      setRight(b);
      setMerged([]);
      setStack(rest);
    }
  }, [stack, left, right, merged, navigate]);

  /* ---------- HISTORY ---------- */
  const saveHistory = () => {
    setHistory((h) => [...h, { left, right, merged, stack, comparisons }]);
  };

  const pickLeft = () => {
    saveHistory();
    setMerged((m) => [...m, left[0]]);
    setLeft((l) => l.slice(1));
    setComparisons((c) => c + 1);
  };

  const pickRight = () => {
    saveHistory();
    setMerged((m) => [...m, right[0]]);
    setRight((r) => r.slice(1));
    setComparisons((c) => c + 1);
  };

  const pickTie = () => {
    saveHistory();
    setMerged((m) => [...m, left[0], right[0]]);
    setLeft((l) => l.slice(1));
    setRight((r) => r.slice(1));
    setComparisons((c) => c + 1);
  };

  const undo = () => {
    if (!history.length) return;
    const prev = history[history.length - 1];
    setLeft(prev.left);
    setRight(prev.right);
    setMerged(prev.merged);
    setStack(prev.stack);
    setComparisons(prev.comparisons);
    setHistory((h) => h.slice(0, -1));
  };

  /* ---------- AUTO FINISH ---------- */
  useEffect(() => {
    if (!left.length && right.length) {
      setMerged((m) => [...m, ...right]);
      setRight([]);
    }
    if (!right.length && left.length) {
      setMerged((m) => [...m, ...left]);
      setLeft([]);
    }
    if (!left.length && !right.length && merged.length) {
      setStack((s) => [...s, merged]);
      setMerged([]);
    }
  }, [left, right, merged]);

  /* ---------- STATES ---------- */
  if (members.length < 2) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {t("notEnoughMembers")}
      </div>
    );
  }

  if (!left.length || !right.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {t("preparing")}
      </div>
    );
  }

  // ✅ SAFE PROGRESS CALCULATION (FIX)
  const estimated = Math.ceil(members.length * Math.log2(members.length));
  const safeComparisons = Math.min(comparisons, estimated);
  const progress = Math.round((safeComparisons / estimated) * 100);

  const L = left[0];
  const R = right[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-100 to-emerald-200 px-4 py-8 relative overflow-hidden">

      {/* Glow bubbles */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-300/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-green-400/30 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto relative">

        {/* TITLE */}
        <div className="text-center mb-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-700 drop-shadow">
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

          <Button variant="outline" onClick={undo} disabled={!history.length}>
            <Undo2 className="mr-2 h-4 w-4" />
            {t("undo")}
          </Button>

          <Button variant="outline" onClick={() => window.location.reload()}>
            <RotateCcw className="mr-2 h-4 w-4" />
            {t("restart")}
          </Button>
        </div>

        {/* COMPARISON GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch">

          {/* LEFT */}
          <Card
            onClick={pickLeft}
            className="order-1 cursor-pointer hover:scale-105 transition shadow-2xl rounded-3xl overflow-hidden bg-white/70 backdrop-blur border border-emerald-200"
          >
            <img src={L.imageUrl} alt={L.name} className="w-full h-[220px] sm:h-[300px] lg:h-[480px] object-cover" />
            <div className="p-4 text-center">
              <h3 className="font-bold text-lg text-emerald-700">{L.name}</h3>
              <p className="text-xs text-gray-500">
                {t("generationLabel", { gen: L.generation })}
              </p>
            </div>
          </Card>

          {/* CENTER */}
          <div className="order-3 lg:order-2 col-span-2 lg:col-span-1 flex flex-col items-center justify-center gap-4">
            <div className="text-4xl font-black text-emerald-600 drop-shadow">VS</div>

            <Button
              onClick={pickTie}
              className="px-8 py-4 text-lg font-black rounded-full text-white shadow-2xl border-2 border-white hover:scale-110 transition"
            >
              {t("equal")}
            </Button>
          </div>

          {/* RIGHT */}
          <Card
            onClick={pickRight}
            className="order-2 lg:order-3 cursor-pointer hover:scale-105 transition shadow-2xl rounded-3xl overflow-hidden bg-white/70 backdrop-blur border border-emerald-200"
          >
            <img src={R.imageUrl} alt={R.name} className="w-full h-[220px] sm:h-[300px] lg:h-[480px] object-cover" />
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
    </div>
  );
}
