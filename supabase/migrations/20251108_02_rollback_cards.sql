-- ============================================================================
-- ROLLBACK - Vrátit zpět staré tabulky
-- ============================================================================
-- Created: 8. listopadu 2025
-- Purpose: Obnovit původní strukturu z 5.1.2025
-- ============================================================================

-- ============================================================================
-- 1. DROP nové tabulky (pokud existují)
-- ============================================================================

DROP TABLE IF EXISTS coachpro_card_notes CASCADE;
DROP TABLE IF EXISTS coachpro_cards CASCADE;

-- ============================================================================
-- 2. OBNOVIT STARÉ TABULKY
-- ============================================================================

-- Zkopírováno z 20250105_04_create_coaching_cards_tables.sql

-- Cards table
CREATE TABLE IF NOT EXISTS coachpro_cards (
  id TEXT PRIMARY KEY,
  motiv TEXT NOT NULL CHECK (motiv IN ('Člověk', 'Příroda', 'Abstrakt')),
  cyklus TEXT NOT NULL CHECK (cyklus IN ('Jaro', 'Léto', 'Podzim', 'Zima')),
  primarni_emoce TEXT NOT NULL,
  poznamka_pred TEXT NOT NULL,
  nazev_karty TEXT NOT NULL,
  klicove_tema TEXT NOT NULL,
  mechanismus TEXT NOT NULL,
  afirmace TEXT NOT NULL,
  koucovaci_text TEXT NOT NULL,
  cilovy_stav TEXT NOT NULL,
  poznamka_po TEXT NOT NULL,
  image_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_coachpro_cards_motiv ON coachpro_cards(motiv);
CREATE INDEX IF NOT EXISTS idx_coachpro_cards_cyklus ON coachpro_cards(cyklus);

ALTER TABLE coachpro_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read cards"
  ON coachpro_cards FOR SELECT
  TO public
  USING (true);

-- Card decks table
CREATE TABLE IF NOT EXISTS coachpro_card_decks (
  id TEXT PRIMARY KEY,
  coach_id TEXT NOT NULL REFERENCES coachpro_coaches(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  motiv TEXT NOT NULL CHECK (motiv IN ('Člověk', 'Příroda', 'Abstrakt', 'Mix')),
  cyklus TEXT NOT NULL CHECK (cyklus IN ('Jaro', 'Léto', 'Podzim', 'Zima')),
  card_ids JSONB NOT NULL DEFAULT '[]',
  share_code TEXT UNIQUE NOT NULL,
  qr_code TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_coachpro_card_decks_coach_id ON coachpro_card_decks(coach_id);
CREATE INDEX IF NOT EXISTS idx_coachpro_card_decks_share_code ON coachpro_card_decks(share_code);
CREATE INDEX IF NOT EXISTS idx_coachpro_card_decks_is_active ON coachpro_card_decks(is_active);

ALTER TABLE coachpro_card_decks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read card decks"
  ON coachpro_card_decks FOR SELECT TO public USING (true);
CREATE POLICY "Anyone can insert card decks"
  ON coachpro_card_decks FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Anyone can update card decks"
  ON coachpro_card_decks FOR UPDATE TO public USING (true);
CREATE POLICY "Anyone can delete card decks"
  ON coachpro_card_decks FOR DELETE TO public USING (true);

-- Shared card decks table
CREATE TABLE IF NOT EXISTS coachpro_shared_card_decks (
  id TEXT PRIMARY KEY,
  client_name TEXT NOT NULL,
  deck_id TEXT NOT NULL REFERENCES coachpro_card_decks(id) ON DELETE CASCADE,
  share_code TEXT NOT NULL,
  access_start_date TIMESTAMP WITH TIME ZONE,
  access_end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_coachpro_shared_card_decks_deck_id ON coachpro_shared_card_decks(deck_id);
CREATE INDEX IF NOT EXISTS idx_coachpro_shared_card_decks_share_code ON coachpro_shared_card_decks(share_code);

ALTER TABLE coachpro_shared_card_decks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read shared card decks"
  ON coachpro_shared_card_decks FOR SELECT TO public USING (true);
CREATE POLICY "Anyone can insert shared card decks"
  ON coachpro_shared_card_decks FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Anyone can update shared card decks"
  ON coachpro_shared_card_decks FOR UPDATE TO public USING (true);

-- Card usage table
CREATE TABLE IF NOT EXISTS coachpro_card_usage (
  id TEXT PRIMARY KEY,
  shared_deck_id TEXT NOT NULL REFERENCES coachpro_shared_card_decks(id) ON DELETE CASCADE,
  card_id TEXT NOT NULL REFERENCES coachpro_cards(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  step_reached TEXT CHECK (step_reached IN ('pred', 'praxe', 'po')),
  completed BOOLEAN DEFAULT false,
  notes TEXT,
  used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_coachpro_card_usage_shared_deck_id ON coachpro_card_usage(shared_deck_id);
CREATE INDEX IF NOT EXISTS idx_coachpro_card_usage_card_id ON coachpro_card_usage(card_id);
CREATE INDEX IF NOT EXISTS idx_coachpro_card_usage_client_name ON coachpro_card_usage(client_name);

ALTER TABLE coachpro_card_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read card usage"
  ON coachpro_card_usage FOR SELECT TO public USING (true);
CREATE POLICY "Anyone can insert card usage"
  ON coachpro_card_usage FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Anyone can update card usage"
  ON coachpro_card_usage FOR UPDATE TO public USING (true);

-- ============================================================================
-- DONE! Tabulky obnoveny na původní stav
-- ============================================================================
