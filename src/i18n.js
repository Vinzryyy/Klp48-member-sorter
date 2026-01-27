import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// 🌍 ambil language terakhir dari Home
const savedLanguage = localStorage.getItem("language") || "en";

i18n.use(initReactI18next).init({
  lng: savedLanguage,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  resources: {
    /* ================= ENGLISH ================= */
    en: {
      translation: {
        /* HOME */
        title: "KLP48 Member Sorter",
        subtitle: "Pick your Oshi",
        description:
          "Rank your KLP48 favorites and find your bias. A simple app built by fans.",
        membersReady: "{{count}} members ready",
        filterHint: "Filter and start ranking instantly",
        filterTitle: "Filter Members",
        filterDesc: "Choose your preferences before ranking",
        status: "Status",
        generation: "Generation",
        allMembers: "All Members",
        active: "Active Members",
        graduated: "Graduated Members",
        allGen: "All generations",
        gen1: "Generation 1",
        gen2: "Generation 2",
        start: "Start Ranking 🚀",
        alertMin: "Please select at least 2 members to start ranking!",

        /* SORTER */
        notEnoughMembers: "Not enough members to start sorting.",
        preparing: "Preparing comparison...",
        back: "Back",
        undo: "Undo",
        restart: "Restart",
        chooseOne: "Which one do you prefer?",
        equal: "Equal",
        progress: "Comparisons: {{comparisons}} ({{progress}}%)",
        generationLabel: "Generation {{gen}}",

        /* RESULTS */
        noRanking: "No ranking data",
        home: "Home",
        resultsTitle: "Results — {{count}} Members",
        ranking: "Ranking",
        tier: "Tier List",
        top3: "My Top 3 Oshi 🏆",
        members: "members",

        tierLabel: {
          oshimen: "Oshimen",
          niban: "Niban-Oshi",
          oshisama: "Oshisama",
          kikinarai: "Kikinarai",
          chikasashi: "Chikasashi",
        },
      },
    },

    /* ================= CHINESE ================= */
    zh: {
      translation: {
        /* HOME */
        title: "KLP48 成员排序",
        subtitle: "选择你的推",
        description: "为你最喜欢的 KLP48 成员排序，找到你的本命。",
        membersReady: "{{count}} 名成员已准备",
        filterHint: "筛选后立即开始排序",
        filterTitle: "筛选成员",
        filterDesc: "在排序前选择你的偏好",
        status: "状态",
        generation: "期别",
        allMembers: "全部成员",
        active: "在籍成员",
        graduated: "毕业成员",
        allGen: "全部期别",
        gen1: "一期生",
        gen2: "二期生",
        start: "开始排序 🚀",
        alertMin: "请至少选择 2 名成员！",

        /* SORTER */
        notEnoughMembers: "成员数量不足，无法开始排序。",
        preparing: "正在准备比较…",
        back: "返回",
        undo: "撤销",
        restart: "重新开始",
        chooseOne: "你更喜欢哪一个？",
        equal: "一样",
        progress: "比较次数：{{comparisons}}（{{progress}}%）",
        generationLabel: "第 {{gen}} 期",

        /* RESULTS */
        noRanking: "没有排序结果",
        home: "首页",
        resultsTitle: "结果 — {{count}} 名成员",
        ranking: "排名",
        tier: "分级表",
        top3: "我的前三推 🏆",
        members: "名",

        tierLabel: {
          oshimen: "本命",
          niban: "二推",
          oshisama: "神推",
          kikinarai: "关注中",
          chikasashi: "地下推",
        },
      },
    },

    /* ================= MALAY ================= */
    ms: {
      translation: {
        /* HOME */
        title: "Penyusun Ahli KLP48",
        subtitle: "Pilih Oshi Anda",
        description:
          "Susun ahli kegemaran KLP48 dan cari pilihan utama anda.",
        membersReady: "{{count}} ahli sedia",
        filterHint: "Tapis dan mula segera",
        filterTitle: "Tapis Ahli",
        filterDesc: "Pilih keutamaan sebelum menyusun",
        status: "Status",
        generation: "Generasi",
        allMembers: "Semua Ahli",
        active: "Ahli Aktif",
        graduated: "Ahli Tamat",
        allGen: "Semua generasi",
        gen1: "Generasi 1",
        gen2: "Generasi 2",
        start: "Mula Susun 🚀",
        alertMin: "Pilih sekurang-kurangnya 2 ahli!",

        /* SORTER */
        notEnoughMembers: "Ahli tidak mencukupi untuk menyusun.",
        preparing: "Menyediakan perbandingan...",
        back: "Kembali",
        undo: "Undur",
        restart: "Mula Semula",
        chooseOne: "Yang mana satu anda suka?",
        equal: "Sama",
        progress: "Perbandingan: {{comparisons}} ({{progress}}%)",
        generationLabel: "Generasi {{gen}}",

        /* RESULTS */
        noRanking: "Tiada data ranking",
        home: "Laman Utama",
        resultsTitle: "Keputusan — {{count}} Ahli",
        ranking: "Ranking",
        tier: "Senarai Tier",
        top3: "Top 3 Oshi Saya 🏆",
        members: "ahli",

        tierLabel: {
          oshimen: "Oshimen",
          niban: "Oshi Kedua",
          oshisama: "Oshisama",
          kikinarai: "Menarik",
          chikasashi: "Chika",
        },
      },
    },

    /* ================= JAPANESE ================= */
    ja: {
      translation: {
        /* HOME */
        title: "KLP48 メンバーソーター",
        subtitle: "推しを選ぼう",
        description:
          "KLP48 の推しメンをランキングして、あなたの推しを見つけよう。",
        membersReady: "{{count}} 人準備完了",
        filterHint: "フィルターしてすぐ開始",
        filterTitle: "メンバーを絞り込み",
        filterDesc: "ランキング前に条件を選択",
        status: "ステータス",
        generation: "期",
        allMembers: "全メンバー",
        active: "現役メンバー",
        graduated: "卒業メンバー",
        allGen: "全期",
        gen1: "1期生",
        gen2: "2期生",
        start: "ランキング開始 🚀",
        alertMin: "最低2人選択してください！",

        /* SORTER */
        notEnoughMembers: "人数が足りません。",
        preparing: "準備中…",
        back: "戻る",
        undo: "元に戻す",
        restart: "やり直す",
        chooseOne: "どちらが好き？",
        equal: "同じ",
        progress: "比較回数：{{comparisons}}（{{progress}}%）",
        generationLabel: "{{gen}}期生",

        /* RESULTS */
        noRanking: "ランキングデータがありません",
        home: "ホーム",
        resultsTitle: "結果 — {{count}}人",
        ranking: "ランキング",
        tier: "ティア表",
        top3: "私のトップ3推し 🏆",
        members: "人",

        tierLabel: {
          oshimen: "推しメン",
          niban: "二番推し",
          oshisama: "推し様",
          kikinarai: "気になる",
          chikasashi: "地下指し",
        },
      },
    },
  },
});

export default i18n;
