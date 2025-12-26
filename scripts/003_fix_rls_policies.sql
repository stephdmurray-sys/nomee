-- Add anonymous insert policy for recognitions (required for /give flow)
drop policy if exists "recognitions_insert_anonymous" on public.recognitions;

create policy "recognitions_insert_anonymous"
  on public.recognitions for insert
  with check (true);

-- Update storage policies to allow anonymous uploads
drop policy if exists "Authenticated users can upload" on storage.objects;
drop policy if exists "Anonymous users can upload" on storage.objects;

create policy "Anyone can upload voice recordings"
  on storage.objects for insert
  with check (bucket_id = 'voice-recordings');
