-- Add access date columns to coachpro_clients table
-- Umožňuje koučce nastavit individuální časové omezení přístupu pro každou klientku

ALTER TABLE coachpro_clients
ADD COLUMN IF NOT EXISTS access_start_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS access_end_date TIMESTAMP WITH TIME ZONE;

COMMENT ON COLUMN coachpro_clients.access_start_date IS 'Datum od kdy má klientka přístup k programu (nastavuje koučka)';
COMMENT ON COLUMN coachpro_clients.access_end_date IS 'Datum do kdy má klientka přístup k programu (null = neomezeno)';

-- Index pro rychlé vyhledávání aktivních přístupů
CREATE INDEX IF NOT EXISTS idx_coachpro_clients_access_dates
ON coachpro_clients(access_start_date, access_end_date);
