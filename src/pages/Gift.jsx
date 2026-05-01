import { useMemo, useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, Sparkles, Heart, Cake, Gift as GiftIcon, Music, Stars, Smile, X } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";

import { members } from "../data/members";
import SplitTitle from "../components/SplitTitle";
import {
  isBirthdayUnlocked,
  getMemberTheme,
  PALETTE_CLASSES,
} from "../lib/birthdayConfig";

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

export default function Gift() {
  const { t } = useTranslation();
  const { memberId } = useParams();
  const stageRef = useRef(null);
  const [giftOpen, setGiftOpen] = useState(false);
  const [confettiBurst, setConfettiBurst] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  // Honoree resolution:
  //   /gift/:memberId  → that specific member if active and birthday has arrived
  //   /gift            → next active member whose birthday already arrived this year
  // Locked or unknown IDs bounce back to /birthday.
  const requestedId = memberId ? Number(memberId) : null;
  const honoree = useMemo(() => {
    const today = new Date();
    if (requestedId != null) {
      const found = members.find((m) => m.id === requestedId);
      if (
        !found ||
        found.status !== "active" ||
        !found.birthDate ||
        !isBirthdayUnlocked(found.birthDate, today)
      ) {
        return null;
      }
      return found;
    }
    // Default: the most recent unlocked active member.
    return [...members]
      .filter((m) => m.status === "active" && m.birthDate && isBirthdayUnlocked(m.birthDate, today))
      .map((m) => ({ member: m, target: nextBirthdayDate(m.birthDate, today) }))
      .sort((a, b) => a.target - b.target)[0]?.member ?? null;
  }, [requestedId]);

  // GSAP entrance — declared before the early return below so the hook
  // order stays stable across redirect cases (rules of hooks).
  useEffect(() => {
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".gift-greet", { y: 14, opacity: 0, duration: 0.5 })
        .from(".gift-title .letter", {
          y: 50, opacity: 0, rotate: -6,
          stagger: 0.04, duration: 0.65, ease: "back.out(1.7)",
        }, "-=0.2")
        .from(".gift-honoree", { y: 20, opacity: 0, duration: 0.5 }, "-=0.2")
        .from(".gift-gallery > *", { y: 30, opacity: 0, stagger: 0.08, duration: 0.5 }, "-=0.2")
        .from(".gift-cake", { scale: 0.4, opacity: 0, duration: 0.7, ease: "back.out(1.8)" }, "-=0.2")
        .from(".gift-box-stage", { y: 40, opacity: 0, duration: 0.6, ease: "back.out(1.5)" }, "-=0.5");
    }, stageRef);

    return () => ctx.revert();
  }, []);

  // Bounce out for unknown / locked IDs and for the no-honoree case
  // (/gift with no member id and nobody unlocked yet) so we never render
  // a half-empty celebration page.
  if (!honoree) {
    return <Navigate to="/birthday" replace />;
  }

  const theme = honoree ? getMemberTheme(honoree.id) : getMemberTheme(null);
  const palette = PALETTE_CLASSES[theme.palette] ?? PALETTE_CLASSES.default;

  const handleGiftTap = () => {
    setGiftOpen((v) => !v);
    setConfettiBurst((n) => n + 1);
  };

  // Tapping the cake (or the gift box's outer wrapper) launches the
  // big celebration popup — fullscreen gift box, falling confetti, big
  // happy birthday message.
  const handleCelebrationLaunch = () => setShowCelebration(true);

  const honoreeName = honoree?.nickname || honoree?.name;
  const tagline = theme.tagline
    ? theme.tagline.replace("{{name}}", honoreeName ?? "")
    : t("gift.honoreeTagline", { name: honoreeName ?? "" });

  return (
    <main ref={stageRef} className={`min-h-screen ${palette.pageBg} text-ink relative overflow-hidden font-sans pb-20`}>

      <div className={`absolute -top-32 -left-20 w-[28rem] h-[28rem] ${palette.blob1} rounded-full blur-3xl pointer-events-none animate-aurora motion-reduce:animate-none`} />
      <div className={`absolute top-40 -right-24 w-[24rem] h-[24rem] ${palette.blob2} rounded-full blur-3xl pointer-events-none animate-aurora motion-reduce:animate-none`} style={{ animationDelay: "-6s", animationDuration: "22s" }} />

      <div className="idol-particles" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, i) => <span key={i} />)}
      </div>

      <FloatingIcons icons={theme.floatingIcons} />
      <FloatingLucideIcons palette={palette} />

      <header className="sticky top-3 mx-3 sm:mx-6 z-50 mb-6">
        <div className="sticker bg-white max-w-7xl mx-auto px-3 sm:px-4 py-3 flex items-center justify-between rounded-full gap-2">
          <Link
            to="/birthday"
            className="btn-pop bg-white text-ink font-kawaii font-bold flex items-center gap-1.5 text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-full"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{t("birthday.headerTitle")}</span>
          </Link>

          <div className="font-kawaii font-bold text-sm sm:text-lg text-ink flex items-center gap-2">
            <span className="text-xl sm:text-2xl">🎁</span>
            <span className="truncate">{t("gift.headerTitle")}</span>
          </div>

          <div className="w-[60px] sm:w-[90px]" aria-hidden="true" />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 pt-4">

        <section className="text-center space-y-4 mb-8">
          <div className="gift-greet inline-block font-script text-xl sm:text-2xl text-sakura-600 -rotate-3">
            {t("gift.greet")}
          </div>
          <h1 className="gift-title font-kawaii font-bold leading-[0.95] text-4xl sm:text-6xl xl:text-7xl tracking-tight">
            <span className={`inline-block squiggle-underline ${palette.accentText} drop-shadow-[3px_3px_0_#be185d]`}>
              <SplitTitle text={t("gift.title")} />
            </span>
          </h1>
          <p className="font-script text-lg text-ink/70">{t("gift.subtitle")}</p>
        </section>

        {honoree && (
          <div className="gift-honoree max-w-2xl mx-auto mb-12">
            <div className={`sticker ${palette.cardBg} p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-5`}>
              <div
                className="polaroid w-32 sm:w-36 flex-shrink-0"
                style={{ "--tilt": "-3deg" }}
              >
                <img
                  src={honoree.imageUrl}
                  alt={honoree.name}
                  loading="eager"
                  decoding="async"
                  onError={(e) => { e.target.src = IMAGE_FALLBACK; }}
                  className="w-full aspect-square object-cover bg-cream"
                />
                <div className="absolute bottom-1 left-0 right-0 text-center font-script text-sm text-ink truncate px-2">
                  {honoree.name}
                </div>
              </div>

              <div className="flex-1 text-center sm:text-left min-w-0">
                <div className="font-script text-base text-sakura-600 mb-1">
                  {t("gift.forCaption")}
                </div>
                <div className={`font-kawaii font-bold ${palette.accentText} text-2xl sm:text-3xl truncate`}>
                  {honoree.name}
                </div>
                <div className="mt-3 flex items-center gap-2 justify-center sm:justify-start flex-wrap">
                  <DateChip date={honoree.birthDate} t={t} />
                  <span className="font-script text-sm text-ink/60">
                    🎂 {tagline}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PHOTO GALLERY — only renders for members with custom theme photos */}
        {theme.photos && theme.photos.length > 0 && (
          <section className="gift-gallery mb-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
            {theme.photos.map((src, i) => (
              <div
                key={src}
                className="polaroid w-full"
                style={{ "--tilt": `${(i % 2 === 0 ? -1 : 1) * (2 + (i % 3))}deg` }}
              >
                <img
                  src={src}
                  alt={`${honoreeName} birthday ${i + 1}`}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => { e.target.src = IMAGE_FALLBACK; }}
                  className="w-full aspect-[3/4] object-cover bg-cream"
                />
              </div>
            ))}
          </section>
        )}

        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
          <div className="gift-cake flex flex-col items-center">
            <button
              onClick={handleCelebrationLaunch}
              aria-label={t("gift.celebration.cakeAria")}
              className="rounded-3xl focus:outline-none focus:ring-4 focus:ring-sakura-300 transition-transform hover:-translate-y-1 active:scale-95"
            >
              <BirthdayCake nickname={honoreeName} palette={palette} theme={theme} />
            </button>
            <p className={`mt-6 font-kawaii font-bold ${palette.bannerText} text-center`}>
              ✨ {t("gift.celebration.cakeHint")}
            </p>
          </div>

          <div className="gift-box-stage flex flex-col items-center">
            <GiftBox
              open={giftOpen}
              onTap={() => {
                handleGiftTap();
                handleCelebrationLaunch();
              }}
              burstKey={confettiBurst}
              t={t}
              honoreeName={honoreeName}
              palette={palette}
              theme={theme}
            />
            <p className="mt-6 font-kawaii font-bold text-sakura-700 text-center">
              <Sparkles className="w-4 h-4 inline mr-1" />
              {t("gift.celebration.giftHint")}
            </p>
          </div>
        </section>

        <AnimatePresence>
          {showCelebration && (
            <CelebrationModal
              honoreeName={honoreeName}
              theme={theme}
              t={t}
              onClose={() => setShowCelebration(false)}
            />
          )}
        </AnimatePresence>

        {honoree && (
          <section className="gift-dev-msg mt-16 max-w-2xl mx-auto">
            <DevMessageCard
              theme={theme}
              honoreeName={honoreeName}
              t={t}
            />
          </section>
        )}

      </div>
    </main>
  );
}

