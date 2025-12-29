-- Add relationship_context field to contributions table
ALTER TABLE contributions 
  ADD COLUMN IF NOT EXISTS relationship_context TEXT;

-- Add comment for documentation
COMMENT ON COLUMN contributions.relationship_context IS 'Additional context about the relationship (company, project, or community)';

-- Create index for searching
CREATE INDEX IF NOT EXISTS idx_contributions_relationship_context 
  ON contributions(relationship_context) 
  WHERE relationship_context IS NOT NULL;
