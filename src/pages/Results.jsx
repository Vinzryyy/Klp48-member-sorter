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

  /* ================= TIER LOGIC ================= */
  const tiers = {
    Oshimen: ranking.slice(0, 1),
    "Niban-Oshi": ranking.slice(1, 3),
    Oshisama: ranking.slice(3, 8),
    Kikinarai: ranking.slice(8, 13),
    Chikasashi: ranking.slice(13),
  };

  const tierColors = {
    Oshimen: "bg-yellow-400 text-yellow-900",
    "Niban-Oshi": "bg-emerald-500 text-white",
    Oshisama: "bg-blue-500 text-white",
    Kikinarai: "bg-gray-400 text-white",
    Chikasashi: "bg-zinc-600 text-white",
  };

  const podium = ranking.slice(0, 3);
  const rest = ranking.slice(3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 px-4 sm:px-6 py-8 sm:py-10">
      <div className="max-w-7xl mx-auto">

        {/* ================= APP TITLE ================= */}
        <h1 className="text-center text-2xl sm:text-4xl font-extrabold text-emerald-700 mb-6">
          KLP48 Member Sorter
        </h1>

        {/* ================= HEADER ================= */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-8">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Home
          </Button>

          <h2 className="text-center text-lg sm:text-2xl font-bold text-emerald-600">
            Results — {ranking.length} Members
          </h2>

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
            {/* TOP 3 */}
            <div className="mb-10">
              <h3 className="text-2xl font-bold text-center mb-6">My Top 3 Oshi 🏆</h3>

              <div className="flex justify-center gap-4 sm:gap-8">
                {podium.map((m, i) => (
                  <Card
                    key={m.id}
                    className={`w-40 sm:w-44 overflow-hidden shadow-xl text-center ring-4
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

            {/* REST */}
            <div className="max-h-[65vh] overflow-y-auto pr-1 sm:pr-2">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
                {rest.map((m, i) => (
                  <Card key={m.id} className="overflow-hidden shadow">
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
                      <div className="font-bold text-sm truncate">{m.name}</div>
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

        {/* ================= TIER VIEW (SMALL & MOBILE FRIENDLY) ================= */}
        {view === "tier" && (
          <div className="space-y-5 max-h-[75vh] sm:max-h-[80vh] overflow-y-auto pr-1 sm:pr-2">
            {Object.entries(tiers).map(([tier, members]) => (
              <div
                key={tier}
                className="bg-white/70 backdrop-blur rounded-xl shadow-md overflow-hidden"
              >
                {/* TIER HEADER */}
                <div
                  className={`flex items-center justify-between px-3 py-2 font-bold text-base ${tierColors[tier]}`}
                >
                  <span>{tier}</span>
                  <span className="text-xs opacity-90">
                    {members.length} members
                  </span>
                </div>

                {/* MEMBERS */}
                <div className="p-3">
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {members.map((m) => (
                      <div
                        key={m.id}
                        className="w-[96px] sm:w-[120px] flex-shrink-0 bg-white rounded-md shadow"
                      >
                        <div className="aspect-[4/5] overflow-hidden rounded-t-md">
                          <img
                            src={m.imageUrl}
                            alt={m.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="p-1.5 text-center">
                          <div className="text-[11px] font-semibold truncate">
                            {m.name}
                          </div>
                          <div className="text-[9px] text-gray-500">
                            #{ranking.indexOf(m) + 1} • Gen {m.generation}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
       {/* FOOTER */}
      <footer className="w-full py-6 text-center text-xs sm:text-sm text-gray-400">
        © 2026 <span className="font-semibold text-gray-500">Malvin Evano</span>. All rights reserved.
        </footer>
    </div>
  );
}
