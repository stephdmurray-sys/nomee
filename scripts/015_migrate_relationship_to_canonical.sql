-- Migrate relationship column to use canonical lowercase snake_case values
-- This ensures database compatibility with the new value/label system

-- Step 1: Add a temporary column for the new canonical values
ALTER TABLE contributions 
  ADD COLUMN IF NOT EXISTS relationship_canonical TEXT;

-- Step 2: Migrate existing data to canonical format
UPDATE contributions
SET relationship_canonical = CASE
  WHEN relationship ILIKE 'Peer' OR relationship = 'peer' THEN 'peer'
  WHEN relationship ILIKE 'Manager' OR relationship = 'manager' THEN 'manager'
  WHEN relationship ILIKE 'Direct Report' OR relationship = 'direct_report' THEN 'direct_report'
  WHEN relationship ILIKE 'Client' OR relationship = 'client' THEN 'client'
  WHEN relationship ILIKE 'Customer' OR relationship = 'customer' THEN 'customer'
  WHEN relationship ILIKE 'Vendor' OR relationship = 'vendor' THEN 'vendor'
  WHEN relationship ILIKE 'Contractor' OR relationship = 'contractor' THEN 'contractor'
  WHEN relationship ILIKE 'Consultant' OR relationship = 'consultant' THEN 'consultant'
  WHEN relationship ILIKE 'Agency' OR relationship = 'agency' THEN 'agency'
  WHEN relationship ILIKE 'Brand Partner' OR relationship = 'brand_partner' THEN 'brand_partner'
  WHEN relationship ILIKE 'Collaborator' OR relationship = 'collaborator' THEN 'collaborator'
  WHEN relationship ILIKE 'Affiliate' OR relationship = 'affiliate' THEN 'affiliate'
  WHEN relationship ILIKE 'Other' OR relationship = 'other' THEN 'other'
  ELSE 'other' -- Default fallback
END
WHERE relationship_canonical IS NULL;

-- Step 3: Drop the old column
ALTER TABLE contributions DROP COLUMN IF EXISTS relationship;

-- Step 4: Rename the new canonical column to "relationship"
ALTER TABLE contributions RENAME COLUMN relationship_canonical TO relationship;

-- Step 5: Ensure NOT NULL constraint
ALTER TABLE contributions 
  ALTER COLUMN relationship SET NOT NULL;

-- Step 6: Add index for performance
CREATE INDEX IF NOT EXISTS idx_contributions_relationship 
  ON contributions(relationship);

-- Step 7: Add comment documenting the canonical values
COMMENT ON COLUMN contributions.relationship IS 'Canonical relationship value (lowercase snake_case): peer, manager, direct_report, client, customer, vendor, contractor, consultant, agency, brand_partner, collaborator, affiliate, other';
