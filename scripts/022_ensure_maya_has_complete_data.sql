-- Ensure Maya Torres has complete contribution data for demo purposes
-- This ensures the Summary and Pattern Recognition sections display properly

DO $$
DECLARE
  maya_profile_id UUID;
BEGIN
  -- Get Maya's profile ID
  SELECT id INTO maya_profile_id
  FROM profiles
  WHERE slug = 'maya-torres' OR slug = 'maya-creates'
  LIMIT 1;

  IF maya_profile_id IS NULL THEN
    RAISE NOTICE 'Maya Torres profile not found';
    RETURN;
  END IF;

  -- Ensure all 8 contributions have written_note field populated
  UPDATE contributions
  SET written_note = COALESCE(
    written_note,
    CASE 
      WHEN contributor_name LIKE 'Casey%' THEN 'Maya creates such a safe space for creative exploration. She encouraged us to think bigger while keeping us grounded in what was actually possible. That balance is hard to find.'
      WHEN contributor_name LIKE 'Morgan%' THEN 'In high-pressure situations, Maya is the person you want in the room. She stays calm, asks the right questions, and helps everyone think more clearly. Her presence elevates the whole team.'
      WHEN contributor_name LIKE 'Jordan%' THEN 'Working with Maya was transformative. She has this unique ability to see both the forest and the trees. Strategic thinking combined with incredible attention to detail.'
      WHEN contributor_name LIKE 'Sam%' THEN 'Maya brings such positive energy to every project. She''s empowering without being pushy, focused without being rigid. People genuinely enjoy collaborating with her.'
      WHEN contributor_name LIKE 'Alex%' THEN 'What stands out most about Maya is how she makes complex problems feel manageable. She breaks things down clearly and keeps everyone aligned on the big picture.'
      WHEN contributor_name LIKE 'Taylor%' THEN 'Maya has this gift for seeing details that would derail a launch while never losing sight of the bigger picture. Detail-oriented, strategic, and thorough - truly impressive.'
      WHEN contributor_name LIKE 'Riley%' THEN 'Maya is one of the most empowering leaders I''ve worked with. She trusts her team, gives clear direction, and creates an environment where people do their best work.'
      ELSE 'Maya is exceptionally talented at building partnerships and driving results. Her combination of strategic thinking and execution is rare. She makes everyone around her better.'
    END
  )
  WHERE profile_id = maya_profile_id;

  -- Ensure relationship field is populated
  UPDATE contributions
  SET relationship = COALESCE(relationship, 'Colleague')
  WHERE profile_id = maya_profile_id
  AND relationship IS NULL;

  RAISE NOTICE 'Maya Torres contribution data updated successfully';
END $$;
