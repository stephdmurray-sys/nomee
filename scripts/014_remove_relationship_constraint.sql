-- Remove strict CHECK constraint from relationship column
-- This allows any relationship value from the updated dropdown to be stored

-- Drop the old CHECK constraint
ALTER TABLE contributions 
  DROP CONSTRAINT IF EXISTS contributions_relationship_check;

-- The relationship column remains TEXT NOT NULL but now accepts any value
-- No need to recreate the column since it's already TEXT

-- Add comment documenting the change
COMMENT ON COLUMN contributions.relationship IS 'Working relationship between contributor and profile owner. Accepts any text value from the relationship dropdown.';

-- Verify existing data is still valid (optional check)
DO $$
BEGIN
  RAISE NOTICE 'Relationship constraint removed. Column now accepts any text value.';
END $$;
