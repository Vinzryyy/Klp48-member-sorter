import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toPng } from "html-to-image";
import { gsap } from "gsap";
import { useRankStore } from "../store/useRankStore";

import { ArrowLeft, Image as ImageIcon, Crown, Trophy, Medal } from "lucide-react";
import SplitTitle from "../components/SplitTitle";

const IMAGE_FALLBACK = "https://placehold.co/400x600?text=KLP48";

const TIER_PALETTES = {
  oshimen:    { bg: "bg-gradient-to-r from-yellow-100 to-amber-100", ring: "ring-gold",   accent: "text-amber-700",   icon: "👑" },
  niban:      { bg: "bg-gradient-to-r from-slate-100 to-slate-200", ring: "ring-silver", accent: "text-slate-700",   icon: "🥈" },
  oshisama:   { bg: "bg-gradient-to-r from-orange-100 to-amber-100", ring: "ring-bronze", accent: "text-orange-700",  icon: "🥉" },
  kikinarai:  { bg: "bg-gradient-to-r from-sakura-100 to-sakura-200", ring: "",          accent: "text-sakura-700",  icon: "🌸" },
  chikasashi: { bg: "bg-gradient-to-r from-emerald-100 to-emerald-200", ring: "",        accent: "text-emerald-700", icon: "🍀" },
};

