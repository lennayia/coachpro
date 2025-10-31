# 🎯 COACHPRO - MASTER TODO V2.0

**Datum aktualizace:** 29. října 2025, 15:00
**Aktuální stav:** Sprint 9 dokončen (Glassmorphism & UI Polish)
**Další sprint:** Sprint 10 - MODULARITA + SPRÁVA KLIENTŮ + DATA PERSISTENCE
**Hosting:** Vercel (frontend) + Supabase (database + storage)
**AI asistenti:** Claude Code (Opus) + Claude Sonnet 4.5

---

## 📊 LEGENDA

- ✅ **Hotovo** - implementováno a otestováno
- 🚨 **CRITICAL BUG** - musí se opravit HNED!
- 🔜 **Priority 1** - Must have pro MVP (Sprinty 7-11)
- 🎨 **Priority 2** - Should have (Sprinty 12-15)
- 💡 **Priority 3** - Nice to have (Sprinty 16-18)
- 🚀 **Fáze 2** - Po úspěšném MVP (AI, backend)

---

## 🚨 CRITICAL BUGS & BLOCKERS (OPRAVIT HNED!)

### ✅ **Bug #1: Detail materiálu - nelze změnit soubor** - HOTOVO!
- **Problém:** V detailu materiálu jde změnit formát, ale soubor změnit nejde
- **Řešení:**
  - ✅ Nelze změnit typ, pokud je soubor nahrán (disabled + opacity 0.4)
  - ✅ Info Alert: "Typ materiálu nelze změnit. Můžeš ale nahradit soubor novým."
  - ✅ Soubor lze stále nahradit (drag & drop nebo kliknutí)
- **Soubor:** `AddMaterialModal.jsx`

### ✅ **Bug #2: Program - nelze změnit délku** - HOTOVO!
- **Problém:** Nelze změnit délku programu po vytvoření
- **Řešení:**
  - ✅ Umožnit změnu délky (7 → 14 dní)
  - ✅ Přidat/odebrat dny dynamicky
  - ✅ Zachovat data dnů, které už jsou vyplněné
  - ✅ Info Alert: "Můžeš změnit délku programu. Existující dny zůstanou zachovány..."
- **Soubor:** `ProgramEditor.jsx`

### ✅ **Bug #3: Program - neuložen každý den samostatně** - HOTOVO!
- **Problém:** Pokud koučka vyplní den 3, ale nezáloží, ztratí data
- **Řešení:**
  - ✅ Auto-save každých 5 sekund (debounced)
  - ✅ LocalStorage draft mode (`draft_program_${id}`)
  - ✅ Toast: "Změny uloženy ✓"
  - ✅ Draft se vymaže po úspěšném uložení
  - ✅ Draft expiruje po 24 hodinách
- **Soubor:** `ProgramEditor.jsx`

### 🚨 **Bug #4: Soubory .heic a .mov se nezobrazují**
- **Problém:** Obrázky .heic a videa .mov se v programech nezobrazují
- **Řešení:**
  - [ ] HEIC → JPEG konverze (už máme pro upload, zkontrolovat zobrazení)
  - [ ] MOV → MP4 konverze nebo fallback na download
  - [ ] Testovat zobrazení v Safari/Chrome/Firefox
  - [ ] Přidat podporované formáty do nápovědy
- **Priority:** CRITICAL - blokuje zobrazení materiálů

---

## 🎯 PRIORITY 1 - MUST HAVE (Sprinty 7-12)

### ✅ **Sprint 7: TOAST NOTIFIKAČNÍ SYSTÉM (1 den)** - HOTOVO!

**Datum:** 28. října 2025
**Status:** ✅ Kompletně implementováno a otestováno

#### **7.1 Implementace toast notifikací**
- ✅ **ProgramEditor.jsx** - 4 toast notifikace (validace + success)
- ✅ **AddMaterialModal.jsx** - 8 toast notifikací (7 validací + success)
- ✅ **ClientEntry.jsx** - 4 toast notifikace (validace kódu)
- ✅ **ShareProgramModal.jsx** - 5 toast notifikací (success akce + errors)
  - ✅ Odstraněn starý Snackbar systém
  - ✅ Nahrazeno toast systémem z PaymentsPro
- ✅ **CustomAudioPlayer.jsx** - 1 toast (error při načítání audio)
- ✅ **PDFViewer.jsx** - 1 toast (error při načítání PDF)
- ✅ **DailyView.jsx** - zkontrolováno (pouze informační Alerty, žádné změny)

#### **7.2 Dual Feedback Pattern**
- ✅ **Inline Alerty** - zachovány pro kontextovou zpětnou vazbu
- ✅ **Toast notifikace** - přidány pro globální feedback se zvukem
- ✅ Pattern dokumentován v claude.md a summary.md

#### **7.3 Features**
- ✅ Glassmorphism design
- ✅ Audio feedback (notification.mp3)
- ✅ Auto-dismiss (5 sekund)
- ✅ Position: Top right
- ✅ 4 barvy (error, success, info, warning)

**Soubory upraveny:** 6
**Toast notifikací přidáno:** 25+
**Inline Alertů zachováno:** 6
**Snackbarů odstraněno:** 1

---

### ✅ **Sprint 8: CRITICAL BUGS - OPRAVY (1 den)** - HOTOVO!

**Datum:** 28. října 2025
**Status:** ✅ Všechny 3 critical bugy opraveny a otestovány

#### **8.1 Bug #1: Detail materiálu - nelze změnit soubor**
- ✅ **Implementováno řešení:** Typ materiálu nelze změnit v edit modu pro file-based typy
- ✅ Všechny ostatní typ-karty jsou disabled (opacity 0.4, cursor: not-allowed)
- ✅ Info Alert vysvětluje: "Typ materiálu nelze změnit. Můžeš ale nahradit soubor novým."
- ✅ Soubor lze stále nahradit novým (drag & drop nebo kliknutí funguje)
- ✅ Toast notifikace při úpravě: "Materiál byl úspěšně upraven"

#### **8.2 Bug #2: Program - nelze změnit délku**
- ✅ **Odstraněno:** `disabled={isEditing}` z duration selectoru
- ✅ Délku programu lze měnit i po vytvoření (7 → 14 dní nebo vice versa)
- ✅ Při zvýšení délky: přidají se nové prázdné dny na konec
- ✅ Při snížení délky: odeberou se dny z konce
- ✅ Všechna existující data dnů zůstávají zachována
- ✅ Info Alert: "Můžeš změnit délku programu. Existující dny zůstanou zachovány, nové dny budou přidány na konec."
- ✅ useEffect upraveno: funguje pro both new and editing modes

#### **8.3 Bug #3: Program - auto-save**
- ✅ **Implementován auto-save systém:**
  - Debounced save: 5 sekund po poslední změně
  - Draft uložen v localStorage: `draft_program_${programId}`
  - Toast notifikace: "Změny uloženy ✓" po každém auto-save
  - Draft obsahuje: title, description, duration, days, timestamp
- ✅ **Draft management:**
  - Draft se automaticky vymaže po úspěšném uložení programu
  - Draft expiruje po 24 hodinách (automaticky ignorován)
  - loadDraft() funkce pro případné obnovení (připraveno pro budoucnost)
- ✅ **useEffect dependencies:** správně nastaveno (title, description, duration, days, open, saveDraft)
- ✅ Auto-save se spouští pouze když: modal je otevřený AND název není prázdný

**Soubory upraveny:** 2
- `AddMaterialModal.jsx` (Bug #1)
- `ProgramEditor.jsx` (Bug #2 + Bug #3)

**Technické detaily:**
- Imports: přidáno `useCallback`, `useRef`
- Auto-save timeout: 5000ms (5 sekund)
- Draft key format: `draft_program_new` pro nový, `draft_program_{id}` pro editing

---

### ✅ **Sprint 9: GLASSMORPHISM & UI POLISH + MODULARIZACE (3 dny)** - HOTOVO!

**Datum:** 28-30. října 2025
**AI asistenti:** Claude Code (Opus) + Claude Sonnet 4.5
**Status:** ✅ Kompletně implementováno a otestováno (5 sessions)

#### **9.1 Glassmorphism na modalech a dialozích**
- ✅ **Vytvořeny utility soubory:**
  - `/src/shared/styles/modernEffects.js` - Plain objekty pro glassmorphism (Opus)
  - `/src/shared/hooks/useModernEffects.js` - React hook (Opus)
  - `/src/shared/styles/modernEffects_FIXED.js` - Opravená verze (Sonnet)
- ✅ **Aplikováno na všechny modaly:**
  - PreviewModal - glassmorphism backdrop + paper
  - AddMaterialModal - glassmorphism backdrop + paper
  - Delete Dialogs - glassmorphism efekty
  - ProgramEditor modals - glassmorphism
- ✅ **BackdropProps pattern:**
  ```javascript
  BackdropProps={{
    sx: {
      backdropFilter: 'blur(4px)',
      WebkitBackdropFilter: 'blur(4px)',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
    }
  }}
  ```
- ✅ **PaperProps pattern:**
  ```javascript
  PaperProps={{
    sx: {
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      backgroundColor: isDark
        ? 'rgba(26, 26, 26, 0.7)'
        : 'rgba(255, 255, 255, 0.7)',
    }
  }}
  ```

#### **9.2 Glow efekty místo borders**
- ✅ **Nahrazeny ostré borders soft glow efekty:**
  ```javascript
  // ❌ BEFORE: border: '2px solid'
  // ✅ AFTER: boxShadow: '0 0 30px rgba(139, 188, 143, 0.25)'
  ```
- ✅ Aplikováno na karty, tlačítka, focus states

#### **9.3 TextField styling vylepšení**
- ✅ **Focus efekty:**
  ```javascript
  '&.Mui-focused': {
    boxShadow: '0 0 20px rgba(139, 188, 143, 0.15)',
    backgroundColor: isDark
      ? 'rgba(255, 255, 255, 0.08)'
      : 'rgba(0, 0, 0, 0.04)',
  }
  ```
- ✅ Hover states vylepšeny
- ✅ Transition efekty na všech inputech

#### **9.4 Grid Layout Fix**
- ✅ **MaterialsLibrary.jsx opraveno:**
  ```javascript
  // Problem: Grid spacing vytváří negativní marginy
  // Solution: Parent Box s padding
  <Box sx={{ px: { xs: 1.5, sm: 2, md: 3 } }}>
    <Grid spacing={{ xs: 1.5, sm: 2, md: 3 }}>
  ```
- ✅ Aplikováno na všechny Grid layouts v aplikaci

#### **9.5 MaterialCard.jsx obnova**
- ✅ **Corrupted soubor opraven** (Sonnet, 29.10 ráno)
- ✅ Odstraněny nefunkční glassmorphism experimenty z karet
- ✅ Glassmorphism aplikován JEN na Delete Dialog
- ✅ Karta samotná zachována s běžným glass efektem

**Soubory upraveny:** 6+
- `/src/shared/styles/modernEffects.js` (nový)
- `/src/shared/hooks/useModernEffects.js` (nový)
- `/src/shared/styles/modernEffects_FIXED.js` (nový)
- `/src/modules/coach/components/coach/MaterialCard.jsx` (opraven + glassmorphism)
- `/src/modules/coach/components/coach/MaterialsLibrary.jsx` (grid fix)
- Všechny modaly v aplikaci (glassmorphism aplikován)

**Kritická zjištění:**
- ❌ **Glassmorphism NEFUNGUJE na běžných kartách na stránce!** (backdrop-filter potřebuje vrstvu "za")
- ❌ **Spread operator nefunguje s backdrop-filter v MUI sx prop**
- ⚠️ **ServiceLogo size MUSÍ BÝT numeric**, ne responsive object
- ✅ **Glassmorphism JEN na modaly** s BackdropProps + PaperProps
- ✅ **Grid spacing vyžaduje parent padding** (kvůli negativním marginům)

**Dokumentace:** Vše zdokumentováno v `claude.md` (4 sessions, lessons learned, patterns)

#### **9.6 Glassmorphism Modularizace - Session 5**
- ✅ **Session proběhl s Claude Sonnet 4.5** (30.10, 00:06-01:35, 90 minut)
- ✅ **Centralizované funkce vytvořeny v modernEffects.js:**
  ```javascript
  createBackdrop() // Blur efekt pro backdrop
  createGlassDialog(isDark, borderRadius) // Glassmorphism pro dialogs/drawers
  createGlow(isSelected, color) // Glow efekt pro karty
  ```
- ✅ **9 souborů modularizováno:**
  - MaterialCard.jsx - Delete Dialog
  - AddMaterialModal.jsx
  - PreviewModal.jsx
  - ProgramEditor.jsx
  - ShareProgramModal.jsx
  - ClientEntry.jsx
  - CelebrationModal.jsx
  - DailyView.jsx
  - modernEffects.js (enhanced)

- ✅ **~150 řádků kódu odstraněno** (duplikovaný glassmorphism styling)
- ✅ **3 bugy opraveny:**
  - Path aliases nefungují pro modernEffects.js → použity relativní cesty
  - Undefined `glassmorphismWithGradient()` v DailyView → nahrazeno `presets.glassCard()`
  - SVG size prop nepřijímá objekty → změněno na numeric value

- ✅ **BONUS: Celebration enhancements:**
  - Přidán celebrační zvuk (`/sounds/celebration.mp3`, volume 0.5)
  - Vylepšené confetti (800 particles, 5s duration, recycle: true)
  - Side effect pattern s useEffect pro audio playback

**Kritická zjištění:**
- ⚠️ **Path aliases @styles a @shared NEFUNGUJÍ** pro modernEffects.js (není v /src/styles/)
- ✅ **Řešení: Relativní import** `../../../../shared/styles/modernEffects`
- ✅ **Konzistentní usage pattern:**
  ```javascript
  BackdropProps={{ sx: createBackdrop() }}
  PaperProps={{ sx: createGlassDialog(isDark, BORDER_RADIUS.dialog) }}
  ```
- 🎯 **Výsledek: Jednotný glassmorphism napříč všemi modaly bez duplikace kódu**

**Dokumentace:** Kompletní Session 5 dokumentace v `claude.md` (řádky 2304-2658)

---

### 🚨 **Sprint 10: MODULARITA + DATA PERSISTENCE + SPRÁVA KLIENTŮ (5-7 dní)** - PRIORITY 1!

**Důležitost:** 🔥 CRITICAL - Základ pro celý ekosystém DigiPro
**Datum zahájení:** 29. října 2025

#### **10.1 🚨 DATA PERSISTENCE - Oprava LocalStorage problému**
**Problém:** Vymazání localStorage = ztráta všech dat koučky (NESMÍ SE STÁT!)

- [ ] **🔴 CRITICAL: Supabase Storage - aktivovat a debugovat**
  - **Proč to nefunguje?** Zjistit root cause
  - Ověřit Supabase credentials v `.env`
  - Testovat upload/download funkcionalitu
  - Zkontrolovat `supabaseStorage.js` integraci
  - **Debug checklist:**
    - [ ] Supabase projekt existuje a je aktivní
    - [ ] API keys jsou správné
    - [ ] Storage bucket je vytvořený
    - [ ] RLS (Row Level Security) je správně nastaveno
    - [ ] Upload funkce nemá errors v console
    - [ ] Network tab ukazuje úspěšné requesty

- [ ] **Auto-sync do Supabase** (localStorage → cloud)
  - Každá změna v materiálech → auto-upload do Supabase
  - Každá změna v programech → auto-upload
  - Každá změna v klientkách → auto-upload
  - Debounced (5 sekund) aby se nespamovalo
  - Toast notifikace: "Změny uloženy do cloudu ✓"

- [ ] **Obnovení dat z cloudu**
  - Při prvním načtení: zkontrolovat Supabase
  - Pokud cloud má novější data → načíst odtud
  - Pokud localStorage má novější → merge
  - **Conflict resolution:** Timestamp-based (newer wins)

- [ ] **Backup & Recovery systém**
  - Denní automatický backup do Supabase
  - Export dat jako JSON (manual backup)
  - Import dat z JSON (manual restore)
  - **Recovery flow:**
    - Koučka klikne "Obnovit data z cloudu"
    - Zobrazit dostupné backupy (datum, čas)
    - Vybrat backup → restore
    - Potvrzení před přepsáním

- [ ] **Varování před vymazáním localStorage**
  - Pokud někdo řekne "vymaž localStorage", VŽDY varovat:
    - ⚠️ "Pozor! Vymazáním ztratíš veškerá data pokud nejsou v cloudu."
    - Tlačítko "Nejdřív zálohovat do cloudu"
    - Tlačítko "Exportovat jako JSON"
    - Teprve pak "Ano, vymazat vše"

**Status data recovery:**
- ❌ Data z vymazaného localStorage NELZE vrátit (konstatování)
- ✅ Od teď: Auto-sync do Supabase = ochrana proti ztrátě

---

#### **10.2 🎯 MODULARITA - DigiPro Ekosystém Foundation**
**Cíl:** Vytvořit sdílené komponenty pro celý ekosystém (CoachPro, PaymentsPro, další moduly)

- [ ] **Analýza: Co z PaymentsPro můžeme znovupoužít?**
  - [ ] Profil komponenta (Coach + Client) - **PRIORITA!**
  - [ ] Upload fotky systém - **PRIORITA!**
  - [ ] Administrační systém pro správu uživatelů
  - [ ] Toast notifikační systém (už máme)
  - [ ] Theme systém (color schemes)
  - [ ] Auth komponenty (login, register)
  - [ ] Settings stránka
  - [ ] Forms komponenty (TextField, Select, atd.)
  - [ ] Layout komponenty (Header, Sidebar, Footer)
  - [ ] Modal komponenty (glassmorphism ready)
  - [ ] Card komponenty (glassmorphism ready)

- [ ] **Vytvořit @digipro/shared package** (nebo folder)
  - Struktura:
    ```
    /src/shared/digipro/
      /components/
        /Profile/
          ProfileCard.jsx
          ProfileEditor.jsx
          ProfilePhoto.jsx
        /Admin/
          UsersList.jsx
          UserDetail.jsx
          UserEditor.jsx
        /Auth/
          LoginForm.jsx
          RegisterForm.jsx
        /Forms/
          DigiTextField.jsx
          DigiSelect.jsx
          DigiUpload.jsx
      /hooks/
        useProfile.js
        usePhotoUpload.js
        useAdmin.js
      /utils/
        profileHelpers.js
        adminHelpers.js
      /styles/
        digiproTheme.js
    ```

- [ ] **Modulární funkce podle best practices:**
  - **Authentication:** Login, Register, Logout, Password Reset
  - **User Management:** CRUD operace, Role management
  - **File Upload:** Image, PDF, Audio, Video (s Supabase)
  - **Notifications:** Toast, Push, Email
  - **Search:** Global search, Filters, Sorting
  - **Settings:** Profile, Preferences, Theme
  - **Analytics:** Tracking, Charts, Reports
  - **Comments/Feedback:** Rating, Reviews
  - **Calendar:** Events, Reminders
  - **Chat:** Real-time messaging (budoucnost)

- [ ] **DigiPro Design System**
  - Jednotná color palette napříč všemi moduly
  - Jednotné border-radius hodnoty
  - Jednotné spacing (4, 8, 12, 16, 24, 32, 48, 64px)
  - Jednotné typography (font sizes, weights)
  - Glassmorphism patterns (z CoachPro)
  - Animation patterns (z CoachPro)

---

#### **10.3 👤 PROFIL KOUČKY - Import z PaymentsPro**
**Cíl:** Mít kompletní profil koučky s fotkou (jako v PaymentsPro)

- [ ] **Vytvořit CoachProfile komponenty:**
  - [ ] **CoachProfileCard.jsx** (read-only view)
    - Fotka (200x200px kruhová)
    - Jméno, email, telefon
    - Bio/Tagline
    - Sociální sítě
    - Kvalifikace
    - Tlačítko "Upravit profil"

  - [ ] **CoachProfileEditor.jsx** (edit mode)
    - Upload fotky (drag & drop nebo kliknutí)
    - Crop tool (react-easy-crop)
    - Compress image před uploadem
    - Vše editovatelné
    - Auto-save (debounced)
    - Toast feedback

  - [ ] **ProfilePhotoUpload.jsx** (reusable)
    - Drag & drop zone
    - Preview před uploadem
    - Crop & rotate
    - Compress (max 500KB)
    - Upload do Supabase Storage
    - Fallback: Default avatar (iniciály)

- [ ] **Coach object - rozšíření:**
  ```javascript
  {
    // Základní (už máme)
    id: "uuid",
    name: "Lenka Nováková",
    email: "lenka@example.com",

    // NOVÉ - Profil
    profilePhoto: {
      url: "https://supabase.../coach-photos/uuid.jpg",
      thumbnail: "https://supabase.../coach-photos/uuid_thumb.jpg",
      uploadedAt: "ISO timestamp"
    },
    phone: "+420 xxx xxx xxx",
    bio: "Koučka pro ženy v podnikání...",
    tagline: "Najdi sílu v sobě",

    // Sociální sítě
    socialLinks: {
      instagram: "",
      linkedin: "",
      website: "",
      facebook: ""
    },

    // Kvalifikace
    education: "ICF akreditace, XYZ škola",
    certifications: [
      { title: "ICF ACC", year: "2023" }
    ],

    // Settings
    preferences: {
      theme: "nature",
      notifications: true,
      language: "cs"
    },

    // Meta
    createdAt: "ISO timestamp",
    updatedAt: "ISO timestamp"
  }
  ```

- [ ] **Storage.js - update:**
  - `updateCoachProfile(coachId, updates)` - uložit změny
  - `uploadCoachPhoto(coachId, file)` - nahrát fotku
  - `getCoachProfile(coachId)` - načíst profil

- [ ] **Navigace - přidat "Profil" stránku:**
  - Route: `/coach/profile`
  - Menu item v Sidebar
  - Zobrazit CoachProfileCard + Edit button

---

#### **10.4 👥 PROFIL KLIENTKY - Import z PaymentsPro**
**Cíl:** Klientka má také kompletní profil s fotkou

- [ ] **Vytvořit ClientProfile komponenty:**
  - [ ] **ClientProfileCard.jsx** (read-only)
  - [ ] **ClientProfileEditor.jsx** (edit mode)
  - [ ] Použít STEJNÝ ProfilePhotoUpload komponentu (modularita!)

- [ ] **Client object - rozšíření:**
  ```javascript
  {
    // Základní (už máme)
    id: "uuid",
    name: "Jana Nováková",
    email: "jana@example.com",

    // NOVÉ - Profil
    profilePhoto: {
      url: "https://supabase.../client-photos/uuid.jpg",
      thumbnail: "https://supabase.../client-photos/uuid_thumb.jpg"
    },
    phone: "+420 xxx xxx xxx",
    bio: "Moje cesta...", // volitelné

    // Moje PROČ (už máme)
    whyStatement: {
      why: "...",
      expectations: "...",
      direction: "..."
    },

    // Program info (už máme)
    programId: "uuid",
    startedAt: "ISO timestamp",
    completedDays: [1, 2, 3],

    // Meta
    createdAt: "ISO timestamp",
    updatedAt: "ISO timestamp"
  }
  ```

- [ ] **Navigace - přidat "Profil" stránku pro klientku:**
  - Route: `/client/profile`
  - Menu item v klientčině Sidebar

---

#### **10.5 🔧 SPRÁVA KLIENTŮ - Administrační systém (jako PaymentsPro)**
**Problém:** Klientka se musí umět registrovat SAMA + koučka musí umět přidat ručně

- [ ] **ClientsList stránka - UPGRADE:**
  - [ ] **Tlačítko "Přidat klientku ručně"** ← NOVÉ!
    - Otevře AdminAddClientModal
    - Koučka vyplní: Jméno, Email, Telefon
    - Vybere program
    - Volitelně: Vygenerovat přístupový kód nebo poslat email

  - [ ] **Batch operace:**
    - Multi-select klientek
    - Hromadné odeslání emailu
    - Hromadné přiřazení programu
    - Hromadné smazání (s potvrzením!)

  - [ ] **Pokročilé filtry:**
    - Status: Aktivní, Dokončené, Neaktivní
    - Program
    - Datum registrace
    - Poslední aktivita

- [ ] **AdminAddClientModal komponenta:**
  ```javascript
  // Formulář:
  - Jméno (required)
  - Email (required, validace)
  - Telefon (optional)
  - Program (dropdown, required)
  - Způsob přístupu:
    [ ] Vygenerovat kód (6 znaků)
    [ ] Poslat email s odkazem
    [ ] Obojí
  - Poznámka pro koučku (optional)
  ```

- [ ] **Dva způsoby registrace klientky:**

  **A) Samo-registrace (už máme, upgrade):**
  - Klientka zadá kód programu nebo naskenuje QR
  - Vyplní jméno + email
  - Automaticky se vytvoří účet
  - Redirect na program

  **B) Koučka přidá ručně (NOVÉ):**
  - Koučka vyplní AdminAddClientModal
  - Klientka dostane email s linkem
  - Klikne na link → nastaví heslo (volitelné)
  - Redirect na program

