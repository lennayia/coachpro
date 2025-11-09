-- ============================================================================
-- KOUČOVACÍ KARTY - Update na novou strukturu (Balíčky A/B/C/D)
-- ============================================================================
-- Created: 8. listopadu 2025
-- Purpose: Změna z Cyklů (Jaro/Léto/Podzim/Zima) na Balíčky (A/B/C/D)
-- Motivy: Člověk, Příroda, Abstrakt, Mix
-- ============================================================================

-- ============================================================================
-- 1. DROP STARÉ TABULKY (pokud existují)
-- ============================================================================

DROP TABLE IF EXISTS coachpro_card_usage CASCADE;
DROP TABLE IF EXISTS coachpro_shared_card_decks CASCADE;
DROP TABLE IF EXISTS coachpro_card_decks CASCADE;
DROP TABLE IF EXISTS coachpro_cards CASCADE;

-- ============================================================================
-- 2. NOVÁ CARDS TABLE (samotné karty)
-- ============================================================================

CREATE TABLE coachpro_cards (
  id TEXT PRIMARY KEY,                    -- deck-a-human-radost
  deck TEXT NOT NULL CHECK (deck IN ('A', 'B', 'C', 'D')),
  motif TEXT NOT NULL CHECK (motif IN ('human', 'nature', 'abstract', 'mix')),
  title TEXT NOT NULL,                    -- Radost, Vděčnost, Síla, atd.
  description TEXT,                       -- Co mi dnes přineslo radost?
  image_url TEXT,                         -- /images/karty/deck-a/human/radost.webp
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexy
CREATE INDEX idx_coachpro_cards_deck ON coachpro_cards(deck);
CREATE INDEX idx_coachpro_cards_motif ON coachpro_cards(motif);

-- RLS Policies (public read)
ALTER TABLE coachpro_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read cards"
  ON coachpro_cards FOR SELECT
  TO public
  USING (true);

-- ============================================================================
-- 3. CARD NOTES TABLE (poznámky klientek ke kartám)
-- ============================================================================

CREATE TABLE coachpro_card_notes (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  card_id TEXT NOT NULL REFERENCES coachpro_cards(id) ON DELETE CASCADE,
  client_id TEXT REFERENCES coachpro_clients(id) ON DELETE CASCADE, -- Nullable for non-registered
  client_name TEXT,                       -- Fallback pro code-based access
  notes TEXT,                             -- Poznámky klientky
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexy
CREATE INDEX idx_coachpro_card_notes_card_id ON coachpro_card_notes(card_id);
CREATE INDEX idx_coachpro_card_notes_client_id ON coachpro_card_notes(client_id);

-- RLS Policies
ALTER TABLE coachpro_card_notes ENABLE ROW LEVEL SECURITY;

-- Client může číst jen své poznámky
CREATE POLICY "Clients can read own notes"
  ON coachpro_card_notes FOR SELECT
  TO authenticated
  USING (
    client_id IN (
      SELECT id FROM coachpro_client_profiles WHERE auth_user_id = auth.uid()
    )
  );

-- Client může vkládat své poznámky
CREATE POLICY "Clients can insert own notes"
  ON coachpro_card_notes FOR INSERT
  TO authenticated
  WITH CHECK (
    client_id IN (
      SELECT id FROM coachpro_client_profiles WHERE auth_user_id = auth.uid()
    )
  );

-- Client může editovat své poznámky
CREATE POLICY "Clients can update own notes"
  ON coachpro_card_notes FOR UPDATE
  TO authenticated
  USING (
    client_id IN (
      SELECT id FROM coachpro_client_profiles WHERE auth_user_id = auth.uid()
    )
  );

-- ============================================================================
-- 4. SEED DATA - Mock karty pro testování
-- ============================================================================

INSERT INTO coachpro_cards (id, deck, motif, title, description, image_url) VALUES
  -- Deck A - Human
  ('deck-a-human-radost', 'A', 'human', 'Radost', 'Co mi dnes přineslo radost?', '/images/karty/deck-a/human/radost.webp'),
  ('deck-a-human-vdecnost', 'A', 'human', 'Vděčnost', 'Za co jsem dnes vděčný/á?', '/images/karty/deck-a/human/vdecnost.webp'),
  ('deck-a-human-sila', 'A', 'human', 'Síla', 'Kdy jsem dnes cítil/a svou sílu?', '/images/karty/deck-a/human/sila.webp'),
  ('deck-a-human-odvaha', 'A', 'human', 'Odvaha', 'V čem jsem dnes projevil/a odvahu?', '/images/karty/deck-a/human/odvaha.webp'),
  ('deck-a-human-laskavost', 'A', 'human', 'Laskavost', 'Ke komu jsem dnes byl/a laskavý/á?', '/images/karty/deck-a/human/laskavost.webp'),
  ('deck-a-human-klid', 'A', 'human', 'Klid', 'Kdy jsem dnes našel/našla klid?', '/images/karty/deck-a/human/klid.webp'),
  ('deck-a-human-kreativita', 'A', 'human', 'Kreativita', 'Jak jsem dnes vyjádřil/a svou kreativitu?', '/images/karty/deck-a/human/kreativita.webp'),
  ('deck-a-human-spojeni', 'A', 'human', 'Spojení', 'S kým jsem dnes prohloubil/a spojení?', '/images/karty/deck-a/human/spojeni.webp'),

  -- Deck A - Nature
  ('deck-a-nature-radost', 'A', 'nature', 'Radost', 'Co mi dnes přineslo radost?', '/images/karty/deck-a/nature/radost.webp'),
  ('deck-a-nature-vdecnost', 'A', 'nature', 'Vděčnost', 'Za co jsem dnes vděčný/á?', '/images/karty/deck-a/nature/vdecnost.webp'),
  ('deck-a-nature-sila', 'A', 'nature', 'Síla', 'Kdy jsem dnes cítil/a svou sílu?', '/images/karty/deck-a/nature/sila.webp'),
  ('deck-a-nature-odvaha', 'A', 'nature', 'Odvaha', 'V čem jsem dnes projevil/a odvahu?', '/images/karty/deck-a/nature/odvaha.webp'),

  -- Deck A - Abstract
  ('deck-a-abstract-radost', 'A', 'abstract', 'Radost', 'Co mi dnes přineslo radost?', '/images/karty/deck-a/abstract/radost.webp'),
  ('deck-a-abstract-vdecnost', 'A', 'abstract', 'Vděčnost', 'Za co jsem dnes vděčný/á?', '/images/karty/deck-a/abstract/vdecnost.webp'),

  -- Deck A - Mix
  ('deck-a-mix-radost', 'A', 'mix', 'Radost', 'Co mi dnes přineslo radost?', '/images/karty/deck-a/mix/radost.webp'),
  ('deck-a-mix-vdecnost', 'A', 'mix', 'Vděčnost', 'Za co jsem dnes vděčný/á?', '/images/karty/deck-a/mix/vdecnost.webp')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- DONE! Spusť v Supabase SQL Editor
-- ============================================================================
-- POZNÁMKA: Tato migrace DROPUJE staré tabulky!
-- Pokud máš produkční data, zálohuj je PŘED spuštěním!
-- ============================================================================
