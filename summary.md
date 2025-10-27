# CoachPro - Kompletní dokumentace projektu

## 📋 O projektu

**Název**: CoachPro
**Typ**: Webová aplikace pro kouče a jejich klientky
**Tech stack**: React 18, Material-UI v6, Vite, React Router, localStorage
**Design**: Nature theme inspirovaný PaymentsPro
**Datum zahájení**: Říjen 2025

## 🎯 Účel aplikace

CoachPro je aplikace pro kouče, kteří chtějí vytvářet a sdílet strukturované programy pro své klientky. Kouč vytvoří program s denními materiály (audio meditace, PDF dokumenty, cvičení, atd.) a sdílí jej pomocí QR kódu nebo 6místného kódu. Klientka pak každý den dostává nové materiály a sleduje svůj pokrok.

## 👥 Role v aplikaci

### Kouč
- Vytváří a spravuje materiály (audio, PDF, dokumenty, text, odkazy)
- Vytváří programy složené z jednotlivých dnů
- Každý den programu má vlastní materiály a instrukce
- Sdílí programy pomocí QR kódu nebo 6místného kódu
- Sleduje aktivitu svých klientek

### Klientka
- Zadá 6místný kód pro přístup k programu
- Vidí pouze materiály pro aktuální den
- Po dokončení dne může přejít na další den
- Sleduje svůj pokrok v "zahradě" (vizualizace dokončených dnů)
- Volitelně zadává náladu na začátku a konci dne

---

## 🏗️ Vývoj projektu - Sprint po sprintu

### Sprint 1: Základní struktura a autentizace

**Vytvořená architektura:**

```
src/
├── App.jsx                    # Root komponenta s routing
├── main.jsx                   # Entry point
├── modules/
│   └── coach/
│       ├── pages/
│       │   ├── CoachAuth.jsx        # Přihlášení kouče
│       │   ├── CoachDashboard.jsx   # Dashboard kouče
│       │   └── ClientAuth.jsx       # Vstup klientky (QR/kód)
│       └── utils/
│           ├── storage.js           # LocalStorage utils
│           └── generateCode.js      # Generování QR a kódů
└── shared/
    ├── components/
    │   ├── Layout.jsx          # Hlavní layout
    │   ├── Header.jsx          # Top bar
    │   └── Sidebar.jsx         # Navigace
    └── themes/
        └── natureTheme.js      # Nature theme (zelené barvy)
```

**Implementované funkce:**
- ✅ Přihlášení kouče (jméno, email)
- ✅ Persistent session v sessionStorage
- ✅ Protected routes
- ✅ Layout s sidebar navigací
- ✅ Nature theme s dark/light mode
- ✅ Responsive design

