-- Add duration field to contributions table
-- This captures how long the contributor worked with the profile owner

ALTER TABLE contributions
  ADD COLUMN IF NOT EXISTS duration TEXT;

-- Add check constraint for valid duration values
ALTER TABLE contributions
  ADD CONSTRAINT contributions_duration_check
  CHECK (duration IN (
    'less_than_6_months',
    '6_to_12_months',
    '1_to_2_years',
    '3_to_5_years',
    '5_plus_years'
  ));

-- Add index for analytics queries
CREATE INDEX IF NOT EXISTS idx_contributions_duration
  ON contributions(duration)
  WHERE duration IS NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN contributions.duration IS 'How long the contributor worked with the profile owner: less_than_6_months, 6_to_12_months, 1_to_2_years, 3_to_5_years, 5_plus_years';
