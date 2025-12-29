-- Update Maya's profile slug from maya-creates to maya-torres and add vibes
DO $$
DECLARE
  maya_user_id uuid;
BEGIN
  -- Get Maya's user ID from profiles
  SELECT id INTO maya_user_id FROM profiles WHERE username = 'maya-creates';

  IF maya_user_id IS NULL THEN
    RAISE EXCEPTION 'Maya profile not found with username maya-creates';
  END IF;

  -- Update Maya's slug to match the URL everyone is using
  UPDATE profiles 
  SET 
    slug = 'maya-torres',
    headline = 'Brand Strategy & Creative Collaboration'
  WHERE id = maya_user_id;

  -- Clear existing trait data to rebuild with vibes
  UPDATE contributions 
  SET 
    traits_category1 = ARRAY[]::text[],
    traits_category2 = ARRAY[]::text[],
    traits_category3 = ARRAY[]::text[],
    traits_category4 = ARRAY[]::text[]
  WHERE recipient_profile_id = maya_user_id::text;

  -- Update Sarah Chen's contribution with vibes
  UPDATE contributions
  SET 
    traits_category1 = ARRAY['Strategic', 'Organized', 'Problem solver']::text[],
    traits_category2 = ARRAY['Collaborative', 'Clear communicator']::text[],
    traits_category4 = ARRAY['Calm', 'Focused']::text[]
  WHERE recipient_profile_id = maya_user_id::text AND contributor_name = 'Sarah Chen';

  -- Update Marcus Rodriguez's contribution with vibes
  UPDATE contributions
  SET 
    traits_category1 = ARRAY['Strategic', 'Reliable']::text[],
    traits_category2 = ARRAY['Clear communicator', 'Thoughtful']::text[],
    traits_category4 = ARRAY['Calm', 'Supported']::text[]
  WHERE recipient_profile_id = maya_user_id::text AND contributor_name = 'Marcus Rodriguez';

  -- Update Priya Mehta's contribution with vibes
  UPDATE contributions
  SET 
    traits_category1 = ARRAY['Strategic', 'Builds trust', 'Thoughtful']::text[],
    traits_category2 = ARRAY['Emotionally intelligent', 'Reliable']::text[],
    traits_category4 = ARRAY['Empowered', 'Aligned']::text[]
  WHERE recipient_profile_id = maya_user_id::text AND contributor_name = 'Priya Mehta';

  -- Update James Foster's contribution with vibes
  UPDATE contributions
  SET 
    traits_category1 = ARRAY['Organized', 'Creative']::text[],
    traits_category2 = ARRAY['Clear communicator', 'Supportive', 'Professional']::text[],
    traits_category4 = ARRAY['Inspired', 'Energized']::text[]
  WHERE recipient_profile_id = maya_user_id::text AND contributor_name = 'James Foster';

  -- Update Alex Kim's contribution with vibes
  UPDATE contributions
  SET 
    traits_category1 = ARRAY['Strategic', 'Fast executor', 'Builds trust']::text[],
    traits_category2 = ARRAY['Reliable', 'Calm under pressure']::text[],
    traits_category4 = ARRAY['Calm', 'Grounded']::text[]
  WHERE recipient_profile_id = maya_user_id::text AND contributor_name = 'Alex Kim';

  -- Update Nina Patel's contribution with vibes
  UPDATE contributions
  SET 
    traits_category1 = ARRAY['Thoughtful', 'Organized', 'Strategic']::text[],
    traits_category2 = ARRAY['Collaborative', 'Problem solver']::text[],
    traits_category4 = ARRAY['Focused', 'Supported']::text[]
  WHERE recipient_profile_id = maya_user_id::text AND contributor_name = 'Nina Patel';

  -- Update David Park's contribution with vibes
  UPDATE contributions
  SET 
    traits_category1 = ARRAY['Strategic', 'Reliable', 'Systems thinker']::text[],
    traits_category2 = ARRAY['Professional', 'Supportive']::text[],
    traits_category4 = ARRAY['Calm', 'Seen']::text[]
  WHERE recipient_profile_id = maya_user_id::text AND contributor_name = 'David Park';

  -- Update Rachel Green's contribution with vibes
  UPDATE contributions
  SET 
    traits_category1 = ARRAY['Strategic', 'Detail-oriented']::text[],
    traits_category2 = ARRAY['Calm under pressure', 'Clear communicator', 'Thoughtful']::text[],
    traits_category4 = ARRAY['Elevated', 'Inspired']::text[]
  WHERE recipient_profile_id = maya_user_id::text AND contributor_name = 'Rachel Green';

  RAISE NOTICE 'Successfully updated Maya Torres profile slug and added vibes to contributions';
END $$;
