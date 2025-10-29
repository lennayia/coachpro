# 🤖 Instrukce pro Claude - CoachPro projekt

> **Pro budoucí Claude session**: Přečti si tento dokument pro plný kontext projektu

---

## 📍 Současný stav projektu

**Poslední update**: 29. října 2025, 14:50
**Autor**: Lenka Roubalová + Claude (Opus + Sonnet 4.5)
**Sprint**: ✅ Sprint 9 dokončen (Glassmorphism & UI Polish - modaly + glow efekty)
**Status**: ✅ Funkční a testováno - 4 session dokumentace (28-29 října)
**Dev server**: `http://localhost:3000/`
**Projekt**: `/Users/lenkaroubalova/Documents/Projekty/coachpro`

---

## 🎯 Co je CoachPro?

Webová aplikace pro **kouče a jejich klientky**. Kouč vytváří programy s denními materiály (audio meditace, PDF, cvičení, dokumenty) a sdílí je pomocí QR kódu nebo 6místného kódu. Klientka pak denně postupuje programem a sleduje svůj pokrok.

**Tech stack**: React 18, Material-UI v6, Vite, React Router, localStorage
**Design**: Nature theme (zelené barvy), glassmorphism, inspirováno PaymentsPro

---

## ✅ Co je hotové (Sprint 1-4.5)

### Sprint 1: Základní struktura
- ✅ Autentizace kouče (jméno, email) - sessionStorage
- ✅ Protected routes (Coach/Client)
- ✅ Layout s Header + Sidebar
- ✅ Nature theme (light/dark mode)
- ✅ Responsive design

### Sprint 2: Materiály
- ✅ 5 typů materiálů: Audio (MP3), PDF, Dokumenty (DOC/XLS/PPT), Text, Odkazy
- ✅ CRUD operace pro materiály
- ✅ Drag & Drop upload
- ✅ Base64 storage v localStorage (limit 3MB)
- ✅ Preview modal s glassmorphism
- ✅ Custom audio player
- ✅ PDF viewer
- ✅ Document viewer (download)
- ✅ Kategorie (Meditace, Afirmace, Cvičení, Reflexe, Ostatní)
- ✅ Search & filtrování

### Sprint 3: Programy & Klientky
- ✅ Tvorba programu (multi-step form)
- ✅ Každý den má: název, popis, materiály, instrukce
- ✅ QR kód generování
- ✅ 6místný share code
- ✅ Sdílení přes Web Share API
- ✅ Vstup klientky přes kód
- ✅ Denní view s materiály (jen pro aktuální den)
- ✅ Progress tracking (🌰→🌱→🌸)
- ✅ Mood check (optional)
- ✅ Celebration modal s confetti
- ✅ Streak counter

### Sprint 4: Bug Fixes
- ✅ MP3 playback error handling
- ✅ PDF storage error handling (5MB limit)
- ✅ Document support (DOC/XLS/PPT + OpenDocument)
- ✅ Google Drive/iCloud link support
- ✅ Program days initialization fix
- ✅ Next day navigation fix
- ✅ Drag & Drop fix (prevent browser default)
- ✅ Preview modal místo černé obrazovky

### Sprint 4.5: Border-Radius System
- ✅ Centralizovaný border-radius systém `/src/styles/borderRadius.js`
- ✅ Proporcionální zakulacení (12px/16px/18px/20px/24px)
- ✅ Theme overrides pro všechny MUI komponenty
- ✅ Opraveno 11 komponent (Dashboard, Sidebar, Modals, atd.)
- ✅ Sidebar optimalizace (200px šířka, kompaktní menu)
- ✅ Dashboard tlačítka (ne fullWidth, alignItems: flex-start)

### Sprint 5: Externí odkazy
- ✅ Podpora 11 služeb + generic fallback
- ✅ Auto-detekce služby z URL (YouTube, Spotify, Google Drive, iCloud, atd.)
- ✅ Embed rendering pro YouTube, Vimeo, Spotify, SoundCloud, Instagram
- ✅ Vícebarevná reálná loga služeb (ServiceLogo komponenta)
- ✅ Moderní minimalistický design karet s logem v rohu
- ✅ Preview modal s embed supportem
- ✅ YouTube Shorts podpora
- ✅ Link detection utils (`/src/modules/coach/utils/linkDetection.js`)
- ✅ Thumbnail generování pro YouTube videa

### Sprint 6: Supabase Storage & UI vylepšení
- ✅ **Supabase Storage integrace** - 1 GB prostor místo 5 MB localStorage
- ✅ **Sanitizace názvů souborů** - čitelné názvy v Supabase (`mikova-vlasta-hosting-7eec5405.pdf`)
- ✅ **Transliterace češtiny** - á→a, č→c, ř→r, atd.
- ✅ **RLS politiky** - SQL politiky pro INSERT, SELECT, DELETE
- ✅ **Editace materiálů** - plně funkční edit mode
- ✅ **UI redesign karet** - odstraněno "three dots" menu, všechny akce viditelné
- ✅ **Počet stran u PDF** - skutečný počet stran (pdfjs-dist)
- ✅ **Odhad stran u textu** - 2000 znaků = 1 strana
- ✅ **Zobrazení názvu souboru** - na kartě s ikonou 📎
- ✅ **Async delete** - mazání z Supabase i localStorage
- ✅ **Fallback na base64** - pokud Supabase není dostupný
- ✅ **Odstraněno auto-fill názvu** - uživatel zadá vlastní popisný název
- ✅ **MaterialCard responsivita** - funguje na 320px+ obrazovkách (Sprint 6.7)

### Sprint 6.8: iOS Support & Logo
- ✅ **HEIC/HEIF podpora** - automatická konverze iPhone obrázků na JPEG při uploadu
- ✅ **MOV video podpora** - správná detekce MIME typu pro iPhone/Mac videa
- ✅ **Logo implementace** - logo v Header (48px), Login page (80px), favicon
- ✅ **heic2any knihovna** - lazy loading konverze HEIC→JPEG (90% kvalita)
- ✅ **Responsive header** - text "CoachPro" + popisek jen na desktopu, mobil jen logo

### Sprint 6.9: Glassmorphism Redesign (AKTUÁLNÍ)
- ✅ **Completion screen redesign** - moderní glassmorphism efekty s blur(40px) + saturate(180%)
- ✅ **ProgressGarden redesign** - minimalistický styl s glassmorphism, zaoblené day bloky
- ✅ **Button effects** - gradientní pozadí, shine animace, inset highlights, hover efekty
- ✅ **Border-radius optimalizace** - finální hodnoty pro všechny komponenty:
  - Hlavní panely (Card): 40px
  - Boxy "Aktuální série": 32-33px
  - Day bloky (čísla 1-7): 32px
  - Day header: 36px
- ✅ **Radial gradient overlays** - "kouřový" efekt v pozadí karet
- ✅ **Konzistentní design jazyk** - inspirováno PaymentsPro

---

## 🚨 KRITICKÁ PRAVIDLA - VŽDY DODRŽUJ!

### 0. ⚠️ Základní komunikační pravidla

**VŽDY MLUVIT ČESKY** - Uživatelka je česká, všechna komunikace musí být v češtině!

**MAZAT starý kód, ne komentovat:**
```javascript
// ❌ ŠPATNĚ - necháváš zakomentovaný kód
// const oldFunction = () => { ... };
const newFunction = () => { ... };

// ✅ SPRÁVNĚ - starý kód smazán
const newFunction = () => { ... };
```

**Dbát na modularitu:**
- Tento projekt bude součástí ProApp ekosystému
- Hodně funkcí bude sdíleno napříč aplikacemi (auth, storage, komponenty)
- Používat path aliases (@shared, @modules, @assets, @styles)
- Psát znovupoužitelné komponenty
- Minimalizovat závislosti mezi moduly

### 1. ⚠️ Border-Radius systém

**NIKDY** nepoužívej hardcodované hodnoty jako `borderRadius: 2` nebo `borderRadius: '16px'`

**VŽDY** importuj a používej centralizovaný systém:

```javascript
import BORDER_RADIUS from '../../styles/borderRadius';

// ✅ SPRÁVNĚ:
sx={{ borderRadius: BORDER_RADIUS.small }}     // 12px
sx={{ borderRadius: BORDER_RADIUS.compact }}   // 16px
sx={{ borderRadius: BORDER_RADIUS.button }}    // 18px
sx={{ borderRadius: BORDER_RADIUS.card }}      // 20px

// ❌ ŠPATNĚ:
sx={{ borderRadius: 2 }}
sx={{ borderRadius: '12px' }}
```

**Hodnoty:**
- `minimal`: 8px - Progress bary
- `small`: 12px - Menu items, malé prvky
- `compact`: 16px - Kontejnery, input fieldy
- `button`: 18px - Tlačítka
- `standard/card`: 20px - Karty, panely
- `dialog`: 20px - Dialogy
- `premium`: 24px - Velké prvky

### 2. 🎨 Design konvence

**Barvy**: Používej theme palette, ne hardcodované hex
```javascript
// ✅ SPRÁVNĚ:
color: 'primary.main'
backgroundColor: theme.palette.mode === 'dark' ? '...' : '...'

// ❌ ŠPATNĚ:
color: '#556B2F'
```

**Glassmorphism efekt:**
```javascript
sx={{
  backdropFilter: 'blur(20px)',
  backgroundColor: theme.palette.mode === 'dark'
    ? 'rgba(26, 26, 26, 0.95)'
    : 'rgba(255, 255, 255, 0.95)',
  border: theme.palette.mode === 'dark'
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(0, 0, 0, 0.1)'
}}
```

**Tlačítka**: Kompaktní design, ne fullWidth pokud to není nutné
```javascript
// ✅ SPRÁVNĚ:
<Button size="medium" sx={{ py: 1 }}>Text</Button>

// ❌ ŠPATNĚ:
<Button fullWidth>Text</Button>  // jen pokud je to opravdu potřeba
```

### 3. 📦 LocalStorage limit

**Max 5MB celkem!** Kontroluj velikost před uložením.

```javascript
// storage.js má kontrolu:
if (sizeInMB > 5) {
  throw new Error('Data je příliš velká...');
}
```

