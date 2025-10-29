# 🎯 COACHPRO - MASTER TODO

**Datum vytvoření:** 27. října 2025
**Aktuální stav:** Sprint 6.8 dokončen (iOS support + logo)
**Další sprint:** Sprint 7 - NOVÝ SMĚR (2 úrovně aplikace)

---

## 📊 LEGENDA

- ✅ **Hotovo** - implementováno a otestováno
- ❓ **Nejasný stav** - README říká NE, ale checklist říká ANO (vyjasnit!)
- 🔜 **Priority 1** - Must have pro MVP
- 🎨 **Priority 2** - Should have (důležité UX vylepšení)
- 💡 **Priority 3** - Nice to have (paf efekt)
- 🚀 **Fáze 2** - Po úspěšném MVP

---

## ❓ NEJDŘÍVE VYJASNIT!

**README.md vs. Checklist konflikt:**

README.md říká, že tyto věci **NEJSOU hotové**:
- ❓ ClientsList stránka
- ❓ ClientDetail view
- ❓ DailyView komponenta (klientka)
- ❓ MoodCheck
- ❓ CustomAudioPlayer
- ❓ PDFViewer
- ❓ ProgressGarden
- ❓ CelebrationModal
- ❓ StreakBadge
- ❓ Certificate generator

**Ale tvůj checklist říká, že Sprint 4-7 jsou ✅ HOTOVO!**

**AKCE:** Projdi aplikaci a označ, co SKUTEČNĚ funguje! Pak upravíme TODO.

---

## 🎯 PRIORITY 1 - MUST HAVE (Sprinty 7-10)

### **Sprint 7: NOVÝ SMĚR - 2 úrovně aplikace (3-5 dní)**

#### **7.1 Datová struktura a routing**
- [ ] **Rozšířit Coach object** o nová pole:
  - `urlSlug`, `profilePhoto`, `tagline`, `bio`
  - `education`, `experience`, `certifications[]`
  - `coachingAreas[]`, `socialLinks{}`
  - `leadMagnetProgramId`, `tier` (free/pro)
- [ ] **Aktualizovat storage.js** s novými fieldy
- [ ] **Přidat routing** `/coach/:slug` pro veřejné profily
- [ ] **Aktualizovat routing** pro VOP/GDPR stránky

#### **7.2 CoachOnboarding - 4kroková**
- [ ] **Krok 1: Základní info**
  - Fotka (upload + preview)
  - Jméno, email, telefon
  - URL slug (auto-generate z jména)
- [ ] **Krok 2: O mně**
  - Tagline (80 znaků)
  - Bio (800 znaků)
  - Sociální sítě (Instagram, LinkedIn, Web)
- [ ] **Krok 3: Kvalifikace**
  - Kde studovala
  - Zkušenosti (hodiny, roky)
  - Certifikáty (upload + název + rok)
- [ ] **Krok 4: Oblasti koučinku**
  - Multi-select z 12 oblastí
  - Validace (min 1 oblast)
- [ ] **Uložení do localStorage** a redirect na Dashboard

#### **7.3 PublicCoachProfile - veřejná landing page**
- [ ] **Hero sekce**
  - Velká fotka koučky (200x200px)
  - Jméno + tagline
  - Bio text
  - Sociální sítě (ikony s odkazy)
- [ ] **Oblasti koučinku**
  - Grid karet s ikonami
  - Název + popis oblasti
- [ ] **Kvalifikace**
  - Vzdělání
  - Zkušenosti
  - Certifikáty (gallery s modals)
- [ ] **Edukační sekce "Co je koučink?"**
  - Accordion FAQ (3 otázky):
    - Co je to koučink a jak funguje?
    - K čemu je koučink dobrý?
    - K čemu koučink NENÍ určený?
- [ ] **Lead magnet program**
  - Card s programem
  - "Vyzkoušej zdarma" CTA
  - Registrační formulář (jméno + email + GDPR)
- [ ] **Kontaktní formulář**
  - Jméno, email, zpráva
  - Odeslání do localStorage (mock)
