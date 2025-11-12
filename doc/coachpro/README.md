# CoachPro 🌿

Aplikace pro koučky a jejich klientky - sdílení materiálů mezi sezeními.

## 🎯 O projektu

CoachPro je frontend-only React aplikace určená pro koučky, které chtějí sdílet materiály (audio, PDF, texty, odkazy) se svými klientkami v rámci strukturovaných programů. Aplikace funguje čistě na localStorage bez nutnosti backendu.

## ✨ Funkce (aktuální stav)

### ✅ Implementováno (Sprint 1, 2 & 3)

**Základ aplikace:**
- ✅ React 18 + Vite setup
- ✅ Material-UI v6 s Nature theme
- ✅ Dark/Light mode
- ✅ Responsive design (mobile-first)
- ✅ React Router v6 pro navigaci
- ✅ LocalStorage pro persistenci dat
- ✅ Framer Motion animace

**Pro koučky:**
- ✅ Login screen s výběrem role
- ✅ Dashboard s přehledem (statistiky, poslední aktivita)
- ✅ Sidebar navigace
- ✅ Header s theme toggle
- ✅ **Knihovna materiálů**
  - ✅ Grid zobrazení materiálů
  - ✅ Vyhledávání materiálů
  - ✅ Filtrování podle kategorie
  - ✅ Přidávání materiálů (audio, PDF, text, odkaz)
  - ✅ Smazání materiálu
  - ✅ Preview materiálů (připraveno)
- ✅ **Programy** (Sprint 3 - HOTOVO!)
  - ✅ Vytvoření programů (7, 14, 21, 30 dní)
  - ✅ 2-step editor (basic info + days setup)
  - ✅ Přiřazení materiálů k jednotlivým dnům
  - ✅ Material selector dialog
  - ✅ Generování QR kódů a share kódů (6místných)
  - ✅ ShareProgramModal s QR kódem
  - ✅ Grid zobrazení programů
  - ✅ Editace a mazání programů
  - ✅ Sdílení přes WhatsApp/email

### 🚧 V plánu (Sprint 4+)

**Pro koučky:**
- 🔜 Seznam klientek a jejich progress
- 🔜 Editace materiálů
- 🔜 Detail klientky s progress grafem

**Pro klientky:**
- 🔜 Vstup přes kód/QR
- 🔜 Denní přehled materiálů
- 🔜 Mood check
- 🔜 Progress garden vizualizace
- 🔜 Streak tracking
- 🔜 Celebration po dokončení

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite
- **UI Library:** Material-UI v6
- **Routing:** React Router v6
- **Storage:** localStorage
- **Styling:** MUI emotion, Nature theme
- **Icons:** MUI Icons + Lucide React
- **Animations:** Framer Motion
- **Audio:** wavesurfer.js (připraveno)
- **QR Codes:** qrcode + qrcode.react

## 📦 Instalace

```bash
# Naklonuj repozitář
cd coachpro

# Nainstaluj dependencies
npm install

# Spusť dev server
npm run dev

# Aplikace poběží na http://localhost:3000
```

## 🚀 Spuštění

```bash
# Development
npm run dev

# Build pro produkci
npm run build

# Preview production buildu
npm run preview
```

## 📁 Struktura projektu

```
coachpro/
├── src/
│   ├── modules/
│   │   └── coach/
│   │       ├── components/
│   │       │   ├── coach/          # Komponenty pro koučku
│   │       │   │   ├── DashboardOverview.jsx
│   │       │   │   ├── MaterialsLibrary.jsx
│   │       │   │   ├── MaterialCard.jsx
│   │       │   │   ├── AddMaterialModal.jsx
│   │       │   │   ├── ProgramsList.jsx
│   │       │   │   └── ClientsList.jsx
│   │       │   ├── client/          # Komponenty pro klientku (připraveno)
│   │       │   └── shared/          # Sdílené komponenty modulu (připraveno)
│   │       ├── pages/
│   │       │   ├── Login.jsx
│   │       │   ├── CoachDashboard.jsx
│   │       │   └── ClientView.jsx
│   │       ├── hooks/               # Custom hooks (připraveno)
│   │       └── utils/
│   │           ├── storage.js       # LocalStorage utils
│   │           ├── generateCode.js  # QR & share kódy
│   │           └── animations.js    # Framer Motion varianty
│   ├── shared/
│   │   ├── themes/
│   │   │   └── natureTheme.js      # Nature theme z PaymentsPro
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   ├── Header.jsx
│   │   │   └── Sidebar.jsx
│   │   └── utils/
│   │       └── helpers.js          # Utility funkce
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

## 💾 Data struktura (localStorage)

### Keys
- `coachpro_coaches` - Array of coaches
- `coachpro_materials` - Array of materials
- `coachpro_programs` - Array of programs
- `coachpro_clients` - Array of clients
- `coachpro_currentUser` - Current logged in user

### Material Schema
```javascript
{
  id: "uuid",
  coachId: "uuid",
  type: "audio" | "pdf" | "text" | "link",
  title: "Název materiálu",
  description: "Popis",
  content: "base64 nebo URL nebo text",
  category: "meditation" | "affirmation" | "exercise" | "reflection" | "other",
  duration: 600,        // jen pro audio (sekundy)
  fileSize: 1024000,    // bytes
  createdAt: "ISO timestamp"
}
```

## 🎨 Design systém

### Nature Theme
Aplikace používá Nature theme zkopírovaný z PaymentsPro projektu s těmito barvami:

**Light mode:**
- Primary: `#556B2F` (Lesní zelená)
- Secondary: `#BC8F8F` (Dusty rose)
- Accent: `#8FBC8F` (Sage)

