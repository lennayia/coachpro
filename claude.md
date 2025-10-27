# 🤖 Instrukce pro Claude - CoachPro projekt

> **Pro budoucí Claude session**: Přečti si tento dokument pro plný kontext projektu

---

## 📍 Současný stav projektu

**Datum**: 27. října 2025
**Sprint**: 6 - Supabase Storage & UI vylepšení
**Status**: ✅ Funkční, testováno s Supabase Storage
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

### Sprint 6: Supabase Storage & UI vylepšení (AKTUÁLNÍ)
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

## 🚀 TODO pro 2. fázi projektu

### Další embed služby k implementaci

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

**Poslední update**: 27. října 2025
**Autor**: Lenka Roubalová + Claude
**Status**: ✅ Sprint 6.5 dokončen (YouTube Metadata & Google Drive Embeds), funkční a testováno

---

> 💡 **Pro budoucí Claude**: Tohle je kompletní kontext. Máš vše co potřebuješ. Pokud něco chybí, zeptej se uživatelky!
