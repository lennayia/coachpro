# 🎯 COACHPRO - MASTER TODO V2.0

**Datum aktualizace:** 28. října 2025, 20:30
**Aktuální stav:** Sprint 8 dokončen (CRITICAL BUGS - Opravy)
**Další sprint:** Sprint 9 - VEŘEJNÝ PROFIL + 2 ÚROVNĚ
**Hosting:** Vercel (frontend) + Supabase (database + storage)

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

### **Sprint 10: KLIENTSKÉ ROZHRANÍ + CRITICAL FEATURES (4-5 dní)**

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

- [ ] **Testovat funkčnost po každé změně:**
  - Otestovat v prohlížeči (Chrome, Safari, Firefox)
  - Otestovat na mobile (responsive)
  - Zkontrolovat console pro errory
  - Zkontrolovat Network tab pro failed requests
  - Otestovat edge cases

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

1. **🚨 CRITICAL BUGS** (1-2 dny) - HNED!
2. **Sprint 7** - Veřejný profil (5-7 dní)
3. **Sprint 8** - Nové typy materiálů (3-4 dny)
4. **Sprint 9** - Sdílení + balíčky (2-3 dny)
5. **Sprint 10** - Funkce pro klientku (3-4 dny)
6. **Sprint 11** - File management (2 dny)
7. **Sprint 12** - Vyhledávání + řazení (2 dny)
8. **Sprint 13** - Nápověda (2-3 dny)
9. **Sprint 14** - Mobile optimalizace (2-3 dny)
10. **Sprint 15** - Dashboard upgrade (2 dny)
11. **Beta testing** (1 týden)
12. **Launch!** 🎉

---

## ❓ OTÁZKY PRO TEBE

1. **Které Sprinty 4-7 jsou SKUTEČNĚ hotové?** (ClientsList, DailyView, atd.)
2. **Chceš začít Critical bugsy nebo rovnou Sprint 7?**
3. **Ceny balíčků:** Máš představu? (např. Free: 0 Kč, Basic: 1500 Kč, Pro: 3500 Kč)
4. **WordPress:** Budeš dělat sama nebo někdo jiný?
5. **Beta test:** Znáš 10 kouček, které by to otestovaly?

---

✅ **MASTER TODO V2.0 HOTOVO!**

**Přidáno:**
- ✅ Všech 26 tvých požadavků
- ✅ Rešerše zahraničních aplikací
- ✅ 15+ nových typů materiálů
- ✅ Balíčky služeb
- ✅ Kompletní klientka onboarding
- ✅ File management + limity
- ✅ Nápověda & help systém
- ✅ Vlastní nápady (5 bonusů)
- ✅ Timeline (8-12 týdnů)

**Celkem:** 200+ úkolů seřazených podle priorit! 🚀

Řekni mi, s čím chceš začít! 💪
