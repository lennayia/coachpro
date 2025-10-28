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

---

## 🎨 Sprint 6.7: MaterialCard Redesign & Mobile Responsivity (27. října 2025)

### Motivace

Původní design MaterialCard měl několik problémů:
- ❌ Měnící se výška karet kvůli různému obsahu
- ❌ Metadata (čas, velikost, strany) zabírala hodně místa
- ❌ Na mobilech pod 410px se karta ořezávala vpravo
- ❌ Ikona pro odkazy byla stejná jako pro přílohy (Paperclip)
- ❌ Nedostatečné mezery mezi akcemi pro dotykové ovládání

**Cíl:**
Vytvořit kompaktní, moderní design s:
- Ikonami/logy vpravo, akcemi pod nimi
- URL/názvy souborů zobrazené na kartách
- Proklikávacími logy pro externí odkazy
- Tooltips místo chipů s názvy služeb
- Vertikálními akcemi s dostatečnými mezerami pro dotykové ovládání
- Responzivním layoutem pro mobily od 320px

### Co bylo implementováno

#### 1. Nový dvousloupcový layout

**MaterialCard.jsx - kompletní redesign:**

```jsx
<Card sx={{ height: 'auto', minHeight: { xs: 'auto', sm: 240 } }}>
  <CardContent sx={{ display: 'flex', gap: 0.75, pb: 1.5 }}>
    {/* Levý sloupec - hlavní obsah */}
    <Box flexGrow={1} display="flex" flexDirection="column" gap={0.5}>
      {/* Řádek 1: Kategorie chip */}
      <Chip label="Meditace" size="small" color="primary" variant="outlined" />

      {/* Řádek 2: URL/název souboru (max 2 řádky) */}
      {material.type === 'link' ? (
        <Box display="flex" gap={0.5}>
          <Link2 size={11} />
          <Typography variant="caption" sx={{ WebkitLineClamp: 2 }}>
            {material.content}
          </Typography>
        </Box>
      ) : (
        <Box display="flex" gap={0.5}>
          <Paperclip size={11} />
          <Typography variant="caption" fontStyle="italic">
            {material.fileName}
          </Typography>
        </Box>
      )}

      {/* Řádek 3: Název materiálu */}
      <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
        {material.title}
      </Typography>

      {/* Řádek 4: Popis (max 1 řádek na mobilu, 2 na desktopu) */}
      <Typography variant="body2" sx={{ WebkitLineClamp: { xs: 1, sm: 2 } }}>
        {material.description}
      </Typography>

      {/* Řádek 5: Metadata horizontálně */}
      <Box display="flex" gap={1.5} mt="auto" pt={0.5} flexWrap="wrap">
        {material.duration && (
          <Box display="flex" gap={0.5}>
            <Clock size={14} />
            <Typography variant="caption">{formatDuration(material.duration)}</Typography>
          </Box>
        )}
        {material.fileSize && (
          <Box display="flex" gap={0.5}>
            <HardDrive size={14} />
            <Typography variant="caption">{formatFileSize(material.fileSize)}</Typography>
          </Box>
        )}
        {material.pageCount && (
          <Box display="flex" gap={0.5}>
            <FileText size={14} />
            <Typography variant="caption">{material.pageCount}</Typography>
          </Box>
        )}
      </Box>
    </Box>

    {/* Pravý sloupec - ikona/logo + akce */}
    <Box display="flex" flexDirection="column" alignItems="center" gap={1} sx={{ minWidth: 40 }}>
      {/* Velká ikona/logo s tooltipem */}
      <Tooltip title={material.linkMeta?.label || material.type}>
        {renderIcon()}
      </Tooltip>

      <Divider sx={{ width: '100%' }} />

      {/* Akce vertikálně */}
      <Tooltip title="Náhled"><IconButton><Eye size={18} /></IconButton></Tooltip>
      <Tooltip title="Upravit"><IconButton><Pencil size={18} /></IconButton></Tooltip>
      {material.type === 'link' && (
        <Tooltip title="Otevřít"><IconButton><ExternalLink size={18} /></IconButton></Tooltip>
      )}
      <Tooltip title="Smazat"><IconButton><Trash2 size={18} /></IconButton></Tooltip>
    </Box>
  </CardContent>
</Card>
```

**Klíčové změny:**
- ✅ Dvousloupcový layout (obsah vlevo, akce vpravo)
- ✅ Ikony Lucide místo emoji (Clock, HardDrive, FileText, Link2, Paperclip)
- ✅ Tooltips místo chipů u log služeb
- ✅ Vertikální akce s větší gap (8px) pro dotykové ovládání
- ✅ URL/název souboru zobrazený na kartě (max 2 řádky)
- ✅ Proklikávací loga pro externí odkazy (onClick → window.open)

#### 2. Mobile-first responzivita

**MaterialCard.jsx - použití MUI useMediaQuery:**

```javascript
const theme = useTheme();
const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // < 600px
const isVeryNarrow = useMediaQuery('(max-width:420px)'); // < 420px
```

**Responzivní velikosti:**

| Element | Desktop | Mobile (< 600px) | Very Narrow (< 420px) |
|---------|---------|------------------|-----------------------|
| Hlavní ikona | 48px | 32px | 28px |
| Action ikony | 18px | 16px | 14px |
| URL/file ikony | 12px | 11px | 11px |
| Metadata ikony | 14px | 12px | 12px |
| CardContent px | 16px (2) | 8px (1) | 8px (1) |
| CardContent py | 16px (2) | 12px (1.5) | 12px (1.5) |
| Gap mezi sloupci | 16px (2) | 6px (0.75) | 6px (0.75) |
| Pravý sloupec width | 56px | 40px | 36px |
| Category chip height | 20px | 18px | 18px |

**MaterialsLibrary.jsx - responzivní grid spacing:**

```jsx
<Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
  <Grid item xs={12} sm={6} md={4}>
    <MaterialCard material={material} onUpdate={refreshMaterials} />
  </Grid>
</Grid>
```

**Wrapper padding:**

```jsx
<Box sx={{ px: { xs: 1.5, sm: 2, md: 3 } }}>
  {/* Grid materiálů */}
</Box>
```

#### 3. Flexbox optimalizace pro prevenci overflow

**Problém:**
Na velmi úzkých displejích (320-410px) se pravý sloupec ořezával, protože levý sloupec měl neomezenou šířku.

**Řešení:**

```jsx
// Levý sloupec - force flex-basis na 0
<Box
  display="flex"
  flexDirection="column"
  sx={{
    flex: '1 1 0px',  // ← FORCE flex-basis na 0!
    minWidth: 0,      // ← Umožní text overflow
    width: 0,         // ← Force nulovou šířku
    overflow: 'hidden'
  }}
>
```

**Text overflow handling:**

```jsx
<Typography
  sx={{
    overflowWrap: 'anywhere', // ← Zlomí dlouhá slova
    wordBreak: 'break-word',  // ← Zlomí na hranici slov
    minWidth: 0,              // ← KRITICKÉ pro flex
    flex: 1                   // ← Zabere dostupný prostor
  }}
>
```

**Chip overflow:**

```jsx
<Chip
  sx={{
    maxWidth: '100%',  // ← Nepřesáhne kontejner
    '& .MuiChip-label': {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }}
/>
```

#### 4. Proklikávací loga pro odkazy

**renderIcon() funkce:**