- [ ] **Email notifikace pro klientku:** (mock zatím, později Supabase)
  ```
  Subject: Tvoje koučka tě přidala do programu! 🌿

  Ahoj {{name}},

  Koučka {{coachName}} tě přidala do programu "{{programName}}".

  Tvůj přístupový kód: {{code}}
  Nebo klikni přímo: {{link}}

  Těším se na společnou cestu!
  {{coachName}}
  ```

- [ ] **Modularita - ClientAdmin systém:**
  - `/src/shared/digipro/components/Admin/ClientAdmin/`
    - `ClientsList.jsx` (tabulka/grid)
    - `ClientDetail.jsx` (detail klientky)
    - `ClientEditor.jsx` (editace)
    - `ClientInvite.jsx` (pozvání emailem)
    - `ClientBulkActions.jsx` (hromadné akce)

---

#### **10.6 📊 Přehled změn pro tento Sprint:**

**Soubory k vytvoření:**
- `/src/shared/digipro/` (celá struktura)
- `/src/modules/coach/components/profile/CoachProfileCard.jsx`
- `/src/modules/coach/components/profile/CoachProfileEditor.jsx`
- `/src/modules/coach/components/profile/ProfilePhotoUpload.jsx`
- `/src/modules/coach/components/admin/AdminAddClientModal.jsx`
- `/src/modules/coach/pages/CoachProfile.jsx`
- `/src/modules/client/components/profile/ClientProfileCard.jsx`
- `/src/modules/client/pages/ClientProfile.jsx`

**Soubory k úpravě:**
- `/src/modules/coach/utils/storage.js` (přidat profil funkce)
- `/src/modules/coach/utils/supabaseStorage.js` (aktivovat + debug)
- `/src/modules/coach/components/coach/ClientsList.jsx` (přidat admin features)
- `/src/modules/coach/pages/CoachDashboard.jsx` (přidat Profil link)

**Dependencies k instalaci:**
- `react-easy-crop` (pro crop fotky)
- `browser-image-compression` (pro compress)

**Technologie:**
- Supabase Storage (fotky)
- Supabase Database (backup dat)
- LocalStorage (cache)
- Auto-sync pattern (localStorage ↔ Supabase)

---

### **Sprint 11: KLIENTSKÉ ROZHRANÍ + CRITICAL FEATURES (4-5 dní)**

#### **9.1 Klientské rozhraní - kompletní layout**
- [ ] **Menu + Sidebar** (stejný layout jako u koučky, jiná data)
  - Navigace: Dashboard, Můj program, Materiály, Profil
  - Logo + jméno klientky
  - Logout tlačítko
- [ ] **Dashboard pro klientku**
  - Aktuální program (progress bar, streak 🔥)
  - Dnešní úkoly (checklist)
  - Moje PROČ (připomenutí)
  - Motivační citát
  - Statistiky (dokončené dny, celkový čas)
- [ ] **Stránka "Můj program"**
  - Seznam dnů s progress
  - Detail dne (materiály, instrukce)
  - Navigation mezi dny
- [ ] **Stránka "Materiály"**
  - Všechny materiály z programu
  - Filtr podle typu/kategorie
  - Search
- [ ] **Stránka "Profil"**
  - Jméno, email
  - Moje PROČ (editovatelné)
  - Změna hesla (připraveno na Supabase)
  - Certifikáty (seznam dokončených programů)

#### **9.2 Přihlášení klienta - e-mail povinný**
- [ ] **ClientEntry.jsx - update formuláře:**
  - Přidat pole pro e-mail (validace)
  - Jméno + příjmení (2 pole nebo 1 pole)
  - Kód programu (6 znaků)
  - QR scanner (volitelné)
- [ ] **Client object - update:**
  ```javascript
  {
    id: "uuid",
    name: "Jana Nováková",
    email: "jana@example.com", // ← NOVÉ! Povinné
    programId: "uuid",
    joinedAt: "ISO timestamp",
    // ... rest
  }
  ```
- [ ] **Validace e-mailu:**
  - Regex pattern
  - Toast notification při chybě
  - Kontrola duplicity (volitelné)

#### **9.3 Workflow pro koučku - posílání programů e-mailem**
- [ ] **Datová struktura - EmailWorkflow:**
  ```javascript
  {
    id: "uuid",
    coachId: "uuid",
    name: "Onboarding workflow",
    triggers: [
      {
        type: "program_completed", // trigger event
        programId: "uuid", // který program dokončen
      }
    ],
    actions: [
      {
        type: "send_email",
        delay: 0, // okamžitě nebo za X dní
        emailTemplate: {
          subject: "Gratulujeme! 🎉 Máme pro tebe další program",
          body: "...",
        },
        attachProgramId: "uuid", // další program k poslání
      }
    ],
    active: true,
    createdAt: "ISO timestamp"
  }
  ```
- [ ] **WorkflowBuilder stránka (pro koučku):**
  - Vytvoř workflow
  - Vyber trigger (dokončen program X)
  - Vyber akci (pošli e-mail s programem Y)
  - Vyber delay (okamžitě / za 1 den / za 7 dní)
  - Email template editor (subject + body s placeholders)
- [ ] **Workflow execution:**
  - Poslech na event "program_completed"
  - Trigger workflow
  - Odeslání e-mailu (zatím mock/console.log, později Supabase)
- [ ] **Seznam workflows:**
  - Grid/List view
  - Aktivovat/deaktivovat
  - Editovat/Smazat
  - Statistiky (kolikrát spuštěno)

#### **9.4 Náhledy Canva a dalších služeb**
- [ ] **Update linkDetection.js:**
  - Přidat Canva detection (canva.com/design/...)
  - Přidat Figma detection (figma.com/file/...)
  - Přidat Miro detection (miro.com/app/board/...)
  - Update embedSupport flags
- [ ] **GetEmbedUrl() - update:**
  - Canva embed URL format
  - Figma embed URL format
  - Miro embed URL format
- [ ] **Správná loga služeb:**
  - Canva logo (SVG nebo icon)
  - Figma logo
  - Miro logo
  - Update linkMeta.icon pro všechny služby
- [ ] **Testovat náhledy:**
  - Safari, Chrome, Firefox
  - Mobile vs. Desktop
  - Fallback na external link, pokud embed nefunguje

#### **9.5 Materiál - možnost úplné úpravy**
- [ ] **AddMaterialModal - rozšíření:**
  - Pokud isEditMode && file-based typ:
    - Tlačítko "Smazat soubor a nahradit novým"
    - Potvrzení: "Opravdu chceš smazat tento soubor?"
  - Po smazání:
    - Zobrazit upload zone
    - Umožnit nahrát nový soubor
    - Update material.content, fileSize, fileName, duration, atd.
- [ ] **Zachovat metadata:**
  - Pokud koučka mění jen text/link, zachovat původní soubor
  - Pokud koučka nahrává nový soubor, přepsat vše

---

### **Sprint 10: VEŘEJNÝ PROFIL + 2 ÚROVNĚ (5-7 dní)**

#### **10.1 Datová struktura - Coach object (rozšíření)**
- [ ] **Přidat nová pole:**
  ```javascript
  {
    // Základní info (rozšíření)
    urlSlug: "lenna-novakova",
    profilePhoto: "base64 nebo Supabase URL",
    tagline: "Koučka pro ženy v podnikání",
    bio: "Dlouhý text o mně (800 znaků)",
    story: "Můj příběh - jak jsem se stala koučkou (1500 znaků)", // ← NOVÉ!

    // Kvalifikace
    education: "ICF akreditace, XYZ škola",
    experience: "300+ hodin koučinku, 5 let praxe",
    certifications: [
      { title: "ICF ACC", image: "base64/URL", year: "2023" }
    ],
    authorityMemberships: [ // ← NOVÉ!
      "ICF Česká republika",
      "Asociace koučů ČR"
    ],

    // Oblasti koučinku
    coachingAreas: ["career", "business", "confidence"],

    // Sociální sítě
    socialLinks: {
      instagram: "",
      linkedin: "",
      website: "",
      facebook: ""
    },

    // Kontakt a dostupnost
    contactInfo: { // ← NOVÉ!
      email: "lenna@example.com",
      phone: "+420 xxx xxx xxx",
      whatsapp: "+420 xxx xxx xxx",
      availability: "Po-Pá 9-17h",
      timezone: "Europe/Prague"
    },

    // Kalendář (pro budoucnost)
    calendarLink: "https://calendly.com/lenna", // ← NOVÉ!

    // Lead magnet
    leadMagnetProgramId: "uuid",

    // Tier & balíčky
    tier: "free", // "free" nebo "pro"
    trialEndsAt: "ISO timestamp",
    servicePackages: [ // ← NOVÉ!
      {
        id: "uuid",
        name: "Základní",
        description: "7 dní programu + 1x zpětná vazba",
        price: 1500,
        currency: "CZK",
        includes: {
          programAccess: true,
          feedbackCount: 1,
          feedbackType: "text", // "text", "voice", "video"
          whatsappSupport: false,
          customMaterials: false
        }
      }
    ],

    // Digitální podpis (pro certifikáty)
    signatureImage: "base64", // ← NOVÉ!
    signatureVisibleInProfile: false // nepublikovat podpis
  }
  ```

- [ ] **Aktualizovat storage.js** s novými fieldy
- [ ] **Migrace dat** - pokud už existují koučky v localStorage

#### **9.2 CoachOnboarding - 6kroková (rozšíření)**
- [ ] **Krok 1: Základní info**
  - Fotka (upload + preview)
  - Jméno, email, telefon
  - URL slug (auto-generate z jména)
- [ ] **Krok 2: O mně**
  - Tagline (80 znaků)
  - Bio (800 znaků)
  - **Můj příběh** (1500 znaků) - nové!
  - Sociální sítě
- [ ] **Krok 3: Kvalifikace**
  - Kde studovala
  - Zkušenosti
  - Certifikáty (upload)
  - **Členství v autoritách** (ICF, ČAKO atd.) - nové!
- [ ] **Krok 4: Oblasti koučinku**
  - Multi-select z 12+ oblastí
- [ ] **Krok 5: Kontakt & Dostupnost** - nové!
  - Email, telefon, WhatsApp
  - Dostupnost (text)
  - Časová zóna
  - Kalendář link (Calendly atd.)
- [ ] **Krok 6: Digitální podpis** - nové!
  - Upload podpisu (pro certifikáty)
  - Náhled: "Takto bude vypadat na certifikátech"
  - Info: "Podpis nebude veřejný"
- [ ] **Uložení + redirect na Dashboard**

#### **9.3 PublicCoachProfile - veřejná landing page (rozšíření)**
- [ ] **Hero sekce**
  - Velká fotka (200x200px)
  - Jméno + tagline
  - Bio text
  - Sociální sítě