**File size limity:**
- Audio/PDF/Dokumenty: max 3MB
- Images: max 2MB

### 4. 🔒 Důležité soubory - NIKDY NEMAZAT!

```
/src/styles/borderRadius.js                      ⚠️ KRITICKÝ - border-radius systém
/src/shared/themes/natureTheme.js                Theme s colors & overrides
/src/modules/coach/utils/storage.js              LocalStorage utils
/src/modules/coach/utils/generateCode.js         UUID & QR generování
/src/modules/coach/utils/linkDetection.js        ⚠️ KRITICKÝ - detekce externích odkazů
/src/modules/coach/utils/supabaseStorage.js      ⚠️ KRITICKÝ - Supabase upload/delete/sanitizace
/src/config/supabase.js                          Supabase client
/src/assets/service-logos/                       Vícebarevná SVG loga služeb
.env                                              ⚠️ NIKDY NECOMMITOVAT - Supabase credentials
```

---

## 🔗 PODPORA EXTERNÍCH ODKAZŮ

### Podporované služby (11 + generic)

CoachPro automaticky rozpozná a zobrazí odkazy na tyto služby:

| Služba | Embed Support | Barva | Icon |
|--------|---------------|-------|------|
| **YouTube** | ✅ Ano | `#FF0000` | ▶️ |
| **Vimeo** | ✅ Ano | `#1AB7EA` | 🎬 |
| **Spotify** | ✅ Ano | `#1DB954` | 🎵 |
| **SoundCloud** | ✅ Ano | `#FF5500` | 🔊 |
| **Instagram** | ✅ Ano | `#E4405F` | 📷 |
| **Google Drive** | ✅ Ano | `#4285F4` | 📁 |
| **iCloud** | ❌ Ne | `#000000` | ☁️ |
| **Dropbox** | ❌ Ne | `#0061FF` | 📦 |
| **OneDrive** | ❌ Ne | `#0078D4` | ☁️ |
| **Canva** | ❌ Ne | `#00C4CC` | 🎨 |
| **Notion** | ❌ Ne | `#000000` | 📝 |
| **Generic** | ❌ Ne | `#757575` | 🔗 |

### Auto-detection patterns

```javascript
// YouTube - podporuje i Shorts!
'youtube.com/watch?v=XXX'
'youtu.be/XXX'
'youtube.com/shorts/XXX'  // ← Nově podporováno!

// Spotify
'spotify.com/track/XXX'
'spotify.com/playlist/XXX'
'open.spotify.com/...'

// Google Drive
'drive.google.com/...'
'docs.google.com/...'

// OneDrive
'onedrive.live.com/...'
'1drv.ms/...'  // ← Short URL

// Notion
'notion.so/...'
'notion.site/...'

// ... a další
```

### Klíčové funkce (/src/modules/coach/utils/linkDetection.js)

```javascript
// 1. Detekce typu služby
detectLinkType(url)
// Vrací: { type, icon, label, color, embedSupport }

// 2. Generování embed URL
getEmbedUrl(url, linkType)
// Vrací: embed URL string nebo null

// 3. Validace URL
isValidUrl(string)
// Vrací: boolean

// 4. YouTube thumbnail
getThumbnailUrl(url, linkType)
// Vrací: URL náhledového obrázku
```

### Vícebarevná loga služeb

Všechna loga jsou implementována jako **vícebarevné SVG komponenty** v `/src/assets/service-logos/`:

```
/src/assets/service-logos/
├── YouTube.jsx        # Červené s bílým symbolem
├── Spotify.jsx        # Zelené s bílým symbolem
├── GoogleDrive.jsx    # Vícebarevné (🔵🟢🟡🔴)
├── Instagram.jsx      # Gradient (🟡→🔴→🟣)
├── Vimeo.jsx          # Světle modré
├── SoundCloud.jsx     # Oranžové s detaily
├── iCloud.jsx         # Modré s gradientem
├── Dropbox.jsx        # Modré
├── OneDrive.jsx       # Modré s gradienty
├── Canva.jsx          # Tyrkysové s gradientem
└── Notion.jsx         # Černobílé
```

**Použití:**
```javascript
import ServiceLogo from './shared/ServiceLogo';

<ServiceLogo linkType="youtube" size={32} />
<ServiceLogo linkType="google-drive" size={24} />
```

### Material object s link typem

```javascript
{
  id: 'uuid',
  coachId: 'coach-id',
  type: 'link',                        // ← Typ materiálu
  title: 'Ranní meditace',
  description: '10minutová vedená meditace',
  content: 'https://youtube.com/watch?v=abc123',  // ← URL místo base64
  linkType: 'youtube',                 // ← Detekovaný typ služby
  linkMeta: {                          // ← Metadata služby
    icon: '▶️',
    label: 'YouTube',
    color: '#ff0000',
    embedSupport: true
  },
  category: 'meditation',
  thumbnail: 'https://img.youtube.com/vi/abc123/maxresdefault.jpg',  // ← Volitelné (jen YouTube)
  createdAt: '2025-10-26T12:00:00Z'
}
```

### Komponenty a jejich implementace

**1. AddMaterialModal.jsx**
- ✅ TextField pro URL s auto-detekcí
- ✅ Moderní preview box s gradientem a barvou služby
- ✅ Živý iframe preview pro služby s embedSupport
- ✅ Info alert pro služby bez embed supportu
- ✅ Validace URL před uložením

**2. MaterialCard.jsx** (Moderní minimalistický design)
- ✅ Reálné vícebarevné logo (32px) v pravém horním rohu
- ✅ Kompaktní chip s názvem služby v barvě služby
- ✅ Chip "Náhled" pro služby s embedSupport
- ✅ Tlačítko "Náhled" pro všechny materiály
- ✅ Tlačítko "Otevřít" s ikonou pro link materiály
- ✅ Logo místo velkého headeru (modernější než původní specifikace)

**3. DailyView.jsx** (Zobrazení pro klientky)
- ✅ YouTube embed (16:9, moderní design s tínem)
- ✅ Vimeo embed (16:9)
- ✅ Spotify embed (380px výška)
- ✅ SoundCloud embed (166px výška)
- ✅ Instagram embed (max 540px, 600px výška)
- ✅ Fallback tlačítko s gradientem pro ostatní služby

**4. PreviewModal.jsx**
- ✅ Stejný embed rendering jako DailyView
- ✅ Konzistentní design napříč aplikací
- ✅ Glassmorphism efekt
- ✅ Zobrazení loga a názvu služby v headeru

### Embed URL formáty

```javascript
// YouTube
`https://www.youtube.com/embed/${videoId}?rel=0`

// Vimeo
`https://player.vimeo.com/video/${videoId}`

// Spotify
`https://open.spotify.com/embed/${type}/${id}`

// SoundCloud
`https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23ff5500&...`

// Instagram
`https://www.instagram.com/${type}/${id}/embed`
```

### YouTube Shorts podpora

**DŮLEŽITÉ**: YouTube Shorts mají speciální URL formát, který je nyní plně podporován:

```javascript
// Regex pattern podporuje:
/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^&\s?]+)/

