import { useState, useMemo, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import { Globe, Star, Users, Heart, RotateCw, X, Cake } from "lucide-react";
import { motion } from "framer-motion";
import { gsap } from "gsap";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

import { members } from "../data/members";
import { useRankStore } from "../store/useRankStore";
import { shuffle } from "../lib/shuffle";
import { useMagnetic } from "../lib/animations";
import { peekSession, loadSession, clearSession } from "../lib/sortPersistence";
import SplitTitle from "../components/SplitTitle";
import ProfileModal from "../components/ProfileModal";

const IMAGE_FALLBACK = "https://placehold.co/400x400?text=KLP48";

export default function Home() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { setMembers } = useRankStore();

  const [status, setStatus] = useState("all");
  const [generation, setGeneration] = useState("all");
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [error, setError] = useState("");
  const [resumePeek, setResumePeek] = useState(() => peekSession());

  // GSAP entrance choreography
  const heroRef = useRef(null);
  const polaroidRowRef = useRef(null);
  const filterCardRef = useRef(null);
  const ctaRef = useMagnetic({ strength: 0.25 });
  const ctaPinkRef = useMagnetic({ strength: 0.25 });

  useEffect(() => {
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero-greet", { y: 16, opacity: 0, duration: 0.5 })
        .from(".hero-title .letter", {
          y: 50,
          opacity: 0,
          rotate: -6,
          stagger: 0.04,
          duration: 0.7,
          ease: "back.out(1.7)",
        }, "-=0.2")
        .from(".hero-badge", { scale: 0.6, opacity: 0, duration: 0.5, ease: "back.out(2)" }, "-=0.4")
        .from(".hero-desc", { y: 12, opacity: 0, duration: 0.5 }, "-=0.3")
        .from(polaroidRowRef.current?.children ?? [], {
          y: 60,
          opacity: 0,
          rotate: 0,
          stagger: 0.08,
          duration: 0.7,
          ease: "back.out(1.4)",
        }, "-=0.2")
        .from(".hero-cta-row > *", {
          y: 20,
          opacity: 0,
          stagger: 0.1,
          duration: 0.5,
        }, "-=0.3")
        .from(".hero-stats > *", {
          y: 12,
          opacity: 0,
          stagger: 0.06,
          duration: 0.4,
        }, "-=0.4")
        .from(filterCardRef.current, {
          x: 60,
          opacity: 0,
          rotate: 8,
          duration: 0.8,
          ease: "back.out(1.4)",
        }, "-=0.9");
    }, heroRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (error) setError("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, generation]);

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      if (status !== "all" && m.status !== status) return false;
      if (generation !== "all" && m.generation !== Number(generation)) return false;
      return true;
    });
  }, [status, generation]);

  const randomMembers = useMemo(
    () => shuffle(members.filter((m) => m.status === "active")).slice(0, 6),
    []
  );

  const activeCount = useMemo(
    () => members.filter((m) => m.status === "active").length,
    []
  );

  const generationCount = useMemo(
    () => Math.max(...members.map((m) => m.generation)),
    []
  );

  const handleStart = () => {
    if (filteredMembers.length < 2) {
      setError(t("alertMin"));
      return;
    }
    // Starting a fresh sort — abandon any saved session whose member set
    // would otherwise auto-resume in Sorter.
    clearSession();
    setMembers(filteredMembers);
    navigate("/sorter");
  };

  const handleResume = () => {
    const saved = loadSession();
    if (!saved) {
      setResumePeek(null);
      return;
    }
    setMembers(saved.sessionMembers);
    navigate("/sorter");
  };

  const handleDiscardSession = () => {
    clearSession();
    setResumePeek(null);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
  };

  // Hand-placed decorations — keep sparse so the page doesn't get messy.
  const sparkles = [
    { top: "12%", left: "5%",  size: 24, rotate: -10, delay: 0 },
    { top: "8%",  right: "12%", size: 32, rotate: 15,  delay: 0.6 },
    { top: "55%", left: "3%",  size: 20, rotate: 25,  delay: 1.2 },
    { top: "70%", right: "6%",  size: 28, rotate: -20, delay: 0.3 },
    { top: "88%", left: "45%", size: 22, rotate: 8,   delay: 1.5 },
  ];

  return (
    <main className="min-h-screen bg-kawaii text-ink relative overflow-hidden font-sans">

      {/* Soft pink + emerald gradient blobs (sit BELOW halftone) */}
      <div className="absolute -top-32 -left-20 w-[28rem] h-[28rem] bg-sakura-200/50 rounded-full blur-3xl pointer-events-none animate-aurora motion-reduce:animate-none" />
      <div className="absolute top-40 -right-24 w-[24rem] h-[24rem] bg-emerald-300/40 rounded-full blur-3xl pointer-events-none animate-aurora motion-reduce:animate-none" style={{ animationDelay: "-6s", animationDuration: "22s" }} />
      <div className="absolute bottom-0 left-1/3 w-[22rem] h-[22rem] bg-sakura-100 rounded-full blur-3xl pointer-events-none animate-aurora motion-reduce:animate-none" style={{ animationDelay: "-12s", animationDuration: "26s" }} />

      {/* Floating idol particles — twinkling dots layer */}
      <div className="idol-particles" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, i) => <span key={i} />)}
      </div>

      {/* Sparkle decorations — drift + twinkle continuously */}
      {sparkles.map((s, i) => (
        <motion.div
          key={i}
          aria-hidden="true"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [0.9, 1.2, 0.9],
            y: [0, -14, 0],
            rotate: [s.rotate - 6, s.rotate + 6, s.rotate - 6],
          }}
          transition={{
            duration: 4.5 + i * 0.6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: s.delay,
          }}
          className="absolute text-sakura-500 pointer-events-none"
          style={{
            top: s.top,
            left: s.left,
            right: s.right,
            fontSize: s.size,
          }}
        >
          ✦
        </motion.div>
      ))}

      {/* HEADER — chunky sticker bar */}
      <header className="sticky top-3 mx-3 sm:mx-6 z-50 mb-6">
        <div className="sticker bg-white max-w-7xl mx-auto px-3 sm:px-4 py-3 grid grid-cols-3 items-center rounded-full gap-2">

          {/* Logo */}
          <Link to="/" className="font-kawaii font-bold text-sm sm:text-lg text-ink flex items-center gap-2 min-w-0">
            <span className="text-xl sm:text-2xl flex-shrink-0">🍀</span>
            <span className="hidden sm:inline truncate">KLP48 Sorter</span>
          </Link>

          {/* Members + Birthday nav */}
          <div className="flex justify-center items-center min-w-0 gap-2">
            <Link
              to="/members"
              className="btn-pop bg-sakura-100 text-ink font-kawaii font-bold flex items-center gap-1.5 text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-full"
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Members</span>
            </Link>
            <Link
              to="/birthday"
              className="btn-pop bg-emerald-100 text-ink font-kawaii font-bold flex items-center gap-1.5 text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-full"
            >
              <Cake className="w-4 h-4" />
              <span className="hidden sm:inline">{t("birthday.headerTitle")}</span>
            </Link>
          </div>

          {/* Language */}
          <div className="flex justify-end min-w-0">
            <Select value={i18n.language} onValueChange={changeLanguage}>
              <SelectTrigger className="h-9 px-2 sm:px-3 rounded-full border-2 border-ink bg-white flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-kawaii font-bold text-ink shadow-[2px_2px_0_#064e3b]">
                <Globe className="w-4 h-4 text-emerald-600" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="end" className="min-w-[120px]">
                <SelectItem value="en">🇺🇸 EN</SelectItem>
                <SelectItem value="ja">🇯🇵 JP</SelectItem>
                <SelectItem value="zh">🇨🇳 CN</SelectItem>
                <SelectItem value="ms">🇲🇾 MY</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      {/* MARQUEE BELT — slow scrolling vibe ribbon */}
      <div className="relative z-10 max-w-7xl mx-auto mb-2 overflow-hidden mask-fade px-4 sm:px-6">
        <motion.div
          aria-hidden="true"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
          className="flex gap-10 whitespace-nowrap font-kawaii font-bold text-emerald-700/70 text-sm sm:text-base"
        >
          {Array.from({ length: 2 }).flatMap((_, k) => [
            <span key={`a${k}`}>🌸 your oshi awaits</span>,
            <span key={`b${k}`}>💚 KLP48 ranking</span>,
            <span key={`c${k}`} className="text-sakura-600">✦ tournament style</span>,
            <span key={`d${k}`}>🍀 pick · sort · share</span>,
            <span key={`e${k}`} className="text-sakura-600">♡ made for fans</span>,
            <span key={`f${k}`}>✨ {activeCount} members ready</span>,
          ])}
        </motion.div>
      </div>

      {/* RESUME BANNER — only rendered when a saved session exists */}
      {resumePeek && (
        <motion.div
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 22 }}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 mb-6"
        >
          <div className="sticker bg-white relative px-4 sm:px-5 py-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              onClick={handleDiscardSession}
              aria-label={t("resumeDiscard")}
              className="absolute top-2 right-2 p-1.5 rounded-full text-ink/60 hover:text-ink hover:bg-cream-deep transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex-1 min-w-0 pr-6">
              <div className="flex items-center gap-2 font-kawaii font-bold text-ink text-base sm:text-lg">
                <RotateCw className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span className="truncate">{t("resumeTitle")}</span>
              </div>
              <p className="font-script text-base text-ink/70 mt-0.5">
                {t("resumeProgress", {
                  progress: resumePeek.progress,
                  comparisons: resumePeek.comparisons,
                })}
                {" · "}
                {t("resumeMembers", { count: resumePeek.total })}
              </p>

              {/* Progress bar */}
              <div className="mt-2 bg-cream-deep rounded-full h-2 overflow-hidden border-2 border-ink">
                <div
                  className="h-full bg-gradient-to-r from-sakura-300 via-sakura-400 to-emerald-400 transition-all duration-500"
                  style={{ width: `${resumePeek.progress}%` }}
                />
              </div>
            </div>

            <button
              onClick={handleResume}
              className="btn-pop bg-gradient-to-r from-emerald-300 to-emerald-500 text-white font-kawaii font-bold rounded-full px-6 py-3 text-sm sm:text-base whitespace-nowrap"
            >
              ▶ {t("resumeCta")}
            </button>
          </div>
        </motion.div>
      )}

      {/* MAIN */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 px-4 sm:px-6 relative z-10 pt-4 pb-20">

        {/* LEFT HERO */}
        <section ref={heroRef} className="lg:col-span-7 space-y-8">
          {/* Greeting note in handwritten script */}
          <div className="hero-greet inline-block font-script text-xl sm:text-2xl text-sakura-600 -rotate-3">
            hi, oshi-hunter ♡
          </div>

          {/* TITLE — per-letter spans for GSAP letter stagger */}
          <div className="space-y-2">
            <h1 className="hero-title font-kawaii font-bold leading-[0.95] text-4xl sm:text-6xl xl:text-7xl tracking-tight break-words">
              <span className="inline-block squiggle-underline text-emerald-600 drop-shadow-[3px_3px_0_#be185d]">
                <SplitTitle text={t("title")} />
              </span>
            </h1>
          </div>

          {/* Subtitle as rotated sticker badge */}
          <span className="hero-badge inline-block sticker-pink px-4 py-2 text-sm font-kawaii font-bold text-sakura-700 transform -rotate-2">
            🌸 {t("subtitle")}
          </span>

          <p className="hero-desc text-lg text-ink/80 max-w-xl leading-relaxed">
            {t("description")}
          </p>

          {/* Polaroid avatars */}
          <div ref={polaroidRowRef} className="flex items-end flex-wrap gap-3 sm:gap-4 pt-4">
            {randomMembers.map((m, i) => (
              <button
                key={m.id}
                onClick={() => setSelectedProfile(m)}
                title={m.fullName}
                className="polaroid w-20 sm:w-24 xl:w-28 cursor-pointer focus:outline-none"
                style={{ "--tilt": `${(i % 2 === 0 ? -1 : 1) * (3 + (i % 3) * 2)}deg` }}
              >
                <img
                  src={m.imageUrl}
                  alt={m.name}
                  loading="eager"
                  decoding="async"
                  onError={(e) => { e.target.src = IMAGE_FALLBACK; }}
                  className="w-full aspect-square object-cover bg-cream"
                />
                <div className="absolute bottom-1 left-0 right-0 text-center font-script text-sm text-ink truncate px-2">
                  {m.name}
                </div>
              </button>
            ))}
          </div>

          {/* CTA row */}
          <div className="hero-cta-row flex flex-col sm:flex-row gap-4 items-start sm:items-center pt-4">
            <button
              ref={ctaRef}
              onClick={handleStart}
              className="btn-pop bg-gradient-to-r from-emerald-300 via-emerald-400 to-emerald-500 bg-[length:200%_auto] animate-gradient-shift motion-reduce:animate-none px-8 py-4 text-lg font-kawaii font-bold rounded-full text-white"
            >
              💚 {t("startRanking")}
            </button>

            <span className="sticker bg-white inline-flex items-center gap-2 px-4 py-2 rounded-full font-kawaii font-bold text-emerald-700 text-sm transform rotate-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              {t("membersReadyShort", { count: filteredMembers.length })}
            </span>
          </div>

          {/* Stats row as sticker chips */}
          <div className="hero-stats flex flex-wrap gap-3 pt-2">
            <span className="sticker-pink bg-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-kawaii font-bold text-sakura-700">
              🎤 {members.length} {t("members")}
            </span>
            <span className="sticker bg-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-kawaii font-bold text-emerald-700">
              ✨ {generationCount} {t("generation")}
            </span>
            <span className="sticker bg-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-kawaii font-bold text-emerald-700">
              💿 {t("active")}
            </span>
          </div>
        </section>

        {/* RIGHT FILTER — sticker note with washi tape */}
        <aside className="lg:col-span-5 flex justify-center pt-8 lg:pt-16">
          <div ref={filterCardRef} className="relative w-full sm:max-w-md">
            {/* Washi tape strips */}
            <div className="washi-tape -top-3 left-8 transform -rotate-6" />
            <div className="washi-tape -top-3 right-8 transform rotate-3" />

            <div className="sticker bg-white rounded-3xl p-6 sm:p-7 space-y-5">

              {/* Header */}
              <div className="text-center space-y-1">
                <h2 className="font-kawaii font-bold text-xl sm:text-2xl text-ink flex items-center justify-center gap-2">
                  <Heart className="w-5 h-5 fill-sakura-500 text-sakura-500" />
                  {t("filterMembersTitle")}
                </h2>
                <p className="font-script text-base text-ink/60">
                  {t("filterMembersDesc")}
                </p>
              </div>

              {/* STATUS */}
              <div className="space-y-2">
                <Label className="font-kawaii font-bold text-ink text-sm">
                  {t("status")}
                </Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="h-12 rounded-full border-2 border-ink bg-cream font-kawaii font-bold text-ink shadow-[3px_3px_0_#064e3b]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("allMembers")}</SelectItem>
                    <SelectItem value="active">{t("active")}</SelectItem>
                    <SelectItem value="graduated">{t("graduated")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* GENERATION */}
              <div className="space-y-2">
                <Label className="font-kawaii font-bold text-ink text-sm">
                  {t("generation")}
                </Label>
                <Select value={generation} onValueChange={setGeneration}>
                  <SelectTrigger className="h-12 rounded-full border-2 border-ink bg-cream font-kawaii font-bold text-ink shadow-[3px_3px_0_#064e3b]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("allGen")}</SelectItem>
                    <SelectItem value="1">{t("gen1")}</SelectItem>
                    <SelectItem value="2">{t("gen2")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* START BUTTON — pink pop */}
              <button
                ref={ctaPinkRef}
                onClick={handleStart}
                className="btn-pop-pink w-full h-14 rounded-full bg-gradient-to-r from-sakura-300 via-sakura-400 to-sakura-500 bg-[length:200%_auto] animate-gradient-shift motion-reduce:animate-none text-white font-kawaii font-bold text-lg"
              >
                {t("start")} →
              </button>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="alert"
                  className="text-center text-sm font-kawaii font-bold text-sakura-700 bg-sakura-50 border-2 border-sakura-300 rounded-2xl py-2 px-3"
                >
                  {error}
                </motion.p>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* FOOTER */}
      <footer className="relative z-10 pb-8 text-center font-script text-base text-ink/60">
        © {new Date().getFullYear()} <span className="font-kawaii font-bold text-emerald-600">Malvin Evano</span> · made with 💚 + 🌸
      </footer>

      {/* Profile Modal */}
      <ProfileModal
        member={selectedProfile}
        isOpen={!!selectedProfile}
        onClose={() => setSelectedProfile(null)}
      />
    </main>
  );
}
