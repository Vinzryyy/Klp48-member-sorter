import { useLocation, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { toPng } from "html-to-image";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Twitter, Image as ImageIcon } from "lucide-react";

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  /* ================= LOAD DATA (STATE OR LINK) ================= */
  const ranking =
    location.state?.ranking ||
    JSON.parse(localStorage.getItem("klp48-ranking")) ||
    [];

  const [view, setView] = useState("ranking");
  const [username, setUsername] = useState("");

  const top3Ref = useRef(null);
  const fullRef = useRef(null);
  const tierRef = useRef(null);

  if (!ranking.length) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        {t("noRanking")}
      </div>
    );
  }

  /* ================= DATA ================= */
  const podium = ranking.slice(0, 3);
  const rest = ranking.slice(3);

  /* ================= TIER LOGIC ================= */
  const tierConfig = [
    { key: "oshimen", label: t("tierLabel.oshimen"), count: 1 },
    { key: "niban", label: t("tierLabel.niban"), count: 2 },
    { key: "oshisama", label: t("tierLabel.oshisama"), count: 3 },
    { key: "kikinarai", label: t("tierLabel.kikinarai"), count: 6 },
    { key: "chikasashi", label: t("tierLabel.chikasashi"), count: Infinity },
  ];

  let cursor = 0;
  const tiers = tierConfig.map((tier) => {
    const members =
      tier.count === Infinity
        ? ranking.slice(cursor)
        : ranking.slice(cursor, cursor + tier.count);

    cursor += members.length;
    return { ...tier, members };
  });

  /* ================= IMAGE EXPORT ================= */
  const exportImage = async (ref, filename) => {
    if (!ref.current) return;
    const dataUrl = await toPng(ref.current, {
      cacheBust: true,
      pixelRatio: 2,
    });
    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    link.click();
  };

  /* ================= TWITTER (LINK ONLY) ================= */
  const handleTwitterShare = () => {
    const url = `${window.location.origin}/results`;

    const text = `
My KLP48 Ranking 🏆

🥇 ${podium[0]?.name}
🥈 ${podium[1]?.name}
🥉 ${podium[2]?.name}

See full result 👇
${url}

#KLP48SorterMember
    `.trim();

    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 px-4 py-8">
      <div className="max-w-6xl mx-auto">

        {/* ================= TITLE ================= */}
        <h1 className="text-center text-3xl sm:text-4xl font-extrabold text-emerald-700 mb-1">
          KLP48 Member Sorter
        </h1>
        <p className="text-center text-gray-600 mb-8">
          My Top 3 Oshi 🏆
        </p>

        {/* ================= HEADER ================= */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <Button variant="outline" onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("home")}
          </Button>

          <div className="flex gap-2">
            <Button
              variant={view === "ranking" ? "default" : "outline"}
              onClick={() => setView("ranking")}
            >
              Ranking
            </Button>
            <Button
              variant={view === "tier" ? "default" : "outline"}
              onClick={() => setView("tier")}
            >
              Tier
            </Button>
          </div>
        </div>

        {/* ================= RANKING VIEW ================= */}
        {view === "ranking" && (
          <>
            {/* ===== EXPORT AREA (WITH BACKGROUND) ===== */}
            <div
              ref={fullRef}
              className="space-y-10 p-6 rounded-xl
                         bg-gradient-to-br from-emerald-50 to-teal-100"
            >
              {/* ===== TOP 3 ===== */}
              <div ref={top3Ref} className="bg-white p-6 rounded-xl shadow">
                <h2 className="text-2xl font-bold text-center mb-6">
                  Top 3
                </h2>

                <div className="flex justify-center gap-6">
                  {podium.map((m, i) => (
                    <Card
                      key={m.id}
                      className={`relative w-40 text-center overflow-hidden shadow-xl ${
                        i === 0
                          ? "ring-4 ring-yellow-400"
                          : i === 1
                          ? "ring-4 ring-gray-400"
                          : "ring-4 ring-orange-400"
                      }`}
                    >
                      <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        #{i + 1}
                      </div>
                      <img
                        src={m.imageUrl}
                        alt={m.name}
                        className="w-full h-56 object-cover"
                      />
                      <div className="p-3">
                        <div className="font-bold truncate">{m.name}</div>
                        <div className="text-xs text-gray-500">
                          {t("generationLabel", { gen: m.generation })}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* ===== FULL LIST (NO DUPLICATES) ===== */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                {rest.map((m, i) => (
                  <Card key={m.id} className="overflow-hidden shadow bg-white">
                    <img
                      src={m.imageUrl}
                      alt={m.name}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-2 text-center">
                      <div className="font-bold text-sm truncate">
                        #{i + 4} {m.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {t("generationLabel", { gen: m.generation })}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* ===== SHARE BOX (NOT EXPORTED) ===== */}
            <Card className="p-5 max-w-xl mx-auto mt-10">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => exportImage(top3Ref, "Top3.png")}
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Export Top 3
                </Button>

                <Button
                  variant="outline"
                  onClick={() => exportImage(fullRef, "FullRanking.png")}
                >
                  Export Full List
                </Button>
              </div>
            </Card>
          </>
        )}

        {/* ================= TIER VIEW ================= */}
        {view === "tier" && (
          <>
            <div
              ref={tierRef}
              className="space-y-6 p-6 rounded-xl
                         bg-gradient-to-br from-emerald-50 to-teal-100"
            >
              {tiers.map((tier) => (
                <Card key={tier.key} className="p-4">
                  <h3 className="font-bold text-lg mb-3">{tier.label}</h3>
                  <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-3">
                    {tier.members.map((m) => (
                      <div key={m.id} className="text-center">
                        <img
                          src={m.imageUrl}
                          alt={m.name}
                          className="w-full aspect-[3/4] object-cover rounded-md shadow"
                        />
                        <div className="text-xs mt-1 truncate">
                          {m.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>

            <div className="text-center mt-6">
              <Button
                variant="outline"
                onClick={() => exportImage(tierRef, "TierList.png")}
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Export Tier List
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
