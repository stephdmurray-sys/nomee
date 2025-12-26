-- Add plan field to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'premier'));

-- Add is_featured field to contributions table
ALTER TABLE contributions ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Add index for featured contributions
CREATE INDEX IF NOT EXISTS idx_contributions_featured ON contributions(profile_id, is_featured, status) WHERE is_featured = true AND status = 'confirmed';

-- Update existing profiles to have 'free' plan
UPDATE profiles SET plan = 'free' WHERE plan IS NULL;

COMMENT ON COLUMN profiles.plan IS 'User subscription plan: free (1 featured), starter (3 featured), premier (unlimited featured + embed)';
COMMENT ON COLUMN contributions.is_featured IS 'Whether this contribution is featured on the public Nomee page';