/* --------------------------- FLOATING ICONS -------------------------- */

function FloatingIcons({ icons }) {
  // 8 icons (was 14) — fewer simultaneous infinite animations for low-end
  // devices. Hidden entirely on small screens (< sm) where the screen is
  // already dense, and skipped under prefers-reduced-motion.
  const reduced = useReducedMotion();
  const positions = useMemo(() => {
    if (!icons || icons.length === 0) return [];
    return Array.from({ length: 8 }).map((_, i) => ({
      emoji: icons[i % icons.length],
      top: `${8 + ((i * 73) % 84)}%`,
      left: `${6 + ((i * 91) % 88)}%`,
      size: 22 + (i % 4) * 8,
      rotate: ((i * 37) % 60) - 30,
      duration: 5 + (i % 5) * 0.7,
      delay: (i * 0.4) % 3,
      drift: 14 + (i % 4) * 6,
    }));
  }, [icons]);

  if (positions.length === 0 || reduced) return null;

  return (
    <div aria-hidden="true" className="hidden sm:block absolute inset-0 pointer-events-none overflow-hidden z-0">
      {positions.map((p, i) => (
        <motion.span
          key={i}
          className="absolute select-none opacity-70 will-change-transform"
          style={{
            top: p.top,
            left: p.left,
            fontSize: p.size,
          }}
          animate={{
            y: [0, -p.drift, 0, p.drift, 0],
            rotate: [p.rotate - 8, p.rotate + 8, p.rotate - 4, p.rotate + 4, p.rotate - 8],
            scale: [0.92, 1.08, 0.95, 1.05, 0.92],
            opacity: [0.5, 0.85, 0.55, 0.8, 0.5],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        >
          {p.emoji}
        </motion.span>
      ))}
    </div>
  );
}

function FloatingLucideIcons({ palette }) {
  // 4 icons (was 7) — kept the most expressive ones. Hidden on mobile and
  // disabled under reduced motion.
  const reduced = useReducedMotion();
  const tint = palette.accentText;
  const items = useMemo(
    () => [
      { Icon: Heart, top: "8%", right: "6%", size: 28, dur: 3.2, delay: 0 },
      { Icon: Stars, top: "62%", right: "4%", size: 32, dur: 3.8, delay: 1.2 },
      { Icon: Cake, top: "78%", left: "6%", size: 30, dur: 4.5, delay: 0.3 },
      { Icon: Sparkles, top: "30%", left: "3%", size: 26, dur: 4.1, delay: 0.6 },
    ],
    []
  );

  if (reduced) return null;

  return (
    <div aria-hidden="true" className="hidden sm:block absolute inset-0 pointer-events-none overflow-hidden z-0">
      {items.map(({ Icon, top, left, right, size, dur, delay }, i) => (
        <motion.div
          key={i}
          className={`absolute ${tint} opacity-30 will-change-transform`}
          style={{ top, left, right }}
          animate={{
            scale: [0.9, 1.15, 0.95, 1.1, 0.9],
            rotate: [-8, 8, -4, 4, -8],
            opacity: [0.2, 0.45, 0.25, 0.4, 0.2],
          }}
          transition={{
            duration: dur,
            repeat: Infinity,
            ease: "easeInOut",
            delay,
          }}
        >
          <Icon style={{ width: size, height: size }} />
        </motion.div>
      ))}
    </div>
  );
}

/* ------------------------- DEVELOPER MESSAGE ------------------------- */

function DevMessageCard({ theme, honoreeName, t }) {
  const reduced = useReducedMotion();
  const key = theme?.devMessageKey ?? "default";
  const title = t(`gift.devMessage.${key}.title`, {
    defaultValue: t("gift.devMessage.default.title"),
    name: honoreeName,
  });
  const body = t(`gift.devMessage.${key}.body`, {
    defaultValue: t("gift.devMessage.default.body"),
    name: honoreeName,
  });
  const signoff = t(`gift.devMessage.${key}.signoff`, {
    defaultValue: t("gift.devMessage.default.signoff"),
  });

  // Static animation props when reduced motion is requested — keeps the
  // composition but stops the continuous loops.
  const envelopeAnim = reduced ? {} : { rotate: [-10, 10, -8, 8, -10] };
  const heartAnim = reduced ? {} : { scale: [1, 1.2, 1, 1.15, 1] };

  return (
    <motion.div
      initial={{ y: 30, opacity: 0, rotate: -1.5 }}
      whileInView={{ y: 0, opacity: 1, rotate: -1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, ease: "backOut" }}
      className="sticker bg-white p-6 sm:p-8 relative"
    >
      <div className="washi-tape -top-3 left-8 transform -rotate-6" />
      <div className="washi-tape -top-3 right-8 transform rotate-3" />

      <div className="flex items-center gap-2 mb-4">
        <motion.span
          className="text-2xl"
          animate={envelopeAnim}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          ✉️
        </motion.span>
        <h3 className="font-kawaii font-bold text-lg sm:text-xl text-emerald-700">
          {title}
        </h3>
      </div>

      <p className="font-script text-base sm:text-lg text-ink/80 leading-relaxed whitespace-pre-line">
        {body}
      </p>

      <div className="mt-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <motion.span
            className="text-xl"
            animate={heartAnim}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            💚
          </motion.span>
          <motion.span
            className="text-xl"
            animate={heartAnim}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          >
            🌸
          </motion.span>
        </div>
        <div className="font-script text-base sm:text-lg text-sakura-600 italic">
          — {signoff}
        </div>
      </div>
    </motion.div>
  );
}

function DateChip({ date, t }) {
  const [, mm, dd] = date.split("-").map(Number);
  const monthLabel = t(`birthday.month.${MONTH_KEYS[mm - 1]}`);
  return (
    <div className="sticker-pink px-3 py-1 rounded-full text-xs font-kawaii font-bold text-sakura-700 whitespace-nowrap">
      {monthLabel} {dd}
    </div>
  );
}

/* ------------------------------- CAKE -------------------------------- */

function BirthdayCake({ nickname, palette, theme }) {
  const reduced = useReducedMotion();
  const candles = [0, 1, 2];
  const topDeco = theme?.decoCake ?? ["🌸", "🍓", "🌸"];
  const bottomDeco = theme?.decoBottom ?? ["💚", "🌸", "✨", "💚", "🌸"];
  const flameAnim = reduced
    ? {}
    : {
        scaleY: [1, 1.18, 0.92, 1.1, 1],
        scaleX: [1, 0.85, 1.12, 0.92, 1],
        rotate: [-2, 3, -1, 2, -2],
      };

  return (
    <div className="flex flex-col items-center select-none">

      <div className="flex gap-5 mb-1 z-10">
        {candles.map((i) => (
          <div key={i} className="flex flex-col items-center">
            <motion.div
              className="w-3 h-5 rounded-[50%] bg-gradient-to-b from-amber-200 via-amber-400 to-orange-500 will-change-transform"
              style={{ boxShadow: "0 0 10px #fbbf24, 0 0 20px #f59e0b" }}
              animate={flameAnim}
              transition={{
                duration: 0.85 + i * 0.13,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <div className="w-[2px] h-1 bg-ink" />
            <div className={`w-2.5 h-12 bg-gradient-to-b ${palette.candleStick} border-2 border-ink rounded-sm relative`}>
              <div className="absolute inset-x-0 top-1/3 h-[2px] bg-white/70" />
            </div>
          </div>
        ))}
      </div>

      <div className={`relative w-44 h-16 bg-gradient-to-b ${palette.topTier} border-[3px] border-ink rounded-2xl shadow-[4px_4px_0_#064e3b]`}>
        <div className="absolute -top-2 left-2 right-2 flex justify-between">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="w-3 h-3 rounded-full bg-white border-2 border-ink" />
          ))}
        </div>
        <div className="absolute inset-0 flex items-center justify-evenly px-3 text-base">
          {topDeco.map((e, i) => <span key={i}>{e}</span>)}
        </div>
        <div className="absolute -bottom-2 left-0 right-0 flex justify-around">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={`w-3 h-4 ${palette.drips} border-x-2 border-b-2 border-ink rounded-b-full`} />
          ))}
        </div>
      </div>

      <div className="h-2" />

      <div className={`relative w-60 h-32 bg-gradient-to-b ${palette.bottomTier} border-[3px] border-ink rounded-2xl shadow-[5px_5px_0_#064e3b]`}>
        <div className="absolute -top-2 left-2 right-2 flex justify-between">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="w-3 h-3 rounded-full bg-white border-2 border-ink" />
          ))}
        </div>
        <div className="absolute inset-0 flex items-center justify-evenly px-4 text-xl">
          {bottomDeco.map((e, i) => <span key={i}>{e}</span>)}
        </div>
        <div className={`absolute bottom-3 left-1/2 -translate-x-1/2 font-script text-xs ${palette.bannerText} whitespace-nowrap max-w-[14rem] truncate px-2`}>
          ♡ happy day{nickname ? `, ${nickname}` : ""} ♡
        </div>
      </div>

      <div className={`w-72 h-3 ${palette.plate} border-[3px] border-ink rounded-full shadow-[3px_3px_0_#064e3b] mt-1`} />
    </div>
  );
}

