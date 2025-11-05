-- ============================================================================
-- Přidání client_id do coachpro_shared_card_decks
-- ============================================================================
-- Created: 5. ledna 2025
-- Purpose: Sdílení karet s konkrétní klientkou (ne jen jméno)
-- ============================================================================

-- Přidej sloupec client_id (nullable - fallback pro starší záznamy)
ALTER TABLE coachpro_shared_card_decks
ADD COLUMN IF NOT EXISTS client_id TEXT REFERENCES coachpro_clients(id) ON DELETE CASCADE;

-- Index pro rychlé vyhledávání podle client_id
CREATE INDEX IF NOT EXISTS idx_coachpro_shared_card_decks_client_id
ON coachpro_shared_card_decks(client_id);

-- ============================================================================
-- DONE! Run this migration in Supabase SQL Editor
-- ============================================================================
