-- ============================================================================
-- KOUČOVACÍ KARTY V2 - Bezpečná migrace (ponechává staré tabulky)
-- ============================================================================
-- Created: 8. listopadu 2025
-- Purpose: Nový systém karet (Balíčky A/B/C/D) bez rušení starého systému
-- ============================================================================

-- ⚠️ BEZPEČNÁ MIGRACE:
-- - Staré tabulky (coachpro_cards, coachpro_card_decks, atd.) zůstávají nedotčené
-- - Nové tabulky mají suffix _v2
-- - Starý frontend bude fungovat dál
-- - Nový frontend bude používat _v2 tabulky

-- ============================================================================
-- 1. NOVÁ CARDS TABLE V2 (samotné karty)
-- ============================================================================

CREATE TABLE IF NOT EXISTS coachpro_cards_v2 (
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
CREATE INDEX IF NOT EXISTS idx_coachpro_cards_v2_deck ON coachpro_cards_v2(deck);
CREATE INDEX IF NOT EXISTS idx_coachpro_cards_v2_motif ON coachpro_cards_v2(motif);

-- RLS Policies (public read)
ALTER TABLE coachpro_cards_v2 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read cards v2"
  ON coachpro_cards_v2 FOR SELECT
  TO public
  USING (true);

-- ============================================================================
-- 2. CARD NOTES TABLE V2 (poznámky klientek ke kartám)
-- ============================================================================

CREATE TABLE IF NOT EXISTS coachpro_card_notes_v2 (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  card_id TEXT NOT NULL REFERENCES coachpro_cards_v2(id) ON DELETE CASCADE,
  client_id UUID,                          -- Nullable - UUID z client_profiles.id
  client_name TEXT,                        -- Fallback pro code-based access
  notes TEXT,                              -- Poznámky klientky
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexy
CREATE INDEX IF NOT EXISTS idx_coachpro_card_notes_v2_card_id ON coachpro_card_notes_v2(card_id);
CREATE INDEX IF NOT EXISTS idx_coachpro_card_notes_v2_client_id ON coachpro_card_notes_v2(client_id);

-- RLS Policies
ALTER TABLE coachpro_card_notes_v2 ENABLE ROW LEVEL SECURITY;

-- Client může číst jen své poznámky
CREATE POLICY "Clients can read own notes v2"
  ON coachpro_card_notes_v2 FOR SELECT
  TO authenticated
  USING (
    client_id IN (
      SELECT id FROM coachpro_client_profiles WHERE auth_user_id = auth.uid()
    )
  );

-- Client může vkládat své poznámky
CREATE POLICY "Clients can insert own notes v2"
  ON coachpro_card_notes_v2 FOR INSERT
  TO authenticated
  WITH CHECK (
    client_id IN (
      SELECT id FROM coachpro_client_profiles WHERE auth_user_id = auth.uid()
    )
  );

-- Client může editovat své poznámky
CREATE POLICY "Clients can update own notes v2"
  ON coachpro_card_notes_v2 FOR UPDATE
  TO authenticated
  USING (
    client_id IN (
      SELECT id FROM coachpro_client_profiles WHERE auth_user_id = auth.uid()
    )
  );

-- ============================================================================
-- 3. SEED DATA - Mock karty pro testování (Deck A pouze)
-- ============================================================================

INSERT INTO coachpro_cards_v2 (id, deck, motif, title, description, image_url) VALUES
  -- Deck A - Human (8 karet)
  ('deck-a-human-radost', 'A', 'human', 'Radost', 'Co mi dnes přineslo radost?', '/images/karty/deck-a/human/radost.webp'),
  ('deck-a-human-vdecnost', 'A', 'human', 'Vděčnost', 'Za co jsem dnes vděčný/á?', '/images/karty/deck-a/human/vdecnost.webp'),
  ('deck-a-human-sila', 'A', 'human', 'Síla', 'Kdy jsem dnes cítil/a svou sílu?', '/images/karty/deck-a/human/sila.webp'),
  ('deck-a-human-odvaha', 'A', 'human', 'Odvaha', 'V čem jsem dnes projevil/a odvahu?', '/images/karty/deck-a/human/odvaha.webp'),
  ('deck-a-human-laskavost', 'A', 'human', 'Laskavost', 'Ke komu jsem dnes byl/a laskavý/á?', '/images/karty/deck-a/human/laskavost.webp'),
  ('deck-a-human-klid', 'A', 'human', 'Klid', 'Kdy jsem dnes našel/našla klid?', '/images/karty/deck-a/human/klid.webp'),
  ('deck-a-human-kreativita', 'A', 'human', 'Kreativita', 'Jak jsem dnes vyjádřil/a svou kreativitu?', '/images/karty/deck-a/human/kreativita.webp'),
  ('deck-a-human-spojeni', 'A', 'human', 'Spojení', 'S kým jsem dnes prohloubil/a spojení?', '/images/karty/deck-a/human/spojeni.webp'),

  -- Deck A - Nature (4 karty)
  ('deck-a-nature-radost', 'A', 'nature', 'Radost', 'Co mi dnes přineslo radost?', '/images/karty/deck-a/nature/radost.webp'),
  ('deck-a-nature-vdecnost', 'A', 'nature', 'Vděčnost', 'Za co jsem dnes vděčný/á?', '/images/karty/deck-a/nature/vdecnost.webp'),
  ('deck-a-nature-sila', 'A', 'nature', 'Síla', 'Kdy jsem dnes cítil/a svou sílu?', '/images/karty/deck-a/nature/sila.webp'),
  ('deck-a-nature-odvaha', 'A', 'nature', 'Odvaha', 'V čem jsem dnes projevil/a odvahu?', '/images/karty/deck-a/nature/odvaha.webp'),

  -- Deck A - Abstract (2 karty)
  ('deck-a-abstract-radost', 'A', 'abstract', 'Radost', 'Co mi dnes přineslo radost?', '/images/karty/deck-a/abstract/radost.webp'),
  ('deck-a-abstract-vdecnost', 'A', 'abstract', 'Vděčnost', 'Za co jsem dnes vděčný/á?', '/images/karty/deck-a/abstract/vdecnost.webp'),

  -- Deck A - Mix (2 karty)
  ('deck-a-mix-radost', 'A', 'mix', 'Radost', 'Co mi dnes přineslo radost?', '/images/karty/deck-a/mix/radost.webp'),
  ('deck-a-mix-vdecnost', 'A', 'mix', 'Vděčnost', 'Za co jsem dnes vděčný/á?', '/images/karty/deck-a/mix/vdecnost.webp')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- DONE! Nové tabulky vytvořeny, staré zachovány
-- ============================================================================

-- OVĚŘENÍ:
-- SELECT COUNT(*) FROM coachpro_cards_v2;          -- Mělo by vrátit 18
-- SELECT COUNT(*) FROM coachpro_card_notes_v2;     -- Mělo by vrátit 0
-- SELECT COUNT(*) FROM coachpro_cards;             -- Stará tabulka stále funguje (0)
-- SELECT COUNT(*) FROM coachpro_card_decks;        -- Stará tabulka stále funguje (0)

-- POZNÁMKA:
-- - Staré komponenty (CardDecksLibrary.jsx) budou používat staré tabulky
-- - Nový komponenty (CoachingCardsPage.jsx) budou používat _v2 tabulky
-- - Později můžeš dropnout staré tabulky, až nebudou potřeba
