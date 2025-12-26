-- Create storage bucket for voice recordings
insert into storage.buckets (id, name, public)
values ('voice-recordings', 'voice-recordings', true)
on conflict (id) do nothing;

-- Allow public access to read voice recordings
create policy "Public read access"
  on storage.objects for select
  using (bucket_id = 'voice-recordings');

-- Allow authenticated users to upload voice recordings
create policy "Authenticated users can upload"
  on storage.objects for insert
  with check (bucket_id = 'voice-recordings');
