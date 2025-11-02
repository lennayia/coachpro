// Cesta: src/shared/constants/coachingTaxonomy.js
// Centrální taxonomie pro koučink - oblasti, témata, styly
// Používá se pro kategorizaci a filtrování materiálů

import {
  Sparkles,      // Life coaching
  Briefcase,     // Career
  Heart,         // Relationship
  Activity,      // Health/Wellness
  DollarSign,    // Financial
  Sun,           // Spiritual
  Users,         // Parenting
  Target,        // Other
  Award          // Coaching Authority/Certification
} from 'lucide-react';

// =============================================================================
// 1. COACHING AREAS (Oblasti koučinku)
// =============================================================================

export const COACHING_AREAS = [
  {
    value: 'life',
    label: 'Životní koučink',
    icon: Sparkles,
    description: 'Osobní růst, životní cíle a seberealizace'
  },
  {
    value: 'career',
    label: 'Kariérní koučink',
    icon: Briefcase,
    description: 'Kariérní rozvoj a profesní cíle'
  },
  {
    value: 'relationship',
    label: 'Vztahový koučink',
    icon: Heart,
    description: 'Partnerské a mezilidské vztahy'
  },
  {
    value: 'health',
    label: 'Zdravotní/Wellness koučink',
    icon: Activity,
    description: 'Zdraví, pohyb a životní styl'
  },
  {
    value: 'financial',
    label: 'Finanční koučink',
    icon: DollarSign,
    description: 'Peníze, prosperita a finanční cíle'
  },
  {
    value: 'spiritual',
    label: 'Spirituální koučink',
    icon: Sun,
    description: 'Duchovní růst a hledání smyslu'
  },
  {
    value: 'parenting',
    label: 'Rodičovský koučink',
    icon: Users,
    description: 'Rodičovství a rodinné vztahy'
  },
  {
    value: 'other',
    label: 'Jiné',
    icon: Target,
    description: 'Ostatní oblasti koučinku'
  },
];

// =============================================================================
// 2. TOPICS (Témata)
// =============================================================================

// Společná témata pro všechny oblasti koučinku
export const TOPICS = [
  // Seberozvoj
  'Sebevědomí',
  'Sebeláska',
  'Sebereflexe',
  'Osobní růst',
  'Hodnoty',
  'Identita',

  // Motivace & Energie
  'Motivace',
  'Energie',
  'Vize',
  'Inspirace',

  // Emoce & Mindfulness
  'Emoce',
  'Stres & Relaxace',
  'Mindfulness',
  'Přítomnost',
  'Vděčnost',

  // Cíle & Akce
  'Cíle & Plánování',
  'Rozhodování',
  'Změna návyků',
  'Produktivita',
  'Time management',

  // Vztahy & Komunikace
  'Komunikace',
  'Hranice',
  'Asertivita',
  'Empatie',
  'Odpuštění',

  // Balance & Well-being
  'Work-Life Balance',
  'Odpočinek',
  'Radost',

  // Transformace
  'Transformace',
  'Překonávání překážek',
  'Odvaha',
  'Důvěra',
].sort(); // Seřazeno abecedně pro lepší UX

// =============================================================================
// 3. COACHING STYLES (Školy/Přístupy)
// =============================================================================

export const COACHING_STYLES = [
  {
    value: 'icf',
    label: 'ICF přístup',
    description: 'International Coaching Federation standard'
  },
  {
    value: 'nlp',
    label: 'NLP',
    description: 'Neurolingvistické programování'
  },
  {
    value: 'ontological',
    label: 'Ontologický koučink',
    description: 'Práce s bytím a identitou'
  },
  {
    value: 'positive',
    label: 'Pozitivní psychologie',
    description: 'Zaměření na silné stránky'
  },
  {
    value: 'mindfulness',
    label: 'Mindfulness-based',
    description: 'Založeno na všímavosti a přítomnosti'
  },
  {
    value: 'systemic',
    label: 'Systemický koučink',
    description: 'Práce se systémy a vztahy'
  },
  {
    value: 'integrative',
    label: 'Integrativní',
    description: 'Kombinace více přístupů'
  },
  {
    value: 'general',
    label: 'Obecný koučink',
    description: 'Bez specifické certifikace nebo školy'
  },
];

