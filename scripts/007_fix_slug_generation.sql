-- Fix slug generation for profiles

-- Drop the old trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create function to generate slug from name
CREATE OR REPLACE FUNCTION generate_slug_from_name(name TEXT, email TEXT)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INT := 0;
BEGIN
  -- Generate base slug from name, fallback to email
  base_slug := LOWER(REGEXP_REPLACE(
    COALESCE(NULLIF(TRIM(name), ''), SPLIT_PART(email, '@', 1)),
    '[^a-zA-Z0-9]+',
    '-',
    'g'
  ));
  
  -- Trim leading/trailing dashes
  base_slug := TRIM(BOTH '-' FROM base_slug);
  
  -- Start with base slug
  final_slug := base_slug;
  
  -- Check for uniqueness and append counter if needed
  WHILE EXISTS (SELECT 1 FROM profiles WHERE slug = final_slug) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Update existing profiles without slugs
UPDATE profiles
SET slug = generate_slug_from_name(full_name, email)
WHERE slug IS NULL OR slug = '';

-- Create trigger function to auto-generate slug for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_name TEXT;
  user_email TEXT;
BEGIN
  -- Get name from metadata, fallback to 'User'
  user_name := COALESCE(NEW.raw_user_meta_data->>'full_name', 'User');
  user_email := NEW.email;
  
  -- Insert profile with auto-generated slug
  INSERT INTO public.profiles (id, full_name, email, slug)
  VALUES (
    NEW.id,
    user_name,
    user_email,
    generate_slug_from_name(user_name, user_email)
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Make slug NOT NULL after fixing existing records
ALTER TABLE profiles ALTER COLUMN slug SET NOT NULL;
