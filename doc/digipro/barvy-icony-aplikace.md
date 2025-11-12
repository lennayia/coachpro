A ano, máme to připravené přesně tak, jak má být pro snadné úpravy barev!
Co teď máme:
✅ Flexibilní systém - všechny barvy jsou v themes.css jako CSS variables
✅ Automatické přepínání - dark/light mode funguje okamžitě
✅ Centralizované barvy - jedna změna v themes.css = změna všude
✅ Sémantické pojmenování - --text-primary, --progress-creative atd.
Jak snadno změnit barvy:
Například chceš jinou modrou pro progress tvůrčí části?
css[data-theme="light"] {
  --progress-creative: #3b82f6; /* místo původní */
}

[data-theme="dark"] {
  --progress-creative: #60a5fa; /* světlejší pro dark */
}
Chceš změnit hlavní accent barvu?
css/* Změníš jen tyto řádky a automaticky se změní všude */
--accent-500: #8b5cf6; /* nová fialová */
--accent-600: #7c3aed;
Můžeme hned teď experimentovat:

Chceš jiné barvy pro progress bary?
Jiný styl status chipů?
Změnit primární barvu celé aplikace?
Upravit kontrasty pro lepší čitelnost?

Všechno je připravené pro okamžité změny bez rozbourání kódu! Co chceš vyzkoušet jako první? 🎨RetryLRpočkej, ale chci to mít jinak v light, jinak v darkEditAha! Rozumím - chceš různé barvy pro light a dark mode, ne jen světlejší/tmavší verze stejných barev! 💡
Máme na to perfektně připraveno! V našem themes.css můžeš nastavit úplně odlišné barvy pro každý mode.


Příklad - úplně jiné barvy:
/* LIGHT MODE - například teplé, přátelské barvy */
[data-theme="light"] {
  /* Progress v light mode - teplé barvy */
  --progress-creative: #059669;    /* smaragdově zelená */
  --progress-creative-bg: #d1fae5; /* světle zelená */
  --progress-practical: #dc2626;   /* výrazná červená */
  --progress-practical-bg: #fee2e2; /* světle růžová */

  /* Status chipy v light - pastelové */
  --status-creative-1: #065f46;    /* tmavě zelená */
  --status-creative-1-bg: #ecfdf5; /* velmi světle zelená */
  --status-creative-done: #7c2d12; /* hnědá */
  --status-creative-done-bg: #fff7ed; /* krémová */
  
  --status-practical-1: #be123c;   /* malinová */
  --status-practical-1-bg: #fff1f2; /* světle růžová */
  --status-practical-done: #1e40af; /* královsky modrá */
  --status-practical-done-bg: #eff6ff; /* světle modrá */
}

/* DARK MODE - například studené, futuristické barvy */
[data-theme="dark"] {
  /* Progress v dark mode - neonové/cyber barvy */
  --progress-creative: #06b6d4;    /* cyan */
  --progress-creative-bg: #164e63; /* tmavý cyan */
  --progress-practical: #a855f7;   /* fialová */
  --progress-practical-bg: #581c87; /* tmavá fialová */

  /* Status chipy v dark - výrazné neonové */
  --status-creative-1: #22d3ee;    /* světlý cyan */
  --status-creative-1-bg: #0e7490; /* tmavý cyan */
  --status-creative-done: #fb7185; /* korálová */
  --status-creative-done-bg: #9f1239; /* tmavá červená */
  
  --status-practical-1: #c084fc;   /* světlá fialová */
  --status-practical-1-bg: #6b21a8; /* tmavá fialová */
  --status-practical-done: #34d399; /* mint zelená */
  --status-practical-done-bg: #065f46; /* tmavá zelená */
}

/* Nebo třeba úplně jiný přístup: */

/* LIGHT MODE - Business/Corporate */
[data-theme="light"] {
  --progress-creative: #1f2937;    /* tmavě šedá */
  --progress-practical: #374151;   /* středně šedá */
}