// Příklady podporovaných URL:
✅ https://youtube.com/watch?v=dQw4w9WgXcQ
✅ https://youtu.be/dQw4w9WgXcQ
✅ https://youtube.com/shorts/BF2E0YBDPPk  // ← Shorts!
✅ https://youtube.com/embed/dQw4w9WgXcQ
```

---

## 📁 Struktura projektu

```
coachpro/
├── src/
│   ├── App.jsx                          # Root + routing
│   ├── main.jsx                         # Entry point
│   │
│   ├── modules/
│   │   └── coach/
│   │       ├── pages/
│   │       │   ├── CoachAuth.jsx        # Přihlášení kouče
│   │       │   ├── CoachDashboard.jsx   # Dashboard
│   │       │   └── ClientAuth.jsx       # Vstup klientky
│   │       │
│   │       ├── components/
│   │       │   ├── coach/               # Komponenty pro kouče
│   │       │   │   ├── DashboardOverview.jsx
│   │       │   │   ├── MaterialsLibrary.jsx
│   │       │   │   ├── MaterialCard.jsx
│   │       │   │   ├── AddMaterialModal.jsx
│   │       │   │   ├── ProgramsList.jsx
│   │       │   │   ├── ProgramEditor.jsx
│   │       │   │   ├── ShareProgramModal.jsx
│   │       │   │   └── ClientsList.jsx (placeholder)
│   │       │   │
│   │       │   ├── client/              # Komponenty pro klientky
│   │       │   │   ├── ClientEntry.jsx
│   │       │   │   ├── DailyView.jsx
│   │       │   │   ├── MoodCheck.jsx
│   │       │   │   ├── ProgressGarden.jsx
│   │       │   │   └── CelebrationModal.jsx
│   │       │   │
│   │       │   └── shared/              # Sdílené komponenty
│   │       │       ├── CustomAudioPlayer.jsx
│   │       │       ├── PDFViewer.jsx
│   │       │       ├── DocumentViewer.jsx
│   │       │       ├── PreviewModal.jsx (glassmorphism)
│   │       │       └── ServiceLogo.jsx  # Vícebarevná loga služeb
│   │       │
│   │       └── utils/
│   │           ├── storage.js           # LocalStorage CRUD
│   │           ├── supabaseStorage.js   # ⚠️ KRITICKÝ - Supabase upload/delete/sanitizace
│   │           ├── generateCode.js      # UUID + QR kódy
│   │           ├── linkDetection.js     # ⚠️ KRITICKÝ - Auto-detekce odkazů
│   │           ├── animations.js        # framer-motion
│   │           └── helpers.js           # Helper funkce (+ PDF page count)
│   │
│   ├── config/
│   │   └── supabase.js                  # Supabase client
│   │
│   ├── assets/
│   │   └── service-logos/               # ⚠️ KRITICKÝ - Vícebarevná SVG loga
│   │       ├── YouTube.jsx
│   │       ├── Spotify.jsx
│   │       ├── GoogleDrive.jsx
│   │       ├── Instagram.jsx
│   │       ├── Vimeo.jsx
│   │       ├── SoundCloud.jsx
│   │       ├── iCloud.jsx
│   │       ├── Dropbox.jsx
│   │       ├── OneDrive.jsx
│   │       ├── Canva.jsx
│   │       └── Notion.jsx
│   │
│   ├── shared/
│   │   ├── components/
│   │   │   ├── Layout.jsx               # Main layout wrapper
│   │   │   ├── Header.jsx               # Top bar
│   │   │   └── Sidebar.jsx              # Navigation (200px, kompaktní)
│   │   │
│   │   ├── themes/
│   │   │   └── natureTheme.js           # Theme s border-radius overrides
│   │   │
│   │   └── utils/
│   │       └── helpers.js
│   │
│   └── styles/
│       └── borderRadius.js              ⚠️ KRITICKÝ SOUBOR
│
├── .env                                  # ⚠️ NIKDY NECOMMITOVAT - Supabase credentials
├── .env.example                          # Template pro .env
├── summary.md                           # Kompletní dokumentace
├── claude.md                            # Tento soubor
└── package.json
```

---

## 💾 LocalStorage struktura

### Keys:
```javascript
'coachpro_users'      // Array of coaches
'coachpro_materials'  // Array of materials
'coachpro_programs'   // Array of programs
'coachpro_clients'    // Array of clients
```

### SessionStorage:
```javascript
'coachpro_currentUser'    // Current coach session
'coachpro_currentClient'  // Current client session
```

### Material object:
```javascript
{
  id: 'uuid',
  coachId: 'coach-id',
  type: 'audio' | 'pdf' | 'document' | 'text' | 'link',
  title: 'Název',
  description: 'Popis',
  content: 'base64 string nebo Supabase URL nebo link URL',
  category: 'meditation' | 'affirmation' | 'exercise' | 'reflection' | 'other',

  // File-based materials:
  duration: 180,        // seconds (audio only)
  fileSize: 1024000,    // bytes
  fileName: 'mikova-vlasta-hosting.pdf',  // ⚠️ NOVÉ (Sprint 6) - originální název souboru
  pageCount: 45,        // ⚠️ NOVÉ (Sprint 6) - počet stran (PDF/text)
  storagePath: 'demo-coach-1/pdf/mikova-vlasta-hosting-7eec5405.pdf',  // ⚠️ NOVÉ (Sprint 6) - Supabase path

  // Link specific fields (Sprint 5):
  linkType: 'youtube' | 'spotify' | 'google-drive' | ...,  // typ detekované služby
  linkMeta: {                                               // metadata služby
    icon: '▶️',
    label: 'YouTube',
    color: '#ff0000',
    embedSupport: true
  },
  thumbnail: 'https://img.youtube.com/vi/abc123/maxresdefault.jpg',  // jen YouTube

  createdAt: '2025-10-26T12:00:00Z',
  updatedAt: '2025-10-27T10:00:00Z'  // ⚠️ NOVÉ (Sprint 6) - při editaci
}
```

### Program object:
```javascript
{
  id: 'uuid',
  coachId: 'coach-id',
  title: 'Program název',
  description: 'Popis',
  duration: 7,          // počet dnů
  shareCode: 'ABC123',  // 6-char code
  qrCode: 'data:image/png;base64,...',
  isActive: true,
  days: [
    {
      dayNumber: 1,
      title: 'Den 1',
      description: 'Úvod',
      materialIds: ['mat-1', 'mat-2'],
      instruction: 'Dnes začínáme...'
    }
  ],
  createdAt: '2025-10-26T12:00:00Z'
}
```

### Client object:
```javascript
{
  id: 'uuid',
  name: 'Jméno klientky',
  programCode: 'ABC123',
  programId: 'prog-id',
  currentDay: 1,
  completedDays: [1, 2, 3],
  moodChecks: [
    { day: 1, before: '😊', after: '😌', timestamp: '...' }
  ],
  startedAt: '2025-10-26T12:00:00Z',
  completedAt: null
}
```

---

## 🎨 Design preferenceuživatelky

### Co preferuje:
✅ **Kompaktní design** - ne moc velká tlačítka, padding
✅ **Proporcionální zakulacení** - větší prvky = větší border-radius
✅ **Individuální zakulacení menu items** - každá položka má zaoblené rohy
✅ **Úzký sidebar** - 200px je optimální
✅ **Tlačítka ne fullWidth** - jen tak široká, jak potřebují
✅ **Glassmorphism** - blur efekty, transparentní pozadí

### Co NECHCE:
❌ Příliš velké tlačítka
❌ Tlačítka na celou šířku (pokud to není nutné)
❌ Nekonzistentní border-radius
❌ Hardcodované hodnoty místo centrálního systému
❌ Moc široký sidebar

---

## 🔧 Jak pracovat s projektem

### Spuštění:
```bash
cd /Users/lenkaroubalova/Documents/Projekty/coachpro
npm run dev
# Server: http://localhost:3000/
```

### Testování:
1. **Jako kouč:**
   - Otevři `/coach/auth`
   - Zadej jméno + email
   - Dashboard → Přidat materiál (audio/PDF/text)
   - Programy → Vytvořit program (7 dnů)
   - Získej 6místný kód

2. **Jako klient:**
   - Otevři `/client/entry` (v incognito)
   - Zadej 6místný kód + jméno
   - Procházej program den po dni

### Debug:
```bash
# Clear localStorage
localStorage.clear()

# Clear Vite cache
rm -rf node_modules/.vite

# Restart server
# Ctrl+C, pak npm run dev

# Hard refresh v prohlížeči
# Mac: Cmd + Shift + R
# Win: Ctrl + Shift + R
```

### Důležité:
- **Vždy čti `summary.md`** pro kontext předchozích změn
- **Nikdy nemaž** `/src/styles/borderRadius.js`
- **Vždy používej** BORDER_RADIUS konstanty
- **Testuj v obou režimech** (light & dark mode)

---

## 🐛 Známé problémy a limitace

### 1. LocalStorage limit (~5MB)
**Problém**: Po překročení 5MB se zobrazí QuotaExceededError
**Řešení**: Komprimovat audio, používat menší soubory, warning při 80%+

### 2. QR Scanner není implementován
**Problém**: Placeholder v ClientEntry, klientky musí zadávat kód ručně
**Řešení**: Implementovat v Sprint 5 (optional)

### 3. Dashboard vypadá prázdně bez dat
**Problém**: Layout není optimální pro 0 klientek
**Řešení**: Počkat na reálná data, pak doladit

### 4. ClientsList je placeholder
**Problém**: Stránka neobsahuje žádný obsah
**Řešení**: Implementovat v Sprint 5

### 5. Žádná synchronizace mezi zařízeními
**Problém**: Data jen v localStorage jednoho browseru
**Řešení**: Backend (optional, dlouhodobě)

---

## 📝 Další kroky (Sprint 5)

### Priorita 1 - Must have:
- [ ] ClientsList stránka (seznam klientek s filtry)
- [ ] Mobile responsivita (všechny stránky)
- [ ] Loading states (spinner při async operacích)
- [ ] Error boundaries (catch React errors)
- [ ] Warning při blízkém localStorage limitu (80%+)

### Priorita 2 - Should have:
- [ ] Dashboard layout s více daty (optimalizace gridu)
- [ ] Undo pro delete operace
- [ ] Bulk delete materiálů
- [ ] Export programu jako PDF
- [ ] Toast notifications místo alerts

### Priorita 3 - Nice to have:
- [ ] Dark mode toggle v UI (už existuje v kódu)
- [ ] Statistiky pro kouče (celkový čas, top materiály)
- [ ] Reminders pro klientky
- [ ] QR scanner implementace
- [ ] Multi-language support (i18n)
- [ ] Backend + synchronizace

---

## 💡 Tipy pro další práci

### Když přidáváš novou komponentu:

1. **Vždy importuj BORDER_RADIUS:**
```javascript
import BORDER_RADIUS from '../../styles/borderRadius';
```

2. **Používej theme colors:**
```javascript
color: 'primary.main'
backgroundColor: theme.palette.mode === 'dark' ? '...' : '...'
```

3. **Responzivní spacing:**
```javascript
sx={{ px: { xs: 2, sm: 3 }, py: { xs: 1, sm: 2 } }}
```

4. **Glassmorphism pro modaly:**
```javascript
PaperProps={{
  sx: {
    backdropFilter: 'blur(20px)',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: BORDER_RADIUS.dialog
  }
}}
```

### Když opravuješ bug:

1. **Kontroluj konzoli** - jsou tam chyby?
2. **Kontroluj localStorage** - jsou tam správná data?
3. **Zkus hard refresh** - pomohlo to?
4. **Zkus clear cache** - pomohlo to?
5. **Zkus localStorage.clear()** - pomohlo to?

### Když testuješ:

1. **Light i dark mode** - funguje v obou?
2. **Mobile i desktop** - responzivní?
3. **Prázdný stav** - co když nejsou data?
4. **Error states** - co když něco selže?
5. **Edge cases** - max délka textu, velké soubory, atd.

---

## 🤝 Komunikace s uživatelkou

### Preferovaný styl:
- **Stručné odpovědi** - jasné a konkrétní
- **Code first** - raději ukázat kód než dlouze vysvětlovat
- **Proaktivní** - navrhovat zlepšení
- **Respektovat feedback** - když něco nechce, nediskutovat

### Když něco nefunguje:
1. Uznej problém
2. Nabídni konkrétní řešení
3. Implementuj rychle
4. Ověř, že funguje

### Když něco navrhuješ:
1. Vysvětli proč
2. Ukaž příklad
3. Počkej na souhlas
4. Implementuj

---

## 📚 Užitečné odkazy

### Dokumentace:
- [React 18](https://react.dev/)
- [Material-UI v6](https://mui.com/)
- [Vite](https://vitejs.dev/)
- [framer-motion](https://www.framer.com/motion/)

### Interní soubory:
- `summary.md` - Kompletní dokumentace projektu
- `claude.md` - Tento soubor
- `/src/styles/borderRadius.js` - Border-radius systém
- `/src/shared/themes/natureTheme.js` - Theme

---

## 🎯 Testovací data

### Testovací kouč:
```
Jméno: Demo Koučka
Email: demo@coachpro.cz
```

### Testovací program:
```
Kód: 555
Název: Týdenní transformace
Délka: 7 dní
```

### Testovací materiály:
- 9 materiálů různých typů
- Audio (meditace)
- PDF (ebook)
- Text (afirmace)
- atd.

---

## ⚠️ Před commitem:

- [ ] Kontrola: používám BORDER_RADIUS?
- [ ] Kontrola: žádné hardcodované barvy?
- [ ] Kontrola: funguje v light i dark mode?
- [ ] Kontrola: responzivní na mobile?
- [ ] Kontrola: žádné console.errors?
- [ ] Kontrola: localStorage nepřetéká?

---

## 🚀 Deployment (budoucnost)

### Build:
```bash
npm run build
# Output: dist/
```

### Deploy na:
- Vercel (doporučeno)
- Netlify
- GitHub Pages
- Nebo vlastní hosting

### ENV variables (až bude backend):
```
VITE_API_URL=...
VITE_STORAGE_BUCKET=...
```

---

## 🗄️ SUPABASE STORAGE (Sprint 6)

### Proč Supabase?

LocalStorage má limit ~5-8 MB **celkově** (ne per user!). S více kouči a klientkami je to nedostatečné. Supabase Storage poskytuje **1 GB** na free tier (200x více!).

### Struktura v Supabase

```
materials-coach/              # Bucket name
├── demo-coach-1/
│   ├── pdf/
│   │   ├── mikova-vlasta-hosting-7eec5405.pdf
│   │   ├── meditace-uvod-b3f8a621.pdf
│   │   └── 1-sj-vp-z1aurp-text-a92f3c12.pdf
│   ├── audio/
│   │   └── ranní-meditace-c4d5e6f7.mp3
│   └── document/
│       └── cvičení-reflexe-8a9b0c1d.docx
└── coach-2/
    └── ...
