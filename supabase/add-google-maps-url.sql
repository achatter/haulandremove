-- ============================================================
-- Add google_maps_url column
-- Run this in the Supabase SQL editor against the live DB, then
-- re-run `npm run import-csv` to backfill values from the source
-- CSVs (the import script fully clears and re-inserts businesses).
-- ============================================================

ALTER TABLE businesses ADD COLUMN IF NOT EXISTS google_maps_url TEXT;
