-- Create storage bucket for voice recordings
INSERT INTO storage.buckets (id, name, public)
VALUES ('voices', 'voices', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to voices
CREATE POLICY "Public can read voice recordings"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'voices');

-- Allow authenticated users to upload voice recordings
CREATE POLICY "Users can upload voice recordings"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'voices');

-- Allow contributors to upload without authentication (via service role)
CREATE POLICY "Service role can upload voice recordings"
ON storage.objects FOR INSERT
TO service_role
WITH CHECK (bucket_id = 'voices');
