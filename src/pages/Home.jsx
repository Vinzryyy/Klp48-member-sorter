import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import { Globe, Star, Users, Heart } from "lucide-react";
import { motion } from "framer-motion";

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

  const handleStart = () => {
    if (filteredMembers.length < 2) {
      setError(t("alertMin"));
      return;
    }
    setMembers(filteredMembers);
    navigate("/sorter");
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
      <div className="absolute -top-32 -left-20 w-[28rem] h-[28rem] bg-sakura-200/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 -right-24 w-[24rem] h-[24rem] bg-emerald-300/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-[22rem] h-[22rem] bg-sakura-100 rounded-full blur-3xl pointer-events-none" />

      {/* Sparkle decorations */}
      {sparkles.map((s, i) => (
        <motion.div
          key={i}
          aria-hidden="true"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: s.delay, type: "spring", stiffness: 200 }}
          className="absolute text-sakura-500 pointer-events-none animate-twinkle"
          style={{
            top: s.top,
            left: s.left,
            right: s.right,
            fontSize: s.size,
            transform: `rotate(${s.rotate}deg)`,
          }}
        >
          ✦
        </motion.div>
      ))}

      {/* HEADER — chunky sticker bar */}
      <header className="sticky top-3 mx-3 sm:mx-6 z-50 mb-6">
        <div className="sticker bg-white max-w-7xl mx-auto px-4 py-3 grid grid-cols-3 items-center rounded-full">

          {/* Logo */}
          <Link to="/" className="font-kawaii font-bold text-base sm:text-lg text-ink flex items-center gap-2">
            <span className="text-2xl">🍀</span>
            <span className="hidden sm:inline">KLP48 Sorter</span>
          </Link>

          {/* Members nav as chunky tag */}
          <div className="flex justify-center">
            <Link
              to="/members"
              className="btn-pop bg-sakura-100 text-ink font-kawaii font-bold flex items-center gap-1.5 text-xs sm:text-sm px-4 py-2 rounded-full"
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Members</span>
            </Link>
          </div>

          {/* Language */}
          <div className="flex justify-end">
            <Select value={i18n.language} onValueChange={changeLanguage}>
              <SelectTrigger className="h-9 px-3 rounded-full border-2 border-ink bg-white flex items-center gap-2 text-sm font-kawaii font-bold text-ink shadow-[2px_2px_0_#064e3b]">
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

      {/* MAIN */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 px-4 sm:px-6 relative z-10 pt-4 pb-20">

        {/* LEFT HERO */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7 space-y-8"
        >
          {/* Greeting note in handwritten script */}
          <motion.div
            initial={{ opacity: 0, x: -20, rotate: -3 }}
            animate={{ opacity: 1, x: 0, rotate: -3 }}
            transition={{ delay: 0.4 }}
            className="inline-block font-script text-xl sm:text-2xl text-sakura-600"
          >
            hi, oshi-hunter ♡
          </motion.div>

          {/* TITLE */}
          <div className="space-y-2">
            <h1 className="font-kawaii font-bold leading-[0.95] text-5xl sm:text-7xl xl:text-8xl tracking-tight">
              <span className="inline-block squiggle-underline text-emerald-600 drop-shadow-[4px_4px_0_#be185d]">
                {t("title")}
              </span>
            </h1>
          </div>

          {/* Subtitle as rotated sticker badge */}
          <motion.span
            whileHover={{ rotate: 0, scale: 1.05 }}
            className="inline-block sticker-pink px-4 py-2 text-sm font-kawaii font-bold text-sakura-700 transform -rotate-2"
          >
            🌸 {t("subtitle")}
          </motion.span>

          <p className="text-lg text-ink/80 max-w-xl leading-relaxed">
            {t("description")}
          </p>

          {/* Polaroid avatars */}
          <div className="flex items-end flex-wrap gap-3 sm:gap-4 pt-4">
            {randomMembers.map((m, i) => (
              <motion.button
                key={m.id}
                onClick={() => setSelectedProfile(m)}
                title={m.fullName}
                initial={{ opacity: 0, y: 30, rotate: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.08, type: "spring", stiffness: 180 }}
                className="polaroid w-20 sm:w-24 xl:w-28 cursor-pointer focus:outline-none"
                style={{ "--tilt": `${(i % 2 === 0 ? -1 : 1) * (3 + (i % 3) * 2)}deg` }}
              >
                <img
                  src={m.imageUrl}
                  alt={m.name}
                  onError={(e) => { e.target.src = IMAGE_FALLBACK; }}
                  className="w-full aspect-square object-cover bg-cream"
                />
                <div className="absolute bottom-1 left-0 right-0 text-center font-script text-sm text-ink truncate px-2">
                  {m.name}
                </div>
              </motion.button>
            ))}
          </div>

          {/* CTA row */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center pt-4">
            <button
              onClick={handleStart}
              className="btn-pop bg-gradient-to-r from-emerald-300 to-emerald-500 px-8 py-4 text-lg font-kawaii font-bold rounded-full text-white"
            >
              💚 {t("startRanking")}
            </button>

            <span className="sticker bg-white inline-flex items-center gap-2 px-4 py-2 rounded-full font-kawaii font-bold text-emerald-700 text-sm transform rotate-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              {t("membersReadyShort", { count: filteredMembers.length })}
            </span>
          </div>

          {/* Stats row as sticker chips */}
          <div className="flex flex-wrap gap-3 pt-2">
            <span className="sticker-pink bg-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-kawaii font-bold text-sakura-700">
              🎤 {members.length} {t("members")}
            </span>
            <span className="sticker bg-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-kawaii font-bold text-emerald-700">
              ✨ 2 {t("generation")}
            </span>
            <span className="sticker bg-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-kawaii font-bold text-emerald-700">
              💿 {t("active")}
            </span>
          </div>
        </motion.section>

        {/* RIGHT FILTER — sticker note with washi tape */}
        <motion.aside
          initial={{ opacity: 0, y: 30, rotate: 2 }}
          animate={{ opacity: 1, y: 0, rotate: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-5 flex justify-center pt-8 lg:pt-16"
        >
          <div className="relative w-full sm:max-w-md">
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
                onClick={handleStart}
                className="btn-pop-pink w-full h-14 rounded-full bg-gradient-to-r from-sakura-300 to-sakura-500 text-white font-kawaii font-bold text-lg"
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
        </motion.aside>
      </div>

      {/* FOOTER */}
      <footer className="relative z-10 pb-8 text-center font-script text-base text-ink/60">
        © 2026 <span className="font-kawaii font-bold text-emerald-600">Malvin Evano</span> · made with 💚 + 🌸
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