```

### Sanitizace názvů souborů

Soubory v Supabase mají **čitelné názvy** s transliterací českých znaků:

```
Míková Vlasta_hosting.pdf → mikova-vlasta-hosting-7eec5405.pdf
1_SJ_VP_Z1aURP_text.pdf   → 1-sj-vp-z1aurp-text-a92f3c12.pdf
Ranní meditace.mp3        → ranni-meditace-c4d5e6f7.mp3
```

**Algoritmus:**
1. Odstraň příponu
2. Transliteruj česká písmena (á→a, č→c, ř→r)
3. Lowercase
4. Mezery a `_` → `-`
5. Odstranit speciální znaky
6. Max 50 znaků
7. Přidat 8-znakový hash z UUID
8. Přidat příponu zpět

### Klíčové funkce (supabaseStorage.js)

```javascript
// Upload s čitelným názvem
uploadFileToSupabase(file, coachId, type)
// → { path, url }

// Mazání
deleteFileFromSupabase(filePath)

// Kontrola konfigurace
isSupabaseConfigured()
// → boolean
```

### RLS (Row Level Security) politiky

Vytvořeny SQL politiky v Supabase dashboardu:

```sql
-- Povolení uploadu
CREATE POLICY "Allow public uploads"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'materials-coach');

-- Povolení čtení
CREATE POLICY "Allow public reads"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'materials-coach');

-- Povolení mazání
CREATE POLICY "Allow public deletes"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'materials-coach');
```

### Upload flow s fallbackem

```javascript
// AddMaterialModal.jsx
if (isSupabaseConfigured()) {
  try {
    const { url, path } = await uploadFileToSupabase(file, currentUser.id, type);
    content = url;         // Supabase public URL
    storagePath = path;    // Pro pozdější smazání
  } catch (uploadError) {
    console.error('Supabase upload failed, falling back to base64');
    content = await fileToBase64(file);  // Fallback na localStorage
  }
} else {
  content = await fileToBase64(file);    // Fallback pokud není nakonfigurováno
}
```

### Delete flow

```javascript
// storage.js - async deleteMaterial
export const deleteMaterial = async (id) => {
  const material = materials.find(m => m.id === id);

  // Smazat z Supabase pokud tam je
  if (material?.storagePath) {
    try {
      await deleteFileFromSupabase(material.storagePath);
    } catch (error) {
      console.error('Failed to delete from Supabase:', error);
      // Pokračovat se smazáním z localStorage i při chybě
    }
  }

  // Smazat z localStorage
  const filtered = materials.filter(m => m.id !== id);
  return saveToStorage(STORAGE_KEYS.MATERIALS, filtered);
};
```

### Úspora místa

```javascript
// LocalStorage (base64) - 1 MB PDF:
{
  content: 'data:application/pdf;base64,JVBERi0xLjQKJeLjz...' // ~1.37 MB
}

// Supabase Storage (URL) - stejný soubor:
{
  content: 'https://qrnsrhrgjzijqphgehra.supabase.co/storage/...',  // ~150 bytes
  storagePath: 'demo-coach-1/pdf/mikova-vlasta-hosting-7eec5405.pdf' // ~60 bytes
}

// Úspora: >99% místa v localStorage! 🎉
```

### Kapacity

- **LocalStorage**: ~5-8 MB celkově
- **Supabase Free tier**: 1 GB storage + 2 GB bandwidth/měsíc
- **Ratio**: 200x více prostoru!

### ENV variables

```.env
VITE_SUPABASE_URL=https://qrnsrhrgjzijqphgehra.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

⚠️ **NIKDY NECOMMITOVAT `.env`!** Jen `.env.example`.

---

## 🚀 TODO

### ⚠️ Prioritní úkoly - 1. fáze (AKTUÁLNÍ)

**Priority 1 - Základní funkcionality:**
- [ ] **ClientsList stránka** - seznam klientek kouče s přehledem programů
- [ ] **Mobile responsivita ostatních stránek** - Dashboard, ProgramsList, DailyView (320px+)
- [ ] **Loading states** - pro async operace (Supabase upload, fetch, delete)
- [ ] **Error boundaries** - React error boundaries pro robustnější error handling
- [ ] **Warning při blízkém localStorage limitu** - upozornit uživatele při 80%+ využití

---

### Další embed služby k implementaci (2. fáze)

**Priorita 1 - Video & Screening (pro kouče):**
- [ ] **Loom** - video nahrávky/screenshare (velmi populární u koučů)
  - Embed pattern: `loom.com/share/XXX`
  - API: Loom Embed SDK

**Priorita 2 - Interaktivní nástroje:**
- [ ] **Typeform** - formuláře/kvízy (skvělé pro reflexe)
  - Embed pattern: `form.typeform.com/to/XXX`
  - Iframe embed
- [ ] **Google Forms** - formuláře (jednodušší alternativa)
  - Embed pattern: `docs.google.com/forms/d/XXX`
  - Iframe embed
- [ ] **Miro** - whiteboardy/brainstorming
  - Embed pattern: `miro.com/app/board/XXX`
  - Iframe embed

**Priorita 3 - Design & Prezentace:**
- [ ] **Canva** - prezentace (již máme detekci, přidat embed)
  - Embed pattern: `canva.com/design/XXX`
  - Potřeba Canva API key
- [ ] **Figma** - design mockupy
  - Embed pattern: `figma.com/file/XXX`
  - Iframe embed

**Priorita 4 - Produktivita:**
- [ ] **Notion** - dokumenty (již máme detekci, přidat embed)
  - Embed pattern: `notion.so/XXX`
  - Iframe embed (funguje jen pro public pages)
- [ ] **Trello** - project boards
  - Embed pattern: `trello.com/b/XXX`
  - Iframe embed
- [ ] **Calendly** - booking/plánování
  - Embed pattern: `calendly.com/XXX`
  - Iframe embed

**Priorita 5 - Online kurzy:**
- [ ] **Kajabi** - online kurzy
  - Embed: varies by course
- [ ] **Teachable** - online kurzy
  - Embed: varies by course

### Důležité připomínky pro 2. fázi

**⚠️ Modularita:**
- CoachPro bude součástí ProApp ekosystému
- Sdílené komponenty přesunout do `/src/shared/components`
- Auth systém bude společný pro všechny aplikace
- Storage utils sdílet přes @shared/utils
- Border-radius systém již je v @styles (správně!)

**⚠️ Path aliases:**
```javascript
// ✅ SPRÁVNĚ - používáme aliasy
import BORDER_RADIUS from '@styles/borderRadius';
import { formatDuration } from '@shared/utils/helpers';
import ServiceLogo from '@modules/coach/components/shared/ServiceLogo';

// ❌ ŠPATNĚ - relativní cesty
import BORDER_RADIUS from '../../../../styles/borderRadius';
```

**⚠️ Společné funkce napříč ProApp:**
Tyto funkce budou sdíleny:
- Auth (Google OAuth, session management)
- Storage (Supabase client, upload/delete utils)
- Themes (nature theme, border-radius systém)
- Komponenty (Layout, Header, Sidebar, ServiceLogo)
- Utils (formatters, validators, helpers)

**⚠️ Code cleanup pravidla:**
- MAZAT starý kód, ne komentovat
- Žádné `// TODO` komentáře ve finálním kódu
- Žádné `console.log()` ve finálním kódu (jen console.error pro errors)
- Odstraňovat nepoužívané importy

**⚠️ Vždy mluvit česky:**
- Všechna komunikace s uživatelkou v češtině
- Komentáře v kódu česky
- Názvy proměnných anglicky (best practice)
- Error hlášky pro uživatele česky

---

## 📋 Sprint 6.5 changelog (27. října 2025)

### YouTube Metadata integrace
- ✅ YouTube Data API v3 integrace
- ✅ parseISO8601Duration() funkce
- ✅ getYouTubeMetadata() s fallbackem na oEmbed
- ✅ `.env.example` aktualizováno (VITE_YOUTUBE_API_KEY)
- ✅ AddMaterialModal: automatický fetch duration při přidání YouTube linku

### Google Drive Embeds
- ✅ Google Drive embedSupport: false → true
- ✅ getEmbedUrl() rozšířeno o Google Docs/Sheets/Slides/Files
- ✅ PreviewModal: Google Drive iframe rendering
- ✅ Podpora 4 typů Google dokumentů