- [ ] **Responsive design** (mobile-first)

#### **7.4 Lead magnet signup flow**
- [ ] **Označení programu jako lead magnet**
  - V ProgramsList tlačítko "Nastavit jako lead magnet"
  - Max 1 program může být lead magnet
- [ ] **Signup formulář na veřejném profilu**
  - Jméno, email
  - GDPR checkbox
  - Validace
- [ ] **Vytvoření klientky v localStorage**
  - Automatické přiřazení programu
  - Generování přístupového kódu
  - Zdroj: "lead-magnet"
- [ ] **Email simulace** (mock)
  - Toast s kódem
  - Text: "V produkci bychom poslali email"
- [ ] **Redirect na ClientEntry** s kódem v URL

#### **7.5 VOP a GDPR stránky**
- [ ] **VOP.jsx stránka**
  - Placeholder text (Claude vygeneruje)
  - Sekce: Základní ustanovení, Práva a povinnosti, atd.
  - Datum poslední aktualizace
- [ ] **GDPR.jsx stránka**
  - Správce údajů (placeholder kontakt)
  - Jaké údaje zpracováváme
  - Práva uživatelů
  - Cookies
- [ ] **Footer komponenta**
  - 3 sloupce: O CoachPro, Právní info, Kontakt
  - Odkazy na VOP, GDPR
  - Copyright: "© 2025 CoachPro • Vytvořeno s 💚 a Claude AI"
  - Email: info@coachpro.cz
- [ ] **Footer přidat na všechny stránky**
  - Login page
  - PublicCoachProfile
  - Dashboard (volitelně)

---

### **Sprint 8: Mobile responsivita ostatních stránek (2-3 dny)**

- [ ] **Dashboard responsivita (320px+)**
  - Stacked layout karet na mobilu
  - Kompaktní statistiky
  - Hamburger menu funguje správně
- [ ] **ProgramsList responsivita**
  - Grid → List view na mobilu
  - Kompaktní karty programů
  - CTA tlačítka viditelná
- [ ] **DailyView responsivita (klientka)**
  - Optimalizace pro malé displeje
  - Audio player kompaktní
  - Materiály snadno scrollovatelné
- [ ] **MaterialsLibrary responsivita** (už hotové z 6.7?)
  - Zkontrolovat, že funguje od 320px
- [ ] **CoachOnboarding responsivita**
  - 4 kroky fungují na mobilu
  - Upload fotky funguje na touch
- [ ] **PublicCoachProfile responsivita**
  - Všechny sekce správně zalamují
  - CTA tlačítka viditelná
  - Formuláře fungují na mobilu

---

### **Sprint 9: ClientsList & ClientDetail (1-2 dny)**

❓ **VYJASNIT: Je tohle hotové nebo ne?**

Pokud **NENÍ hotové:**

- [ ] **ClientsList stránka**
  - Tabulka/Grid s klientkami
  - Sloupce: Fotka, Jméno, Email, Program, Pokrok, Poslední aktivita
  - Filtrování (aktivní/dokončené/všechny)
  - Vyhledávání (jméno, email)
  - Řazení (jméno, pokrok, datum)
  - Klik na řádek → ClientDetail
- [ ] **ClientDetail view**
  - Header s fotkou a jménem klientky
  - Seznam programů klientky
  - Statistiky:
    - Celkem dokončených dní
    - Aktuální streak
    - Nejdelší streak
    - Mood log (graf)
  - Timeline aktivit
  - Progress chart (line/bar graph)
  - Možnost poslat zprávu klientce (mock)
- [ ] **Dashboard statistiky s real daty**
  - Počet aktivních klientek
  - Počet dokončených programů
  - Celkový pokrok všech klientek
  - Nejaktivnější klientka

---

### **Sprint 10: Loading states & Error boundaries (1-2 dny)**

#### **10.1 Loading states**
- [ ] **Skeleton loaders**
  - Pro MaterialsLibrary
  - Pro ProgramsList
  - Pro ClientsList
  - Pro Dashboard statistiky