/* ------------------------------- GIFT -------------------------------- */

function GiftBox({ open, onTap, burstKey, t, honoreeName, theme }) {
  const surprisePrefix = theme?.surprisePrefix ?? "💌";

  return (
    <button
      onClick={onTap}
      aria-label={t("birthday.giftAria")}
      className="relative w-56 h-56 sm:w-60 sm:h-60 outline-none focus:ring-4 focus:ring-sakura-300 rounded-2xl"
    >
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 -top-4 z-30"
        animate={open ? { y: -90, rotate: 18, opacity: 0 } : { y: 0, rotate: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 16 }}
      >
        <div className="relative">
          <div className="absolute -left-6 top-2 w-8 h-10 bg-sakura-400 border-[3px] border-ink rounded-full transform -rotate-12" />
          <div className="absolute -right-6 top-2 w-8 h-10 bg-sakura-400 border-[3px] border-ink rounded-full transform rotate-12" />
          <div className="relative w-8 h-8 bg-sakura-500 border-[3px] border-ink rounded-md mx-auto" />
        </div>
      </motion.div>

      <motion.div
        className="absolute left-0 right-0 top-12 h-12 mx-2 bg-sakura-300 border-[3px] border-ink rounded-lg shadow-[4px_4px_0_#064e3b] z-20"
        animate={open ? { y: -50, rotate: -10, opacity: 0.95 } : { y: 0, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 14 }}
      >
        <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-6 h-3 bg-sakura-500 border-[3px] border-ink rounded-sm" />
      </motion.div>

      <motion.div
        className="absolute left-2 right-2 top-24 bottom-2 bg-gradient-to-b from-sakura-200 to-sakura-300 border-[3px] border-ink rounded-2xl shadow-[5px_5px_0_#064e3b] z-10 overflow-hidden"
        animate={open ? { scale: 1.02 } : { scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-6 bg-sakura-500 border-x-[3px] border-ink" />
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-6 bg-sakura-500 border-y-[3px] border-ink" />
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            key="surprise"
            initial={{ y: 60, opacity: 0, scale: 0.6 }}
            animate={{ y: -10, opacity: 1, scale: 1 }}
            exit={{ y: 60, opacity: 0, scale: 0.6 }}
            transition={{ type: "spring", stiffness: 220, damping: 14 }}
            className="absolute left-1/2 -translate-x-1/2 top-6 z-30 flex flex-col items-center"
          >
            <span className="text-5xl">{surprisePrefix}</span>
            <span className="mt-1 font-kawaii font-bold text-sakura-700 text-sm bg-white px-3 py-1 border-2 border-ink rounded-full shadow-[2px_2px_0_#be185d] max-w-[14rem] truncate">
              {honoreeName
                ? t("birthday.giftSurpriseNamed", { name: honoreeName })
                : t("birthday.giftSurprise")}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {burstKey > 0 && <ConfettiBurst theme={theme} key={burstKey} />}
      </AnimatePresence>
    </button>
  );
}

/* ---------------------- CELEBRATION POPUP MODAL ---------------------- */

function CelebrationModal({ honoreeName, theme, t, onClose }) {
  // Auto-stage the animation: gift starts closed, opens after a short
  // delay, then the message + falling confetti continue while the user
  // takes it in. Close button + backdrop click both dismiss.
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setOpened(true), 350);
    return () => clearTimeout(id);
  }, []);

  // Esc closes the modal
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Lock body scroll while modal is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  const surprisePool =
    theme?.palette === "potato"
      ? ["🥔", "💛", "✨", "🎉", "🌷", "🥔", "💌", "🌟"]
      : ["🌸", "💚", "✨", "🎉", "💌", "🍀", "🎀", "🌟"];

  return (
    <motion.div
      key="celebration"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[100] bg-ink/60 backdrop-blur-md overflow-y-auto overflow-x-hidden"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={t("gift.celebration.modalAria")}
    >
      {/* Falling confetti — fixed so it spans the viewport even when the
          modal content is taller than the screen and scrolls. */}
      <div className="fixed inset-0 pointer-events-none">
        <FallingConfetti pool={surprisePool} />
      </div>

      {/* Close button — fixed to top-right of viewport so it stays put
          when the modal content scrolls. Bigger tap target on mobile. */}
      <button
        onClick={onClose}
        aria-label={t("gift.celebration.close")}
        className="fixed top-3 right-3 sm:top-6 sm:right-6 z-50 bg-white border-2 border-ink rounded-full p-2.5 sm:p-2 shadow-[3px_3px_0_#064e3b] hover:bg-cream transition active:scale-95"
      >
        <X className="w-5 h-5 text-ink" />
      </button>

      {/* Centring wrapper — min-h-full lets the modal stage sit centred
          when it fits, and scroll naturally on landscape/short viewports
          where the gift box + headline + button overflow vertically. */}
      <div className="min-h-full flex items-center justify-center px-4 py-12">

      {/* Stage — clicking inside doesn't close */}
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.6, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.6, y: 40, opacity: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        className="relative w-full max-w-md flex flex-col items-center"
      >
        <BigGiftBox opened={opened} />

        <AnimatePresence>
          {opened && (
            <>
              <motion.div
                key="msg"
                initial={{ y: 30, opacity: 0, scale: 0.7 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.1 }}
                className="mt-6 text-center px-4 max-w-full"
              >
                <div className="font-kawaii font-bold text-2xl sm:text-3xl md:text-4xl text-white drop-shadow-[2px_2px_0_#be185d] sm:drop-shadow-[3px_3px_0_#be185d] break-words">
                  🎂 {t("gift.celebration.headline", { name: honoreeName ?? "" })}
                </div>
                <div className="mt-3 font-script text-base sm:text-lg md:text-xl text-white/90 break-words">
                  {t("gift.celebration.subline")}
                </div>
              </motion.div>

              <motion.button
                key="closeBig"
                onClick={onClose}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="mt-6 btn-pop bg-white text-ink font-kawaii font-bold px-6 py-3 rounded-full text-sm sm:text-base shadow-[4px_4px_0_#064e3b] border-[3px] border-ink"
              >
                💚 {t("gift.celebration.thanks")}
              </motion.button>

              {/* Center burst confetti — fired once on open */}
              <ConfettiBurst theme={theme} key="burst" />
            </>
          )}
        </AnimatePresence>
      </motion.div>
      </div>
    </motion.div>
  );
}