/* DARK MODE - Creative/Artistic */
[data-theme="dark"] {
  --progress-creative: #f59e0b;    /* oranžová */
  --progress-practical: #8b5cf6;   /* fialová */
}

---

Jak to nastavit:
Ve svém frontend/src/styles/themes.css můžeš:
Možnost 1: Úplně jiné barevné schéma
css/* Light = teplé, zemité barvy */
[data-theme="light"] {
  --progress-creative: #059669;  /* zelená */
  --progress-practical: #dc2626; /* červená */
}

/* Dark = studené, tech barvy */
[data-theme="dark"] {
  --progress-creative: #06b6d4;  /* cyan */
  --progress-practical: #a855f7; /* fialová */
}
Možnost 2: Jiný "mood"
css/* Light = profesionální, konzervativní */
[data-theme="light"] {
  --progress-creative: #374151;  /* šedá */
  --progress-practical: #1f2937; /* tmavší šedá */
}

/* Dark = kreativní, výrazné */
[data-theme="dark"] {
  --progress-creative: #f59e0b;  /* oranžová */
  --progress-practical: #ec4899; /* růžová */
}
Jaký styl chceš?

🌅 Light = teplé barvy vs 🌙 Dark = studené barvy?
💼 Light = business vs 🎨 Dark = creative?
🌿 Light = přírodní vs ⚡ Dark = tech/neon?
Nebo máš vlastní představu?

Řekni mi a hned ti to nastavím! 🎨RetryLRdobře a když budu chtít v každém modu jinou barvu tlačítek a vůbec jiný styl?EditPřesně! 🎯 Máš naprostou svobodu - každý mode může mít úplně jiný design systém!

----------------

Příklady radikálně odlišných stylů:

/* =================================================================== */
/* LIGHT MODE = MINIMALISTICKÝ, SKANDINAVSKÝ STYL */
/* =================================================================== */
[data-theme="light"] {
  /* Tlačítka - minimalistické, jemné */
  --button-primary-bg: #f3f4f6;
  --button-primary-text: #374151;
  --button-primary-hover: #e5e7eb;
  --button-primary-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  
  --button-secondary-bg: transparent;
  --button-secondary-border: #d1d5db;
  --button-secondary-text: #6b7280;
  --button-secondary-hover: #f9fafb;
  
  /* Status chipy - jemné, pastelové */
  --chip-radius: 20px;
  --chip-padding: 6px 12px;
  --chip-font-size: 0.75rem;
  --chip-font-weight: 400;
  
  /* Progress bary - tenké, elegantní */
  --progress-height: 3px;
  --progress-radius: 6px;
  --progress-creative: #10b981;
  --progress-creative-bg: #d1fae5;
  --progress-practical: #3b82f6;
  --progress-practical-bg: #dbeafe;
  
  /* Karty - minimální stíny */
  --card-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  --card-radius: 8px;
  --card-border: 1px solid #f3f4f6;
  
  /* Tabulka - čisté linky */
  --table-border: 1px solid #f3f4f6;
  --table-hover: #f9fafb;
  --table-header-bg: #ffffff;
}

/* =================================================================== */
/* DARK MODE = FUTURISTICKÝ, CYBERPUNK STYL */
/* =================================================================== */
[data-theme="dark"] {
  /* Tlačítka - neonové, výrazné */
  --button-primary-bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --button-primary-text: #ffffff;
  --button-primary-hover: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
  --button-primary-shadow: 0 0 20px rgba(102, 126, 234, 0.4);
  
  --button-secondary-bg: transparent;
  --button-secondary-border: #06b6d4;
  --button-secondary-text: #06b6d4;
  --button-secondary-hover: rgba(6, 182, 212, 0.1);
  --button-secondary-shadow: 0 0 10px rgba(6, 182, 212, 0.3);
  
  /* Status chipy - neonové, sci-fi */
  --chip-radius: 4px;
  --chip-padding: 4px 8px;
  --chip-font-size: 0.7rem;
  --chip-font-weight: 600;
  --chip-text-transform: uppercase;
  --chip-letter-spacing: 0.05em;
  
  /* Progress bary - tlusté, svítící */
  --progress-height: 6px;
  --progress-radius: 0px;
  --progress-creative: #06b6d4;
  --progress-creative-bg: #164e63;
  --progress-creative-glow: 0 0 10px rgba(6, 182, 212, 0.5);
  --progress-practical: #a855f7;
  --progress-practical-bg: #581c87;
  --progress-practical-glow: 0 0 10px rgba(168, 85, 247, 0.5);
  
  /* Karty - výrazné stíny, hranatý design */
  --card-shadow: 0 0 30px rgba(6, 182, 212, 0.1);
  --card-radius: 0px;
  --card-border: 1px solid #06b6d4;
  --card-glow: 0 0 20px rgba(6, 182, 212, 0.1);
  
  /* Tabulka - neonové linky */
  --table-border: 1px solid #164e63;
  --table-hover: rgba(6, 182, 212, 0.05);
  --table-header-bg: #0f172a;
  --table-header-border: 2px solid #06b6d4;
}