- [ ] **Upload progress indicator**
  - Progress bar při uploadu do Supabase
  - Procenta (0-100%)
  - Animace
- [ ] **Spinner při mazání**
  - Materiál
  - Program
  - Klientka (pokud bude možné)
- [ ] **Disabled states během operací**
  - Tlačítka disabled při savingu
  - Formuláře disabled při submitu
- [ ] **Toast notifications**
  - Success: "Materiál přidán ✅"
  - Error: "Chyba při nahrávání ❌"
  - Info: "Připravuji náhled..."

#### **10.2 Error boundaries**
- [ ] **ErrorBoundary komponenta**
  - Catch React errors
  - Fallback UI s přátelskou zprávou
  - Tlačítko "Obnovit stránku"
  - Log erroru (console.error)
- [ ] **Wrap App v ErrorBoundary**
- [ ] **Wrap hlavní routes v ErrorBoundary**
- [ ] **Graceful degradation**
  - Pokud localStorage full → warning
  - Pokud Supabase nedostupný → fallback na base64

---

## 🎨 PRIORITY 2 - SHOULD HAVE (Sprinty 11-13)

### **Sprint 11: localStorage warning & monitoring (1 den)**

- [ ] **Funkce pro výpočet využití localStorage**
  - `getLocalStorageUsage()` - vrátí % využití
  - `getLocalStorageSize()` - vrátí MB
  - `getLocalStorageSizeByKey()` - velikost podle klíče
- [ ] **Warning snackbar při 80%+ využití**
  - Zobrazit při každém loadu aplikace
  - "⚠️ Tvůj localStorage je z 85% plný. Zvažte přesun dat do Supabase."
  - Tlačítko "Zjistit víc" → info o Supabase
- [ ] **Dashboard widget s využitím**
  - Card na dashboardu
  - Circular progress (0-100%)
  - Barva: zelená (0-70%), oranžová (70-90%), červená (90-100%)
  - Tooltip: "Využito X MB z 5 MB"
- [ ] **Možnost smazat stará data**
  - "Vyčistit localStorage" tlačítko (s potvrzením!)
  - Možnost exportu před smazáním

---

### **Sprint 12: Dashboard vylepšení (1 den)**

- [ ] **Dashboard layout s více daty**
  - 4 karty statistik (místo 2):
    - Aktivní klientky
    - Materiály celkem
    - Aktivní programy
    - Dokončených dní celkem
  - Graf aktivit (line chart - poslední 7 dní)
  - Poslední 5 klientek s jejich progress
  - Rychlé akce: "Přidat materiál", "Vytvořit program"
- [ ] **Notifikace na dashboardu**
  - "2 klientky dnes dokončily den! 🎉"
  - "Jana má dnes 7denní streak! 🔥"
  - Mock data

---

### **Sprint 13: Bulk operace & Undo (1 den)**

- [ ] **Bulk delete materiálů**
  - Checkbox select na MaterialCard
  - "Vybrat vše" checkbox
  - Bulk delete tlačítko
  - Potvrzovací dialog
- [ ] **Bulk delete programů**
  - Stejný flow jako materiály
- [ ] **Undo pro delete operace**
  - Toast s "Vrátit zpět" tlačítkem (5 sekund)
  - Temporary storage pro smazaná data
  - Možnost obnovit do 5 sekund
- [ ] **Export programu jako PDF**
  - Tlačítko "Exportovat jako PDF" v ProgramDetail
  - PDF obsahuje:
    - Název programu
    - Popis
    - Všechny dny s názvy a popisem
    - Seznam materiálů
  - Použít knihovnu: jsPDF nebo react-pdf

---

## 💡 PRIORITY 3 - NICE TO HAVE (Sprint 14+)

### **Sprint 14: Micro-animations & Polish (1-2 dny)**

- [ ] **Konfety po dokončení** (už máme? ❓)
  - Ověřit, že CelebrationModal funguje
  - Přidat více animací (fireworks, particles)
