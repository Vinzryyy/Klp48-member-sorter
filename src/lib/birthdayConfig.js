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
      "/Alice Birthday pic/Alice1.jpg",
      "/Alice Birthday pic/Alice2.jpg",
      "/Alice Birthday pic/Alice3.jpg",
      "/Alice Birthday pic/Alice4.jpg",
      "/Alice Birthday pic/Alice5.jpg",
    ],
    // Floating decorative icons for the background layer.
    floatingIcons: ["🥔", "🌷", "✨", "💛", "🌸", "🥔", "📚", "🎀"],
    // i18n key suffix for the dev message; falls back to "default" if missing.
    devMessageKey: "alice",
    devHearts: ["🥔", "💛"],
  },
  // Kei — "gula-gula" (sweets/candy) running joke from her own posts.
  // Pairs with her stated love of sweet foods. Hobbies (drawing, crochet,
  // animation) get a small nod via floatingIcons but the headline gag is candy.
  21: {
    palette: "gulagula",
    decoCake: ["🍬", "🍭", "🍬"],
    decoBottom: ["🍭", "🍰", "✨", "🍬", "💗"],
    surprisePrefix: "🍬",
    tagline: "for {{name}}, our gula-gula 🍬",
    photos: null,
    floatingIcons: ["🍬", "🍭", "🧁", "🍡", "💗", "✨", "🍰", "🩷"],
    devMessageKey: "kei",
    devHearts: ["🍬", "💗"],
    // Anime fave-character GIFs that Kei posts about. Rendered as a
    // polaroid wall on /gift/21. URL spaces are fine — Vite serves the
    // public folder verbatim and browsers handle the encoding.
    favorites: [
      { src: "/Kei Birthday/Himmel.gif", name: "Himmel", source: "Frieren" },
      { src: "/Kei Birthday/fieren.gif", name: "Frieren", source: "Frieren" },
      { src: "/Kei Birthday/Kaetya.gif", name: "Kaeya", source: "Genshin" },
      { src: "/Kei Birthday/keiya.gif", name: "Keiya", source: null },
    ],
    // Image revealed inside the celebration BigGiftBox when it opens.
    // Replaces the default 🎁 emoji surprise.
    giftBoxReveal: "/Kei Birthday/Keiya birthday.gif",
    // "lollipop" swaps the cake's wax candles for cartoon lollipops.
    candleType: "lollipop",
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
  devHearts: ["💚", "🌸"],
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
    topTierStripes: null,
    bottomTierStripes: null,
    bottomTier: "from-cream to-cream-deep",
    drips: "bg-sakura-300",
    plate: "bg-emerald-200",
    candleStick: "from-sakura-300 to-sakura-500",
    bannerText: "text-emerald-700/80",
    accentText: "text-emerald-700",
    softAccent: "text-sakura-600",
    devTitle: "text-emerald-700",
    giftBow: "bg-sakura-400",
    giftBowCenter: "bg-sakura-500",
    giftLid: "bg-sakura-300",
    giftLidKnot: "bg-sakura-500",
    giftBody: "from-sakura-200 to-sakura-300",
    giftRibbon: "bg-sakura-500",
    giftHalo: "bg-sakura-300/60",
    wrapPaper: "repeating-linear-gradient(45deg, #fbcfe0 0 22px, #fff 22px 44px)",
  },
  potato: {
    pageBg: "bg-amber-50",
    blob1: "bg-amber-200/60",
    blob2: "bg-rose-200/40",
    cardBg: "bg-gradient-to-br from-amber-50 via-rose-50 to-amber-100",
    topTier: "from-rose-100 to-rose-200",
    topTierStripes: null,
    bottomTierStripes: null,
    bottomTier: "from-amber-100 to-amber-300",
    drips: "bg-amber-400",
    plate: "bg-amber-700",
    candleStick: "from-rose-200 to-rose-400",
    bannerText: "text-amber-800",
    accentText: "text-amber-800",
    softAccent: "text-rose-500",
    devTitle: "text-amber-800",
    giftBow: "bg-rose-300",
    giftBowCenter: "bg-rose-500",
    giftLid: "bg-rose-200",
    giftLidKnot: "bg-rose-500",
    giftBody: "from-rose-100 to-rose-200",
    giftRibbon: "bg-rose-500",
    giftHalo: "bg-rose-300/60",
    wrapPaper: "repeating-linear-gradient(45deg, #fde68a 0 22px, #fecaca 22px 44px)",
  },
  gulagula: {
    pageBg: "bg-pink-50",
    blob1: "bg-pink-200/60",
    blob2: "bg-sky-200/50",
    cardBg: "bg-gradient-to-br from-white via-pink-50 to-sky-50",
    topTier: "from-pink-100 to-pink-200",
    // Diagonal sky-blue candy stripes overlaid on the pink top tier — the
    // signature gula-gula visual. Other palettes leave this null.
    topTierStripes:
      "repeating-linear-gradient(45deg, transparent 0 10px, rgba(56,189,248,0.55) 10px 20px)",
    // Vertical pink candy bands on the (sky-blue) bottom tier — completes
    // the candy-shop look. Read like a candy bar.
    bottomTierStripes:
      "repeating-linear-gradient(90deg, transparent 0 14px, rgba(244,114,182,0.45) 14px 28px)",
    bottomTier: "from-sky-50 to-sky-100",
    drips: "bg-pink-300",
    plate: "bg-pink-200",
    candleStick: "from-pink-300 to-pink-500",
    bannerText: "text-pink-700/80",
    accentText: "text-pink-700",
    softAccent: "text-pink-500",
    devTitle: "text-pink-700",
    giftBow: "bg-pink-400",
    giftBowCenter: "bg-pink-500",
    giftLid: "bg-sky-300",
    giftLidKnot: "bg-pink-500",
    giftBody: "from-pink-100 to-pink-200",
    giftRibbon: "bg-sky-400",
    giftHalo: "bg-pink-300/60",
    // Pink + sky candy-cane wrapping paper for the favorites gift box.
    wrapPaper: "repeating-linear-gradient(45deg, #fbcfe0 0 22px, #bae6fd 22px 44px)",
  },
};
