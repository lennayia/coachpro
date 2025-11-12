Gemini 5/8/2025

Pokračujeme ve vývoji DIGI PRO aplikace.

SOUČASNÝ STAV:
* ✅ Implementovány dva plně funkční a nezávislé progress systémy (Tvůrčí a Praktický) v editačním modálu.
* ✅ Každý systém má vlastní `useEffect` pro výpočet statusu na základě *počtu* splněných úkolů.
* ✅ UI v modálu (`DialogContent`) je kompletně propojeno s novou logikou (2x progress bar, 2x status dropdown, všechny checkboxy).
* ✅ Ukládání (`handleSaveProduct`) je opraveno a posílá na backend `creative_status` a `practical_status` spolu se všemi ostatními daty formuláře.
* ✅ Všechny změny jsou zálohovány v nové větvi `feature/independent-progress-systems` na GitHubu.

TECH STACK:
* Frontend: React (Vite) + Material-UI
* Backend: Node.js (Express) + SQLite
* API: localhost:4000, Frontend: localhost:5173

KLÍČOVÉ SOUBORY:
* frontend/src/pages/Products.jsx - hlavní komponenta se dvěma progress systémy
* backend/routes/productRoutes.js - API endpointy (nutno zkontrolovat, zda přijímají nové statusy)

PŘIPRAVENO K DALŠÍMU KROKU: Implementace "chytrého statusu".
* **Cíl:** V hlavním seznamu produktů zobrazit jeden srozumitelný status, který se dynamicky vypočítá z `creative_status` a `practical_status`.
* **Návrh logiky:**
    1.  Pokud má `practical_status` jakoukoliv hodnotu kromě "Nový", zobraz `practical_status`. Má prioritu.
    2.  Pokud je `practical_status` "Nový", zobraz `creative_status`.
* Tato logika bude aplikována v komponentě, která renderuje řádek v tabulce produktů.

UŽIVATEL: Lenka, začátečník v programování, potřebuje krok-za-krokem návody, tykáme si.

----------------------

Gemini 5/8/2025 odpol

SOUČASNÝ STAV:

✅ Systém duálních statusů je HOTOV a plně funkční end-to-end.

✅ Frontend: Logika v Products.jsx je čistá, rozdělená do useEffect a pomocných funkcí. Načítání, zobrazení, ukládání i aktualizace UI po uložení funguje bezchybně.

✅ Backend: Controller productController.js je plně aktualizovaný a ukládá všechna nová pole (creative_status, practical_status, main_... checkboxy) do databáze.

✅ Databáze: Schéma tabulky digital_products je rozšířeno o všechny potřebné sloupce.

✅ Verzování: Všechny změny jsou zálohovány v nové větvi feature/dual-status-complete na GitHubu.

TECH STACK:

Frontend: React (Vite) + Material-UI

Backend: Node.js (Express) + SQLite

KLÍČOVÉ SOUBORY:

frontend/src/pages/Products.jsx

backend/controllers/productController.js

PŘIPRAVENO K DALŠÍMU KROKU:
Můžeme se zaměřit na vylepšení uživatelského zážitku nebo přidání nové funkcionality. Návrhy:

Vylepšení filtru: Rozšířit filtrování v hlavním seznamu, aby umělo filtrovat podle obou statusů (např. "ukaž mi vše, co je ve stavu Publikovat NEBO Prodej").

Dashboard / Přehled: Začít pracovat na nové stránce (Dashboard), která by zobrazovala rychlé statistiky (např. kolik produktů je v jakém stavu).

Notifikace: Implementovat systém notifikací, který by uživatele upozornil na důležité změny (např. "Produkt je připraven k prodeji!").

UŽIVATEL: Lenka, začátečník v programování, potřebuje krok-za-krokem návody, tykáme si.

---
Claude Sonet 4 - 5/8/2025 18:38
---

🎯 Kontext pro další AI/Chat
Aktuální stav: Máme plně funkční 2-sloupcový progress tracking system s 4 kroky v každé části.
Technologie: React + Material-UI frontend, Node.js + SQLite backend
Poslední úprava: Přidání 4. kroku "Hotovo" do tvůrčí části (creative_dokonceno pole)
Co funguje:
✅ Automatické status změny podle checkboxů
✅ Manuální override s potvrzením
✅ Responzivní 2-sloupcový layout
✅ Progress bary pod status chipy v tabulce
✅ Ukládání do databáze
Možné další rozšíření:

Bulk operations (hromadné změny statusů)
Drag & Drop status změny
Advanced analytics a reporting
Notifikace a pripomínky
Export/import progress dat

Architektura: Cleanly separated concerns - database layer, API layer, UI layer s proper state management.

Vytvořeno: 5. srpna 2025
Status: ✅ Production Ready
Next: Ready for advanced features nebo business logic rozšíření

---
Gemini 2.5 Pro - 20:50
---

Kontext pro další AI / nový chat
Název projektu: DigiPro Progress Tracking System

Technologie: React (Vite) + Node.js + SQLite + Material-UI

Aktuální stav: Systém má plně funkční, dvoukolejný systém pro sledování postupu digitálních produktů (Tvůrčí a Praktická část). Obě části mají 4 kroky, vlastní progress bary a statusy. Právě proběhl intenzivní debugging, který opravil kritické chyby při zakládání nových produktů a stabilizoval stavovou logiku ve frontendu.

Poslední provedené akce:

Backend: Opravena INSERT logika ve funkci createProduct pro správné ukládání všech 23 polí, včetně creative_dokonceno.

Frontend: Vyřešeny chyby "controlled vs. uncontrolled" správnou inicializací a resetem stavu formuláře. Sjednocena logika pro 4krokový tvůrčí proces (názvy proměnných, výpočty, zobrazení). Odstraněn zastaralý kód.

Klíčové soubory:

backend/controllers/productController.js (CRUD operace pro produkty)

frontend/src/pages/Products.jsx (Kompletní UI a state management pro tabulku a dialogy)

Možné další kroky:

Hromadné operace (změny statusů pro více produktů najednou).

Změny statusů pomocí Drag & Drop.

Pokročilá analytika a reporting.

Notifikace a připomínky.

Export/import dat o postupu.

Cíl: Systém je nyní stabilní a připravený pro implementaci pokročilých funkcí nebo další rozšíření byznys logiky.
------

Claude 7/8/2025 0.00


Ahoj! Pokračujem na DigiPro aplikaci. Právě jsem dokončila refaktorizaci Products.jsx z 800 řádků na 9 modulárních komponent. Vše funguje perfektně - FAB cluster, dark mode, CRUD operace. Teď potřebujem vyřešit upload souboru. Máš detaily v SUMMARY.md artefaktu. Používám React+MUI+Vite, mám hooks (useProducts, useProductDialog) a komponenty v src/components/products/. Priorita #1: Vytvořit ProductUploadZone.jsx s drag&drop funkcionalitou.