**Design systém:**
- Barvy: Forest Green (#556B2F), Sage (#8FBC8F), Dusty Rose (#BC8F8F)
- Font: Inter, Roboto
- Glassmorphism efekty (blur backdrop)

---

### Sprint 2: Správa materiálů

**Vytvořené komponenty:**

```
modules/coach/components/
├── coach/
│   ├── MaterialsLibrary.jsx      # Seznam všech materiálů
│   ├── MaterialCard.jsx          # Karta jednoho materiálu
│   ├── AddMaterialModal.jsx     # Modal pro přidání materiálu
│   └── DashboardOverview.jsx    # Dashboard s rychlými akcemi
└── shared/
    ├── CustomAudioPlayer.jsx     # Audio přehrávač
    ├── PDFViewer.jsx            # PDF viewer
    ├── DocumentViewer.jsx       # Viewer pro DOC/XLS/PPT
    └── PreviewModal.jsx         # Glassmorphism modal pro náhled
```

**Typy materiálů:**
1. **Audio** (MP3, WAV, M4A)
   - Upload s drag & drop
   - Base64 storage v localStorage
   - Vlastní audio přehrávač s controls
   - Detekce délky audio

2. **PDF**
   - Upload PDF dokumentů
   - Inline viewer nebo download
   - Preview v modalu

3. **Dokumenty** (DOC, DOCX, XLS, XLSX, PPT, PPTX, ODT, ODS, ODP)
   - Upload s drag & drop
   - Download funkce
   - Ikona podle typu souboru

4. **Text**
   - Formátovaný text s line breaks
   - Zobrazení v krásném kontejneru

5. **Odkazy** (URL)
   - Podpora Google Drive, iCloud, YouTube, běžné weby
   - Otevření v novém okně

**Implementované funkce:**
- ✅ CRUD operace pro materiály
- ✅ Kategorie (Meditace, Afirmace, Cvičení, Reflexe, Ostatní)
- ✅ Drag & Drop upload
- ✅ Preview modal s glassmorphism
- ✅ Error handling (velikost souboru, formát)
- ✅ File size limit (3MB audio/PDF/doc, 2MB images)
- ✅ Base64 encoding pro storage
- ✅ Search a filtrování materiálů

**Storage:**
```javascript
localStorage.setItem('coachpro_materials', JSON.stringify([
  {
    id: 'uuid',
    coachId: 'coach-id',
    type: 'audio' | 'pdf' | 'document' | 'text' | 'link',
    title: 'Název materiálu',
    description: 'Popis',
    content: 'base64 nebo URL',
    category: 'meditation',
    duration: 180, // sekundy (jen audio)
    fileSize: 1024000, // bytes
    createdAt: '2025-10-26T12:00:00Z'
  }
]))
```

---

### Sprint 3: Programy a klientky

**Vytvořené komponenty:**

```
modules/coach/components/
├── coach/
│   ├── ProgramsList.jsx          # Seznam programů
│   ├── ProgramEditor.jsx         # Editor programu (stepper)
│   ├── ShareProgramModal.jsx    # QR kód a sdílení
│   └── ClientsList.jsx          # Seznam klientek (placeholder)
└── client/
    ├── ClientEntry.jsx           # Vstup klientky (kód/QR)
    ├── DailyView.jsx            # Denní pohled s materiály
    ├── MoodCheck.jsx            # Kontrola nálady
    ├── ProgressGarden.jsx       # Vizualizace pokroku
    └── CelebrationModal.jsx     # Oslava dokončení
```

**Workflow programu:**

1. **Kouč vytvoří program:**
   - Název a popis programu
   - Délka programu (počet dnů)
   - Pro každý den:
     - Název dne
     - Popis
     - Výběr materiálů z knihovny
     - Instrukce pro klientku

2. **Sdílení:**
   - Automatické generování 6místného kódu
   - QR kód s kódem programu
   - Modal s možností kopírování nebo sdílení
   - Download QR kódu jako PNG

3. **Klientka vstupuje:**
   - Zadá 6místný kód
   - Zadá své jméno
   - Vidí info o programu (název, délka, autor)
   - Zahájí program

4. **Denní rutina klientky:**
   - Vidí pouze materiály pro aktuální den
   - Volitelně: mood check na začátku
   - Přehraje/přečte materiály
   - Vidí instrukce od kouče
   - Označí den jako dokončený
   - Volitelně: mood check na konci
   - Přejde na další den

5. **Pokrok:**
   - Vizualizace "zahrada" s ikonkami
   - 🌰 Seed = budoucí den
   - 🌱 Sprout = aktuální den
   - 🌸 Flower = dokončený den
   - Streak counter (consecutive days)

**Program storage:**
```javascript
localStorage.setItem('coachpro_programs', JSON.stringify([
  {
    id: 'uuid',
    coachId: 'coach-id',
    title: 'Program název',
    description: 'Popis programu',
    duration: 7, // počet dnů
    shareCode: 'ABC123', // 6místný kód
    qrCode: 'data:image/png;base64,...',
    isActive: true,
    days: [
      {
        dayNumber: 1,
        title: 'Den 1',
        description: 'Úvod do programu',
        materialIds: ['mat-id-1', 'mat-id-2'],
        instruction: 'Dnes začínáme...'
      },
      // ... další dny
    ],
    createdAt: '2025-10-26T12:00:00Z'
  }
]))
```

**Klient storage:**
```javascript
localStorage.setItem('coachpro_clients', JSON.stringify([
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
]))

sessionStorage.setItem('coachpro_currentClient', JSON.stringify({...}))
```

**Implementované funkce:**
- ✅ Vytvoření programu s multi-step formulářem
- ✅ QR kód generování (qrcode.react)
- ✅ 6místný kód (náhodný)
- ✅ Validace programu (musí mít všechny dny vyplněné)
- ✅ Sdílení pomocí Web Share API nebo kopírování
- ✅ Vstup klientky přes kód
- ✅ Progress tracking
- ✅ Mood checks (optional)
- ✅ Celebration při dokončení programu
- ✅ Denní uzamčení (klientka nemůže přeskočit dny)
- ✅ Konfetti animace při dokončení
- ✅ Animace (framer-motion)

---

### Sprint 4: Bug Fixes & Polish

**Opravené chyby:**

1. **MP3 se nehrály**
   - Přidán error handling do CustomAudioPlayer
   - Key prop pro reset při změně src
   - Error state a zobrazení chybové hlášky

2. **PDF se neukládaly**
   - Implementována kontrola velikosti (max 5MB pro localStorage)
   - Lepší error propagation v storage.js
   - Alert při QuotaExceededError

3. **Chyběla podpora dokumentů**
   - Přidána podpora DOC, DOCX, XLS, XLSX, PPT, PPTX
   - Přidána podpora OpenDocument (ODT, ODS, ODP)
   - Vytvořen DocumentViewer s download funkcí

4. **Nejasná podpora cloud odkazů**
   - Upraven placeholder text v AddMaterialModal
   - Helper text: "Podporuje běžné weby, Google Drive, iCloud, YouTube a další"

5. **Program se neukládal správně**
   - Opravena inicializace days v ProgramEditor
   - Fixed useEffect dependencies
   - Auto-generování "Den 1", "Den 2" pokud není vyplněno

6. **Nešlo přejít na další den**
   - Opraven handleNextDay v DailyView
   - Update localStorage i sessionStorage
   - Page reload po přechodu

7. **Drag & Drop nefungoval**
   - Přidány drag event handlers do AddMaterialModal
   - Prevence default browser behavior
   - Visual feedback při přetahování

8. **Preview otevíralo černou obrazovku**
   - Vytvořen PreviewModal s glassmorphism
   - Integrace všech viewer komponent
   - Tlačítko "Otevřít v nové kartě" pro audio/PDF

---

### Sprint 4.5: Border-Radius Systém (aktuální)

**Problém:**
Hardcodované border-radius hodnoty po celé aplikaci způsobovaly nekonzistentní design.

**Řešení:**
Vytvořen centralizovaný border-radius systém zkopírovaný z PaymentsPro.

**Soubor: `/src/styles/borderRadius.js`**

```javascript
export const BORDER_RADIUS = {
  // Základní hodnoty
  standard: '20px',    // Hlavní containery, panely
  compact: '16px',     // Kompaktní tlačítka, menší prvky
  premium: '24px',     // Premium varianty, větší elementy
  small: '12px',       // Malé prvky, chips, menu items
  minimal: '8px',      // Nejmenší prvky, progress bary

  // Specifické komponenty
  input: '16px',       // Input fieldy
  button: '18px',      // Tlačítka
  card: '20px',        // Karty
  toggle: '20px',      // Toggle tlačítka
  select: '16px',      // Select fieldy
  dialog: '20px',      // Dialogy
  filter: '16px',      // Filtry
  search: '16px',      // Search bary

  // Mobile responsive
  mobile: {
    standard: '16px',
    compact: '12px',
    premium: '20px',
    input: '12px',
    button: '12px',
    card: '16px',
    dialog: '16px'
  }
};

// Theme override funkce
export const createBorderRadiusTheme = (theme) => ({
  ...theme,
  components: {
    // Proporcionální podle velikosti
    MuiButton: {
      styleOverrides: {
        sizeSmall: { borderRadius: BORDER_RADIUS.small }, // 12px
        sizeMedium: { borderRadius: BORDER_RADIUS.compact }, // 16px
        sizeLarge: { borderRadius: BORDER_RADIUS.standard } // 20px
      }
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: BORDER_RADIUS.small, // 12px
          margin: '2px 0'
        }
      }
    },
    // ... 15+ dalších komponent
  }
});
```

**Opravených 11 souborů:**
1. DashboardOverview.jsx
2. MaterialsLibrary.jsx
3. ProgramsList.jsx
4. ShareProgramModal.jsx
5. DailyView.jsx
6. CustomAudioPlayer.jsx
7. ClientEntry.jsx
8. ProgressGarden.jsx
9. PreviewModal.jsx
10. AddMaterialModal.jsx
11. Sidebar.jsx

**Sidebar optimalizace:**
- Šířka: 260px → 200px (o 60px užší)
- Menu items: border-radius 12px
- Výška tlačítek: 40px (kompaktní)
- Padding optimalizován
- Odsazení shora: 80px

**Dashboard tlačítka:**
- Odstraněn `fullWidth`
- Přidán `alignItems="flex-start"`
- Tlačítka jen tak široká, jak potřebují
- Size: medium, py: 1

---

## 📊 Statistiky projektu

### Soubory a komponenty
- **Celkem React komponent**: 25+
- **Pages**: 6
- **Shared komponenty**: 8
- **Utility soubory**: 5

### Funkce
- **CRUD operace**: Materiály, Programy, Klienti
- **Typy materiálů**: 5 (audio, PDF, doc, text, link)
- **Kategorie materiálů**: 5
- **Role**: 2 (kouč, klient)
- **Storage keys**: 5 (users, materials, programs, clients, sessions)

### Design
- **Border-radius hodnot**: 5 hlavních velikostí
- **MUI component overrides**: 15+
- **Responzivní breakpoints**: xs, sm, md
- **Theme modes**: light & dark
- **Animace**: framer-motion (4+ komponenty)

### Velikost dat
- **LocalStorage limit**: ~5MB
- **Max file size**: 3MB (audio/PDF/doc)
- **Max audio duration**: unlimited (ale doporučeno komprimovat)

---

## 🎨 Design System

### Barvy

**Light mode:**
```css
Primary: #556B2F (Forest Green)
Secondary: #BC8F8F (Dusty Rose)
Accent: #8FBC8F (Sage)
Success: #228B22
Warning: #DAA520
Error: #CD5C5C
Background: #fafafa
Paper: rgba(255, 255, 255, 0.95)
```

**Dark mode:**
```css
Primary: #8FBC8F (Light Sage)
Secondary: #BC8F8F (Dusty Rose)
Accent: #556B2F (Forest Green)
Success: #4ade80
Warning: #fbbf24
Error: #f87171
Background: #0f0f0f
Paper: rgba(26, 26, 26, 0.95)
```

### Typography
- **Font family**: Inter, Roboto, Helvetica, Arial, sans-serif
- **Headings**: 700 weight
- **Body**: 400-500 weight
- **Buttons**: 500 weight, no text-transform

### Spacing
- Container padding: 3 (24px)
- Card spacing: 3
- Stack spacing: 1.5-2
- Margin bottom: 0.5-1

### Shadows
- Light: `0 2px 8px rgba(0,0,0,0.1)`
- Medium: `0 4px 12px rgba(0,0,0,0.15)`
- Heavy: `0 8px 32px rgba(0,0,0,0.2)`

### Glassmorphism
```css
backdrop-filter: blur(20px);
background: rgba(255, 255, 255, 0.95); /* light */
background: rgba(26, 26, 26, 0.95); /* dark */
border: 1px solid rgba(255, 255, 255, 0.1);
```

---

## 🔧 Technické detaily

### Storage strategie

**localStorage** (persistent):
- Users (kouči)
- Materials
- Programs
- Clients

**sessionStorage** (current session):
- currentUser (kouč)
- currentClient (klient)

### Generování kódů

**UUID**: `crypto.randomUUID()` nebo fallback
**Share code**: 6 random uppercase chars (A-Z + 0-9)
**QR code**: `qrcode.react` library

### File handling

**Upload flow:**
1. User vybere soubor (input nebo drag&drop)
2. Kontrola typu souboru
3. Kontrola velikosti (max 3MB)
4. Konverze na base64
5. Pro audio: detekce délky
6. Uložení do localStorage
7. Error handling

**Base64 encoding:**
```javascript
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
```

### Animace

**framer-motion:**
- fadeIn, fadeInUp
- staggerContainer, staggerItem
- Dialog enter/exit
- Confetti při dokončení

---

## 🚀 Deployment

### Build
```bash
npm run build
```

### Preview
```bash
npm run preview
```

### Dev
```bash
npm run dev
# Server: http://localhost:3000/
```

---

## 📝 Známé limitace

1. **LocalStorage limit (~5MB)**
   - Řešení: Komprimovat audio, používat menší soubory
   - Warning: Zobrazí se při QuotaExceededError

2. **QR Scanner není implementován**
   - Placeholder v ClientEntry
   - Klientky musí zadávat kód ručně

3. **Offline mode není implementován**
   - Vyžaduje internet connection

4. **Žádný backend**
   - Všechna data v localStorage
   - Není synchronizace mezi zařízeními

5. **Dashboard vypadá prázdně bez dat**
   - Počká se na více reálných dat

6. **ClientsList je placeholder**
   - Zatím jen prázdná stránka

---

## 🎯 Další kroky (Sprint 5)

### Priorita 1 - Dokončení funkcí
- [ ] Implementovat ClientsList stránku
- [ ] Otestovat všechny flows s reálnými daty
- [ ] Mobile responsivita všech stránek
- [ ] Loading states pro všechny async operace
- [ ] Error boundaries

### Priorita 2 - UX vylepšení
- [ ] Dashboard layout s více daty
- [ ] Warning při blízkém localStorage limitu (80%+)
- [ ] Undo pro delete operace
- [ ] Bulk delete materiálů
- [ ] Export programu jako PDF

### Priorita 3 - Nice-to-have
- [ ] Dark mode toggle v UI
- [ ] Statistiky pro kouče (čas, nejpoužívanější materiály)
- [ ] Notifikace reminders pro klientky
- [ ] QR scanner implementace
- [ ] Multi-language support
- [ ] Backend integrace (optional)

---

## 👨‍💻 Pro vývojáře

### Jak začít
```bash
git clone [repo]
cd coachpro
npm install
npm run dev
```

### Testování
- Přihlásit se jako kouč
- Vytvořit pár materiálů
- Vytvořit program
- Získat kód programu
- Otevřít incognito okno
- Vstoupit jako klient s kódem
- Projít program den po dni

### Debug
1. Clear localStorage: `localStorage.clear()`
2. Clear cache: `rm -rf node_modules/.vite`
3. Restart server: Ctrl+C, `npm run dev`
4. Hard refresh: Cmd+Shift+R

### Code style
- Use functional components
- Use hooks (no class components)
- Import BORDER_RADIUS for all border-radius
- Use theme colors (no hardcoded colors)
- Use MUI components (consistent styling)
- Add PropTypes or TypeScript types

---

## 📄 License

Soukromý projekt pro Lenku Roubalovou.

---

**Poslední update**: 26. října 2025, 22:07
**Verze**: Sprint 5 (Externí odkazy)
**Status**: ✅ Funkční, připraveno k testování

---

## 🔗 Sprint 5: Podpora externích odkazů (26. října 2025, 22:07)

### Co bylo implementováno

**1. Automatická detekce služeb (11 + generic)**

Implementován kompletní systém detekce externích odkazů v `/src/modules/coach/utils/linkDetection.js`:

| Služba | Embed | Barva | Poznámka |
|--------|-------|-------|----------|
| YouTube | ✅ | #FF0000 | Včetně Shorts! |
| Vimeo | ✅ | #1AB7EA | Video embed |
| Spotify | ✅ | #1DB954 | Track/Playlist/Album |
| SoundCloud | ✅ | #FF5500 | Audio embed |
| Instagram | ✅ | #E4405F | Post/Reel embed |
| Google Drive | ❌ | #4285F4 | Otevře v novém okně |
| iCloud | ❌ | #000000 | Otevře v novém okně |
| Dropbox | ❌ | #0061FF | Otevře v novém okně |
| OneDrive | ❌ | #0078D4 | Otevře v novém okně |
| Canva | ❌ | #00C4CC | Otevře v novém okně |
| Notion | ❌ | #000000 | Otevře v novém okně |
| Generic | ❌ | #757575 | Jakýkoliv jiný odkaz |

**2. Vícebarevná SVG loga služeb**

Vytvořena složka `/src/assets/service-logos/` s reálnými vícebarevnými logy:
- YouTube (červené s bílým)
- Spotify (zelené s bílým)
- GoogleDrive (vícebarevné 🔵🟢🟡🔴)
- Instagram (gradient 🟡→🔴→🟣)
- Vimeo, SoundCloud, iCloud, Dropbox, OneDrive, Canva, Notion

**3. ServiceLogo komponenta**

`/src/modules/coach/components/shared/ServiceLogo.jsx` - zobrazuje reálná loga místo emoji ikon.

```jsx
<ServiceLogo linkType="youtube" size={32} />
<ServiceLogo linkType="google-drive" size={24} />
```

**4. Klíčové funkce (linkDetection.js)**

```javascript
// Detekce typu služby z URL
detectLinkType(url)
// → { type, icon, label, color, embedSupport }

// Generování embed URL
getEmbedUrl(url, linkType)
// → embed URL string nebo null

// Validace URL
isValidUrl(string)
// → boolean

// YouTube thumbnail (včetně Shorts)
getThumbnailUrl(url, linkType)
// → URL náhledového obrázku
```

**5. YouTube Shorts podpora**

Regex pattern rozšířen o podporu Shorts URL:
```javascript
/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^&\s?]+)/

// Podporuje:
✅ youtube.com/watch?v=XXX
✅ youtu.be/XXX
✅ youtube.com/shorts/XXX  // ← NOVÉ!
✅ youtube.com/embed/XXX
```

**6. Aktualizované komponenty**

**AddMaterialModal.jsx:**
- TextField pro URL s auto-detekcí při zadávání
- Moderní preview box s gradientem v barvě služby
- Živý iframe preview pro služby s embedSupport
- Info alert pro služby bez embed supportu
- Validace URL před uložením

**MaterialCard.jsx (moderní minimalistický design):**
- Reálné vícebarevné logo (32px) v pravém horním rohu
- Kompaktní chip s názvem služby v barvě služby
- Chip "Náhled" pro služby s embedSupport
- Tlačítko "Náhled" pro všechny materiály
- Tlačítko "Otevřít" s ikonou pro link materiály
- Logo místo velkého headeru (modernější než původní spec)

**DailyView.jsx (zobrazení pro klientky):**
- YouTube embed (16:9, moderní design s barevným stínem)
- Vimeo embed (16:9)
- Spotify embed (380px výška)
- SoundCloud embed (166px výška)
- Instagram embed (max 540px, 600px výška)
- Fallback tlačítko s gradientem pro ostatní služby

**PreviewModal.jsx:**
- Stejný embed rendering jako DailyView
- Konzistentní design napříč aplikací
- Glassmorphism efekt
- Zobrazení loga a názvu služby v headeru

**7. Material object - nová pole**

```javascript
{
  // ... standardní pole
  type: 'link',
  content: 'https://youtube.com/watch?v=abc123',  // URL místo base64

  // ⚠️ NOVÉ - Link specific:
  linkType: 'youtube',
  linkMeta: {
    icon: '▶️',
    label: 'YouTube',
    color: '#ff0000',
    embedSupport: true
  },
  thumbnail: 'https://img.youtube.com/vi/abc123/maxresdefault.jpg'  // jen YouTube
}
```

### Technické detaily

**Embed URL formáty:**
```javascript
// YouTube
https://www.youtube.com/embed/${videoId}?rel=0

// Vimeo
https://player.vimeo.com/video/${videoId}

// Spotify
https://open.spotify.com/embed/${type}/${id}

// SoundCloud
https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&...

// Instagram
https://www.instagram.com/${type}/${id}/embed
```

**Auto-detection patterns:**
- YouTube: `youtube.com`, `youtu.be`, `youtube.com/shorts`
- Spotify: `spotify.com`, `open.spotify.com`
- Google Drive: `drive.google.com`, `docs.google.com`
- OneDrive: `onedrive.live.com`, `1drv.ms`
- Notion: `notion.so`, `notion.site`
- ... a další

### Testování

**Jako kouč:**
1. Knihovna materiálů → Přidat materiál → Odkaz
2. Zadat YouTube URL (včetně Shorts)
3. Sledovat auto-detekci a live preview
4. Uložit → vidět logo v kartě

**Jako klient:**
1. Denní pohled s link materiálem
2. Služby s embedem se zobrazí inline (iframe)
3. Služby bez embedu mají tlačítko "Otevřít"

### Změny v souborech

**Nové soubory:**
- `/src/modules/coach/utils/linkDetection.js` ⚠️ KRITICKÝ
- `/src/assets/service-logos/` (11 SVG komponent) ⚠️ KRITICKÝ
- `/src/modules/coach/components/shared/ServiceLogo.jsx`

**Upravené soubory:**
- `AddMaterialModal.jsx` - nový typ "link"
- `MaterialCard.jsx` - moderní design s logem v rohu
- `DailyView.jsx` - embed rendering
- `PreviewModal.jsx` - embed rendering
- `claude.md` - kompletní dokumentace
- `summary.md` - tento dokument

### Známé limitace

1. **iCloud sdílení nefunguje spolehlivě**
   - Apple omezil veřejné sdílení v macOS Sequoia
   - Doporučení: Používat Google Drive nebo Dropbox

2. **Instagram embed může být omezený**
   - Závisí na privacy nastavení postu
   - Některé posty nemusí mít embed podporu

3. **SoundCloud embed vyžaduje veřejný track**
   - Privátní tracky se nezobrazí

### Další kroky

- [ ] Testovat s reálnými odkazy všech služeb
- [ ] Ověřit embed rendering na mobilech
- [ ] Přidat error handling pro nefunkční embedy
- [ ] Zvážit rate limiting pro detekci (aby API nebylo spamováno)

---

**Sprint 5 dokončen**: 26. října 2025, 22:07
**Implementoval**: Claude + Lenka
**Status**: ✅ Připraveno k testování

---

## 🗄️ Sprint 6: Supabase Storage & UI vylepšení (27. října 2025)

### Motivace

LocalStorage s limitem ~5-8 MB je nedostatečné pro reálné testování s více kouči a klientkami. Nahrávání souborů (PDF, audio) rychle vyčerpá dostupný prostor. Potřebovali jsme cloudové úložiště s větší kapacitou.

**Hlavní problémy:**
- ❌ LocalStorage limit 5-8 MB celkově (ne per user!)
- ❌ Nemožnost nahrát větší soubory (3 MB PDF = odmítnuto)
- ❌ Editace materiálů nefungovala
- ❌ UI karty bylo nepřehledné (skryté menu)
- ❌ Chyběly důležité info (název souboru, počet stran)

### Co bylo implementováno

#### 1. Editace materiálů

**MaterialCard.jsx:**
- Odstraněno "three dots" menu
- Všechny akce přímo viditelné jako tlačítka:
  - **Náhled** (play icon, primary)
  - **Upravit** (edit icon, primary)
  - **Otevřít** (external icon, primary, jen pro links)
  - **Smazat** (delete icon, red s potvrzovacím dialogem)

**AddMaterialModal.jsx:**
- Přidán `editMaterial` prop pro edit mode
- Pre-vyplnění všech polí z existujícího materiálu
- Zachování existujících souborů při editaci
- Správné zachování `createdAt` a přidání `updatedAt`
- Tlačítko "Upravit materiál" místo "Přidat materiál"

#### 2. Počet stran u PDF a textových souborů

**Instalované balíčky:**
```bash
npm install pdfjs-dist
```

**helpers.js - nové funkce:**
```javascript
// Skutečný počet stran v PDF
export const getPdfPageCount = async (file) => {
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  return pdf.numPages;
};

// Odhad stran podle počtu znaků (2000 znaků = 1 strana)
export const estimateTextPageCount = (text) => {
  if (!text) return 0;
  const charsPerPage = 2000;
  return Math.max(1, Math.ceil(text.length / charsPerPage));
};

// Česká pluralizace
export const formatPageCount = (pages) => {
  if (!pages || pages < 1) return '';
  if (pages === 1) return '1 strana';
  if (pages >= 2 && pages <= 4) return `${pages} strany`;
  return `${pages} stran`;
};
```

**MaterialCard.jsx - zobrazení:**
```jsx
{material.pageCount && (
  <Typography variant="caption" color="text.secondary">
    📄 {formatPageCount(material.pageCount)}
  </Typography>
)}
```

**Opravené chyby:**
- ❌ PDF.js worker 404 z cdnjs.cloudflare.com
- ✅ Změněno na unpkg.com CDN
- ✅ Restart dev serveru pro Vite optimalizaci

#### 3. Supabase Storage integrace

**Instalace:**
```bash
npm install @supabase/supabase-js
```

**Struktura:**
```
.env                            # Supabase credentials
src/
├── config/
│   └── supabase.js            # Supabase client
└── modules/coach/utils/
    └── supabaseStorage.js      # Upload/delete/URL funkce
```

**/.env:**
```env
VITE_SUPABASE_URL=https://qrnsrhrgjzijqphgehra.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

**supabase.js:**
```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

**supabaseStorage.js - klíčové funkce:**

```javascript
// Sanitizace názvu souboru (odstraní diakritiku, speciální znaky)
const sanitizeFilename = (filename) => {
  // 1. Odstranit příponu
  // 2. Transliterace češtiny (á→a, č→c, ...)
  // 3. Lowercase, mezery→pomlčky
  // 4. Odstranit speciální znaky
  // 5. Max 50 znaků
  return 'mikova-vlasta-hosting';
};

// Upload do Supabase s čitelným názvem
export const uploadFileToSupabase = async (file, coachId, type) => {
  const sanitizedName = sanitizeFilename(file.name);
  const shortHash = generateUUID().substring(0, 8);
  const fileName = `${sanitizedName}-${shortHash}.${fileExt}`;
  const filePath = `${coachId}/${type}/${fileName}`;

  // Příklad: demo-coach-1/pdf/mikova-vlasta-hosting-7eec5405.pdf

  const { data, error } = await supabase.storage
    .from('materials-coach')
    .upload(filePath, file);

  const { data: { publicUrl } } = supabase.storage
    .from('materials-coach')
    .getPublicUrl(filePath);

  return { path: filePath, url: publicUrl };
};

// Mazání z Supabase
export const deleteFileFromSupabase = async (filePath) => {
  await supabase.storage
    .from('materials-coach')
    .remove([filePath]);
};

// Kontrola konfigurace
export const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return !!(url && key && url !== 'https://your-project.supabase.co');
};
```

**AddMaterialModal.jsx - upload logic:**
```javascript
// Upload s fallbackem na base64
if (isSupabaseConfigured()) {
  try {
    const { url, path } = await uploadFileToSupabase(file, currentUser.id, selectedType);
    content = url; // Supabase public URL
    storagePath = path; // Pro pozdější smazání
  } catch (uploadError) {
    console.error('Supabase upload failed, falling back to base64:', uploadError);
    content = await fileToBase64(file); // Fallback
  }
} else {
  content = await fileToBase64(file); // LocalStorage fallback
}
```

**storage.js - async deletion:**
```javascript
export const deleteMaterial = async (id) => {
  const materials = getMaterials();
  const material = materials.find(m => m.id === id);

  // Smazat z Supabase pokud tam je
  if (material?.storagePath) {
    try {
      const { deleteFileFromSupabase } = await import('./supabaseStorage');
      await deleteFileFromSupabase(material.storagePath);
    } catch (error) {
      console.error('Failed to delete from Supabase:', error);
      // Pokračuj se smazáním z localStorage i při chybě
    }
  }

  const filtered = materials.filter(m => m.id !== id);
  return saveToStorage(STORAGE_KEYS.MATERIALS, filtered);
};
```

**MaterialCard.jsx - async delete handler:**
```javascript
const handleDelete = async () => {
  try {
    await deleteMaterial(material.id); // Teď je async
    onUpdate();
    setDeleteDialogOpen(false);
  } catch (error) {
    console.error('Error deleting material:', error);
    setDeleteDialogOpen(false);
    onUpdate();
  }
};
```

#### 4. Supabase RLS (Row Level Security) politiky

**Problém:**
- Bucket byl Public, ale RLS politiky blokovaly upload
- Error: `new row violates row-level security policy`

**Řešení - SQL politiky:**
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

**Postup v Supabase dashboardu:**
1. SQL Editor (levé menu)
2. Vložit SQL
3. Run (F5)
4. Success → políti vytvořeny

#### 5. Zobrazení názvu souboru a velikosti na kartě

**Material object - nová pole:**
```javascript
{
  id: 'uuid',
  // ... standardní pole
  fileName: 'mikova-vlasta-hosting.pdf',  // ⚠️ NOVÉ
  fileSize: 1024000,                      // bytes
  pageCount: 45,                          // ⚠️ NOVÉ pro PDF/text
  storagePath: 'demo-coach-1/pdf/...'    // ⚠️ NOVÉ pro Supabase
}
```

**MaterialCard.jsx - zobrazení:**
```jsx
{/* Název souboru */}
{material.fileName && (
  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontStyle: 'italic' }}>
    📎 {material.fileName}
  </Typography>
)}

{/* Meta info */}
<Box display="flex" gap={2} flexWrap="wrap" alignItems="center" mt="auto">
  {material.duration && (
    <Typography variant="caption">⏱️ {formatDuration(material.duration)}</Typography>
  )}
  {material.pageCount && (
    <Typography variant="caption">📄 {formatPageCount(material.pageCount)}</Typography>
  )}
  {material.fileSize && (
    <Typography variant="caption">📦 {formatFileSize(material.fileSize)}</Typography>
  )}
</Box>
```

**UI změny:**
- ❌ Odstraněno auto-vyplňování názvu materiálu z názvu souboru
- ✅ Uživatel zadá vlastní popisný název (např. "Úvod do meditace")
- ✅ Celý název souboru se zobrazí na kartě (včetně přípony)
- ✅ Velikost souboru se zobrazí vždycky (i když je počet stran)

**AddMaterialModal.jsx - změny:**
```javascript
// ODSTRANĚNO: Auto-fill názvu z názvu souboru
const handleFileSelect = (event) => {
  const selectedFile = event.target.files[0];
  if (selectedFile) {
    setFile(selectedFile);
    // ❌ ODSTRANĚNO: if (!title) { setTitle(fileName); }
  }
};
```

#### 6. Sanitizace názvů souborů v Supabase

**Problém:**
- UUID názvy v Supabase (7eec5405-29af-459d-8feb-a7d33a6de5e0.pdf)
- Nepoznáš, co je co v Supabase dashboardu

**Řešení:**
- Sanitizovaný název + 8-znakový hash
- `Míková Vlasta_hosting.pdf` → `mikova-vlasta-hosting-7eec5405.pdf`

**Transliterace:**
```javascript
const translitMap = {
  'á': 'a', 'č': 'c', 'ď': 'd', 'é': 'e', 'ě': 'e', 'í': 'i', 'ň': 'n',
  'ó': 'o', 'ř': 'r', 'š': 's', 'ť': 't', 'ú': 'u', 'ů': 'u', 'ý': 'y', 'ž': 'z',
  // + velkká písmena
};
```

**Algoritmus:**
1. Odstranit příponu
2. Transliterovat česká písmena
3. Lowercase
4. Mezery a `_` → `-`
5. Odstranit speciální znaky
6. Zkrátit na 50 znaků
7. Přidat 8-znakový hash z UUID
8. Přidat příponu

**Výhody:**
- ✅ Soubory se řadí podle abecedy v Supabase
- ✅ Čitelné názvy pro debugging
- ✅ Unikátnost díky hashe
- ✅ URL-safe (bez speciálních znaků)

### Struktura v Supabase Storage

```
materials-coach/
├── demo-coach-1/
│   ├── pdf/
│   │   ├── mikova-vlasta-hosting-7eec5405.pdf
│   │   ├── 1-sj-vp-z1aurp-text-a92f3c12.pdf
│   │   └── meditace-uvod-b3f8a621.pdf
│   ├── audio/
│   │   └── ranní-meditace-c4d5e6f7.mp3
│   └── document/
│       └── cvičení-reflexe-8a9b0c1d.docx
└── coach-2/
    └── ...
```

### Technické detaily

**Kapacity:**
- LocalStorage: ~5-8 MB celkově
- Supabase Free tier: **1 GB** (200x více!)
- Supabase Bandwidth: 2 GB/měsíc

**Material object size comparison:**
```javascript
// LocalStorage (base64)
{
  content: 'data:application/pdf;base64,JVBERi0xLjQKJeLjz9MKMiAwIG...' // ~1.37 MB
}

// Supabase Storage (URL)
{
  content: 'https://qrnsrhrgjzijqphgehra.supabase.co/storage/v1/object/public/materials-coach/demo-coach-1/pdf/mikova-vlasta-hosting-7eec5405.pdf', // ~150 bytes
  storagePath: 'demo-coach-1/pdf/mikova-vlasta-hosting-7eec5405.pdf' // ~60 bytes
}
```

**Úspora:** >99% místa v localStorage! 🎉

### Opravené chyby

1. **PDF.js Worker 404**
   - Původně: cdnjs.cloudflare.com (nefunguje)
   - Opraveno: unpkg.com

2. **Vite Dependency Optimization**
   - Kill + restart dev serveru po instalaci pdfjs-dist

3. **QuotaExceededError při 3 MB PDF**
   - Řešeno: Supabase Storage místo localStorage

4. **Missing fileName proměnná**
   - Chyběla inicializace `let fileName = null;` v handleSave

5. **Supabase RLS blocking uploads**
   - Vytvořeny SQL politiky pro INSERT, SELECT, DELETE

### Změny v souborech

**Nové soubory:**
- `.env` - Supabase credentials ⚠️ DO NOT COMMIT
- `.env.example` - Template
- `/src/config/supabase.js`
- `/src/modules/coach/utils/supabaseStorage.js`

**Upravené soubory:**
- `AddMaterialModal.jsx` - Supabase upload, edit mode, fileName, pageCount
- `MaterialCard.jsx` - UI redesign, async delete, fileName display
- `storage.js` - async deleteMaterial s Supabase cleanup
- `helpers.js` - getPdfPageCount, estimateTextPageCount, formatPageCount
- `package.json` - dependencies (+2)

### Testování

**Upload flow:**
1. Kouč → Knihovna materiálů → Přidat materiál
2. Vyber PDF typ
3. Nahraj soubor (drag & drop nebo kliknutí)
4. Pole "Název materiálu" **zůstane prázdné** (už se nepředvyplní)
5. Zadej vlastní název (např. "Úvod do meditace")
6. Zadej popis (optional)
7. Vyber kategorii
8. Klikni "Uložit materiál"
9. **V konzoli:** Měl by být úspěšný upload (bez RLS erroru)
10. **V kartě:** Zobrazí se název souboru, počet stran, velikost

**Supabase verification:**
1. Otevři Supabase dashboard
2. Storage → materials-coach
3. demo-coach-1/pdf/
4. Měl by být soubor s čitelným názvem: `uvod-do-meditace-7eec5405.pdf`

**Edit flow:**
1. Klikni "Upravit" na existující kartě
2. Modal se otevře s předvyplněnými poli
3. Změň název nebo popis
4. Klikni "Upravit materiál"
5. Změny se uloží (včetně `updatedAt`)

**Delete flow:**
1. Klikni "Smazat" (červené tlačítko)
2. Potvrzovací dialog
3. Klikni "Smazat"
4. Soubor se smaže z localStorage **i z Supabase**
5. Karta zmizí

### Známé limitace

1. **Supabase Free tier limits:**
   - 1 GB storage
   - 2 GB bandwidth/měsíc
   - Po vyčerpání: upgrade nebo fallback na localStorage

2. **RLS politiky jsou public:**
   - Kdokoliv může uploadovat/mazat
   - Až bude autentizace, politiky zpřísníme

3. **Fallback na localStorage:**
   - Pokud Supabase selže, použije se base64
   - Stále omezeno 5-8 MB

4. **PDF.js load time:**
   - První parse PDF může trvat 1-2 sekundy
   - Loading state by bylo nice-to-have

### Další kroky

- [ ] Implementovat loading state při počítání stran
- [ ] Přidat progress bar při uploadu velkých souborů
- [ ] Zpřísnit RLS politiky po implementaci auth
- [ ] Monitoring Supabase bandwidth usage
- [ ] Error handling pro Supabase quota exceeded
- [ ] Migrace existujících base64 materiálů na Supabase (optional)

### Statistiky

**Instalované balíčky (+2):**
- @supabase/supabase-js (Supabase client)
- pdfjs-dist (PDF parsing)

**Nové funkce:**
- sanitizeFilename() - transliterace + sanitizace
- getPdfPageCount() - parsing PDF
- estimateTextPageCount() - odhad stran
- formatPageCount() - česká pluralizace
- uploadFileToSupabase() - upload s čitelným názvem
- deleteFileFromSupabase() - cleanup
- isSupabaseConfigured() - check credentials

**Upravené komponenty:**
- AddMaterialModal (edit mode, Supabase, fileName, pageCount)
- MaterialCard (UI redesign, async delete, fileName display)
- storage.js (async deleteMaterial)

---

**Sprint 6 dokončen**: 27. října 2025
**Implementoval**: Claude + Lenka
**Status**: ✅ Funkční, testováno s Supabase Storage
**Deployment**: Vyžaduje restart dev serveru po instalaci dependencies

---

## 🔗 Sprint 6.5: YouTube Metadata & Google Drive Embeds (27. října 2025)

### Motivace

Po implementaci Supabase Storage a základní podpory pro externí odkazy (Sprint 5-6) jsme zjistili další potřeby:
- ❌ YouTube linky nezobrazovaly délku videa
- ❌ U YouTube materiálů se zobrazovala nula za časem ("0:41 • 0")
- ❌ Google Drive dokumenty neměly embed podporu
- ❌ Chyběla metadata pro klientky (aby viděly, jak dlouhé je video)

### Co bylo implementováno

#### 1. YouTube Data API v3 integrace

**Problém:**
Uživatel očekával, že YouTube odkazy budou automaticky stahovat metadata (délku videa, název), ale to nebylo implementováno.

**Řešení:**
Implementace YouTube Data API v3 s fallbackem na oEmbed API.

**`.env.example` - nová konfigurace:**
```env
# YouTube API Configuration (Optional)
# If set, enables fetching video duration for YouTube links
# Get your API key from https://console.cloud.google.com/apis/credentials

VITE_YOUTUBE_API_KEY=your-youtube-api-key-here
```

**`linkDetection.js` - nové funkce:**

```javascript
// Parsování ISO 8601 duration (PT1H2M10S → sekundy)
const parseISO8601Duration = (duration) => {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return null;
  const hours = parseInt(match[1] || 0);
  const minutes = parseInt(match[2] || 0);
  const seconds = parseInt(match[3] || 0);
  return hours * 3600 + minutes * 60 + seconds;
};

// Získání metadat z YouTube
export const getYouTubeMetadata = async (url) => {
  const videoId = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^&\s?]+)/)?.[1];
  if (!videoId) return { duration: null, title: null };

  // Zkus YouTube Data API v3 pokud je API klíč
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
  if (apiKey && apiKey !== 'your-youtube-api-key-here') {
    try {
      const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${videoId}&key=${apiKey}`;
      const apiResponse = await fetch(apiUrl);
      if (apiResponse.ok) {
        const apiData = await apiResponse.json();
        if (apiData.items && apiData.items.length > 0) {
          const video = apiData.items[0];
          const duration = parseISO8601Duration(video.contentDetails.duration);
          return { duration, title: video.snippet.title || null };
        }
      }
    } catch (error) {
      console.warn('YouTube Data API failed, falling back to oEmbed:', error);
    }
  }

  // Fallback na oEmbed API (bez duration)
  const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
  const response = await fetch(oembedUrl);
  if (!response.ok) return { duration: null, title: null };
  const data = await response.json();
  return { duration: null, title: data.title || null };
};
```

**`AddMaterialModal.jsx` - integrace:**
```javascript
// Pokus se získat metadata (jen pro YouTube)
if (detected.type === 'youtube') {
  thumbnail = getThumbnailUrl(linkUrl, detected.type);

  try {
    const metadata = await getYouTubeMetadata(linkUrl);
    if (metadata.duration) {
      duration = metadata.duration; // Uložit duration do materiálu
    }
  } catch (error) {
    console.warn('Failed to fetch YouTube metadata:', error);
  }
}
```

**Výhody:**
- ✅ Délka YouTube videa se automaticky získá při přidání odkazu
- ✅ Fallback na oEmbed API pokud není API klíč
- ✅ Zobrazení délky na kartě materiálu
- ✅ Klientky vidí, jak dlouhé je video (např. "5:23")

**Legální a bezpečnostní aspekty:**
- ✅ YouTube Data API v3 je oficiální a zcela legální
- ✅ Free tier: 10,000 requests/den
- ✅ Pouze čtení metadat (ne stahování videí)
- ✅ API klíč v `.env` (ne hardcoded)
- ✅ Doporučení: nový Google Cloud projekt "CoachPro"

#### 2. Oprava zobrazení "nuly" za časem

**Problém:**
U YouTube materiálů se zobrazovala nula za časem: "0:41 • 0"

**Příčina:**
- `formatFileSize(0)` vracel `"0 B"` místo prázdného stringu
- `fileSize` byl inicializován jako `0` místo `null` v AddMaterialModal

**Řešení:**

**`helpers.js` - oprava formatFileSize:**
```javascript
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return ''; // ← Vrátit prázdný string místo "0 B"
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};
```

**`AddMaterialModal.jsx` - oprava inicializace:**
```javascript
// Před:
let fileSize = 0;

