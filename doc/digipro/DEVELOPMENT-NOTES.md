# 📝 DigiPro - Development Notes & Reminders

## ⚠️ **KRITICKÉ - NEZAPOMENOUT!**

### 🔐 **PŘED PRODUKČNÍM NASAZENÍM:**
- [ ] **ZAPNOUT AUTENTIZACI** - změnit `SKIP_AUTH=false` v `.env`
- [ ] **Nastavit JWT_SECRET** - silné heslo místo "your-secret"
- [ ] **Zabezpečit hesla** - hash BCrypt místo plain text
- [ ] **HTTPS** - zajistit SSL certificát
- [ ] **Environment variables** - produkční .env soubor

🌐 Axios: Správné nastavení baseURL pro vývoj i produkci
🐞 Problém ve vývoji:
Pokud není axios správně nakonfigurovaný, volání jako:

js
Zkopírovat
Upravit
axios.get('/api/websites/123');
vede ve vývoji ke chybě:

cpp
Zkopírovat
Upravit
net::ERR_CONNECTION_REFUSED
Důvod: Vite frontend běží na localhost:5173, ale backend běží na localhost:4000. axios se snaží posílat požadavky na frontendový server místo backendu.

✅ Řešení – univerzální nastavení pomocí .env proměnné
1. Vytvoř nebo uprav .env soubor v rootu frontendu:
env
Zkopírovat
Upravit
VITE_API_URL=http://localhost:4000
💡 V produkci budeš mít jinou hodnotu, např.:

ini
Zkopírovat
Upravit
VITE_API_URL=https://api.moje-aplikace.cz
2. V UserWebsites.jsx (nebo jinde, kde používáš axios):
js
Zkopírovat
Upravit
import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
Tím zajistíš, že axios bude vždy používat správnou adresu, podle toho, kde běžíš frontend.

🔁 Shrnutí:
Prostředí	VITE_API_URL
Vývoj	http://localhost:4000
Produkce	https://api.moje-aplikace.cz

🛠️ Doporučení pro nasazení:
✅ V produkci nezapomeň přidat správnou hodnotu VITE_API_URL do .env.production nebo přímo do buildu (např. přes Vercel, Netlify nebo CI/CD pipeline).

✅ Pokud hostuješ frontend i backend na stejné doméně, můžeš v produkci použít /api bez domény a jen přidat reverse proxy.

---
🚀 frontend/.env.production – pro nasazení
env
Zkopírovat
Upravit
# URL backendu v produkci – uprav na svoji doménu nebo API gateway
VITE_API_URL=https://api.digipro.cz
(Tuto doménu samozřejmě změň podle toho, kde ti backend běží naostro.)

⚙️ Jak to použít ve frontendu
Ve všech React komponentách, kde používáš axios, stačí:

js
Zkopírovat
Upravit
import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
Tohle udělej např. globálně v main.jsx, nebo hned na začátku každého .jsx souboru, kde pracuješ s backendem.

🔁 Poznámka
Vždy po změně .env musíš:

restartovat Vite server (npm run dev)

při buildu (npm run build) se proměnné napevno vloží podle aktuálního .env nebo .env.production




---------


### 📋 **AKTUÁLNÍ PLÁN - "DigiPro Professional" 🚀**

**ZMĚNA SMĚRU:** Místo MVP → robustnější verze hned! 

**Phase 1: Backend Enhancement**
- [x] ✅ **File Upload System** - multer, file serving, storage (HOTOVO!)
- [x] ✅ **Robustní Autentizace** - registrace, BCrypt, role management (HOTOVO!)  
- [x] ✅ **Integration Hub** - Mailchimp, GetResponse, Fakturoid, Kajabi, Zapier (HOTOVO!)
- [ ] **Advanced API** - search, filtering, bulk operations, export

