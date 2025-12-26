-- NEW TRAIT SYSTEM IMPLEMENTATION
-- Four locked categories with behavioral traits only

-- Create trait library table with new structure
DROP TABLE IF EXISTS trait_library CASCADE;
CREATE TABLE trait_library (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('getting_work_done', 'working_with_others', 'showing_up_under_pressure', 'judgment_leadership')),
  sort_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert traits for Category 1: Getting Work Done
INSERT INTO trait_library (id, label, category, sort_order) VALUES
('follows_through', 'Follows through', 'getting_work_done', 1),
('gets_things_done', 'Gets things done', 'getting_work_done', 2),
('dependable', 'Dependable', 'getting_work_done', 3),
('organized', 'Organized', 'getting_work_done', 4),
('delivers_quality_work', 'Delivers quality work', 'getting_work_done', 5),
('detail_oriented', 'Detail-oriented', 'getting_work_done', 6),
('solves_problems', 'Solves problems', 'getting_work_done', 7),
('resourceful', 'Resourceful', 'getting_work_done', 8);

-- Insert traits for Category 2: Working With Others
INSERT INTO trait_library (id, label, category, sort_order) VALUES
('easy_to_work_with', 'Easy to work with', 'working_with_others', 1),
('communicates_clearly', 'Communicates clearly', 'working_with_others', 2),
('listens_well', 'Listens well', 'working_with_others', 3),
('builds_trust', 'Builds trust', 'working_with_others', 4),
('supportive', 'Supportive', 'working_with_others', 5),
('gives_helpful_feedback', 'Gives helpful feedback', 'working_with_others', 6),
('brings_alignment', 'Brings alignment', 'working_with_others', 7),
('creates_clarity', 'Creates clarity', 'working_with_others', 8);

-- Insert traits for Category 3: Showing Up Under Pressure
INSERT INTO trait_library (id, label, category, sort_order) VALUES
('calm_under_pressure', 'Calm under pressure', 'showing_up_under_pressure', 1),
('steady_presence', 'Steady presence', 'showing_up_under_pressure', 2),
('doesnt_panic', 'Doesn''t panic', 'showing_up_under_pressure', 3),
('keeps_perspective', 'Keeps perspective', 'showing_up_under_pressure', 4),
('handles_conflict_well', 'Handles conflict well', 'showing_up_under_pressure', 5),
('emotionally_aware', 'Emotionally aware', 'showing_up_under_pressure', 6),
('thoughtful', 'Thoughtful', 'showing_up_under_pressure', 7),
('positive_energy', 'Positive energy', 'showing_up_under_pressure', 8);

-- Insert traits for Category 4: Judgment & Leadership
INSERT INTO trait_library (id, label, category, sort_order) VALUES
('thinks_strategically', 'Thinks strategically', 'judgment_leadership', 1),
('makes_sound_decisions', 'Makes sound decisions', 'judgment_leadership', 2),
('takes_ownership', 'Takes ownership', 'judgment_leadership', 3),
('sets_clear_priorities', 'Sets clear priorities', 'judgment_leadership', 4),
('balances_speed_quality', 'Balances speed and quality', 'judgment_leadership', 5),
('sees_around_corners', 'Sees around corners', 'judgment_leadership', 6),
('brings_structure', 'Brings structure to ambiguity', 'judgment_leadership', 7),
('improves_team_outcomes', 'Improves team outcomes', 'judgment_leadership', 8);

-- Update contributions table to use four trait categories
ALTER TABLE contributions 
  DROP COLUMN IF EXISTS traits_category4;

ALTER TABLE contributions
  ADD COLUMN IF NOT EXISTS traits_category4 TEXT[] DEFAULT '{}';

-- Update constraints
ALTER TABLE contributions 
  DROP CONSTRAINT IF EXISTS valid_traits_count1,
  DROP CONSTRAINT IF EXISTS valid_traits_count2,
  DROP CONSTRAINT IF EXISTS valid_traits_count3,
  DROP CONSTRAINT IF EXISTS valid_traits_count4;

ALTER TABLE contributions
  ADD CONSTRAINT valid_traits_count1 CHECK (array_length(traits_category1, 1) IS NULL OR array_length(traits_category1, 1) <= 2),
  ADD CONSTRAINT valid_traits_count2 CHECK (array_length(traits_category2, 1) IS NULL OR array_length(traits_category2, 1) <= 2),
  ADD CONSTRAINT valid_traits_count3 CHECK (array_length(traits_category3, 1) IS NULL OR array_length(traits_category3, 1) <= 2),
  ADD CONSTRAINT valid_traits_count4 CHECK (array_length(traits_category4, 1) IS NULL OR array_length(traits_category4, 1) <= 2);

-- Grant public read access to trait_library
GRANT SELECT ON trait_library TO anon, authenticated;