// Po:
let fileSize = null;
```

**Také v editaci:**
```javascript
// Před:
fileSize = editMaterial.fileSize || 0;

// Po:
fileSize = editMaterial.fileSize || null;
```

**Výsledek:**
- ✅ "0:41 • 0" → "0:41" (nula zmizela)
- ✅ Metadata se zobrazí jen když existují (duration, pageCount, fileSize)
- ✅ Prázdné hodnoty se neskrývají za "0"

#### 3. Google Drive embed podpora

**Problém:**
Google Drive dokumenty (Docs, Sheets, Slides) se nezobrazovaly v náhledu - jen tlačítko "Otevřít".

**Řešení:**
Implementace embed URL generování pro Google služby.

**`linkDetection.js` - rozšíření:**
```javascript
// Změna embedSupport na true
if (lowerUrl.includes('drive.google.com') || lowerUrl.includes('docs.google.com')) {
  return {
    type: 'google-drive',
    icon: '📁',
    label: 'Google Drive',
    color: '#4285f4',
    embedSupport: true // ← Změněno z false
  };
}
```

**`getEmbedUrl()` - nové case:**
```javascript
case 'google-drive': {
  // Google Docs: .../document/d/DOCUMENT_ID/edit → /preview
  const docMatch = url.match(/docs\.google\.com\/document\/d\/([a-zA-Z0-9_-]+)/);
  if (docMatch) {
    return `https://docs.google.com/document/d/${docMatch[1]}/preview`;
  }

  // Google Sheets: .../spreadsheets/d/SPREADSHEET_ID/edit → /preview
  const sheetMatch = url.match(/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
  if (sheetMatch) {
    return `https://docs.google.com/spreadsheets/d/${sheetMatch[1]}/preview`;
  }

  // Google Slides: .../presentation/d/PRESENTATION_ID/edit → /preview
  const slideMatch = url.match(/docs\.google\.com\/presentation\/d\/([a-zA-Z0-9_-]+)/);
  if (slideMatch) {
    return `https://docs.google.com/presentation/d/${slideMatch[1]}/preview`;
  }

  // Google Drive files: .../file/d/FILE_ID/view → /preview
  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveMatch) {
    return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
  }

  return null;
}
```

**`PreviewModal.jsx` - rendering:**
```jsx
{/* Google Drive embed */}
{material.linkType === 'google-drive' && (() => {
  const embedUrl = getEmbedUrl(material.content, 'google-drive');

  return embedUrl ? (
    <Box sx={{ borderRadius: 3, overflow: 'hidden', height: '600px' }}>
      <iframe
        src={embedUrl}
        width="100%"
        height="100%"
        frameBorder="0"
        title={material.title}
      />
    </Box>
  ) : (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Button
        variant="contained"
        href={material.content}
        target="_blank"
        sx={{ bgcolor: '#4285f4' }}
      >
        Otevřít Google Drive
      </Button>
    </Box>
  );
})()}
```

**Podporované formáty:**
- ✅ Google Docs (textové dokumenty)
- ✅ Google Sheets (tabulky)
- ✅ Google Slides (prezentace)
- ✅ Google Drive files (PDF, obrázky, atd.)

**Poznámka:**
Některé Google Drive soubory můžou mít omezené sdílení. Pro funkční embed musí být dokument nastaven jako "Kdokoli s odkazem může zobrazit".

#### 4. Konfuze kolem formátování času

**Situace:**
Uživatel řekl "ta nula tam nemá být" u "0:41", myslel tím nulu ZA časem ("0:41 • 0"), ne v samotném čase.

**Co se stalo:**
- Chybně jsem upravil `formatDuration()` aby vracel "41s" místo "0:41"
- Uživatel řekl "nene, toto vrať, bylo to dobře"
- Vrátil jsem `formatDuration()` na původní verzi

**Konečný stav:**
```javascript
export const formatDuration = (seconds) => {
  if (!seconds || seconds < 0) return '0s';

  // Pro videa delší než hodina - HH:MM:SS
  if (seconds >= 3600) {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  // Pro videa kratší než hodina - MM:SS
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`; // ← Zachováno "0:41" formát
};
```

### Implementované služby - přehled

**Služby s embed podporou (7):**
- ✅ YouTube (včetně Shorts)
- ✅ Vimeo
- ✅ Spotify
- ✅ SoundCloud
- ✅ Instagram
- ✅ Google Drive (Docs, Sheets, Slides) ← NOVĚ PŘIDÁNO

**Služby bez embed (5 + generic):**
- ❌ iCloud (otevře v novém okně)
- ❌ Dropbox (otevře v novém okně)
- ❌ OneDrive (otevře v novém okně)
- ❌ Canva (otevře v novém okně)
- ❌ Notion (otevře v novém okně)
- ❌ Generic (jakýkoliv jiný odkaz)

### Testování

**YouTube s API klíčem:**
1. Přidat API klíč do `.env`
2. Restartovat dev server
3. Přidat nový YouTube materiál
4. Délka videa se automaticky stáhne z API
5. Zobrazí se na kartě (např. "5:23")

**YouTube bez API klíče:**
1. Funguje fallback na oEmbed API
2. Stáhne se název videa, ale ne délka
3. Délka zůstane prázdná

**Google Drive Docs:**
1. Vytvořit Google Docs dokument
2. Nastavit sdílení: "Kdokoli s odkazem může zobrazit"
3. Zkopírovat URL (např. `https://docs.google.com/document/d/XXX/edit`)
4. Přidat jako materiál v CoachPro
5. Náhled zobrazí dokument v iframe

### Opravené chyby

1. **Nula za časem ("0:41 • 0")**
   - `formatFileSize(0)` vracel "0 B" → prázdný string
   - `fileSize` inicializován jako 0 → null

2. **YouTube metadata chyběla**
   - Implementace YouTube Data API v3
   - Fallback na oEmbed API

3. **Google Drive neměl embed**
   - Přidána embed URL generace pro Docs/Sheets/Slides
   - Změněno `embedSupport: false` → `true`

### Změny v souborech

**Upravené soubory:**
- `.env.example` - YouTube API key konfigurace
- `linkDetection.js` - YouTube metadata, Google Drive embed, parseISO8601Duration
- `AddMaterialModal.jsx` - YouTube metadata fetch
- `PreviewModal.jsx` - Google Drive embed rendering
- `helpers.js` - formatFileSize oprava (prázdný string pro 0)

### Známé limitace

1. **YouTube API quota:**
   - Free tier: 10,000 requests/den
   - Každý request = 1 request (get video details)
   - Při vyčerpání: fallback na oEmbed (bez duration)

2. **Google Drive embeds:**
   - Vyžaduje správné nastavení sdílení
   - Soukromé dokumenty se nezobrazí
   - "Kdokoli s odkazem může zobrazit" je nutné

3. **YouTube oEmbed fallback:**
   - Vrací název videa
   - **NE**vrací délku videa
   - Délka zůstane prázdná pokud není API klíč

### TODO pro 2. fázi projektu

**Další služby k implementaci (embedy):**
- [ ] Loom (video nahrávky/screenshare - populární u koučů)
- [ ] Typeform (formuláře/kvízy)
- [ ] Figma (design mockupy)
- [ ] Miro (whiteboardy/brainstorming)
- [ ] Canva (prezentace - už máme detekci)
- [ ] Notion (dokumenty - už máme detekci)
- [ ] Google Forms (formuláře)
- [ ] Trello (project boards)
- [ ] Calendly (booking/plánování)
- [ ] Kajabi (online kurzy)
- [ ] Teachable (online kurzy)

**Důležité připomínky pro další vývoj:**
- ⚠️ **Modularita**: Dbát na modulární architekturu pro snadnou integraci do ProApp
- ⚠️ **Společné funkce**: Identifikovat funkce, které budou sdíleny napříč aplikacemi (auth, storage, komponenty)
- ⚠️ **Mazat starý kód**: Při úpravách MAZAT starý kód, ne komentovat (jako v PaymentsPro)
- ⚠️ **Čeština**: Vždy komunikovat česky
- ⚠️ **Path aliases**: Používat @shared, @modules, @assets, @styles místo relativních cest

### Statistiky Sprint 6.5

**Nové funkce (+3):**
- `parseISO8601Duration()` - parsování YouTube duration formátu
- `getYouTubeMetadata()` - fetch metadat z YouTube API/oEmbed
- Google Drive embed URL generation (4 typy dokumentů)

**Opravené funkce:**
- `formatFileSize()` - prázdný string místo "0 B"

**Nová konfigurace:**
- `.env` - `VITE_YOUTUBE_API_KEY`

**Upravené komponenty:**
- `AddMaterialModal.jsx` (YouTube metadata fetch, fileSize null)
- `PreviewModal.jsx` (Google Drive embed rendering)

---

**Sprint 6.5 dokončen**: 27. října 2025
**Implementoval**: Claude + Lenka
**Status**: ✅ Funkční, YouTube metadata & Google Drive embeds fungují
**Poznámka**: Vyžaduje YouTube API klíč v `.env` pro plnou funkcionalitu
