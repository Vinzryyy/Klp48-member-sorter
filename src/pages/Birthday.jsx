import { useMemo, useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Cake, Gift, PartyPopper, ChevronRight, Lock, History } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";

import { members } from "../data/members";
import ProfileModal from "../components/ProfileModal";
import SplitTitle from "../components/SplitTitle";
import { isBirthdayUnlocked } from "../lib/birthdayConfig";

const IMAGE_FALLBACK = "https://placehold.co/400x400?text=KLP48";

const MONTH_KEYS = [
  "jan", "feb", "mar", "apr", "may", "jun",
  "jul", "aug", "sep", "oct", "nov", "dec",
];

function nextBirthdayDate(birthDate, today = new Date()) {
  const [, mm, dd] = birthDate.split("-").map(Number);
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  let next = new Date(today.getFullYear(), mm - 1, dd);
  if (next < todayMidnight) next = new Date(today.getFullYear() + 1, mm - 1, dd);
  return next;
}

function daysUntilNext(birthDate, today = new Date()) {
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((nextBirthdayDate(birthDate, today) - todayMidnight) / 86400000);
}

function ageOnNextBirthday(birthDate, today = new Date()) {
  const [by, bm, bd] = birthDate.split("-").map(Number);
  const tm = today.getMonth() + 1;
  const td = today.getDate();
  const passed = tm > bm || (tm === bm && td > bd);
  return today.getFullYear() - by + (passed ? 1 : 0);
}

function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

// Tracks the calendar day, re-rendering only when the date actually rolls
// over. Checks once a minute — cheap, and far less wasteful than a 1s
// ticker re-rendering the whole page (which would invalidate ~30 cards
// and 5 list memos every second).
function useToday() {
  const [today, setToday] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      const fresh = new Date();
      if (fresh.toDateString() !== today.toDateString()) setToday(fresh);
    }, 60_000);
    return () => clearInterval(id);
  }, [today]);
  return today;
}