- [ ] **Můj příběh** - nové!
  - Rozbalovací sekce (accordion nebo plná stránka)
  - Emotivní text - proč dělám koučink
  - Možnost přidat fotky z cesty
- [ ] **Oblasti koučinku**
  - Grid karet s ikonami
  - **Rozšířit na 15+ oblastí** (viz rešerše níže)
- [ ] **Kvalifikace**
  - Vzdělání
  - Zkušenosti
  - Certifikáty
  - **Členství v autoritách** (ICF logo atd.) - nové!
- [ ] **Edukační sekce "Co je koučink?"**
  - 3 otázky:
    - Co je to koučink a jak funguje?
    - K čemu je koučink dobrý?
    - **K čemu koučink NENÍ určený** - důraz na terapii!
- [ ] **Balíčky služeb** - nové!
  - Card pro každý balíček
  - Cena, popis, co zahrnuje
  - CTA: "Mám zájem"
- [ ] **Lead magnet program**
  - Zdarma "ochutnávka"
  - Registrační formulář
- [ ] **Kontakt & Dostupnost** - nové!
  - Email, telefon, WhatsApp (tlačítka s linky)
  - Dostupnost: "Po-Pá 9-17h"
  - **Kalendář pro rezervaci** - iframe nebo link
- [ ] **Kontaktní formulář**
- [ ] **Responsive design**

#### **9.4 Info o koučce UVNITŘ programu** - nové!
- [ ] **"O koučce" karta v DailyView**
  - Mini profil koučky
  - Fotka + jméno
  - Tlačítko "Kontaktovat koučku"
  - Tlačítko "Rezervovat termín"
- [ ] **"O koučce" modal** - rozbalit
  - Celý profil (stejný jako PublicCoachProfile)
  - Kontakty, balíčky, certifikáty
- [ ] **Sticky kontakt tlačítko** (mobile)
  - Vždy viditelné
  - Rychlý přístup k WhatsApp/Email

#### **9.5 WordPress prodejní stránka - příprava**
- [ ] **Specifikace pro WP dev:**
  - Landing page s USP pro koučky
  - "Jak to funguje" sekce
  - Pricing tabulka (Free vs. Pro)
  - Testimonials od kouček
  - CTA: "Vyzkoušet zdarma"
  - Integrace s CoachPro (iframe nebo redirecty)
- [ ] **API endpoint pro WP → CoachPro**
  - Registrace koučky z WP
  - Automatické vytvoření účtu v CoachPro
  - Email s přístupem

#### **9.6 VOP, GDPR, O aplikaci**
- [ ] **VOP.jsx** - placeholder text
- [ ] **GDPR.jsx** - detailní info
- [ ] **O aplikaci** - nová stránka!
  - Co je CoachProApp
  - Pro koho je určená
  - Jak funguje
  - Kontakty
  - Changelog (historie verzí)
- [ ] **Footer** na všech stránkách
  - O aplikaci | VOP | GDPR
  - © 2025 CoachPro • Vytvořeno s 💚 a Claude AI
  - info@coachpro.cz

---

### **Sprint 10: NOVÉ TYPY MATERIÁLŮ (3-4 dny)**

#### **9.1 Rozšíření typů materiálů**
Aktuálně máme: Audio, PDF, Text, Link, Image, Video, Document

**Přidat:**
- [ ] **Úkoly (Tasks)**
  - Checkbox list
  - Klientka odškrtává
  - Koučka vidí completion
- [ ] **Kvízy (Quizzes)**
  - Multiple choice otázky
  - Správné/špatné odpovědi (volitelné)
  - Vyhodnocení na konci
  - Export výsledků pro koučku
- [ ] **Šablony (Templates/Worksheets)**
  - PDF ke stažení
  - Editovatelné (fillable PDF)
  - Příklady: Kolo života, SMART goals, Values assessment
- [ ] **Journal prompts (Výzvy k psaní)**
  - Otázky k reflexi
  - Klientka píše odpovědi
  - Možnost sdílet s koučkou
- [ ] **Motivační zprávy**
  - Krátké texty (max 500 znaků)
  - Emoji support
  - Kategorie: Ráno, Večer, Během dne
- [ ] **Dechová cvičení (Breathing exercises)**
  - Animovaný guide (např. 4-7-8)
  - Audio nápověda (volitelné)
  - Timer
- [ ] **Body scan meditace**
  - Speciální kategorie audio
  - Časová osa (10/20/30 min)
- [ ] **Guided visualizations (Řízené vizualizace)**
  - Audio nebo video
  - Témata: Úspěch, Klid, Síla atd.
- [ ] **Goal trackers (Sledování cílů)**
  - Definuj cíl
  - Milníky
  - Progress bar
  - Oslavy při dosažení
- [ ] **Habit trackers (Sledování návyků)**
  - Denní checkbox
  - Streak counter
  - Vizuální kalendář
- [ ] **Gratitude journal (Deník vděčnosti)**
  - Denní 3 věci, za které jsem vděčná
  - Historie záznamů
  - Export
- [ ] **Vision board (Vizuální tabule)**
  - Upload obrázků
  - Drag&drop layout
  - Inspirace pro budoucnost
- [ ] **Action plans (Akční plány)**
  - Krok 1, 2, 3...
  - Deadline pro každý krok
  - Checkbox completion
- [ ] **Decision matrix**
  - Výhody vs. Nevýhody
  - Skóre pro každou možnost
  - Doporučení
- [ ] **Energy management tool**
  - Zaznamenej energii během dne (1-10)
  - Graf energie v čase
  - Insights: "Tvoje peak je v 10h"
- [ ] **Time audit (Audit času)**
  - Jak trávím čas (kategorie)
  - Koláčový graf
  - Doporučení pro optimalizaci
- [ ] **Self-care checklist**
  - Denní/týdenní úkoly
  - Tělo, mysl, vztahy, radost
  - Odškrtávání
- [ ] **Confidence builders**
  - Seznam úspěchů
  - Pozitivní afirmace
  - "Bank síly" - čerpat v těžkých chvílích

**Kategorie materiálů (rozšířit):**
- Meditace → rozdělit: Body scan, Mindfulness, Loving-kindness
- Afirmace → rozdělit: Ráno, Večer, Před výzvou
- Cvičení → Physical, Mental, Emotional
- Reflexe → Journal prompts, Questions, Worksheets
- Ostatní

#### **9.2 Datová struktura pro nové typy**
- [ ] **Aktualizovat Material schema:**
  ```javascript
  {
    id: "uuid",
    type: "quiz", // nové typy
    title: "Kvíz: Jaký typ klientky jsi?",
    description: "Zjisti svůj typ",
    content: { // složitější struktura pro kvízy atd.
      questions: [
        {
          question: "Text otázky",
          options: ["A", "B", "C"],
          correctAnswer: 0 // index (volitelné)
        }
      ]
    },
    category: "reflection",
    subCategory: "quiz", // nové
    duration: 300, // odhadovaný čas (sekundy)
    difficulty: "beginner", // beginner, intermediate, advanced
    tags: ["sebevědomí", "osobnost"], // nové!
    createdAt: "ISO timestamp",
    updatedAt: "ISO timestamp" // nové!
  }
  ```

- [ ] **AddMaterialModal - multi-step wizard**
  - Krok 1: Vyber typ
  - Krok 2: Nahrát/vyplnit (podle typu)
  - Krok 3: Metadata (název, popis, kategorie, tagy)
  - Krok 4: Náhled

#### **9.3 Renderování nových typů**
- [ ] **QuizRenderer** komponenta
  - Otázky po jedné
  - Progress bar
  - Vyhodnocení na konci
- [ ] **TaskListRenderer**
  - Checkbox list
  - Odškrtávání s animací
  - Progress: "3/10 dokončeno"
- [ ] **JournalPromptRenderer**
  - Otázka + textarea
  - Auto-save
  - Možnost sdílet s koučkou
- [ ] **HabitTrackerRenderer**
  - Kalendář view
  - Streak counter
  - Oslavy při milestone (7, 30, 100 dní)
- [ ] **GoalTrackerRenderer**
  - Progress bar
  - Milníky s checkpointy
  - Motivační zprávy

---

### **Sprint 10: SDÍLENÍ MATERIÁLŮ + BALÍČKY SLUŽEB (2-3 dny)**

#### **9.1 Sdílení jednotlivých materiálů** - nové!
- [ ] **Share button na MaterialCard**
  - Generovat unikátní kód (6místný)
  - QR kód
  - Kopírovat link
- [ ] **MaterialShareModal**
  - QR kód
  - Link: coachpro.cz/m/ABC123
  - Sdílet přes WhatsApp/Email
- [ ] **Public material view**
  - Route: `/m/:code`
  - Zobrazit materiál bez přihlášení
  - "Od koučky XYZ"
  - CTA: "Chceš víc? Kontaktuj koučku"
- [ ] **Tracking**
  - Počet otevření materiálu
  - Koučka vidí statistiky

#### **9.2 Balíčky služeb (Service Packages)** - nové!
- [ ] **Datová struktura:**
  ```javascript
  {
    id: "uuid",
    coachId: "uuid",
    name: "Základní balíček",
    description: "7 dní programu + 1x zpětná vazba",
    price: 1500,
    currency: "CZK",
    duration: 7, // dní
    includes: {
      programAccess: true,
      programIds: ["uuid"], // které programy zahrnuje
      feedbackCount: 1, // kolik zpětných vazeb
      feedbackType: "text", // "text", "voice", "video", "call"
      feedbackDeadline: "24h", // do kdy odpovíme
      whatsappSupport: false,
      emailSupport: true,
      customMaterials: false, // může klientka požádat o custom materiály
      liveSessions: 0, // počet live callů
      liveSessionDuration: 0, // minuty
      extras: [
        "Přístup k privátní FB skupině",
        "Měsíční newsletter"
      ]
    },
    active: true,
    createdAt: "ISO timestamp"
  }
  ```

- [ ] **PackagesList stránka** (pro koučku)
  - Grid balíčků
  - Přidat/upravit/smazat
  - Aktivovat/deaktivovat

- [ ] **AddPackageModal**
  - Název, popis, cena
  - Co zahrnuje (checkboxy)
  - Vyber programy

- [ ] **PublicCoachProfile - zobrazit balíčky**
  - Pricing karty
  - "Mám zájem" CTA
  - Kontaktní formulář s výběrem balíčku

- [ ] **Klientka si vybere balíček při registraci**
  - Uložit `packageId` do Client object
  - Zobrazit info o balíčku v DailyView

---

### **Sprint 12: KLIENTKA - NOVÉ FUNKCE (3-4 dny)**

#### **10.1 Onboarding klientky - "Moje PROČ"** - nové!
- [ ] **ClientOnboarding komponenta**
  - Krok 1: Základní info (jméno, email)
  - **Krok 2: Definuj svoje PROČ**
    - "Proč jdeš do koučinku?"
    - "Co očekáváš?"
    - "Kam směřuješ?"
    - Textarea (500 znaků)
  - Krok 3: Vstup do programu
- [ ] **Uložit do Client object:**
  ```javascript
  {
    whyStatement: {
      why: "Text...",
      expectations: "Text...",
      direction: "Text..."
    }
  }
  ```
- [ ] **Zobrazit v Dashboard klientky**
  - Card "Moje PROČ"
  - Možnost upravit
  - Připomenutí v těžkých chvílích

#### **10.2 Poznámky klientky** - nové!
- [ ] **Notes komponenta v DailyView**
  - Textarea pro poznámky
  - Auto-save (debounced)
  - Historie poznámek (podle dne)
- [ ] **Notes archive stránka**
  - Všechny poznámky
  - Filtrovat podle data/programu
  - Exportovat jako PDF
  - Vyhledávání
- [ ] **Sdílení poznámek s koučkou** (volitelné)
  - Checkbox: "Sdílet s koučkou"
  - Koučka vidí v ClientDetail

#### **10.3 Úkoly + žádost o zpětnou vazbu** - nové!
- [ ] **Task system:**
  - Koučka přiřadí úkol k dni
  - Klientka vyplní odpověď
  - **Tlačítko "Požádat o zpětnou vazbu"**
- [ ] **Žádost o zpětnou vazbu:**
  - Podle balíčku (kolik má credits)
  - Formulář:
    - Úkol (pre-filled)
    - Moje odpověď
    - Konkrétní otázka pro koučku
  - Status: Čeká, Odpovězeno
- [ ] **Notifikace pro koučku**
  - "Jana žádá o zpětnou vazbu"
  - Dashboard widget
- [ ] **Koučka odpovídá:**
  - Text, voice note, nebo video
  - Deadline podle balíčku (24h, 48h atd.)
  - Oznámení klientce

#### **10.4 Certifikát pro klientku** - rozšíření!
- [ ] **Certificate generator - upgrade:**
  - Šablona s branding CoachPro
  - Pole:
    - Jméno klientky
    - Název programu
    - Datum dokončení
    - **Podpis koučky** (z profilu)
    - Koučka: Jméno + certifikace
  - Export jako PNG/PDF
- [ ] **Certificate modal po dokončení**
  - Oslava s konfety
  - Náhled certifikátu
  - Tlačítko "Stáhnout"
  - Sdílet na sociálních sítích
- [ ] **Certificate gallery pro klientku**
  - Stránka se všemi certifikáty
  - Historie úspěchů

---

### **Sprint 13: FILE MANAGEMENT + LIMITS (2 dny)**

#### **11.1 Omezení velikosti souborů** - nové!
- [ ] **Nastavit limity podle tiers:**
  - **Free tier:**
    - Max 10 MB per soubor
    - Max 100 MB celkem
  - **Pro tier:**
    - Max 50 MB per soubor
    - Max 1 GB celkem (Supabase)
  - **Test tier:**
    - Max 5 MB per soubor
    - Max 50 MB celkem
- [ ] **Validace před uploadem:**
  - Zkontrolovat velikost
  - Zkontrolovat celkové využití
  - Error: "Překročen limit. Zvažte upgrade nebo smažte stará data."
- [ ] **Progress bar při uploadu:**
  - Procenta (0-100%)
  - Velikost (MB/MB)
  - Zrušit upload

#### **11.2 Motivace k cloud storage** - nové!
- [ ] **Toast po uploadu:**
  - "Tip: Uložte videa na YouTube nebo Google Drive a přidejte link 💡"
- [ ] **Info card v AddMaterialModal:**
  - "💡 Doporučujeme nahrávat velké soubory na cloud:"
  - YouTube (videa)
  - Google Drive (PDF, audio)
  - Spotify (audio)
  - Odkaz: "Jak na to?"
- [ ] **Tutorial: Jak nahrát na cloud**
  - Step-by-step návod
  - Screenshots
  - Video tutorial

#### **11.3 Kontrola duplicity** - nové!
- [ ] **Detekce duplicitních materiálů:**
  - Stejný název + typ
  - Warning: "Materiál s tímto názvem už existuje. Chceš pokračovat?"
  - Možnost přejmenovat
- [ ] **Detekce duplicitních programů:**
  - Stejný název
  - Možnost klonovat program místo duplicity
- [ ] **Detekce duplicitních souborů (hash):**
  - Pokud 2 soubory mají stejný MD5 hash
  - Info: "Tento soubor už je nahraný jako 'Meditace ranní'. Chceš použít ten?"

---

## 🎨 PRIORITY 2 - SHOULD HAVE (Sprinty 12-17)

### **Sprint 14: UX IMPROVEMENTS + THEMING (2-3 dny)**

#### **14.1 Systém barevných schémat (jako v PaymentsPro)**
- [ ] **ThemeContext - import z PaymentsPro:**
  - Použít stejný systém jako v my-paymentspro-app
  - Color palettes: `nature`, `ocean`, `sunset`, `minimal`, atd.
  - Support pro custom barvy
- [ ] **Theme switcher v Settings:**
  - Dropdown s náhledy barevných schémat
  - Live preview (okamžitá změna)
  - Uložit volbu do localStorage
- [ ] **Aplikovat themes:**
  - Všechny komponenty používají theme colors
  - Primary, secondary, accent colors
  - Gradient backgrounds
  - Border radius z theme

#### **14.2 Dark Mode**
- [ ] **Dark mode toggle:**
  - Switch v Settings nebo Header
  - Ikona: Slunce (light) / Měsíc (dark)
  - Uložit preference do localStorage
- [ ] **Dark mode theme:**
  - Dark backgrounds (grays, near-black)
  - Light text colors
  - Adjusted shadows a borders
  - Glassmorphism v dark mode
- [ ] **Auto-detect system preference:**
  - `prefers-color-scheme: dark`
  - Možnost override (force light/dark)

#### **14.3 Dashboard - rychlé akce na 1 klik**
- [ ] **Quick actions na Dashboard:**
  - "Přidat materiál" → otevře AddMaterialModal rovnou
  - "Vytvořit program" → otevře ProgramEditor rovnou
  - "Přidat klientku" → otevře ClientEntry (admin mode)
  - Místo navigace na další stránku → okamžitá akce
- [ ] **Floating Action Button (FAB):**
  - Sticky button v pravém dolním rohu
  - Hlavní akce podle kontextu stránky
  - Mobile-friendly

#### **14.4 Automatické datum - Materiály**
- [ ] **Material object - přidat pole:**
  ```javascript
  {
    createdAt: "ISO timestamp",
    updatedAt: "ISO timestamp", // když editováno
  }
  ```
- [ ] **Zobrazit datum na MaterialCard:**
  - "Přidáno: 28. 10. 2025"
  - Nebo relativní: "před 2 dny"
  - Malý text pod názvem
- [ ] **Filtr podle data:**
  - V MaterialsLibrary
  - Nejnovější / Nejstarší
  - Tento týden / měsíc

#### **14.5 Automatické datum - Programy**
- [ ] **Program object - přidat pole:**
  ```javascript
  {
    createdAt: "ISO timestamp",
    updatedAt: "ISO timestamp",
  }
  ```