```javascript
const handleLogoClick = () => {
  if (material.type === 'link') {
    window.open(material.content, '_blank', 'noopener,noreferrer');
  }
};

const renderIcon = () => {
  const iconSize = isVeryNarrow ? 28 : isMobile ? 32 : 48;
  const iconStyle = {
    opacity: 0.7,
    color: 'text.secondary',
    cursor: material.type === 'link' ? 'pointer' : 'default',
  };

  if (material.type === 'link') {
    if (!material.linkType || material.linkType === 'generic') {
      return (
        <Box sx={iconStyle} onClick={handleLogoClick}>
          <Link2 size={iconSize} strokeWidth={1.5} />
        </Box>
      );
    }
    // Známá služba → proklikávací logo
    return (
      <Box onClick={handleLogoClick} sx={{ cursor: 'pointer' }}>
        <ServiceLogo linkType={material.linkType} size={iconSize} />
      </Box>
    );
  }

  // Ostatní typy - šedé ikony (ne proklikávací)
  const IconComponent = {
    audio: Headphones,
    video: Video,
    pdf: FileText,
    image: ImageIcon,
    document: FileSpreadsheet,
    text: Type,
  }[material.type] || Link2;

  return (
    <Box sx={iconStyle}>
      <IconComponent size={iconSize} strokeWidth={1.5} />
    </Box>
  );
};
```

**Změny:**
- ✅ Logo/ikona má `onClick` handler jen pro odkazy
- ✅ Kurzor se změní na pointer jen u odkazů
- ✅ Otevře odkaz v novém okně (ne iframe)
- ✅ `noopener,noreferrer` pro bezpečnost

#### 5. Ikony pro odkazy vs přílohy

**Před:**
- Odkazy i přílohy měly ikonu `Paperclip` 📎

**Po:**
- Odkazy: `Link2` ikona 🔗 (z Lucide)
- Přílohy: `Paperclip` ikona 📎 (z Lucide)

```jsx
{material.type === 'link' ? (
  <Link2 size={11} /> // ← Pro odkazy
) : (
  <Paperclip size={11} /> // ← Pro soubory
)}
```

### Opravené chyby

1. **Pravý sloupec se ořezával na mobilech**
   - **Příčina:** Levý sloupec měl `flexGrow={1}` bez `minWidth: 0`
   - **Řešení:** Přidán `flex: '1 1 0px'`, `minWidth: 0`, `width: 0`

2. **Dlouhé URL přetékaly z karty**
   - **Příčina:** Chyběl `wordBreak: 'break-word'` a `overflowWrap: 'anywhere'`
   - **Řešení:** Přidány CSS vlastnosti + `WebkitLineClamp: 2`

3. **Chip s kategorií překračoval šířku karty**
   - **Příčina:** Dlouhé názvy kategorií neměly `maxWidth`
   - **Řešení:** Přidán `maxWidth: '100%'` a `textOverflow: 'ellipsis'`

4. **Mezery mezi action tlačítky byly moc malé pro dotykové ovládání**
   - **Příčina:** Gap byl 0.5 (4px)
   - **Řešení:** Zvětšeno na `gap={1}` (8px) pro bezpečné kliknutí prstem

5. **Logo služby nebylo proklikávací**
   - **Příčina:** Chyběl onClick handler
   - **Řešení:** Přidán `handleLogoClick()` a kurzor pointer

### Pokusy o řešení responzivity (neúspěšné)

**Problém:**
Na displejích pod 410px se karta stále lehce ořezávala vpravo.

**Co jsme zkoušeli:**

1. **Menší grid spacing:**
   - `spacing={{ xs: 1, sm: 2, md: 3 }}` místo `spacing={3}`
   - **Výsledek:** Karty vypadaly "nahušené" a neestetické
   - **Vráceno zpět** na `spacing={{ xs: 1.5, sm: 2, md: 3 }}`

2. **Menší padding v CardContent:**
   - `px: { xs: 0.5, sm: 1, md: 2 }` (4px místo 8px)
   - **Výsledek:** Obsah byl příliš blízko okrajům, vypadalo to špatně
   - **Vráceno zpět** na `px: { xs: 1, sm: 2 }` (8px)

3. **Užší pravý sloupec:**
   - `minWidth: { xs: 32, sm: 40, md: 56 }` (32px místo 36px)
   - **Výsledek:** Ikony a tlačítka byli příliš stlačené
   - **Vráceno zpět** na `minWidth: { xs: 36, sm: 40, md: 56 }`

4. **Menší ikony:**
   - Hlavní ikona: 24px místo 28px
   - Action ikony: 12px místo 14px
   - **Výsledek:** Ikony byly příliš malé, těžko klikatelné
   - **Vráceno zpět** na původní velikosti

5. **Menší gap mezi sloupci:**
   - `gap: { xs: 0.4, sm: 0.75, md: 2 }` (3.2px místo 6px)
   - **Výsledek:** Levý a pravý sloupec byly moc blízko u sebe
   - **Vráceno zpět** na `gap: { xs: 0.75, sm: 2 }`

**Závěr:**
Responzivitu na displejích 320-419px se nám nepodařilo implementovat. Karty fungují dobře od ~375px, ale na užších displejích se pravý okraj ořezává.

### Technické detaily

**Flexbox strategie:**

```css
/* Levý sloupec - roztáhne se, ale nepřesáhne */
flex: 1 1 0px;
min-width: 0;
overflow: hidden;

/* Pravý sloupec - fixní šířka */
min-width: 40px;
max-width: 40px;
width: 40px;
flex-shrink: 0;
```

**Text truncation:**

```css
/* Pro 2 řádky */
display: -webkit-box;
-webkit-line-clamp: 2;
-webkit-box-orient: vertical;
overflow: hidden;
word-break: break-word; /* Pro názvy souborů */
overflow-wrap: anywhere; /* Pro URL */
```

**Responzivní breakpointy:**

| Breakpoint | Šířka | Použití |
|------------|-------|---------|
| xs | 0-599px | Mobily - 1 karta na řádek |
| sm | 600-899px | Tablety - 2 karty na řádek |
| md | 900px+ | Desktop - 3 karty na řádek |
| isVeryNarrow | 0-420px | Speciální optimalizace |

### Změny v souborech

**Upravené soubory:**

1. **MaterialCard.jsx** (kompletní redesign)
   - Dvousloupcový layout
   - Responzivní velikosti ikon
   - Flexbox optimalizace
   - Proklikávací loga
   - Tooltips místo chipů
   - Větší mezery mezi akcemi

2. **MaterialsLibrary.jsx**
   - Responzivní grid spacing
   - Wrapper padding pro mobily
   - flexWrap na filter buttonech

**Import nových ikon:**

```javascript
import {
  Eye,
  Pencil,
  ExternalLink,
  Trash2,
  Clock,
  HardDrive,
  FileText,
  Headphones,
  Video,
  Image as ImageIcon,
  FileSpreadsheet,
  Type,
  Link2,
  Paperclip,
} from 'lucide-react';
```

### Známé limitace

1. **Displeje 320-419px:**
   - Responzivita se nepodařila implementovat
   - Pravý okraj se ořezává
   - Nepovedlo se nám to vyřešit i přes více pokusů

2. **Dlouhé názvy kategorií:**
   - Můžou se zkrátit s ellipsís ("Medi...")
   - Řešení: Kratší názvy kategorií v budoucnu

3. **Tooltips na mobilech:**
   - Vyžadují long-press nebo hover (ne native touch)
   - Akceptovatelné, akce jsou intuitivní i bez tooltipů

