-- ========================================
-- NOMEE REBUILD: New Product Schema
-- ========================================
-- This migration creates the new schema for Nomee's 3-layer architecture:
-- 1) Collection Layer (contribution submissions)
-- 2) Truth Layer (immutable confirmed contributions)
-- 3) Presentation Layer (featured/pinned controls)

-- Add new columns to profiles table for the new product
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS slug text UNIQUE,
ADD COLUMN IF NOT EXISTS headline text,
ADD COLUMN IF NOT EXISTS tone_preset text DEFAULT 'Default' CHECK (tone_preset IN ('Professional', 'Warm', 'Creator-neutral', 'Default')),
ADD COLUMN IF NOT EXISTS plan text DEFAULT 'Free' CHECK (plan IN ('Free', 'Pro', 'Premier'));

-- Create index on slug for fast lookups
CREATE INDEX IF NOT EXISTS profiles_slug_idx ON profiles(slug);

-- Update profiles to generate slugs from username (for existing users)
UPDATE profiles SET slug = username WHERE slug IS NULL AND username IS NOT NULL;

-- Add new columns to contributions table for identity-backed submissions
ALTER TABLE contributions
ADD COLUMN IF NOT EXISTS email_hash text, -- Hash for uniqueness check without exposing email
ADD COLUMN IF NOT EXISTS confirmed_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS traits_category1 text[], -- Array of trait IDs, max 2
ADD COLUMN IF NOT EXISTS traits_category2 text[], -- Array of trait IDs, max 2
ADD COLUMN IF NOT EXISTS traits_category3 text[]; -- Array of trait IDs, max 2

-- Update status column to use new statuses
ALTER TABLE contributions
DROP CONSTRAINT IF EXISTS contributions_status_check;

ALTER TABLE contributions
ADD CONSTRAINT contributions_status_check CHECK (status IN ('PENDING_CONFIRMATION', 'CONFIRMED', 'REJECTED'));

-- Create unique index: one contribution per email per profile
CREATE UNIQUE INDEX IF NOT EXISTS contributions_email_hash_profile_unique 
ON contributions(email_hash, profile_id) 
WHERE status IN ('CONFIRMED', 'PENDING_CONFIRMATION');

-- Create new table: featured_settings (Presentation Layer controls)
CREATE TABLE IF NOT EXISTS featured_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  featured_contribution_ids uuid[] DEFAULT '{}', -- Ordered list of featured contributions
  pinned_contribution_ids uuid[] DEFAULT '{}', -- Max 2 pinned (enforce in app logic)
  section_order text[] DEFAULT '{}', -- Array defining order of sections on public page
  embed_enabled boolean DEFAULT false,
  embed_quote_ids uuid[] DEFAULT '{}', -- Which contributions appear in embed
  updated_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(profile_id)
);

-- Create RLS policies for featured_settings
ALTER TABLE featured_settings ENABLE ROW LEVEL SECURITY;

-- Users can read their own featured settings
CREATE POLICY featured_settings_select_own ON featured_settings
  FOR SELECT
  USING (auth.uid() = profile_id);

-- Users can insert their own featured settings
CREATE POLICY featured_settings_insert_own ON featured_settings
  FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

-- Users can update their own featured settings  
CREATE POLICY featured_settings_update_own ON featured_settings
  FOR UPDATE
  USING (auth.uid() = profile_id);

-- Update RLS policies for contributions to support public contributor flow
-- Allow anonymous users to insert contributions
DROP POLICY IF EXISTS contributions_insert_anonymous ON contributions;
CREATE POLICY contributions_insert_anonymous ON contributions
  FOR INSERT
  WITH CHECK (true); -- Anyone can submit (email confirmation required before CONFIRMED status)

-- Allow public to read CONFIRMED contributions
DROP POLICY IF EXISTS contributions_select_approved ON contributions;
CREATE POLICY contributions_select_public ON contributions
  FOR SELECT
  USING (status = 'CONFIRMED');

-- Profile owners can see all contributions (including PENDING)
CREATE POLICY contributions_select_own_all ON contributions
  FOR SELECT
  USING (auth.uid() = profile_id);

-- Add function to auto-update featured_settings.updated_at
CREATE OR REPLACE FUNCTION update_featured_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_featured_settings_timestamp
  BEFORE UPDATE ON featured_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_featured_settings_updated_at();

-- Add check constraint to profiles: slug must be lowercase and alphanumeric with hyphens only
ALTER TABLE profiles
ADD CONSTRAINT profiles_slug_format CHECK (slug ~ '^[a-z0-9-]+$');

COMMENT ON TABLE featured_settings IS 'Presentation layer controls for Pro/Premier plans - controls what is featured, not what exists';
COMMENT ON COLUMN contributions.email_hash IS 'SHA-256 hash of contributor email for uniqueness enforcement';
COMMENT ON COLUMN contributions.status IS 'PENDING_CONFIRMATION: awaiting email confirm | CONFIRMED: approved and visible | REJECTED: spam/abuse (admin only)';
COMMENT ON COLUMN profiles.plan IS 'Free: system-selected featured (max 5) | Pro: user-controlled featured + all perspectives | Premier: Pro + embed';
