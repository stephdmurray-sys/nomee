-- Comprehensive Trait Seed Data
-- Implements the full canonical trait list from requirements

TRUNCATE TABLE trait_library CASCADE;

-- HOW THEY WORK
INSERT INTO trait_library (label, category, sort_order) VALUES
('Fast', 'how_they_work', 1),
('Thorough', 'how_they_work', 2),
('Organized', 'how_they_work', 3),
('Reliable', 'how_they_work', 4),
('Proactive', 'how_they_work', 5),
('Takes ownership', 'how_they_work', 6),
('Crisp communicator', 'how_they_work', 7),
('Clear expectations', 'how_they_work', 8),
('Calm under pressure', 'how_they_work', 9),
('Action-oriented', 'how_they_work', 10),
('Flexible', 'how_they_work', 11),
('Follow-through', 'how_they_work', 12);

-- WHAT IT FEELS LIKE
INSERT INTO trait_library (label, category, sort_order) VALUES
('Easy', 'what_it_feels_like', 1),
('Energizing', 'what_it_feels_like', 2),
('Supportive', 'what_it_feels_like', 3),
('Collaborative', 'what_it_feels_like', 4),
('Safe', 'what_it_feels_like', 5),
('Fun', 'what_it_feels_like', 6),
('Motivating', 'what_it_feels_like', 7),
('Efficient', 'what_it_feels_like', 8),
('Respectful', 'what_it_feels_like', 9),
('Low-stress', 'what_it_feels_like', 10),
('Inspiring', 'what_it_feels_like', 11),
('Trustworthy', 'what_it_feels_like', 12);

-- HOW THEY THINK
INSERT INTO trait_library (label, category, sort_order) VALUES
('Strategic', 'how_they_think', 1),
('Creative', 'how_they_think', 2),
('Analytical', 'how_they_think', 3),
('Practical', 'how_they_think', 4),
('Big-picture', 'how_they_think', 5),
('Detail-minded', 'how_they_think', 6),
('Problem-solver', 'how_they_think', 7),
('Customer-first', 'how_they_think', 8),
('Data-driven', 'how_they_think', 9),
('Decisive', 'how_they_think', 10),
('Thoughtful', 'how_they_think', 11),
('Curious', 'how_they_think', 12);

-- HOW THEY SHOW UP
INSERT INTO trait_library (label, category, sort_order) VALUES
('Empathetic', 'how_they_show_up', 1),
('Encouraging', 'how_they_show_up', 2),
('Direct (in a good way)', 'how_they_show_up', 3),
('Advocates for others', 'how_they_show_up', 4),
('Gives credit', 'how_they_show_up', 5),
('Coaches others', 'how_they_show_up', 6),
('Inclusive', 'how_they_show_up', 7),
('Patient', 'how_they_show_up', 8),
('Honest feedback', 'how_they_show_up', 9),
('Shows gratitude', 'how_they_show_up', 10),
('Leads by example', 'how_they_show_up', 11),
('Makes time', 'how_they_show_up', 12);
