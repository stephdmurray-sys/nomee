-- Add onboarding purpose field to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS purpose TEXT;

-- Create index for purpose queries
CREATE INDEX IF NOT EXISTS idx_profiles_purpose ON profiles(purpose);
