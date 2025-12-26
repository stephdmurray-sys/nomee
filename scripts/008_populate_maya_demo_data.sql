-- Populate Maya Torres' profile with comprehensive demo data
-- This showcases all premium Nomee features with realistic fake data

-- Maya's profile ID: a1b2c3d4-e5f6-7890-abcd-ef1234567890

-- First, clear any existing data for Maya
DELETE FROM contributions WHERE recipient_profile_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
DELETE FROM imported_feedback WHERE profile_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

-- Insert Nomee Submissions (contributions) - These demonstrate pattern recognition
INSERT INTO contributions (
  id,
  recipient_profile_id,
  contributor_name,
  contributor_email,
  contributor_company,
  working_relationship,
  collaboration_context,
  what_it_was_like,
  selected_traits,
  created_at,
  is_visible
) VALUES
  (
    'c1111111-1111-1111-1111-111111111111',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Sarah Chen',
    'sarah.chen@designstudio.com',
    'Velocity Design Studio',
    'client',
    'Brand redesign and website launch for our Series A',
    'Maya has this rare ability to make complex projects feel manageable. When our timeline got compressed, she reorganized everything without panic and kept the team focused on what actually mattered. She''s strategic but also genuinely easy to work with — the kind of person who makes collaboration feel natural rather than forced.',
    ARRAY['Strategic', 'Calm under pressure', 'Organized', 'Problem solver', 'Collaborative'],
    NOW() - INTERVAL '45 days',
    true
  ),
  (
    'c2222222-2222-2222-2222-222222222222',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Marcus Rodriguez',
    'marcus@techflow.io',
    'TechFlow',
    'peer',
    'Co-led product launch campaign across 3 markets',
    'Working with Maya was refreshingly straightforward. She communicates with clarity, follows through on commitments, and has a knack for asking the questions that unlock progress. Even when we hit unexpected roadblocks, she stayed calm and solution-oriented. I''d work with her again in a heartbeat.',
    ARRAY['Clear communicator', 'Reliable', 'Calm under pressure', 'Strategic', 'Thoughtful'],
    NOW() - INTERVAL '60 days',
    true
  ),
  (
    'c3333333-3333-3333-3333-333333333333',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Priya Mehta',
    'priya.mehta@brightpath.com',
    'BrightPath Consulting',
    'manager',
    'She reported to me for 14 months on growth initiatives',
    'Maya brings both strategic thinking and emotional intelligence to her work. She doesn''t just execute — she thinks through the second-order effects and potential friction points. What stood out most was her ability to build trust quickly with stakeholders and create alignment without being pushy. She''s someone I''d hire again immediately.',
    ARRAY['Strategic', 'Builds trust', 'Thoughtful', 'Emotionally intelligent', 'Reliable'],
    NOW() - INTERVAL '90 days',
    true
  ),
  (
    'c4444444-4444-4444-4444-444444444444',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'James Foster',
    'james@creativelabs.co',
    'Creative Labs',
    'peer',
    'Partnered on content strategy for Q2-Q3 campaigns',
    'Maya is one of those rare collaborators who makes your work better just by being in the room. She''s organized, yes, but also creative and willing to challenge ideas constructively. She has this gift for synthesizing messy information into clear direction. Plus, she''s just genuinely pleasant to work with — responsive, professional, and supportive.',
    ARRAY['Organized', 'Creative', 'Clear communicator', 'Supportive', 'Professional'],
    NOW() - INTERVAL '30 days',
    true
  ),
  (
    'c5555555-5555-5555-5555-555555555555',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Alex Kim',
    'alex.kim@momentum.io',
    'Momentum',
    'client',
    'Engagement strategy and execution for product launch',
    'What impressed me about Maya was her ability to balance speed with thoughtfulness. She moved fast when needed but never at the expense of quality or team morale. She has a calm, confident presence that makes high-pressure situations feel less chaotic. I trusted her judgment completely.',
    ARRAY['Calm under pressure', 'Strategic', 'Fast executor', 'Builds trust', 'Reliable'],
    NOW() - INTERVAL '75 days',
    true
  ),
  (
    'c6666666-6666-6666-6666-666666666666',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Nina Patel',
    'nina@designcollective.com',
    'Design Collective',
    'partner',
    'Collaborated on brand positioning for 3 startups',
    'Maya approaches problems with curiosity and structure in equal measure. She doesn''t rush to solutions — she asks clarifying questions, maps out options, and then moves decisively. She''s also incredibly organized without being rigid. Working with her felt like we were always a step ahead, never scrambling.',
    ARRAY['Thoughtful', 'Organized', 'Collaborative', 'Strategic', 'Problem solver'],
    NOW() - INTERVAL '50 days',
    true
  ),
  (
    'c7777777-7777-7777-7777-777777777777',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'David Park',
    'david.park@growthlabs.com',
    'Growth Labs',
    'peer',
    'Joint project on customer retention strategy',
    'Maya is strategic in the truest sense — she thinks about the whole system, not just individual tactics. She''s also incredibly reliable. When she says something will get done, it gets done. And she does it all with a level of professionalism and warmth that makes collaboration feel effortless.',
    ARRAY['Strategic', 'Reliable', 'Professional', 'Systems thinker', 'Supportive'],
    NOW() - INTERVAL '40 days',
    true
  ),
  (
    'c8888888-8888-8888-8888-888888888888',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Rachel Green',
    'rachel@impactstudio.com',
    'Impact Studio',
    'client',
    'Content marketing overhaul and team training',
    'Maya has this wonderful combination of being detail-oriented and big-picture strategic. She sees the forest and the trees. What really stood out was her ability to create calm in chaotic moments — she doesn''t get flustered, and that energy spreads to the whole team. I came away from our project feeling like I learned something.',
    ARRAY['Strategic', 'Detail-oriented', 'Calm under pressure', 'Clear communicator', 'Thoughtful'],
    NOW() - INTERVAL '65 days',
    true
  );