function BigGiftBox({ opened }) {
  return (
    <div className="relative w-64 h-64 sm:w-72 sm:h-72">

      {/* Glow halo behind the box */}
      <motion.div
        className="absolute inset-0 rounded-full bg-sakura-300/60 blur-3xl"
        animate={opened
          ? { scale: [1, 1.5, 1.3], opacity: [0.6, 0.9, 0.7] }
          : { scale: 1, opacity: 0.4 }}
        transition={{ duration: 1.2, repeat: opened ? Infinity : 0, repeatType: "reverse" }}
      />

      {/* Bow */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 -top-6 z-30"
        animate={opened
          ? { y: -160, rotate: 25, opacity: 0 }
          : { y: 0, rotate: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
      >
        <div className="relative">
          <div className="absolute -left-9 top-3 w-12 h-14 bg-sakura-400 border-[3px] border-ink rounded-full transform -rotate-12 shadow-[3px_3px_0_#be185d]" />
          <div className="absolute -right-9 top-3 w-12 h-14 bg-sakura-400 border-[3px] border-ink rounded-full transform rotate-12 shadow-[3px_3px_0_#be185d]" />
          <div className="relative w-10 h-10 bg-sakura-500 border-[3px] border-ink rounded-md mx-auto shadow-[3px_3px_0_#be185d]" />
        </div>
      </motion.div>

      {/* Lid */}
      <motion.div
        className="absolute left-0 right-0 top-14 h-16 mx-2 bg-sakura-300 border-[3px] border-ink rounded-lg shadow-[5px_5px_0_#064e3b] z-20"
        animate={opened
          ? { y: -80, rotate: -14, opacity: 0.95 }
          : { y: 0, rotate: 0 }}
        transition={{ type: "spring", stiffness: 180, damping: 14 }}
      >
        <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-8 h-4 bg-sakura-500 border-[3px] border-ink rounded-sm" />
      </motion.div>

      {/* Box body */}
      <motion.div
        className="absolute left-2 right-2 top-28 bottom-2 bg-gradient-to-b from-sakura-200 to-sakura-300 border-[3px] border-ink rounded-3xl shadow-[6px_6px_0_#064e3b] z-10 overflow-hidden"
        animate={opened ? { scale: 1.04 } : { scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-8 bg-sakura-500 border-x-[3px] border-ink" />
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-8 bg-sakura-500 border-y-[3px] border-ink" />
      </motion.div>

      {/* Surprise popping out */}
      <AnimatePresence>
        {opened && (
          <motion.div
            key="surprise"
            initial={{ y: 90, scale: 0.4, opacity: 0 }}
            animate={{ y: -30, scale: 1.1, opacity: 1 }}
            exit={{ y: 90, scale: 0.4, opacity: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 14, delay: 0.15 }}
            className="absolute left-1/2 -translate-x-1/2 top-2 z-40"
          >
            <div className="text-7xl sm:text-8xl drop-shadow-[3px_3px_0_#be185d]">🎁</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FallingConfetti({ pool }) {
  // 30 pieces (was 50) — fewer simultaneous animations means smoother
  // playback on low-end devices. Skipped entirely under reduced motion.
  // Random positions are computed once via useState lazy init so they
  // stay stable across renders (useMemo with Math.random can re-roll).
  const reduced = useReducedMotion();
  const [pieces] = useState(() =>
    Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      drift: (Math.random() - 0.5) * 40,
      duration: 3.5 + Math.random() * 2.5,
      delay: Math.random() * 1.5,
      rotateEnd: (Math.random() - 0.5) * 720,
      size: 18 + Math.floor(Math.random() * 18),
      emoji: pool[i % pool.length],
    }))
  );

  if (reduced) return null;

  return (
    <div aria-hidden="true" className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute select-none will-change-transform"
          style={{
            left: `${p.left}%`,
            top: "-10%",
            fontSize: p.size,
          }}
          initial={{ y: -50, rotate: 0, opacity: 0 }}
          animate={{
            y: ["0vh", "110vh"],
            x: [0, p.drift, -p.drift, 0],
            rotate: [0, p.rotateEnd],
            opacity: [0, 1, 1, 0.8],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {p.emoji}
        </motion.span>
      ))}
    </div>
  );
}

function ConfettiBurst({ theme }) {
  // Random distances/delays computed once via useState lazy init —
  // this component is keyed by burst count so it remounts per burst,
  // and we don't want React Compiler re-rolling positions mid-animation.
  const [pieces] = useState(() => {
    const pool =
      theme?.palette === "potato"
        ? ["🥔", "💛", "✨", "🎉", "🌷", "🥔"]
        : ["🌸", "💚", "✨", "🎉", "💌", "🍀"];
    return Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      angle: (i / 18) * Math.PI * 2,
      distance: 80 + Math.random() * 60,
      delay: Math.random() * 0.05,
      emoji: pool[i % pool.length],
    }));
  });

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-40">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute text-2xl"
          initial={{ x: 0, y: 0, opacity: 1, scale: 0.4 }}
          animate={{
            x: Math.cos(p.angle) * p.distance,
            y: Math.sin(p.angle) * p.distance,
            opacity: 0,
            scale: 1.1,
          }}
          transition={{ duration: 1.1, delay: p.delay, ease: "easeOut" }}
        >
          {p.emoji}
        </motion.span>
      ))}
    </div>
  );
}
