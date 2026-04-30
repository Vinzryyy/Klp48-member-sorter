# 🍀 KLP48 Member Sorter

[![Framework](https://img.shields.io/badge/Framework-React%2019-emerald)](https://react.dev/)
[![Build Tool](https://img.shields.io/badge/Build%20Tool-Vite-646CFF)](https://vitejs.dev/)
[![Animation](https://img.shields.io/badge/Animation-GSAP-88CE02)](https://gsap.com/)
[![Deployment](https://img.shields.io/badge/Deployment-Vercel-black)](https://vercel.com/)
[![i18n](https://img.shields.io/badge/i18n-4%20Languages-green)](https://react.i18next.com/)
[![Tests](https://img.shields.io/badge/Tests-Vitest-FCC72A)](https://vitest.dev/)

**KLP48 Member Sorter** is a fan-made web app that ranks your favorite KLP48 members through an interactive merge-sort tournament. Built mobile-first with a kawaii / Tokyo-pop aesthetic, GSAP-powered motion, and 4-language localization.

🔗 **Live Demo:** [klp48-member-sorter.vercel.app](https://klp48-member-sorter.vercel.app)

---

## 🌟 Features

### 🧠 Real merge-sort algorithm
Pairwise comparisons feed an interactive merge-sort state machine — the same logic powers idol sorters across the genre. Result is mathematically consistent given consistent user judgments.

- **Undo** — every pick is reversible. Step back as far as you need.
- **Tie / Equal** — when you can't decide, both members go forward together with one comparison spent.
- **Keyboard shortcuts** (desktop) — ←/→ pick, space tie, Z undo, R restart. Press `?` for the full overlay.

### 🎴 Member directory
Browse the complete KLP48 roster (Gen 1 & Gen 2). Search by name, filter by status (Active/Graduated) and generation. Tap any face for a polaroid-style profile card with hobbies, birth date, and Instagram link.

### 🌍 4 languages
Fully localized in English, Bahasa Melayu, 中文, and 日本語. Language preference persists in `localStorage`.

### 📸 Share your ranking
- **Top 3 podium** with gold/silver/bronze polaroid frames.
- **Tier list** (Oshimen, Niban, Oshisama, Kikinarai, Chikasashi) with palette-coded rows.
- **One-tap PNG export** of any view via `html-to-image`.
- **Native mobile share sheet** on iOS/Android (Web Share API with file payload), Twitter Web Intent fallback on desktop.

### 🎨 Kawaii / Tokyo-pop UI
- Cream halftone background with sakura + emerald accents.
- Sticker-bordered cards with offset hard shadows and washi tape strips.
- Polaroid-framed photos with handwritten captions in Caveat.
- 3D pop buttons that snap when pressed; magnetic CTAs that follow the cursor.
- GSAP-orchestrated entrances (per-letter title stagger, polaroid drop-in, podium reveal).
- Full `prefers-reduced-motion` respect — every animation has an off switch.

### ⚡️ Loading
- Static HTML pre-boot loader (visible during HTML parse, before JS).
- React preloader takes over with a GSAP intro: per-letter "KLP48 Sorter" stagger, bouncing dots, fill bar, curtain-pull exit.
- Route-level lazy loading via `React.lazy` + `Suspense`.
- Below-the-fold images use `loading="lazy"` + `decoding="async"`; export safety guaranteed by flipping lazy to eager before `html-to-image` serializes.

---

## 🛠️ Tech Stack

- **Framework:** React 19 + Vite 7
- **Styling:** Tailwind CSS 3 with custom kawaii utility layer (`sticker`, `polaroid`, `btn-pop`, `washi-tape`, `idol-shimmer`, `aurora-emerald`)
- **Animation:** GSAP 3 (timelines, magnetic hover, scroll-aware staggers); framer-motion for modal entrance only
- **State:** Zustand (`useRankStore`) + a pure merge-sort reducer in `src/lib/mergeSortMachine.js`
- **i18n:** react-i18next with localStorage persistence
- **Components:** Radix UI primitives via shadcn-ui
- **Image export:** html-to-image
- **Fonts:** Fredoka (display), Caveat (handwritten), Nunito (body)
- **Tests:** Vitest

---

## 🚀 Local development

```bash
git clone https://github.com/Vinzryyy/Klp48-member-sorter.git
cd Klp48-member-sorter
npm install
npm run dev
```

| Script           | What it does                          |
|------------------|---------------------------------------|
| `npm run dev`    | Vite dev server                       |
| `npm run build`  | Production bundle to `dist/`          |
| `npm run preview`| Preview the production build locally  |
| `npm run lint`   | ESLint                                |
| `npm test`       | Run the Vitest suite once             |
| `npm run test:watch` | Vitest in watch mode              |

---

## 📁 Project structure

```
src/
├── App.jsx                  # Routes + Suspense + Preloader mount
├── main.jsx                 # React boot + boot-loader handoff
├── i18n.js                  # All 4 translation tables
├── pages/
│   ├── Home.jsx             # Filter + start the sort
│   ├── Sorter.jsx           # Pairwise merge-sort UI
│   ├── Results.jsx          # Podium + full list + tier list + share
│   ├── Members.jsx          # Searchable directory
│   └── ErrorPage.jsx        # Caught by ErrorBoundary
├── components/
│   ├── Preloader.jsx        # GSAP intro screen
│   ├── ProfileModal.jsx     # Member detail card
│   ├── SplitTitle.jsx       # Per-letter title for GSAP, word-safe wrapping
│   ├── ErrorBoundary.jsx
│   └── ui/                  # shadcn primitives
├── lib/
│   ├── mergeSortMachine.js  # Reducer + init + autoAdvance (pure)
│   ├── mergeSortMachine.test.js  # 13 Vitest cases
│   ├── animations.js        # useGsapTimeline, useStaggerReveal, useMagnetic
│   ├── shuffle.js           # Fisher-Yates
│   ├── errorHandler.js      # Window-level error capture
│   └── utils.js             # cn() class merger
├── store/
│   └── useRankStore.js      # Zustand: filtered members + final ranking
└── data/
    └── members.js           # Roster data
```

---

## 📱 Mobile

- Mobile-first layouts; tested on 320–414px widths.
- Touch-optimized tap targets (large polaroids, btn-pop chips).
- Sticky sticker-pill headers stay accessible while scrolling.
- Web Share API for native iOS/Android share sheet with the exported PNG.

---

## 📄 License & Disclaimer

This is a **fan-made project** for entertainment. Member images and trademarks belong to their respective owners (**KLP48 / Superball Inc.**).

Released under MIT — see [LICENSE](./LICENSE).

Created with 💚 + 🌸 by **Malvin Evano**
