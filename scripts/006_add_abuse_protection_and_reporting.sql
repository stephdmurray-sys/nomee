-- Add rate limiting and reporting tables for abuse protection

-- Rate limits table
CREATE TABLE IF NOT EXISTS rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL, -- email or IP address
  action TEXT NOT NULL, -- 'submission', 'report', etc.
  count INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_rate_limits_identifier_action ON rate_limits(identifier, action, window_start);
CREATE INDEX idx_rate_limits_window ON rate_limits(window_start);

-- Reports table
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contribution_id UUID NOT NULL REFERENCES contributions(id) ON DELETE CASCADE,
  reporter_email TEXT,
  reason TEXT NOT NULL CHECK (reason IN ('spam', 'inappropriate', 'false_information', 'other')),
  details TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'actioned', 'dismissed')),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reports_contribution ON reports(contribution_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_created ON reports(created_at);

-- Add flagged field to contributions
ALTER TABLE contributions ADD COLUMN IF NOT EXISTS flagged BOOLEAN DEFAULT FALSE;
ALTER TABLE contributions ADD COLUMN IF NOT EXISTS flag_reason TEXT;
ALTER TABLE contributions ADD COLUMN IF NOT EXISTS flagged_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_contributions_flagged ON contributions(flagged) WHERE flagged = TRUE;

-- Function to clean old rate limits (run daily)
CREATE OR REPLACE FUNCTION clean_old_rate_limits()
RETURNS void AS $$
BEGIN
  DELETE FROM rate_limits WHERE window_start < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;
