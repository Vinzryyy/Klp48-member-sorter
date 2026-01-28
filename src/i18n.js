import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// 🌍 sync language from Home
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
        alertMin: "Please select at least 2 members!",

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
        share: "Share",
        yourName: "Your name (optional)",
        exportImage: "Export Top 3 Image",
        tweet: "Tweet Result",
        members: "members",

        /* TIER LABELS (🔥 FIX) */
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
        title: "KLP48 成员排序",
        subtitle: "选择你的推",
        description: "为你最喜欢的 KLP48 成员排序。",
        membersReady: "{{count}} 名成员已准备",
        filterHint: "筛选后立即开始",
        filterTitle: "筛选成员",
        filterDesc: "排序前选择偏好",
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

        notEnoughMembers: "成员不足。",
        preparing: "准备中…",
        back: "返回",
        undo: "撤销",
        restart: "重新开始",
        chooseOne: "你更喜欢哪一个？",
        equal: "一样",
        progress: "比较：{{comparisons}}（{{progress}}%）",
        generationLabel: "第 {{gen}} 期",

        noRanking: "没有排序结果",
        home: "首页",
        resultsTitle: "结果 — {{count}} 名成员",
        ranking: "排名",
        tier: "分级表",
        top3: "我的前三推 🏆",
        share: "分享",
        yourName: "你的名字（可选）",
        exportImage: "导出前三图片",
        tweet: "分享到 X",
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
        title: "Penyusun Ahli KLP48",
        subtitle: "Pilih Oshi Anda",
        description: "Susun ahli kegemaran KLP48 anda.",
        membersReady: "{{count}} ahli sedia",
        filterHint: "Tapis dan mula segera",
        filterTitle: "Tapis Ahli",
        filterDesc: "Pilih keutamaan",
        status: "Status",
        generation: "Generasi",
        allMembers: "Semua Ahli",
        active: "Ahli Aktif",
        graduated: "Ahli Tamat",
        allGen: "Semua Generasi",
        gen1: "Generasi 1",
        gen2: "Generasi 2",
        start: "Mula Susun 🚀",
        alertMin: "Pilih sekurang-kurangnya 2 ahli!",

        notEnoughMembers: "Ahli tidak mencukupi.",
        preparing: "Menyediakan...",
        back: "Kembali",
        undo: "Undur",
        restart: "Mula Semula",
        chooseOne: "Yang mana satu?",
        equal: "Sama",
        progress: "Perbandingan: {{comparisons}} ({{progress}}%)",
        generationLabel: "Generasi {{gen}}",

        noRanking: "Tiada ranking",
        home: "Laman Utama",
        resultsTitle: "Keputusan — {{count}} Ahli",
        ranking: "Ranking",
        tier: "Senarai Tier",
        top3: "Top 3 Oshi Saya 🏆",
        share: "Kongsi",
        yourName: "Nama anda (pilihan)",
        exportImage: "Eksport Imej Top 3",
        tweet: "Kongsi di X",
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
        title: "KLP48 メンバーソーター",
        subtitle: "推しを選ぼう",
        description: "KLP48 の推しをランキング。",
        membersReady: "{{count}} 人準備完了",
        filterHint: "すぐ開始",
        filterTitle: "メンバー選択",
        filterDesc: "条件を選択",
        status: "ステータス",
        generation: "期",
        allMembers: "全メンバー",
        active: "現役",
        graduated: "卒業",
        allGen: "全期",
        gen1: "1期生",
        gen2: "2期生",
        start: "開始 🚀",
        alertMin: "2人以上選択してください！",

        notEnoughMembers: "人数が足りません。",
        preparing: "準備中…",
        back: "戻る",
        undo: "元に戻す",
        restart: "やり直す",
        chooseOne: "どちらが好き？",
        equal: "同じ",
        progress: "比較：{{comparisons}}（{{progress}}%）",
        generationLabel: "{{gen}}期生",

        noRanking: "ランキングなし",
        home: "ホーム",
        resultsTitle: "結果 — {{count}}人",
        ranking: "ランキング",
        tier: "ティア",
        top3: "私のトップ3 🏆",
        share: "共有",
        yourName: "名前（任意）",
        exportImage: "画像を書き出す",
        tweet: "Xで共有",
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