export default function Birthday() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedProfile, setSelectedProfile] = useState(null);

  const stageRef = useRef(null);
  // Day-level state — list memos and cards re-render only when the
  // calendar flips. The per-second tick lives inside CountdownCard.
  const today = useToday();
  const todayMonth = today.getMonth() + 1;

  // All active members with a birthDate. Visibility is universal — gating
  // is per-card via the unlock rule (birthday must have arrived this year).
  const activeMembers = useMemo(
    () => members.filter((m) => m.status === "active" && m.birthDate),
    []
  );

  const nextUpcoming = useMemo(() => {
    const ranked = activeMembers
      .map((m) => ({ member: m, target: nextBirthdayDate(m.birthDate, today) }))
      .filter((x) => x.target.getTime() > today.getTime())
      .sort((a, b) => a.target - b.target);
    return ranked[0] ?? null;
  }, [activeMembers, today]);

  const todayBirthdays = useMemo(
    () => activeMembers.filter((m) => daysUntilNext(m.birthDate, today) === 0),
    [activeMembers, today]
  );

  const upcomingThisMonth = useMemo(() => {
    return activeMembers
      .filter((m) => {
        const [, mm] = m.birthDate.split("-").map(Number);
        const days = daysUntilNext(m.birthDate, today);
        return mm === todayMonth && days > 0 && days <= 31;
      })
      .sort((a, b) => daysUntilNext(a.birthDate, today) - daysUntilNext(b.birthDate, today));
  }, [activeMembers, today, todayMonth]);

  const nextUp = useMemo(() => {
    return [...activeMembers]
      .sort((a, b) => daysUntilNext(a.birthDate, today) - daysUntilNext(b.birthDate, today))
      .slice(0, 12);
  }, [activeMembers, today]);

  // Recent celebrations — birthdays that already happened in the current
  // calendar year (so their gift page is unlocked). Sorted most-recent
  // first, capped at 8.
  const recentCelebrations = useMemo(() => {
    return activeMembers
      .filter((m) => {
        if (!isBirthdayUnlocked(m.birthDate, today)) return false;
        return daysUntilNext(m.birthDate, today) > 0; // exclude today's bdays
      })
      .map((m) => {
        const [, mm, dd] = m.birthDate.split("-").map(Number);
        const thisYear = new Date(today.getFullYear(), mm - 1, dd);
        const daysAgo = Math.round(
          (new Date(today.getFullYear(), today.getMonth(), today.getDate()) - thisYear) / 86400000
        );
        return { member: m, daysAgo };
      })
      .sort((a, b) => a.daysAgo - b.daysAgo)
      .slice(0, 8);
  }, [activeMembers, today]);

  useEffect(() => {
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out", clearProps: "transform" } });
      tl.from(".bday-greet", { y: 14, opacity: 0, duration: 0.5 })
        .from(".bday-title .letter", {
          y: 50, opacity: 0, rotate: -6,
          stagger: 0.04, duration: 0.65, ease: "back.out(1.7)",
        }, "-=0.2")
        .from(".bday-countdown", { y: 30, opacity: 0, duration: 0.6, ease: "back.out(1.4)" }, "-=0.2")
        .from(".bday-section", { y: 30, opacity: 0, stagger: 0.15, duration: 0.5 }, "-=0.3");
    }, stageRef);

    return () => ctx.revert();
  }, []);

  const monthLabel = t(`birthday.month.${MONTH_KEYS[todayMonth - 1]}`);

  // Card click — celebrate if unlocked, otherwise show profile modal as a
  // soft fallback so users can still see who the member is.
  const handleCardClick = (m) => {
    if (isBirthdayUnlocked(m.birthDate, today)) {
      navigate(`/gift/${m.id}`);
    } else {
      setSelectedProfile(m);
    }
  };

  const nextUpcomingUnlocked = nextUpcoming
    ? isBirthdayUnlocked(nextUpcoming.member.birthDate, today)
    : false;

  return (
    <main ref={stageRef} className="min-h-screen bg-kawaii text-ink relative overflow-hidden font-sans pb-20">

      <div className="absolute -top-32 -left-20 w-[28rem] h-[28rem] bg-sakura-200/50 rounded-full blur-3xl pointer-events-none animate-aurora motion-reduce:animate-none" />
      <div className="absolute top-40 -right-24 w-[24rem] h-[24rem] bg-emerald-300/40 rounded-full blur-3xl pointer-events-none animate-aurora motion-reduce:animate-none" style={{ animationDelay: "-6s", animationDuration: "22s" }} />

      <div className="idol-particles" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, i) => <span key={i} />)}
      </div>

      <header className="sticky top-3 mx-3 sm:mx-6 z-50 mb-6">
        <div className="sticker bg-white max-w-7xl mx-auto px-3 sm:px-4 py-3 flex items-center justify-between rounded-full gap-2">
          <Link
            to="/"
            className="btn-pop bg-white text-ink font-kawaii font-bold flex items-center gap-1.5 text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-full"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{t("home")}</span>
          </Link>

          <div className="font-kawaii font-bold text-sm sm:text-lg text-ink flex items-center gap-2">
            <span className="text-xl sm:text-2xl">🎂</span>
            <span className="truncate">{t("birthday.headerTitle")}</span>
          </div>

          <Link
            to="/gift"
            className="btn-pop bg-sakura-100 text-ink font-kawaii font-bold flex items-center gap-1.5 text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-full"
          >
            <Gift className="w-4 h-4" />
            <span className="hidden sm:inline">{t("gift.headerTitle")}</span>
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 pt-4">

        <section className="text-center space-y-4 mb-10">
          <div className="bday-greet inline-block font-script text-xl sm:text-2xl text-sakura-600 -rotate-3">
            {t("birthday.greet")}
          </div>
          <h1 className="bday-title font-kawaii font-bold leading-[0.95] text-4xl sm:text-6xl xl:text-7xl tracking-tight">
            <span className="inline-block squiggle-underline text-emerald-600 drop-shadow-[3px_3px_0_#be185d]">
              <SplitTitle text={t("birthday.title")} />
            </span>
          </h1>
          <p className="font-script text-lg text-ink/70">{t("birthday.subtitle")}</p>
        </section>

        {nextUpcoming && (
          <section className="bday-countdown mb-12">
            <CountdownCard
              entry={nextUpcoming}
              t={t}
              unlocked={nextUpcomingUnlocked}
              onClickMember={() => setSelectedProfile(nextUpcoming.member)}
              onCelebrate={() =>
                nextUpcomingUnlocked && navigate(`/gift/${nextUpcoming.member.id}`)
              }
            />
          </section>
        )}

        {todayBirthdays.length > 0 && (
          <section className="bday-section mb-12">
            <div className="sticker bg-white p-5 sm:p-7 relative">
              <div className="washi-tape -top-3 left-8 transform -rotate-6" />
              <div className="flex items-center gap-2 mb-5">
                <Cake className="w-6 h-6 text-sakura-500" />
                <h2 className="font-kawaii font-bold text-xl sm:text-2xl text-ink">
                  {t("birthday.todayHeading")}
                </h2>
                <span className="ml-auto sticker-pink px-3 py-1 rounded-full text-xs font-kawaii font-bold text-sakura-700">
                  {todayBirthdays.length}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {todayBirthdays.map((m) => (
                  <BirthdayCard
                    key={m.id}
                    member={m}
                    age={ageOnNextBirthday(m.birthDate, today)}
                    isToday
                    unlocked={true}
                    onClick={() => handleCardClick(m)}
                    t={t}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="bday-section mb-12">
          <div className="sticker bg-white p-5 sm:p-7 relative">
            <div className="washi-tape -top-3 right-8 transform rotate-3" />
            <div className="flex items-center gap-2 mb-5">
              <PartyPopper className="w-6 h-6 text-emerald-600" />
              <h2 className="font-kawaii font-bold text-xl sm:text-2xl text-ink">
                {t("birthday.thisMonthHeading", { month: monthLabel })}
              </h2>
              <span className="ml-auto sticker px-3 py-1 rounded-full text-xs font-kawaii font-bold text-emerald-700">
                {upcomingThisMonth.length}
              </span>
            </div>

            {upcomingThisMonth.length === 0 ? (
              <p className="font-script text-base text-ink/60 text-center py-6">
                {t("birthday.emptyMonth")}
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {upcomingThisMonth.map((m) => (
                  <BirthdayCard
                    key={m.id}
                    member={m}
                    age={ageOnNextBirthday(m.birthDate, today)}
                    daysAway={daysUntilNext(m.birthDate, today)}
                    unlocked={false}
                    onClick={() => handleCardClick(m)}
                    t={t}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="bday-section mb-12">
          <div className="sticker bg-white p-5 sm:p-7 relative">
            <div className="flex items-center gap-2 mb-5">
              <Gift className="w-6 h-6 text-sakura-500" />
              <h2 className="font-kawaii font-bold text-xl sm:text-2xl text-ink">
                {t("birthday.nextUpHeading")}
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {nextUp.map((m) => (
                <BirthdayCard
                  key={m.id}
                  member={m}
                  age={ageOnNextBirthday(m.birthDate, today)}
                  daysAway={daysUntilNext(m.birthDate, today)}
                  unlocked={isBirthdayUnlocked(m.birthDate, today)}
                  onClick={() => handleCardClick(m)}
                  t={t}
                />
              ))}
            </div>
          </div>
        </section>

        {/* RECENT CELEBRATIONS — already unlocked, available right now */}
        {recentCelebrations.length > 0 && (
          <section className="bday-section mb-12">
            <div className="sticker bg-white p-5 sm:p-7 relative">
              <div className="washi-tape -top-3 left-8 transform -rotate-6" />
              <div className="flex items-center gap-2 mb-5">
                <History className="w-6 h-6 text-emerald-600" />
                <h2 className="font-kawaii font-bold text-xl sm:text-2xl text-ink">
                  {t("birthday.recentHeading")}
                </h2>
                <span className="ml-auto sticker px-3 py-1 rounded-full text-xs font-kawaii font-bold text-emerald-700">
                  {recentCelebrations.length}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {recentCelebrations.map(({ member: m, daysAgo }) => (
                  <BirthdayCard
                    key={m.id}
                    member={m}
                    age={ageOnNextBirthday(m.birthDate, today) - 1}
                    daysAgo={daysAgo}
                    unlocked={true}
                    onClick={() => handleCardClick(m)}
                    t={t}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

      </div>

      <ProfileModal
        member={selectedProfile}
        isOpen={!!selectedProfile}
        onClose={() => setSelectedProfile(null)}
      />
    </main>
  );
}

function CountdownCard({ entry, t, unlocked, onClickMember, onCelebrate }) {
  // Local ticker — only this component re-renders every second. Parent and
  // sibling cards stay still until the calendar day changes.
  const now = useNow(1000);
  const { member, target } = entry;
  const diff = Math.max(0, target.getTime() - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  const [, mm, dd] = member.birthDate.split("-").map(Number);
  const monthLabel = t(`birthday.month.${MONTH_KEYS[mm - 1]}`);
  const age = ageOnNextBirthday(member.birthDate, new Date(now));

  const units = [
    { value: days, label: t("birthday.cd.days") },
    { value: hours, label: t("birthday.cd.hours") },
    { value: minutes, label: t("birthday.cd.minutes") },
    { value: seconds, label: t("birthday.cd.seconds") },
  ];

  return (
    <div className="sticker bg-gradient-to-br from-white via-sakura-50 to-emerald-50 p-5 sm:p-7 relative">
      <div className="washi-tape -top-3 left-1/2 -translate-x-1/2 transform rotate-1" />

      <div className="flex flex-col lg:flex-row items-center gap-6">
        <button
          onClick={onClickMember}
          className="polaroid w-32 sm:w-40 flex-shrink-0 focus:outline-none"
          style={{ "--tilt": "-3deg" }}
        >
          <img
            src={member.imageUrl}
            alt={member.name}
            loading="eager"
            decoding="async"
            onError={(e) => { e.target.src = IMAGE_FALLBACK; }}
            className="w-full aspect-square object-cover bg-cream"
          />
          <div className="absolute bottom-1 left-0 right-0 text-center font-script text-sm text-ink truncate px-2">
            {member.name}
          </div>
        </button>

        <div className="flex-1 text-center lg:text-left min-w-0">
          <div className="font-script text-base sm:text-lg text-sakura-600 mb-1">
            {t("birthday.cd.title")}
          </div>
          <div className="font-kawaii font-bold text-2xl sm:text-3xl text-emerald-700 mb-1 truncate">
            {member.name}
          </div>
          <div className="font-script text-base text-ink/70 mb-4">
            {monthLabel} {dd} · {t("birthday.turning", { age })}
          </div>

          <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-md mx-auto lg:mx-0">
            {units.map((u) => (
              <div
                key={u.label}
                className="sticker bg-white py-3 px-1 rounded-2xl flex flex-col items-center"
              >
                <CountUpDigit value={u.value} />
                <div className="font-kawaii font-bold text-[10px] sm:text-xs text-ink/60 uppercase tracking-wide mt-1">
                  {u.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onCelebrate}
          disabled={!unlocked}
          className={`relative font-kawaii font-bold rounded-3xl px-5 py-5 lg:py-6 flex lg:flex-col items-center justify-center gap-3 lg:gap-2 w-full lg:w-44 flex-shrink-0 border-[3px] border-ink transition ${
            unlocked
              ? "btn-pop-pink bg-gradient-to-br from-sakura-300 via-sakura-400 to-sakura-500 text-white shadow-[5px_5px_0_#be185d]"
              : "bg-cream-deep text-ink/50 shadow-[3px_3px_0_#064e3b] cursor-not-allowed"
          }`}
          aria-label={t("birthday.cd.surpriseAria")}
        >
          <div className="flex items-center gap-2 lg:gap-1 text-2xl lg:text-3xl">
            {unlocked ? (
              <>
                <span aria-hidden="true">🎂</span>
                <span aria-hidden="true">🎁</span>
              </>
            ) : (
              <Lock className="w-7 h-7 lg:w-8 lg:h-8" />
            )}
          </div>
          <div className="text-left lg:text-center">
            <div className="text-xs lg:text-[11px] uppercase tracking-wide opacity-80">
              {unlocked ? t("birthday.cd.surpriseKicker") : t("birthday.cd.lockedKicker")}
            </div>
            <div className="text-base lg:text-lg leading-tight flex items-center gap-1 lg:justify-center">
              {t("birthday.cd.surprise")}
              {unlocked && <ChevronRight className="w-4 h-4 lg:hidden" />}
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}

function CountUpDigit({ value }) {
  return (
    <div className="relative h-8 sm:h-10 w-full overflow-hidden flex items-center justify-center">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -16, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="font-kawaii font-bold text-2xl sm:text-3xl text-sakura-600 tabular-nums"
        >
          {String(value).padStart(2, "0")}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

function BirthdayCard({ member, age, daysAway, daysAgo, isToday, unlocked, onClick, t }) {
  const [, mm, dd] = member.birthDate.split("-").map(Number);
  const monthLabel = t(`birthday.month.${MONTH_KEYS[mm - 1]}`);

  return (
    <button
      onClick={onClick}
      className={`sticker text-left p-3 rounded-2xl flex flex-col gap-2 transition-transform ${
        isToday ? "bg-gradient-to-br from-sakura-100 to-sakura-200" : "bg-white"
      } ${unlocked ? "hover:-translate-y-0.5" : "opacity-90"}`}
    >
      <div className="relative w-full aspect-square overflow-hidden rounded-xl border-2 border-ink">
        <img
          src={member.imageUrl}
          alt={member.name}
          loading="lazy"
          decoding="async"
          onError={(e) => { e.target.src = IMAGE_FALLBACK; }}
          className={`w-full h-full object-cover ${unlocked ? "" : "grayscale-[40%]"}`}
        />
        {isToday && (
          <span className="absolute top-1 right-1 bg-sakura-500 text-white text-[10px] font-kawaii font-bold px-2 py-0.5 rounded-full border-2 border-ink shadow-[2px_2px_0_#be185d]">
            🎂 {t("birthday.todayBadge")}
          </span>
        )}
        {!unlocked && !isToday && (
          <div className="absolute inset-0 bg-ink/20 flex items-center justify-center">
            <span className="bg-white border-2 border-ink rounded-full p-2 shadow-[2px_2px_0_#064e3b]">
              <Lock className="w-4 h-4 text-ink/70" />
            </span>
          </div>
        )}
        {unlocked && !isToday && typeof daysAgo === "number" && (
          <span className="absolute top-1 right-1 bg-emerald-500 text-white text-[10px] font-kawaii font-bold px-2 py-0.5 rounded-full border-2 border-ink shadow-[2px_2px_0_#064e3b]">
            🎁 {t("birthday.openBadge")}
          </span>
        )}
      </div>
      <div className="px-1">
        <div className="font-kawaii font-bold text-ink text-sm truncate">{member.name}</div>
        <div className="font-script text-sm text-ink/70">
          {monthLabel} {dd}
          {typeof daysAway === "number" && daysAway > 0 && (
            <span className="text-ink/50"> · {t("birthday.daysAway", { count: daysAway })}</span>
          )}
          {typeof daysAgo === "number" && daysAgo > 0 && (
            <span className="text-emerald-700"> · {t("birthday.daysAgo", { count: daysAgo })}</span>
          )}
        </div>
        <div className="font-script text-xs text-sakura-600">
          {t("birthday.turning", { age })}
        </div>
      </div>
    </button>
  );
}
