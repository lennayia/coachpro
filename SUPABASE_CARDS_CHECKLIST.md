# 📋 Supabase Checklist - Koučovací Karty

**Vytvořeno**: 8.11.2025
**Účel**: Kompletní nastavení koučovacích karet v Supabase

---

## ⚠️ DŮLEŽITÉ - Před začátkem

**ZÁLOHA**: Staré tabulky z 5.1.2025 budou DROPNUTY!
- `coachpro_cards`
- `coachpro_card_decks`
- `coachpro_shared_card_decks`
- `coachpro_card_usage`

**Pokud máš produkční data v těchto tabulkách, ZÁLOHUJ JE!**

---

## ✅ Krok 1: Spustit SQL migrace

### 1.1 Nová struktura karet (Balíčky A/B/C/D)

**Soubor**: `supabase/migrations/20251108_01_update_cards_structure_to_decks.sql`

**Co to dělá**:
- ❌ Dropne staré tabulky (Cykly: Jaro/Léto/Podzim/Zima)
- ✅ Vytvoří nové tabulky:
  - `coachpro_cards` - Samotné karty
  - `coachpro_card_notes` - Poznámky klientek
- ✅ RLS policies (client může číst/editovat jen své poznámky)
- ✅ Seed data (18 mock karet pro testování)

**Struktura karet**:
- Balíčky: A, B, C, D
- Motivy: human, nature, abstract, mix
- Každá karta: id, title, description, image_url

**Jak spustit**:
1. Otevři Supabase → SQL Editor
2. Zkopíruj celý obsah souboru
3. Klikni "Run"
4. Zkontroluj: `SELECT * FROM coachpro_cards LIMIT 5;`

---

## ✅ Krok 2: Nahrát obrázky do Storage (OPTIONAL)

### 2.1 Vytvořit bucket pro karty

**Pokud chceš ukládat obrázky do Supabase Storage:**

1. Otevři Supabase → Storage
2. Klikni "New bucket"
3. Název: `coaching-cards`
4. Public bucket: **ANO** ✅
5. File size limit: 2 MB
6. Allowed MIME types: `image/webp`

### 2.2 Nahrát obrázky

```
coaching-cards/
├── deck-a/
│   ├── human/
│   │   ├── radost.webp
│   │   ├── vdecnost.webp
│   │   └── ...
│   ├── nature/
│   ├── abstract/
│   └── mix/
├── deck-b/
├── deck-c/
└── deck-d/
```

**Alternativa**: Ponechat obrázky v `/public/images/karty/` (jednodušší!)

---

## ✅ Krok 3: Ověření RLS policies

### 3.1 Zkontrolovat policies pro karty

```sql
-- Zobrazit policies
SELECT * FROM pg_policies WHERE tablename = 'coachpro_cards';

-- Mělo by vrátit:
-- Policy: "Anyone can read cards" - FOR SELECT - USING (true)
```

### 3.2 Zkontrolovat policies pro poznámky

```sql
SELECT * FROM pg_policies WHERE tablename = 'coachpro_card_notes';

-- Mělo by vrátit 3 policies:
-- 1. "Clients can read own notes" - FOR SELECT
-- 2. "Clients can insert own notes" - FOR INSERT
-- 3. "Clients can update own notes" - FOR UPDATE
```

---

## ✅ Krok 4: Test dat (OPTIONAL - už v migraci)

**Seed data jsou automaticky vložena migrací!**

Zkontroluj:
```sql
-- Počet karet
SELECT COUNT(*) FROM coachpro_cards;
-- Mělo by vrátit: 18

-- Karty podle balíčku
SELECT deck, COUNT(*) FROM coachpro_cards GROUP BY deck;
-- A: 18
-- B: 0
-- C: 0
-- D: 0

-- Karty podle motivu
SELECT motif, COUNT(*) FROM coachpro_cards GROUP BY motif;
-- human: 8
-- nature: 4
-- abstract: 2
-- mix: 2
```

---

## 📊 Co NENÍ potřeba dělat

### ❌ Nepotřebuješ:
- ~~Migraci `20250105_04_create_coaching_cards_tables.sql`~~ (stará struktura, DROP)
- ~~Migraci `20250105_05_add_client_id_to_shared_decks.sql`~~ (stará tabulka, DROP)
- ~~Vytvářet `coachpro_card_decks` tabulku~~ (koučka si vytváří balíčky v UI, ne v DB)
- ~~Vytvářet `coachpro_shared_card_decks`~~ (sdílení zatím nepotřebujeme)
- ~~Vytvářet `coachpro_card_usage`~~ (tracking přidáme později)

---

## 🎯 Shrnutí - Co máš po dokončení

### Tabulky v Supabase:
1. ✅ `coachpro_cards` - 18 mock karet (Deck A, všechny motivy)
2. ✅ `coachpro_card_notes` - Poznámky klientek (prázdná tabulka)

### RLS Security:
- ✅ Karty: Public read (kdokoliv může číst)
- ✅ Poznámky: Client-scoped (klientka vidí jen své)

### Frontend:
- ✅ `CoachingCardsPage.jsx` - Funguje s mock daty
- ✅ WebP optimalizace
- ✅ Logo + Copyright watermark
- ✅ Barevné filtry podle motivu
- ✅ 3D flip + poznámky

---

## 🚀 Po spuštění migrace

**Otestuj aplikaci**:
1. Běž na `http://localhost:3000/coach/cards`
2. Vyber balíček A
3. Vyber motiv (Člověk/Příroda/Abstrakt/Mix)
4. Měly by se zobrazit karty (placeholder pokud nejsou obrázky)
5. Klikni na kartu → 3D flip → poznámky

**Pokud vše funguje**:
- ✅ Migraci můžeš spustit i v produkci
- ✅ Nahraj WebP obrázky do `/public/images/karty/`
- ✅ Karty budou živé! 🎴✨

---

## 📝 Další kroky (budoucnost)

**Jakmile budeš chtít**:
1. Přidat další karty (Decks B, C, D)
2. Propojit poznámky s databází (uložení do `coachpro_card_notes`)
3. Sdílení balíčků s klientkami (share code)
4. Tracking použití karet
5. QR kódy pro rychlý přístup

---

**Otázky?** Pokud něco nejde, check:
- `SELECT * FROM coachpro_cards;` - Jsou tam karty?
- `SELECT * FROM pg_policies WHERE tablename IN ('coachpro_cards', 'coachpro_card_notes');` - Jsou policies?
- Browser Console - Jsou tam chyby?

---

**Vytvořeno**: 8.11.2025
**Autor**: CoachPro Team + Claude ✨
