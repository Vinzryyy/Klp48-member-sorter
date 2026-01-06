import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
import { motion } from "framer-motion";
import { members } from "../data/members";

export default function Home() {
  const navigate = useNavigate();

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
      alert("Please select at least 2 members to start ranking!");
      return;
    }
    navigate("/sorter", { state: { members: filteredMembers } });
  };

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 overflow-x-hidden">
      {/* GRID */}
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
            KLP48 Member Sorter
          </h1>

          <h2 className="mt-3 text-lg xs:text-xl sm:text-2xl xl:text-4xl font-bold text-gray-800">
            Pick you Oshi
          </h2>

          <p className="mt-5 max-w-xl text-sm xs:text-base sm:text-lg xl:text-xl text-gray-600 leading-relaxed">
            Rank your KLP48 favorites and find your bias. A simple app built by fans.
          </p>

          <div className="mt-6 flex flex-col xs:flex-row gap-3 xs:items-center">
            <span className="px-4 py-2 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-700 font-semibold text-sm">
              {filteredMembers.length} members ready
            </span>
            <span className="text-xs sm:text-sm text-gray-500">
              Filter and start ranking instantly
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
                Filter Members
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Choose your preferences before ranking
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5 sm:space-y-6">
              {/* STATUS */}
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="graduated">Graduated</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* GENERATION */}
              <div className="space-y-2">
                <Label>Generation</Label>
                <Select value={generation} onValueChange={setGeneration}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="All generations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All generations</SelectItem>
                    <SelectItem value="1">Generation 1</SelectItem>
                    <SelectItem value="2">Generation 2</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  Select “All” to include every member
                </p>
              </div>

              {/* CTA */}
              <Button
                onClick={handleStart}
                size="lg"
                className="w-full h-12 sm:h-14 text-base sm:text-lg
                           font-bold bg-emerald-600 hover:bg-emerald-700
                           transition active:scale-[0.96]"
              >
                Start Ranking 🚀
              </Button>
            </CardContent>
          </Card>
        </motion.aside>
      </div>

      {/* FOOTER */}
      <footer className="w-full py-6 text-center text-xs sm:text-sm text-gray-400">
        © 2026 <span className="font-semibold text-gray-500">Malvin Evano</span>. All rights reserved.
        </footer>
    </main>
  );
}
