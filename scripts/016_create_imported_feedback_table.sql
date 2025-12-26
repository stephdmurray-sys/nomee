-- Create imported_feedback table for screenshot uploads
-- This is NOT a Nomee and does NOT count toward verified contributions

CREATE TABLE IF NOT EXISTS imported_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Owner relationship
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Source data
  raw_image_url TEXT NOT NULL,
  ocr_text TEXT,
  
  -- AI extraction results
  ai_extracted_excerpt TEXT, -- 1-2 sentences, positive only
  giver_name TEXT DEFAULT 'Not specified',
  giver_company TEXT,
  giver_role TEXT,
  source_type TEXT CHECK (source_type IN ('Email', 'LinkedIn', 'DM', 'Review', 'Other')),
  approx_date DATE,
  
  -- Traits from locked list only (stored as array)
  traits TEXT[] DEFAULT '{}',
  
  -- Confidence and approval
  confidence_score DECIMAL(3, 2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  approved_by_owner BOOLEAN DEFAULT FALSE,
  
  -- Visibility
  visibility TEXT DEFAULT 'private' CHECK (visibility IN ('public', 'private')),
  
  -- Metadata
  label TEXT DEFAULT 'Uploaded by profile owner',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_imported_feedback_profile_id ON imported_feedback(profile_id);
CREATE INDEX IF NOT EXISTS idx_imported_feedback_approved ON imported_feedback(profile_id, approved_by_owner) WHERE approved_by_owner = TRUE;
CREATE INDEX IF NOT EXISTS idx_imported_feedback_visibility ON imported_feedback(profile_id, visibility) WHERE visibility = 'public';
CREATE INDEX IF NOT EXISTS idx_imported_feedback_created_at ON imported_feedback(created_at DESC);

-- RLS Policies
ALTER TABLE imported_feedback ENABLE ROW LEVEL SECURITY;

-- Profile owners can read ALL their own imported feedback (approved or not)
CREATE POLICY "Profile owners can view their imported feedback"
  ON imported_feedback
  FOR SELECT
  USING (
    profile_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

-- Profile owners can insert their own imported feedback
CREATE POLICY "Profile owners can insert imported feedback"
  ON imported_feedback
  FOR INSERT
  WITH CHECK (
    profile_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

-- Profile owners can update their own imported feedback
CREATE POLICY "Profile owners can update their imported feedback"
  ON imported_feedback
  FOR UPDATE
  USING (
    profile_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

-- Profile owners can delete their own imported feedback
CREATE POLICY "Profile owners can delete their imported feedback"
  ON imported_feedback
  FOR DELETE
  USING (
    profile_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

-- Public can view only approved AND public imported feedback
CREATE POLICY "Public can view approved public imported feedback"
  ON imported_feedback
  FOR SELECT
  USING (
    approved_by_owner = TRUE 
    AND visibility = 'public'
  );

-- Add comment documenting the table purpose
COMMENT ON TABLE imported_feedback IS 'Uploaded screenshots of previous feedback. NOT verified Nomees. Clearly labeled as uploaded by profile owner.';

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_imported_feedback_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  IF NEW.approved_by_owner = TRUE AND OLD.approved_by_owner = FALSE THEN
    NEW.approved_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_imported_feedback_updated_at
  BEFORE UPDATE ON imported_feedback
  FOR EACH ROW
  EXECUTE FUNCTION update_imported_feedback_updated_at();
