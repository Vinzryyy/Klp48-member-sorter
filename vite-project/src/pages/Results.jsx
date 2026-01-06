import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function Results() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const ranking = state?.ranking || [];

  const [view, setView] = useState("ranking"); // ranking | tier

  if (!ranking.length) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        No ranking data
      </div>
    );
  }

  /* ---------- TIERS ---------- */
  const tierSize = Math.ceil(ranking.length / 5);
  const tiers = {
    S: ranking.slice(0, tierSize),
    A: ranking.slice(tierSize, tierSize * 2),
    B: ranking.slice(tierSize * 2, tierSize * 3),
    C: ranking.slice(tierSize * 3, tierSize * 4),
    D: ranking.slice(tierSize * 4),
  };

  const podium = ranking.slice(0, 3);
  const rest = ranking.slice(3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 px-4 sm:px-6 py-8 sm:py-10">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-8">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Home
          </Button>

          <h1 className="text-center text-xl sm:text-3xl font-bold text-emerald-600">
            Results — {ranking.length} Members
          </h1>

          <div className="flex w-full sm:w-auto gap-2">
            <Button
              className="flex-1 sm:flex-none"
              variant={view === "ranking" ? "default" : "outline"}
              onClick={() => setView("ranking")}
            >
              Ranking
            </Button>
            <Button
              className="flex-1 sm:flex-none"
              variant={view === "tier" ? "default" : "outline"}
              onClick={() => setView("tier")}
            >
              Tier List
            </Button>
          </div>
        </div>

        {/* ================= RANKING VIEW ================= */}
        {view === "ranking" && (
          <>
            {/* 🏆 PODIUM (SAME SIZE) */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-center mb-6">
                🏆 Top 3
              </h2>

              <div className="flex justify-center gap-4 sm:gap-8">
                {podium.map((m, i) => (
                  <Card
                    key={m.id}
                    className={`
                      w-40 sm:w-44 overflow-hidden shadow-xl text-center
                      ring-4
                      ${i === 0 && "ring-yellow-400"}
                      ${i === 1 && "ring-gray-300"}
                      ${i === 2 && "ring-amber-700"}
                    `}
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={m.imageUrl}
                        alt={m.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 text-xl">
                        {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}
                      </div>
                    </div>

                    <div className="p-3">
                      <div className="font-bold truncate">{m.name}</div>
                      <div className="text-xs text-gray-500">
                        Gen {m.generation}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* 📋 REST OF RANKING */}
            <div className="max-h-[65vh] overflow-y-auto pr-1 sm:pr-2">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
                {rest.map((m, i) => (
                  <Card
                    key={m.id}
                    className="overflow-hidden shadow hover:shadow-lg transition"
                  >
                    <div className="relative aspect-[3/4]">
                      <img
                        src={m.imageUrl}
                        alt={m.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-emerald-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs">
                        #{i + 4}
                      </div>
                    </div>

                    <div className="p-2 text-center">
                      <div className="font-bold text-sm truncate">
                        {m.name}
                      </div>
                      <div className="text-[10px] text-gray-500">
                        Gen {m.generation}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ================= TIER VIEW ================= */}
        {view === "tier" && (
          <div className="space-y-8 max-h-[75vh] sm:max-h-[80vh] overflow-y-auto pr-1 sm:pr-2">
            {Object.entries(tiers).map(([tier, members]) => (
              <div key={tier}>
                <h2 className="text-xl sm:text-2xl font-bold mb-4">
                  {tier} Tier ({members.length})
                </h2>

                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {members.map((m) => (
                    <div
                      key={m.id}
                      className="bg-white rounded shadow px-3 py-2 flex items-center gap-3"
                    >
                      <span className="text-xs sm:text-sm font-bold">
                        #{ranking.indexOf(m) + 1}
                      </span>

                      <img
                        src={m.imageUrl}
                        alt={m.name}
                        className="w-8 h-8 rounded object-cover"
                      />

                      <span className="text-xs sm:text-sm whitespace-nowrap">
                        {m.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