- [ ] **Zobrazit datum na ProgramCard:**
  - "Vytvořeno: 28. 10. 2025"
  - Relativní datum
- [ ] **Filtr podle data:**
  - V ProgramsList
  - Nejnovější / Nejstarší

---

### **Sprint 16: VYHLEDÁVÁNÍ + ŘAZENÍ + FILTRY (2 dny)**

#### **12.1 Globální vyhledávání** - nové!
- [ ] **Search bar v Headeru**
  - Hledej v materiálech, programech, klientkách
  - Live suggestions
  - Klávesová zkratka: Cmd/Ctrl + K
- [ ] **Search results stránka**
  - Tabs: Materiály | Programy | Klientky
  - Highlight matched text
  - Filtr podle typu

#### **12.2 Řazení (Sorting)** - nové!
- [ ] **MaterialsLibrary:**
  - Řadit podle:
    - Abecedy (A-Z, Z-A)
    - Datum vytvoření (nejnovější, nejstarší)
    - Typ
    - Kategorie
    - Velikosti souboru
    - Nejvíc používané
  - Dropdown menu v headeru
- [ ] **ProgramsList:**
  - Řadit podle:
    - Abecedy
    - Datum vytvoření
    - Délky programu
    - Počtu klientek
- [ ] **ClientsList:**
  - Řadit podle:
    - Abecedy
    - Pokroku (%)
    - Poslední aktivity
    - Streaku

#### **12.3 Pokročilé filtry** - nové!
- [ ] **MaterialsLibrary - sidebar s filtry:**
  - Typ (checkboxy)
  - Kategorie (checkboxy)
  - Tagy (chips)
  - Velikost souboru (slider)
  - Datum vytvoření (date range)
  - Použito v programech (ano/ne)
- [ ] **ProgramsList - filtry:**
  - Délka (7, 14, 21, 30 dní)
  - Aktivní/neaktivní
  - Počet klientek (0, 1-5, 6-10, 11+)
- [ ] **ClientsList - filtry:**
  - Status (aktivní, dokončené, paused)
  - Program
  - Balíček
  - Datum registrace

#### **12.4 Datum a čas vytvoření v detailech** - nové!
- [ ] **MaterialDetail:**
  - Vytvořeno: DD. MM. YYYY HH:mm
  - Upraveno: DD. MM. YYYY HH:mm (pokud bylo)
  - Použito v X programech
- [ ] **ProgramDetail:**
  - Vytvořeno: DD. MM. YYYY HH:mm
  - Upraveno: DD. MM. YYYY HH:mm (pokud bylo)
  - Počet klientek: X
  - Dokončeno: X klientek
- [ ] **ClientDetail:**
  - Registrována: DD. MM. YYYY HH:mm
  - Poslední aktivita: DD. MM. YYYY HH:mm
  - Celkový čas v aplikaci: X hodin

---

### **Sprint 17: NÁPOVĚDA (HELP SYSTEM) (2-3 dny)** - nové!

#### **13.1 Tooltips & Onboarding**
- [ ] **Tooltips na všech tlačítkách**
  - "Co tohle dělá?"
  - Klávesová zkratka (pokud existuje)
- [ ] **First-time onboarding tour**
  - Pro koučku: 5 kroků
    1. Přidej první materiál
    2. Vytvoř program
    3. Sdílej s klientkou
    4. Sleduj pokrok
    5. Připrav balíček
  - Pro klientku: 3 kroky
    1. Definuj PROČ
    2. Začni první den
    3. Zapisuj poznámky
  - Použít: react-joyride nebo intro.js

#### **13.2 Help centrum**
- [ ] **"/help" stránka**
  - FAQ (Často kladené otázky)
  - Videonávody
  - Textové návody s screenshots
  - Kategorie:
    - Začínáme
    - Materiály
    - Programy
    - Klientky
    - Balíčky
    - Certifikáty
    - Troubleshooting
- [ ] **Kontextová nápověda**
  - Ikona "?" vedle složitých funkcí
  - Modal s vysvětlením
  - Příklady použití

#### **13.3 Inline help & Validace**
- [ ] **Nápověda přímo ve formulářích:**
  - "Doporučená délka: 50-80 znaků"
  - "Tip: Používej aktivní hlas"
  - "Příklad: 7 dní k sebevědomí"
- [ ] **Smart validace:**
  - "Název je moc krátký. Doporučujeme alespoň 5 znaků."
  - "Tento email je neplatný."
  - "Soubor je moc velký (max 10 MB)."

---

### **Sprint 18: MOBILE OPTIMALIZACE (2-3 dny)**

#### **14.1 Touch-friendly UI** - nové!
- [ ] **Testování na zařízeních:**
  - iPhone (Safari)
  - Android (Chrome)
  - iPad (Safari)
  - Tablet (Chrome)
- [ ] **Touch gestures:**
  - Swipe na kartách (delete/edit)
  - Pull to refresh
  - Long press pro context menu
- [ ] **Velikosti tlačítek:**
  - Min 44x44px (Apple HIG)
  - Spacing mezi tlačítky
- [ ] **Sticky elements:**
  - Header sticky
  - FAB (Floating Action Button) pro hlavní akce
  - Bottom navigation (alternativa k sidebaru)
- [ ] **Modals optimalizace:**
  - Slide from bottom (mobilní styl)
  - Swipe down to close

#### **14.2 Performance na mobilu**
- [ ] **Lazy loading obrázků:**
  - Použít IntersectionObserver
  - Placeholder (blur)
- [ ] **Virtual scrolling:**
  - Pro dlouhé listy (react-window)
  - MaterialsList, ClientsList
- [ ] **Code splitting:**
  - Route-based splitting
  - Component lazy loading
- [ ] **Service Worker:**
  - Offline mode (základní)
  - Cache materiálů

---

### **Sprint 19: DASHBOARD & STATISTIKY (2 dny)**

#### **15.1 Dashboard pro koučku - upgrade**
- [ ] **4 statistické karty:**
  - Aktivní klientky (+ change %)
  - Materiály celkem
  - Dokončené programy
  - Tento měsíc: Nové klientky
- [ ] **Graf aktivity:**
  - Line chart: Poslední 7/30 dní
  - Dokončené dny klientkami
- [ ] **Notifikace feed:**
  - "Jana dokončila den 3! 🎉"
  - "Markéta žádá o zpětnou vazbu"
  - "Nová klientka se registrovala"
- [ ] **Quick actions:**
  - Tlačítka: "Přidat materiál", "Vytvořit program"
  - Poslední 5 klientek s progress barem
- [ ] **Usage monitor:**
  - Využití localStorage/Supabase
  - Progress bar (barva podle %)

#### **15.2 Dashboard pro klientku - upgrade**
- [ ] **Hero sekce:**
  - Motivační citát dne
  - Aktuální streak 🔥
  - Progress: "Den 5/7"
- [ ] **Dnešní úkoly:**
  - Checklist
  - Odhadovaný čas
- [ ] **Moje PROČ karta:**
  - Připomenutí
  - Možnost upravit
- [ ] **Statistiky:**
  - Celkem dokončených dní
  - Celkový čas v aplikaci
  - Nálada tento týden (mood chart)

---

## 💡 PRIORITY 3 - NICE TO HAVE (Sprinty 19-21)

### **Sprint 20: GAMIFIKACE & MOTIVACE (2 dny)**

- [ ] **Achievements (Odznáčky):**
  - "První krok" - dokončen den 1
  - "Týdenní válečnice" - 7 dní streak
  - "Měsíční hrdinka" - 30 dní streak
  - "Reflector" - 10 journal entries
  - "Go-getter" - dokončeno 5 programů
  - Badge gallery v profilu klientky

- [ ] **Levels & XP:**
  - Klientka získává body za aktivity
  - Level up každých X bodů
  - Unlock nových features

- [ ] **Leaderboard (volitelné):**
  - Top 10 klientek (anonymní nebo se souhlasem)
  - Motivace skrze soutěživost

- [ ] **Daily motivational quote:**
  - Rotující citáty
  - Database s 365 citáty
  - Možnost koučky přidat vlastní

- [ ] **Celebration animations:**
  - Konfety (už máme)
  - Fireworks
  - Balloons
  - Sparkles

---

### **Sprint 21: POKROČILÉ FEATURES (2-3 dny)**

- [ ] **Import/Export:**
  - Export materiálů jako ZIP
  - Export programu jako JSON
  - Import materiálů z jiné koučky (sdílení mezi koučkami)

- [ ] **Verzování programů:**
  - "Program v1", "Program v2"
  - Možnost vrátit se k předchozí verzi
  - Changelog

- [ ] **Templates marketplace (zdarma):**
  - Sdílení programů mezi koučkami
  - Rating & reviews
  - Kategorie: Sebevědomí, Kariéra, Vztahy atd.

- [ ] **Bulk operace:**
  - Bulk delete materiálů
  - Bulk export
  - Bulk přiřazení tagů

- [ ] **Advanced analytics:**
  - Které materiály jsou nejúspěšnější
  - Průměrná doba dokončení programu
  - Drop-off rate (na kterém dni klientky končí)
  - Heat map aktivity

---

### **Sprint 22: UX POLISH & MICRO-ANIMATIONS (1-2 dny)**

- [ ] **Loading states:**
  - Skeleton loaders (místo spinnerů)
  - Shimmer efekt
  - Progress bars s odhady

- [ ] **Hover efekty:**
  - Scale transform
  - Shadow elevate
  - Color transitions

- [ ] **Page transitions:**
  - Fade in/out
  - Slide animations
  - Smooth scrolling

- [ ] **Toast notifications upgrade:**
  - Success: Zelená s checkmarkem
  - Error: Červená s X
  - Info: Modrá s i
  - Warning: Oranžová s !
  - Action button: "Undo", "View"

- [ ] **Empty states:**
  - Ilustrace + text
  - CTA tlačítko
  - Místo prázdného listu

---

## 🚀 FÁZE 2 - PO ÚSPĚŠNÉM MVP

### **AI Features (vyžaduje Anthropic API)**

- [ ] **AI generátor afirmací:**
  - Zadej téma → dostaneš 7 afirmací
  - Možnost upravit a uložit
- [ ] **AI generátor programů:**
  - Zadej cíl klientky → AI navrhne strukturu 7/14 dní
  - Navrhne materiály (koučka pak vybere vlastní)
- [ ] **AI asistent pro popis materiálů:**
  - Nahraje audio → AI transkribuje + vytvoří popis
- [ ] **AI mood analyzer:**
  - Analyzuje journal entries klientky
  - Insight: "Tento týden jsi měla nízkou energii ve středu"
- [ ] **AI chat pro koučku:**
  - "Jak vytvořit program pro burnout?"
  - "Doporučené materiály pro sebevědomí?"

---

### **Backend & Real-time Features**

- [ ] **Supabase Auth:**
  - Google OAuth
  - Email + password
  - Magic link
- [ ] **Supabase Realtime:**
  - Live notifikace
  - Live sledování pokroku klientky
- [ ] **Email notifikace:**
  - Registrace klientky
  - Denní reminder
  - Dokončení programu
  - Žádost o zpětnou vazbu
- [ ] **Push notifikace:**
  - Browser push
  - Denní reminder: "Nezapomeň na meditaci 🧘‍♀️"
- [ ] **SMS notifikace (volitelné):**
  - Twilio integrace
  - Důležité upozornění

---

### **Integrace & Kalendář**

- [ ] **Calendly integrace:**
  - Koučka propojí Calendly účet
  - Iframe v PublicCoachProfile
  - Automatické přidání do CRM
- [ ] **Google Calendar sync:**
  - Export programu do kalendáře
  - Připomínky v Gcal
- [ ] **Zoom integrace:**
  - Vytvoř meeting link
  - Automaticky pošli klientce
- [ ] **Stripe integrace (platby):**
  - Klientka platí balíček přímo v aplikaci
  - Koučka dostává peníze (mínus fee)
  - Faktury automaticky

---

### **White-labeling & Premium**

- [ ] **Custom branding (Pro tier):**
  - Vlastní logo
  - Vlastní barvy
  - Vlastní doména (coaching.lenna.cz)
- [ ] **Custom email template:**
  - Email notifikace s branding koučky
- [ ] **Removal of CoachPro branding:**
  - "Powered by CoachPro" volitelné

---

### **Community & Social**

- [ ] **Koučky forum:**
  - Sdílení tipů
  - Q&A
  - Peer support
- [ ] **Referral program:**
  - Doporuč aplikaci → slevy/bonusy
- [ ] **Instagram Stories integration:**
  - Automatické šablony pro sdílení
  - "Moje klientka dokončila program! 🎉"

---

## 🔧 TECHNICKÉ ÚKOLY (průběžně)

### **Development Workflow**

**VŽDY DODRŽOVAT TYTO PRAVIDLA:**

- [ ] **Kontrolovat a odstranit starý kód:**
  - Po každé změně zkontrolovat, zda není zakomentovaný kód
  - Smazat staré imports, které se už nepoužívají
  - Odstranit console.log() statements
  - Smazat TODO komentáře po implementaci
  - **NIKDY** nenechávat zakomentovaný kód v produkci

