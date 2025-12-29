-- Add vibe data (traits_category4) to all of Maya Torres' contributions
-- This will enable the Vibe Highlight Bar, Pattern Recognition, and AI Summary to display properly

-- Update each contribution with appropriate vibes from the locked vibe list:
-- Energized, Focused, Aligned, Inspired, Empowered, Calm, Supported, Seen, Safe, Elevated, Unstuck, Grounded

UPDATE contributions
SET traits_category4 = ARRAY['Focused', 'Empowered']
WHERE id = '0b9f0de9-7b4d-4fde-a2b3-e2c23256ccd7'
AND owner_id = (SELECT id FROM profiles WHERE slug = 'maya-torres');

UPDATE contributions
SET traits_category4 = ARRAY['Supported', 'Aligned']
WHERE id = '1883e1df-d293-4f18-a334-a6bb254ae806'
AND owner_id = (SELECT id FROM profiles WHERE slug = 'maya-torres');

UPDATE contributions
SET traits_category4 = ARRAY['Calm', 'Grounded']
WHERE id = '27636030-ec5d-4886-b6b8-2b11112196d2'
AND owner_id = (SELECT id FROM profiles WHERE slug = 'maya-torres');

-- Update remaining 5 contributions with varied vibes
UPDATE contributions
SET traits_category4 = ARRAY['Inspired', 'Elevated']
WHERE owner_id = (SELECT id FROM profiles WHERE slug = 'maya-torres')
AND traits_category4 = ARRAY[]::text[]
AND id NOT IN ('0b9f0de9-7b4d-4fde-a2b3-e2c23256ccd7', '1883e1df-d293-4f18-a334-a6bb254ae806', '27636030-ec5d-4886-b6b8-2b11112196d2')
LIMIT 2;

UPDATE contributions
SET traits_category4 = ARRAY['Energized', 'Focused']
WHERE owner_id = (SELECT id FROM profiles WHERE slug = 'maya-torres')
AND traits_category4 = ARRAY[]::text[]
LIMIT 2;

UPDATE contributions
SET traits_category4 = ARRAY['Safe', 'Supported']
WHERE owner_id = (SELECT id FROM profiles WHERE slug = 'maya-torres')
AND traits_category4 = ARRAY[]::text[]
LIMIT 1;

-- Verify the update
SELECT 
  COUNT(*) as total_contributions,
  COUNT(CASE WHEN array_length(traits_category4, 1) > 0 THEN 1 END) as contributions_with_vibes
FROM contributions
WHERE owner_id = (SELECT id FROM profiles WHERE slug = 'maya-torres');