### Bug Fixes
- ✅ formatFileSize(0) vrací prázdný string místo "0 B"
- ✅ AddMaterialModal: fileSize inicializace null místo 0
- ✅ Opravena nula za časem ("0:41 • 0" → "0:41")

### Celkem služeb s embed podporou: 6
1. YouTube (včetně Shorts + metadata)
2. Vimeo
3. Spotify
4. SoundCloud
5. Instagram
6. Google Drive (Docs, Sheets, Slides, Files) ← NOVÉ

---

## 🎯 Sprint 6.7: Responsivita MaterialCard - VYŘEŠENO (27. října 2025)

### ČAS STRÁVENÝ: ~2 hodiny debuggingu

### PROBLÉM:
Karty materiálů (MaterialCard) se ořezávaly na pravé straně na obrazovkách 320-420px. Pravý sloupec s ikonami přetékal mimo viewport.

### ✅ VYŘEŠENO - Hlavní oprava:

**ROOT CAUSE:**
Problém nebyl v MaterialCard.jsx, ale v layoutu stránky - **chybějící padding v MaterialsLibrary.jsx** způsoboval overflow.

**ŘEŠENÍ:**

1. **MaterialsLibrary.jsx** - Přidán padding na hlavní Box:
```jsx
// Hlavní wrapper Box (úplně první return)
<Box sx={{ px: { xs: 1.5, sm: 2, md: 3 } }}>
  // ... celý obsah komponenty
</Box>
```

2. **MaterialsLibrary.jsx** - Zvětšen Grid spacing:
```jsx
// Grid container s kartami
<Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
  // Změněno z spacing={{ xs: 1, sm: 2, md: 3 }}
```

### 🔧 DALŠÍ ÚPRAVY v MaterialCard.jsx:

**Breakpoint:**
```jsx
const isVeryNarrow = useMediaQuery('(max-width:420px)');
// Platí pro obrazovky 320-420px
```

**Levý sloupec (obsah):**
```jsx
<Box
  display="flex"
  flexDirection="column"
  gap={0.5}
  sx={{
    flex: '1 1 0px', // ✅ Force flex-basis na 0
    minWidth: 0,      // ✅ Umožní zmenšení pod natural width
    width: 0,         // ✅ Force nulovou šířku (flexbox natáhne)
    overflow: 'hidden',
  }}
>
```

**Pravý sloupec (ikony):**
```jsx
<Box
  display="flex"
  flexDirection="column"
  alignItems="center"
  gap={isVeryNarrow ? 0.5 : 1}
  sx={{
    minWidth: isVeryNarrow ? 36 : { xs: 40, sm: 56 },
    maxWidth: isVeryNarrow ? 36 : { xs: 40, sm: 56 },
    width: isVeryNarrow ? 36 : { xs: 40, sm: 56 },
    flexShrink: 0
  }}
>
```

**Velikosti pod 420px (isVeryNarrow):**

| Element | Velikost |
|---------|----------|
| Velká ikona (renderIcon) | 28px |
| Action ikony (Eye, Pencil, ExternalLink, Trash2) | 14px |
| URL/fileName ikona (Link2, Paperclip) | 11px |
| Metadata ikony (Clock, HardDrive, FileText) | 12px |
| Chip height | 18px |
| Chip font | 0.65rem |
| URL/fileName font | 0.7rem |
| Název materiálu | 1rem |
| Popis | 0.8rem |
| Metadata font | 0.7rem |
| IconButton padding | 0.25 |
| Gap mezi sloupci | 0.75 (MUI spacing) |

**Card padding:**
```jsx
<CardContent sx={{
  px: isVeryNarrow ? 1 : { xs: 1, sm: 2 },
  py: isVeryNarrow ? 1.5 : { xs: 1.5, sm: 2 }
}}>
```

### 🎨 CSS TRIKY použité:

**Text wrapping (všude kde je text):**
```jsx
overflowWrap: 'anywhere',  // Zalomí KDEKOLI včetně uprostřed slova
wordBreak: 'break-word',   // Respektuje slova, kde je to možné
hyphens: 'auto',           // Automatické dělení slov
minWidth: 0,               // CRITICAL pro flex children!
```

**Chip ellipsis:**
```jsx
'& .MuiChip-label': {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}
```

### 📐 MATEMATIKA LAYOUTU (pod 420px):

```
Container width: 320px
├─ Container padding: 12px (1.5 × 8px MUI spacing)
│
└─ Dostupná šířka: 296px
   ├─ Grid item width: 296px
   ├─ Grid item padding: 12px (spacing 1.5)
   │
   └─ Card width: 272px
      ├─ Card padding: 8px (px: 1)
      │
      └─ CardContent width: 256px
         ├─ Levý sloupec: ~214px (flex: 1)
         ├─ Gap: 6px (0.75 spacing)
         └─ Pravý sloupec: 36px (fixed)
```

### 🐛 CO JSME SE NAUČILI:

1. **Problém nemusí být v komponentě, ale v layoutu stránky**
   - Grid negativní margin potřebuje být kompenzován container paddingem

2. **Flexbox children musí mít `minWidth: 0`**
   - Jinak se nezmenší pod natural content width

3. **`flex: '1 1 0px'` je silnější než `flex: '1 1 auto'`**
   - Nulová flex-basis force distribuci prostoru

4. **Barevné border při debuggingu = 💎**
   - `border: '2px solid red'` okamžitě ukáže, kde je problém

5. **Grid spacing je tricky**
   - `spacing={3}` = -12px margin na Grid + 12px padding na Grid items
   - Container MUSÍ mít padding, jinak overflow!

### ⚠️ POZOR NA:

**Neoptimalizovaný kód (můžeš vyčistit):**
Když je hodnota stejná pro isVeryNarrow i normální:
```jsx
// Neoptimální:
fontSize: isVeryNarrow ? '0.7rem' : '0.7rem'

// Lepší:
fontSize: '0.7rem'
```
Najdeš to u:
- URL Typography (link)
- Metadata Typography (3×)

### 📱 TESTOVÁNO NA:

- ✅ 320px (iPhone SE)
- ✅ 375px (iPhone 12/13/14)
- ✅ 390px (iPhone 12 Pro)
- ✅ 414px (iPhone 11 Pro Max)
- ✅ 420px (breakpoint edge)
- ✅ 600px+ (normální mobil/tablet)

### 🔄 NÁSLEDUJÍCÍ KROKY:

Pokud budeš v budoucnu přidávat další stránky s kartami:

1. **VŽDY přidej padding na hlavní container:**
   ```jsx
   <Box sx={{ px: { xs: 1.5, sm: 2, md: 3 } }}>
   ```

2. **Grid spacing pro responzivitu:**
   ```jsx
   <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
   ```

3. **Pro velmi malé obrazovky zvažuj:**
   - Menší fonty/ikony POD 375px (iPhone SE)
   - Single column layout POD 360px
   - Collapse akčních ikon do menu POD 320px

### 🎯 SOUBORY UPRAVENÉ:

1. **MaterialsLibrary.jsx**
   - Přidán padding na hlavní Box
   - Zvětšen Grid spacing na mobilu

2. **MaterialCard.jsx**
   - Levý sloupec: flex-basis 0, minWidth 0
   - Pravý sloupec: fixed width 36px pod 420px
   - Responsive velikosti fontů a ikon
   - Text wrapping na všech elementech

**STATUS: ✅ VYŘEŠENO A OTESTOVÁNO**

---

## 📋 Sprint 6.9 changelog (28. října 2025)

### Glassmorphism Redesign - Completion Screen & ProgressGarden

**ČAS STRÁVENÝ**: ~3 hodiny iterativního designu

### 🎨 DESIGN VIZE:
Uživatelka požadovala moderní, nadčasový design inspirovaný PaymentsPro - "kouřový, skleněný, blur efekt" s minimalistickým stylem.

### ✅ COMPLETION SCREEN (DailyView.jsx)

**Hlavní karta:**
```jsx
<Card
  elevation={0}
  sx={{
    borderRadius: '40px',
    backdropFilter: 'blur(40px) saturate(180%)',
    background: 'rgba(26, 26, 26, 0.5)',  // dark mode
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
    '&::before': {
      // Radial gradient "smoky" overlay
      content: '""',
      position: 'absolute',
      background: 'radial-gradient(...)',
      opacity: 0.6,
    }
  }}
>
```

**Aktuální série box:**
- `borderRadius: '33px'` (ve chvíli kdy je výška boxu menší, potřebuje menší radius)
- Stejný glassmorphism efekt jako hlavní karta
- Zvýrazněná primary barva

**Tlačítka s moderními efekty:**

```jsx
// Primary button "Zpět na výběr programu"
<Button sx={{
  px: 5,
  py: 1.75,
  borderRadius: '16px',
  backdropFilter: 'blur(30px)',
  background: 'linear-gradient(135deg, rgba(139, 188, 143, 0.95) 0%, rgba(85, 107, 47, 0.9) 100%)',
  border: '1px solid rgba(139, 188, 143, 0.5)',
  boxShadow: '0 8px 32px rgba(139, 188, 143, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)',

  // Shine animation
  '&::before': {
    content: '""',
    position: 'absolute',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
    left: '-100%',
    transition: 'left 0.6s ease-in-out',
  },

  '&:hover': {
    transform: 'translateY(-4px) scale(1.02)',
    boxShadow: '0 12px 48px rgba(139, 188, 143, 0.7)',
    '&::before': {
      left: '100%',
    },
  },
}}>
```

**Secondary button "Prohlédnout si program znovu":**
- Semi-transparent background
- 2px border s glassmorphism
- Radial gradient glow on hover
- Stejná transform animace

### ✅ PROGRESSGARDEN (ProgressGarden.jsx)

**Hlavní karta:**
- `borderRadius: '40px'`
- Stejný glassmorphism efekt jako completion screen
- Radial gradient overlay pro "smoky" look

**Aktuální série box:**
- `borderRadius: '32px'`
- Glassmorphism s primary barvou