- [ ] **Vždy myslet a implementovat modulárně:**
  - Komponenty by měly být znovupoužitelné
  - DRY principle (Don't Repeat Yourself)
  - Single Responsibility Principle
  - Sdílené utility funkce v @shared/utils
  - Sdílené komponenty v @shared/components
  - Sdílené constants v @shared/constants
  - Custom hooks pro opakovanou logiku
  - **DigiPro ekosystém:** Komponenty použitelné napříč CoachPro, PaymentsPro, atd.

- [ ] **Testovat funkčnost po každé změně:**
  - Otestovat v prohlížeči (Chrome, Safari, Firefox)
  - Otestovat na mobile (responsive)
  - Zkontrolovat console pro errory
  - Zkontrolovat Network tab pro failed requests
  - Otestovat edge cases

- [ ] **🎨 GLASSMORPHISM PATTERNS (ze Sprintu 9):**
  - ❌ **NIKDY nepoužívat glassmorphism na běžných kartách na stránce!**
    - Backdrop-filter potřebuje vrstvu "za" elementem
    - Na kartě na stránce není co rozmazat
  - ✅ **Glassmorphism JEN na modaly a dialogy:**
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

- [ ] **⚠️ MUI sx prop PRAVIDLA (ze Sprintu 9):**
  - ❌ **Spread operator NEFUNGUJE s backdrop-filter:**
    ```javascript
    // ❌ NEFUNGUJE
    <Card sx={{ ...glassCardStyles }} />

    // ✅ FUNGUJE
    <Card sx={glassCardStyles} />
    ```
  - **DŮVOD:** backdrop-filter je složitá CSS vlastnost a MUI ji nezvládá zpracovat při spreadu
  - **ŘEŠENÍ:** Aplikuj styly přímo bez spreadu, nebo použij sx={styles} místo sx={{...styles}}

- [ ] **🖼️ ServiceLogo komponenta PRAVIDLA (ze Sprintu 9):**
  - ⚠️ **Size prop MUSÍ BÝT numeric, ne responsive object!**
    ```javascript
    // ❌ NEFUNGUJE
    <ServiceLogo size={{ xs: 28, sm: 32 }} />

    // ✅ FUNGUJE
    const isVeryNarrow = useMediaQuery('(max-width:420px)');
    <ServiceLogo size={isVeryNarrow ? 28 : 32} />
    ```
  - **DŮVOD:** ServiceLogo je custom komponenta a nepodporuje MUI responsive objekty
  - **ŘEŠENÍ:** Použij useMediaQuery hook a ternary operator

- [ ] **📐 Grid Layout PRAVIDLA (ze Sprintu 9):**
  - ⚠️ **Grid spacing vytváří negativní marginy → potřebuje parent padding!**
    ```javascript
    // ❌ Bez parent paddingu = horizontal scroll
    <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>

    // ✅ S parent paddingem = správné zobrazení
    <Box sx={{ px: { xs: 1.5, sm: 2, md: 3 } }}>
      <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
    </Box>
    ```
  - **DŮVOD:** MUI Grid používá negativní marginy pro spacing
  - **ŘEŠENÍ:** Vždy přidat padding na parent container (stejná hodnota jako spacing)

- [ ] **✨ Glow efekty místo borders (ze Sprintu 9):**
  - ✅ **Preferovat glow efekty (boxShadow) místo ostrých borders:**
    ```javascript
    // ❌ Border - příliš ostré
    border: '2px solid',
    borderColor: 'primary.main'

    // ✅ Glow - modernější, soft
    boxShadow: '0 0 30px rgba(139, 188, 143, 0.25)'
    ```
  - Aplikovat na karty, tlačítka, focus states

- [ ] **🎯 TextField Focus efekty (ze Sprintu 9):**
  - ✅ **Pattern pro focus states:**
    ```javascript
    '&.Mui-focused': {
      boxShadow: '0 0 20px rgba(139, 188, 143, 0.15)',
      backgroundColor: isDark
        ? 'rgba(255, 255, 255, 0.08)'
        : 'rgba(0, 0, 0, 0.04)',
    }
    ```

- [ ] **🔗 PATH ALIASES - VŽDY používat!:**
  - ✅ **Vždy používat @ aliasy místo relativních cest:**
    ```javascript
    // ✅ SPRÁVNĚ
    import BORDER_RADIUS from '@styles/borderRadius';
    import { useGlassCard } from '@shared/hooks/useModernEffects';
    import ServiceLogo from '@modules/coach/components/shared/ServiceLogo';

    // ❌ ŠPATNĚ
    import BORDER_RADIUS from '../../../styles/borderRadius';
    import { useGlassCard } from '../../shared/hooks/useModernEffects';
    ```

- [ ] **💾 DATA PERSISTENCE - KRITICKÉ!:**
  - 🚨 **NIKDY neříkat "vymaž localStorage" bez varování o ztrátě dat!**
  - ✅ **VŽDY nabídnout backup před vymazáním:**
    - "Nejdřív zálohovat do cloudu"
    - "Exportovat jako JSON"
    - Teprve pak "Ano, vymazat vše"
  - ✅ **Auto-sync do Supabase** = ochrana proti ztrátě dat
  - ❌ **Data z vymazaného localStorage NELZE vrátit!**

---

### **Code Quality**

- [ ] **Odstranit console.log()** z kódu
- [ ] **Odstranit // TODO komentáře**
- [ ] **Odstranit zakomentovaný kód**
- [ ] **Přidat PropTypes** nebo migrace na TypeScript
- [ ] **Unit testy** (utility funkce)
- [ ] **E2E testy** (Playwright/Cypress)

---

### **Performance**

- [ ] **Lighthouse audit:**
  - Performance > 90
  - Accessibility > 95
  - Best Practices > 90
  - SEO > 90
- [ ] **Image optimization:**
  - WebP format
  - Lazy loading
  - Responsive images (srcset)
- [ ] **Bundle size optimization:**
  - Tree shaking
  - Code splitting
  - Dynamic imports
- [ ] **PWA:**
  - Service Worker
  - Offline mode
  - Add to Home Screen

---

### **Security**

- [ ] **Content Security Policy (CSP)**
- [ ] **HTTPS only**
- [ ] **Sanitize inputs** (XSS protection)
- [ ] **Rate limiting** (API calls)
- [ ] **Secure storage** (encrypt sensitive data)

---

### **Dokumentace**

- [ ] **README.md update** (kompletní)
- [ ] **CHANGELOG.md** (všechny verze)
- [ ] **API dokumentace** (až bude backend)
- [ ] **Component Storybook** (volitelné)
- [ ] **Video tutoriály:**
  - Jak vytvořit první program (5 min)
  - Jak nahrát materiály (3 min)
  - Jak sdílet program s klientkou (2 min)

---

## 📝 FINÁLNÍ CHECKLIST PRO LAUNCH

### **Pre-launch (1-2 týdny před)**
- [ ] Beta test s 10 koučkami
- [ ] Sběr feedbacku
- [ ] Bug fixing
- [ ] Performance optimization
- [ ] Příprava WP landing page
- [ ] Příprava marketingových materiálů
- [ ] VOP & GDPR schváleno právníkem

### **Launch Day**
- [ ] Deploy na Vercel
- [ ] Publikovat WP stránku
- [ ] Spustit marketing kampaň
- [ ] Monitoring errorů (Sentry)
- [ ] Být k dispozici pro support

### **Post-launch (první týden)**
- [ ] Denní monitoring errorů
- [ ] Sběr feedbacku od prvních uživatelek
- [ ] Hot-fix bugů
- [ ] Příprava updatu v1.1

---

## 🌍 REŠERŠE - CO LETÍ V ZAHRANIČÍ

### **Top koučovací aplikace:**
1. **BetterUp** - Corporate coaching
   - Features: Goals, Action plans, Skill assessments
2. **CoachHub** - B2B coaching platform
   - Features: Matching algorit

hm, Video sessions, Progress tracking
3. **Sounding Board** - Leadership coaching
   - Features: 360° feedback, Development plans
4. **Quenza** - Therapy + Coaching
   - Features: ⭐ Worksheets, ⭐ Pathway builder, ⭐ Expressive writing
5. **Practice Better** - Wellness coaches
   - Features: ⭐ Meal plans, ⭐ Habit tracking, Forms, Scheduling
6. **Nudge Coach** - Habit coaching
   - Features: ⭐ Daily check-ins, ⭐ Micro-actions, Chat
7. **Coach Catalyst** - Business coaches
   - Features: ⭐ Goal tracking, ⭐ Accountability partners, Reports

### **Populární materiály:**
- ✅ Worksheets (pracovní listy)
- ✅ Journal prompts (výzvy k psaní)
- ✅ Goal trackers
- ✅ Habit trackers
- ✅ Vision boards
- ✅ Values assessments (hodnotové dotazníky)
- ✅ Wheel of Life (kolo života)
- ✅ SMART goal templates
- ✅ Action plans
- ✅ Gratitude journals
- ✅ Breathing exercises
- ✅ Body scan meditations
- ✅ Guided visualizations
- ✅ Energy management tools
- ✅ Time audits
- ✅ Decision matrices
- ✅ Procrastination tools
- ✅ Self-care checklists
- ✅ Confidence builders

### **Co U NÁS ještě NENÍ:**
- [ ] **Pathway/Journey builder** - vizuální mapa cesty klientky
- [ ] **360° feedback** - zpětná vazba od rodiny/kolegů
- [ ] **Accountability partners** - párování klientek pro vzájemnou podporu
- [ ] **Micro-actions** - mini úkoly (5 min)
- [ ] **Daily check-in** - rychlý formulář (2 minuty)
- [ ] **Expressive writing** - terapeutické psaní
- [ ] **Skill assessments** - sebehodnocení dovedností
- [ ] **Development plans** - dlouhodobý plán rozvoje

**→ Přidat do Fáze 2!**

---

## 💡 VLASTNÍ NÁPADY (BONUS)

### **Feature #1: "Koučinkový kompas"**
- Vizuální mapa cesty klientky
- Milníky, odbočky, překážky
- Gamifikace: "Právě jsi prošla lesem pochybností 🌲"

### **Feature #2: "Kniha úspěchů"**
- Klientka zapisuje své wins (malé i velké)
- Export jako PDF - dárek po dokončení programu
- Připomenutí v těžkých chvílích

### **Feature #3: "Koučka AI asistent"**
- ChatGPT-like interface
- Odpovídá na otázky klientky mezi sezeními
- "Co dělat, když nemám motivaci?"
- Základní odpovědi, složité → eskalace na koučku

### **Feature #4: "Rodinný coaching"**
- Možnost přidat "podporovatele" (partner, rodič)
- Vidí progress klientky (se souhlasem)
- Může poslat povzbuzení

### **Feature #5: "Veřejný profil klientky"**
- Portfolio úspěchů (volitelné, anonymní)
- "Dokončila 5 programů, pomohlo jí to změnit kariéru"
- Marketing pro koučku

---

## 📅 ORIENTAČNÍ TIMELINE

### **Fáze 1: MVP (8-12 týdnů)**
- Sprint 7-11 (Priority 1): 6-8 týdnů
- Sprint 12-15 (Priority 2): 2-3 týdny
- Bug fixing & testing: 1 týden

### **Fáze 1.5: Polish (2-3 týdny)**
- Sprint 16-18 (Priority 3)
- UX improvements
- Performance optimization

### **Fáze 2: Advanced (6-12 měsíců)**
- AI features (4-6 týdnů)
- Backend & integrace (8-12 týdnů)
- White-labeling (4 týdny)
- Community (ongoing)

---

## 🚀 DOPORUČENÉ POŘADÍ IMPLEMENTACE

### **✅ HOTOVO:**
- ✅ Sprint 7 - Toast notifikační systém (1 den) - **28. 10. 2025**
- ✅ Sprint 8 - Critical bugs opravy (1 den) - **28. 10. 2025**
- ✅ Sprint 9 - Glassmorphism & UI polish (2 dny) - **28-29. 10. 2025**

### **🔥 PRIORITY 1 - NYNÍ:**
1. **🚨 Sprint 10** - MODULARITA + DATA PERSISTENCE + SPRÁVA KLIENTŮ (5-7 dní) - **CRITICAL!**
   - Oprava Supabase integrace
   - Auto-sync do cloudu
   - Backup & Recovery systém
   - DigiPro shared komponenty
   - Profil koučky + klientky s fotkou
   - Administrační systém pro správu klientů
   - **MUSÍ BÝT HOTOVO:** Před jakýmkoliv dalším vývojem!

### **🎯 PRIORITY 2 - NÁSLEDUJE:**
2. **Sprint 11** - Klientské rozhraní + Critical features (4-5 dní)
3. **Sprint 12** - Veřejný profil + 2 úrovně (5-7 dní)
4. **Sprint 13** - Nové typy materiálů (3-4 dny)
5. **Sprint 14** - Sdílení + balíčky (2-3 dny)
6. **Sprint 15** - Funkce pro klientku (3-4 dny)
7. **Sprint 16** - File management + limity (2 dny)
8. **Sprint 17** - Vyhledávání + řazení + filtry (2 dny)
9. **Sprint 18** - Nápověda (Help system) (2-3 dny)
10. **Sprint 19** - Mobile optimalizace (2-3 dny)
11. **Sprint 20** - Dashboard & statistiky upgrade (2 dny)

### **📅 FINÁLE:**
12. **Beta testing** (1 týden)
13. **Bug fixing** (3-5 dní)
14. **Performance optimization** (2 dny)
15. **Launch!** 🎉

### **⏱️ ODHADOVANÝ ČAS DO LAUNCH:**
- Sprint 10 (CRITICAL): 5-7 dní
- Sprinty 11-20: 30-40 dní
- Beta + fixing: 10-12 dní
- **CELKEM: ~50-60 dní (8-10 týdnů)**

---

## ❓ OTÁZKY A AKČNÍ KROKY

### **🔥 IMMEDIATE - Sprint 10:**

1. **Supabase Debug Session:**
   - [ ] Zkontrolovat `.env` soubor - jsou správné credentials?
   - [ ] Otevřít Supabase dashboard - je projekt aktivní?
   - [ ] Zkontrolovat Storage bucket - existuje?
   - [ ] Testovat upload funkci - jaká je error message?
   - [ ] **Kdy můžeme udělat debugging session?**

2. **PaymentsPro Komponenty:**
   - [ ] Kde je PaymentsPro projekt? (`/Users/lenkaroubalova/Documents/Projekty/my-paymentspro-app`)
   - [ ] Které komponenty můžeme okamžitě znovupoužít?
   - [ ] Máš access k PaymentsPro kódu?

3. **DigiPro Ekosystém:**
   - [ ] Schválení struktury `/src/shared/digipro/`
   - [ ] Naming convention: "DigiPro" nebo jiný název?
   - [ ] Chceš separátní npm package nebo jen folder?

### **📋 PLANNING:**

4. **Ceny balíčků:** Máš představu? (např. Free: 0 Kč, Basic: 1500 Kč, Pro: 3500 Kč)
5. **WordPress:** Budeš dělat sama nebo někdo jiný?
6. **Beta test:** Znáš 10 kouček, které by to otestovaly?
7. **Timeline:** Je 8-10 týdnů do launch realistických pro tebe?

### **🎯 DECISION NEEDED:**

8. **Začít Sprint 10 hned nebo ještě něco jiného?**
9. **Priorities v rámci Sprint 10:**
   - A) Supabase oprava FIRST (data persistence)
   - B) Profily FIRST (coach + client)
   - C) Modularita FIRST (DigiPro foundation)
   - **Tvoje volba?**

---

## ✅ **MASTER TODO V2.0 - UPDATE 29. 10. 2025**

### **📝 Změny v této aktualizaci:**
- ✅ Sprint 9 (Glassmorphism & UI Polish) označen jako HOTOVO
- ✅ Přidán Sprint 10 (MODULARITA + DATA PERSISTENCE + SPRÁVA KLIENTŮ) - **PRIORITY 1!**
- ✅ Všech 6 tvých připomínek zapracováno:
  1. Modularita - DigiPro ekosystém foundation
  2. Správa klientů - samo-registrace + ruční přidání
  3. Data persistence - Supabase debug + auto-sync
  4. Data recovery - konstatování (nelze vrátit) + prevence
  5. Profil koučky - import z PaymentsPro
  6. Profil klientky - import z PaymentsPro
- ✅ Lessons learned ze Sprintu 9 přidány do Development Workflow
- ✅ Technické patterns (glassmorphism, grid layout, ServiceLogo, atd.)
- ✅ Kritická pravidla pro data persistence
- ✅ Aktualizováno doporučené pořadí implementace
- ✅ Timeline přepočítán (50-60 dní do launch)

### **📊 Statistiky:**
- **Hotových sprintů:** 3 (Sprint 7, 8, 9)
- **Čekajících sprintů:** 17+
- **Celkem úkolů:** 250+
- **Kritických priorit:** Sprint 10 (5-7 dní)
- **Odhadovaný čas do MVP:** 8-10 týdnů

### **🎯 Next Steps:**
1. Review Sprint 10 úkolů
2. Rozhodnout o prioritách (Supabase / Profily / Modularita)
3. Zahájit debugging session
4. Start implementation! 💪

---

## 📋 Sprint 9 - Session 6: Grid Layout & MaterialCard Redesign (30. 10. 2025)

**Datum:** 30. října 2025, odpoledne/večer
**Status:** ✅ DOKONČENO (po velkých komplikacích)
**AI asistent:** Claude Sonnet 4.5 (problémy) + Opus (dokončení)
**Trvání:** ~2.5 hodiny (mělo být 30 minut)

### ❌ CO SE NEPOVEDLO (CRITICAL LESSONS!)

#### 1. 🚨 GIT CHECKOUT BEZ DISKUZE
**Kritická chyba:**
- Claude viděl JSX error v MaterialCard.jsx
- Bez diskuze provedl: `git checkout HEAD -- MaterialCard.jsx`
- **SMAZAL celou dnešní práci** na MaterialCard layout redesign
- Ztraceno ~300+ řádků kódu

**Důsledek:**
- Museli jsme re-implementovat celý layout znovu
- Ztráta času ~45 minut

**Lesson:**
- ✅ **NIKDY git operace bez explicitního souhlasu!**
- ✅ VŽDY se zeptat: "Můžu zkusit git checkout, nebo máš jiný nápad?"

#### 2. 📦 ZTRÁTA UNCOMMITTED PRÁCE
- 1102 řádků uncommitted changes v 8 souborech
- MaterialCard.jsx změny ztraceny git checkoutem
- Museli jsme vytvořit WIP commit (bab163c)

#### 3. 🔄 GIT PUSH PROBLÉM
- Commit 3623c55 nebyl pushnutý na GitHub (Claude v minulé session řekl že ano)
- Matoucí situace - lokálně vidět, na GitHubu ne
- Museli jsme zpětně pushnout

#### 4. 👂 NEPOSLOUCHÁNÍ ZADÁNÍ
**První pokus - špatný:**
```
[Chip] [Ikona/Logo]
[VELKÁ IKONA + Text] [Akční ikony]  ❌ Velká ikona vlevo!
```

**Správně (co uživatelka chtěla):**
```
[Chip] [Ikona/Logo]
[Text na plnou šířku] [Akční ikony]  ✅ ŽÁDNÁ velká ikona vlevo!
```

#### 5. 🔁 6 POKUSŮ O STEJNOU VÝŠKU KARET
- **Pokus #1:** Grid item display flex → ❌ velké mezery
- **Pokus #2:** Odstranění display flex → ❌ různé výšky
- **Pokus #3:** motion.div height 100% → ❌ pořád různé
- **Pokus #4:** CardContent flex + flexGrow → ❌ různé řádky gridu
- **Pokus #5:** Fixní počet řádků + minHeight na texty → ❌ lepší, ale ne dost
- **Pokus #6:** `minHeight: 280` na Card → ✅ **KONEČNĚ FUNGUJE!**

**Proč 6 pokusů?**
- ❌ Neporovnal jsem s working příkladem (ProgramsList) od začátku
- ❌ Vymýšlel jsem vlastní řešení místo kopírování fungujícího patternu
- ❌ Nerozuměl jsem CSS Grid row sizing

#### 6. 🐌 POMALOST
**Uživatelka:**
- "co se děje? Každý krok ti trvá nesmírně dlouho!"
- "máš špatné připojení nebo co se pořád děje?"

**Problém:**
- Četl dlouhé soubory (100+ řádků)
- Grepal různé patterny
- Analyzoval řádek po řádku
- Pomalé iterace

**Řešení:**
- ✅ Podívat se na WORKING příklad (ProgramsList)
- ✅ Zkopírovat PŘESNĚ stejný pattern
- ✅ Aplikovat rychle

#### 7. 🎯 IGNOROVÁNÍ TYPU PROBLÉMU
**Špatná diagnóza:**
- Myslel jsem, že problém je v Card (flex, height, padding)

**Reálný problém:**
- CSS Grid - každý řádek má výšku podle nejvyššího prvku
- **Řešení:** minHeight na Card

### ✅ CO SE NAKONEC POVEDLO

#### 1. Git Status Vyřešen
- ✅ Commit 3623c55 pushnut na GitHub
- ✅ Uncommitted práce v WIP commitu bab163c
- ✅ Nic neztraceno (kromě původní MaterialCard)

#### 2. MaterialCard Layout Redesign
- ✅ **Ikona/logo vpravo nahoře** (proklikávací) - pro VŠECHNY typy
- ✅ **2 sloupce místo 3** (text + akční ikony)
- ✅ **Modular button functions** (createIconButton())
- ✅ **Stejná výška všech karet** (minHeight: 280)
- ✅ **Fixní počet řádků** (nadpis 2, popis 2)
- ✅ **Popis VŽDY zobrazený** (i prázdný)

#### 3. Grid Layout 4 Sloupce
- ✅ `lg={3}` přidáno do MaterialsLibrary, ProgramsList, ClientsList
- ✅ 4 karty vedle sebe na obrazovkách 1200px+

#### 4. Grid Mezery Opraveny
- ✅ Odstraněn `display: 'flex'` z Grid item
- ✅ `motion.div` s `height: '100%'`
- ✅ Normální mezery jako v Programech

### 🎓 LESSONS LEARNED (CRITICAL PRO BUDOUCNOST!)

1. **NIKDY git operace bez diskuze**
   - ❌ git checkout, git reset, git rebase = VŽDY zeptat se PŘEDEM
   - ✅ "Můžu zkusit X, nebo máš jiný nápad?"

2. **Testuj working příklad PRVNÍ**
   - ❌ Vymýšlet vlastní řešení
   - ✅ Najít working příklad → zkopírovat pattern → aplikovat

