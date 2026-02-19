import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Search, ArrowLeft, Users, Filter, Info } from "lucide-react";
import { motion } from "framer-motion";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

export default function Members() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [generation, setGeneration] = useState("all");
  const [selectedProfile, setSelectedProfile] = useState(null);

  const IMAGE_FALLBACK = "https://placehold.co/400x600?text=KLP48";

  // Filter Logic
  const filtered = useMemo(() => {
    return members.filter((m) => {
      const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || 
                            m.fullName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = status === "all" || m.status === status;
      const matchesGen = generation === "all" || m.generation === Number(generation);
      
      return matchesSearch && matchesStatus && matchesGen;
    });
  }, [search, status, generation]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 pb-20">
      
      {/* HEADER */}
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/")} className="text-emerald-700 font-bold">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("back")}
          </Button>
          <h1 className="text-xl font-black text-emerald-600 flex items-center gap-2">
            <Users className="w-5 h-5" />
            {t("membersPage.title")}
          </h1>
          <div className="w-20"></div> {/* Spacer */}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pt-8">
        
        {/* CONTROLS */}
        <section className="bg-white/70 backdrop-blur p-6 rounded-3xl shadow-xl border border-emerald-100 mb-10 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                placeholder={t("membersPage.searchPlaceholder")} 
                className="pl-10 rounded-full border-emerald-100 focus:ring-emerald-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Filter Status */}
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="rounded-full border-emerald-100">
                <SelectValue placeholder={t("status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("membersPage.allStatus")}</SelectItem>
                <SelectItem value="active">{t("active")}</SelectItem>
                <SelectItem value="graduated">{t("graduated")}</SelectItem>
              </SelectContent>
            </Select>

            {/* Filter Gen */}
            <Select value={generation} onValueChange={setGeneration}>
              <SelectTrigger className="rounded-full border-emerald-100">
                <SelectValue placeholder={t("generation")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("membersPage.allGen")}</SelectItem>
                <SelectItem value="1">{t("gen1")}</SelectItem>
                <SelectItem value="2">{t("gen2")}</SelectItem>
              </SelectContent>
            </Select>

          </div>
          
          <p className="text-xs text-emerald-600 font-bold px-2">
            {t("membersPage.showingCount", { count: filtered.length })}
          </p>
        </section>

        {/* GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {filtered.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card 
                onClick={() => setSelectedProfile(m)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border-emerald-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 bg-white"
              >
                {/* Image */}
                <div className="aspect-[3/4] overflow-hidden">
                  <img 
                    src={m.imageUrl} 
                    alt={m.name} 
                    onError={(e) => { e.target.src = IMAGE_FALLBACK; }}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                </div>

                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                   <h3 className="font-bold text-sm sm:text-base leading-tight">{m.name}</h3>
                   <p className="text-[10px] opacity-80 uppercase tracking-widest font-bold">
                     {t("membersPage.generation", { gen: m.generation })}
                   </p>
                </div>

                <div className="absolute top-2 right-2 p-1.5 bg-white/20 backdrop-blur rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Info className="w-4 h-4 text-white" />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 font-medium">{t("membersPage.noResults")}</p>
          </div>
        )}

      </main>

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

    </div>
  );
}