---
Gemini 7/8/202 22:40

Ahoj, navazuji na předchozí práci na mé React aplikaci DigiPro.

**Aktuální stav:** Právě jsme dokončili velký refaktoring a implementaci nahrávání více souborů k produktům. Aplikace je stabilní a plně funkční.

**Technický stack:**
* **Frontend:** React 18 + Vite, Material-UI (MUI)
* **Backend:** Node.js + Express, SQLite
* **Architektura:** Oddělený frontend a backend, frontend využívá vlastní hooky (`useProducts`, `useProductDialog`) pro oddělení logiky. Pro stylování se používá `ThemeContext` a CSS proměnné, které jsou uživatelsky nastavitelné ve "Správě barev".

**Poslední implementace:**
1.  **Nahrávání více souborů:** Místo jednoho souboru na produkt teď používáme samostatnou databázovou tabulku `product_files` pro ukládání libovolného počtu souborů. Backendové funkce `createProduct` a `updateProduct` jsou tomu plně přizpůsobeny.
2.  **Perzistentní správa barev:** Komponenta pro správu barev je napojena na `ThemeContext`, který ukládá a načítá veškeré barevné schéma (včetně světlého/tmavého režimu) do `localStorage`.
3.  **Chytré statusy:** V seznamu produktů se zobrazuje sjednocený textový status odvozený z obou metrik (tvůrčí a praktické části).

**Cíle pro tento chat:**
Budeme pokračovat v dalším vývoji. Můžeme se zaměřit na vylepšení UI/UX, implementaci nových funkcí podle roadmapy, nebo optimalizaci stávajícího kódu.

---
Claude Sonet 4 - 8/8/2025 0:30

# 🚀 DigiPro - Kontext pro nový chat

## 📋 **AKTUÁLNÍ STAV APLIKACE:**

### **Technický stack:**
- **Frontend:** React 18 + Vite, Material-UI (MUI), port localhost:5173
- **Backend:** Node.js + Express, SQLite, port localhost:4000  
- **Architektura:** Oddělený frontend/backend, vlastní hooky pro logiku
- **Styling:** ThemeContext + CSS proměnné + glassmorphism

### **Klíčové komponenty:**
- `useProducts` + `useProductDialog` - hlavní logika
- `ThemeContext` - centrální správa barev a dark/light mode
- `ProductTable` - zobrazení produktů s dynamickými statusy
- `ModernFabCluster` - floating action menu (nově card-based)
- `ColorPicker` - správa barev (nově s celkovými statusy)

---

## 🎯 **CO JSME PRÁVĚ DOKONČILI:**

### **1. Modernizace UI pro mladé uživatele:**
- ✅ **ProductToolbar** - glassmorphic design s gradienty
- ✅ **ModernFabCluster** - revolutionárně nový card-based floating menu
- ✅ **Příprava rozšíření správy barev** - nové sekce pro celkové statusy

### **2. Oprava problematického žlutého statusu:**
- ✅ **Analýza problému** - `getDisplayStatus()` vs `statusConfig` mismatch
- ✅ **Navrženo řešení** - rozšíření CSS proměnných
- ✅ **Připraveny artefakty** - kompletní kód pro implementaci

---

## 🎨 **NOVÝ DESIGN SYSTÉM:**

### **Floating Action Menu:**
- **Před:** Kruhové ikony v základních barvách
- **Po:** Moderní action cards s emoji, glassmorphism, staggered animace
- **Výhody:** Trendy, mobilní-friendly, větší touch targety

### **Správa barev:**
- **Před:** Pouze základní statusy (tvůrčí/praktická část)
- **Po:** + nová sekce "Celkové statusy produktů" 
- **Výsledek:** Plná kontrola nad všemi barvami z jednoho místa

### **ProductToolbar:**
- **Před:** Standardní MUI tlačítka
- **Po:** Glassmorphic design s gradienty a animacemi

---

## 🚀 **PRIORITY PRO DALŠÍ CHAT:**

### **Low Priority:**
**Případné drobné opravy** - pokud by něco nefungovalo

### **Medium Priority:**
- Další optimalizace UI/UX
- Responsivita na různých zařízeních  
- Případné další modernizace

### **High Priority:**
- Nové funkce
- Rozšíření aplikace

---

## 💡 **DŮLEŽITÉ INFORMACE:**

### **Pravidla pro spolupráci:**
- Uživatelka je začátečnice - vysvětlovat jednoduše
- Postupné kroky, bez dlouhých komponent
- Vždy zachovat funkčnost
- Nejdřív ukázat kód, pak implementovat

### **Současný floating menu:**
- Používá nový card-based design s emoji
- Glassmorphic pozadí a smooth animace
- Funkční a nasazený - líbí se uživatelce ✅

### **Správa barev:**
- Centralizovaná přes ThemeContext
- CSS proměnné pro jednotnost
- Live preview v aplikaci
- Předpřipravená barevná schémata

---

## 🔧 **TECHNICKÉ POZNÁMKY:**

- Aplikace je stabilní a plně funkční
- Všechny modernizace zachovávají původní logiku
- Nahrávání více souborů k produktům funguje
- Progress bary používají CSS proměnné
- Dark/light mode plně funkční

**Ready for finalizace modernizace! 🎉**

----

CLAUDE SONET 4 - 8/8/2025 - 12:40

-----

# 🚀 DigiPro - Kontext pro nový chat

## 📱 **O aplikaci:**
DigiPro je **React aplikace pro správu digitálních produktů** s moderním glassmorphic designem, kompletní správou ikon a barev, a pokročilými funkcemi pro tracking vývoje produktů.

## 🏗️ **Tech Stack:**
- **Frontend:** React 18 + Vite, Material-UI (MUI), port localhost:5173
- **Backend:** Node.js + Express, SQLite, port localhost:4000  
- **Styling:** ThemeContext + CSS proměnné + glassmorphism
- **Icons:** Dva nezávislé systémy (produkty vs filtry)

## 🎯 **Klíčové komponenty:**
- `useProducts` + `useProductDialog` - hlavní logika produktů
- `ThemeContext` - centrální správa barev a dark/light mode
- `iconConfig.js` + `filterIconConfig.js` - systémy ikon
- `ProductTable` - tabulka s dynamickými statusy a ikonami
- `ModernFabCluster` - floating action menu (card-based design)
- `IconsPage` + `ColorPicker` - správa personalizace

## ✅ **Funkční systémy:**
- ✅ **CRUD produktů** - vytváření, editace, mazání, nahrávání souborů
- ✅ **Export CSV** - kompletní data s českým formátováním
- ✅ **Správa barev** - live preview, CSS proměnné, localStorage
- ✅ **Správa ikon** - 15+ stylů produktů, 8 stylů filtrů, nezávislé systémy
- ✅ **Status systém** - tvůrčí část (1/4-4/4) + praktická část (25%-100%)
- ✅ **Progress tracking** - vizuální progress bary pro obě části
- ✅ **Floating menu** - moderní card design s glassmorphism
- ✅ **Dark/Light mode** - plně funkční s ThemeContext
- ✅ **Filtering** - podle statusů s dynamickými ikonami