**Day bloky (1, 2, 3, 4, 5, 6, 7):**
```jsx
<Box sx={{
  borderRadius: '32px',
  aspectRatio: '1',
  backdropFilter: 'blur(10px)',
  background: isCompleted
    ? 'rgba(139, 188, 143, 0.15)'  // Zelený hint
    : 'rgba(255, 255, 255, 0.03)',  // Neutrální
  border: '1px solid',
  borderColor: isCompleted
    ? 'rgba(139, 188, 143, 0.3)'
    : 'rgba(255, 255, 255, 0.08)',

  '&:hover': {
    background: isCompleted
      ? 'rgba(139, 188, 143, 0.2)'
      : 'rgba(255, 255, 255, 0.05)',
  }
}}>
```

### ✅ DAY HEADER (DailyView.jsx)

```jsx
<Card sx={{
  borderRadius: '36px',  // Nižší než hlavní panely
  textAlign: 'center'
}}>
```

### 🎨 FINÁLNÍ BORDER-RADIUS SYSTÉM:

| Element | Border-Radius | Důvod |
|---------|---------------|-------|
| Hlavní panely (completion, ProgressGarden) | 40px | Velké plochy = větší zaoblení |
| Aktuální série box (completion) | 33px | Menší výška = menší radius |
| Aktuální série box (ProgressGarden) | 32px | Proporcionální k výšce |
| Day bloky (1-7) | 32px | Square shape = menší radius |
| Day header | 36px | Kompaktní výška |
| Buttons | 16px | Standardní button radius |

### 🔑 KLÍČOVÉ CSS TECHNIKY:

**1. Glassmorphism formula:**
```css
backdrop-filter: blur(40px) saturate(180%);
background: rgba(26, 26, 26, 0.5);
border: 1px solid rgba(255, 255, 255, 0.1);
```

**2. "Smoky" effect:**
```css
&::before {
  content: "";
  position: absolute;
  background: radial-gradient(circle at 30% 20%, rgba(139, 188, 143, 0.2) 0%, transparent 50%),
              radial-gradient(circle at 70% 80%, rgba(188, 143, 143, 0.15) 0%, transparent 50%);
  opacity: 0.6;
  pointer-events: none;
}
```

**3. Shine animation:**
```css
&::before {
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  left: '-100%';
  transition: left 0.6s ease-in-out;
}
&:hover::before {
  left: '100%';
}
```

**4. Inset highlights:**
```css
box-shadow:
  0 8px 32px rgba(139, 188, 143, 0.5),           /* Outer glow */
  inset 0 1px 0 rgba(255, 255, 255, 0.2);        /* Inner highlight */
```

### 🚨 CO UŽIVATELKA NECHCE:

❌ **Devvadesátkové prvky:**
- Emoji v designu (🌸🌱🌰⭐)
- Oranžové/zlaté chipy
- Výrazné gradienty na textu
- Flashy animace

✅ **Co CHCE:**
- Kouřový, skleněný efekt
- Moderní minimalistický styl
- Nadčasový design
- Motivující ale decentní

### 📊 ITERACE DESIGNU:

1. **První pokus** → Příliš flashy (emoji, gradienty, oranžová)
2. **Druhý pokus** → Příliš nudný (bez efektů)
3. **Třetí pokus** → Glassmorphism + barvy, ale efekty neviditelné
4. **Čtvrtý pokus** → Výrazné efekty (0 12px 48px shadows)
5. **Finální** ✅ → Balance mezi decentním a viditelným

### 🔄 BORDER-RADIUS ITERACE:

```
Hlavní panely:   12px → 15px → 17px → 19px → 25px → 40px
Aktuální série:  24px → 21px → 28px → 29px → 32-33px
Day bloky:       16px → 20px → 21px → 22px → 32px
Day header:      12px (default) → 40px → 36px
```

### 📁 SOUBORY UPRAVENÉ:

1. **DailyView.jsx** (řádky 662-908)
   - Completion screen Card (borderRadius: 40px)
   - Aktuální série Box (borderRadius: 33px)
   - Day header Card (borderRadius: 36px)
   - Primary button (gradientní, shine animation)
   - Secondary button (glassmorphism, radial glow)

2. **ProgressGarden.jsx**
   - Main Card (borderRadius: 40px)
   - Aktuální série Box (borderRadius: 32px)
   - Day bloky (borderRadius: 32px)
   - Glassmorphism všude

### 🎓 NAUČENÉ LEKCE:

1. **Glassmorphism potřebuje silné efekty** - 20px blur je málo, 40px je lepší
2. **Saturate(180%) posiluje barvy** pod blur filtrem
3. **Radial gradienty vytvářejí "smoky" efekt** když jsou subtle (opacity 0.6)
4. **Button efekty musí být viditelné** - velké shadows (8-12px), transform, shine
5. **Border-radius musí být proporcionální** - vysoké prvky = větší radius
6. **Iterace je klíč** - design se vyladí po několika pokusech

### 🧪 TESTOVÁNO:

- ✅ Light mode (glassmorphism funguje s bílým pozadím)
- ✅ Dark mode (glassmorphism s tmavým pozadím)
- ✅ Hover efekty (transform, shadows, shine)
- ✅ Completion screen (všechny varianty)
- ✅ ProgressGarden (7denní program)
- ✅ Day header (běžný den)

**STATUS: ✅ DOKONČENO A SCHVÁLENO UŽIVATELKOU**

---

**Poslední update**: 29. října 2025, 14:50
**Autor**: Lenka Roubalová + Claude (Opus + Sonnet 4.5)
**Status**: ✅ Sprint 9 dokončen (Glassmorphism & UI Polish - modaly + glow efekty), funkční a testováno

---

## 📋 Sprint 7: Toast Notifikační Systém (28. října 2025)

### 🎯 CÍL:
Implementovat toast notifikace všude tam, kde jsou validace a chyby, ale **zachovat inline Alerty** pro dual feedback systém.

### ✅ IMPLEMENTOVÁNO:

**6 souborů upraveno:**
1. **ProgramEditor.jsx** - 4 toast notifikace (validace + success)
2. **AddMaterialModal.jsx** - 8 toast notifikací (7 validací + success)
3. **ClientEntry.jsx** - 4 toast notifikace (validace kódu)
4. **ShareProgramModal.jsx** - 5 toast notifikací (success akce + errors), **odstraněn Snackbar**
5. **CustomAudioPlayer.jsx** - 1 toast (error při načítání audio)
6. **PDFViewer.jsx** - 1 toast (error při načítání PDF)

**DailyView.jsx** - zkontrolováno, žádné změny potřeba (pouze informační Alerty)

### 🎨 DUAL FEEDBACK PATTERN:

```javascript
// 1. Import
import { useNotification } from '@shared/context/NotificationContext';

// 2. Hook
const { showSuccess, showError } = useNotification();

// 3. Validace s dual feedback
const errorMsg = 'Chybová zpráva';
setError(errorMsg);              // Inline Alert (vizuální indikátor v kontextu)
showError('Název', errorMsg);    // Toast notifikace (globální + zvuk)
throw new Error(errorMsg);

// 4. Success toast
showSuccess('Hotovo!', 'Akce byla úspěšná');
```

### 🔔 TOAST NOTIFIKACE FEATURES:

- **Position**: Top right (80px od top, 16px od right)
- **Glassmorphism design**: Blur efekty, transparentní pozadí
- **Audio feedback**: notification.mp3 sound
- **Auto-dismiss**: 5 sekund
- **Barvy**:
  - Error: `#ff5555` (červená)
  - Success: `#8FBC8F` (zelená)
  - Info: `#82aaff` (modrá)
  - Warning: `#ffb86c` (oranžová)

### 📊 UX VÝHODY DUAL FEEDBACK:

**Inline Alerty/Boxy:**
- 📍 Kontextová zpětná vazba (uživatel vidí chybu u formuláře)
- 👀 Vizuální indikátor (chyba zůstává dokud není opravena)
- 🎨 Červené/Modré rozlišení typu zprávy

**Toast Notifikace:**
- 🔔 Globální zpětná vazba (nemůže přehlédnout)
- 🔊 Audio feedback (pro uživatele, co se nedívají)
- ✨ Glassmorphism design (moderní vzhled)
- ⏱️ Auto-dismiss (neblokuje UI)

### 🚨 DŮLEŽITÉ - STARÝ KÓD ODSTRANĚN:

**ShareProgramModal.jsx:**
- ❌ Snackbar import odstraněn z MUI
- ❌ useState pro snackbar state odstraněn
- ❌ Snackbar JSX komponenta odstraněna
- ✅ Nahrazeno toast systémem

---

## ✅ Sprint 8: CRITICAL BUGS - Opravy (28. října 2025)

**Datum:** 28. října 2025, 14:00 - 20:30
**Status:** ✅ Všechny 3 critical bugy opraveny a otestovány
**Priorita:** CRITICAL - muselo být hotovo před dalším vývojem

### 🎯 Opravené Bugy

#### Bug #1: Detail materiálu - nelze změnit soubor ✅
**Soubor:** `src/modules/coach/components/coach/AddMaterialModal.jsx`

**Problém:**
- V edit modu šlo změnit typ materiálu (např. audio → video)
- To by rozbilo vazbu mezi typem a nahraným souborem

**Řešení:**
- Typ materiálu je nyní **disabled** v edit modu pro file-based typy
- Všechny ostatní typ-karty jsou vizuálně deaktivované (opacity: 0.4, cursor: not-allowed)
- Přidán Info Alert: "Typ materiálu nelze změnit. Můžeš ale nahradit soubor novým."
- Soubor lze stále nahradit (drag & drop nebo kliknutí)

**Klíčové změny (lines 404-444):**
```javascript
{MATERIAL_TYPES.map((type) => {
  const isFileBasedType = (t) => ['audio', 'video', 'pdf', 'image', 'document'].includes(t);
  const isDisabled = isEditMode && isFileBasedType(editMaterial?.type) && type.value !== selectedType;

  return (
    <Card
      onClick={() => !isDisabled && setSelectedType(type.value)}
      sx={{
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.4 : 1,
        '&:hover': isDisabled ? {} : { borderColor: 'primary.main' },
      }}
    />
  );
})}
```

#### Bug #2: Program - nelze změnit délku ✅
**Soubor:** `src/modules/coach/components/coach/ProgramEditor.jsx`

**Problém:**
- Délka programu byla **disabled** v edit modu (`disabled={isEditing}`)
- Nešlo změnit 7 dní → 14 dní nebo vice versa

