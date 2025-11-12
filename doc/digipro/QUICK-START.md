# DigiPro - Executive Summary

## 🚀 **AKTUÁLNÍ STAV** (24.7.2024)
- ✅ **Kompletní business aplikace** pro české podnikatelky
- ✅ **Backend:** Node.js/Express, SQLite, port 4000
- ✅ **Frontend:** React/Vite, port 5174 (modernější verze)
- ✅ **Autentizace:** Vypnutá pro dev (ZAPNOUT pro produkci!)

## 🔧 **Technologie:**
- **Backend:** SQLite, Express.js, bcrypt, multer
- **Frontend:** React, Material-UI, Vite
- **API:** REST endpoints, file upload, CRUD
- **Integration Hub:** 12 platforem (SmartEmailing, MailChimp, Stripe...)

## 📱 **Klíčové funkce:**
- **Profile Management:** Kompletní úprava profilu s českými specifiky
- **Customer Management:** CRUD zákazníků
- **Product Management:** Digitální produkty, file upload
- **Analytics Dashboard:** Přehledy a statistiky

## 🎯 **Aktuální hlavní komponenty:**
- `frontend/src/pages/Profile.jsx` - Profile management (ultra pokročilé)
- `backend/controllers/userController.js` - User API
- `backend/db.sqlite` - Databáze
- `summary.md` - Kompletní dokumentace (1185 řádků)

## 🔐 **Přihlašovací údaje:**
- **Email:** lenkaroubalka@seznam.cz
- **Heslo:** 123456 (reset funkce implementována)

## ⚡ **Poslední kritické opravy (24.7.2024):**
- ✅ Komprese obrázků (50MB input → 300KB max)
- ✅ Zapomenuté heslo - kompletní UI/backend
- ✅ Layout hlavičky - zalamování textu
- ✅ Pole celá šířka s !important
- ✅ Port 5174 standardizace

## 🚨 **PŘED PRODUKCÍ:**
- [ ] ZAPNOUT autentizaci v backend/server.js
- [ ] Změnit default hesla
- [ ] Email konfigurace pro reset hesla

---
**Pro detaily čti summary.md selektivně podle potřeby!** 

## 🚩 Kritické opravy a migrace (podvečer 24. 7. 2025)

### 1. Oprava řazení kódů bank (dropdown)
- Seznam bank je nyní řazen podle skutečných čtyřmístných kódů (0–9, včetně počátečních nul).
- Dropdown je přehlednější a odpovídá oficiálním kódům.

### 2. Refaktoring sekce „Weby“
- Z původních polí `website`, `website2`, `website3` přecházíme na dynamickou správu webů.
- Přidána tabulka `user_websites` v databázi pro libovolný počet webů u jednoho profilu.
- Struktura tabulky:  
  `id`, `user_profile_id`, `url`, `website_theme`, `note`, `created_at`
- Do schématu (`schema.sql`) byla zanesena jak tabulka `user_profiles`, tak i nová `user_websites`.

### 3. Migrace databáze – shrnutí postupu
- Ověření a získání aktuální struktury tabulek přes SQLite konzoli (`.schema`).
- Doplnění správných CREATE TABLE příkazů do `schema.sql`.
- Zálohování všech změn do nové větve v GitHubu (`zaloha-schema-user-profiles`).

24/7 večer
## 🔧 Backend

- Spouští se na: `localhost:4000`
- V `.env` musí být:
  ```env
  JWT_SECRET=your-secret
  PORT=4000
  SKIP_AUTH=true
  ```

- V `server.js` musí být správná cesta na `db.js`, tedy:
  ```js
  const db = require('./models/db');
  ```

- Spuštění backendu:
  ```bash
  cd backend
  node server.js
  ```

## 💻 Frontend

- Výchozí URL pro axios ve `UserWebsites.jsx`:
  ```js
  axios.defaults.baseURL = 'http://localhost:4000';
  ```

- Komponenta `UserWebsites` očekává prop `userId` a funguje s CRUD akcemi přes `/api/websites`

- `Grid` komponenty z MUI 5: migruj z `item xs={} sm={}` na `sx={ flexBasis, flexGrow }`

## 🎨 Design poznámky

- Primární dark mode barvy:
  - `#1e1e1e` (velmi tmavý základ)
  - `#c0c0c0` (stříbrná)
  - `#900000` (vínová pro CTA)
  - `#39ff14` (signální zelená pro doplňky)
- Styl: střídmý, moderní, výrazné kontrasty, hranaté rámečky

## ✅ Hotové
- Funkční komponenta `UserWebsites`
- Připojení na backend přes REST API
- Základní správa webů (formulář + výpis)
- Inicializace MUI v dark módu
- Testování Axios + .env obou stran
- Výběr stylu a doplňkové signální barvy

---

_Více detailů: viz `summary_2025-07-24.md`_