3. **Rychlost > Analýza**
   - ❌ Číst 100 řádků, grepit 5 patternů
   - ✅ Rychlý pohled na příklad → copy → done

4. **CSS Grid chování**
   - Grid rows = výška nejvyššího prvku
   - **Řešení:** minHeight na všechny items

5. **Komunikuj problémy okamžitě**
   - ❌ "Zkusím 5 řešení sám"
   - ✅ "Tohle nefunguje. X nebo Y?"

6. **Respektuj user feedback na 1. pokus**
   - ❌ Zkusit stejné 3× doufajíc
   - ✅ Když "ne" → okamžitě změnit

### 📊 Časová Statistika
- ⏱️ Git problémy: ~30 minut
- ⏱️ Re-implementace MaterialCard: ~45 minut
- ⏱️ Debugging stejné výšky: ~40 minut (6 pokusů!)
- ⏱️ Grid layout & mezery: ~20 minut
- **Celkem: ~2.5 hodiny**

**Co jsme mohli:**
- Kdyby jsme zkopírovali ProgramsList pattern od začátku → **30 minut max**

### 📁 Upravené Soubory
- `MaterialCard.jsx` - kompletní layout redesign
- `MaterialsLibrary.jsx` - Grid lg={3}
- `ProgramsList.jsx` - Grid lg={3}
- `ClientsList.jsx` - Grid lg={3}

---

## 📋 Sprint 9.5: Loading States & UX Polish (31. 10. 2025)

**Datum:** 31. října 2025
**Status:** 🔄 IN PROGRESS
**AI asistent:** Claude Sonnet 4.5

### 🎯 Cíl:
Implementovat loading states pro všechny async operace (Supabase upload/delete) a přidat skeleton loaders.

### 🐛 Nalezené problémy:

#### ❌ CRITICAL BUG #1: MaterialCard - Race Condition
**Soubor:** `/src/modules/coach/components/coach/MaterialCard.jsx` (line 57-61)

**Problém:**
```javascript
const handleDeleteConfirm = () => {
  deleteMaterial(material.id);  // ❌ async funkce bez await!
  onUpdate();
  setDeleteDialogOpen(false);
};
```

- `deleteMaterial` je async (maže ze Supabase 1-2 sekundy)
- Není awaited → race condition
- Dialog se zavře okamžitě, ale mazání ještě běží
- Uživatel nevidí zpětnou vazbu
- Pokud mazání selže, uživatel se to nedozví

**Řešení:**
- Přidat `isDeleting` state
- Await `deleteMaterial`
- Zobrazit CircularProgress spinner
- Disable tlačítka během mazání
- Chytit errory a nechat dialog otevřený při chybě

#### ✅ CO JE UŽ HOTOVO:
- **AddMaterialModal.jsx** - má správné loading states:
  - `loading` state
  - Tlačítko disabled během uploadu
  - CircularProgress spinner
  - Text "Ukládám..."

#### ❌ CO JEŠTĚ CHYBÍ:
1. **MaterialCard.jsx** - opravit delete race condition
2. **ProgramEditor.jsx** - přidat loading pro save/delete
3. **ProgramsList.jsx** - přidat loading pro delete programu
4. **Skeleton loaders** - pro MaterialsLibrary, ProgramsList, ClientsList

### 📋 Implementační plán:

**Fáze 1: Oprava critical bugů (1-2 hodiny)** ✅ HOTOVO
- [x] MaterialCard - opravit delete race condition ✅
- [x] ProgramsList - opravit delete race condition ✅
- [x] ProgramEditor - loading states (už hotovo) ✅
- [x] AddMaterialModal - loading states (už hotovo) ✅

**Fáze 2: Skeleton loaders (2-3 hodiny)** - PENDING
- [ ] MaterialCard skeleton
- [ ] ProgramCard skeleton
- [ ] ClientCard skeleton
- [ ] Implementovat v Library komponentách

### 🎓 Lessons Learned:
1. **Async funkce VŽDY awaitovat** - jinak race condition
2. **Loading states POVINNÉ** pro async operace > 500ms
3. **Disable tlačítka** během async operací
4. **Catch errors** a uživateli ukázat chybu
5. **Skeleton loaders** pro lepší UX během načítání

---

### ✅ IMPLEMENTACE - Fáze 1 HOTOVO (31. 10. 2025, 14:00-15:00)

**Co bylo opraveno:**

1. **MaterialCard.jsx** (lines 51, 58-69, 416-432):
   ```javascript
   // Přidáno:
   const [isDeleting, setIsDeleting] = useState(false);

   // Opraveno:
   const handleDeleteConfirm = async () => {
     setIsDeleting(true);
     try {
       await deleteMaterial(material.id);  // ← AWAIT přidán!
       onUpdate();
       setDeleteDialogOpen(false);
     } catch (error) {
       console.error('Failed to delete material:', error);
     } finally {
       setIsDeleting(false);
     }
   };

   // Tlačítka:
   disabled={isDeleting}
   startIcon={isDeleting ? <CircularProgress size={20} color="inherit" /> : null}
   {isDeleting ? 'Mazání...' : 'Smazat'}
   ```

2. **ProgramsList.jsx** (lines 65, 155-169, 448-462):
   - Stejné opravy jako MaterialCard
   - `await deleteProgram()` místo synchronního volání
   - Loading states v delete dialogu

**Benefity:**
- ✅ **Žádné race conditions** - mazání ze Supabase je správně awaited
- ✅ **Uživatel vidí zpětnou vazbu** - spinner + text "Mazání..."
- ✅ **Nelze kliknout 2× rychle** - tlačítka jsou disabled
- ✅ **Error handling** - pokud mazání selže, dialog zůstane otevřený

**Testing:**
```bash
# Test 1: Smazat materiál
1. Otevři MaterialCard
2. Klikni "Smazat"
3. ✅ Dialog zobrazí "Mazání..." + spinner
4. ✅ Tlačítka jsou disabled
5. ✅ Po 1-2 s se dialog zavře a materiál zmizí

# Test 2: Smazat program
1. Otevři ProgramsList
2. Klikni "Smazat" na programu
3. ✅ Dialog zobrazí "Mazání..." + spinner
4. ✅ Po dokončení se program odstraní
```

---

**Ready když ty! Řekni mi, co teď? 🚀**

**Možnosti:**
1. Pokračovat s Fází 2 - Skeleton loaders (2-3 hodiny)
2. Testovat opravy v prohlížeči
3. Přejít na další úkol (Error boundaries / LocalStorage warning / atd.)

---

## ✅ **MASTER TODO V2.1 - UPDATE 31. 10. 2025**

### **📝 Změny v této aktualizaci:**
- ✅ Přidána Sprint 9 - Session 6 (Grid Layout & MaterialCard Redesign, 30. 10. 2025)
  - Detailní dokumentace všech problémů (git checkout bez diskuze, 6 pokusů o stejnou výšku, atd.)
  - Critical lessons learned pro budoucí sessions
  - Časová statistika (2.5h místo 30 minut)
- ✅ Sprint 9.5 (Loading States) - Fáze 1 HOTOVO (31. 10. 2025)
  - MaterialCard race condition opravena
  - ProgramsList race condition opravena
  - Loading states funkční

### **📊 Aktuální Statistiky:**
- **Hotových sprintů:** 4 (Sprint 7, 8, 9, 9 Session 6)
- **Částečně hotových:** 1 (Sprint 9.5 - Fáze 1 done, Fáze 2 pending)
- **Celkem úkolů:** 250+
- **Kritických priorit:** Sprint 10 (5-7 dní)

### **🎯 Status Projektu:**
- ✅ Grid layout 4 sloupce (lg={3})
- ✅ MaterialCard redesign (2 sloupce, minHeight: 280)
- ✅ Loading states pro delete operace
- ⏳ Skeleton loaders (pending)
- ⏳ Error boundaries (pending)
- ⏳ LocalStorage warning (pending)

---

## 🚀 **NOVÉ FUNKCIONALITY - PRE-PRODUCTION ROADMAP (31. 10. 2025)**

**Datum zadání:** 31. října 2025, 16:30
**Target launch:** 31. října - 1. listopadu 2025
**Status:** 🔄 PLANNING & PRIORITIZATION
**Priorita:** 🔴 CRITICAL - Produkční launch!

---

## 📋 **Sprint 10: Pre-Production Critical Features**

**Priorita:** 🔴 CRITICAL
**Odhadovaný čas:** 4-6 hodin
**Musí být hotovo PŘED spuštěním!**

### **10.1 Personalizované oslovení**
**Priorita:** HIGH
**Čas:** 30 minut

**Úkoly:**
- [ ] Přidat personalizované pozdravy v DailyView.jsx
  - Ráno (6-12h): "Dobré ráno, {jméno}! 🌅"
  - Odpoledne (12-18h): "Hezké odpoledne, {jméno}! ☀️"
  - Večer (18-24h): "Dobrý večer, {jméno}! 🌙"
  - Noc (0-6h): "Dobrou noc, {jméno}! 🌜"
- [ ] Přidat do CoachDashboard: "Ahoj, {jméno}! 👋"
- [ ] Přidat do ClientEntry: "Vítej zpět, {jméno}! ✨"
- [ ] Použít `getCurrentUser()` nebo `getCurrentClient()` pro jméno

**Soubory k úpravě:**
- `DailyView.jsx` - top greeting
- `CoachDashboard.jsx` - header greeting
- `ClientEntry.jsx` - welcome back message

---

### **10.2 Tooltips všude**
**Priorita:** HIGH
**Čas:** 1-2 hodiny

**Úkoly:**
- [ ] Nainstalovat MUI Tooltip (už je součástí @mui/material)
- [ ] Přidat tooltips na všechny ikony (Eye, Edit, Delete, Share, QR, atd.)
- [ ] Přidat tooltips na karty materiálů (ServiceLogo, kategorie)
- [ ] Přidat tooltips v ProgramEditor (duration, isActive toggle)
- [ ] Přidat tooltips v ProgressGarden (streak info, day status)
- [ ] Tooltips v češtině!

**Pattern:**
```javascript
import { Tooltip } from '@mui/material';

<Tooltip title="Náhled materiálu" arrow>
  <IconButton onClick={handlePreview}>
    <Eye size={18} />
  </IconButton>
</Tooltip>
```

**Soubory k úpravě:**
- `MaterialCard.jsx` - ikony akcí
- `ProgramsList.jsx` - three dots menu, akce
- `ClientsList.jsx` - ikony status
- `DailyView.jsx` - mood check, completion button
- `ProgressGarden.jsx` - day bloky
- `ShareProgramModal.jsx` - share buttons

---

### **10.3 Data Persistence & Supabase Strategy**
**Priorita:** 🔴 CRITICAL
**Čas:** 2 hodiny (analýza + dokumentace)

**PROBLÉM:**
- LocalStorage = omezený prostor (~5-8 MB)
- LocalStorage = per browser/device (žádná sync mezi zařízeními)
- LocalStorage = smazání = ztráta všech dat
- Bez backendu není možná synchronizace

**SOUČASNÝ STAV:**
- ✅ Supabase Storage - soubory (audio, PDF, images, video)
- ❌ Supabase Database - NENÍ implementováno pro user data
- ❌ Žádná auth (Google OAuth planned)
- ❌ Žádná multi-device sync

**ŘEŠENÍ - Fáze:**

**Fáze 1 (PRE-PRODUCTION, teď):**
- [ ] **Warning systém** při blízkém localStorage limitu (80%+)
  - Toast notification: "Úložiště se plní! Zvažte smazání starých dat."
  - Možnost exportu dat před smazáním
- [ ] **Export/Import funkce** (JSON backup)
  - Export všech dat do JSON souboru
  - Import JSON souboru (restore dat)
  - Manuální backup solution
- [ ] **Dokumentace pro uživatele**
  - "Jak zálohovat data?" tutorial
  - Doporučení: export dat 1× týdně

**Fáze 2 (POST-LAUNCH, budoucnost):**
- [ ] **Supabase Database implementace**
  - Tabulky: users, programs, materials, clients, sessions
  - RLS politiky pro data security
  - Real-time sync mezi zařízeními
- [ ] **Google OAuth authentication**
  - Login přes Google
  - Multi-device sync
  - Cloud backup automaticky
- [ ] **Offline-first architecture**
  - LocalStorage = cache
  - Supabase = source of truth
  - Sync při připojení k internetu

**Úkoly PRE-PRODUCTION:**
- [ ] Implementovat localStorage usage monitor
- [ ] Přidat warning toast při 80%+ usage
- [ ] Vytvořit Export/Import funkce (JSON)
- [ ] Dokumentovat backup workflow
- [ ] UI pro export/import v Settings

**Soubory:**
- `/src/modules/coach/utils/storageMonitor.js` - NOVÝ
- `/src/modules/coach/utils/dataExport.js` - NOVÝ
- `/src/modules/coach/pages/Settings.jsx` - NOVÝ (nebo přidat sekci)

---

### **10.4 Production Environment Setup**
**Priorita:** 🔴 CRITICAL
**Čas:** 1 hodina

**Úkoly:**
- [ ] Environment variables check
  - ✅ VITE_SUPABASE_URL
  - ✅ VITE_SUPABASE_ANON_KEY
  - [ ] VITE_APP_ENV (development/production)
- [ ] Build test: `npm run build`
- [ ] Preview test: `npm run preview`
- [ ] Error tracking setup (optional: Sentry)
- [ ] Analytics setup (optional: Google Analytics)
- [ ] Performance audit (Lighthouse)
- [ ] Security audit
  - [ ] Žádné console.log v production
  - [ ] Žádné hardcoded secrets
  - [ ] HTTPS only
- [ ] SEO meta tags
  - [ ] Title, description, OG tags
  - [ ] Favicon
  - [ ] Apple touch icon

**Deployment checklist:**
- [ ] Vercel/Netlify setup
- [ ] Custom domain (optional)
- [ ] SSL certificate (auto)
- [ ] Environment variables v production
- [ ] Build & deploy test

---

## 📋 **Sprint 11: Media Compression & Optimization**

**Priorita:** HIGH
**Odhadovaný čas:** 3-4 hodiny
**Úspory:** Až 70% storage space!

### **11.1 Image Compression**
**Priorita:** HIGH
**Čas:** 2 hodiny

**Knihovny:**
```bash
npm install browser-image-compression
```

**Funkce:**
- [ ] Auto-compression při uploadu obrázků
  - Target: 1920px max width/height
  - Quality: 80%
  - Format: WebP (fallback JPEG)
  - Max file size: 500KB
- [ ] Thumbnail generování (pro preview)
  - 400px max width/height
  - Quality: 70%
  - Lazy loading
- [ ] Progress bar při kompresi
- [ ] Toast notification: "Obrázek optimalizován: 3.2 MB → 450 KB"

**Implementace:**
```javascript
// /src/modules/coach/utils/imageCompression.js
import imageCompression from 'browser-image-compression';

export const compressImage = async (file, options = {}) => {
  const defaultOptions = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: 'image/webp'
  };

  try {
    const compressed = await imageCompression(file, { ...defaultOptions, ...options });
    const originalSize = (file.size / 1024 / 1024).toFixed(2);
    const compressedSize = (compressed.size / 1024 / 1024).toFixed(2);
    console.log(`Image compressed: ${originalSize} MB → ${compressedSize} MB`);
    return compressed;
  } catch (error) {
    console.error('Compression failed:', error);
    return file; // Fallback na originál
  }
};

export const createThumbnail = async (file) => {
  return compressImage(file, {
    maxSizeMB: 0.1,
    maxWidthOrHeight: 400,
    fileType: 'image/webp'
  });
};
```

**Soubory k úpravě:**
- `AddMaterialModal.jsx` - použít compressImage před uploadem
- `supabaseStorage.js` - integrovat compresi

---

### **11.2 Video Compression (Optional)**
**Priorita:** MEDIUM
**Čas:** 2 hodiny

**Knihovny:**
```bash
npm install ffmpeg.wasm @ffmpeg/ffmpeg @ffmpeg/util
```

**Funkce:**
- [ ] Video compression při uploadu
  - Target: 720p (1280x720)
  - Codec: H.264
  - Bitrate: 2 Mbps
  - Max file size: 50 MB
- [ ] Progress bar s ETA
- [ ] Možnost cancel během komprese
- [ ] Fallback: odkaz na Google Drive/YouTube místo uploadu

**Pozor:** FFmpeg.wasm je ~30 MB knihovna!
**Alternativa:** Doporučit koučce nahrát video na YouTube/Vimeo a použít link.

**Implementace:**
```javascript
// /src/modules/coach/utils/videoCompression.js
import { FFmpeg } from '@ffmpeg/ffmpeg';

export const compressVideo = async (file, onProgress) => {
  const ffmpeg = new FFmpeg();
  await ffmpeg.load();

  // ... compression logic

  return compressedFile;
};
```

**Rozhodnutí:**
- [ ] Implementovat FFmpeg.wasm? (komplexní)
- [ ] NEBO doporučit YouTube/Vimeo links? (jednodušší) ✅ **DOPORUČENO**

---

## 📋 **Sprint 12: Enhanced Mood Tracking & Reflection**

**Priorita:** HIGH
**Odhadovaný čas:** 3-4 hodiny

### **12.1 Rozšířený Mood Check System**
**Priorita:** HIGH
**Čas:** 2 hodiny

**Nové featury:**
- [ ] **Textové poznámky** k mood check
  - TextArea pod emoji výběrem
  - Placeholder: "Jak se dnes cítíš? Co tě trápí nebo naopak těší?"
  - Max 500 znaků
  - Optional (nepovinné)
- [ ] **Datové ukládání**
  - Uložit: datum, čas, before mood, after mood, poznámka
  - Struktura: `{ day: 1, date: '2025-10-31', time: '16:30', before: '😊', after: '😌', note: 'Dnes skvělý den!', timestamp: '...' }`