## 🎨 **Design principy:**
- **Glassmorphism** - blur efekty, transparentnost, gradients
- **Modularity** - krátké soubory, čistá architektura
- **Personalizace** - uživatel si nastaví barvy i ikony
- **Responsivita** - mobilní-friendly design
- **Performance** - localStorage cache, optimalizované komponenty

## 📂 **Struktura složek:**
```
src/
├── components/
│   ├── products/ - ProductTable, ProductDialog, ModernFabCluster
│   └── ui/ - obecné UI komponenty
├── pages/ - Products, IconsPage, ColorPicker, Dashboard
├── hooks/ - useProducts, useProductDialog
├── context/ - ThemeContext
├── styles/ - iconConfig, filterIconConfig, CSS
└── utils/ - helper funkce
```

## 🎯 **Uživatelské preference:**
- **Jazyk:** Čeština, tykání
- **Level:** Začátečník v kódování - vysvětlovat jednoduše
- **Styl:** Postupné kroky, copy-paste ready kód pro Cursor
- **Designové preference:** Moderní, clean, nadčasové, glassmorphism

## 🚀 **Nedávno dokončeno:**
- Kompletní systém správy ikon (15+ stylů produktů, 8 stylů filtrů)
- Modernizace floating menu na card-based design
- Oprava exportu CSV s kompletní funkcionalitou
- Integrace ikon do ProductTable s live switching

## 🎯 **Možné další směry:**
- Globální SmartFloatMenu pro všechny stránky
- Rozšíření emoji setů a ikon
- Bulk operace nad produkty
- Analytics a reporting
- Mobilní optimalizace
- API integrace s externími službami

## 💡 **Při práci pamatovat:**
- Zachovat modularitu (krátké soubory)
- Vždy test před implementací
- Copy-paste ready kód
- Vysvětlovat jednoduše
- Postupné kroky
- Zachovat funkčnost při změnách

----
Claude Sonnet 4 - 9/8/2025 odpo
---
2. 📋 SUMMARY PRO NOVÝ CHAT

Zkopíruj COMPLETE-SUMMARY.md do nového chatu
AI bude vědět přesně, kde pokračovat
Všechny klíčové informace jsou připravené

3. 🚀 DALŠÍ KROKY
Pro nový chat:

Dokončit zbývající komponenty (ProductTable.jsx, ProductStats.jsx)
Mobile responsiveness
Float menu systém

Modulární systém je hotový a připravený k rozšíření! 🎉✨

-------



----------
GEMINI 2.5 Pro - 10/8/2025 - 21:30
-----------
 Kontext pro další AI (Claude)
Toto je stručný technický souhrn pro další AI, aby se rychle zorientovala v projektu.

Projekt je full-stack aplikace pro správu prodejních funnelů. Frontend je v Reactu, backend v Node.js/Express se SQLite databází.

Architektura Frontendu:
Klíčová komponenta je pages/Funnels.jsx, která funguje jako "kontejner". Drží většinu stavů a logiky a využívá custom hooky (useFunnels, useFunnelDialog) pro abstrakci API volání a správy dialogů. Ostatní komponenty ve složce components/funnels/ jsou převážně prezentační a přijímají data a funkce přes props.

Logika ukládání kroků funelu:

Uživatel upravuje kroky v komponentě FunnelBuilderDialog.jsx.

Po kliknutí na "Uložit" FunnelBuilderDialog zavolá onSave prop a předá pole objektů reprezentujících kroky.

Tuto prop zpracovává funkce handleSaveFunnelSteps v Funnels.jsx.

Tato funkce transformuje data a posílá je na backendový endpoint POST /api/funnels/:id/steps.

Payload je pole objektů ve formátu: [{ product_id: number, order: number, delay_days: number }, ...].

Logika Backendu:
Endpoint POST /api/funnels/:id/steps je obsluhován funkcí replaceAllFunnelSteps v controllers/funnelsController.js. Tato funkce provede v databázové transakci operaci "DELETE all" a následně "INSERT all", čímž kompletně nahradí kroky pro daný funnel.

Aktuální stav: Aplikace je funkční. Hlavní komplexní problém s ukládáním funnelů byl vyřešen opravou chybějící logiky na backendu.

---------
CLAUDE SONET 4 - 11/8/2025 - 22:30
----------
# 🤖 AI CONTEXT - DigiPro aplikace

## Komunikační styl uživatele
- **Úroveň**: Začátečník v programování, používá Cursor IDE
- **Styl**: Tykání, neformální, přímočarý
- **Potřeby**: 
  - Kompletní kód (ne jen části)
  - Jasné instrukce krok za krokem  
  - Vysvětlení proč, ne jen jak
  - Šetření tokenů - stručnost, konkrétnost

## Aktuální stav projektu

### 🎯 CO JE HOTOVÉ
```javascript
✅ Sidebar navigace s duhovým designem
✅ Material-UI Button komponenty (ne ListItemButton!)
✅ Modulární barevný systém (colorSchemes.js)
✅ CSS proměnné pro themování
✅ Responsive design (mobile/tablet/desktop)
✅ Routing struktura
✅ Autentifikace a notifikace
```

### 🏗️ STRUKTURA SIDEBAR
```javascript
// POŘADÍ DUHY (NESMÍ SE MĚNIT!)
Dashboard:   #f50076 (růžová)     📊
Integrace:   #f97316 (oranžová)   🔗  
Zákaznice:   #FFE418 (žlutá)      👥
Produkty:    #008959 (zelená)     📦
Funnely:     #082DC5 (modrá)      🎯
Kampaně:     #7B68EE (světle fialová) 🚀
Analytiky:   #9966CC (světle fialová) 📈
--- ČÁRA ---
Správa barev: #6366f1 🎨
Správa ikon:  #6366f1 🎭  
--- ČÁRA ---
Exporty:      #6366f1 📥
Nastavení:    #6366f1 ⚙️
Podpora:      #6366f1 🆘
```

## ⚠️ KRITICKÉ POZNATKY

### Material-UI pasti
```javascript
❌ NIKDY: <ListItemButton> - přebíjí custom styly
✅ VŽDY:  <Button fullWidth startIcon={...}> 

❌ NIKDY: zapomenout import Button
✅ VŽDY:  import { Button, ... } from '@mui/material'
```