-- Insert Uploaded Reviews (imported_feedback) - These demonstrate screenshot review features
INSERT INTO imported_feedback (
  id,
  profile_id,
  reviewer_name,
  reviewer_company,
  reviewer_title,
  review_text,
  source_type,
  is_visible,
  created_at
) VALUES
  (
    'i1111111-1111-1111-1111-111111111111',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Jordan Taylor',
    'Elevate Partners',
    'Strategy Director',
    'Maya brought structure and clarity to a project that was spinning. She didn''t just manage tasks — she thought through the strategy, anticipated friction points, and kept everyone aligned without micromanaging. Her communication style is refreshingly direct but never harsh. I''d work with her on any project.',
    'LinkedIn',
    true,
    NOW() - INTERVAL '55 days'
  ),
  (
    'i2222222-2222-2222-2222-222222222222',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Sophie Martinez',
    'Vista Creative',
    'Head of Content',
    'What stood out about working with Maya was her ability to synthesize feedback from multiple stakeholders and find a path everyone could support. She doesn''t force consensus — she builds it through thoughtful questioning and clear communication. Plus, she''s incredibly organized and always follows through.',
    'Email',
    true,
    NOW() - INTERVAL '70 days'
  ),
  (
    'i3333333-3333-3333-3333-333333333333',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Michael Chen',
    'Catalyst Group',
    'Founder',
    'Maya is the kind of person you want on your team when things get hard. She stays calm, thinks strategically, and doesn''t let ego get in the way of good outcomes. She also has this rare ability to make complex ideas accessible without dumbing them down. Highly recommend.',
    'LinkedIn',
    true,
    NOW() - INTERVAL '35 days'
  ),
  (
    'i4444444-4444-4444-4444-444444444444',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Amanda Li',
    'Horizon Ventures',
    'Partner',
    'I worked with Maya on a tight-timeline brand positioning project. She brought both strategic depth and execution speed — a rare combination. She''s also someone who makes you feel heard. Even when pushing back on ideas, she does it thoughtfully and constructively. Would absolutely work with her again.',
    'DM',
    true,
    NOW() - INTERVAL '48 days'
  ),
  (
    'i5555555-5555-5555-5555-555555555555',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Chris Anderson',
    'Blueprint Agency',
    'Creative Director',
    'Maya has a gift for creating order without stifling creativity. She keeps projects on track but doesn''t make it feel restrictive. Her communication is clear and timely, and she has this calm, confident energy that makes high-stakes work feel more manageable. Pleasure to collaborate with.',
    'Email',
    true,
    NOW() - INTERVAL '80 days'
  );
