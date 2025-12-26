-- Add lead_impression column to profiles table for storing the selected lead phrase
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS lead_impression TEXT,
  ADD COLUMN IF NOT EXISTS lead_impression_selected_at TIMESTAMPTZ;

-- Add comment for documentation
COMMENT ON COLUMN profiles.lead_impression IS 'Selected lead phrase extracted from verified feedback - displays prominently on public profile';
COMMENT ON COLUMN profiles.lead_impression_selected_at IS 'Timestamp when lead impression was selected or updated';

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_profiles_lead_impression ON profiles(id) WHERE lead_impression IS NOT NULL;
