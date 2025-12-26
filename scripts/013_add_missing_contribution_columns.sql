-- Add missing columns to contributions table
ALTER TABLE contributions
  ADD COLUMN IF NOT EXISTS confirmation_token TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS confirmation_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS flagged BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS flag_reason TEXT,
  ADD COLUMN IF NOT EXISTS flagged_at TIMESTAMPTZ;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_contributions_confirmation_token
  ON contributions(confirmation_token)
  WHERE confirmation_token IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_contributions_flagged
  ON contributions(flagged)
  WHERE flagged = TRUE;

-- Add comment for documentation
COMMENT ON COLUMN contributions.confirmation_token IS 'Unique token sent via email for contributor verification';
COMMENT ON COLUMN contributions.confirmation_sent_at IS 'Timestamp when confirmation email was sent';
COMMENT ON COLUMN contributions.flagged IS 'Auto-flagged for spam or inappropriate content';
COMMENT ON COLUMN contributions.flag_reason IS 'Reason for flagging (spam patterns, inappropriate content, etc.)';
COMMENT ON COLUMN contributions.flagged_at IS 'Timestamp when content was flagged';