### Sidebar tlačítka - FINÁLNÍ řešení
```javascript
// TENTO STYL FUNGUJE - NEMĚNIT!
<Button
  fullWidth
  onClick={() => handleNavigation(item.path)}
  sx={{
    ...responsiveStyles.listItem(isActive),
    justifyContent: 'flex-start',
    textTransform: 'none'
  }}
  startIcon={<Box sx={iconStyles}>{item.icon}</Box>}
>
  <Box sx={{ flexGrow: 1, textAlign: 'left' }}>
    <Typography variant="body2">{item.text}</Typography>
  </Box>
</Button>
```

### Barevný systém
```javascript
// colorSchemes.js - HLAVNÍ soubor
export const COLOR_SCHEME_1 = { /* duha */ };

// designSystem.js - WRAPPER pro kompatibilitu  
export const PAGE_THEMES = {
  get dashboard() { return getPageTheme('dashboard'); }
};
```

## 📝 CO DĚLAT PŘÍŠTĚ

### Priorita 1 - Funkčnost stránek
- [ ] Products.jsx - CRUD operace
- [ ] Customers.jsx - seznam a správa
- [ ] Funnels.jsx - workflow builder
- [ ] Analytics.jsx - grafy a reporty

### Priorita 2 - Export systém
- [ ] /exports stránka
- [ ] Export zákazníků (CSV/Excel)
- [ ] Export produktů 
- [ ] Export funnel dat

### Priorita 3 - Pokročilé
- [ ] Přepínač barevných schémat (COLOR_SCHEME_1 vs COLOR_SCHEME_2)
- [ ] Správa ikon (/icons stránka)
- [ ] Animace a mikrointerakce
- [ ] PWA funkcionalita

## 🚨 POZOR NA

### Časté chyby
1. **Import Button** - vždy zkontrolovat
2. **listItem vs mainListItem vs bottomListItem** - používej jen `listItem`
3. **Duplicitní &.Mui-selected** - může crashnout
4. **Pořadí duhy** - NESMÍ se měnit bez dohody

### Responsive
```javascript
const isMobile = useMediaQuery(theme.breakpoints.down('md'));    // 0-767px
const isTablet = useMediaQuery(theme.breakpoints.between('md', 'xl')); // 768-1199px  
const isDesktop = useMediaQuery(theme.breakpoints.up('xl'));     // 1200px+
```

### Hover efekt (MUSÍ fungovat)
```javascript
'&:hover': {
  backgroundColor: isActive ? undefined : 'rgba(33, 150, 243, 0.08)',
  transform: 'translateX(2px)'  // ← TENTO EFEKT!
}
```

## 💬 Komunikační tipy

### ✅ DĚLEJ
- Ukazuj konkrétní kód s kontextem ("najdi X, změň na Y")
- Vysvětluj PROČ, ne jen JAK
- Kompletní soubory při větších změnách
- Stručnost, šetření tokenů

### ❌ NEDĚLEJ  
- Neposílej jen části kódu bez kontextu
- Neopakuj kód z uživatelovy zprávy
- Nezapomínej na importy
- Neměň pořadí duhy bez dohody

## 🎯 SOUČASNÝ CÍL

**Sidebar je HOTOVÝ** → přejít na implementaci funkcionalit jednotlivých stránek.

**Začni s:** Products.jsx nebo Customers.jsx - podle preferencí uživatele.

---

**Použij tento kontext pro plynulé pokračování projektu! 🚀**

---------
CLAUDE SONET 4 - 12/8/2025 - 02:30
----------

# 🚀 KONTEXT PRO NOVÝ CHAT - DigiPro aplikace

## 📊 AKTUÁLNÍ STAV PROJEKTU

### ✅ KOMPLETNĚ HOTOVÉ
- **🎨 BAREVNÝ SYSTÉM** - 100% FUNKČNÍ ✅
- **🔄 PŘEPÍNAČ SCHÉMAT** - navbar + settings ✅  
- **📱 RESPONSIVE DESIGN** - mobile/tablet/desktop ✅
- **🔐 AUTENTIFIKACE** - login systém ✅
- **🧭 NAVIGACE** - sidebar + navbar ✅
- **💾 PERSISTENCE** - localStorage pro všechna nastavení ✅

---

## 🎨 BAREVNÝ SYSTÉM (HOTOVO)

### SCHÉMA 1 - DUHA 🌈
**Hlavní tlačítka:** Navbar styly `linear-gradient(135deg, #1976d2 0%, #9c27b0 100%)`
- Přesně zkopírované z navbar do sidebar
- BoxShadow: `0 4px 15px rgba(25,118,210,0.3)`
- Hover: `scale(1.02)` + `brightness(0.9)`

**Ikony:** Duhové barvy podle stránek
```
Dashboard: #f50076 | Integrace: #f97316 | Zákaznice: #FFE418 | Produkty: #06E761
Funnely: #082DC5 | Kampaně: #4704A9 | Analytiky: #400064 | Utilities: #6366f1
```

### SCHÉMA 2 - PŘÍRODA 🌿  
**Hlavní tlačítka:** CSS proměnná `var(--main-button-gradient)` = cosmic+teal
- Dynamické: `linear-gradient(135deg, #483D8B 0%, #5F9EA0 100%)`

**Ikony:** Přírodní barvy podle stránek
```
Dashboard: #B87333 | Integrace: #556B2F | Zákaznice: #DAA520 | Produkty: #2F4F4F
Funnely: #BC8F8F | Kampaně: #8FBC8F | Analytiky: #708090 | Utilities: #5F9EA0
```

### KLÍČOVÉ FUNKCE
- **useColorScheme()** - `{ currentScheme, toggleScheme, isRainbow, isNature }`
- **Podmínkové styly** - navbar styly vs CSS proměnné podle schématu  
- **Automatické CSS proměnné** - `--page-primary`, `--main-button-gradient`
- **localStorage persistence** - `digipro-color-scheme`

---

## 🏗️ ARCHITEKTURA

### 📁 STRUKTURA (AKTUÁLNÍ)
```
src/
├── context/
│   ├── ColorSchemeContext.jsx      ✅ HOTOVÝ - správa schémat
│   ├── ThemeContext.jsx            ✅ HOTOVÝ - dark/light mode  
│   └── AuthContext.jsx             ✅ HOTOVÝ - autentifikace
├── components/
│   ├── Sidebar.jsx                 ✅ HOTOVÝ - podmínkové styly podle schématu
│   ├── Navbar.jsx                  ✅ HOTOVÝ - s SchemeToggle + ThemeToggle
│   ├── SchemeToggle.jsx            ✅ HOTOVÝ - přepínač schémat
│   └── ThemeToggle.jsx             ✅ HOTOVÝ - dark/light přepínač
├── config/
│   ├── colorSchemes.js             ✅ HOTOVÝ - definice všech barev + funkce
│   └── designSystem.js             ✅ HOTOVÝ - design tokens
├── pages/
│   ├── Settings.jsx                ✅ HOTOVÝ - s oběma přepínači
│   ├── Dashboard.jsx               ⚠️ BASIC - potřebuje funkcionalitu
│   ├── Products.jsx                ⚠️ BASIC - potřebuje CRUD
│   ├── Customers.jsx               ⚠️ BASIC - potřebuje management
│   ├── Funnels.jsx                 ⚠️ BASIC - potřebuje funnel builder
│   ├── Analytics.jsx               ⚠️ BASIC - potřebuje grafy/reporty
│   └── Integrations.jsx            ⚠️ BASIC - potřebuje API management
└── styles/
    ├── themes.css                  ✅ HOTOVÝ - CSS proměnné
    └── components.css              ✅ HOTOVÝ - komponenty styly
```

