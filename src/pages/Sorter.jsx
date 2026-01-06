import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, RotateCcw } from "lucide-react";

/**
 * Interactive Merge Sort (FULL RANKING, NO APPROXIMATION)
 */
export default function Sorter() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const members = state?.members || [];

  const [stack, setStack] = useState([]);
  const [left, setLeft] = useState([]);
  const [right, setRight] = useState([]);
  const [merged, setMerged] = useState([]);
  const [comparisons, setComparisons] = useState(0);

  /* ---------- INIT ---------- */
  useEffect(() => {
    if (members.length < 2) return;
    const shuffled = [...members].sort(() => Math.random() - 0.5);
    setStack(shuffled.map(m => [m]));
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

  /* ---------- USER PICKS ---------- */
  const pickLeft = () => {
    setMerged(m => [...m, left[0]]);
    setLeft(l => l.slice(1));
    setComparisons(c => c + 1);
  };

  const pickRight = () => {
    setMerged(m => [...m, right[0]]);
    setRight(r => r.slice(1));
    setComparisons(c => c + 1);
  };

  const pickTie = () => {
    setMerged(m => [...m, left[0], right[0]]);
    setLeft(l => l.slice(1));
    setRight(r => r.slice(1));
    setComparisons(c => c + 1);
  };

  /* ---------- AUTO-FINISH MERGE ---------- */
  useEffect(() => {
    if (!left.length && right.length) {
      setMerged(m => [...m, ...right]);
      setRight([]);
    }

    if (!right.length && left.length) {
      setMerged(m => [...m, ...left]);
      setLeft([]);
    }

    if (!left.length && !right.length && merged.length) {
      setStack(s => [...s, merged]);
      setMerged([]);
    }
  }, [left, right, merged]);

  if (members.length < 2) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Not enough members selected.
      </div>
    );
  }

  if (!left.length || !right.length) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Preparing comparisons…
      </div>
    );
  }

  const estimated = Math.ceil(members.length * Math.log2(members.length));
  const progress = Math.min(
    Math.round((comparisons / estimated) * 100),
    100
  );

  const L = left[0];
  const R = right[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 px-4 py-8">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col gap-4 mb-8">
          <Button variant="outline" onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-emerald-600">
              Choose the Better One
            </h1>
            <p className="text-sm text-gray-600">
              {comparisons} comparisons • {progress}% complete
            </p>
          </div>

          <Button variant="outline" onClick={() => navigate("/")}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Restart
          </Button>
        </div>

        {/* COMPARISON GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch">

          {/* LEFT CARD */}
          <Card
            onClick={pickLeft}
            className="order-1 lg:order-1 cursor-pointer hover:scale-105 transition shadow-xl overflow-hidden"
          >
            <img
              src={L.imageUrl}
              alt={L.name}
              className="w-full h-[220px] sm:h-[300px] lg:h-[420px] object-cover"
            />
            <div className="p-4 text-center">
              <h3 className="font-bold">{L.name}</h3>
              <p className="text-xs text-gray-500">
                Generation {L.generation}
              </p>
            </div>
          </Card>

          {/* RIGHT CARD */}
          <Card
            onClick={pickRight}
            className="order-2 lg:order-3 cursor-pointer hover:scale-105 transition shadow-xl overflow-hidden"
          >
            <img
              src={R.imageUrl}
              alt={R.name}
              className="w-full h-[220px] sm:h-[300px] lg:h-[420px] object-cover"
            />
            <div className="p-4 text-center">
              <h3 className="font-bold">{R.name}</h3>
              <p className="text-xs text-gray-500">
                Generation {R.generation}
              </p>
            </div>
          </Card>

          {/* TIE BUTTON */}
          <div className="order-3 lg:order-2 col-span-2 lg:col-span-1 flex items-center justify-center">
            <Button
              variant="outline"
              size="lg"
              onClick={pickTie}
              className="w-full sm:w-2/3 lg:w-auto"
            >
              They are equal
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