- [ ] **Hover efekty na kartách**
  - Scale transform
  - Shadow elevate
  - Smooth transitions
- [ ] **Page transitions**
  - Fade in/out při navigaci
  - Slide animace (framer-motion)
- [ ] **Loading spinner s branding**
  - Vlastní logo spinning
  - Příjemné barvy (nature theme)
- [ ] **Success animace při savingu**
  - Checkmark animace
  - Ripple efekt

---

### **Sprint 15: QR scanner & Quick access (1 den)**

- [ ] **QR scanner pro klientky**
  - Použít knihovnu: react-qr-scanner
  - Stránka: `/client/scan`
  - Naskenuj QR → automatický vstup do programu
  - Fallback: Zadat kód ručně
- [ ] **Quick access ve Sidebar**
  - "Poslední programy" (3 nejnovější)
  - "Nejpoužívanější materiály" (3 top)
  - Rychlý přístup bez navigace

---

### **Sprint 16: Statistiky pro koučky (1-2 dny)**

- [ ] **Statistics stránka**
  - Route: `/coach/statistics`
  - Grafy:
    - Aktivních klientek v čase (line chart)
    - Dokončení programů (bar chart)
    - Top materiály (podle použití)
    - Top programy (podle dokončení)
  - Datové rozsahy: Týden, Měsíc, Rok
  - Export statistik jako PDF/CSV
- [ ] **Material usage tracking**
  - Sledovat, kolikrát byl materiál použit v programech
  - Kolikrát byl materiál otevřen klientkami
  - Průměrná doba poslechu (audio)

---

## 🚀 FÁZE 2 - PO ÚSPĚŠNÉM MVP

### **AI Features (vyžaduje backend + API)**

- [ ] **AI generátor afirmací**
  - Koučka zadá téma ("sebevědomí")
  - AI vygeneruje 7 afirmací pro týden
  - Použít: Anthropic Claude API
  - Možnost upravit a uložit
- [ ] **Smart kategorizace materiálů**
  - Při uploadu AI navrhne kategorii
  - Navrhne tagy
  - Použít: Claude API nebo OpenAI
- [ ] **AI asistent pro popis**
  - Koučka nahraje audio
  - AI vytvoří popis + klíčová slova
  - Použít: Whisper API (transkripce) + Claude (shrnutí)

---

### **Engagement Features**

- [ ] **Voice notes od klientky**
  - Klientka může nahrát audio reflexi místo psaní
  - Uložit jako audio soubor
  - Kouč si může poslechnout
  - Použít: MediaRecorder API
- [ ] **Instagram Stories šablony**
  - Koučka může sdílet progress klientky (se souhlasem)
  - Šablony s branding CoachPro
  - Export jako obrázek (PNG)
  - Použít: html2canvas nebo canvas API
- [ ] **Referral program**
  - Klientka doporučí aplikaci → koučka dostane bonus
  - Sledování referrals
  - Dashboard s referral statistikami

---

### **Backend & Notifikace**

- [ ] **Email notifikace**
  - Pošli email klientce s přístupovým kódem
  - Denní reminder email ("Dnes tě čeká meditace 🧘‍♀️")
  - Email po dokončení programu
  - Backend: Supabase Functions + Resend/SendGrid
- [ ] **Push notifikace**
  - Browser push (Web Push API)
  - Denní reminder: "Nezapomeň na dnešní úkol!"
  - Motivační zprávy
- [ ] **SMS notifikace** (volitelné)
  - Pro klientky, které nechtějí email
  - Použít: Twilio

---

### **Marketplace & Community**

- [ ] **Marketplace s programy**
  - Koučky mohou sdílet programy navzájem
  - Placené i zdarma
  - Rating & reviews
  - Vyhledávání podle kategorie
- [ ] **Templaty programů**
  - "7 dní k sebevědomí" (hotový template)
  - "14 dní mindfulness"
  - Koučka si koupí template a přizpůsobí
- [ ] **Community forum**
  - Koučky diskutují
  - Sdílení tipů
  - Q&A sekce

---