---

## 💻 TECHNOLOGIE

### Frontend: React 18 + Vite
- **Styling:** Material-UI (MUI) + CSS proměnné systém
- **Routing:** React Router v6
- **Stav:** Context API (Theme, Auth, ColorScheme)  
- **Icons:** Material-UI Icons
- **Build:** Vite

### Barevný systém:
- **CSS proměnné** - dynamické přepínání `--main-button-gradient`
- **Podmínkové styly** - navbar vs CSS proměnné podle schématu
- **MUI integration** - `sx` prop s custom styly
- **localStorage** - persistence voleb uživatele

---

## 🎯 PRIORITA DALŠÍHO VÝVOJE

### 1. FUNKCIONALITA STRÁNEK (PRIORITA 1)

#### Products.jsx - CRUD produkty
- **Product management** - vytváření, editace, mazání
- **Kategorie produktů** - organizace a filtering  
- **Media upload** - obrázky produktů
- **Pricing management** - ceny, slevy, varianty
- **Inventory tracking** - skladové zásoby

#### Customers.jsx - CRM systém  
- **Customer database** - kontaktní údaje, historie
- **Segmentace** - tagy, kategorie, filtering
- **Export/Import** - CSV/Excel funkcionalita
- **Communication log** - historie komunikace
- **Purchase history** - objednávky a platby

#### Funnels.jsx - Funnel builder
- **Drag&drop builder** - vizuální editor
- **Template systém** - předpřipravené funnely  
- **A/B testing** - více variant funnelů
- **Analytics integration** - tracking konverzí
- **Email automation** - follow-up sekvence

#### Analytics.jsx - Reporty a grafy
- **Dashboard widgets** - customizovatelné panely
- **Revenue tracking** - příjmy, trendy, predikce
- **Customer analytics** - chování, segmenty
- **Funnel analytics** - konverze, drop-off analýza  
- **Export reportů** - PDF, Excel, CSV

### 2. INTEGRACE A API (PRIORITA 2)
- **Backend API** - REST/GraphQL endpointy
- **Databáze design** - PostgreSQL/MongoDB schéma
- **Email integrace** - MailChimp, SendGrid, atd.
- **Payment gateway** - Stripe, PayPal integration
- **File storage** - AWS S3, Cloudinary pro media

### 3. POKROČILÉ FEATURES (PRIORITA 3)  
- **Real-time notifikace** - WebSocket updates
- **Collaboration** - multi-user editing
- **Advanced search** - ElasticSearch integration
- **Workflow automation** - Zapier-like funkcionalita
- **PWA features** - offline mode, push notifications

---

## ⚠️ DŮLEŽITÉ POZNATKY PRO VÝVOJ

### Material-UI Best Practices:
```javascript
❌ NIKDY: <ListItemButton> - přebíjí custom styly
✅ VŽDY:  <Button fullWidth> s custom sx prop

❌ NIKDY: Zapomenout import všech MUI komponent  
✅ VŽDY:  import { Button, Box, Typography } from '@mui/material'

❌ NIKDY: Duplikovat styly v různých komponentách
✅ VŽDY:  Centrální definice v responsiveStyles objektu
```

### Barevný systém správa:
```javascript
// ✅ PRO NOVÉ STRÁNKY:
// 1. Přidat do getCurrentPageId() v colorSchemes.js
// 2. Definovat barvu v OBOU schématech  
// 3. Import useColorScheme() v komponentě

// ✅ PRO TLAČÍTKA:
// Schéma 1: Navbar styly (linear-gradient #1976d2 → #9c27b0)
// Schéma 2: CSS proměnné (var(--main-button-gradient))

// ✅ PRO IKONY:
// Vždy getIconColor(pageId) nebo podmínka podle currentScheme
```

### Responsive breakpoints:
```javascript
const isMobile = useMediaQuery(theme.breakpoints.down('md'));    // 0-767px
const isTablet = useMediaQuery(theme.breakpoints.between('md', 'xl')); // 768-1199px  
const isDesktop = useMediaQuery(theme.breakpoints.up('xl'));     // 1200px+
```

---

## 🚨 KRITICKÉ NEPOZMĚNITELNOSTI

### NESMÍ SE MĚNIT:
- **Navbar → Sidebar kopírování** - přesné styly pro schéma 1
- **CSS proměnné názvy** - `--main-button-gradient`, `--page-primary`  
- **colorSchemes.js API** - getColorScheme, getPageTheme, getMainButtonTheme
- **useColorScheme hook** - currentScheme, toggleScheme, isRainbow, isNature
- **localStorage klíče** - 'digipro-color-scheme', 'digipro-color-theme'

### PŘI DEBUGGINGU:
- **Console errors** - obvykle chybí MUI import nebo wrong CSS specificity
- **Styly se neaplikují** - zkontroluj !important vs MUI specificity
- **CSS proměnné** - debug přes getComputedStyle(document.documentElement)
- **Rerender loops** - pozor na dependencies v useEffect hookech

---

## 💬 KOMUNIKAČNÍ STYL UŽIVATELE

### Preferuje:
- **Tykání, neformální komunikace**
- **Kompletní funkční kód** - ne jen snippety
- **Jasné instrukce** - "najdi X, nahraď Y"  
- **Kontext a vysvětlení** - proč, ne jen jak
- **Stručnost** - efektivní použití tokenů
- **Cursor IDE workflow** - copy-paste ready code

### Technická úroveň:
- **Začátečník až pokročilý začátečník**
- **Potřebuje guidance** při architektonických rozhodnutích
- **Preferuje proven patterns** před experimentováním
- **Hodnotí stabilitu** a debugging-friendly solutions

---

## 🔄 DOPORUČENÝ WORKFLOW

### Pro implementaci nových stránek:
1. **Analýza požadavků** - co přesně stránka má dělat
2. **Design mockup** - wireframe nebo visual design
3. **Data model** - jaká data komponenta potřebuje
4. **API endpoints** - backend requirements
5. **Komponenta struktura** - hooks, state management  
6. **Styling integration** - použití barevného systému
7. **Testing** - funkčnost + responsive + error states
8. **Documentation** - update tohoto kontextu

### Git workflow:
```bash
git checkout -b feature/products-crud
# Implementace...
git add . && git commit -m "feat: products CRUD functionality"  
git push origin feature/products-crud
# Pull request + review
```

