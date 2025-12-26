-- Create example profile: Maya Torres - TikTok/Instagram Creator
-- This profile showcases the power of Nomee with 11 compelling testimonials

-- First, create an auth user for Maya (if not exists)
DO $$
DECLARE
  maya_user_id uuid;
BEGIN
  -- Check if user exists
  SELECT id INTO maya_user_id FROM auth.users WHERE email = 'maya@example-nomee.com';
  
  -- If not exists, create user
  IF maya_user_id IS NULL THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'maya@example-nomee.com',
      crypt('example-password-nomee-2024', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Maya Torres"}',
      now(),
      now(),
      '',
      ''
    )
    RETURNING id INTO maya_user_id;
  END IF;

  -- Create or update the profile
  INSERT INTO profiles (
    id,
    username,
    email,
    full_name,
    headline,
    role,
    location,
    plan,
    slug,
    created_at,
    updated_at
  ) VALUES (
    maya_user_id,
    'maya-creates',
    'maya@example-nomee.com',
    'Maya Torres',
    'Brand Partnership Specialist & Content Creator',
    'Content Creator',
    'Los Angeles, CA',
    'Premier',
    'maya-creates',
    now(),
    now()
  )
  ON CONFLICT (username) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    headline = EXCLUDED.headline,
    role = EXCLUDED.role,
    location = EXCLUDED.location,
    plan = EXCLUDED.plan,
    updated_at = now();

  -- Delete existing contributions for Maya to start fresh
  DELETE FROM contributions WHERE owner_id = maya_user_id;

  -- Insert 11 compelling testimonials that showcase Maya as exceptional to work with
  INSERT INTO contributions (
    owner_id,
    contributor_name,
    contributor_email,
    contributor_company,
    email_hash,
    written_note,
    relationship,
    status,
    confirmed_at,
    is_featured,
    created_at
  ) VALUES
  -- Testimonial 1: Brand Manager at Nike
  (
    maya_user_id,
    'Sarah Chen',
    'sarah.chen@nike.com',
    'Nike',
    encode(sha256('sarah.chen@nike.com'::bytea), 'hex'),
    'Maya brought our campaign to life in ways we never imagined. Her energy is absolutely infectious, and she made the entire process feel effortless. What stood out most was how she took our brand guidelines and elevated them with her creative instincts.',
    'I was their client',
    'confirmed',
    now() - interval '45 days',
    true,
    now() - interval '45 days'
  ),
  -- Testimonial 2: Social Media Director at Glossier
  (
    maya_user_id,
    'James Rodriguez',
    'j.rodriguez@glossier.com',
    'Glossier',
    encode(sha256('j.rodriguez@glossier.com'::bytea), 'hex'),
    'Working with Maya was like having a creative partner who just gets it. She responded to feedback instantly, brought fresh ideas to every call, and delivered content that exceeded our expectations every single time.',
    'I was their client',
    'confirmed',
    now() - interval '38 days',
    true,
    now() - interval '38 days'
  ),
  -- Testimonial 3: Fellow Creator Collaboration
  (
    maya_user_id,
    'Marcus Thompson',
    'marcus@createwithmt.com',
    'CreateWithMT',
    encode(sha256('marcus@createwithmt.com'::bytea), 'hex'),
    'Maya is the definition of a dream collaborator. Super organized, always positive, and brings an enthusiasm that makes every project fun. Our collab video hit 3M views and she made the whole process seamless.',
    'Worked together as peers',
    'confirmed',
    now() - interval '52 days',
    true,
    now() - interval '52 days'
  ),
  -- Testimonial 4: Agency Creative Director
  (
    maya_user_id,
    'Emily Park',
    'epark@sparkagency.co',
    'Spark Creative Agency',
    encode(sha256('epark@sparkagency.co'::bytea), 'hex'),
    'In 10 years of working with creators, Maya stands out. She understands brands deeply, communicates like a pro, and her creative execution is always on point. Plus, she made our entire team smile throughout the project.',
    'We collaborated as partners',
    'confirmed',
    now() - interval '60 days',
    true,
    now() - interval '60 days'
  ),
  -- Testimonial 5: Startup Founder
  (
    maya_user_id,
    'David Kim',
    'david@bloomtech.io',
    'Bloom Technologies',
    encode(sha256('david@bloomtech.io'::bytea), 'hex'),
    'Maya took our small budget and created content that looked like a million bucks. She was patient with our feedback, taught us about the creator space, and her positive attitude made the whole experience incredible.',
    'I was their client',
    'confirmed',
    now() - interval '31 days',
    true,
    now() - interval '31 days'
  ),
  -- Testimonial 6: Production Manager
  (
    maya_user_id,
    'Lisa Anderson',
    'landerson@coastproductions.com',
    'Coast Productions',
    encode(sha256('landerson@coastproductions.com'::bytea), 'hex'),
    'Maya is a production dream. Always on time, prepared, and brings solutions instead of problems. Her enthusiasm energizes the entire crew, and she nails it in one take more often than not.',
    'Worked together as peers',
    'confirmed',
    now() - interval '67 days',
    true,
    now() - interval '67 days'
  ),
  -- Testimonial 7: Brand Partnership Manager
  (
    maya_user_id,
    'Alex Rivera',
    'arivera@targetmarketing.com',
    'Target',
    encode(sha256('arivera@targetmarketing.com'::bytea), 'hex'),
    'If I could clone Maya and work with her on every campaign, I would. She makes complex projects feel simple, brings joy to every meeting, and consistently delivers content that performs incredibly well.',
    'I was their client',
    'confirmed',
    now() - interval '23 days',
    true,
    now() - interval '23 days'
  ),
  -- Testimonial 8: Fellow Content Creator
  (
    maya_user_id,
    'Priya Sharma',
    'priya@thepriyapage.com',
    'The Priya Page',
    encode(sha256('priya@thepriyapage.com'::bytea), 'hex'),
    'Maya welcomed me into a collab when I only had 10k followers. She treated me like an equal partner, shared her knowledge generously, and her genuine enthusiasm for creating together made it unforgettable.',
    'Worked together as peers',
    'confirmed',
    now() - interval '89 days',
    true,
    now() - interval '89 days'
  ),
  -- Testimonial 9: E-commerce Brand Director
  (
    maya_user_id,
    'Tom Bradley',
    'tbradley@luxeliving.com',
    'Luxe Living Co',
    encode(sha256('tbradley@luxeliving.com'::bytea), 'hex'),
    'Maya turned our product launch into a viral moment. Her creative instincts are sharp, she responds to emails faster than my own team, and working with her genuinely feels like working with a friend.',
    'I was their client',
    'confirmed',
    now() - interval '15 days',
    true,
    now() - interval '15 days'
  ),
  -- Testimonial 10: Photography Director
  (
    maya_user_id,
    'Jordan Lee',
    'jlee@focusvisuals.com',
    'Focus Visuals',
    encode(sha256('jlee@focusvisuals.com'::bytea), 'hex'),
    'Shot content with Maya for three different brands. Every single shoot, she showed up with ideas, energy, and a collaborative spirit that made my job easier. She makes everyone around her better.',
    'Worked together as peers',
    'confirmed',
    now() - interval '72 days',
    true,
    now() - interval '72 days'
  ),
  -- Testimonial 11: Marketing VP at tech company
  (
    maya_user_id,
    'Rachel Morrison',
    'rmorrison@techflow.com',
    'TechFlow',
    encode(sha256('rmorrison@techflow.com'::bytea), 'hex'),
    'Maya made creator partnerships easy for someone who had never done them before. She guided us through the process, delivered beyond what was asked, and her enthusiasm made our team excited about content creation.',
    'I was their client',
    'confirmed',
    now() - interval '8 days',
    true,
    now() - interval '8 days'
  );

END $$;
