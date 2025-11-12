# 🔄 MIGRAČNÍ PLÁN - PaymentsPro → Supabase

## ⚠️ DŮLEŽITÉ: TOTO MUSÍME UDĚLAT!

Tento dokument sleduje migraci PaymentsPro ze SQLite do Supabase.

---

## 📋 STATUS MIGRACE

- [ ] **FÁZE 1: ProApp Core** (TEĎKA)
  - [ ] Core backend vytvořen
  - [ ] Auth funguje
  - [ ] Subscriptions fungují
  - [ ] Module access funguje
  - [ ] Core frontend základní

- [ ] **FÁZE 2: MIGRACE PaymentsPro** ⚠️ **NESMÍME ZAPOMENOUT!**
  - [ ] Supabase schéma pro PaymentsPro připraveno
  - [ ] Export dat z SQLite
  - [ ] Import dat do Supabase
  - [ ] Backend přepsán na Supabase
  - [ ] Testy provedeny
  - [ ] Vše funguje

- [ ] **FÁZE 3: LifePro modul**
  - [ ] LifePro backend
  - [ ] LifePro frontend
  - [ ] Admin rozhraní
  - [ ] AI integrace

---

## 🗓️ ČASOVÝ PLÁN

| Fáze | Začátek | Konec | Status |
|------|---------|-------|--------|
| FÁZE 1: Core | 11.10.2025 | 14.10.2025 | 🔵 In Progress |
| FÁZE 2: Migrace PaymentsPro | 15.10.2025 | 18.10.2025 | ⏳ Pending |
| FÁZE 3: LifePro | 19.10.2025 | 25.10.2025 | ⏳ Pending |

---

## 🎯 FÁZE 2: MIGRACE PaymentsPro - DETAILNÍ KROKY

### **KROK 1: Příprava Supabase schématu** (1 hodina)

**Co udělat:**
1. Vytvořit `paymentspro-migration-schema.sql`
2. Obsahuje tabulky:
   - `payments`
   - `categories`
   - `category_groups`
   - `rezervy`
   - `rezervy_transactions`
   - `white_label_settings`
   - `white_label_logos`

**Soubor:** `ProApp/PaymentsPro/supabase-migration-schema.sql`

**Status:** ⏳ Čeká

---

### **KROK 2: Export dat ze SQLite** (30 min)

**Co udělat:**
1. Vytvořit export script
2. Export do JSON/CSV
3. Ověřit data

**Příkazy:**
```bash
cd ~/Documents/Projekty/ProApp/PaymentsPro/backend
node scripts/export-sqlite-data.js
```

**Výstup:** `exported-data.json`

**Status:** ⏳ Čeká

---

### **KROK 3: Import dat do Supabase** (1 hodina)

**Co udělat:**
1. Vytvořit import script
2. Spustit import
3. Ověřit počty záznamů

**Příkazy:**
```bash
node scripts/import-to-supabase.js
```

**Checklist:**
- [ ] Users data importována
- [ ] Payments importovány
- [ ] Categories importovány
- [ ] Rezervy importovány
- [ ] Počty sedí (SQLite = Supabase)

**Status:** ⏳ Čeká

---

### **KROK 4: Refactor PaymentsPro backendu** (1 den)

**Co změnit:**

#### **Před (SQLite):**
```javascript
import sqlite3 from 'sqlite3';
const db = new sqlite3.Database('./payments.db');
```

#### **Po (Supabase):**
```javascript
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
```

**Soubory k úpravě:**
- [ ] `server.js` - Database připojení
- [ ] `routes/payments.js` - Všechny queries
- [ ] `routes/categories.js` - Všechny queries
- [ ] `routes/rezervy.js` - Všechny queries
- [ ] Middleware (pokud potřeba)

**Status:** ⏳ Čeká

---

### **KROK 5: Testování** (4 hodiny)

**Co otestovat:**
- [ ] Login funguje
- [ ] Platby CRUD (create, read, update, delete)
- [ ] Kategorie CRUD
- [ ] Rezervy CRUD
- [ ] Filtry fungují
- [ ] Search funguje
- [ ] Statistiky fungují
- [ ] Export dat funguje

**Status:** ⏳ Čeká

---

### **KROK 6: Přepnutí na produkci** (1 hodina)

**Co udělat:**
1. Záloha SQLite databáze
2. Přepnout .env na Supabase
3. Restartovat backend
4. Finální ověření

**Status:** ⏳ Čeká

---

## ⚠️ RIZIKA A FALLBACK

### **Pokud migrace selže:**

1. **Záloha SQLite databáze:**
   ```bash
   cp backend/payments.db backend/payments.db.backup
   ```

2. **Rollback plán:**
   - Vrátit .env na SQLite
   - Restartovat backend
   - Všechno funguje jak předtím

3. **Data integrity:**
   - Před migrací: COUNT všech záznamů
   - Po migraci: Ověřit stejné COUNT
   - Pokud nesedí → STOP a oprav

---

## 📞 POZNÁMKY

### **Důležité:**
- SQLite data **NEMAŽ** dokud Supabase nefunguje 100%
- Drž backup minimálně 2 týdny
- Testuj na development prostředí PRVNÍ

### **Po úspěšné migraci:**
- PaymentsPro backend běží na Supabase
- SQLite můžeš archivovat (ale ponechat backup)
- Všechny moduly sdílí Supabase databázi

---

## ✅ HOTOVO KDY:

**Migrace je hotová když:**
- ✅ Všechna data v Supabase
- ✅ PaymentsPro backend funguje se Supabase
- ✅ Všechny funkce otestované
- ✅ Běží v produkci minimálně 1 týden bez chyb
- ✅ SQLite backup uložen a archivován

---

**🚨 PŘIPOMÍNKA: TOTO NESMÍME PŘESKOČIT! 🚨**

Datum vytvoření: 11.10.2025
Poslední update: 11.10.2025