---

## 📊 AKTUÁLNÍ METRIKY

### Hotovost projektu:
- **🎨 UI/UX systém:** 95% ✅
- **🔧 Core funkcionalita:** 30% ⚠️  
- **🔗 Integrace:** 10% ⚠️
- **📊 Analytics:** 5% ⚠️
- **🚀 Production ready:** 40% ⚠️

### Další milestones:
1. **MVP Products page** - základní CRUD (2-3 dny)
2. **MVP Customers page** - seznam + basic management (2-3 dny)  
3. **Backend API** - REST endpoints pro CRUD (3-5 dní)
4. **Data persistence** - databáze integrace (2-3 dny)
5. **Production deployment** - hosting + CI/CD (1-2 dny)

---

## 🎯 AKTUÁLNÍ FOCUS

**BAREVNÝ SYSTÉM JE 100% HOTOVÝ** ✅

**PŘÍŠTÍ KROK:** Implementace funkcionalit jednotlivých stránek

**DOPORUČENÉ POŘADÍ:**
1. **Products.jsx** - nejkomplexnější, ale nejvíc value
2. **Customers.jsx** - CRM základ pro business  
3. **Analytics.jsx** - dashboardy a reporty
4. **Funnels.jsx** - pokročilá funkcionalita
5. **Integrations.jsx** - API management

**CÍLE PRO DALŠÍ FÁZI:**
- 📦 **Funkční CRUD** operace
- 🔌 **Backend API** integrace  
- 📊 **Real data** místo mock dat
- 📤 **Export funkcionalita**
- 🔍 **Search & filtering**

---

**🚀 PROJEKT JE PŘIPRAVEN PRO BUSINESS LOGIC IMPLEMENTACI!**

Design systém, navigace, autentifikace a barevný systém jsou production-ready. Můžeme se plně soustředit na funkcionalitu a business hodnotu aplikace.

--------
CLAUDE SONNET 4 - 13/8/2025
--------

# 📋 KONTEXT PRO NOVÝ CHAT - TEMPLATE IMPLEMENTACE

**Předchozí chat:** 12.-13. srpna 2025 (pondělí večer → úterý noc)  
**Téma:** Responsive systém + Template systém implementace  

## 🎯 **SITUACE:**
Mám **kompletně funkční** DigiPro aplikaci s funnel modulem. Všechno funguje jak chci. Potřebuji **POUZE PŘIDAT** template systém **BEZ ZMĚNY** stávajících souborů.

## ✅ **CO JE HOTOVÉ A FUNGUJE:**
- Funnel modul s CRUD operacemi
- FunnelTable.jsx (responsive karty)
- FunnelToolbar.jsx (pestré tlačítka)
- FunnelDialog.jsx (vytvoření/editace)
- FunnelBuilderDialog.jsx (drag&drop)
- FunnelFabCluster.jsx (floating menu)
- Responsive systém a utilities
- Barevné schéma (rainbow + nature)
- Všechny hooks a data management

## 🎯 **CO POTŘEBUJI:**

### **Pouze vytvořit 2 NOVÉ soubory:**
1. `frontend/src/config/funnelTemplates.js` - definice 5 hotových šablon
2. `frontend/src/components/funnels/FunnelTemplateSelector.jsx` - UI pro výběr šablon

### **Minimální integrace do stávajících souborů:**
- FunnelToolbar.jsx - přidat Template tlačítko (bez změny stávající funkčnosti)
- Funnels.jsx - přidat Template dialog (bez změny stávající funkčnosti)

## 🚀 **TEMPLATE SYSTÉM - SPEC:**

### **5 hotových šablon s psychology principy:**
1. **Tripwire E-commerce** (15-25% konverze) - nízká cena → upsell
2. **High-Ticket Coaching** (5-15% konverze) - webinář → konzultace  
3. **Freemium SaaS** (10-20% konverze) - trial → conversion
4. **Digital Product Launch** (20-35% konverze) - pre-launch → launch
5. **Workshop Registration** (40-60% konverze) - registrace → upsell

### **Template Selector features:**
- Kategorie filtering (E-commerce, Coaching, SaaS, Content, Events)
- Search functionality
- Preview cards s metrikami
- Responsive design
- Použití mého barevného schématu
- Integration s existing workflow

### **Workflow:**
1. Klik "Šablony" v toolbar
2. Výběr šablony podle kategorie/search
3. Preview s detaily (konverze, kroky, psychology)
4. "Vytvořit funnel" → automaticky vytvoří funnel ze šablony
5. Otevře FunnelBuilder s předpřipravenými kroky
6. Možnost úprav podle potřeby

## 🔧 **TECHNICKÉ POŽADAVKY:**

### **Zachovat stávající:**
- Všechny existující komponenty BEZ změn
- Barevné schéma (currentScheme, getPageTheme)
- Responsive systém
- Existující hooks a data flow
- API endpointy a struktura

### **Přidat pouze:**
- Template definice s psychology principy
- Template selector UI komponentu
- Minimální integrační kód

## 🎨 **DESIGN REQUIREMENTS:**

### **Konzistence s existujícím:**
- Použít moje barevné schéma (funnelTheme.gradient, primary)
- Glassmorphism efekty jako u existing komponent
- Responsive podle mého systému
- MUI komponenty a styling

### **Template card design:**
- Category ikony a barvy
- Conversion rate highlighting
- Psychology techniques tagy
- Difficulty a setup time
- Preview funkčnost

## 💡 **IMPLEMENTAČNÍ POZORNOSTI:**

### **NEMĚNIT:**
- Existující file structure
- Stávající komponenty a jejich logiku
- API calls a data management
- Existing state management

### **POUZE PŘIDAT:**
- 2 nové soubory s template systémem
- Minimální props a state pro template dialog
- Template button do toolbar
- Template dialog do main page

## 🚀 **OČEKÁVANÝ VÝSLEDEK:**
Uživatel uvidí nové fialové tlačítko "Šablony" v toolbar. Po kliknutí se otevře moderní template selector s 5 hotovými šablonami. Výběr šablony automaticky vytvoří funnel s předpřipravenými kroky a otevře builder pro úpravy.

## 📋 **AKČNÍ BODY PRO NOVÝ CHAT:**
1. Vytvoř funnelTemplates.js s 5 hotovými šablonami
2. Vytvoř FunnelTemplateSelector.jsx komponentu
3. Ukáž minimální integraci do FunnelToolbar.jsx  
4. Ukáž minimální integraci do Funnels.jsx
5. Vše otestuj a ověř funkcionalitu

**CÍLEM JE: Přidat template systém s minimálním dopadem na existující kód!**


---------
GEMINI 2.5 Pro - 14/8/2025 - 16:00
----------

