-- Update Maya Torres example to use canonical trait system
-- This reflects the new contributor flow design

DO $$
DECLARE
  maya_user_id uuid;
BEGIN
  -- Get Maya's user ID
  SELECT id INTO maya_user_id FROM profiles WHERE username = 'maya-creates';
  
  IF maya_user_id IS NULL THEN
    RAISE EXCEPTION 'Maya Torres profile not found. Run script 007 first.';
  END IF;

  -- Update Maya's headline to be more focused
  UPDATE profiles 
  SET headline = 'TikTok & Instagram Content Creator | Brand Partnership Expert'
  WHERE id = maya_user_id;

  -- Delete existing trait selections to start fresh
  DELETE FROM contribution_traits WHERE contribution_id IN (
    SELECT id FROM contributions WHERE owner_id = maya_user_id
  );

  -- Add traits for each contribution using the new canonical system
  
  -- Sarah Chen (Nike) - energetic, creative, professional
  INSERT INTO contribution_traits (contribution_id, trait)
  SELECT id, 'brings_energy' FROM contributions WHERE owner_id = maya_user_id AND contributor_name = 'Sarah Chen'
  UNION ALL
  SELECT id, 'thinks_creatively' FROM contributions WHERE owner_id = maya_user_id AND contributor_name = 'Sarah Chen'
  UNION ALL
  SELECT id, 'professional' FROM contributions WHERE owner_id = maya_user_id AND contributor_name = 'Sarah Chen';

  -- James Rodriguez (Glossier) - responsive, brings ideas, reliable
  INSERT INTO contribution_traits (contribution_id, trait)
  SELECT id, 'responds_quickly' FROM contributions WHERE owner_id = maya_user_id AND contributor_name = 'James Rodriguez'
  UNION ALL
  SELECT id, 'thinks_creatively' FROM contributions WHERE owner_id = maya_user_id AND contributor_name = 'James Rodriguez'
  UNION ALL
  SELECT id, 'reliable' FROM contributions WHERE owner_id = maya_user_id AND contributor_name = 'James Rodriguez';

  -- Marcus Thompson (Fellow Creator) - organized, positive, collaborative
  INSERT INTO contribution_traits (contribution_id, trait)
  SELECT id, 'organized' FROM contributions WHERE owner_id = maya_user_id AND contributor_name = 'Marcus Thompson'
  UNION ALL
  SELECT id, 'positive_attitude' FROM contributions WHERE owner_id = maya_user_id AND contributor_name = 'Marcus Thompson'
  UNION ALL
  SELECT id, 'easy_to_work_with' FROM contributions WHERE owner_id = maya_user_id AND contributor_name = 'Marcus Thompson';

  -- Emily Park (Agency) - strategic, professional communicator, creative
  INSERT INTO contribution_traits (contribution_id, trait)
  SELECT id, 'thinks_strategically' FROM contributions WHERE owner_id = maya_user_id AND contributor_name = 'Emily Park'
  UNION ALL
  SELECT id, 'clear_communicator' FROM contributions WHERE owner_id = maya_user_id AND contributor_name = 'Emily Park'
  UNION ALL
  SELECT id, 'thinks_creatively' FROM contributions WHERE owner_id = maya_user_id AND contributor_name = 'Emily Park';

  -- David Kim (Startup) - patient, supportive teacher, positive
  INSERT INTO contribution_traits (contribution_id, trait)
  SELECT id, 'patient' FROM contributions WHERE owner_id = maya_user_id AND contributor_name = 'David Kim'
  UNION ALL
  SELECT id, 'helps_others_grow' FROM contributions WHERE owner_id = maya_user_id AND contributor_name = 'David Kim'
  UNION ALL
  SELECT id, 'positive_attitude' FROM contributions WHERE owner_id = maya_user_id AND contributor_name = 'David Kim';

  -- Lisa Anderson (Production) - prepared, solution-oriented, brings energy
  INSERT INTO contribution_traits (contribution_id, trait)
  SELECT id, 'prepared' FROM contributions WHERE owner_id = maya_user_id AND contributor_name = 'Lisa Anderson'
  UNION ALL
  SELECT id, 'solves_problems' FROM contributions WHERE owner_id = maya_user_id AND contributor_name = 'Lisa Anderson'
  UNION ALL
  SELECT id, 'brings_energy' FROM contributions WHERE owner_id = maya_user_id AND contributor_name = 'Lisa Anderson';

  -- Alex Rivera (Target) - makes things simple, positive, delivers results
  INSERT INTO contribution_traits (contribution_id, trait)
  SELECT id, 'simplifies_complexity' FROM contributions WHERE owner_id = maya_user_id AND contributor_name = 'Alex Rivera'
  UNION ALL
  SELECT id, 'positive_attitude' FROM contributions WHERE owner_id = maya_user_id AND contributor_name = 'Alex Rivera'
  UNION ALL
  SELECT id, 'delivers_results' FROM contributions WHERE owner_id = maya_user_id AND contributor_name = 'Alex Rivera';

  -- Priya Sharma (Fellow Creator) - inclusive, generous, enthusiastic
  INSERT INTO contribution_traits (contribution_id, trait)
  SELECT id, 'inclusive' FROM contributions WHERE owner_id = maya_user_id AND contributor_name = 'Priya Sharma'
  UNION ALL
  SELECT id, 'generous' FROM contributions WHERE owner_id = maya_user_id AND contributor_name = 'Priya Sharma'
  UNION ALL
  SELECT id, 'brings_energy' FROM contributions WHERE owner_id = maya_user_id AND contributor_name = 'Priya Sharma';

  -- Tom Bradley (E-commerce) - creative instincts, responsive, warm
  INSERT INTO contribution_traits (contribution_id, trait)
  SELECT id, 'thinks_creatively' FROM contributions WHERE owner_id = maya_user_id AND contributor_name = 'Tom Bradley'
  UNION ALL
  SELECT id, 'responds_quickly' FROM contributions WHERE owner_id = maya_user_id AND contributor_name = 'Tom Bradley'
  UNION ALL
  SELECT id, 'warm' FROM contributions WHERE owner_id = maya_user_id AND contributor_name = 'Tom Bradley';

  -- Jordan Lee (Photography) - collaborative, prepared, brings ideas
  INSERT INTO contribution_traits (contribution_id, trait)
  SELECT id, 'collaborative' FROM contributions WHERE owner_id = maya_user_id AND contributor_name = 'Jordan Lee'
  UNION ALL
  SELECT id, 'prepared' FROM contributions WHERE owner_id = maya_user_id AND contributor_name = 'Jordan Lee'
  UNION ALL
  SELECT id, 'thinks_creatively' FROM contributions WHERE owner_id = maya_user_id AND contributor_name = 'Jordan Lee';

  -- Rachel Morrison (TechFlow) - guides others, delivers beyond expectations, enthusiastic
  INSERT INTO contribution_traits (contribution_id, trait)
  SELECT id, 'helps_others_grow' FROM contributions WHERE owner_id = maya_user_id AND contributor_name = 'Rachel Morrison'
  UNION ALL
  SELECT id, 'goes_beyond_whats_asked' FROM contributions WHERE owner_id = maya_user_id AND contributor_name = 'Rachel Morrison'
  UNION ALL
  SELECT id, 'brings_energy' FROM contributions WHERE owner_id = maya_user_id AND contributor_name = 'Rachel Morrison';

END $$;
