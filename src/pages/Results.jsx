import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toPng } from "html-to-image";
import { useRankStore } from "../store/useRankStore";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Image as ImageIcon } from "lucide-react";

const IMAGE_FALLBACK = "https://placehold.co/400x600?text=KLP48";

export default function Results() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { ranking, setRanking } = useRankStore();

  /* ================= PERSISTENCE ================= */
  useEffect(() => {
    if (ranking.length > 0) {
      localStorage.setItem("klp48-ranking", JSON.stringify(ranking));
    } else {
      const saved = localStorage.getItem("klp48-ranking");
      if (saved) setRanking(JSON.parse(saved));
    }
  }, [ranking, setRanking]);

  const [view, setView] = useState("ranking");

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

  /* ================= IMAGE HELPERS ================= */
  const waitForImages = async (element) => {
    const images = element.querySelectorAll("img");
    await Promise.all(
      Array.from(images).map(
        (img) =>
          img.complete ||
          new Promise((resolve) => {
            img.onload = img.onerror = resolve;
          })
      )
    );
  };

  /* ================= IMAGE EXPORT ================= */
  const exportImage = async (ref, filename) => {
    if (!ref.current) return;

    await waitForImages(ref.current);

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    // Safari hack: call twice to prime the cache
    if (isIOS) await toPng(ref.current, { cacheBust: true });

    const dataUrl = await toPng(ref.current, {
      cacheBust: true,
      pixelRatio: isIOS ? 1 : 2,
      backgroundColor: "#ffffff",
    });

    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    link.click();
  };

  /* ================= MODERN SHARE (iOS/Android Friendly) ================= */
  const handleShare = async () => {
    const top3Names = podium.map((m, i) => `${i + 1}. ${m.name}`).join("\n");
    const shareUrl = window.location.origin;
    // Append URL to text because many mobile apps ignore the 'url' field when sharing files
    const shareText = `My KLP48 Oshi Ranking! 🏆\n\n${top3Names}\n\nCheck it out here: ${shareUrl}`;

    try {
      if (!top3Ref.current) return;

      // 1. Generate the image blob
      await waitForImages(top3Ref.current);
      
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      // Safari hack: prime the cache
      if (isIOS) await toPng(top3Ref.current, { cacheBust: true });

      // Safari/iOS workaround: Sometimes calling it twice or using a slight delay helps
      const dataUrl = await toPng(top3Ref.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });

      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], "KLP48-Ranking.png", { type: "image/png" });

      // 2. Try Native Share (Works on iOS/Android/Chrome)
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "KLP48 Member Sorter",
          text: shareText,
        });
      } else {
        // 3. Fallback to Twitter Web Intent (Desktop)
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          shareText
        )}`;
        window.open(twitterUrl, "_blank");
      }
    } catch (error) {
      console.error("Share failed", error);
      // Basic fallback
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 px-3 py-6">
      <div className="max-w-6xl mx-auto">

        {/* ================= TITLE ================= */}
        <h1 className="text-center text-2xl sm:text-4xl font-extrabold text-emerald-700 mb-1">
          KLP48 Member Sorter
        </h1>
        <p className="text-center text-gray-600 mb-6 text-sm sm:text-base">
          My Top 3 Oshi 🏆
        </p>

        {/* ================= HEADER ================= */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6">
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
            <div
              ref={fullRef}
              className="space-y-8 p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-100"
            >
              {/* ===== TOP 3 PODIUM ===== */}
              <div ref={top3Ref} className="bg-white p-4 sm:p-6 rounded-xl shadow">
                <h2 className="text-xl sm:text-2xl font-bold text-center mb-4">
                  Top 3
                </h2>

                <div className="grid grid-cols-3 gap-3 sm:flex sm:justify-center sm:gap-6">
                  {podium.map((m, i) => (
                    <Card
                      key={m.id}
                      className={`relative text-center overflow-hidden shadow ${
                        i === 0
                          ? "ring-2 sm:ring-4 ring-yellow-400"
                          : i === 1
                          ? "ring-2 sm:ring-4 ring-gray-400"
                          : "ring-2 sm:ring-4 ring-orange-400"
                      }`}
                    >
                      <div className="absolute top-1 left-1 bg-black/70 text-white text-[10px] px-1 rounded">
                        #{i + 1}
                      </div>

                      {/* ✅ iOS SAFE IMAGE */}
                      <img
                        src={m.imageUrl}
                        alt={m.name}
                        onError={(e) => { e.target.src = IMAGE_FALLBACK; }}
                        className="w-full h-32 sm:h-64 object-cover bg-white"
                      />

                      <div className="p-1 sm:p-3">
                        <div className="font-bold text-xs sm:text-base truncate">
                          {m.name}
                        </div>
                        <div className="text-[10px] sm:text-xs text-gray-500">
                          {t("generationLabel", { gen: m.generation })}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* ===== FULL LIST ===== */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                {rest.map((m, i) => (
                  <Card key={m.id} className="overflow-hidden shadow bg-white">
                    <img
                      src={m.imageUrl}
                      alt={m.name}
                      onError={(e) => { e.target.src = IMAGE_FALLBACK; }}
                      className="w-full h-32 sm:h-40 object-cover bg-white"
                    />
                    <div className="p-1 text-center">
                      <div className="font-bold text-xs truncate">
                        #{i + 4} {m.name}
                      </div>
                      <div className="text-[10px] text-gray-500">
                        {t("generationLabel", { gen: m.generation })}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* ===== EXPORT & SHARE BUTTONS ===== */}
            <Card className="p-4 max-w-xl mx-auto mt-8 bg-white/80 backdrop-blur border-emerald-200">
              <h3 className="text-center font-bold text-emerald-700 mb-4 flex items-center justify-center gap-2">
                <ImageIcon className="w-5 h-5" />
                {t("share")}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                  onClick={() => exportImage(top3Ref, "KLP48-Top3.png")}
                >
                  {t("exportImage")}
                </Button>

                <Button
                  variant="outline"
                  className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                  onClick={() => exportImage(fullRef, "KLP48-FullRanking.png")}
                >
                  Export Full List
                </Button>

                <Button
                  className="sm:col-span-2 bg-black hover:bg-zinc-800 text-white font-bold"
                  onClick={handleShare}
                >
                  <svg className="w-4 h-4 mr-2 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  {t("tweet")}
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
              className="space-y-5 p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-100"
            >
              {tiers.map((tier) => (
                <Card key={tier.key} className="p-3">
                  <h3 className="font-bold text-base sm:text-lg mb-2">
                    {tier.label}
                  </h3>

                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2">
                    {tier.members.map((m) => (
                      <div key={m.id} className="text-center">
                        <img
                          src={m.imageUrl}
                          alt={m.name}
                          onError={(e) => { e.target.src = IMAGE_FALLBACK; }}
                          className="w-full aspect-[3/4] object-cover rounded shadow bg-white"
                        />
                        <div className="text-[9px] sm:text-[10px] mt-1 font-semibold truncate px-1">
                          {m.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>

            <Card className="p-4 max-w-xl mx-auto mt-8 bg-white/80 backdrop-blur border-emerald-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                  onClick={() => exportImage(tierRef, "KLP48-TierList.png")}
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  {t("exportImage")}
                </Button>

                <Button
                  className="bg-black hover:bg-zinc-800 text-white font-bold"
                  onClick={handleShare}
                >
                   <svg className="w-4 h-4 mr-2 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  {t("tweet")}
                </Button>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