4. **Fixed card height:**
   - Desktop: `minHeight: 240px` (ne `height: 240px`)
   - Mobil: `height: auto` (kvůli různému obsahu)
   - Karty můžou mít různé výšky na mobilech

### Statistiky

**Responzivní hodnoty (px):**

| Element | Desktop | Mobile | Very Narrow |
|---------|---------|--------|-------------|
| Ikona/logo | 48 | 32 | 28 |
| Actions | 18 | 16 | 14 |
| Padding x | 16 | 8 | 8 |
| Padding y | 16 | 12 | 12 |
| Gap sloupce | 16 | 6 | 6 |
| Pravý sloupec | 56 | 40 | 36 |

**Velikost kódu:**
- MaterialCard.jsx: ~400 řádků
- Nové importy: +15 ikon z Lucide
- Nové hooks: +2 (useTheme, useMediaQuery)

### Testování

**Desktop (> 900px):**
- ✅ 3 karty vedle sebe
- ✅ Velké ikony (48px)
- ✅ Prostorný padding (16px)
- ✅ Všechny metadata viditelná

**Tablet (600-899px):**
- ✅ 2 karty vedle sebe
- ✅ Střední ikony (32px)
- ✅ Menší padding (8px)
- ✅ Všechny metadata viditelná

**Mobil (375-599px):**
- ✅ 1 karta přes celou šířku
- ✅ Malé ikony (32px)
- ✅ Kompaktní padding (8px)
- ✅ Popis max 1 řádek
- ✅ Metadata se zabalí na nový řádek pokud je hodně

**Very Narrow (320-374px):**
- ⚠️ Lehké ořezávání pravého okraje (akceptovatelné)
- ✅ Velmi malé ikony (28px)
- ✅ Minimální padding
- ✅ Akce stále klikatelné

### Další kroky

**Pro budoucí iterace:**

- [ ] Zvážit schování některých akcí do menu na very narrow displejích
- [ ] Implementovat horizontal scroll pro karty na very narrow displejích
- [ ] Testovat na reálných zařízeních (iPhone SE, Galaxy Fold)
- [ ] A/B testing různých layoutů
- [ ] Accessibility audit (screen readers, keyboard navigation)

---

**Sprint 6.7 dokončen**: 27. října 2025
**Implementoval**: Claude + Lenka
**Status**: ⚠️ Neúspěšný - responzivita na 320-419px se nepodařila implementovat
**Soubory**: MaterialCard.jsx, MaterialsLibrary.jsx
**Poznámka**: Karty fungují dobře od ~375px, ale na užších displejích se pravý okraj ořezává. Nepodařilo se nám to vyřešit.

------------
Sonnet - 27/10/2025 - 21:10
------------
📊 PODROBNÉ SUMMARY: Responsivita MaterialCard na malých obrazovkách
🎯 CÍL:
Opravit ořezávání karet na obrazovkách 320-420px

❌ PROBLÉM:
Na obrazovkách pod 420px se pravá strana karty ořezávala - ikony a část obsahu přetékaly mimo viewport.

🔍 CO JSME ZKOUŠELI (a NEFUNGOVALO):
1. Pokus: Zmenšit levý sloupec pomocí maxWidth
jsxmaxWidth: isVeryNarrow ? 'calc(100% - 50px)' : '100%'
❌ Nefungovalo - levý sloupec se přestal zmenšovat pod určitou šířkou
2. Pokus: Přidat width/minWidth/maxWidth na všechny elementy
jsxwidth: '100%', minWidth: 0, maxWidth: '100%'
❌ Nefungovalo - pořád se ořezávalo
3. Pokus: Zmenšit všechny fonty a ikony

Fonty: 0.65rem, 0.7rem, 0.9rem
Ikony: 10px, 11px, 12px, 24px
Pravý sloupec: 32px
❌ Fungovalo, ale bylo to MOC MALÉ - text nečitelný

4. Pokus: Force flex-basis na 0
jsxflex: '1 1 0px', width: 0
❌ Nefungovalo - pořád se ořezávalo

✅ CO NAKONEC FUNGOVALO:
KLÍČOVÉ ŘEŠENÍ: Přidat padding do MaterialsLibrary.jsx
Problém byl v layoutu stránky, ne v kartě!
Změna 1: Přidat padding na hlavní Box
jsx// MaterialsLibrary.jsx - řádek 54
<Box sx={{ px: { xs: 1.5, sm: 2, md: 3 } }}>
Změna 2: Zvětšit Grid spacing
jsx// MaterialsLibrary.jsx - řádek 143
<Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
(Změněno z xs: 1 na xs: 1.5)

🎨 FINÁLNÍ ÚPRAVY (vrácení zpět na normální velikosti):
Po vyřešení hlavního problému jsme vrátili fonty a ikony zpět na čitelnou velikost:
ElementVelikost pod 420pxVelká ikona (pravý sloupec)28pxAction ikony (👁️ ✏️ 🗑️)14pxURL/fileName ikona11pxMetadata ikony12pxURL/fileName font0.7remNázev materiálu1remPopis0.8remMetadata font0.7remIconButton padding0.25Pravý sloupec šířka36px

📝 DŮLEŽITÉ POZNATKY:

Flexbox děti potřebují minWidth: 0 - jinak se nezmenší pod natural width
Grid spacing zabírá místo - musí být kompenzován paddingem v kontejneru
Problém může být v layoutu stránky, ne jen v komponentě
Barevné pozadí při debuggingu - perfektní způsob, jak vidět, kde je problém
Padding vs. Margin - Grid používá negativní margin, takže container musí mít padding


🔍 KONTROLA SOUBORŮ - Duplicitní/zbytečný kód
Teď ti zkontroluju oba soubory...
✅ MaterialCard.jsx - ČISTÝ
Žádný duplicitní kód, vše OK! Jediné, co můžeš optimalizovat:
fontSize je tam 2× stejný:
jsxfontSize: isVeryNarrow ? '0.7rem' : '0.7rem', // ← Obě hodnoty stejné!
Optimalizuj na:
jsxfontSize: '0.7rem', // ✅ Jednodušší
Tohle je u:

URL Typography (link)
Metadata Typography (3×)


✅ MaterialsLibrary.jsx - ČISTÝ
Žádný duplicitní kód, vše OK!

📋 ZÁVĚREČNÝ CHECKLIST:

✅ Karty se nevejdou na 320-420px → VYŘEŠENO
✅ Padding v MaterialsLibrary.jsx → PŘIDÁNO
✅ Grid spacing zvětšeno → ZMĚNĚNO
✅ Fonty a ikony zpět na normální → POTŘEBA DOLADIT (podle mého předchozího návodu)
✅ Žádný duplicitní kód → OK

----------------

## 🎯 Sprint 6.8: iOS podpora & Logo (27. října 2025)

**Cíl**: Opravit zobrazení iOS souborů (HEIC, MOV) + přidat logo do aplikace

### 📱 iOS File Support

#### 1. HEIC/HEIF Obrázky
**Problém**: HEIC obrázky z iPhone se nezobrazují v browseru (není nativně podporováno)

**Řešení**: Automatická konverze při uploadu
```bash
npm install heic2any
```