/* =================================================================== */
/* APLIKUJ STYLY NA KONKRÉTNÍ KOMPONENTY */
/* =================================================================== */

/* Tlačítka */
.btn-modern {
  background: var(--button-primary-bg);
  color: var(--button-primary-text);
  border-radius: var(--card-radius, 8px);
  box-shadow: var(--button-primary-shadow);
  border: none;
  font-weight: var(--chip-font-weight, 500);
  text-transform: var(--chip-text-transform, none);
  letter-spacing: var(--chip-letter-spacing, normal);
  transition: all 0.3s ease;
}

.btn-modern:hover {
  background: var(--button-primary-hover);
  transform: translateY(-1px);
}

.btn-modern.secondary {
  background: var(--button-secondary-bg);
  color: var(--button-secondary-text);
  border: 1px solid var(--button-secondary-border);
  box-shadow: var(--button-secondary-shadow, none);
}

.btn-modern.secondary:hover {
  background: var(--button-secondary-hover);
}

/* Progress bary s glow efektem v dark mode */
.progress-bar-container {
  position: relative;
}

[data-theme="dark"] .progress-bar-container::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: var(--progress-radius);
  box-shadow: var(--progress-creative-glow);
  pointer-events: none;
}

/* Status chipy */
.status-chip {
  border-radius: var(--chip-radius);
  padding: var(--chip-padding);
  font-size: var(--chip-font-size);
  font-weight: var(--chip-font-weight);
  text-transform: var(--chip-text-transform, none);
  letter-spacing: var(--chip-letter-spacing, normal);
}

/* Karty */
.card-modern {
  border-radius: var(--card-radius);
  box-shadow: var(--card-shadow);
  border: var(--card-border);
  position: relative;
}

[data-theme="dark"] .card-modern::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: var(--card-radius);
  box-shadow: var(--card-glow);
  pointer-events: none;
}

/* Tabulka */
.table-modern {
  border: var(--table-border);
}

.table-modern .MuiTableCell-head {
  background: var(--table-header-bg);
  border-bottom: var(--table-header-border, var(--table-border));
}

.table-modern .MuiTableRow-root:hover {
  background: var(--table-hover);
}

/* =================================================================== */
/* ALTERNATIVNÍ STYLY - DALŠÍ PŘÍKLADY */
/* =================================================================== */

/* Light Mode = Retro/Vintage */
/*
[data-theme="light"] {
  --button-primary-bg: #8b4513;
  --button-primary-text: #f5deb3;
  --progress-creative: #cd853f;
  --progress-practical: #a0522d;
  --card-radius: 15px;
  --chip-radius: 25px;
}
*/

/* Dark Mode = Matrix/Hacker */
/*
[data-theme="dark"] {
  --button-primary-bg: #000000;
  --button-primary-text: #00ff00;
  --button-primary-border: 1px solid #00ff00;
  --progress-creative: #00ff00;
  --progress-practical: #00ff00;
  --card-radius: 0px;
  --chip-radius: 0px;
  --matrix-glow: 0 0 10px #00ff00;
}
*/

