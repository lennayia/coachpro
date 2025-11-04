/**
 * Beta Testing Information - Centralized Content
 *
 * Tento soubor obsahuje všechny texty a data pro beta disclaimer a onboarding.
 * Používá se v: OnboardingModal, WelcomeBanner, BetaBadge dialog, Profil/Nastavení.
 *
 * @created 4.11.2025
 */

// Configuration
export const BETA_CONFIG = {
  bannerShowCount: 3, // Kolikrát zobrazit Welcome Banner
  onboardingLocalStorageKey: 'coachpro_onboarding_completed',
  bannerLocalStorageKey: 'coachpro_banner_show_count',
};

// Onboarding Slides (3 slides)
export const ONBOARDING_SLIDES = [
  {
    emoji: '🌿',
    title: 'Vítej v CoachPro Beta!',
    content: 'Děkuji, že testuješ aplikaci se mnou. CoachPro je nástroj pro sdílení koučovacích programů s klientkami.',
  },
  {
    emoji: '✨',
    title: 'Vytvoř program',
    steps: [
      'Nahraj materiály (meditace, PDF, texty)',
      'Seřaď je do programu (7-30 dní)',
      'Vygeneruj QR kód nebo 6místný kód',
      'Sdílej s klientkou',
    ],
  },
  {
    emoji: '📝',
    title: 'Beta Testing Limity',
    limits: [
      'Max 2 MB na soubor (větší → Google Drive)',
      '3 klientky na kouče (beta fáze)',
      'Data jsou v bezpečí v cloudu',
    ],
    footer: '🐛 Našla jsi chybu? Napiš mi prosím na:',
    contact: 'beta@online-byznys.cz',
  },
];

// Welcome Banner Content
export const WELCOME_BANNER = {
  emoji: '🧪',
  title: 'CoachPro Beta Testování',
  subtitle: 'Vítej v beta verzi CoachPro! Pomoz nám vytvořit nejlepší nástroj pro koučky.',
  features: [
    'Programy s materiály (audio, PDF, text, odkazy)',
    'Sdílení s klientkami pomocí QR kódu nebo 6místného kódu',
    'Coaching taxonomie pro snadné vyhledávání',
    'Zpětná vazba od klientek',
  ],
  testing: [
    'Stabilitu aplikace při běžném používání',
    'UX flow pro kouče i klientky',
    'Výkon při nahrávání souborů',
  ],
  security: '💾 Tvoje data jsou v bezpečí v Supabase cloudu.',
  contactPrompt: 'Pokud najdeš bug nebo máš nápad na zlepšení, napiš mi prosím na',
  contactEmail: 'beta@online-byznys.cz',
  buttonText: 'Rozumím, začínám! ✓',
};

// Beta Badge Dialog Content
export const BETA_BADGE_INFO = {
  emoji: '🧪',
  title: 'Beta Testování',
  intro: 'CoachPro je v beta verzi. Aplikace je plně funkční, ale může obsahovat drobné chyby.',
  limitsTitle: 'Očekávané limity:',
  limits: [
    'Max 10 kouček v beta testování',
    'Max 3 klientky na kouče',
    'Max 2 MB velikost souborů (větší přes Google Drive)',
  ],
  thankYou: 'Děkuji za trpělivost a zpětnou vazbu! Společně vytvoříme skvělý produkt. 🌿',
  contact: 'Kontakt: beta@online-byznys.cz',
};

// Full Beta Info (pro Profil/Nastavení stránku)
export const FULL_BETA_INFO = {
  sections: [
    {
      title: '🧪 Co je Beta Testování?',
      content:
        'Beta verze je téměř hotová aplikace, kterou testujeme s malou skupinou uživatelů před oficiálním spuštěním. Pomáháš nám najít chyby a vylepšit uživatelskou zkušenost.',
    },
    {
      title: '✨ Co funguje',
      items: [
        'Vytváření koučovacích programů',
        'Nahrávání materiálů (audio, video, PDF, image, document, text, odkazy)',
        'Coaching taxonomie (oblast, témata, styl, certifikace)',
        'Sdílení programů a jednotlivých materiálů pomocí QR kódu nebo 6místného kódu',
        'Zpětná vazba od klientek po použití materiálu',
        'Zpětná vazba po dokončení celého programu',
        'Časově omezený přístup k programům a materiálům',
        'Dark/Light mode',
        'Responzivní design (funguje na mobilu i desktopu)',
      ],
    },
    {
      title: '📝 Beta Limity',
      items: [
        'Max 10 kouček v beta testování',
        'Max 3 klientky na kouče',
        'Max 2 MB velikost souborů (větší soubory nahraj na Google Drive a sdílej odkaz)',
        'iCloud odkazy nejsou podporovány (použij Google Drive)',
        'Supabase Free Tier: 1 GB storage, 5 GB bandwidth/měsíc',
      ],
    },
    {
      title: '🔒 Bezpečnost Dat',
      items: [
        'Všechna data jsou uložena v Supabase cloudu (PostgreSQL databáze)',
        'Soubory jsou uloženy v Supabase Storage (šifrované)',
        'Row Level Security (RLS) politiky pro ochranu dat',
        'Pravidelné zálohy databáze',
        'SSL/TLS šifrování pro všechny požadavky',
      ],
    },
    {
      title: '🐛 Jak reportovat chyby',
      content:
        'Pokud najdeš chybu nebo máš nápad na zlepšení, napiš mi prosím email na beta@online-byznys.cz s popisem problému. Ideálně přilož screenshot a kroky, jak chybu zopakovat.',
    },
    {
      title: '📊 Co bude v plné verzi',
      items: [
        'Neomezený počet klientek',
        'Větší limity na soubory (10+ MB)',
        'Email notifikace pro klientky',
        'Statistiky a analytics pro kouče',
        'Export dat (CSV, PDF)',
        'Integrace s platebními systémy (Stripe)',
        'Automatické připomínky programů',
        'Team účty pro skupiny koučů',
      ],
    },
    {
      title: '📅 Timeline',
      content:
        'Beta testování: Listopad 2025 - Leden 2026\nPlné spuštění: Únor 2026 (orientační termín)',
    },
    {
      title: '💌 Kontakt',
      content: 'Email: beta@online-byznys.cz\nWeb: https://coachpro-weld.vercel.app',
    },
  ],
};

// Helper funkce pro získání dat
export const getBetaConfig = () => BETA_CONFIG;
export const getOnboardingSlides = () => ONBOARDING_SLIDES;
export const getWelcomeBannerContent = () => WELCOME_BANNER;
export const getBetaBadgeInfo = () => BETA_BADGE_INFO;
export const getFullBetaInfo = () => FULL_BETA_INFO;
