import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import { Globe, Star, Sparkles, Users } from "lucide-react";
import { motion } from "framer-motion";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import ProfileModal from "../components/ProfileModal";

export default function Home() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { setMembers } = useRankStore();

  const [status, setStatus] = useState("all");
  const [generation, setGeneration] = useState("all");
  const [selectedProfile, setSelectedProfile] = useState(null);

  const IMAGE_FALLBACK = "https://placehold.co/400x400?text=KLP48";

  // Filter members
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      if (status !== "all" && m.status !== status) return false;
      if (generation !== "all" && m.generation !== Number(generation))
        return false;
      return true;
    });
  }, [status, generation]);

  // Random avatars
  const randomMembers = useMemo(() => {
    return members
      .filter((m) => m.status === "active")
      .sort(() => 0.5 - Math.random())
      .slice(0, 6);
  }, []);

  const handleStart = () => {
    if (filteredMembers.length < 2) {
      alert(t("alertMin"));
      return;
    }
    setMembers(filteredMembers);
    navigate("/sorter");
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-100 to-emerald-100 text-gray-900 relative overflow-hidden">

      {/* Glow */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-300/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-green-300/30 rounded-full blur-3xl" />

      {/* HEADER */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur border-b border-emerald-200 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 grid grid-cols-3 items-center">

          {/* LEFT LOGO */}
          <h1 className="font-black text-lg text-emerald-600 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            KLP48 Sorter
          </h1>

          {/* CENTER EMPTY */}
          <div className="flex justify-center">
            <Link 
              to="/members" 
              className="flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:text-emerald-500 transition px-4 py-2 bg-emerald-50/50 rounded-full"
            >
              <Users className="w-4 h-4" />
              Members
            </Link>
          </div>

          {/* RIGHT LANGUAGE */}
          <div className="flex justify-end">
            <Select value={i18n.language} onValueChange={changeLanguage}>
              <SelectTrigger className="h-9 px-3 rounded-full border border-emerald-200 shadow-sm bg-white flex items-center gap-2 text-sm font-bold text-emerald-700">
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
      <div className="pt-24 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 px-4">

        {/* LEFT HERO */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7 space-y-6"
        >
          <div className="relative space-y-3">
            <div className="absolute -inset-2 bg-emerald-400/30 blur-3xl rounded-full"></div>

            <h1 className="relative text-4xl sm:text-6xl xl:text-7xl font-black text-emerald-600 drop-shadow-lg">
              {t("title")}
            </h1>

            <span className="inline-block px-4 py-1 bg-white/80 border border-emerald-200 rounded-full text-sm font-semibold text-emerald-600 shadow">
              🌟 {t("subtitle")}
            </span>

            <p className="text-lg text-green-700 max-w-xl">
              {t("description")}
            </p>
          </div>

          <div className="flex items-center -space-x-6 mt-4">
            {randomMembers.map((m, i) => (
              <motion.img
                key={m.id}
                src={m.imageUrl}
                alt={m.name}
                title={m.fullName}
                onClick={() => setSelectedProfile(m)}
                onError={(e) => { e.target.src = IMAGE_FALLBACK; }}
                initial={{ rotate: i % 2 === 0 ? -5 : 5 }}
                whileHover={{ scale: 1.1, rotate: 0, zIndex: 10, cursor: 'pointer' }}
                className="w-20 h-20 sm:w-24 sm:h-24 xl:w-28 xl:h-28 rounded-full border-4 border-white shadow-2xl ring-4 ring-emerald-300 ring-offset-2 bg-white relative"
              />
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mt-6">
            <Button
              onClick={handleStart}
              className="w-full sm:w-auto px-8 py-6 text-lg font-black bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 rounded-full shadow-xl hover:scale-110 transition animate-pulse"
            >
              💚 {t("startRanking")}
            </Button>

            <span className="flex items-center gap-2 px-4 py-2 bg-white/90 rounded-full border border-emerald-200 shadow-sm font-semibold text-emerald-600 text-sm">
              <Star className="w-4 h-4" />
              {t("membersReadyShort", { count: filteredMembers.length })}
            </span>
          </div>

          {/* Stats */}
          <div className="flex gap-6 mt-2 text-sm font-semibold text-emerald-700">
            <span>🎤 {members.length} {t("members")}</span>
            <span>✨ 2 {t("generation")}</span>
            <span>💿 {t("active")}</span>
          </div>
        </motion.section>

        {/* RIGHT FILTER */}
        <motion.aside
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-5 flex justify-center"
        >
          <Card className="w-full sm:max-w-md bg-white/70 backdrop-blur-xl border border-emerald-200 shadow-2xl rounded-3xl">
            <CardHeader className="text-center">
              <CardTitle className="text-xl sm:text-2xl text-emerald-600">
                {t("filterMembersTitle")}
              </CardTitle>
              <CardDescription>
                {t("filterMembersDesc")}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">

              {/* STATUS */}
              <div className="space-y-2">
                <Label className="font-semibold text-emerald-700">{t("status")}</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="h-12 rounded-full border-emerald-200">
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
                <Label className="font-semibold text-emerald-700">{t("generation")}</Label>
                <Select value={generation} onValueChange={setGeneration}>
                  <SelectTrigger className="h-12 rounded-full border-emerald-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("allGen")}</SelectItem>
                    <SelectItem value="1">{t("gen1")}</SelectItem>
                    <SelectItem value="2">{t("gen2")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* START BUTTON */}
              <Button
                onClick={handleStart}
                className="w-full h-14 text-lg font-black bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 hover:scale-110 transition shadow-xl rounded-full"
              >
                 {t("start")}
              </Button>

            </CardContent>
          </Card>
        </motion.aside>
      </div>

      {/* FOOTER */}
      <footer className="mt-20 py-6 text-center text-sm text-green-700">
        © 2026 <span className="font-semibold text-emerald-600">Malvin Evano</span> • Fan-made project
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
