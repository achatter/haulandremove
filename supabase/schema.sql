-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- businesses table
-- ============================================================
CREATE TABLE IF NOT EXISTS businesses (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  category        TEXT NOT NULL CHECK (category IN ('estate_cleanout', 'junk_removal')),
  description     TEXT,
  phone           TEXT,
  email           TEXT,
  website         TEXT,
  street_address  TEXT,
  city            TEXT NOT NULL,
  state           TEXT NOT NULL,
  state_full      TEXT NOT NULL,
  zip_code        TEXT NOT NULL,
  years_in_business INTEGER,
  insured         BOOLEAN NOT NULL DEFAULT false,
  bonded          BOOLEAN NOT NULL DEFAULT false,
  featured        BOOLEAN NOT NULL DEFAULT false,
  average_rating  NUMERIC(3,2) NOT NULL DEFAULT 0,
  review_count    INTEGER NOT NULL DEFAULT 0,
  search_vector   TSVECTOR,
  status          TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_businesses_search_vector ON businesses USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS idx_businesses_category ON businesses (category);
CREATE INDEX IF NOT EXISTS idx_businesses_state ON businesses (state);
CREATE INDEX IF NOT EXISTS idx_businesses_zip ON businesses (zip_code);
CREATE INDEX IF NOT EXISTS idx_businesses_status ON businesses (status);
CREATE INDEX IF NOT EXISTS idx_businesses_featured ON businesses (featured) WHERE featured = true;

-- ============================================================
-- business_images table
-- ============================================================
CREATE TABLE IF NOT EXISTS business_images (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  alt_text    TEXT NOT NULL DEFAULT '',
  is_primary  BOOLEAN NOT NULL DEFAULT false,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_business_images_business_id ON business_images (business_id);

-- ============================================================
-- reviews table
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id    UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  reviewer_name  TEXT NOT NULL,
  reviewer_email TEXT,
  rating         SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title          TEXT NOT NULL,
  body           TEXT NOT NULL,
  is_flagged     BOOLEAN NOT NULL DEFAULT false,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reviews_business_id ON reviews (business_id);
CREATE INDEX IF NOT EXISTS idx_reviews_is_flagged ON reviews (is_flagged) WHERE is_flagged = false;

-- ============================================================
-- Full-text search trigger
-- ============================================================
CREATE OR REPLACE FUNCTION update_business_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.city, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.state, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.state_full, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.zip_code, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(NEW.description, '')), 'D');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trig_update_business_search_vector ON businesses;
CREATE TRIGGER trig_update_business_search_vector
  BEFORE INSERT OR UPDATE ON businesses
  FOR EACH ROW EXECUTE FUNCTION update_business_search_vector();

-- ============================================================
-- Rating cache trigger
-- ============================================================
CREATE OR REPLACE FUNCTION update_business_rating_cache()
RETURNS TRIGGER AS $$
DECLARE
  bid UUID;
BEGIN
  bid := COALESCE(NEW.business_id, OLD.business_id);
  UPDATE businesses
  SET
    average_rating = (
      SELECT COALESCE(ROUND(AVG(rating)::numeric, 2), 0)
      FROM reviews
      WHERE business_id = bid AND is_flagged = false
    ),
    review_count = (
      SELECT COUNT(*)
      FROM reviews
      WHERE business_id = bid AND is_flagged = false
    )
  WHERE id = bid;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trig_update_business_rating ON reviews;
CREATE TRIGGER trig_update_business_rating
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_business_rating_cache();

-- ============================================================
-- Row Level Security
-- ============================================================
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Public can SELECT active businesses
CREATE POLICY "Public can view active businesses"
  ON businesses FOR SELECT
  USING (status = 'active');

-- Public can SELECT images for active businesses
CREATE POLICY "Public can view business images"
  ON business_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE businesses.id = business_images.business_id
        AND businesses.status = 'active'
    )
  );

-- Public can SELECT non-flagged reviews
CREATE POLICY "Public can view non-flagged reviews"
  ON reviews FOR SELECT
  USING (is_flagged = false);

-- Public can INSERT reviews
CREATE POLICY "Public can insert reviews"
  ON reviews FOR INSERT
  WITH CHECK (true);

-- Service role (seed script) manages everything
-- (service role bypasses RLS by default in Supabase)

-- ============================================================
-- Phase 2 additions: hours, booking, services, social media
-- ============================================================
ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS booking_url    TEXT,
  ADD COLUMN IF NOT EXISTS working_hours  JSONB,
  ADD COLUMN IF NOT EXISTS services       JSONB,
  ADD COLUMN IF NOT EXISTS social_media   JSONB;