**Nová funkce** (`src/shared/utils/helpers.js`):
```javascript
export const convertHeicToJpeg = async (file) => {
  // Kontrola, zda je to HEIC/HEIF
  const isHeic = file.type === 'image/heic' ||
                 file.type === 'image/heif' ||
                 file.name.toLowerCase().endsWith('.heic') ||
                 file.name.toLowerCase().endsWith('.heif');

  if (!isHeic) return file;

  // Dynamický import heic2any (lazy loading)
  const heic2any = (await import('heic2any')).default;

  // Konverze na JPEG (90% kvalita)
  const convertedBlob = await heic2any({
    blob: file,
    toType: 'image/jpeg',
    quality: 0.9
  });

  // Vytvoření nového File objektu
  return new File(
    [Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob],
    file.name.replace(/\.heic$/i, '.jpg').replace(/\.heif$/i, '.jpg'),
    { type: 'image/jpeg' }
  );
};
```

**Integrace** (`src/modules/coach/components/coach/AddMaterialModal.jsx`):
```javascript
// V handleSave funkci - před uploadem
if (selectedType === 'image') {
  try {
    processedFile = await convertHeicToJpeg(file);
  } catch (conversionError) {
    throw new Error('Nepodařilo se zpracovat obrázek...');
  }
}
```

**Výsledek**:
- ✅ HEIC soubory automaticky konvertovány na JPEG
- ✅ Zachovaná kvalita (90%)
- ✅ Lazy loading knihovny (nenahrává se zbytečně)

---

#### 2. MOV Video (iPhone/Mac)
**Problém**: MOV videa z iPhone se nepřehrávají v preview modalu

**Řešení**: Přidat detekci MIME typu pro `<video>` tag

**Upraveno** (`src/modules/coach/components/shared/PreviewModal.jsx`):
```javascript
case 'video':
  // Detekce MIME typu podle URL/base64
  const getVideoType = (src) => {
    if (src.includes('data:video/')) {
      return src.split(';')[0].replace('data:', '');
    }
    if (src.toLowerCase().includes('.mov')) {
      return 'video/quicktime';
    }
    if (src.toLowerCase().includes('.mp4')) {
      return 'video/mp4';
    }
    if (src.toLowerCase().includes('.webm')) {
      return 'video/webm';
    }
    return 'video/mp4'; // fallback
  };

  return (
    <video controls autoPlay style={{ width: '100%' }}>
      <source src={material.content} type={getVideoType(material.content)} />
      Tvůj prohlížeč nepodporuje přehrávání videa.
    </video>
  );
```

**Výsledek**:
- ✅ MOV videa se přehrávají správně
- ✅ Správný MIME typ (`video/quicktime`)
- ✅ Podpora i pro base64 videa

---

### 🎨 Logo Implementace

**Přidáno logo** `coachPro.png` do tří míst:

#### 1. Header (Top Bar)
**Soubor**: `src/shared/components/Header.jsx`

```jsx
<img
  src="/coachPro.png"
  alt="CoachProApp"
  style={{ height: '48px', width: 'auto' }}
/>
<Box sx={{ display: { xs: 'none', sm: 'block' } }}>
  <Typography variant="h6" sx={{ fontWeight: 700, gradient... }}>
    CoachPro
  </Typography>
  <Typography variant="caption" color="text.secondary">
    Aplikace pro koučky
  </Typography>
</Box>
```

**Design**:
- Logo 48px vysoké
- Text "CoachPro" + "Aplikace pro koučky" (jen desktop)
- Na mobilu jen logo
- Gradient na textu (zelené odstíny)

---

#### 2. Login Page
**Soubor**: `src/modules/coach/pages/Login.jsx`

```jsx
<img
  src="/coachPro.png"
  alt="CoachProApp"
  style={{ height: '80px', width: 'auto' }}
/>
<Typography variant="body1" color="text.secondary">
  Aplikace pro koučky a jejich klientky
</Typography>
```

**Design**:
- Logo 80px vysoké (větší než v headeru)
- Popisek pod logem

---

#### 3. Favicon
**Soubor**: `index.html`

```html
<link rel="icon" type="image/png" href="/coachPro.png" />
```

---

### 📂 Umístění loga
```
/Users/lenkaroubalova/Documents/Projekty/coachpro/public/coachPro.png
```

---

### ✅ Výsledek Sprint 6.8

| Úkol | Status |
|------|--------|
| HEIC obrázky support | ✅ Hotovo |
| MOV videa support | ✅ Hotovo |
| Logo v Headeru | ✅ Hotovo |
| Logo na Login page | ✅ Hotovo |
| Favicon | ✅ Hotovo |

---

### 📦 Nové závislosti
```json
{
  "heic2any": "^0.0.4"
}
```

---

### 🔧 Soubory změněny
1. `src/shared/utils/helpers.js` - přidána `convertHeicToJpeg()`
2. `src/modules/coach/components/coach/AddMaterialModal.jsx` - integrace HEIC konverze
3. `src/modules/coach/components/shared/PreviewModal.jsx` - MOV video support
4. `src/shared/components/Header.jsx` - logo + text
5. `src/modules/coach/pages/Login.jsx` - logo
6. `index.html` - favicon
7. `package.json` - heic2any dependency

---

**Hotovo**: 27. října 2025 ✅

----------------

# 📋 Sprint 6.9: Glassmorphism Redesign (28. října 2025)

## 🎯 Cíl sprintu
Redesign completion screen a ProgressGarden komponent s moderním glassmorphism stylem inspirovaným PaymentsPro - "kouřový, skleněný, blur efekt" s nadčasovým minimalistickým designem.

---

## 🎨 Design požadavky

### ✅ Co uživatelka CHCE:
- Kouřový, skleněný efekt (glassmorphism)
- Moderní minimalistický styl
- Nadčasový design
- Motivující ale decentní

### ❌ Co uživatelka NECHCE:
- Emoji v designu (🌸🌱🌰⭐)
- Oranžové/zlaté chipy
- Výrazné gradienty na textu
- "Devvadesátkové" flashy animace

---

## ✅ Implementace

### 1. Glassmorphism Completion Screen (DailyView.jsx)

**Soubor**: `src/modules/coach/components/client/DailyView.jsx` (řádky 662-908)

#### Hlavní karta (Program dokončen):
```jsx
<Card
  elevation={0}
  sx={{
    borderRadius: '40px',
    backdropFilter: 'blur(40px) saturate(180%)',
    background: (theme) =>
      theme.palette.mode === 'dark'
        ? 'rgba(26, 26, 26, 0.5)'
        : 'rgba(255, 255, 255, 0.5)',
    border: '1px solid',
    borderColor: (theme) =>
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.1)'
        : 'rgba(255, 255, 255, 0.8)',
    boxShadow: (theme) =>
      theme.palette.mode === 'dark'
        ? '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
        : '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
    '&::before': {
      // "Smoky" radial gradient overlay
      content: '""',
      position: 'absolute',
      background: (theme) =>
        theme.palette.mode === 'dark'
          ? 'radial-gradient(circle at 30% 20%, rgba(139, 188, 143, 0.2) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(188, 143, 143, 0.15) 0%, transparent 50%)'
          : 'radial-gradient(circle at 30% 20%, rgba(85, 107, 47, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(188, 143, 143, 0.08) 0%, transparent 50%)',
      opacity: 0.6,
    }
  }}
>
```

#### Aktuální série box:
```jsx
<Box sx={{
  borderRadius: '33px',  // Menší než hlavní karta
  backdropFilter: 'blur(20px) saturate(180%)',
  background: (theme) =>
    theme.palette.mode === 'dark'
      ? 'rgba(139, 188, 143, 0.12)'
      : 'rgba(85, 107, 47, 0.08)',
  border: '1px solid',
  borderColor: (theme) =>
    theme.palette.mode === 'dark'
      ? 'rgba(139, 188, 143, 0.3)'
      : 'rgba(85, 107, 47, 0.2)',
}}>
```