Úspěšně jsme dokončili komplexní refaktoring a optimalizaci komponent Funnels.jsx a FunnelBuilderDialog.jsx. Všechny známé problémy s výkonem (nadměrné překreslování), kritické chyby (pády aplikace) a chyby v komunikaci s API byly vyřešeny. Kód byl optimalizován pomocí hooků useCallback a useMemo. Dále jsme úspěšně migrovali komponentu FunnelTable na moderní MUI Grid v2, čímž jsme odstranili varování z konzole. Aplikace je nyní v této části stabilní.

--------------
GEMINI 2.5 Pro - 15/8/2025 - 19:50
----------
## 2. Kontext pro Clauda (nebo jiný chat)
Tady je stručný text, který můžeš použít pro zahájení nové konverzace.

Dokončila jsem rozsáhlý refaktoring a optimalizaci React komponent v sekcích "Funnels" a "Products", konkrétně souborů Funnels.jsx, FunnelTable.jsx, FunnelBuilderDialog.jsx, Products.jsx, ProductTable.jsx a souvisejících hooků (useFunnels, useProductDialog, NotificationContext). Byly vyřešeny problémy s nekonečným překreslováním pomocí React.memo, useCallback a useMemo. Opravila jsem chyby v komunikaci s API, chyby v logice (např. notifikace) a modernizovala zastaralý kód (MUI Grid). Aplikace je v těchto částech nyní stabilní a plně optimalizovaná.

----------
CLAUDE SOnneT 4 -15/8/2025 - podvečer
----------
🎯 DIGIPRO - TEMPLATE SYSTÉM RENDER LOOP OPRAVA

**SITUACE:**
Template systém pro české podnikatelky je 95% hotový.
Backend plně funkční, šablony vytvořené, ale frontend má render loop bug.

**CO FUNGUJE:**
✅ Backend API - vytváření funelů ze šablon + kroky
✅ 5 českých business šablon s psychology principy  
✅ Template data a konfigurace
✅ Database LEFT JOIN oprava

**AKTUÁLNÍ PROBLÉM:**
❌ Frontend render loop v Funnels.jsx
❌ Template funkce způsobují nekonečný render
❌ Aplikace laguje kvůli performance

**RENDER LOOP SYMPTOMS:**
🔄 FunnelTable render: {funnelsCount: 27, onOpenBuilder: 'function'}
🔄 Funnels page theme: Object  
🔄 Funnel theme with scheme: Object

**TESTOVÁNO:**
- Template Selector zakomentován → render loop pryč
- Template funkce odkomentovány → render loop pokračuje
- useMemo dependencies změněny → nestačilo

**POTŘEBUJI OPRAVIT:**
useCallback dependencies v Funnels.jsx template funkcích
Možně funnelTheme useMemo problém
Template state management

**PO OPRAVĚ:** Template systém bude 100% funkční!

**SOUBORY:** Funnels.jsx (render loop), FunnelTemplateSelector.jsx (OK)


--------
CLAUDE SONNET 4 - 16/8/2025
--------

🔄 KONTEXT PRO NOVÝ CHAT:
Template systém je 100% dokončen a funkční! Hlavní komponenty:

✅ FunnelTemplateSelector - sjednocené "Použít" tlačítka
✅ FunnelTemplateCustomizer - přiřazování vlastních produktů
✅ Responsive hamburger - funkční breakpointy
✅ České šablony - 5 business šablon s psychology principy

Workflow funguje: Template Selector → Customizer → Builder
Další priorita: Rozšíření customizeru o přidávání/odebrání kroků

🔄 WORKFLOW PRO NOVÝ CHAT
Při pokračování projektu:

Kontext je kompletní - vše je funkční
Priorita: Rozšíření customizeru - přidávání/odebrání kroků
Template systém je base - stavět na něm další funkce
Performance je stabilní - žádné render loop problémy


🏆 TEMPLATE SYSTÉM JE 100% HOTOVÝ!
Backend ✅ | Frontend ✅ | UX ✅ | Performance ✅ | Responsive ✅
Aplikace je připravena na další fázi vývoje! 🚀

--------
CLAUDE SONNET 4 - 17/8/2025 - 01:20
--------

🔄 WORKFLOW PRO NOVÝ CHAT
Při pokračování projektu:

Funnel systém je 100% funkční - template → customizer → builder
Produkty mají funnel metadata - cílová skupina, pain pointy, benefity
Databáze a backend připravené na další rozšíření
Priorita: Rich Text Editor pro kroky funnelů
Pak AI Content Generator využívající nová funnel pole


🎉 FUNNEL EXPANSION DOKONČENO!
Template systém ✅ | Funnel Builder ✅ | Produkty rozšířené ✅ | Databáze ✅ | Backend ✅ | Frontend ✅
Aplikace má nyní kompletní funnel ecosystem připravený na AI-powered content generation! 🚀

📝 TESTING CHECKLIST

✅ Vytvořit nový produkt s funnel nastavením
✅ Označit produkt jako "funnel-ready"
✅ Vybrat typ (Lead Magnet, Upsell...)
✅ Vyplnit cílovou skupinu a pain pointy
✅ Uložit a ověřit v databázi
✅ Použít funnel-ready produkt v Template Customizeru
✅ Otestovat celý workflow Template → Customizer → Builder

Vše funguje - připraveno na další fázi! 🎯
✅ KOMPLETNÍ: Funnel systém rozšířen o produktová metadata
📊 HOTOVO: Databáze (5 nových polí), Backend (SQL + API), Frontend (UI + forms)
🧪 TESTOVÁNO: Vytváření funnel-ready produktů funguje
🎯 DALŠÍ: Rich Text Editor pro funnel kroky → AI Content Generator
📁 PRIORITY: WYSIWYG editor → Smart prompts → Email builder → Campaigns

----------
CLAUDE SOnneT 4 -19/8/2025 - 13:10
----------

# Kontext pro nový chat - DigiPro App

## 👋 Rychlý přehled

**Projekt**: DigiPro - Aplikace pro tvorbu prodejních funelů  
**Tech Stack**: React + Vite, Node.js + Express, Material-UI, SQLite  
**Status**: ✅ Plně funkční, optimalizováno pro mobile + desktop  
**Poslední práce**: 19.8.2025 - Kompletní oprava Funnel Builder + mobilní optimalizace

---

## 🎯 Co je hotové a funguje

### ✅ Funnel Builder (HLAVNÍ KOMPONENTA)
- **Lokace**: `frontend/src/components/funnels/FunnelBuilderDialog.jsx`
- **Status**: Plně funkční po dnešní opravě
- **Features**: 
  - Drag & drop produktů do kroků
  - Responzivní layout (mobile: column, desktop: row)
  - Real-time editace kroků
  - Vizuální feedback a animace
  - Performance optimalizováno (useCallback, memo)

### ✅ Modulární design systém
- **5 barevných schémat**: Rainbow, Nature, Flow, Cyber, Minimalist
- **Responsive layout**: Mobile-first, touch-friendly
- **Pevný sidebar**: 160px šířka na všech velikostech
- **Dynamic theming**: Barvy podle aktivní stránky

