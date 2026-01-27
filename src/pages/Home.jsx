import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Globe } from "lucide-react";
import { motion } from "framer-motion";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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

export default function Home() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [status, setStatus] = useState("all");
  const [generation, setGeneration] = useState("all");

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      if (status !== "all" && m.status !== status) return false;
      if (generation !== "all" && m.generation !== Number(generation))
        return false;
      return true;
    });
  }, [status, generation]);

  const handleStart = () => {
    if (filteredMembers.length < 2) {
      alert(t("alertMin"));
      return;
    }
    navigate("/sorter", { state: { members: filteredMembers } });
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
  };

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 overflow-x-hidden relative">
    {/* 🌍 LANGUAGE SWITCHER */}
        <div className="absolute top-4 right-4 z-50">
          <Select value={i18n.language} onValueChange={changeLanguage}>
            <SelectTrigger
              className="h-10 px-4 rounded-full
                        bg-white/90 backdrop-blur
                        border border-emerald-200
                        shadow-md hover:shadow-lg
                        transition flex items-center gap-2"
            >
              <Globe className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold text-emerald-700 uppercase text-sm">
                {i18n.language === "en" && "EN"}
                {i18n.language === "ja" && "JP"}
                {i18n.language === "zh" && "CN"}
                {i18n.language === "ms" && "MY"}
              </span>
            </SelectTrigger>

            <SelectContent align="end">
              <SelectItem value="en">🇺🇸 English</SelectItem>
              <SelectItem value="ja">🇯🇵 日本語</SelectItem>
              <SelectItem value="zh">🇨🇳 中文</SelectItem>
              <SelectItem value="ms">🇲🇾 Bahasa Melayu</SelectItem>
            </SelectContent>
          </Select>
        </div>


      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12">
        {/* LEFT – HERO */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7 flex flex-col justify-center
                     px-4 xs:px-6 sm:px-10 xl:px-24
                     py-16 sm:py-20"
        >
          <h1 className="text-4xl xs:text-5xl sm:text-6xl xl:text-8xl font-black tracking-tight text-emerald-600">
            {t("title")}
          </h1>

          <h2 className="mt-3 text-lg xs:text-xl sm:text-2xl xl:text-4xl font-bold text-gray-800">
            {t("subtitle")}
          </h2>

          <p className="mt-5 max-w-xl text-sm xs:text-base sm:text-lg xl:text-xl text-gray-600 leading-relaxed">
            {t("description")}
          </p>

          <div className="mt-6 flex flex-col xs:flex-row gap-3 xs:items-center">
            <span className="px-4 py-2 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-700 font-semibold text-sm">
              {t("membersReady", { count: filteredMembers.length })}
            </span>
            <span className="text-xs sm:text-sm text-gray-500">
              {t("filterHint")}
            </span>
          </div>
        </motion.section>

        {/* RIGHT – FILTER CARD */}
        <motion.aside
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-5 flex items-center justify-center
                     px-4 xs:px-6 sm:px-10
                     py-16 sm:py-20"
        >
          <Card className="w-full max-w-md sm:max-w-lg bg-white/95 backdrop-blur shadow-xl rounded-xl sm:rounded-2xl">
            <CardHeader className="text-center space-y-1">
              <CardTitle className="text-xl sm:text-2xl">
                {t("filterTitle")}
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                {t("filterDesc")}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5 sm:space-y-6">
              {/* STATUS */}
              <div className="space-y-2">
                <Label>{t("status")}</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder={t("allMembers")} />
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
                <Label>{t("generation")}</Label>
                <Select value={generation} onValueChange={setGeneration}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder={t("allGen")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("allGen")}</SelectItem>
                    <SelectItem value="1">{t("gen1")}</SelectItem>
                    <SelectItem value="2">{t("gen2")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* CTA */}
              <Button
                onClick={handleStart}
                size="lg"
                className="w-full h-12 sm:h-14 text-base sm:text-lg
                           font-bold bg-emerald-600 hover:bg-emerald-700
                           transition active:scale-[0.96]"
              >
                {t("start")}
              </Button>
            </CardContent>
          </Card>
        </motion.aside>
      </div>

      {/* FOOTER */}
      <footer className="w-full py-6 text-center text-xs sm:text-sm text-gray-400">
        © 2026{" "}
        <span className="font-semibold text-gray-500">
          Malvin Evano
        </span>
        . All rights reserved.
      </footer>
    </main>
  );
}