**Řešení:**
- Odstraněno `disabled={isEditing}` z duration selectoru (line 346)
- Délku programu lze měnit i po vytvoření
- Při zvýšení délky: přidají se nové prázdné dny na konec
- Při snížení délky: odeberou se dny z konce
- **Zachování dat:** Existující dny si zachovají veškerá data

**Dynamické dny - useEffect (lines 126-142):**
```javascript
useEffect(() => {
  if (duration > 0 && open) {
    setDays((prevDays) => {
      const newDays = Array.from({ length: duration }, (_, index) => ({
        dayNumber: index + 1,
        title: prevDays[index]?.title || '',
        description: prevDays[index]?.description || '',
        materialIds: prevDays[index]?.materialIds || [],
        instruction: prevDays[index]?.instruction || '',
      }));
      return newDays;
    });
  }
}, [duration, open]);
```

**Přidán Info Alert (lines 355-359):**
```javascript
{isEditing && (
  <Alert severity="info" sx={{ mt: 2 }}>
    Můžeš změnit délku programu. Existující dny zůstanou zachovány, nové dny budou přidány na konec.
  </Alert>
)}
```

#### Bug #3: Program - auto-save ✅
**Soubor:** `src/modules/coach/components/coach/ProgramEditor.jsx`

**Problém:**
- Program se neuložil každý den samostatně
- Při zavření editoru bez uložení se ztratila veškerá práce

**Řešení:**
- Implementován auto-save systém:
  - **Debounced save:** 5 sekund po poslední změně
  - **Draft uložen v localStorage:** `draft_program_${programId}` nebo `draft_program_new`
  - **Toast notifikace:** "Změny uloženy ✓" po každém auto-save
  - **Draft se vymaže** po úspěšném uložení programu
  - **Draft expiruje** po 24 hodinách (stale data protection)

**Auto-save state (lines 55-94):**
```javascript
const autoSaveTimeoutRef = useRef(null);
const draftKey = `draft_program_${program?.id || 'new'}`;

const saveDraft = useCallback(() => {
  const draftData = {
    title, description, duration, days,
    programId: program?.id,
    timestamp: new Date().toISOString(),
  };
  localStorage.setItem(draftKey, JSON.stringify(draftData));
  showSuccess('Auto-save', 'Změny uloženy ✓');
}, [title, description, duration, days, draftKey, program?.id, showSuccess]);

const loadDraft = useCallback(() => {
  const draft = localStorage.getItem(draftKey);
  if (draft) {
    try {
      const draftData = JSON.parse(draft);
      // Only load if draft is recent (less than 24 hours old)
      const draftAge = new Date() - new Date(draftData.timestamp);
      if (draftAge < 24 * 60 * 60 * 1000) {
        return draftData;
      }
    } catch (e) {
      console.error('Failed to parse draft:', e);
    }
  }
  return null;
}, [draftKey]);

const clearDraft = useCallback(() => {
  localStorage.removeItem(draftKey);
}, [draftKey]);
```

**Auto-save trigger - useEffect (lines 144-164):**
```javascript
useEffect(() => {
  if (!open || !title) return; // Don't auto-save if modal is closed or no title yet

  // Clear previous timeout
  if (autoSaveTimeoutRef.current) {
    clearTimeout(autoSaveTimeoutRef.current);
  }

  // Set new timeout for 5 seconds
  autoSaveTimeoutRef.current = setTimeout(() => {
    saveDraft();
  }, 5000);

  // Cleanup
  return () => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
  };
}, [title, description, duration, days, open, saveDraft]);
```

**Draft cleanup při save (line 252):**
```javascript
saveProgram(programData);
clearDraft(); // ← Clear draft after successful save
```

### 📊 Výsledky

✅ **Bug #1:** Typ materiálu je nyní locked v edit modu
✅ **Bug #2:** Délku programu lze měnit v edit modu
✅ **Bug #3:** Auto-save funguje, data se neztratí

**Testováno:**
- ✅ Edit materiálu - typ disabled, soubor lze nahradit
- ✅ Edit programu - změna 7 → 14 dní, data zachována
- ✅ Auto-save - draft každých 5s, toast notifikace funguje
- ✅ Draft expiry - starší než 24h se nenačítají

---

### 🔧 NOVÝ WORKFLOW PATTERN:

**Od teď při každé změně:**
1. **Doplň změny do summary.md** - na konec souboru
2. **Inovuj claude.md** - aktualizuj kontext pro AI
3. **Aktualizuj MASTER_TODO_V2.md** - označ hotové, přidej nové

---

## 🚀 Sprint 9: Glassmorphism & UI Polish (28-29 října 2025)

**Trvání**: 2 dny (28 večer - 29 odpoledne)
**AI asistenti**: Claude Code (Opus) + Claude Sonnet 4.5
**Výsledek**: ✅ Funkční glassmorphism na modalech, glow efekty, opravené karty

### 📅 Session 1: Modulární Glassmorphism - První pokus (28.10 večer)
**AI**: Claude Code (Opus)
**Čas**: 28. října 2025, večer

#### 🎯 Cíl:
Vytvořit modulární glassmorphism systém s plain objekty místo theme callbacks

#### ✅ Co se povedlo:

1. **Vytvořeny nové soubory**:
   - `/src/shared/styles/modernEffects.js` - Plain objekty pro glassmorphism
   - `/src/shared/hooks/useModernEffects.js` - React hook pro aplikaci efektů

2. **Glassmorphism varianty**:
   ```javascript
   const glassVariants = {
     subtle: { blur: 10, opacity: 0.7, saturation: 150 },
     medium: { blur: 16, opacity: 0.6, saturation: 180 },
     strong: { blur: 24, opacity: 0.5, saturation: 200 }
   };
   ```

3. **Glow efekt pomocí boxShadow**:
   ```javascript
   const glowEffects = {
     none: 'none',
     subtle: '0 0 20px rgba(139, 188, 143, 0.15)',
     medium: '0 0 30px rgba(139, 188, 143, 0.25)',
     strong: '0 0 40px rgba(139, 188, 143, 0.35)'
   };
   ```

#### ❌ CO SE NEPOVEDLO - KRITICKÉ LEKCE:

**1. MUI sx prop nepodporuje spread operator s backdrop-filter** ⚠️
```javascript
// ❌ NEFUNGUJE
<Card sx={{ ...glassCardStyles }} />

// ✅ FUNGUJE
<Card sx={glassCardStyles} />
```
**DŮVOD**: backdrop-filter je složitá CSS vlastnost a MUI ji nezvládá korektně zpracovat při spreadu.

**2. ServiceLogo size prop MUSÍ BÝT ČÍSLO** ⚠️
```javascript
// ❌ NEFUNGUJE
<ServiceLogo size={{ xs: 28, sm: 32 }} />

// ✅ FUNGUJE
<ServiceLogo size={isVeryNarrow ? 28 : 32} />
```
**DŮVOD**: ServiceLogo je custom komponenta a nepodporuje MUI responsive objekty.

**3. Backdrop-filter nefunguje na běžných kartách na stránce** ⚠️
- Glassmorphism efekt vyžaduje vrstvu "za" elementem
- Na běžné kartě na stránce není co rozmazat
- **ŘEŠENÍ**: Glassmorphism JEN na modaly a dialogy s backdrop

**4. MaterialCard.jsx se CORRUPTOVAL**
- Během experimentů s glassmorphism se soubor poškodil
- Musela být provedena úplná obnova (Sonnet 4.5, 29.10 ráno)

#### 📚 PATH ALIASES vzor:
```javascript
import BORDER_RADIUS from '@styles/borderRadius';
import { useGlassCard } from '@shared/hooks/useModernEffects';
import ServiceLogo from '@modules/coach/components/shared/ServiceLogo';
```

**POZOR**: Vždy používej @ aliasy místo relativních cest!

#### 🎓 Lessons Learned:
1. ✅ Plain objekty jsou lepší než theme callbacks pro glassmorphism
2. ❌ Spread operator nefunguje s backdrop-filter v MUI sx prop
3. ❌ Glassmorphism nefunguje na kartách přímo na stránce
4. ✅ Glow efekty pomocí boxShadow fungují výborně
5. ⚠️ ServiceLogo size MUSÍ BÝT numeric, ne responsive object

---

### 📅 Session 2: Glassmorphism Reality Check (29.10, 0:00-1:00)
**AI**: Claude Sonnet 4.5
**Čas**: 29. října 2025, 0:00-1:00

#### 🔍 Zjištění:
Pokus aplikovat glassmorphism na `MaterialCard.jsx` pomocí `useGlassCard` hook.

#### ❌ ROOT CAUSE:
**Backdrop-filter nefunguje na kartách přímo na stránce!**

**Proč?**
- Glassmorphism = rozmazání pozadí "za" elementem
- Na běžné kartě na stránce není co rozmazat (není backdrop)
- Funguje JEN na modalech/dialozích s `BackdropProps`

#### ✅ Řešení:
**Vytvořen nový soubor**: `/src/shared/styles/modernEffects_FIXED.js`

**1. Backdrop pro modaly**:
```javascript
export const createBackdrop = (blurAmount = 4) => ({
  backdropFilter: `blur(${blurAmount}px)`,
  WebkitBackdropFilter: `blur(${blurAmount}px)`,
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
});
```

**2. Glassmorphism pro Dialog PaperProps**:
```javascript
export const createGlassDialog = (isDark, blur = 20, saturation = 180) => ({
  borderRadius: BORDER_RADIUS.dialog,
  backdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
  WebkitBackdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
  backgroundColor: isDark
    ? 'rgba(26, 26, 26, 0.7)'
    : 'rgba(255, 255, 255, 0.7)',
  boxShadow: isDark
    ? '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
    : '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
});
```

#### 📋 GLASSMORPHISM PATTERN (v MaterialCard):
```javascript
<Dialog
  open={deleteDialogOpen}
  onClose={() => setDeleteDialogOpen(false)}
  BackdropProps={{
    sx: createBackdrop(4)
  }}
  PaperProps={{
    sx: createGlassDialog(isDark, 20, 180)
  }}
>
```