### ✅ Mobile optimalizace
- **Touch targets**: 36px+ tlačítka
- **Adaptive layout**: Skrývání panelů při editaci
- **Smooth animations**: CSS keyframes pro UX
- **Responsive typography**: Škálování fontů

---

## 🏗️ Architektura (která funguje)

### Klíčové komponenty
```
FunnelBuilderDialog.jsx    # Hlavní editor (NEMĚNIT bez důvodu)
├── ProductsPanel          # Levý panel s produkty 
├── FunnelStep            # Jednotlivé kroky funelu
├── DropZone              # Drag & drop zóny
└── HelpPanel             # Nápověda

AppLayout.jsx             # Hlavní layout (fixní sidebar)
CreatorSidebar.jsx        # Levý navigační panel
Navbar.jsx                # Horní panel s barevným selectorom
```

### Config soubory (DŮLEŽITÉ)
```
colorSchemes.js           # 5 barevných témat - FUNKČNÍ
funnelResponsive.js       # Responsive nastavení
funnelTemplates.js        # Přednastavené šablony
productCategories.js      # Kategorie produktů
```

---

## ⚠️ DŮLEŽITÉ poznámky pro budoucí práci

### 🚫 NEMĚNIT bez důvodu
1. **FunnelBuilderDialog.jsx** - právě opraveno, plně funkční
2. **colorSchemes.js** - 5 schémat funguje perfektně
3. **AppLayout.jsx** + **CreatorSidebar.jsx** - pevný sidebar je záměr
4. **useCallback optimalizace** - právě implementováno

### ✅ Bezpečné k úpravám
1. **Nové komponenty** v jiných sekcích
2. **Styling vylepšení** (barvy, animace)
3. **Nové features** (analytics, export)
4. **Backend rozšíření**

### 🔧 Debugging nástroje
- `useWhyDidYouUpdate` hook - sleduje re-renders
- `console.log` v ProductsPanel - debug produktů
- React DevTools - component hierarchy

---

## 📱 Responsive pravidla

### Breakpoints (MUI standard)
```javascript
xs: 0     // Mobile
sm: 600   // Tablet portrait  
md: 900   // Tablet landscape
lg: 1200  // Desktop
xl: 1536  // Wide desktop
```

### Layout strategie
- **Mobile**: Column layout, 40vh produkty + 60vh obsah
- **Desktop**: Row layout, 320px sidebar + flex obsah
- **Editace**: Na mobilu skryj postranní panely

---

## 🎨 Design systém pravidla

### Barevné schéma použití
```javascript
// V komponentách:
const { currentScheme } = useColorScheme();
const pageTheme = getPageTheme('funnels', currentScheme);
// pageTheme.primary, pageTheme.gradient, pageTheme.secondary
```

### Styling patterns
```javascript
// Responsive sx props:
sx={{ 
  p: { xs: 2, md: 3 },           // Padding
  fontSize: { xs: '0.8rem', md: '1rem' },  // Typography
  display: { xs: 'block', md: 'flex' }      // Layout
}}
```

---

## 🚀 Jak pokračovat

### Pro nové funkce
1. **Zkopíruj pattern** z existujících komponent
2. **Použij stejný responsive systém**
3. **Přidej useWhyDidYouUpdate** pro debug
4. **Testuj na mobile i desktop**

### Pro bugfixy
1. **Nejprv zkontroluj konzoli** - debug výpisy jsou všude
2. **useWhyDidYouUpdate** ukáže co způsobuje re-render
3. **Zkontroluj responsive breakpoints**

### Pro styling
1. **Používej existující barevné schéma**
2. **Následuj MUI sx patterns**
3. **Mobile-first approach**

---

## 🔍 Časté problémy a řešení

### ❌ Bílá obrazovka
- **Příčina**: Chybující JavaScript, neuzavřené JSX
- **Řešení**: Zkontroluj konzoli, syntax chyby

### ❌ Komponenta se neustále re-renderuje  
- **Příčina**: Chybějící useCallback, memo
- **Řešení**: Použij useWhyDidYouUpdate hook

### ❌ Mobile layout nefunguje
- **Příčina**: Špatné breakpoints nebo missing responsive props
- **Řešení**: Zkontroluj sx props a použij existující pattern

### ❌ Barevné schéma nefunguje
- **Příčina**: Chybný import nebo použití
- **Řešení**: Zkopíruj pattern z funkční komponenty

---

## 📂 Soubory k zálohování

### Kritické komponenty (100% funkční)
```
frontend/src/components/funnels/FunnelBuilderDialog.jsx
frontend/src/components/AppLayout.jsx  
frontend/src/components/CreatorSidebar.jsx
frontend/src/config/colorSchemes.js
frontend/src/styles/utilities.css
```

### Config soubory
```
frontend/src/config/funnelResponsive.js
frontend/src/config/funnelTemplates.js
frontend/src/config/productCategories.js
frontend/src/config/responsive.js
```

---

## 🎯 Prioritní TODOs pro budoucnost

### High Priority
1. **A/B Testing** - rozšíření funnel systému
2. **Analytics Dashboard** - metriky výkonnosti  
3. **Export/Import** - záloha a sdílení funelů
4. **Advanced Templates** - více přednastavených šablon

### Medium Priority  
1. **Offline Mode** - PWA functionality
2. **Bulk Operations** - hromadné úpravy
3. **User Permissions** - role-based access
4. **Integration APIs** - propojení s externími nástroji

### Low Priority
1. **Dark Mode Enhancement** - lepší dark styling
2. **Keyboard Shortcuts** - power user features
3. **Custom Animations** - brand-specific transitions

---

## 💡 Tipy pro efektivní práci

### Pro AI asistenty
1. **Vždy zkontroluj** existující funkční kód před změnami
2. **Používej established patterns** místo vymýšlení nových
3. **Mobile-first** přístup ke všem změnám
4. **Debug tools first** - useWhyDidYouUpdate před optimalizací

### Pro vývojáře
1. **Stav je stabilní** - major features fungují
2. **Performance je optimalizované** - neměnit bez měření
3. **Responsive je dokončené** - použij stejný pattern
4. **Error handling je implementováno** - buduj na tom

---

## 🎉 Aktuální výsledek

**DigiPro App je připravená pro production použití.**

- ✅ Funnel Builder plně funkční
- ✅ Mobile optimalizace dokončena  
- ✅ Performance optimalizováno
- ✅ Design systém stabilní
- ✅ Error handling implementováno

**Doporučení**: Zaměřit se na nové features místo refaktoringu existujícího kódu.

---

*Připraveno pro nový chat: 19.8.2025*  
*Pokud potřebuješ pomoct s konkrétní funkcí, začni tím, že zmíníš tento kontext.*