// =============================================================================
// 4. COACHING AUTHORITIES (Koučovací školy/Certifikace)
// =============================================================================

export const COACHING_AUTHORITIES = [
  {
    value: 'icf',
    label: 'ICF (International Coaching Federation)',
    description: 'Největší mezinárodní organizace profesionálních koučů'
  },
  {
    value: 'emcc',
    label: 'EMCC (European Mentoring & Coaching Council)',
    description: 'Evropská rada pro mentoring a koučink'
  },
  {
    value: 'ac',
    label: 'AC (Association for Coaching)',
    description: 'Asociace pro koučink se zaměřením na etiku'
  },
  {
    value: 'erickson',
    label: 'Erickson Coaching International',
    description: 'Škola založená na solution-focused přístupu'
  },
  {
    value: 'cti',
    label: 'CTI (Coaches Training Institute)',
    description: 'Co-Active Coaching model'
  },
  {
    value: 'nlp-university',
    label: 'NLP University',
    description: 'Certifikace v neurolingvistickém programování'
  },
  {
    value: 'ipec',
    label: 'iPEC Coaching',
    description: 'Institute for Professional Excellence in Coaching'
  },
  {
    value: 'coaching-center',
    label: 'Coaching Center Praha',
    description: 'Česká koučovací škola'
  },
  {
    value: 'institut-systemickeho-koucovani',
    label: 'Institut Systemického Koučování',
    description: 'Systemický přístup v ČR'
  },
  {
    value: 'other',
    label: 'Jiná škola',
    description: 'Jiná certifikovaná koučovací škola'
  },
  {
    value: 'none',
    label: 'Bez certifikace',
    description: 'Koučování bez formální certifikace'
  },
];

// =============================================================================
// HELPER FUNKCE
// =============================================================================

/**
 * Najde oblast podle value
 */
export const getAreaById = (value) =>
  COACHING_AREAS.find(area => area.value === value);

/**
 * Vrátí label oblasti
 */
export const getAreaLabel = (value) =>
  getAreaById(value)?.label || 'Neznámá oblast';

/**
 * Vrátí ikonu oblasti (React component)
 */
export const getAreaIcon = (value) =>
  getAreaById(value)?.icon || Target;

/**
 * Vrátí description oblasti
 */
export const getAreaDescription = (value) =>
  getAreaById(value)?.description || '';

/**
 * Najde styl podle value
 */
export const getStyleById = (value) =>
  COACHING_STYLES.find(style => style.value === value);

/**
 * Vrátí label stylu
 */
export const getStyleLabel = (value) =>
  getStyleById(value)?.label || 'Neznámý styl';

/**
 * Vrátí description stylu
 */
export const getStyleDescription = (value) =>
  getStyleById(value)?.description || '';

/**
 * Najde autoritu podle value
 */
export const getAuthorityById = (value) =>
  COACHING_AUTHORITIES.find(auth => auth.value === value);

/**
 * Vrátí label autority
 */
export const getAuthorityLabel = (value) =>
  getAuthorityById(value)?.label || 'Neznámá škola';

/**
 * Vrátí description autority
 */
export const getAuthorityDescription = (value) =>
  getAuthorityById(value)?.description || '';

/**
 * Validace topics (volitelný limit)
 */
export const validateTopics = (topics, maxCount = null) => {
  if (!Array.isArray(topics)) return false;
  if (maxCount && topics.length > maxCount) return false;
  return topics.every(topic => TOPICS.includes(topic));
};

/**
 * Doporučený počet topics pro UI helper text
 */
export const RECOMMENDED_TOPICS_COUNT = { min: 3, max: 5 };