/* Light Mode = Pastel/Kawaii */
/*
[data-theme="light"] {
  --button-primary-bg: #ffb6c1;
  --button-primary-text: #ffffff;
  --progress-creative: #98fb98;
  --progress-practical: #ffd1dc;
  --card-radius: 20px;
  --chip-radius: 30px;
}
*/
-------
Jak to použít:
1. V themes.css nastav úplně jiné styly:
css/* Light = Minimalistický skandinavský */
[data-theme="light"] {
  --button-style: jemné, bez stínů
  --colors: neutrální, teplé
  --shapes: zaoblené
}

/* Dark = Cyberpunk futuristický */
[data-theme="dark"] {
  --button-style: neonové, svítící
  --colors: výrazné, studené
  --shapes: hranaté
}
2. Nebo zkus jiné kombinace:

🏢 Light = Corporate (šedá, čistá) vs 🎨 Dark = Creative (barevná, hravá)
📜 Light = Vintage (hnědá, retro) vs 🤖 Dark = Sci-fi (zelená, Matrix)
🌸 Light = Pastel (růžová, kawaii) vs ⚫ Dark = Gothic (černá, červená)

3. Každý mode může mít:

Jiné tvary tlačítek (kulaté vs hranaté)
Jiné stíny (jemné vs výrazné glow)
Jiné animace (smooth vs robotic)
Jiné fonty (serif vs monospace)
Jiné ikony (minimální vs výrazné)

Jaký styl kombináš? Řekni mi svou představu a nastavím ti to! 🚀

IKONY
------

2. Změna typu ikon v iconConfig.js
Najdi ve svém iconConfig.js tento řádek:
javascriptconst CURRENT_ICON_TYPE = 'geometric';
A změň ho na:
javascriptconst CURRENT_ICON_TYPE = 'dots'; // nebo cokoliv jiného chceš

1. Pro tečky změň na:
javascriptconst CURRENT_ICON_TYPE = 'dots';

2. Pro emoji změň na:
const CURRENT_ICON_TYPE = 'emoji';
const CURRENT_EMOJI_SET = 'tech'; // nebo jaké chceš

3. Pro čtverce:
javascriptconst CURRENT_ICON_TYPE = 'squares';

4. Pro velké rainbow emoji:
const CURRENT_ICON_TYPE = 'emoji';
const CURRENT_EMOJI_SET = 'animals';
const CURRENT_COLOR_SCHEME = 'rainbow';
const CURRENT_ICON_SIZE = 'large'; // nebo 'tiny', 'small', 'medium', 'huge'

Proč ne všechno najednou?
Systém funguje jako rádio - můžeš poslouchat jen jednu stanici najednou. Ale můžeš snadno přepínat mezi nimi!
Kterou kombinaci chceš zkusit první? 🎯

🔥 Tech emoji?
🌈 Rainbow zvířátka?
⚫ Minimální tečky?
🎨 Barevné čtverce?
🎨 typed - modré tvůrčí, fialové praktické
🌈 rainbow - každý status má jinou barvu
🔥 gradient - žlutá→oranžová→červená→zelená podle pokroku
❄️ temperature - teplé vs studené barvy

💡 Příklady barevných schémat:
1. Teplé barvy:

Tvůrčí: #f59e0b (oranžová)
Praktická: #dc2626 (červená)

2. Studené barvy:

Tvůrčí: #06b6d4 (cyan)
Praktická: #8b5cf6 (fialová)

3. Přírodní barvy:

Tvůrčí: #059669 (zelená)
Praktická: #92400e (hnědá)

----
V iconConfig.js změň:
javascriptconst CURRENT_ICON_TYPE = 'dots'; // nebo 'squares', 'progress' atd.
🎨 Později - vlastní SVG:

Vytvoř SVG komponenty
Přidej je do customSvgIcons
Změň CURRENT_ICON_TYPE = 'custom'

💡 Budoucí možnosti:

Settings panel pro změnu ikon
Uložení do localStorage
Mix různých setů