### 🎉 **FILE UPLOAD ÚSPĚŠNĚ IMPLEMENTOVÁN!**
- ✅ Multer middleware pro různé typy souborů (PDF, video, audio, obrázky...)
- ✅ Automatické generování unique jmen souborů  
- ✅ File serving přes `/uploads` endpoint
- ✅ Propojení s produkty - ukládání původního názvu
- ✅ Automatické mazání souborů při DELETE produktu
- ✅ Error handling a validace file typů
- ✅ Otestováno - nahrání a stažení souboru ✅

**Phase 2: Professional Frontend**
- [ ] **Modern React App** - Vite, TypeScript, komponenty
- [ ] **Business Dashboard** - grafy (Chart.js), analytics, KPI
- [ ] **File Management UI** - drag&drop upload, image gallery
- [ ] **Responsive Design** - mobile-first, dark/light mode

**Phase 3: Business Features**
- [ ] **Campaign Management** - email marketing, templates
- [ ] **Advanced Reports** - PDF export, analytics
- [ ] **User Management** - role-based access, team features
- [ ] **Payment Integration** - připravené rozhraní pro platby

## 🔧 **TECHNICKÉ POZNÁMKY**

### **Database Schema:**
- Tabulky: `users`, `customers`, `digital_products`, `funnels`
- Foreign keys jsou připravené (user_id propojení)
- Timestamps fungují automaticky

### **API Status:**
- **Server:** běží na portu 4000 ✅
- **CRUD:** kompletní pro všechny entity ✅
- **Testováno:** všechny operace funkční ✅

### **Multi-tenant architektura:**
- Admin → Users → jejich produkty/zákaznice
- Users mohou mít svoje zákaznice 
- Zákaznice mohou mít přístup k produktům

## 🎯 **BUSINESS LOGIKA - NEZAPOMENOUT**

### **Typy digitálních produktů:**
- Kurzy, PDF, videa, posty, odkazy
- Evergreen vs. časově omezené kampaně
- Možnost vkládání souborů i odkazů na cloud

### **Funnel systém:**
- Řazení produktů v určitém pořadí (`ordering`)
- Propojení funnel → produkty (`funnel_products`)

### **Zákaznice systém:**
- Propojení zákaznice → produkty (`customer_products`)
- Tracking nákupů a přístupů

## 📊 **METRIKY K IMPLEMENTACI**

### **Statistiky endpointy:**
```json
{
  "products": 12,
  "customers": 34, 
  "funnels": 5,
  "revenue": 25680.50,
  "sales_this_month": 156
}
```

### **Kampaně tracking:**
- Start/end datum kampaní
- Conversion rates
- Revenue per kampani

## 🚀 **BUDOUCÍ ROZŠÍŘENÍ (v3+)**

- **Platební brány** - SimpleShop, FAPI, Stripe
- **Email notifikace** - automatické po nákupu
- **Členské sekce** - úkoly, poznámky zákaznic
- **Analytika** - detailní reports, filtrace
- **Škálování** - PostgreSQL, cloud deploy

---

---

## 🎉 **DREAM APPLICATION IN PROGRESS!** 

*"o tomhle jsem snila celý život :) :) :)"* 

Vytváříme **DigiPro Professional** - aplikaci vašich snů! ✨

---

## 💾 **ZÁLOHA DO GITHUB DOKONČENA!**

### ✅ **Nová větev: `feature/file-upload-system`**
- **Commit:** 8a79688 - File Upload System & Backend Enhancements
- **GitHub URL:** https://github.com/lennayia/my-digipro-app/tree/feature/file-upload-system
- **Pull Request:** https://github.com/lennayia/my-digipro-app/pull/new/feature/file-upload-system

### 📦 **Co je zálohováno:**
- Kompletní File Upload System
- Enhanced API s search/filtering
- Professional middleware (auth, upload, validate)
- DEVELOPMENT-NOTES.md dokumentace
- Aktualizované database schema
- Všechny testy a konfigurace

**🎯 Bezpečně můžeme pokračovat na další features!**

---

**Poslední update:** 23.7.2024 večer - File Upload System + GitHub backup dokončen ✅ 

---

## ⚠️ **AKTUÁLNÍ KRITICKÝ PROBLÉM (24.7.2024)** 

