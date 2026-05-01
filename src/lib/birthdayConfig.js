// Birthday gating + per-member theme registry.
//
// A member's gift page is unlocked once their birthday arrives in the
// current calendar year, and stays unlocked until the next one. So a
// member with bday Apr 30 is unlocked from Apr 30 onward (until next
// Jan 1 starts the cycle again).

export function isBirthdayUnlocked(birthDate, today = new Date()) {
  const [, mm, dd] = birthDate.split("-").map(Number);
  const tm = today.getMonth() + 1;
  const td = today.getDate();
  if (tm > mm) return true;
  if (tm < mm) return false;
  return td >= dd;
}

// Per-member celebration themes. Members without an entry get the default
// sakura/emerald look. Add new themes by member id (see members.js).
const THEMES = {
  // Alice — birthday photoshoot is rich brown backdrop with golden potatoes
  // and a soft pink dress. Theme leans into the "potato queen" running joke.
  15: {
    palette: "potato",
    decoCake: ["🥔", "🌷", "🥔"],
    decoBottom: ["🥔", "💛", "✨", "🥔", "💛"],
    surprisePrefix: "🥔",
    tagline: "for {{name}}, our potato queen 🥔",
    photos: [
      "/Alice Birthday pic/Alice1.png",
      "/Alice Birthday pic/Alice2.png",
      "/Alice Birthday pic/Alice3.png",
      "/Alice Birthday pic/Alice4.png",
      "/Alice Birthday pic/Alice5.png",
    ],
    // Floating decorative icons for the background layer.
    floatingIcons: ["🥔", "🌷", "✨", "💛", "🌸", "🥔", "📚", "🎀"],
    // i18n key suffix for the dev message; falls back to "default" if missing.
    devMessageKey: "alice",
  },
};

const DEFAULT_THEME = {
  palette: "default",
  decoCake: ["🌸", "🍓", "🌸"],
  decoBottom: ["💚", "🌸", "✨", "💚", "🌸"],
  surprisePrefix: "💌",
  tagline: null, // falls back to gift.honoreeTagline i18n
  photos: null,
  floatingIcons: ["🌸", "💚", "✨", "🍀", "🎀", "💌"],
  devMessageKey: "default",
};

export function getMemberTheme(memberId) {
  return THEMES[memberId] ?? DEFAULT_THEME;
}

// Tailwind class bundles per palette. Kept as plain strings so Tailwind's
// content scan picks them up at build time.
export const PALETTE_CLASSES = {
  default: {
    pageBg: "bg-kawaii",
    blob1: "bg-sakura-200/50",
    blob2: "bg-emerald-300/40",
    cardBg: "bg-gradient-to-br from-white via-sakura-50 to-emerald-50",
    topTier: "from-sakura-100 to-sakura-200",
    bottomTier: "from-cream to-cream-deep",
    drips: "bg-sakura-300",
    plate: "bg-emerald-200",
    candleStick: "from-sakura-300 to-sakura-500",
    bannerText: "text-emerald-700/80",
    accentText: "text-emerald-700",
  },
  potato: {
    pageBg: "bg-amber-50",
    blob1: "bg-amber-200/60",
    blob2: "bg-rose-200/40",
    cardBg: "bg-gradient-to-br from-amber-50 via-rose-50 to-amber-100",
    topTier: "from-rose-100 to-rose-200",
    bottomTier: "from-amber-100 to-amber-300",
    drips: "bg-amber-400",
    plate: "bg-amber-700",
    candleStick: "from-rose-200 to-rose-400",
    bannerText: "text-amber-800",
    accentText: "text-amber-800",
  },
};