export default function Results() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { ranking, setRanking } = useRankStore();

  useEffect(() => {
    if (ranking.length === 0) {
      const saved = localStorage.getItem("klp48-ranking");
      if (saved) {
        try {
          setRanking(JSON.parse(saved));
        } catch {
          localStorage.removeItem("klp48-ranking");
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (ranking.length > 0) {
      localStorage.setItem("klp48-ranking", JSON.stringify(ranking));
    }
  }, [ranking]);

  const [view, setView] = useState("ranking");

  const top3Ref = useRef(null);
  const fullRef = useRef(null);
  const tierRef = useRef(null);
  const stageRef = useRef(null);

  // Entrance choreography — fires once on mount.
  useEffect(() => {
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !stageRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".results-greet", { y: 14, opacity: 0, duration: 0.5 })
        .from(".results-title .letter", {
          y: 50, opacity: 0, rotate: -6,
          stagger: 0.04, duration: 0.65, ease: "back.out(1.7)",
        }, "-=0.2")
        .from(".results-controls > *", { y: -20, opacity: 0, stagger: 0.08, duration: 0.45 }, "-=0.3");
    }, stageRef);

    return () => ctx.revert();
  }, []);

  // Re-animate the active view (ranking/tier) every time it changes.
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    if (!stageRef.current) return;

    const ctx = gsap.context(() => {
      if (view === "ranking") {
        const tl = gsap.timeline({ defaults: { ease: "back.out(1.4)" } });
        tl.fromTo(
          ".podium-card",
          { y: 80, opacity: 0, rotate: 0, scale: 0.85 },
          { y: 0, opacity: 1, scale: 1, duration: 0.7, stagger: 0.15 }
        ).fromTo(
          ".rest-card",
          { y: 30, opacity: 0, scale: 0.9 },
          { y: 0, opacity: 1, scale: 1, duration: 0.4, stagger: 0.03, ease: "power2.out" },
          "-=0.4"
        );
      } else {
        gsap.fromTo(
          ".tier-row",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power3.out" }
        );
      }
    }, stageRef);

    return () => ctx.revert();
  }, [view, ranking]);

  if (!ranking.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-kawaii font-kawaii font-bold text-ink text-lg">
        {t("noRanking")}
      </div>
    );
  }

  const podium = ranking.slice(0, 3);
  const rest = ranking.slice(3);

  const tierConfig = [
    { key: "oshimen", label: t("tierLabel.oshimen"), count: 1 },
    { key: "niban", label: t("tierLabel.niban"), count: 2 },
    { key: "oshisama", label: t("tierLabel.oshisama"), count: 3 },
    { key: "kikinarai", label: t("tierLabel.kikinarai"), count: 6 },
    { key: "chikasashi", label: t("tierLabel.chikasashi"), count: Infinity },
  ];

  let cursor = 0;
  const tiers = tierConfig.map((tier) => {
    const tierMembers =
      tier.count === Infinity
        ? ranking.slice(cursor)
        : ranking.slice(cursor, cursor + tier.count);
    cursor += tierMembers.length;
    return { ...tier, members: tierMembers };
  });

  const waitForImages = async (element) => {
    const images = element.querySelectorAll("img");
    // Flip any lazy images to eager so they actually start loading before
    // html-to-image serializes the DOM.
    images.forEach((img) => {
      if (img.loading === "lazy") img.loading = "eager";
    });
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

  const exportImage = async (ref, filename) => {
    if (!ref.current) return;
    await waitForImages(ref.current);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) await toPng(ref.current, { cacheBust: true });
    const dataUrl = await toPng(ref.current, {
      cacheBust: true,
      pixelRatio: isIOS ? 1 : 2,
      backgroundColor: "#fff8f0",
    });
    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    link.click();
  };

  const handleShare = async () => {
    const top3Names = podium.map((m, i) => `${i + 1}. ${m.name}`).join("\n");
    const shareUrl = window.location.origin;
    const shareText = `My KLP48 Oshi Ranking! 🏆\n\n${top3Names}\n\nCheck it out here: ${shareUrl}`;

    try {
      if (!top3Ref.current) return;
      await waitForImages(top3Ref.current);
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIOS) await toPng(top3Ref.current, { cacheBust: true });

      const dataUrl = await toPng(top3Ref.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#fff8f0",
      });

      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], "KLP48-Ranking.png", { type: "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "KLP48 Member Sorter",
          text: shareText,
        });
      } else {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
        window.open(twitterUrl, "_blank");
      }
    } catch (error) {
      console.error("Share failed", error);
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, "_blank");
    }
  };

  const podiumIcons = [Crown, Trophy, Medal];

  return (
    <div className="min-h-screen bg-kawaii text-ink relative overflow-hidden font-sans pb-12">

      <div className="absolute -top-32 -left-20 w-[28rem] h-[28rem] bg-sakura-200/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 -right-24 w-[24rem] h-[24rem] bg-emerald-300/40 rounded-full blur-3xl pointer-events-none" />

      <div aria-hidden="true" className="absolute top-16 left-[8%] text-3xl text-amber-400 animate-twinkle">✦</div>
      <div aria-hidden="true" className="absolute top-32 right-[10%] text-2xl text-sakura-500 animate-twinkle" style={{ animationDelay: "1s" }}>✦</div>
      <div aria-hidden="true" className="absolute bottom-1/4 left-[12%] text-2xl text-emerald-500 animate-twinkle" style={{ animationDelay: "0.5s" }}>✦</div>

      <div ref={stageRef} className="max-w-6xl mx-auto relative z-10 px-4 pt-6">

        {/* TITLE */}
        <div className="text-center mb-6 space-y-1">
          <div className="results-greet font-script text-xl text-sakura-600">your oshi ranking ♡</div>
          <h1 className="results-title font-kawaii font-bold text-2xl sm:text-4xl md:text-5xl text-emerald-600 squiggle-underline drop-shadow-[2px_2px_0_#be185d] sm:drop-shadow-[3px_3px_0_#be185d] inline-block break-words px-2">
            <SplitTitle text={"🏆 My Top 3 Oshi"} />
          </h1>
        </div>

        {/* HEADER CONTROLS */}
        <div className="results-controls flex flex-col sm:flex-row justify-between items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/")}
            className="btn-pop bg-white px-4 py-2 rounded-full text-sm font-kawaii font-bold text-ink flex items-center gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("home")}
          </button>

          <div className="flex gap-2 sticker bg-white p-1 rounded-full">
            <button
              onClick={() => setView("ranking")}
              className={`px-4 py-1.5 rounded-full text-sm font-kawaii font-bold transition ${
                view === "ranking"
                  ? "bg-emerald-500 text-white shadow-[2px_2px_0_#064e3b]"
                  : "text-ink hover:bg-cream"
              }`}
            >
              Ranking
            </button>
            <button
              onClick={() => setView("tier")}
              className={`px-4 py-1.5 rounded-full text-sm font-kawaii font-bold transition ${
                view === "tier"
                  ? "bg-sakura-500 text-white shadow-[2px_2px_0_#be185d]"
                  : "text-ink hover:bg-cream"
              }`}
            >
              Tier
            </button>
          </div>
        </div>

        {/* RANKING VIEW */}
        {view === "ranking" && (
          <>
            <div ref={fullRef} className="space-y-8 p-4 rounded-3xl bg-cream">

              {/* PODIUM */}
              <div ref={top3Ref} className="sticker bg-white p-5 sm:p-7 rounded-3xl relative">
                <div className="washi-tape -top-3 left-1/2 -translate-x-1/2 transform -rotate-2" />

                <h2 className="font-kawaii font-bold text-2xl sm:text-3xl text-center text-ink mb-6">
                  Top 3 ⭐
                </h2>

                <div className="grid grid-cols-3 gap-2 sm:gap-6 items-end">
                  {podium.map((m, i) => {
                    const Icon = podiumIcons[i];
                    const tilts = [-2, 2, -3];
                    const heights = ["sm:h-72", "sm:h-60", "sm:h-52"];
                    const orders = [1, 0, 2]; // Center #1 visually
                    return (
                      <div
                        key={m.id}
                        className="podium-card flex flex-col items-center gap-2"
                        style={{ order: orders[i] }}
                      >
                        <div className={`relative polaroid w-full ${i === 0 ? "ring-gold" : i === 1 ? "ring-silver" : "ring-bronze"}`}
                             style={{ "--tilt": `${tilts[i]}deg` }}>
                          <div className="absolute -top-2 -left-2 sm:-top-3 sm:-left-3 z-10 bg-white border-2 border-ink rounded-full w-7 h-7 sm:w-10 sm:h-10 flex items-center justify-center font-kawaii font-bold text-[10px] sm:text-lg shadow-[2px_2px_0_#064e3b]">
                            #{i + 1}
                          </div>
                          <Icon className={`absolute -top-2 -right-2 sm:-top-3 sm:-right-3 z-10 w-6 h-6 sm:w-9 sm:h-9 p-1 sm:p-1.5 bg-white border-2 border-ink rounded-full shadow-[2px_2px_0_#064e3b] ${
                            i === 0 ? "text-amber-500" : i === 1 ? "text-slate-500" : "text-orange-600"
                          }`} />
                          <img
                            src={m.imageUrl}
                            alt={m.name}
                            loading="eager"
                            decoding="async"
                            onError={(e) => { e.target.src = IMAGE_FALLBACK; }}
                            className={`w-full h-32 ${heights[i]} object-cover bg-cream`}
                          />
                          <div className="absolute bottom-1 left-0 right-0 text-center px-2">
                            <div className="font-kawaii font-bold text-xs sm:text-base text-ink truncate">
                              {m.name}
                            </div>
                            <div className="font-script text-xs text-ink/60">
                              {t("generationLabel", { gen: m.generation })}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* FULL LIST */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                {rest.map((m, i) => (
                  <div
                    key={m.id}
                    className="rest-card polaroid relative"
                    style={{ "--tilt": `${(i % 2 === 0 ? -1 : 1) * (1 + (i % 3))}deg` }}
                  >
                    <div className="absolute -top-2 -left-2 z-10 bg-white border-2 border-ink rounded-full w-8 h-8 flex items-center justify-center font-kawaii font-bold text-xs shadow-[2px_2px_0_#064e3b]">
                      #{i + 4}
                    </div>
                    <img
                      src={m.imageUrl}
                      alt={m.name}
                      loading="lazy"
                      decoding="async"
                      onError={(e) => { e.target.src = IMAGE_FALLBACK; }}
                      className="w-full h-32 sm:h-40 object-cover bg-cream"
                    />
                    <div className="absolute bottom-1 left-0 right-0 text-center px-2">
                      <div className="font-kawaii font-bold text-xs text-ink truncate">
                        {m.name}
                      </div>
                      <div className="font-script text-xs text-ink/60 truncate">
                        Gen {m.generation}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* EXPORT/SHARE */}
            <div className="relative max-w-xl mx-auto mt-8">
              <div className="washi-tape -top-3 left-12 transform -rotate-3" />
              <div className="sticker bg-white p-5 rounded-3xl space-y-3">
                <h3 className="text-center font-kawaii font-bold text-emerald-700 flex items-center justify-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  {t("share")}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => exportImage(top3Ref, "KLP48-Top3.png")}
                    className="btn-pop bg-cream px-4 py-2 rounded-full font-kawaii font-bold text-sm text-ink"
                  >
                    📸 {t("exportImage")}
                  </button>
                  <button
                    onClick={() => exportImage(fullRef, "KLP48-FullRanking.png")}
                    className="btn-pop bg-cream px-4 py-2 rounded-full font-kawaii font-bold text-sm text-ink"
                  >
                    📋 Full List
                  </button>
                  <button
                    onClick={handleShare}
                    className="btn-pop-pink sm:col-span-2 bg-gradient-to-r from-sakura-300 to-sakura-500 px-4 py-3 rounded-full font-kawaii font-bold text-white flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    {t("tweet")}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* TIER VIEW */}
        {view === "tier" && (
          <>
            <div ref={tierRef} className="space-y-5 p-4 rounded-3xl bg-cream">
              {tiers.map((tier) => {
                const palette = TIER_PALETTES[tier.key] ?? TIER_PALETTES.chikasashi;
                if (!tier.members.length) return null;
                return (
                  <div
                    key={tier.key}
                    className={`tier-row sticker rounded-3xl p-4 sm:p-5 ${palette.bg}`}
                  >
                    <h3 className={`font-kawaii font-bold text-lg sm:text-xl mb-3 flex items-center gap-2 ${palette.accent}`}>
                      <span className="text-2xl">{palette.icon}</span>
                      {tier.label}
                      <span className="ml-auto font-script text-base text-ink/50">
                        {tier.members.length}
                      </span>
                    </h3>

                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
                      {tier.members.map((m, mi) => (
                        <div
                          key={m.id}
                          className="polaroid"
                          style={{ "--tilt": `${(mi % 2 === 0 ? -1 : 1) * 2}deg` }}
                        >
                          <img
                            src={m.imageUrl}
                            alt={m.name}
                            loading="lazy"
                            decoding="async"
                            onError={(e) => { e.target.src = IMAGE_FALLBACK; }}
                            className="w-full aspect-[3/4] object-cover bg-cream"
                          />
                          <div className="absolute bottom-1 left-0 right-0 text-center px-1">
                            <div className="font-kawaii font-bold text-[10px] sm:text-xs text-ink truncate">
                              {m.name}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="relative max-w-xl mx-auto mt-8">
              <div className="washi-tape -top-3 right-12 transform rotate-3" />
              <div className="sticker bg-white p-5 rounded-3xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => exportImage(tierRef, "KLP48-TierList.png")}
                    className="btn-pop bg-cream px-4 py-2 rounded-full font-kawaii font-bold text-sm text-ink flex items-center justify-center gap-2"
                  >
                    <ImageIcon className="w-4 h-4" />
                    {t("exportImage")}
                  </button>
                  <button
                    onClick={handleShare}
                    className="btn-pop-pink bg-gradient-to-r from-sakura-300 to-sakura-500 px-4 py-2 rounded-full font-kawaii font-bold text-white flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    {t("tweet")}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <footer className="relative z-10 mt-12 pb-6 text-center font-script text-base text-ink/60">
        © 2026 <span className="font-kawaii font-bold text-emerald-600">Malvin Evano</span> · made with 💚 + 🌸
      </footer>
    </div>
  );
}