**Dark mode:**
- Primary: `#8FBC8F` (Sage)
- Secondary: `#BC8F8F` (Dusty rose)

### Glassmorphism efekty
```css
backdrop-filter: blur(10px);
background: rgba(255, 255, 255, 0.8);
border: 1px solid rgba(255, 255, 255, 0.1);
```

## 🔐 Autentizace

V tuto chvíli je implementována **demo autentizace**:
- Kliknutím na "Jsem koučka" se vytvoří demo koučka v localStorage
- Kliknutím na "Jsem klientka" se přesměruje na vstupní stránku (připraveno)

## 📝 Použití

### Jako koučka

1. **Login** - Klikni na "Jsem koučka"
2. **Dashboard** - Přehled statistik a poslední aktivity
3. **Materiály** - Přidej své audio, PDF, texty nebo odkazy
4. **Programy** - Vytvoř program z materiálů a sdílej ho s klientkami
5. **Klientky** (připraveno) - Sleduj progress klientek

### Přidání materiálu

1. Naviguj na **Materiály** (v sidebar)
2. Klikni **"Přidat materiál"**
3. Vyber typ (Audio, PDF, Text, nebo Odkaz)
4. Nahraj soubor nebo zadej obsah
5. Vyplň název, popis a kategorii
6. Klikni **"Uložit materiál"**

### Vytvoření programu

1. Naviguj na **Programy** (v sidebar)
2. Klikni **"Vytvořit program"**
3. **Krok 1:** Vyplň základní info (název, popis, délka)
4. **Krok 2:** Pro každý den nastav:
   - Název dne (např. "Den 1: Uvědomění")
   - Popis dne
   - Vyber materiály z knihovny
   - Napiš instrukce pro klientku
5. Klikni **"Vytvořit program"**
6. Program se automaticky vygeneruje s **QR kódem** a **6místným kódem**
7. Sdílej kód s klientkou přes WhatsApp, email nebo jiný kanál

## 🐛 Známé problémy

- [ ] Preview materiálů není plně implementováno
- [ ] Editace materiálů není implementována
- [ ] Klientská část není implementována

## 🎯 Roadmap

### ✅ Sprint 3 (Programy) - DOKONČENO!
- ✅ Program Editor (2-step form)
- ✅ Material selector
- ✅ QR kód generování
- ✅ Share program modal
- ✅ Programs list s grid zobrazením
- ✅ Editace a mazání programů

### Sprint 4 (Klientky - vstup)
- [ ] Client entry screen (kód + QR)
- [ ] Denní přehled
- [ ] Material renderers (audio player, PDF viewer)

### Sprint 5 (Gamifikace)
- [ ] Mood check
- [ ] Progress garden
- [ ] Streak tracking
- [ ] Celebration modal

### Sprint 6 (Polish)
- [ ] Dark mode improvements
- [ ] Animations polish
- [ ] Mobile optimalizace
- [ ] Error handling

## 📄 Licence

Tento projekt je vytvořen pro soukromé použití.

## 👩‍💻 Autor

Vytvořeno pro Lenka Roubalová pomocí Claude Code.

---

**Verze:** 0.3.0 (Sprint 1, 2 & 3 dokončeno)
**Poslední update:** 26. října 2024

### Co je nového v Sprint 3:
- ✨ Kompletní systém pro vytváření programů
- 🎨 2-step wizard s materiál selectorem
- 📱 QR kódy a share kódy pro snadné sdílení
- 💾 Editace a mazání programů
- 🌟 Plně funkční flow pro koučky
