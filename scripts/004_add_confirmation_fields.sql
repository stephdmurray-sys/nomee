-- Add confirmation fields to contributions table
ALTER TABLE contributions
ADD COLUMN IF NOT EXISTS confirmation_token TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS confirmation_sent_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMPTZ;

-- Add index for faster token lookups
CREATE INDEX IF NOT EXISTS idx_contributions_confirmation_token 
ON contributions(confirmation_token) 
WHERE confirmation_token IS NOT NULL;

-- Update status to use 'pending_confirmation' as default
ALTER TABLE contributions 
ALTER COLUMN status SET DEFAULT 'pending_confirmation';

-- Update CHECK constraint to include new status values
ALTER TABLE contributions DROP CONSTRAINT IF EXISTS contributions_status_check;
ALTER TABLE contributions ADD CONSTRAINT contributions_status_check 
CHECK (status IN ('pending_confirmation', 'confirmed', 'rejected', 'pending'));