#### ⚠️ DŮLEŽITÉ PATH ALIASES WARNING:

**ServiceLogo size prop**:
```javascript
// ❌ NIKDY NEPOUŽÍVAT responsive objekty
<ServiceLogo size={{ xs: 28, sm: 32 }} />

// ✅ VŽDY numeric hodnota s podmínkou
<ServiceLogo size={isVeryNarrow ? 28 : 32} />
```

#### 🎓 Hlavní poučení:
1. ❌ Glassmorphism NEFUNGUJE na běžných kartách
2. ✅ Glassmorphism JEN na modaly s `BackdropProps` + `PaperProps`
3. ✅ Vytvořeny helper funkce `createBackdrop()` a `createGlassDialog()`
4. ⚠️ ServiceLogo nepodporuje MUI responsive objects

---

### 📅 Session 3: Oprava Corrupted MaterialCard (29.10 ráno)
**AI**: Claude Sonnet 4.5
**Čas**: 29. října 2025, ráno

#### ❌ Problém:
`MaterialCard.jsx` byl corruptován během Session 1 (Opus experiments s glassmorphism)

#### ✅ Řešení:
- Kompletní obnova `MaterialCard.jsx`
- Odstranění glassmorphism experimentů z karet
- Zachování pouze funkčního kódu
- Aplikace glassmorphism JEN na Delete Dialog

#### 📁 Opravený soubor:
`/src/modules/coach/components/coach/MaterialCard.jsx`

**Změny**:
1. ❌ Odstraněn `useGlassCard` hook z karty
2. ✅ Aplikován glassmorphism na Delete Dialog:
   ```javascript
   <Dialog
     BackdropProps={{
       sx: {
         backdropFilter: 'blur(4px)',
         WebkitBackdropFilter: 'blur(4px)',
         backgroundColor: 'rgba(0, 0, 0, 0.6)',
       }
     }}
     PaperProps={{
       sx: {
         backdropFilter: 'blur(20px) saturate(180%)',
         WebkitBackdropFilter: 'blur(20px) saturate(180%)',
         backgroundColor: isDark
           ? 'rgba(26, 26, 26, 0.7)'
           : 'rgba(255, 255, 255, 0.7)',
       }
     }}
   >
   ```

#### ✅ Výsledek:
- MaterialCard plně funkční
- Delete dialog má glassmorphism efekt
- Karta samotná zůstává s běžným glass efektem (bez backdrop-filter)

---

### 📅 Session 4: Sprint 9 Glassmorphism & UI Polish (29.10 odpoledne)
**AI**: Claude Sonnet 4.5
**Čas**: 29. října 2025, odpoledne

#### 🎯 Cíle:
1. Aplikovat glassmorphism na všechny modaly
2. Přidat glow efekty místo borders
3. Vylepšit TextField styling
4. Opravit Grid layout spacing

#### ✅ Co bylo implementováno:

**1. Grid Layout Fix v MaterialsLibrary**:
```javascript
// Problem: Grid spacing vytváří negativní marginy
// Řešení: Přidat padding na parent container

<Box sx={{ px: { xs: 1.5, sm: 2, md: 3 } }}>
  <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
```

**2. Glow efekty místo borders**:
```javascript
// ❌ BEFORE: Border
border: '2px solid',
borderColor: 'primary.main'

// ✅ AFTER: Glow
boxShadow: '0 0 30px rgba(139, 188, 143, 0.25)'
```

**3. TextField Styling Pattern**:
```javascript
<TextField
  InputProps={{
    sx: {
      borderRadius: BORDER_RADIUS.input,
      backgroundColor: isDark
        ? 'rgba(255, 255, 255, 0.05)'
        : 'rgba(0, 0, 0, 0.02)',
      transition: 'all 0.3s ease',
      '&:hover': {
        backgroundColor: isDark
          ? 'rgba(255, 255, 255, 0.08)'
          : 'rgba(0, 0, 0, 0.04)',
      },
      '&.Mui-focused': {
        boxShadow: '0 0 20px rgba(139, 188, 143, 0.15)',
      }
    }
  }}
/>
```

**4. Glassmorphism na všech modalech**:
- ✅ PreviewModal
- ✅ AddMaterialModal
- ✅ Delete Dialogs
- ✅ Všechny dialogy v aplikaci

**Pattern**:
```javascript
<Dialog
  BackdropProps={{
    sx: {
      backdropFilter: 'blur(4px)',
      WebkitBackdropFilter: 'blur(4px)',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
    }
  }}
  PaperProps={{
    sx: {
      borderRadius: BORDER_RADIUS.dialog,
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      backgroundColor: isDark
        ? 'rgba(26, 26, 26, 0.7)'
        : 'rgba(255, 255, 255, 0.7)',
      boxShadow: isDark
        ? '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
        : '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
    }
  }}
>
```

#### 📋 DEBUGGING CHECKLIST:

Když glassmorphism nefunguje:
1. ✅ Zkontroluj, že máš `BackdropProps` + `PaperProps` na `<Dialog>`
2. ✅ Zkontroluj, že používáš `backdropFilter` + `WebkitBackdropFilter`
3. ✅ Zkontroluj, že `backgroundColor` má alpha kanál (rgba)
4. ✅ Zkontroluj, že je modal/dialog OPRAVDU otevřený
5. ❌ NEPOUŽÍVEJ glassmorphism na běžných kartách na stránce!

#### 🎓 Patterns & Best Practices:

**1. Grid Spacing Pattern**:
```javascript
// Parent musí mít padding kvůli negativním marginům Grid
<Box sx={{ px: { xs: 1.5, sm: 2, md: 3 } }}>
  <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
```

**2. Glow vs Border**:
```javascript
// ❌ Border - příliš ostré
border: '2px solid'

// ✅ Glow - modernější, soft
boxShadow: '0 0 30px rgba(139, 188, 143, 0.25)'
```

**3. TextField Focus Effect**:
```javascript
'&.Mui-focused': {
  boxShadow: '0 0 20px rgba(139, 188, 143, 0.15)',
  backgroundColor: isDark
    ? 'rgba(255, 255, 255, 0.08)'
    : 'rgba(0, 0, 0, 0.04)',
}
```

**4. Responsive ServiceLogo**:
```javascript
// ❌ NEFUNGUJE
<ServiceLogo size={{ xs: 28, sm: 32 }} />

// ✅ FUNGUJE
const isVeryNarrow = useMediaQuery('(max-width:420px)');
<ServiceLogo size={isVeryNarrow ? 28 : 32} />
```

#### ✅ Výsledný stav:
- ✅ Glassmorphism na všech modalech a dialozích
- ✅ Glow efekty místo borders
- ✅ Vylepšené TextField styling s focus efekty
- ✅ Opravený Grid layout spacing
- ✅ Jednotný design napříč aplikací

---

## 🎓 Konsolidované Lessons Learned (Sprint 9, Sessions 1-4)

### ❌ CO NEFUNGUJE:

1. **Glassmorphism na běžných kartách**
   - Backdrop-filter potřebuje vrstvu "za" elementem
   - Na kartě na stránce není co rozmazat
   - **Použití**: JEN modaly a dialogy!

2. **Spread operator s backdrop-filter v MUI**
   ```javascript
   // ❌ NEFUNGUJE
   <Card sx={{ ...glassStyles }} />

   // ✅ FUNGUJE
   <Card sx={glassStyles} />
   ```

3. **ServiceLogo s responsive objekty**
   ```javascript
   // ❌ NEFUNGUJE
   <ServiceLogo size={{ xs: 28, sm: 32 }} />

   // ✅ FUNGUJE
   <ServiceLogo size={isVeryNarrow ? 28 : 32} />
   ```

### ✅ CO FUNGUJE:

1. **Glassmorphism pattern pro modaly**:
   ```javascript
   <Dialog
     BackdropProps={{ sx: createBackdrop(4) }}
     PaperProps={{ sx: createGlassDialog(isDark) }}
   >
   ```

2. **Glow efekty místo borders**:
   ```javascript
   boxShadow: '0 0 30px rgba(139, 188, 143, 0.25)'
   ```

3. **Grid layout s padding**:
   ```javascript
   <Box sx={{ px: { xs: 1.5, sm: 2, md: 3 } }}>
     <Grid spacing={{ xs: 1.5, sm: 2, md: 3 }}>
   ```

4. **TextField focus efekty**:
   ```javascript
   '&.Mui-focused': {
     boxShadow: '0 0 20px rgba(139, 188, 143, 0.15)',
   }
   ```

### ⚠️ KRITICKÁ PRAVIDLA:

1. **VŽDY používej PATH ALIASES**:
   - ✅ `@shared/hooks/useModernEffects`
   - ✅ `@styles/borderRadius`
   - ❌ `../../../shared/hooks/useModernEffects`

2. **Glassmorphism JEN na modaly**:
   - ✅ Dialog, Modal s BackdropProps
   - ❌ Card, Box na stránce

3. **ServiceLogo size = numeric**:
   - ✅ `size={32}` nebo `size={isNarrow ? 28 : 32}`
   - ❌ `size={{ xs: 28, sm: 32 }}`

4. **Grid spacing vyžaduje parent padding**:
   - ✅ Parent Box s `px` padding
   - ❌ Grid bez parent paddingu (overflow)

---

## 📁 Soubory vytvořené/upravené v Sprintu 9:

### Nové soubory:
- `/src/shared/styles/modernEffects.js` - Plain objekty pro glassmorphism (Session 1, Opus)
- `/src/shared/hooks/useModernEffects.js` - React hook (Session 1, Opus)
- `/src/shared/styles/modernEffects_FIXED.js` - Opravená verze (Session 2, Sonnet)

### Upravené soubory:
- `/src/modules/coach/components/coach/MaterialCard.jsx` - Opraveno + glassmorphism na dialog (Session 3, Sonnet)
- `/src/modules/coach/components/coach/MaterialsLibrary.jsx` - Grid layout fix (Session 4, Sonnet)
- Všechny modaly v aplikaci - Glassmorphism aplikován (Session 4, Sonnet)

---

> 💡 **Pro budoucí Claude**: Tohle je kompletní kontext. Máš vše co potřebuješ. Pokud něco chybí, zeptej se uživatelky!