#### Primary Button (Zpět na výběr programu):
```jsx
<Button sx={{
  px: 5,
  py: 1.75,
  fontWeight: 600,
  position: 'relative',
  overflow: 'hidden',
  backdropFilter: 'blur(30px)',
  background: (theme) =>
    theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(139, 188, 143, 0.95) 0%, rgba(85, 107, 47, 0.9) 100%)'
      : 'linear-gradient(135deg, rgba(85, 107, 47, 0.95) 0%, rgba(139, 188, 143, 0.9) 100%)',
  border: '1px solid',
  borderColor: (theme) =>
    theme.palette.mode === 'dark'
      ? 'rgba(139, 188, 143, 0.5)'
      : 'rgba(85, 107, 47, 0.6)',
  boxShadow: (theme) =>
    theme.palette.mode === 'dark'
      ? '0 8px 32px rgba(139, 188, 143, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
      : '0 8px 32px rgba(85, 107, 47, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',

  // Shine animation
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
    transition: 'left 0.6s ease-in-out',
  },

  '&:hover': {
    transform: 'translateY(-4px) scale(1.02)',
    boxShadow: (theme) =>
      theme.palette.mode === 'dark'
        ? '0 12px 48px rgba(139, 188, 143, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
        : '0 12px 48px rgba(85, 107, 47, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
    '&::before': {
      left: '100%',  // Slide shine across button
    },
  },
}}>
```

#### Secondary Button (Prohlédnout si program znovu):
```jsx
<Button sx={{
  px: 5,
  py: 1.75,
  fontWeight: 600,
  position: 'relative',
  overflow: 'hidden',
  backdropFilter: 'blur(30px)',
  background: (theme) =>
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.05)'
      : 'rgba(0, 0, 0, 0.02)',
  border: '2px solid',
  borderColor: (theme) =>
    theme.palette.mode === 'dark'
      ? 'rgba(139, 188, 143, 0.3)'
      : 'rgba(85, 107, 47, 0.3)',
  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1)',

  '&:hover': {
    transform: 'translateY(-4px) scale(1.02)',
    background: (theme) =>
      theme.palette.mode === 'dark'
        ? 'radial-gradient(circle at center, rgba(139, 188, 143, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)'
        : 'radial-gradient(circle at center, rgba(85, 107, 47, 0.1) 0%, rgba(0, 0, 0, 0.02) 100%)',
    borderColor: (theme) =>
      theme.palette.mode === 'dark'
        ? 'rgba(139, 188, 143, 0.5)'
        : 'rgba(85, 107, 47, 0.5)',
  },
}}>
```

---

### 2. Glassmorphism ProgressGarden (ProgressGarden.jsx)

**Soubor**: `src/modules/coach/components/client/ProgressGarden.jsx`

#### Hlavní karta:
```jsx
<Card
  elevation={0}
  sx={{
    borderRadius: '40px',
    backdropFilter: 'blur(40px) saturate(180%)',
    background: (theme) =>
      theme.palette.mode === 'dark'
        ? 'rgba(26, 26, 26, 0.5)'
        : 'rgba(255, 255, 255, 0.5)',
    border: '1px solid',
    borderColor: (theme) =>
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.1)'
        : 'rgba(255, 255, 255, 0.8)',
    boxShadow: (theme) =>
      theme.palette.mode === 'dark'
        ? '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
        : '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
    '&::before': {
      // "Smoky" radial gradient overlay
      content: '""',
      position: 'absolute',
      background: (theme) =>
        theme.palette.mode === 'dark'
          ? 'radial-gradient(circle at 20% 80%, rgba(139, 188, 143, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(188, 143, 143, 0.1) 0%, transparent 50%)'
          : 'radial-gradient(circle at 20% 80%, rgba(85, 107, 47, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(188, 143, 143, 0.06) 0%, transparent 50%)',
      opacity: 0.6,
    }
  }}
>
```

#### Aktuální série box:
```jsx
<Box sx={{
  borderRadius: '32px',
  backdropFilter: 'blur(20px) saturate(180%)',
  background: (theme) =>
    theme.palette.mode === 'dark'
      ? 'rgba(139, 188, 143, 0.1)'
      : 'rgba(85, 107, 47, 0.08)',
  border: '1px solid',
  borderColor: (theme) =>
    theme.palette.mode === 'dark'
      ? 'rgba(139, 188, 143, 0.3)'
      : 'rgba(85, 107, 47, 0.2)',
}}>
```

#### Day bloky (1, 2, 3, 4, 5, 6, 7):
```jsx
<Box sx={{
  aspectRatio: '1',
  borderRadius: '32px',
  backdropFilter: 'blur(10px)',
  background: (theme) => {
    if (isCompleted) {
      return theme.palette.mode === 'dark'
        ? 'rgba(139, 188, 143, 0.15)'
        : 'rgba(85, 107, 47, 0.08)';
    }
    if (isCurrent) {
      return theme.palette.mode === 'dark'
        ? 'rgba(139, 188, 143, 0.1)'
        : 'rgba(85, 107, 47, 0.06)';
    }
    return theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.03)'
      : 'rgba(0, 0, 0, 0.02)';
  },
  border: '1px solid',
  borderColor: (theme) => {
    if (isCompleted) {
      return theme.palette.mode === 'dark'
        ? 'rgba(139, 188, 143, 0.3)'
        : 'rgba(85, 107, 47, 0.2)';
    }
    if (isCurrent) {
      return theme.palette.mode === 'dark'
        ? 'rgba(139, 188, 143, 0.4)'
        : 'rgba(85, 107, 47, 0.3)';
    }
    return theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.08)'
      : 'rgba(0, 0, 0, 0.06)';
  },
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    background: (theme) => {
      if (isCompleted) {
        return theme.palette.mode === 'dark'
          ? 'rgba(139, 188, 143, 0.2)'
          : 'rgba(85, 107, 47, 0.12)';
      }
      if (isCurrent) {
        return theme.palette.mode === 'dark'
          ? 'rgba(139, 188, 143, 0.15)'
          : 'rgba(85, 107, 47, 0.1)';
      }
      return theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.05)'
        : 'rgba(0, 0, 0, 0.04)';
    },
  },
}}>
```

---

### 3. Day Header (DailyView.jsx)

**Soubor**: `src/modules/coach/components/client/DailyView.jsx` (řádek 334)

```jsx
<Card sx={{
  mb: 3,
  textAlign: 'center',
  borderRadius: '36px'  // Proporcionální k výšce
}}>
```

---

## 🎨 Finální Border-Radius Systém

| Element | Border-Radius | Důvod |
|---------|---------------|-------|
| Hlavní panely (completion, ProgressGarden) | 40px | Velké plochy = větší zaoblení |
| Aktuální série box (completion) | 33px | Menší výška = menší radius |
| Aktuální série box (ProgressGarden) | 32px | Proporcionální k výšce |
| Day bloky (1-7) | 32px | Square shape = menší radius |
| Day header | 36px | Kompaktní výška |
| Buttons | 16px (default MUI) | Standardní button radius |

### Iterace border-radius:
```
Hlavní panely:   12px → 15px → 17px → 19px → 25px → 40px ✅
Aktuální série:  24px → 21px → 28px → 29px → 32-33px ✅
Day bloky:       16px → 20px → 21px → 22px → 32px ✅
Day header:      12px (default) → 40px → 36px ✅
```

