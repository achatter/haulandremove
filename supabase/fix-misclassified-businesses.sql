-- ============================================================
-- Fix misclassified businesses
-- Run this in the Supabase SQL editor to deactivate records
-- that do not belong in their assigned category.
--
-- Safe: uses status='inactive' rather than DELETE so records
-- can be reviewed before permanent removal.
-- ============================================================

-- ── Step 1: junk_removal — deactivate by irrelevant services JSONB ──────────
-- Businesses imported from the rich-format CSV have a services JSONB column
-- that stores Google Maps subtypes (e.g. "Truck rental agency").
-- Mark inactive any junk_removal listing whose services contain ZERO
-- junk-removal-relevant keywords.
UPDATE businesses
SET status = 'inactive'
WHERE category = 'junk_removal'
  AND services IS NOT NULL
  AND jsonb_array_length(services) > 0
  AND NOT EXISTS (
    SELECT 1
    FROM jsonb_array_elements(services) AS svc
    WHERE
      lower(svc->>'name') LIKE '%junk%'       OR
      lower(svc->>'name') LIKE '%debris%'     OR
      lower(svc->>'name') LIKE '%removal%'    OR
      lower(svc->>'name') LIKE '%haul%'       OR
      lower(svc->>'name') LIKE '%waste%'      OR
      lower(svc->>'name') LIKE '%garbage%'    OR
      lower(svc->>'name') LIKE '%trash%'      OR
      lower(svc->>'name') LIKE '%disposal%'   OR
      lower(svc->>'name') LIKE '%recycl%'     OR
      lower(svc->>'name') LIKE '%dumpster%'   OR
      lower(svc->>'name') LIKE '%cleanout%'   OR
      lower(svc->>'name') LIKE '%clean out%'  OR
      lower(svc->>'name') LIKE '%sanitation%' OR
      lower(svc->>'name') LIKE '%scrap%'
  );

-- ── Step 2: junk_removal — deactivate well-known truck-rental chains ────────
-- Simple-format imports have no services JSONB; catch irrelevant businesses
-- by recognisable brand names that have no place in a junk-removal directory.
UPDATE businesses
SET status = 'inactive'
WHERE category = 'junk_removal'
  AND status = 'active'
  AND (
    lower(name) LIKE '%u-haul%'          OR
    lower(name) LIKE '%uhaul%'           OR
    lower(name) LIKE '%penske%'          OR
    lower(name) LIKE '%budget truck%'    OR
    lower(name) LIKE '%ryder truck%'     OR
    lower(name) LIKE '%national rental%' OR
    lower(name) LIKE '%trailer rental%'  OR
    lower(name) LIKE '%truck rental%'    OR
    lower(name) LIKE '%self storage%'    OR
    lower(name) LIKE '%public storage%'  OR
    lower(name) LIKE '%extra space%'     OR
    lower(name) LIKE '%life storage%'    OR
    lower(name) LIKE '%cube smart%'
  );

