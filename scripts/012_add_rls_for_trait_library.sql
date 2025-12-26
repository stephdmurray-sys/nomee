-- Enable RLS on trait_library table
ALTER TABLE trait_library ENABLE ROW LEVEL SECURITY;

-- Allow public read access to trait options (no auth required)
CREATE POLICY "Allow public read access to traits"
ON trait_library
FOR SELECT
TO anon, authenticated
USING (true);

-- Only allow authenticated users with specific roles to insert/update/delete
CREATE POLICY "Only admins can modify traits"
ON trait_library
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);