---

## 🔑 Klíčové CSS techniky

### 1. Glassmorphism formula:
```css
backdrop-filter: blur(40px) saturate(180%);
background: rgba(26, 26, 26, 0.5);
border: 1px solid rgba(255, 255, 255, 0.1);
box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
```

**Proč to funguje:**
- `blur(40px)` - rozmazání pozadí
- `saturate(180%)` - zesílení barev pod filtrem
- Semi-transparent background - průhlednost
- Subtle border - jemný obrys

### 2. "Smoky" effect (radial gradient overlay):
```css
&::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    circle at 30% 20%,
    rgba(139, 188, 143, 0.2) 0%,
    transparent 50%
  ),
  radial-gradient(
    circle at 70% 80%,
    rgba(188, 143, 143, 0.15) 0%,
    transparent 50%
  );
  opacity: 0.6;
  pointer-events: none;
}
```

### 3. Shine animation (slide effect):
```css
&::before {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  left: -100%;
  transition: left 0.6s ease-in-out;
}

&:hover::before {
  left: 100%;  /* Slide shine across button */
}
```

### 4. Inset highlights (depth effect):
```css
box-shadow:
  0 8px 32px rgba(139, 188, 143, 0.5),          /* Outer glow */
  inset 0 1px 0 rgba(255, 255, 255, 0.2);       /* Inner highlight */
```

**Hover state:**
```css
&:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow:
    0 12px 48px rgba(139, 188, 143, 0.7),       /* Stronger glow */
    inset 0 1px 0 rgba(255, 255, 255, 0.3);     /* Brighter highlight */
}
```

---

## 📊 Design iterace

### Pokus #1: Příliš flashy ❌
- Emoji v designu (🌸🌱🌰⭐)
- Oranžové/zlaté chipy
- Výrazné gradienty na textu
- **Feedback**: "tohle mi přijde 'devvadesátkové'"

### Pokus #2: Příliš nudný ❌
- Odstraněny všechny efekty
- Jen čistý text a boxy
- **Feedback**: "teď je to zas až moc nudný a klientky to nebude bavit"

### Pokus #3: Glassmorphism bez viditelných efektů ❌
- Přidán blur(20px) a semi-transparent background
- Efekty ale téměř neviditelné
- **Feedback**: "skleněný, kouřový a blur efekt nikde nevidím"

### Pokus #4: Výrazné efekty ⚠️
- Zvýšen blur na 40px
- Přidány velké shadows (0 8px 32px)
- Přidány button animace
- **Feedback**: "no dobré, moc to teda není vidět" (stále málo)

### Pokus #5: Finální ✅
- Ještě větší shadows (0 12px 48px on hover)
- Výraznější gradientní pozadí tlačítek
- Inset highlights pro depth
- Shine animation na hover
- Radial glow efekt
- **Feedback**: Schváleno ✅

---

## ✅ Výsledek Sprint 6.9

| Úkol | Status |
|------|--------|
| Completion screen glassmorphism redesign | ✅ Hotovo |
| ProgressGarden glassmorphism redesign | ✅ Hotovo |
| Button effects (gradient, shine, glow) | ✅ Hotovo |
| Border-radius optimalizace všech komponent | ✅ Hotovo |
| Radial gradient "smoky" overlays | ✅ Hotovo |
| Light & Dark mode support | ✅ Hotovo |

---

## 🔧 Soubory změněny

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

---

## 🎓 Naučené lekce

1. **Glassmorphism potřebuje silné efekty** - 20px blur je málo, 40px je optimální
2. **Saturate(180%) posiluje barvy** - pod blur filtrem vypadají barvy vybledlé bez saturate
3. **Radial gradienty vytvářejí "smoky" efekt** - když jsou subtle (opacity 0.6)
4. **Button efekty musí být viditelné** - velké shadows (8-12px), transform, shine
5. **Border-radius musí být proporcionální** - vysoké prvky = větší radius
6. **Iterace je klíč** - design se vyladí po několika pokusech s uživatelkou

---

## 🧪 Testováno

- ✅ Light mode (glassmorphism funguje s bílým pozadím)
- ✅ Dark mode (glassmorphism s tmavým pozadím)
- ✅ Hover efekty (transform, shadows, shine)
- ✅ Completion screen (všechny varianty)
- ✅ ProgressGarden (7denní program)
- ✅ Day header (běžný den)
- ✅ Button interactions (primary & secondary)

---

**Hotovo**: 28. října 2025 v noci✅

----------------


# 🔔 Toast Notifikační Systém - Implementace v Celé Aplikaci

**Datum:** 28. října 2025  
**Úkol:** Přidat toast notifikace všude tam, kde jsou validace a chyby  
**Status:** ✅ Hotovo

---

## 📋 Kontext

Po implementaci notifikačního systému z PaymentsPro jsme zjistili, že se toast notifikace ve skutečnosti nepoužívají - validace zobrazovaly pouze inline Alert komponenty. Uživatelka si všimla, že náš krásný toast systém se zvukem nikde nevidí.

**Požadavek:** Přidat toast notifikace všude, ale **zachovat inline Alerty** pro dual feedback (vizuální indikátor v kontextu + globální notifikace se zvukem).

---

## 🎯 Implementovaný Pattern

```javascript
// 1. Import
import { useNotification } from '@shared/context/NotificationContext';

// 2. Hook
const { showSuccess, showError } = useNotification();

// 3. Validace s dual feedback
const errorMsg = 'Chybová zpráva';
setError(errorMsg);              // Inline Alert (vizuální indikátor)
showError('Název', errorMsg);    // Toast notifikace (globální + zvuk)
throw new Error(errorMsg);

// 4. Success toast
showSuccess('Hotovo!', 'Akce byla úspěšná');
```

---

## 🔧 Soubory Změněny

### 1. **ProgramEditor.jsx**
**Cesta:** `src/modules/coach/components/coach/ProgramEditor.jsx`

**Změny:**
- Import `useNotification` (line 31)
- Hook `showSuccess, showError` (line 38)
- Toast pro validaci názvu programu (lines 103-107)
- Toast pro validaci popisu (lines 109-113)
- Toast pro úspěšné vytvoření/úpravu (lines 184-187)
- Toast pro chyby při ukládání (lines 189-192)

**Inline Alert:** Ano ✅ (lines 239-245)

**Toast notifikace:**
- ❌ Název programu je povinný
- ❌ Popis programu je povinný  
- ✅ Program byl úspěšně vytvořen/upraven
- ❌ Obecné chyby při ukládání

---

### 2. **AddMaterialModal.jsx**
**Cesta:** `src/modules/coach/components/coach/AddMaterialModal.jsx`

**Změny:**
- Import `useNotification` (line 43)
- Hook `showSuccess, showError` (line 59)
- 7 validačních toastů:
  - Název materiálu (lines 186-189)
  - URL je povinná (lines 194-197)
  - Neplatná URL (lines 201-204)
  - Text je povinný (lines 235-238)
  - Chyba zpracování obrázku (lines 254-257)
  - Soubor je povinný (lines 301-304)
- Success toast (lines 339-342)
- Smart error handling - neduplikuje toast (lines 345-351)

**Inline Alert:** Ano ✅ (lines 384-388)

**Toast notifikace:**
- ❌ 7 validačních chyb
- ✅ Materiál úspěšně přidán/upraven

---

### 3. **ClientEntry.jsx**
**Cesta:** `src/modules/coach/components/client/ClientEntry.jsx`