-- ── Step 3: estate_cleanout — deactivate clearly irrelevant businesses ───────
-- Estate-cleanout records from the simple-format CSV have no services JSONB,
-- so we rely on business name keywords to identify misclassified entries.
UPDATE businesses
SET status = 'inactive'
WHERE category = 'estate_cleanout'
  AND status = 'active'
  AND (
    lower(name) LIKE '%pressure wash%'   OR
    lower(name) LIKE '%power wash%'      OR
    lower(name) LIKE '%soft wash%'       OR
    lower(name) LIKE '%window clean%'    OR
    lower(name) LIKE '%window wash%'     OR
    lower(name) LIKE '%gutter clean%'    OR
    lower(name) LIKE '%carpet clean%'    OR
    lower(name) LIKE '%floor clean%'     OR
    lower(name) LIKE '%car wash%'        OR
    lower(name) LIKE '%auto detail%'     OR
    lower(name) LIKE '%auto wash%'       OR
    lower(name) LIKE '%auto repair%'     OR
    lower(name) LIKE '%tire %'           OR
    lower(name) LIKE '% tires%'          OR
    lower(name) LIKE '%mechanic%'        OR
    lower(name) LIKE '%transmission%'    OR
    lower(name) LIKE '%pest control%'    OR
    lower(name) LIKE '%exterminator%'    OR
    lower(name) LIKE '%termite%'         OR
    lower(name) LIKE '%lawn care%'       OR
    lower(name) LIKE '%lawn service%'    OR
    lower(name) LIKE '%landscap%'        OR
    lower(name) LIKE '%tree service%'    OR
    lower(name) LIKE '%tree trim%'       OR
    lower(name) LIKE '%tree remov%'      OR
    lower(name) LIKE '%stump%'           OR
    lower(name) LIKE '%plumb%'           OR
    lower(name) LIKE '%electrician%'     OR
    lower(name) LIKE '%electric service%' OR
    lower(name) LIKE '%hvac%'            OR
    lower(name) LIKE '%air condition%'   OR
    lower(name) LIKE '%furnace%'         OR
    lower(name) LIKE '%roofing%'         OR
    lower(name) LIKE '%roofer%'          OR
    lower(name) LIKE '%painting%'        OR
    lower(name) LIKE '%painters%'        OR
    lower(name) LIKE '%flooring%'        OR
    lower(name) LIKE '%hardwood floor%'  OR
    lower(name) LIKE '%real estate%'     OR
    lower(name) LIKE '%realty%'          OR
    lower(name) LIKE '%realtor%'         OR
    lower(name) LIKE '%insurance%'       OR
    lower(name) LIKE '%financial%'       OR
    lower(name) LIKE '%accounting%'      OR
    lower(name) LIKE '%u-haul%'          OR
    lower(name) LIKE '%uhaul%'           OR
    lower(name) LIKE '%self storage%'    OR
    lower(name) LIKE '%public storage%'  OR
    lower(name) LIKE '%hotel%'           OR
    lower(name) LIKE '%restaurant%'      OR
    lower(name) LIKE '%dentist%'         OR
    lower(name) LIKE '%dental%'          OR
    lower(name) LIKE '%medical%'         OR
    lower(name) LIKE '%clinic%'          OR
    lower(name) LIKE '%pharmacy%'        OR
    lower(name) LIKE '%gas station%'     OR
    lower(name) LIKE '%fuel station%'    OR
    lower(name) LIKE '%grocery%'         OR
    lower(name) LIKE '%supermarket%'
  );

-- ── Step 4: estate_cleanout — deactivate by irrelevant services JSONB ────────
-- For any estate_cleanout records that do have services stored.
UPDATE businesses
SET status = 'inactive'
WHERE category = 'estate_cleanout'
  AND status = 'active'
  AND services IS NOT NULL
  AND jsonb_array_length(services) > 0
  AND NOT EXISTS (
    SELECT 1
    FROM jsonb_array_elements(services) AS svc
    WHERE
      lower(svc->>'name') LIKE '%clean%'     OR
      lower(svc->>'name') LIKE '%junk%'      OR
      lower(svc->>'name') LIKE '%haul%'      OR
      lower(svc->>'name') LIKE '%remov%'     OR
      lower(svc->>'name') LIKE '%estate%'    OR
      lower(svc->>'name') LIKE '%disposal%'  OR
      lower(svc->>'name') LIKE '%moving%'    OR
      lower(svc->>'name') LIKE '%mover%'     OR
      lower(svc->>'name') LIKE '%auction%'   OR
      lower(svc->>'name') LIKE '%liquidat%'  OR
      lower(svc->>'name') LIKE '%debris%'    OR
      lower(svc->>'name') LIKE '%storage%'
  );

-- ── Verification queries (run after above to review counts) ─────────────────

-- How many businesses are now inactive?
-- SELECT category, COUNT(*) AS inactive_count
-- FROM businesses
-- WHERE status = 'inactive'
-- GROUP BY category;

-- Preview what was deactivated before committing:
-- SELECT id, name, city, state, category, services
-- FROM businesses
-- WHERE status = 'inactive'
-- ORDER BY category, name
-- LIMIT 50;

-- To permanently delete all inactive businesses (run only after review):
-- DELETE FROM businesses WHERE status = 'inactive';