- [ ] **Historie mood checků**
  - Zobrazit v ProgressGarden nebo nové MoodHistory stránce
  - Kalendářový view (heatmap barev dle nálady)
  - Search/filter dle data, nálady
- [ ] **Export mood historie**
  - CSV export s datem, časem, náladou, poznámkou
  - Koučka může vidět mood timeline klientky

**Komponenty:**
- `MoodCheck.jsx` - přidat TextArea, upravit data strukturu
- `MoodHistory.jsx` - NOVÁ komponenta (kalendář + list view)
- `ProgressGarden.jsx` - zobrazit mood indicators na day blocích

**Data struktura:**
```javascript
// Client object extension:
{
  ...existingClientData,
  moodChecks: [
    {
      day: 1,
      date: '2025-10-31',
      time: '16:30',
      before: { emoji: '😊', label: 'Dobře' },
      after: { emoji: '😌', label: 'V klidu' },
      note: 'Dnes skvělý den! Meditace mi hodně pomohla.',
      timestamp: '2025-10-31T16:30:00Z'
    }
  ]
}
```

---

### **12.2 Klientské Audio Feedback**
**Priorita:** MEDIUM
**Čas:** 2 hodiny

**Funkce:**
- [ ] **Opt-in checkbox** v programu
  - Koučka při vytváření programu zaškrtne: "Umožnit audio zpětnou vazbu"
  - Program object: `{ ...program, allowClientAudioFeedback: true }`
- [ ] **Audio recorder pro klientku**
  - Zobrazit po dokončení dne (pokud je povoleno)
  - Max délka: 2 minuty
  - Formát: MP3 nebo WebM
  - Upload do Supabase: `client-feedback/{clientId}/{programId}/day-{dayNumber}.mp3`
- [ ] **Koučka může poslouchat feedback**
  - V ClientsList → detail klientky
  - Seznam všech audio feedbacků s přehrávačem
  - Download možnost

**Knihovna:**
```bash
npm install react-media-recorder
```

**Komponenty:**
- `AudioRecorder.jsx` - NOVÁ komponenta (reusable)
- `ClientFeedbackPlayer.jsx` - NOVÁ komponenta (pro koučku)
- `DailyView.jsx` - přidat recorder po completion
- `ClientDetail.jsx` - NOVÁ stránka s feedbacky

**Implementace:**
```javascript
// AudioRecorder.jsx
import { useReactMediaRecorder } from 'react-media-recorder';

const AudioRecorder = ({ onSave, maxDuration = 120 }) => {
  const { status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({ audio: true });

  // UI: Record button, timer, stop button, preview player, save button
};
```

---

## 📋 **Sprint 13: Coach Audio Recording System**

**Priorita:** HIGH
**Odhadovaný čas:** 2-3 hodiny

### **13.1 Audio Recorder pro Koučku**
**Priorita:** HIGH
**Čas:** 2 hodiny

**Use cases:**
1. **Osobní zpráva pro klientku**
   - Uvítací zpráva na začátku programu
   - Motivační zpráva po splnění milníku
   - Gratulace k dokončení programu
2. **Oslava úspěchu**
   - Vlastním hlasem: "Gratuluju! Jsi úžasná! 🎉"
   - Nahradit placeholder `celebration.mp3`

**Funkce:**
- [ ] **Audio recorder v ProgramEditor**
  - Možnost nahrát osobní zprávu pro každý den
  - Možnost nahrát completion message (oslava)
  - Max délka: 3 minuty
  - Preview před uložením
  - Upload do Supabase: `coach-messages/{coachId}/{programId}/day-{dayNumber}.mp3`
- [ ] **Management nahraných zpráv**
  - Seznam všech nahrávek v programu
  - Play, delete, re-record
  - Metadata: délka, datum nahrání
- [ ] **Přehrávání pro klientku**
  - Auto-play při otevření dne (optional)
  - Custom audio player s waveform (optional)

**Komponenty:**
- Použít stejný `AudioRecorder.jsx` jako pro klientky
- `ProgramEditor.jsx` - přidat recorder do day editoru
- `DailyView.jsx` - přehrát coach message (pokud existuje)
- `CelebrationModal.jsx` - přehrát completion message místo placeholder

**Data struktura:**
```javascript
// Program day object extension:
{
  dayNumber: 1,
  title: 'Den 1',
  description: '...',
  materialIds: [...],
  instruction: '...',
  coachMessage: {
    url: 'https://supabase.../coach-messages/...',
    duration: 45, // seconds
    recordedAt: '2025-10-31T16:00:00Z'
  }
}

// Program object extension:
{
  ...program,
  completionMessage: {
    url: 'https://supabase.../completion-message.mp3',
    duration: 30,
    recordedAt: '2025-10-31T16:00:00Z'
  }
}
```

---

## 📋 **Sprint 14: Notifications Management**

**Priorita:** MEDIUM
**Odhadovaný čas:** 2 hodiny

### **14.1 Client Notification Settings**
**Priorita:** MEDIUM
**Čas:** 1.5 hodiny

**Funkce:**
- [ ] **Settings stránka pro klientku**
  - Přístup z menu: ⚙️ Nastavení
  - Sekce: Notifikace, Zvuky, Vzhled
- [ ] **Notifikační nastavení**
  - Toggle: "Povolit notifikace" (Web Notifications API)
  - Toggle: "Povolit zvuky" (audio feedback)
  - Toggle: "Tiché hodiny" (21:00 - 8:00)
- [ ] **Uložení preferencí**
  - LocalStorage: `'coachpro_client_settings'`
  - Struktura:
    ```javascript
    {
      notifications: {
        enabled: true,
        sound: true,
        quietHours: { enabled: true, start: '21:00', end: '08:00' }
      },
      appearance: {
        theme: 'auto' // light, dark, auto
      }
    }
    ```

**Komponenty:**
- `ClientSettings.jsx` - NOVÁ stránka
- `NotificationToggle.jsx` - NOVÁ komponenta
- Update `useNotification` hook pro respektovat settings

**Implementace:**
```javascript
// /src/shared/context/NotificationContext.jsx - UPDATE
const NotificationContext = () => {
  const settings = getClientSettings();

  const playSound = () => {
    if (!settings.notifications.sound) return; // Respektovat setting
    // ... play notification.mp3
  };

  const showNotification = (title, body) => {
    if (!settings.notifications.enabled) return;

    // Check quiet hours
    const now = new Date();
    const hour = now.getHours();
    if (settings.notifications.quietHours.enabled) {
      const start = parseInt(settings.notifications.quietHours.start);
      const end = parseInt(settings.notifications.quietHours.end);
      if (hour >= start || hour < end) return; // Tichý režim
    }

    // Show notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body });
    }
  };
};
```

---

## 📋 **Sprint 15: Data Export System (CSV)**

**Priorita:** HIGH
**Odhadovaný čas:** 3 hodiny

### **15.1 CSV Export pro Koučku**
**Priorita:** HIGH
**Čas:** 2.5 hodiny

**Knihovna:**
```bash
npm install papaparse
```

**Export funkce:**
1. **Export materiálů**
   - CSV sloupce: ID, Název, Typ, Kategorie, Velikost, Datum vytvoření, URL/Cesta
   - Filtr: všechny / podle kategorie / podle typu
2. **Export programů**
   - CSV sloupce: ID, Název, Popis, Délka (dny), Share kód, Status, Počet klientek, Datum vytvoření
3. **Export klientek**
   - CSV sloupce: ID, Jméno, Program, Aktuální den, Dokončené dny, Série, Mood checks, Datum vstupu, Status
   - Filtr: všechny / aktivní / dokončené

**Funkce:**
- [ ] Export button v každé Library/List stránce
  - MaterialsLibrary → "📥 Export materiálů"
  - ProgramsList → "📥 Export programů"
  - ClientsList → "📥 Export klientek"
- [ ] Export dialog s možnostmi:
  - Formát: CSV (default), JSON (optional)
  - Filtr: všechny / vybrané kategorie/statusy
  - Název souboru: `coachpro-materials-2025-10-31.csv`
- [ ] Download funkce (browser download)

**Komponenty:**
- `ExportButton.jsx` - NOVÁ reusable komponenta
- `ExportDialog.jsx` - NOVÁ komponenta s options
- `/src/modules/coach/utils/csvExport.js` - NOVÉ utility funkce

**Implementace:**
```javascript
// /src/modules/coach/utils/csvExport.js
import Papa from 'papaparse';

export const exportMaterials = (materials, filters = {}) => {
  let filtered = materials;

  // Apply filters
  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter(m => m.category === filters.category);
  }

  // Map to CSV format
  const csvData = filtered.map(material => ({
    'ID': material.id,
    'Název': material.title,
    'Typ': material.type,
    'Kategorie': getCategoryLabel(material.category),
    'Velikost': formatFileSize(material.fileSize),
    'Datum vytvoření': formatDate(material.createdAt),
    'URL': material.content?.substring(0, 50) + '...' // Truncate
  }));

  // Generate CSV
  const csv = Papa.unparse(csvData);

  // Download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `coachpro-materials-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
};

export const exportPrograms = (programs) => { /* similar */ };
export const exportClients = (clients) => { /* similar */ };
```

**Soubory k úpravě:**
- `MaterialsLibrary.jsx` - přidat Export button
- `ProgramsList.jsx` - přidat Export button
- `ClientsList.jsx` - přidat Export button

---

## 📋 **Sprint 16: Program Scheduling & Time Management**

**Priorita:** HIGH
**Odhadovaný čas:** 3 hodiny

### **16.1 Časové omezení programů**
**Priorita:** HIGH
**Čas:** 2.5 hodiny

**Funkce:**
- [ ] **Program scheduling v ProgramEditor**
  - Radio buttons:
    - ⭕ Neomezený (dostupný kdykoliv)
    - ⭕ Časově omezený (od-do)
    - ⭕ Více období (např. jaro + podzim)
  - DatePicker pro výběr od-do datumů
  - Možnost přidat více period
- [ ] **Aktivace/deaktivace podle datumu**
  - Auto-check při načtení programů
  - Program.isActive = false pokud není v aktivním období
  - Toast pro koučku: "Program XYZ byl automaticky deaktivován (mimo období)"
- [ ] **Vizuální indikátory**
  - Badge na kartě programu: "Aktivní do 15. 12. 2025"
  - Badge: "Začíná 1. 1. 2026"
  - Warning před koncem období: "Zbývá 7 dní!"

**Data struktura:**
```javascript
// Program object extension:
{
  ...program,
  scheduling: {
    type: 'unlimited' | 'limited' | 'multiple', // default: 'unlimited'
    periods: [
      {
        startDate: '2025-11-01',
        endDate: '2025-12-31',
        label: 'Podzim 2025' // optional
      },
      {
        startDate: '2026-03-01',
        endDate: '2026-05-31',
        label: 'Jaro 2026'
      }
    ]
  }
}
```

**Funkce:**
```javascript
// /src/modules/coach/utils/programScheduling.js
export const isProgramActive = (program) => {
  if (!program.scheduling || program.scheduling.type === 'unlimited') {
    return program.isActive; // Manual toggle
  }

  const now = new Date();
  const isInPeriod = program.scheduling.periods.some(period => {
    const start = new Date(period.startDate);
    const end = new Date(period.endDate);
    return now >= start && now <= end;
  });

  return program.isActive && isInPeriod;
};

export const getNextActivePeriod = (program) => {
  const now = new Date();
  const future = program.scheduling?.periods
    ?.filter(p => new Date(p.startDate) > now)
    ?.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  return future?.[0] || null;
};

export const getRemainingDays = (program) => {
  const now = new Date();
  const current = program.scheduling?.periods?.find(p => {
    const start = new Date(p.startDate);
    const end = new Date(p.endDate);
    return now >= start && now <= end;
  });

  if (!current) return null;

  const end = new Date(current.endDate);
  const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  return diff;
};
```

**Komponenty:**
- `ProgramEditor.jsx` - přidat scheduling sekci
- `ProgramCard.jsx` - zobrazit scheduling badges
- `SchedulingPicker.jsx` - NOVÁ komponenta (DatePicker wrapper)

**UI v ProgramEditor:**
```jsx
<FormControl component="fieldset">
  <FormLabel>Dostupnost programu</FormLabel>
  <RadioGroup value={schedulingType} onChange={handleSchedulingChange}>
    <FormControlLabel value="unlimited" control={<Radio />} label="Neomezený (dostupný kdykoliv)" />
    <FormControlLabel value="limited" control={<Radio />} label="Časově omezený" />
    <FormControlLabel value="multiple" control={<Radio />} label="Více období" />
  </RadioGroup>
</FormControl>

{schedulingType === 'limited' && (
  <Box display="flex" gap={2}>
    <DatePicker label="Od" value={startDate} onChange={setStartDate} />
    <DatePicker label="Do" value={endDate} onChange={setEndDate} />
  </Box>
)}

{schedulingType === 'multiple' && (
  <Box>
    {periods.map((period, index) => (
      <Box key={index} display="flex" gap={2}>
        <DatePicker label="Od" value={period.start} />
        <DatePicker label="Do" value={period.end} />
        <TextField label="Popisek (optional)" value={period.label} />
        <IconButton onClick={() => removePeriod(index)}><Delete /></IconButton>
      </Box>
    ))}
    <Button startIcon={<Add />} onClick={addPeriod}>Přidat období</Button>
  </Box>
)}
```

---

## 📋 **Sprint 17: Achievement & Gamification System** 🎮

**Priorita:** MEDIUM (nice-to-have, ale viral potential!)
**Odhadovaný čas:** 8-12 hodin (velký feature!)
**Status:** 📝 Detailed specification provided

### **Overview:**
Kompletní gamifikační systém s gems, achievements, progress rings a Instagram sharing templates. Detailní zadání viz sekce níže.

### **17.1 Core Engine (Priorita 1)**
**Čas:** 3 hodiny

**Úkoly:**
- [ ] **Data structures**
  - Rozšířit client object o: gems, achievements, streaks, stats
  - LocalStorage keys: `'coachpro_client_gems'`, `'coachpro_client_achievements'`, atd.
- [ ] **Achievement engine**
  - `/src/modules/coach/utils/achievementEngine.js`
  - Funkce: `checkAchievements()`, `calculateGems()`, `unlockAchievement()`
  - Achievement categories: Streak, Engagement, Special
- [ ] **Gems calculation logic**
  - 1 gem za dokončený den
  - Streak multipliers: 3 dny = 2x, 7 dní = 3x, 14 dní = 5x
  - Bonus gems: mood check (+1), audio play (+1), PDF open (+1)

**Achievement definitions:**
```javascript
// /src/modules/coach/utils/achievementDefinitions.js
export const STREAK_ACHIEVEMENTS = [
  { id: 'first_step', name: 'První krok', icon: '🌱', requirement: 1, gems: 5 },
  { id: 'getting_started', name: 'Rozjezd', icon: '🚀', requirement: 3, gems: 10 },
  { id: 'habit_forming', name: 'Síla zvyku', icon: '💪', requirement: 7, gems: 25 },
  { id: 'diamond_streak', name: 'Diamantová série', icon: '💎', requirement: 14, gems: 50 },
  { id: 'unstoppable', name: 'Neporazitelná', icon: '⭐', requirement: 21, gems: 100 }
];

export const ENGAGEMENT_ACHIEVEMENTS = [
  { id: 'listener', name: 'Posluchačka', icon: '🎧', requirement: 10, type: 'audio_plays' },
  { id: 'reader', name: 'Čtenářka', icon: '📚', requirement: 10, type: 'pdf_opens' },
  { id: 'explorer', name: 'Explorátorka', icon: '🔗', requirement: 20, type: 'link_clicks' },
  { id: 'reflective', name: 'Reflexní mistr', icon: '✍️', requirement: 15, type: 'mood_checks' }
];