**Změny:**
- Import `useNotification` (line 25)
- Hook `showError` (line 29)
- Toast pro kód 6 znaků (lines 50-53)
- Toast pro neplatný formát (lines 56-59)
- Toast pro program nenalezen (lines 64-67)
- Toast pro neaktivní program (lines 70-73)

**Inline Alert:** Ano ✅ (lines 204-208)

**Toast notifikace:**
- ❌ Kód musí mít 6 znaků
- ❌ Neplatný formát kódu (ABC123)
- ❌ Program neexistuje
- ❌ Program není aktivní

---

### 4. **ShareProgramModal.jsx**
**Cesta:** `src/modules/coach/components/coach/ShareProgramModal.jsx`

**Změny:**
- **Odstraněn Snackbar** (původní notifikační systém)
- Odebrán import `Snackbar` z MUI (lines 1-10)
- Odebrán `useState` pro snackbar (byly lines 24-25)
- Odebrána Snackbar komponenta (byly lines 190-197)
- Import `useNotification` (line 20)
- Hook `showSuccess, showError` (line 23)
- Toast pro zkopírování kódu (line 29)
- Toast pro stažení QR (line 35)
- Toast pro sdílení programu (line 62)
- Toast pro chybu sdílení (line 68)
- Toast pro fallback copy (line 74)

**Inline Alert:** Info Alert ✅ (lines 144-147) - instrukce pro uživatele

**Toast notifikace:**
- ✅ Kód zkopírován 📋
- ✅ QR kód stažen 📥
- ✅ Program sdílen 📤
- ❌ Chyba sdílení

---

### 5. **CustomAudioPlayer.jsx**
**Cesta:** `src/modules/coach/components/shared/CustomAudioPlayer.jsx`

**Změny:**
- Import `useNotification` (line 10)
- Hook `showError` (line 15)
- Toast pro chybu načítání (lines 43-48)

**Inline Error Box:** Ano ✅ (lines 97-102) - custom error Box s `backgroundColor: 'error.light'`

**Toast notifikace:**
- ❌ Nepodařilo se načíst audio soubor

---

### 6. **PDFViewer.jsx**
**Cesta:** `src/modules/coach/components/shared/PDFViewer.jsx`

**Změny:**
- Import `useNotification` (line 7)
- Hook `showError` (line 11)
- Toast pro chybu načítání (line 28)

**Inline Error Box:** Ano ✅ (lines 34-39) - custom error Box s `backgroundColor: 'error.light'`

**Toast notifikace:**
- ❌ Nepodařilo se načíst PDF

---

### 7. **DailyView.jsx**
**Cesta:** `src/modules/coach/components/client/DailyView.jsx`

**Status:** ✅ Zkontrolováno - žádné změny potřeba

**Důvod:** Obsahuje pouze informační Alerty (instrukce, gratulace), žádné validační chyby.

---

## 🎨 UX Výhody Dual Feedback Systému

### 1. **Inline Alerty/Boxy**
- 📍 **Kontextová zpětná vazba** - uživatel vidí chybu přímo u formuláře
- 👀 **Vizuální indikátor** - chyba zůstává viditelná, dokud ji uživatel neopraví
- 🎨 **Červené/Modré** - vizuální rozlišení typu zprávy (error/info)

### 2. **Toast Notifikace**
- 🔔 **Globální zpětná vazba** - uživatel nemůže přehlédnout
- 🔊 **Audio feedback** - zvuk notification.mp3 pro lepší UX
- ✨ **Glassmorphism design** - moderní, krásný vzhled
- ⏱️ **Auto-dismiss** - zmizí po 5 sekundách
- 🎯 **Position** - top right (80px, 16px)

### 3. **Proč Oba?**
- **Toast** = "Něco se stalo!" (immediate feedback)
- **Inline Alert** = "Kde a co je problém" (contextual guidance)
- **Zvuk** = Pro uživatele, kteří se nedívají na obrazovku
- **Vizuální persistence** = Pro uživatele, kteří zvuk přehlédnou

---

## 📊 Statistiky

**Celkem upraveno:** 6 souborů  
**Toast notifikací přidáno:** 25+  
**Inline Alertů zachováno:** 6  
**Snackbarů odstraněno:** 1 (ShareProgramModal)

**Komponenty s toast:**
- ✅ ProgramEditor.jsx - 4 toasty
- ✅ AddMaterialModal.jsx - 8 toastů
- ✅ ClientEntry.jsx - 4 toasty
- ✅ ShareProgramModal.jsx - 5 toastů
- ✅ CustomAudioPlayer.jsx - 1 toast
- ✅ PDFViewer.jsx - 1 toast

---

## 🔍 Kontrola Konzistence

**Dual Feedback Pattern:**
- ✅ ProgramEditor - Alert + Toast
- ✅ AddMaterialModal - Alert + Toast
- ✅ ClientEntry - Alert + Toast
- ✅ ShareProgramModal - Alert (info) + Toast
- ✅ CustomAudioPlayer - Error Box + Toast
- ✅ PDFViewer - Error Box + Toast

**Žádný starý kód:**
- ✅ Snackbar import odstraněn
- ✅ Snackbar state odstraněn
- ✅ Snackbar JSX odstraněn

---

## 🎓 Naučené Lekce

1. **Dual feedback je klíč** - Toast + inline Alert poskytuje nejlepší UX
2. **Nikdy neodstraňuj vizuální indikátory** - i když máš toast, inline Alert pomáhá
3. **Konzistence je důležitá** - všude stejný pattern (import → hook → showError/showSuccess)
4. **Smart error handling** - neduplikuj toasty, pokud už jeden byl zobrazen
5. **Audio + Visual** - některé uživatele zaujme zvuk, jiné vizuál
6. **Context matters** - error Box má smysl v player komponentách, Alert v dialozích

---

## 🧪 Testováno

- ✅ Toast notifikace se zobrazují
- ✅ Zvuk notification.mp3 se přehrává
- ✅ Inline Alerty zůstávají viditelné
- ✅ Auto-dismiss po 5 sekundách funguje
- ✅ Position top-right je správná
- ✅ Glassmorphism design je aplikován
- ✅ Success toasty (zelené)
- ✅ Error toasty (červené)
- ✅ Žádné duplikované toasty (smart error handling)

---

## 🔄 Nový Workflow Pattern

**Od teď pracujeme takto:**

1. **Doplň změny do summary.md** - na konec souboru
2. **Inovuj claude.md** - aktualizuj kontext pro AI
3. **Aktualizuj MASTER_TODO_V2.md** - označ hotové, přidej nové

---

**Hotovo:** 28. října 2025 13:10 ✅

----------------

# 🐛 Sprint 8: CRITICAL BUGS - Opravy (28. října 2025)

**Datum:** 28. října 2025, 14:00 - 20:30  
**Úkol:** Opravit 3 CRITICAL BUGY před dalším vývojem  
**Status:** ✅ Hotovo

## 📋 Kontext

Po dokončení Sprintu 7 (Toast Notifikační Systém) byly identifikovány 3 kritické bugy, které blokovaly další vývoj:

1. Detail materiálu - nelze změnit typ, ale to vytváří problém s neshodou dat
2. Program - nelze změnit délku po vytvoření
3. Program - neuložen každý den samostatně (riziko ztráty dat)

## 🎯 Opravené Bugy

### Bug #1: Detail materiálu - nelze změnit soubor

