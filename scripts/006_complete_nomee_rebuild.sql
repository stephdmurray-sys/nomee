-- NOMEE COMPLETE REBUILD
-- Drop all old tables and create new schema from scratch

-- Drop old tables
DROP TABLE IF EXISTS contributions CASCADE;
DROP TABLE IF EXISTS recognitions CASCADE;
DROP TABLE IF EXISTS share_tokens CASCADE;
DROP TABLE IF EXISTS voice_recordings CASCADE;
DROP TABLE IF EXISTS traits CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- Create new schema

-- Users table (update existing profiles)
ALTER TABLE profiles 
  ADD COLUMN IF NOT EXISTS headline TEXT DEFAULT 'Building my professional reputation',
  ADD COLUMN IF NOT EXISTS tone_preset TEXT DEFAULT 'Professional' CHECK (tone_preset IN ('Professional', 'Warm', 'Creator-neutral', 'Default')),
  ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'Free' CHECK (plan IN ('Free', 'Pro', 'Premier')),
  ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Generate slugs for existing users without one
UPDATE profiles 
SET slug = LOWER(REGEXP_REPLACE(COALESCE(username, full_name, email), '[^a-zA-Z0-9]+', '-', 'g'))
WHERE slug IS NULL;

-- Contributions table (new structure)
CREATE TABLE IF NOT EXISTS contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Contributor identity (required)
  contributor_name TEXT NOT NULL,
  contributor_email TEXT NOT NULL,
  contributor_company TEXT NOT NULL,
  relationship TEXT NOT NULL CHECK (relationship IN (
    'Worked together as peers',
    'I was their manager',
    'They were my manager',
    'I was their client',
    'We collaborated as partners',
    'Other professional relationship'
  )),
  
  -- Traits (up to 2 per category)
  traits_category1 TEXT[] DEFAULT '{}',
  traits_category2 TEXT[] DEFAULT '{}',
  traits_category3 TEXT[] DEFAULT '{}',
  
  -- Content
  written_note TEXT NOT NULL,
  voice_url TEXT,
  
  -- Status tracking
  status TEXT NOT NULL DEFAULT 'PENDING_CONFIRMATION' CHECK (status IN ('PENDING_CONFIRMATION', 'CONFIRMED', 'REJECTED')),
  email_hash TEXT NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  
  -- Prevent duplicate submissions
  CONSTRAINT unique_email_per_owner UNIQUE (owner_id, email_hash),
  
  -- Validation
  CONSTRAINT valid_traits_count1 CHECK (array_length(traits_category1, 1) IS NULL OR array_length(traits_category1, 1) <= 2),
  CONSTRAINT valid_traits_count2 CHECK (array_length(traits_category2, 1) IS NULL OR array_length(traits_category2, 1) <= 2),
  CONSTRAINT valid_traits_count3 CHECK (array_length(traits_category3, 1) IS NULL OR array_length(traits_category3, 1) <= 2)
);

-- Featured settings (Pro/Premier controls)
CREATE TABLE IF NOT EXISTS featured_settings (
  owner_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  featured_contribution_ids UUID[] DEFAULT '{}',
  pinned_contribution_ids UUID[] DEFAULT '{}',
  section_order TEXT[] DEFAULT '{}',
  embed_enabled BOOLEAN DEFAULT FALSE,
  embed_quote_ids UUID[] DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Validation
  CONSTRAINT max_pinned CHECK (array_length(pinned_contribution_ids, 1) IS NULL OR array_length(pinned_contribution_ids, 1) <= 2)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_contributions_owner ON contributions(owner_id);
CREATE INDEX IF NOT EXISTS idx_contributions_status ON contributions(status);
CREATE INDEX IF NOT EXISTS idx_contributions_confirmed ON contributions(owner_id, status) WHERE status = 'CONFIRMED';
CREATE INDEX IF NOT EXISTS idx_profiles_slug ON profiles(slug);
CREATE INDEX IF NOT EXISTS idx_contributions_email_hash ON contributions(email_hash);

-- RLS Policies

-- Contributions: Anyone can submit (INSERT), owner can read their own
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit contributions" ON contributions;
CREATE POLICY "Anyone can submit contributions"
  ON contributions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view own contributions" ON contributions;
CREATE POLICY "Users can view own contributions"
  ON contributions FOR SELECT
  TO authenticated
  USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Public can view confirmed contributions" ON contributions;
CREATE POLICY "Public can view confirmed contributions"
  ON contributions FOR SELECT
  TO anon, authenticated
  USING (status = 'CONFIRMED');

DROP POLICY IF EXISTS "Users can update own pending contributions" ON contributions;
CREATE POLICY "Users can update own pending contributions"
  ON contributions FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id AND status = 'PENDING_CONFIRMATION')
  WITH CHECK (auth.uid() = owner_id);

-- Featured settings: Only owner can manage
ALTER TABLE featured_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own featured settings" ON featured_settings;
CREATE POLICY "Users manage own featured settings"
  ON featured_settings FOR ALL
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Function to generate email hash
CREATE OR REPLACE FUNCTION generate_email_hash(email TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN encode(digest(LOWER(TRIM(email)), 'sha256'), 'hex');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Trigger to auto-generate email_hash
CREATE OR REPLACE FUNCTION set_email_hash()
RETURNS TRIGGER AS $$
BEGIN
  NEW.email_hash := generate_email_hash(NEW.contributor_email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_email_hash ON contributions;
CREATE TRIGGER trigger_set_email_hash
  BEFORE INSERT ON contributions
  FOR EACH ROW
  EXECUTE FUNCTION set_email_hash();