export const SPECIAL_ACHIEVEMENTS = [
  { id: 'early_bird', name: 'Ranní ptáče', icon: '🌅', requirement: 5, type: 'morning_completions' },
  { id: 'night_owl', name: 'Večerní sova', icon: '🌙', requirement: 5, type: 'evening_completions' },
  { id: 'speedrun', name: 'Rychlonožka', icon: '⚡', requirement: 3, type: 'quick_completions' }
];
```

---

### **17.2 UI Components (Priorita 2)**
**Čas:** 3 hodiny

**Komponenty:**
- [ ] `ProgressRing.jsx` - Circular progress ring (Apple Watch style)
  - Props: value (0-100), size, strokeWidth, color, animated
  - Animace: fill on mount, pulse na 100%
- [ ] `AchievementBadge.jsx` - Badge s unlock animací
  - Props: achievement, unlocked, showAnimation
  - Konfety effect při unlock
- [ ] `GemsDisplay.jsx` - Gems counter s sparkle animacemi
  - Props: currentGems, recentGain
  - Number counting animation

**Styling:**
- Glassmorphism design
- Framer-motion animations
- Sound effects (achievement.mp3)

---

### **17.3 Achievements Page (Priorita 3)**
**Čas:** 2 hodiny

**Úkoly:**
- [ ] Vytvořit `AchievementsPage.jsx`
  - Grid všech achievementů (locked + unlocked)
  - Filter tabs: Vše / Streaks / Engagement / Speciální
  - Stats overview: celkové gems, completion rate
  - Progress bars u partial achievements
- [ ] Routing: `/client/achievements`
- [ ] Link v klientském menu

---

### **17.4 Instagram Story Templates (Priorita 4)**
**Čas:** 4 hodiny

**Knihovna:**
```bash
npm install html-to-image
```

**Úkoly:**
- [ ] `ShareTemplateGenerator.jsx` - generátor story templates
  - Canvas API nebo SVG → PNG export
  - Template types: Streak, Completion, Mood, Weekly
  - 1080x1920px (IG Story ratio)
  - Brand colors, fonts, glassmorphism
- [ ] `ShareButton.jsx` - tlačítko pro sdílení
  - Download PNG
  - Copy to clipboard
  - Web Share API (native share na mobilu)
- [ ] Pre-made templates:
  - Minimalist design s CoachPro brand
  - Motivační texty v češtině
  - Hashtags: #CoachPro #PersonalGrowth #Transformation

**Share text templates:**
```javascript
const SHARE_TEMPLATES = {
  streak: "🔥 {streakCount} dní v řadě! Cítím se úžasně silná 💪 #CoachPro #PersonalGrowth",
  completion: "✨ Dokončila jsem program '{programName}'! {duration} dní transformace za mnou 🌟 #CoachPro #Transformation",
  achievement: "🏆 Právě jsem odemkla '{achievementName}'! Každý krok se počítá ✨ #CoachPro #SmallWins"
};
```

---

### **17.5 Integration & Polish (Priorita 5)**
**Čas:** 2 hodiny

**Úkoly:**
- [ ] Integrovat do DailyView:
  - Top section: ProgressRing + GemsDisplay
  - Bottom section: AchievementUnlockAnimation + ShareButton
- [ ] Integrovat do ProgressGarden:
  - Gems display u každého dne
  - Achievement badges u dokončených dní
- [ ] Update CelebrationModal:
  - Zobrazit total gems earned
  - Zobrazit unlocked achievements
  - Share to Instagram prompt
- [ ] Sound effects:
  - achievement.mp3 při unlock
  - gem-collect.mp3 při získání gems (optional)
- [ ] Analytics tracking:
  - Achievement unlock rate
  - Share-to-Instagram conversion
  - Feature usage

---

## 📋 **Sprint 18: UX Polish & Production Ready**

**Priorita:** HIGH
**Odhadovaný čas:** 2-3 hodiny

### **18.1 Error Boundaries**
**Priorita:** HIGH
**Čas:** 1 hodina

**Úkoly:**
- [ ] Vytvořit `ErrorBoundary.jsx` komponentu
  - Catch React errors
  - Zobrazit fallback UI
  - Log error (console nebo Sentry)
- [ ] Wrap main komponenty:
  - `<App>` celá aplikace
  - Každý main route (CoachDashboard, ClientDashboard)
- [ ] Fallback UI design:
  - Glassmorphism card
  - Error message: "Něco se pokazilo 😕"
  - Tlačítko: "Obnovit stránku"
  - Tlačítko: "Kontaktovat podporu"

**Implementace:**
```javascript
// /src/shared/components/ErrorBoundary.jsx
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    // Optional: Send to Sentry
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ /* fallback UI */ }}>
          <Typography variant="h5">Něco se pokazilo 😕</Typography>
          <Typography>Omlouváme se za komplikace.</Typography>
          <Button onClick={() => window.location.reload()}>
            Obnovit stránku
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

---

### **18.2 Skeleton Loaders (Fáze 2 z Sprint 9.5)**
**Priorita:** MEDIUM
**Čas:** 2 hodiny

**Úkoly:**
- [ ] Vytvořit skeleton komponenty:
  - `MaterialCardSkeleton.jsx`
  - `ProgramCardSkeleton.jsx`
  - `ClientCardSkeleton.jsx`
- [ ] Použít MUI Skeleton
- [ ] Zobrazit skeleton při načítání (loading state)
- [ ] Smooth transition: skeleton → real card

**Implementace:**
```javascript
// MaterialCardSkeleton.jsx
import { Skeleton, Card, CardContent, Box } from '@mui/material';

const MaterialCardSkeleton = () => (
  <Card sx={{ height: 280 }}>
    <CardContent>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Skeleton variant="rectangular" width={60} height={20} />
        <Skeleton variant="circular" width={40} height={40} />
      </Box>
      <Skeleton variant="text" width="80%" height={30} />
      <Skeleton variant="text" width="100%" height={20} />
      <Skeleton variant="text" width="100%" height={20} />
      <Skeleton variant="rectangular" width="100%" height={60} sx={{ mt: 2 }} />
    </CardContent>
  </Card>
);
```

---

### **18.3 Final Polish**
**Priorita:** MEDIUM
**Čas:** 1 hodina

**Úkoly:**
- [ ] Accessibility audit
  - Alt text na všechny ikony/obrázky
  - ARIA labels
  - Keyboard navigation
  - Color contrast check (WCAG AA)
- [ ] Performance optimization
  - Lazy loading komponent (React.lazy)
  - Image lazy loading
  - Code splitting
  - Bundle size check
- [ ] Mobile responsiveness final check
  - Test na 320px, 375px, 414px
  - Test iOS Safari, Android Chrome
  - Touch target sizes (min 44x44px)
- [ ] Cross-browser testing
  - Chrome, Firefox, Safari, Edge
  - iOS Safari, Android Chrome
- [ ] Loading states všude
  - Spinner při async operacích
  - Skeleton při načítání dat
  - Progress bars při uploadu

---

## 📊 **PRIORITY MATRIX & TIME ESTIMATES**

### **🔴 CRITICAL - Musí být PŘED launchemem:**
1. **Personalizované oslovení** - 30 min ✅
2. **Tooltips** - 1-2 hodiny ✅
3. **Data persistence strategy** - 2 hodiny ✅
4. **Production setup** - 1 hodina ✅
5. **Error boundaries** - 1 hodina ✅
6. **CSV Export** - 2.5 hodiny ✅

**Celkem CRITICAL:** ~8 hodin

---

### **🟠 HIGH - Mělo by být při launchi:**
1. **Image compression** - 2 hodiny
2. **Enhanced mood tracking** - 2 hodiny
3. **Coach audio recorder** - 2 hodiny
4. **Program scheduling** - 2.5 hodiny
5. **Skeleton loaders** - 2 hodiny

**Celkem HIGH:** ~10.5 hodin

---

### **🟡 MEDIUM - Nice-to-have, post-launch OK:**
1. **Video compression** - 2 hodiny (NEBO recommend YouTube/Vimeo)
2. **Client audio feedback** - 2 hodiny
3. **Notification settings** - 1.5 hodiny
4. **Achievement system** - 8-12 hodin (velký feature!)
5. **Final polish** - 1 hodina

**Celkem MEDIUM:** ~15 hodin

---

### **⏱️ TOTAL TIME ESTIMATE:**
- **Pre-launch minimum:** ~8 hodin (CRITICAL only)
- **Pre-launch recommended:** ~18.5 hodin (CRITICAL + HIGH)
- **Full feature set:** ~33.5 hodin (All priorities)

---

## 🎯 **LAUNCH DECISION TREE**

### **Scénář A: Launch DNES (31. 10. večer)**
**Možné:**
- ✅ Personalizované oslovení (30 min)
- ✅ Tooltips na nejdůležitější akce (1 hodina - partial)
- ✅ Production setup (1 hodina)
- ✅ Error boundary basic (30 min)
- ✅ Data backup warning (1 hodina)

**Celkem:** ~4 hodiny
**Status:** BASIC LAUNCH ⚠️ Fungující, ale bez pokročilých features

---

### **Scénář B: Launch ZÍTRA (1. 11. odpoledne)**
**Možné:**
- ✅ Všechny CRITICAL features (8 hodin)
- ✅ Image compression (2 hodiny)
- ✅ Enhanced mood tracking (2 hodiny)
- ✅ CSV Export (2.5 hodiny)

**Celkem:** ~14.5 hodin
**Status:** SOLID LAUNCH ✅ Všechny podstatné features, production ready

---

### **Scénář C: Launch za týden (7. 11.)**
**Možné:**
- ✅ Všechny CRITICAL + HIGH features (~18.5 hodin)
- ✅ Achievement system (8 hodin)
- ✅ Full polish (1 hodina)

**Celkem:** ~27.5 hodin
**Status:** COMPLETE LAUNCH 🚀 Všechny features, polished, viral potential

---

## 🚀 **RECOMMENDED LAUNCH STRATEGY**

**Fáze 1: Soft Launch (1-2. listopadu)**
- ✅ CRITICAL features implemented
- ✅ Basic production ready
- 👥 Beta testing s malou skupinou (5-10 koučů)
- 🐛 Bug fixing & feedback collection

**Fáze 2: Public Launch (7-14. listopadu)**
- ✅ HIGH features implemented
- ✅ Bug fixes z beta testingu
- 📣 Marketing push
- 🎉 Full feature rollout

**Fáze 3: Growth Features (listopad-prosinec)**
- ✅ Achievement & gamification system
- ✅ Advanced features (video compression, advanced scheduling)
- 📊 Analytics & optimization
- 🔄 Continuous improvement based on user feedback

---

## 📝 **NEXT STEPS - IMMEDIATE ACTIONS**

**Co teď udělat (priorita):**

1. **ROZHODNOUT O LAUNCH DATU** 🗓️
   - Dnes večer (Scénář A)?
   - Zítra odpoledne (Scénář B)? ✅ **DOPORUČENO**
   - Za týden (Scénář C)?

2. **IMPLEMENTOVAT CRITICAL FEATURES** 🔴
   - Start s nejkratšími: Personalizované oslovení (30 min)
   - Pokračovat: Tooltips (1-2 hodiny)
   - Production setup paralelně

3. **TESTOVAT V PROHLÍŽEČI** 🧪
   - Test všech critical features
   - Mobile test (iOS + Android)
   - Cross-browser test

4. **BUILD & DEPLOY** 🚀
   - `npm run build`
   - Deploy na Vercel/Netlify
   - Test v production environmentu

---

**Status:** ✅ MASTER_TODO_V2.md aktualizován o všechny nové funkcionality
**Připraveno na:** Implementaci podle priorit
**Doporučení:** Start s CRITICAL features (Scénář B - launch zítra) 🚀

---

## ✅ **SESSION 8 UPDATE - MaterialCard Redesign & Client Preview (31. 10. 2025, večer)**

**Datum:** 31. října 2025, 17:00-20:40
**Čas strávený:** ~3.5 hodiny
**AI asistent:** Claude Sonnet 4.5

---

### 🎯 Co bylo dokončeno:

#### ✅ **1. MaterialCard - Kompletní Redesign**

**Nový layout:**
- ✅ Chip (vlevo nahoře) - minimalistický, transparentní
- ✅ Velká ikona (vpravo nahoře) - PROKLIKÁVACÍ, otevře přímo
- ✅ 3 řádky metadat (URL, file size, duration/pages) - VŽDY PŘÍTOMNY s minHeight
- ✅ Název materiálu - 2 řádky, fixed height (minHeight: 2.6em)
- ✅ Popis - 3 řádky, fixed height (minHeight: 4.2em)
- ✅ Tlačítko "Jak to vidí klientka" - NOVÉ! Otevře klientskou preview

**Pravý sloupec ikony:**
1. Velká ikona (otevře přímo)
2. ExternalLink (pro VŠECHNY materiály)
3. Eye (preview modal)
4. Share2 (TODO - sdílení s klientkou)
5. Pencil (edit)
6. Trash (separované dolů)

**Touch targets:**
- ✅ Ikony pod 420px: 20px (místo 14px)
- ✅ Všechny IconButtony: minWidth: 44, minHeight: 44

#### ✅ **2. Tooltips na všech ikonách**

Implementovány pomocí `QuickTooltip` (200ms delay):
- ✅ Velká ikona - dynamický text podle typu
- ✅ ExternalLink - "Otevřít v novém okně nebo kartě"
- ✅ Eye - "Otevřít v náhledu"
- ✅ Share2 - "Sdílet s klientkou"
- ✅ Pencil - "Upravit materiál"
- ✅ Trash - "Smazat materiál"

#### ✅ **3. Klientská Preview z MaterialCard**

**Funkce `handleClientPreview()`:**
- Vytvoří dočasný program s pouze tímto materiálem
- Vytvoří admin preview session s `_previewProgram`
- Přesměruje na `/client/daily`
- Admin režim označen "👁️ Admin" badge (Eye ikona + text)

**DailyView změny:**
- ✅ Změněno z emoji "👁️ Preview" na Eye ikonu z lucide-react
- ✅ Parent Box má `sx={{ color: 'primary.main' }}` pro konzistentní barvu

#### ✅ **4. Odstranění Emoji z Kategorií**

**Soubory upraveny:**
- ✅ `helpers.js` - getCategoryLabel() bez emoji
- ✅ `MaterialsLibrary.jsx` - dropdown bez emoji
- ✅ `AddMaterialModal.jsx` - dropdown bez emoji
- ✅ `MaterialSelector.jsx` - dropdown bez emoji

#### ✅ **5. Nové Kategorie Materiálů**

Přidáno 5 nových kategorií:
- ✅ Šablona (template)
- ✅ Pracovní list (worksheet)
- ✅ Pracovní sešit (workbook)
- ✅ Otázky (question)
- ✅ Zpětná vazba (feedback)

**Celkem kategorií:** 10

#### ✅ **6. Skeleton Loaders**

**Nové komponenty:**
- ✅ `MaterialCardSkeleton.jsx`
- ✅ `ProgramCardSkeleton.jsx`

**Implementováno v:**
- ✅ `MaterialsLibrary.jsx` - loading state, zobrazuje 8 skeletonů
- ✅ `ProgramsList.jsx` - loading state, zobrazuje 4 skeletony

**Features:**
- ✅ Napodobuje strukturu skutečné karty
- ✅ Responsive design (isVeryNarrow breakpoint)
- ✅ Glassmorphism efekt
- ✅ Smooth transition (300ms delay simulace)
- ✅ Připraveno na Supabase async API

---

### 📁 Soubory vytvořené/upravené:

**Vytvořené (2 soubory):**
1. `MaterialCardSkeleton.jsx`
2. `ProgramCardSkeleton.jsx`

**Upravené (7 souborů):**
1. `MaterialCard.jsx` - Kompletní redesign (~250 řádků změn)
2. `MaterialsLibrary.jsx` - Loading state, skeleton loaders
3. `ProgramsList.jsx` - Loading state, skeleton loaders
4. `helpers.js` - Odstranění emoji, nové kategorie
5. `AddMaterialModal.jsx` - Dropdown bez emoji, nové kategorie
6. `MaterialSelector.jsx` - Dropdown bez emoji, nové kategorie
7. `DailyView.jsx` - Admin badge s Eye ikonou

---

### 🎓 Klíčové Lekce z této Session:

1. **Border-Radius podle velikosti:**
   - `BORDER_RADIUS.button` (18px) je pro normální tlačítka
   - `BORDER_RADIUS.small` (12px) je pro `size="small"` tlačítka (podle theme overrides)

2. **Konzistentní layout s minHeight:**
   - Metadata řádky: `minHeight: '1.2em'`
   - Title (2 řádky): `minHeight: '2.6em'` (2 × 1.3 lineHeight)
   - Description (3 řádky): `minHeight: '4.2em'` (3 × 1.4 lineHeight)

3. **Visibility hidden vs Display none:**
   - `visibility: 'hidden'` zachová prostor (správně)
   - `display: 'none'` zkolabuje layout (špatně)

4. **Touch targets na mobilu:**
   - Minimálně 44×44px pro touch (accessibility standard)

5. **Color inheritance v parent Box:**
   - Parent má `sx={{ color: 'primary.main' }}`
   - Children (ikona i text) zdědí barvu

---

### 📊 Aktuální Status Features:

**✅ DOKONČENO v Session 8:**
- [x] MaterialCard tooltips
- [x] MaterialCard redesign (layout, chipy, ikony)
- [x] Klientská preview z MaterialCard
- [x] Odstranění emoji z kategorií
- [x] Nové kategorie materiálů (5 nových)
- [x] Skeleton loaders (MaterialsLibrary, ProgramsList)

**⏳ PENDING (další session):**
- [ ] Share2 ikona - implementovat sdílení materiálu s klientkou
- [ ] Error boundaries - React error boundaries pro graceful error handling
- [ ] LocalStorage warning - upozornění při 80%+ využití
- [ ] ClientsList skeleton loader

---

### 🚀 Production Readiness - Current State:

**MaterialCard:**
- ✅ Plně responzivní (320px+)
- ✅ Touch-friendly (44×44px targets)
- ✅ Accessibility (tooltips, proper semantic HTML)
- ✅ Loading states (delete race condition fixed)
- ✅ Error handling
- ✅ Konzistentní layout napříč všemi kartami

**Skeleton Loaders:**
- ✅ Připraveno na async Supabase API
- ✅ Smooth UX transitions (300ms)
- ✅ Glassmorphism design
- ✅ Responsive

**Klientská Preview:**
- ✅ Funkční pro všechny typy materiálů
- ✅ Admin režim jasně označen
- ✅ Temporary program session funguje

---

### ⏱️ Časová Statistika - Session 8:

- MaterialCard redesign: ~2 hodiny
- Skeleton loaders: ~30 minut
- Klientská preview: ~30 minut
- Odstranění emoji + nové kategorie: ~30 minut
- **Celkem: ~3.5 hodiny**

---

### 📋 Doporučené Další Kroky:

**Priorita 1 - Production Critical:**
1. **Error boundaries** (~1 hodina)
   - React error boundary komponenta
   - Graceful error handling
   - User-friendly error messages

2. **LocalStorage warning** (~1 hodina)
   - Monitoring využití (80%+ warning)
   - Toast notifikace pro uživatele
   - Cleanup suggestions

3. **Share2 ikona** (~30 minut)
   - Implementovat sdílení materiálu s klientkou
   - Dialog s programy
   - Přidání materiálu do existujícího programu

**Priorita 2 - Nice to Have:**
- ClientsList skeleton loader (~15 minut)
- Code cleanup (odstranit zakomentovaný kód)
- Testing všech features

---

**Status:** ✅ Session 8 dokončena, MaterialCard je production-ready
**Připraveno na:** Error boundaries + LocalStorage warning (Priorita 1)
**Dev Server:** ✅ Běží bez chyb na http://localhost:3001/
**Doporučení:** Testovat MaterialCard v různých scenářích, pak pokračovat na Error boundaries 🚀

---