### **Advanced Features**

- [ ] **Multi-language support**
  - Čeština (default)
  - Angličtina
  - Slovenština
  - Použít: react-i18next
- [ ] **White-labeling**
  - Koučka si může nastavit vlastní branding:
    - Logo
    - Barvy
    - Doménu (např. coaching.lenna.cz)
  - Pro Tier: Premium (placená verze)
- [ ] **Integrace s kalendáři**
  - Sync programů s Google Calendar
  - Klientka vidí dny v kalendáři
  - Reminder 1 den před
- [ ] **Zoom/Meet integrace**
  - Koučka může přímo zadat link na call
  - Klientka vidí link v programu
  - 1-click připojení

---

## 🧹 TECHNICKÉ ÚKOLY (průběžně)

### **Code Quality**

- [ ] **Odstranit console.log()** z produkčního kódu
  - Nechat jen console.error pro errory
- [ ] **Odstranit // TODO komentáře**
  - Převést na GitHub Issues nebo TODO.md
- [ ] **Odstranit zakomentovaný kód**
  - MAZAT starý kód, ne komentovat!
- [ ] **Přidat PropTypes** nebo TypeScript
  - Validace props
- [ ] **Unit testy** (volitelné)
  - Utility funkce (storage.js, helpers.js)
  - Použít: Vitest

---

### **Performance**

- [ ] **Lazy loading komponent**
  - React.lazy() pro velké komponenty
  - Suspense boundaries
- [ ] **Memoization**
  - useMemo pro expensive calculations
  - React.memo pro často re-renderované komponenty
- [ ] **Image optimization**
  - Komprese uploadovaných fotek
  - WebP format
  - Lazy loading obrázků
- [ ] **Code splitting**
  - Split vendor chunks
  - Split route chunks
- [ ] **Service Worker** (PWA)
  - Offline mode
  - Cache assets
  - Push notifications

---

### **Dokumentace**

- [ ] **README.md aktualizace**
  - Aktuální features
  - Screenshots
  - Setup instrukce
  - Deployment guide
- [ ] **API dokumentace** (až bude backend)
  - Endpoints
  - Request/Response examples
- [ ] **Uživatelská příručka**
  - Pro koučky: Jak používat aplikaci
  - Pro klientky: Jak začít s programem
  - FAQ sekce
- [ ] **Video tutoriály** (volitelné)
  - Jak vytvořit první program
  - Jak nahrát materiály
  - Jak sdílet program s klientkou

---

## 📝 POZNÁMKY

### **Bezpečnost**
- GDPR compliance ✅ (stránka připravena)
- Žádné citlivé údaje v localStorage
- Pokud backend → HTTPS only, secure cookies

### **Testování**
- Testovat na reálných zařízeních (iPhone, Android)
- Testovat na pomalém připojení (3G)
- Testovat s plným localStorage

### **Marketing**
- Landing page pro koučky (vysvětlit value proposition)
- Blog s články o koučinku
- Case studies úspěšných kouček

---

## 🎯 DOPORUČENÉ POŘADÍ IMPLEMENTACE

1. **Sprint 7** - Veřejný profil + 2 úrovně (PRIORITA!)
2. **Sprint 8** - Mobile responsivita
3. **Sprint 9** - ClientsList (pokud není hotové)
4. **Sprint 10** - Loading states & Error boundaries
5. **Sprint 11** - localStorage warning
6. **Sprint 12-13** - Dashboard vylepšení + Bulk operace
7. **Sprint 14-16** - Nice to have features
8. **Fáze 2** - AI, backend, marketplace

---

**Celkem odhadovaný čas 1. fáze:** 15-25 pracovních dní

**Tvoje zpětná vazba potřebná:**
1. ❓ Který Sprint 4-7 features jsou SKUTEČNĚ hotové?
2. 🎯 Chceš začít Sprintem 7 (veřejný profil)?
3. 💰 Máš představu o cenách Tier Free vs. Pro?

---

✅ **TODO list připraven!** Řekni mi, s čím chceš začít 🚀
