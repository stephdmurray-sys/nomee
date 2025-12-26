-- Add audio status tracking fields to contributions table
-- These are nullable/optional and won't break existing submissions

ALTER TABLE contributions
  ADD COLUMN IF NOT EXISTS audio_status TEXT DEFAULT 'none' CHECK (audio_status IN ('none', 'recorded', 'uploaded', 'failed')),
  ADD COLUMN IF NOT EXISTS audio_path TEXT,
  ADD COLUMN IF NOT EXISTS audio_duration_ms INTEGER;

-- Create Supabase Storage bucket for audio (if not exists)
-- This will be created automatically when first upload happens