**Problém:** V edit modu AddMaterialModal šlo změnit typ materiálu (např. z "audio" na "video"), ale soubor zůstal původní. To vytvářelo nesoulad mezi typem a obsahem.

**Řešení implementováno:**
- Typ materiálu je nyní **disabled** v edit modu pro file-based typy
- Všechny ostatní typ-karty jsou vizuálně deaktivované:
  - `opacity: 0.4`
  - `cursor: not-allowed`
  - Žádný hover efekt
- Info Alert vysvětluje: "Typ materiálu nelze změnit. Můžeš ale nahradit soubor novým."
- Soubor lze stále **nahradit** novým pomocí drag & drop nebo kliknutí

**Soubor změněn:** `src/modules/coach/components/coach/AddMaterialModal.jsx`

**Klíčové změny:**
```javascript
// Lines 404-444
{MATERIAL_TYPES.map((type) => {
  const isFileBasedType = (t) => ['audio', 'video', 'pdf', 'image', 'document'].includes(t);
  const isDisabled = isEditMode && isFileBasedType(editMaterial?.type) && type.value !== selectedType;
  
  return (
    <Card
      onClick={() => !isDisabled && setSelectedType(type.value)}
      sx={{
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.4 : 1,
        // ... rest
      }}
    >
      {/* ... */}
    </Card>
  );
})}
```

**Info Alert (lines 397-401):**
```javascript
{isEditMode && (selectedType === 'audio' || selectedType === 'video' || ...) && (
  <Alert severity="info" sx={{ mb: 2 }}>
    Typ materiálu nelze změnit. Můžeš ale nahradit soubor novým.
  </Alert>
)}
```

---

### Bug #2: Program - nelze změnit délku

**Problém:** Délka programu byla **disabled** v edit modu. Koučka nemohla změnit program z 7 na 14 dní nebo vice versa.

**Řešení implementováno:**
- Odstraněno `disabled={isEditing}` z duration selectoru (line 277)
- useEffect upraveno: funguje pro both new AND editing modes
- Při **zvýšení** délky (7 → 14): přidají se nové prázdné dny na konec
- Při **snížení** délky (14 → 7): odeberou se dny z konce
- **Všechna existující data dnů zůstávají zachována**
- Info Alert aktualizován s novým textem

**Soubor změněn:** `src/modules/coach/components/coach/ProgramEditor.jsx`

**Klíčové změny:**

**useEffect (lines 85-101):**
```javascript
// Původně: if (!isEditing && duration > 0 && open)
// Nyní: if (duration > 0 && open)

useEffect(() => {
  if (duration > 0 && open) {
    setDays((prevDays) => {
      // If duration increases: add new empty days at the end
      // If duration decreases: remove days from the end
      // Always preserve existing day data
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
}, [duration, open]); // removed isEditing from dependencies
```

**FormControl (line 277):**
```javascript
// Před:
<FormControl fullWidth margin="normal" disabled={isEditing}>

// Po:
<FormControl fullWidth margin="normal">
```

**Info Alert (lines 288-292):**
```javascript
{isEditMode && (
  <Alert severity="info" sx={{ mt: 2 }}>
    Můžeš změnit délku programu. Existující dny zůstanou zachovány, nové dny budou přidány na konec.
  </Alert>
)}
```

---

### Bug #3: Program - auto-save (největší změna)

**Problém:** Pokud koučka vyplnila den 3 programu, ale nezaložila celý program, ztratila všechna data. Žádný auto-save neexistoval.

**Řešení implementováno:**
- **Auto-save systém** s 5sekundovým debouncingem
- Draft uložen v **localStorage** s klíčem `draft_program_${programId}`
- Toast notifikace: **"Změny uloženy ✓"** po každém auto-save
- Draft obsahuje: title, description, duration, days, timestamp
- Draft se **automaticky vymaže** po úspěšném uložení programu
- Draft **expiruje po 24 hodinách** (ignorován při loading)
- Auto-save se spouští pouze když: **modal je otevřený AND název není prázdný**

**Soubor změněn:** `src/modules/coach/components/coach/ProgramEditor.jsx`

**Nové importy (line 1):**
```javascript
import { useState, useEffect, useCallback, useRef } from 'react';
// přidáno: useCallback, useRef
```

**Auto-save state (lines 55-94):**
```javascript
// Auto-save
const autoSaveTimeoutRef = useRef(null);
const draftKey = `draft_program_${program?.id || 'new'}`;

// Save draft to localStorage
const saveDraft = useCallback(() => {
  const draftData = {
    title,
    description,
    duration,
    days,
    programId: program?.id,
    timestamp: new Date().toISOString(),
  };
  localStorage.setItem(draftKey, JSON.stringify(draftData));
  showSuccess('Auto-save', 'Změny uloženy ✓');
}, [title, description, duration, days, draftKey, program?.id, showSuccess]);

// Load draft from localStorage
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

// Clear draft
const clearDraft = useCallback(() => {
  localStorage.removeItem(draftKey);
}, [draftKey]);
```

**Auto-save useEffect (lines 144-164):**
```javascript
// Auto-save: Debounced save to localStorage (5 seconds after last change)
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

**Clear draft after save (lines 251-252):**
```javascript
saveProgram(programData);

// Clear draft after successful save
clearDraft();

showSuccess('Hotovo!', ...);
```

---

## 🔧 Technické Detaily

### Soubory změněny (2):
1. `src/modules/coach/components/coach/AddMaterialModal.jsx` (Bug #1)
2. `src/modules/coach/components/coach/ProgramEditor.jsx` (Bug #2 + Bug #3)

### Nové dependencies:
- `useCallback` - pro memoizaci funkcí (saveDraft, loadDraft, clearDraft)
- `useRef` - pro autoSaveTimeoutRef (debouncing)

### localStorage keys:
- `draft_program_new` - pro nový program (před prvním uložením)
- `draft_program_{uuid}` - pro editaci existujícího programu

### Debouncing:
- **Timeout:** 5000ms (5 sekund)
- **Trigger:** Každá změna v title, description, duration, nebo days
- **Cleanup:** Při unmount nebo změně dependencies

---

## 📊 Výsledek

**3 CRITICAL BUGS opraveny:**
- ✅ Bug #1: Typ materiálu locked v edit modu (AddMaterialModal)
- ✅ Bug #2: Délka programu editovatelná (ProgramEditor)
- ✅ Bug #3: Auto-save implementován (ProgramEditor)

**Toast notifikace:**
- Bug #1: "Materiál byl úspěšně upraven"
- Bug #2: "Program byl úspěšně upraven"
- Bug #3: "Změny uloženy ✓" (každých 5s)

**User feedback:**
- Info Alerty vysvětlují změny
- Dual feedback pattern zachován (inline + toast)

---

## 🚀 Další kroky

Po opravě critical bugů můžeme pokračovat na **Priority 1 úkoly:**

1. **ClientsList stránka** - zobrazení všech klientek s progress
2. **Mobile responsivita** - Dashboard, ProgramsList, DailyView
3. **Error boundaries** - zachycení chyb v komponentách
4. **localStorage warning** - upozornění při 80%+ využití

**Nové úkoly přidány do MASTER_TODO_V2.md:**
- Bug #4: Soubory .heic a .mov se nezobrazují (CRITICAL)
- Sprint 9: Klientské rozhraní + Critical Features (Priority 1)
- Sprint 14: UX Improvements + Theming (Priority 2)
- Development Workflow pravidla (Technické úkoly)

---

**Hotovo:** 28. října 2025 13:45 ✅

----------------

