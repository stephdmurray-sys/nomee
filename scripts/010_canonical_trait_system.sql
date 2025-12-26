-- Canonical Trait System Migration
-- This implements the exact trait structure from the specification

-- Clear existing traits
TRUNCATE TABLE trait_library CASCADE;

-- Insert canonical traits organized by category

-- CATEGORY: How They Work
INSERT INTO trait_library (label, category, sort_order) VALUES
('Reliable', 'how_they_work', 1),
('Detail-oriented', 'how_they_work', 2),
('Strategic', 'how_they_work', 3),
('Fast', 'how_they_work', 4),
('Thoughtful', 'how_they_work', 5),
('Organized', 'how_they_work', 6),
('Resourceful', 'how_they_work', 7),
('Proactive', 'how_they_work', 8);

-- CATEGORY: What Working With Them Feels Like
INSERT INTO trait_library (label, category, sort_order) VALUES
('Collaborative', 'what_it_feels_like', 1),
('Supportive', 'what_it_feels_like', 2),
('Direct', 'what_it_feels_like', 3),
('Empowering', 'what_it_feels_like', 4),
('Easygoing', 'what_it_feels_like', 5),
('Energizing', 'what_it_feels_like', 6),
('Respectful', 'what_it_feels_like', 7),
('Inspiring', 'what_it_feels_like', 8);

-- CATEGORY: How They Think
INSERT INTO trait_library (label, category, sort_order) VALUES
('Creative', 'how_they_think', 1),
('Analytical', 'how_they_think', 2),
('Big-picture', 'how_they_think', 3),
('Practical', 'how_they_think', 4),
('Curious', 'how_they_think', 5),
('Systems-minded', 'how_they_think', 6),
('Innovative', 'how_they_think', 7),
('Data-driven', 'how_they_think', 8);

-- CATEGORY: How They Show Up for Others
INSERT INTO trait_library (label, category, sort_order) VALUES
('Generous', 'how_they_show_up', 1),
('Honest', 'how_they_show_up', 2),
('Steady', 'how_they_show_up', 3),
('Advocate', 'how_they_show_up', 4),
('Mentor', 'how_they_show_up', 5),
('Patient', 'how_they_show_up', 6),
('Accountable', 'how_they_show_up', 7),
('Authentic', 'how_they_show_up', 8);
