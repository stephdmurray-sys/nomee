-- Add is_featured field for dashboard functionality
ALTER TABLE contributions
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;

-- Add index for featured contributions queries
CREATE INDEX IF NOT EXISTS idx_contributions_is_featured
  ON contributions(owner_id, is_featured)
  WHERE is_featured = TRUE AND status = 'confirmed';

COMMENT ON COLUMN contributions.is_featured IS 'Whether this contribution is featured on the public profile';
