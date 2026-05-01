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
        membersReadyShort: "{{count}} Members Ready",
        filterHint: "Filter and start ranking instantly",

        filterTitle: "Filter Members",
        filterDesc: "Choose your preferences before ranking",
        filterMembersTitle: "Filter Members",
        filterMembersDesc: "Choose your favorite members before ranking!",

        status: "Status",
        generation: "Generation",
        allMembers: "All Members",
        active: "Active Members",
        graduated: "Graduated Members",
        allGen: "All Generations",
        gen1: "Generation 1",
        gen2: "Generation 2",

        start: "Start Ranking ",
        startRanking: "Start Ranking",
        fansToday: "fans ranked today",

        alertMin: "Please select at least 2 members!",

        /* RESUME BANNER */
        resumeTitle: "Continue your last run",
        resumeProgress: "{{progress}}% done · {{comparisons}} comparisons",
        resumeMembers: "{{count}} members in this session",
        resumeCta: "Resume",
        resumeDiscard: "Discard",

        /* HOTKEYS OVERLAY */
        hotkeys: {
          title: "Shortcuts",
          tagline: "go fast ♡",
          hint: "press ? for shortcuts",
          gotIt: "Got it",
          pickLeft: "Pick left",
          pickRight: "Pick right",
          toggle: "Toggle this overlay",
          close: "Close overlay",
        },

        /* PROFILE MODAL */
        profile: {
          close: "Close",
          nickname: "Nickname",
          birthDate: "Birth Date",
          hobbies: "Hobbies",
          activeBadge: "💚 Active",
          graduatedBadge: "🎓 Graduated",
          notAvailable: "N/A",
        },

        /* RESULTS EXTRAS */
        top3Section: "Top 3 ⭐",
        fullList: "Full List",
        backToHome: "Back to Home",

        /* SORTER */
        notEnoughMembers: "Not enough members to start sorting.",
        preparing: "Preparing comparison...",
        back: "Back",
        undo: "Undo",
        restart: "Restart",
        chooseOne: "Which one do you prefer?",
        equal: "Equal",
        tieHint: "can't decide? tap equal",
        progress: "Comparisons: {{comparisons}} ({{progress}}%)",
        generationLabel: "Generation {{gen}}",

        /* PRELOADER */
        preloader: {
          welcome: "welcome ♡",
          loading: "loading your oshi…",
        },

        /* ERROR BOUNDARY */
        errorBoundary: {
          title: "Oops! Something went wrong",
          body: "We encountered an unexpected error. Don't worry, your data is safe!",
          errorDetails: "Error Details (for debugging)",
          reset: "Reset & Try Again",
          goHome: "Go to Home",
          persistHelp: "If this problem persists, please contact support.",
        },

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

        /* TIER LABELS */
        tierLabel: {
          oshimen: "Oshimen",
          niban: "Niban-Oshi",
          oshisama: "Oshisama",
          kikinarai: "Kikinarai",
          chikasashi: "Chikasashi",
        },

        /* MEMBERS PAGE */
        membersPage: {
          title: "KLP48 Directory",
          searchPlaceholder: "Search name...",
          allStatus: "All Status",
          allGen: "All Generations",
          showingCount: "Showing {{count}} members",
          noResults: "No members found matching your search.",
          generation: "Gen {{gen}}",
          graduatedShort: " · grad",
        },

        /* BIRTHDAY PAGE */
        birthday: {
          headerTitle: "Birthdays",
          greet: "celebrate ♡",
          title: "Happy Birthday!",
          subtitle: "Cheering for our oshi on their special day 🎂",
          cd: {
            title: "Next birthday in…",
            days: "Days",
            hours: "Hours",
            minutes: "Mins",
            seconds: "Secs",
            surprise: "A surprise for you",
            surpriseKicker: "Tap to open",
            lockedKicker: "Unlocks on the day",
            surpriseAria: "A surprise for the upcoming birthday member",
          },
          recentHeading: "Just Celebrated",
          daysAgo: "{{count}} days ago",
          openBadge: "Open",
          cakeCaption: "Make a wish for your oshi",
          giftCaption: "Tap the gift to open it",
          giftOpenCaption: "Surprise! From all of us 💌",
          giftSurprise: "happy day ♡",
          giftSurpriseNamed: "happy day, {{name}} ♡",
          giftAria: "Open the birthday gift",
          todayHeading: "Birthdays Today",
          todayBadge: "Today",
          thisMonthHeading: "Coming Up in {{month}}",
          emptyMonth: "No more birthdays this month — see you next month!",
          nextUpHeading: "Next Up",
          daysAway_one: "in {{count}} day",
          daysAway_other: "in {{count}} days",
          daysAway: "in {{count}} days",
          turning: "turning {{age}}",
          month: {
            jan: "January", feb: "February", mar: "March", apr: "April",
            may: "May", jun: "June", jul: "July", aug: "August",
            sep: "September", oct: "October", nov: "November", dec: "December",
          },
        },

        /* GIFT PAGE */
        gift: {
          headerTitle: "Gift",
          greet: "for our oshi ♡",
          title: "Open the Gift!",
          subtitle: "A little cake and a little surprise — just for them 🎁",
          forCaption: "celebrating",
          honoreeTagline: "for {{name}}, with love",
          celebration: {
            cakeAria: "Tap the cake to celebrate",
            cakeHint: "Tap the cake to make a wish",
            giftHint: "Tap the gift to unwrap a surprise",
            modalAria: "Birthday celebration popup",
            close: "Close celebration",
            headline: "Happy Birthday, {{name}}!",
            subline: "made with love by your fans 💚🌸",
            thanks: "Thank you, close",
          },
          devMessage: {
            default: {
              title: "A note from the developer",
              body: "Happy birthday, {{name}}! 🎂\nThis little page is a fan-made gift from one supporter to another. Thank you for being part of KLP48 — your smile makes our day brighter every time you appear on stage. May this year bring you all the joy, laughter, and love you give us back.",
              signoff: "the developer 💚",
            },
            alice: {
              title: "A potato-coded note for Alice 🥔",
              body: "Happy birthday, Alice! 🥔🎂\nNo one rocks a potato photoshoot quite like you do — earthy, soft, and a little bit silly in the best way. Thank you for the scripts you write, the anime nights you talk about, and the way you turn a brown backdrop into a whole vibe.\nMay your 22nd be full of warm books, golden tubers, sweet music, and people who see how special you are. Stay weird, stay you, stay our potato queen 🌷",
              signoff: "the developer 💚🥔",
            },
          },
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
        membersReadyShort: "{{count}} 名成员已准备",
        filterHint: "筛选后立即开始",

        filterTitle: "筛选成员",
        filterDesc: "排序前选择偏好",
        filterMembersTitle: "筛选成员",
        filterMembersDesc: "排序前选择你喜欢的成员！",

        status: "状态",
        generation: "期别",
        allMembers: "全部成员",
        active: "在籍成员",
        graduated: "毕业成员",
        allGen: "全部期别",
        gen1: "一期生",
        gen2: "二期生",

        start: "开始排序 ",
        startRanking: "开始排序",
        fansToday: "粉丝今日参与",

        alertMin: "请至少选择 2 名成员！",

        /* RESUME BANNER */
        resumeTitle: "继续上次的排序",
        resumeProgress: "已完成 {{progress}}% · {{comparisons}} 次比较",
        resumeMembers: "本次共 {{count}} 名成员",
        resumeCta: "继续",
        resumeDiscard: "放弃",

        /* HOTKEYS OVERLAY */
        hotkeys: {
          title: "快捷键",
          tagline: "加速 ♡",
          hint: "按 ? 显示快捷键",
          gotIt: "知道了",
          pickLeft: "选左边",
          pickRight: "选右边",
          toggle: "切换此面板",
          close: "关闭面板",
        },

        /* PROFILE MODAL */
        profile: {
          close: "关闭",
          nickname: "昵称",
          birthDate: "生日",
          hobbies: "爱好",
          activeBadge: "💚 在籍",
          graduatedBadge: "🎓 毕业",
          notAvailable: "无",
        },

        /* RESULTS EXTRAS */
        top3Section: "前三 ⭐",
        fullList: "完整列表",
        backToHome: "返回首页",

        notEnoughMembers: "成员不足。",
        preparing: "准备中…",
        back: "返回",
        undo: "撤销",
        restart: "重新开始",
        chooseOne: "你更喜欢哪一个？",
        equal: "一样",
        tieHint: "拿不定主意？点「一样」",
        progress: "比较：{{comparisons}}（{{progress}}%）",
        generationLabel: "第 {{gen}} 期",

        /* PRELOADER */
        preloader: {
          welcome: "欢迎 ♡",
          loading: "正在加载你的推…",
        },

        /* ERROR BOUNDARY */
        errorBoundary: {
          title: "哎呀！出错了",
          body: "我们遇到了未预期的错误。别担心，你的数据是安全的！",
          errorDetails: "错误详情（调试用）",
          reset: "重置并重试",
          goHome: "返回首页",
          persistHelp: "如果问题持续，请联系支持。",
        },

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

        /* MEMBERS PAGE */
        membersPage: {
          title: "KLP48 成员名录",
          searchPlaceholder: "搜索姓名...",
          allStatus: "全部状态",
          allGen: "全部期别",
          showingCount: "显示 {{count}} 名成员",
          noResults: "没有找到匹配的成员。",
          generation: "{{gen}} 期生",
          graduatedShort: " · 卒",
        },

        /* BIRTHDAY PAGE */
        birthday: {
          headerTitle: "生日",
          greet: "庆祝 ♡",
          title: "生日快乐！",
          subtitle: "在特别的日子里为推应援 🎂",
          cd: {
            title: "下一个生日还有…",
            days: "天",
            hours: "时",
            minutes: "分",
            seconds: "秒",
            surprise: "给你的惊喜",
            surpriseKicker: "点击打开",
            lockedKicker: "当天解锁",
            surpriseAria: "送给即将生日成员的惊喜",
          },
          recentHeading: "刚刚庆祝",
          daysAgo: "{{count}} 天前",
          openBadge: "打开",
          cakeCaption: "为你的推许个愿吧",
          giftCaption: "点击礼物来打开",
          giftOpenCaption: "惊喜！来自我们大家 💌",
          giftSurprise: "生日快乐 ♡",
          giftSurpriseNamed: "生日快乐，{{name}} ♡",
          giftAria: "打开生日礼物",
          todayHeading: "今日生日",
          todayBadge: "今日",
          thisMonthHeading: "{{month}} 即将到来",
          emptyMonth: "本月没有更多生日了，下个月见！",
          nextUpHeading: "接下来",
          daysAway: "{{count}} 天后",
          turning: "迎来 {{age}} 岁",
          month: {
            jan: "1月", feb: "2月", mar: "3月", apr: "4月",
            may: "5月", jun: "6月", jul: "7月", aug: "8月",
            sep: "9月", oct: "10月", nov: "11月", dec: "12月",
          },
        },

        /* GIFT PAGE */
        gift: {
          headerTitle: "礼物",
          greet: "送给推 ♡",
          title: "打开礼物！",
          subtitle: "一点蛋糕，一点惊喜 — 只为她 🎁",
          forCaption: "庆祝",
          honoreeTagline: "送给 {{name}}，满载爱意",
          celebration: {
            cakeAria: "点击蛋糕来庆祝",
            cakeHint: "点击蛋糕，许下心愿",
            giftHint: "点击礼物，拆开惊喜",
            modalAria: "生日庆祝弹窗",
            close: "关闭庆祝",
            headline: "{{name}}，生日快乐！",
            subline: "由粉丝用爱制作 💚🌸",
            thanks: "谢谢，关闭",
          },
          devMessage: {
            default: {
              title: "来自开发者的留言",
              body: "{{name}}，生日快乐！🎂\n这个小小的页面是粉丝制作的礼物，由一位粉丝送给另一位粉丝。谢谢你成为 KLP48 的一员 —— 每次你登台时的笑容都让我们的一天更加美好。愿这一年带给你你给我们的一切快乐、欢笑与爱。",
              signoff: "开发者 💚",
            },
            alice: {
              title: "致 Alice 的小土豆来信 🥔",
              body: "Alice，生日快乐！🥔🎂\n没人能像你一样，把土豆写真拍得这么好看 —— 朴实、柔软、又带点可爱的傻气。谢谢你写过的剧本、聊过的动漫之夜，以及把一块棕色背景拍成整个氛围的能力。\n愿你的22岁充满温暖的书本、金色的土豆、甜美的音乐，和真心懂你特别之处的人。继续做奇怪的、独特的、属于我们的土豆女王 🌷",
              signoff: "开发者 💚🥔",
            },
          },
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
        membersReadyShort: "{{count}} Ahli Sedia",
        filterHint: "Tapis dan mula segera",

        filterTitle: "Tapis Ahli",
        filterDesc: "Pilih keutamaan",
        filterMembersTitle: "Tapis Ahli",
        filterMembersDesc: "Pilih ahli kegemaran sebelum susun!",

        status: "Status",
        generation: "Generasi",
        allMembers: "Semua Ahli",
        active: "Ahli Aktif",
        graduated: "Ahli Tamat",
        allGen: "Semua Generasi",
        gen1: "Generasi 1",
        gen2: "Generasi 2",

        start: "Mula Susun ",
        startRanking: "Mula Susun",
        fansToday: "peminat hari ini",

        alertMin: "Pilih sekurang-kurangnya 2 ahli!",

        /* RESUME BANNER */
        resumeTitle: "Sambung susunan terakhir",
        resumeProgress: "{{progress}}% selesai · {{comparisons}} perbandingan",
        resumeMembers: "{{count}} ahli dalam sesi ini",
        resumeCta: "Sambung",
        resumeDiscard: "Buang",

        /* HOTKEYS OVERLAY */
        hotkeys: {
          title: "Pintasan",
          tagline: "Cepat ♡",
          hint: "tekan ? untuk pintasan",
          gotIt: "OK",
          pickLeft: "Pilih kiri",
          pickRight: "Pilih kanan",
          toggle: "Togol panel ini",
          close: "Tutup panel",
        },

        /* PROFILE MODAL */
        profile: {
          close: "Tutup",
          nickname: "Nama Panggilan",
          birthDate: "Tarikh Lahir",
          hobbies: "Minat",
          activeBadge: "💚 Aktif",
          graduatedBadge: "🎓 Tamat",
          notAvailable: "Tiada",
        },

        /* RESULTS EXTRAS */
        top3Section: "Top 3 ⭐",
        fullList: "Senarai Penuh",
        backToHome: "Kembali ke Laman Utama",

        notEnoughMembers: "Ahli tidak mencukupi.",
        preparing: "Menyediakan...",
        back: "Kembali",
        undo: "Undur",
        restart: "Mula Semula",
        chooseOne: "Yang mana satu?",
        equal: "Sama",
        tieHint: "tak boleh pilih? tekan sama",
        progress: "Perbandingan: {{comparisons}} ({{progress}}%)",
        generationLabel: "Generasi {{gen}}",

        /* PRELOADER */
        preloader: {
          welcome: "selamat datang ♡",
          loading: "memuat oshi anda…",
        },

        /* ERROR BOUNDARY */
        errorBoundary: {
          title: "Alamak! Ada masalah",
          body: "Kami menemui ralat yang tidak dijangka. Jangan risau, data anda selamat!",
          errorDetails: "Butiran Ralat (untuk debugging)",
          reset: "Tetap Semula & Cuba Lagi",
          goHome: "Ke Laman Utama",
          persistHelp: "Jika masalah berterusan, sila hubungi sokongan.",
        },

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

        /* MEMBERS PAGE */
        membersPage: {
          title: "Direktori KLP48",
          searchPlaceholder: "Cari nama...",
          allStatus: "Semua Status",
          allGen: "Semua Generasi",
          showingCount: "Menunjukkan {{count}} ahli",
          noResults: "Tiada ahli ditemui yang sepadan dengan carian anda.",
          generation: "Gen {{gen}}",
          graduatedShort: " · tamat",
        },

        /* BIRTHDAY PAGE */
        birthday: {
          headerTitle: "Hari Lahir",
          greet: "raikan ♡",
          title: "Selamat Hari Lahir!",
          subtitle: "Sokong oshi anda pada hari istimewa mereka 🎂",
          cd: {
            title: "Hari lahir seterusnya dalam…",
            days: "Hari",
            hours: "Jam",
            minutes: "Min",
            seconds: "Saat",
            surprise: "Kejutan untuk awak",
            surpriseKicker: "Tekan untuk buka",
            lockedKicker: "Buka pada harinya",
            surpriseAria: "Kejutan untuk ahli yang akan menyambut hari lahir",
          },
          recentHeading: "Baru Diraikan",
          daysAgo: "{{count}} hari lalu",
          openBadge: "Buka",
          cakeCaption: "Buat hajat untuk oshi anda",
          giftCaption: "Tekan hadiah untuk buka",
          giftOpenCaption: "Kejutan! Dari kami semua 💌",
          giftSurprise: "selamat hari lahir ♡",
          giftSurpriseNamed: "selamat hari lahir, {{name}} ♡",
          giftAria: "Buka hadiah hari lahir",
          todayHeading: "Hari Lahir Hari Ini",
          todayBadge: "Hari Ini",
          thisMonthHeading: "Akan Datang dalam {{month}}",
          emptyMonth: "Tiada lagi hari lahir bulan ini — jumpa bulan depan!",
          nextUpHeading: "Seterusnya",
          daysAway: "dalam {{count}} hari",
          turning: "menyambut umur {{age}}",
          month: {
            jan: "Januari", feb: "Februari", mar: "Mac", apr: "April",
            may: "Mei", jun: "Jun", jul: "Julai", aug: "Ogos",
            sep: "September", oct: "Oktober", nov: "November", dec: "Disember",
          },
        },

        /* GIFT PAGE */
        gift: {
          headerTitle: "Hadiah",
          greet: "untuk oshi ♡",
          title: "Buka Hadiah!",
          subtitle: "Sedikit kek dan sedikit kejutan — khas untuk mereka 🎁",
          forCaption: "meraikan",
          honoreeTagline: "untuk {{name}}, dengan kasih",
          celebration: {
            cakeAria: "Tekan kek untuk meraikan",
            cakeHint: "Tekan kek untuk buat hajat",
            giftHint: "Tekan hadiah untuk buka kejutan",
            modalAria: "Pop-up sambutan hari lahir",
            close: "Tutup sambutan",
            headline: "Selamat Hari Lahir, {{name}}!",
            subline: "dibuat dengan kasih oleh peminat 💚🌸",
            thanks: "Terima kasih, tutup",
          },
          devMessage: {
            default: {
              title: "Nota daripada pembangun",
              body: "Selamat hari lahir, {{name}}! 🎂\nLaman kecil ini ialah hadiah buatan peminat — daripada seorang penyokong kepada seorang lagi. Terima kasih kerana menjadi sebahagian daripada KLP48 — senyumanmu membuatkan hari kami lebih ceria setiap kali kau naik ke pentas. Semoga tahun ini membawa segala kegembiraan, ketawa, dan cinta yang kau beri kepada kami.",
              signoff: "pembangun 💚",
            },
            alice: {
              title: "Nota berbau ubi untuk Alice 🥔",
              body: "Selamat hari lahir, Alice! 🥔🎂\nTiada siapa boleh menjayakan photoshoot ubi seperti kau — warna tanah, lembut, dan sedikit kelakar dengan cara yang paling comel. Terima kasih untuk skrip yang kau tulis, malam anime yang kau ceritakan, dan kebolehan menjadikan latar coklat sebagai satu mood.\nSemoga ulang tahun ke-22 ini penuh dengan buku hangat, ubi keemasan, muzik manis, dan orang yang nampak betapa istimewanya kau. Kekal pelik, kekal kau, kekal ratu ubi kami 🌷",
              signoff: "pembangun 💚🥔",
            },
          },
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
        membersReadyShort: "{{count}} 人準備完了",
        filterHint: "すぐ開始",

        filterTitle: "メンバー選択",
        filterDesc: "条件を選択",
        filterMembersTitle: "メンバー選択",
        filterMembersDesc: "推しを選んでランキング開始！",

        status: "ステータス",
        generation: "期",
        allMembers: "全メンバー",
        active: "現役",
        graduated: "卒業",
        allGen: "全期",
        gen1: "1期生",
        gen2: "2期生",

        start: "開始 ",
        startRanking: "開始",
        fansToday: "今日のファン",

        alertMin: "2人以上選択してください！",

        /* RESUME BANNER */
        resumeTitle: "前回の続きから",
        resumeProgress: "{{progress}}% 完了 · {{comparisons}} 回比較",
        resumeMembers: "{{count}} 人で進行中",
        resumeCta: "再開",
        resumeDiscard: "破棄",

        /* HOTKEYS OVERLAY */
        hotkeys: {
          title: "ショートカット",
          tagline: "速く ♡",
          hint: "? でショートカット表示",
          gotIt: "OK",
          pickLeft: "左を選ぶ",
          pickRight: "右を選ぶ",
          toggle: "このパネルの切替",
          close: "パネルを閉じる",
        },

        /* PROFILE MODAL */
        profile: {
          close: "閉じる",
          nickname: "ニックネーム",
          birthDate: "誕生日",
          hobbies: "趣味",
          activeBadge: "💚 現役",
          graduatedBadge: "🎓 卒業",
          notAvailable: "なし",
        },

        /* RESULTS EXTRAS */
        top3Section: "トップ3 ⭐",
        fullList: "全リスト",
        backToHome: "ホームに戻る",

        notEnoughMembers: "人数が足りません。",
        preparing: "準備中…",
        back: "戻る",
        undo: "元に戻す",
        restart: "やり直す",
        chooseOne: "どちらが好き？",
        equal: "同じ",
        tieHint: "迷ったら「同じ」をタップ",
        progress: "比較：{{comparisons}}（{{progress}}%）",
        generationLabel: "{{gen}}期生",

        /* PRELOADER */
        preloader: {
          welcome: "ようこそ ♡",
          loading: "推しを読み込み中…",
        },

        /* ERROR BOUNDARY */
        errorBoundary: {
          title: "あれ？問題が発生しました",
          body: "予期しないエラーが発生しました。データは安全です！",
          errorDetails: "エラー詳細（デバッグ用）",
          reset: "リセットしてやり直す",
          goHome: "ホームに戻る",
          persistHelp: "問題が続く場合はサポートまでご連絡ください。",
        },

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

        /* MEMBERS PAGE */
        membersPage: {
          title: "KLP48 メンバー名鑑",
          searchPlaceholder: "名前を検索...",
          allStatus: "すべてのステータス",
          allGen: "すべての期",
          showingCount: "{{count}} 人のメンバーを表示中",
          noResults: "検索条件に一致するメンバーが見つかりませんでした。",
          generation: "{{gen}} 期生",
          graduatedShort: " · 卒",
        },

        /* BIRTHDAY PAGE */
        birthday: {
          headerTitle: "お誕生日",
          greet: "おめでとう ♡",
          title: "お誕生日おめでとう！",
          subtitle: "推しの特別な日を一緒にお祝い 🎂",
          cd: {
            title: "次のお誕生日まで…",
            days: "日",
            hours: "時間",
            minutes: "分",
            seconds: "秒",
            surprise: "あなたへのサプライズ",
            surpriseKicker: "タップして開く",
            lockedKicker: "当日に解禁",
            surpriseAria: "次の誕生日メンバーへのサプライズ",
          },
          recentHeading: "最近のお祝い",
          daysAgo: "{{count}} 日前",
          openBadge: "開く",
          cakeCaption: "推しのために願いを込めて",
          giftCaption: "ギフトをタップして開ける",
          giftOpenCaption: "サプライズ！みんなから 💌",
          giftSurprise: "おめでとう ♡",
          giftSurpriseNamed: "{{name}}、おめでとう ♡",
          giftAria: "誕生日のギフトを開ける",
          todayHeading: "今日のお誕生日",
          todayBadge: "今日",
          thisMonthHeading: "{{month}}の予定",
          emptyMonth: "今月のお誕生日はもうありません。来月またね！",
          nextUpHeading: "近日中",
          daysAway: "あと {{count}} 日",
          turning: "{{age}} 歳",
          month: {
            jan: "1月", feb: "2月", mar: "3月", apr: "4月",
            may: "5月", jun: "6月", jul: "7月", aug: "8月",
            sep: "9月", oct: "10月", nov: "11月", dec: "12月",
          },
        },

        /* GIFT PAGE */
        gift: {
          headerTitle: "ギフト",
          greet: "推しへ ♡",
          title: "ギフトを開けよう！",
          subtitle: "ちょっとしたケーキと、ちょっとしたサプライズ 🎁",
          forCaption: "お祝い",
          honoreeTagline: "{{name}} へ、愛をこめて",
          celebration: {
            cakeAria: "ケーキをタップしてお祝い",
            cakeHint: "ケーキをタップして願いごとを",
            giftHint: "ギフトをタップしてサプライズを開けよう",
            modalAria: "お誕生日お祝いポップアップ",
            close: "お祝いを閉じる",
            headline: "{{name}}、お誕生日おめでとう！",
            subline: "ファンが愛をこめて作りました 💚🌸",
            thanks: "ありがとう、閉じる",
          },
          devMessage: {
            default: {
              title: "開発者からのメッセージ",
              body: "{{name}}、お誕生日おめでとう！🎂\nこの小さなページはファンから別のファンへの、ファンメイドのギフトです。KLP48 の一員でいてくれてありがとう — ステージに立つたびのあなたの笑顔が、私たちの毎日を明るくしてくれます。今年も、あなたが私たちにくれる喜び・笑い・愛が、すべてあなたのもとに帰ってきますように。",
              signoff: "開発者 💚",
            },
            alice: {
              title: "Alice へ、ポテトな手紙 🥔",
              body: "Alice、お誕生日おめでとう！🥔🎂\nあなたほどポテトの撮影を着こなせる人はいません — 素朴で、優しくて、ちょっぴりお茶目で、最高の雰囲気。書いてくれる脚本、語ってくれるアニメの夜、茶色い背景ひとつを物語に変えるその力に、いつも感謝しています。\n22歳が、温かい本と金色のじゃがいもと甘い音楽、そしてあなたの特別さをちゃんと見てくれる人たちで満たされますように。あなたらしく、ちょっと変で、私たちのポテトクイーンでいてください 🌷",
              signoff: "開発者 💚🥔",
            },
          },
        },
      },
    },
  },
});

export default i18n;
