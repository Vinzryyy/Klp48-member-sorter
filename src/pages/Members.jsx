import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Search, ArrowLeft, Users } from "lucide-react";
import { motion } from "framer-motion";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { members } from "../data/members";
import ProfileModal from "../components/ProfileModal";

const IMAGE_FALLBACK = "https://placehold.co/400x600?text=KLP48";

export default function Members() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [generation, setGeneration] = useState("all");
  const [selectedProfile, setSelectedProfile] = useState(null);

  const filtered = useMemo(() => {
    return members.filter((m) => {
      const q = search.toLowerCase();
      const matchesSearch =
        m.name.toLowerCase().includes(q) ||
        m.fullName.toLowerCase().includes(q);
      const matchesStatus = status === "all" || m.status === status;
      const matchesGen = generation === "all" || m.generation === Number(generation);
      return matchesSearch && matchesStatus && matchesGen;
    });
  }, [search, status, generation]);

  return (
    <div className="min-h-screen bg-kawaii text-ink relative overflow-hidden font-sans pb-12">

      <div className="absolute -top-32 -left-20 w-[28rem] h-[28rem] bg-sakura-200/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 -right-24 w-[24rem] h-[24rem] bg-emerald-300/40 rounded-full blur-3xl pointer-events-none" />

      <div aria-hidden="true" className="absolute top-20 left-[6%] text-2xl text-sakura-500 animate-twinkle">✦</div>
      <div aria-hidden="true" className="absolute top-1/3 right-[8%] text-3xl text-emerald-500 animate-twinkle" style={{ animationDelay: "1s" }}>✦</div>
      <div aria-hidden="true" className="absolute bottom-1/4 left-[15%] text-xl text-sakura-400 animate-twinkle" style={{ animationDelay: "0.5s" }}>✦</div>

      {/* HEADER — sticker pill */}
      <header className="sticky top-3 mx-3 sm:mx-6 z-40 mb-6">
        <div className="sticker bg-white max-w-7xl mx-auto px-4 py-3 grid grid-cols-3 items-center rounded-full">
          <button
            onClick={() => navigate("/")}
            className="btn-pop bg-cream px-3 py-1.5 rounded-full text-xs sm:text-sm font-kawaii font-bold text-ink flex items-center gap-1.5 w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{t("back")}</span>
          </button>

          <h1 className="font-kawaii font-bold text-base sm:text-xl text-emerald-700 flex items-center justify-center gap-2">
            <Users className="w-5 h-5" />
            <span>{t("membersPage.title")}</span>
          </h1>

          <div className="flex justify-end">
            <span className="sticker-pink bg-white px-3 py-1 rounded-full text-xs sm:text-sm font-kawaii font-bold text-sakura-700">
              {filtered.length}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">

        {/* CONTROLS — sticker note */}
        <section className="relative mb-10">
          <div className="washi-tape -top-3 left-12 transform -rotate-6" />
          <div className="washi-tape -top-3 right-12 transform rotate-3" />

          <div className="sticker bg-white p-5 sm:p-6 rounded-3xl space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/50 z-10" />
                <Input
                  placeholder={t("membersPage.searchPlaceholder")}
                  className="pl-10 h-11 rounded-full border-2 border-ink bg-cream font-kawaii font-bold text-ink shadow-[3px_3px_0_#064e3b] focus-visible:ring-0"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="h-11 rounded-full border-2 border-ink bg-cream font-kawaii font-bold text-ink shadow-[3px_3px_0_#064e3b]">
                  <SelectValue placeholder={t("status")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("membersPage.allStatus")}</SelectItem>
                  <SelectItem value="active">{t("active")}</SelectItem>
                  <SelectItem value="graduated">{t("graduated")}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={generation} onValueChange={setGeneration}>
                <SelectTrigger className="h-11 rounded-full border-2 border-ink bg-cream font-kawaii font-bold text-ink shadow-[3px_3px_0_#064e3b]">
                  <SelectValue placeholder={t("generation")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("membersPage.allGen")}</SelectItem>
                  <SelectItem value="1">{t("gen1")}</SelectItem>
                  <SelectItem value="2">{t("gen2")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <p className="font-script text-base text-sakura-600 px-2">
              {t("membersPage.showingCount", { count: filtered.length })}
            </p>
          </div>
        </section>

        {/* GRID — polaroid cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 sm:gap-7">
          {filtered.map((m, i) => (
            <motion.button
              key={m.id}
              onClick={() => setSelectedProfile(m)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.6) }}
              className="polaroid w-full focus:outline-none text-left"
              style={{ "--tilt": `${(i % 2 === 0 ? -1 : 1) * (1 + (i % 3))}deg` }}
            >
              <div className="aspect-[3/4] overflow-hidden bg-cream">
                <img
                  src={m.imageUrl}
                  alt={m.name}
                  onError={(e) => { e.target.src = IMAGE_FALLBACK; }}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-1 left-0 right-0 text-center px-2">
                <div className="font-kawaii font-bold text-sm text-ink truncate">
                  {m.name}
                </div>
                <div className="font-script text-xs text-ink/60 truncate">
                  Gen {m.generation}{m.status === "graduated" && " · 卒"}
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="font-script text-3xl text-sakura-500 mb-2">¯\_(ツ)_/¯</div>
            <p className="font-kawaii font-bold text-ink/60">{t("membersPage.noResults")}</p>
          </div>
        )}
      </main>

      <footer className="relative z-10 mt-16 pb-6 text-center font-script text-base text-ink/60">
        © 2026 <span className="font-kawaii font-bold text-emerald-600">Malvin Evano</span> · made with 💚 + 🌸
      </footer>

      <ProfileModal
        member={selectedProfile}
        isOpen={!!selectedProfile}
        onClose={() => setSelectedProfile(null)}
      />
    </div>
  );
}