### 🔴 **BACKEND API - UKLÁDÁNÍ NOVÝCH POLÍ NEFUNGUJE**

**Problem:** Backend API neukládá nová pole `category`, `theme`, `currency` při vytváření/editaci produktů.

**Symptomy:**
- API vrací úspěšnou odpověď s ID produktu 
- V databázi se produkty vytvoří, ale s default hodnotami místo odeslaných
- Frontend posílá data správně (ověřeno)
- Direct SQL commands fungují perfektně

**Testováno extenzivně:**
```bash
# ✅ FUNGUJE - Direct SQL
sqlite3 db.sqlite "INSERT INTO digital_products (title, category, theme, currency) VALUES ('SQL Test', 'upsell', 'Direct SQL', 'EUR');"

# ❌ NEFUNGUJE - API přes curl (JSON)  
curl -X POST http://localhost:4000/api/products -H "Content-Type: application/json" -d '{"title":"JSON Test","category":"upsell","theme":"Testing","currency":"EUR"}'
# Výsledek: category='běžný produkt', theme=null, currency='CZK' (defaults)

# ❌ NEFUNGUJE - API přes curl (FormData)
curl -X POST http://localhost:4000/api/products -F "title=FormData Test" -F "category=upsell" -F "theme=Marketing" -F "currency=EUR" 
# Výsledek: category='běžný produkt', theme=null, currency='CZK' (defaults)
```

**Database Schema - OVĚŘENO SPRÁVNÉ:**
```sql
PRAGMA table_info(digital_products);
25|category|TEXT|0|'běžný produkt'|0
26|theme|TEXT|0||0  
27|currency|TEXT|0|'CZK'|0
```

**Debugging Steps Completed:**
- [x] ✅ Database schema ověřeno - nové sloupce existují
- [x] ✅ Direct SQL funguje perfektně
- [x] ✅ Frontend console - odesílají se správná data
- [x] ✅ Backend controller - přidány extensive debugging logy  
- [x] ✅ Middleware configuration ověřena
- [x] ✅ Multiple curl testy (JSON + FormData)
- [x] ✅ Manual database updates fungují

**Current Status:** 
- Problem je v backend API endpointu `/api/products` POST method
- Systematický problém - ŽÁDNÝ test přes API neuložil správné hodnoty
- Potřeba detailního debugging backend controlleru
- Suspected issue: middleware interferuje nebo SQL query neobsahuje nová pole

**Files Affected:**
- `backend/controllers/productController.js` - createProduct function
- `backend/routes/productRoutes.js` - POST endpoint
- `backend/server.js` - middleware setup

**Next Steps:**
1. 🔍 Add console.log debugging v productController.createProduct
2. 🔍 Verify SQL INSERT statement obsahuje nová pole
3. 🔍 Check middleware chain (multer, JSON parser)
4. 🔍 Database transaction debugging

**Priority:** 🔴 **KRITICKÉ** - blokuje hlavní funkcionalitu aplikace

### ✅ **PROBLÉM VYŘEŠEN! (24.7.2024)**

**Příčina:** Zakomentovaný `uploadProductFile` multer middleware v `/routes/productRoutes.js`

**Řešení:**
1. **Middleware:** Odkomentován a změněn z `upload.single('productFile')` na `upload.any()`
2. **Controller:** Upraveny references z `req.file` na `req.files[0]`
3. **Compatibility:** Nyní funguje pro JSON i FormData requesty

**Testování:**
```bash
# ✅ NYNÍ FUNGUJE - JSON
curl -X POST http://localhost:4000/api/products -H "Content-Type: application/json" -d '{"title":"OPRAVA TEST","category":"upsell","theme":"FUNGUJE","currency":"EUR","type":"e-book","price":777}'

# Výsledek v DB:
sqlite3 db.sqlite "SELECT id, title, category, theme, currency, type, price FROM digital_products WHERE id=20;"
20|OPRAVA TEST|upsell|FUNGUJE|EUR|e-book|777.0
```

**Status:** 🟢 **KOMPLETNĚ VYŘEŠENO** - všechna nová pole se ukládají správně!



--- 