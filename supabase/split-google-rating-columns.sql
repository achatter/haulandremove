-- ============================================================
-- Split Google-derived rating from on-site rating (issue #72)
--
-- Previously average_rating/review_count served two conflicting
-- purposes: imported CSVs wrote Google-scraped aggregates into
-- them, but the trig_update_business_rating trigger also
-- overwrote them from the `reviews` table on every insert. The
-- moment a business got its first on-site review, its original
-- Google-sourced rating was silently and permanently lost.
--
-- This adds dedicated google_average_rating/google_review_count
-- columns, backfills them from the current (as of this writing,
-- still Google-sourced) average_rating/review_count for every
-- business that has zero real reviews, then resets
-- average_rating/review_count to the correct on-site-only
-- aggregate for all businesses.
--
-- Run this in the Supabase SQL editor AFTER `git pull`ing the
-- updated schema.sql, then re-run `npm run import-csv` to fully
-- backfill google_maps_url/google_average_rating/google_review_count
-- for all businesses going forward.
-- ============================================================

ALTER TABLE businesses ADD COLUMN IF NOT EXISTS google_average_rating NUMERIC(3,2) NOT NULL DEFAULT 0;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS google_review_count   INTEGER NOT NULL DEFAULT 0;

ALTER TABLE businesses ADD COLUMN IF NOT EXISTS display_rating NUMERIC(3,2) GENERATED ALWAYS AS (
  CASE WHEN review_count > 0 THEN average_rating ELSE google_average_rating END
) STORED;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS display_review_count INTEGER GENERATED ALWAYS AS (
  CASE WHEN review_count > 0 THEN review_count ELSE google_review_count END
) STORED;

CREATE INDEX IF NOT EXISTS idx_businesses_display_rating ON businesses (display_rating DESC);

-- Step 1: for businesses with no real on-site reviews, their current
-- average_rating/review_count is still the original Google aggregate —
-- copy it into the new columns before it can be overwritten.
UPDATE businesses b
SET google_average_rating = b.average_rating,
    google_review_count   = b.review_count
WHERE NOT EXISTS (
  SELECT 1 FROM reviews r WHERE r.business_id = b.id AND r.is_flagged = false
);

-- Step 2: reset average_rating/review_count to the correct on-site-only
-- aggregate for every business (0 for businesses with no real reviews;
-- for businesses that already had real reviews, this matches what the
-- trigger already maintains — their original Google numbers, unfortunately,
-- were already overwritten before this migration and cannot be recovered
-- here; re-run `npm run import-csv` to restore fresh Google data for them).
UPDATE businesses b
SET average_rating = COALESCE(
      (SELECT ROUND(AVG(r.rating)::numeric, 2) FROM reviews r WHERE r.business_id = b.id AND r.is_flagged = false),
      0
    ),
    review_count = COALESCE(
      (SELECT COUNT(*) FROM reviews r WHERE r.business_id = b.id AND r.is_flagged = false),
      0
    );
