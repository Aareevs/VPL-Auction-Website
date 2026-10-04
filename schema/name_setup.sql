-- Add full_name column if it doesn't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS full_name text;

-- Allow users to update their own full_name (if not covered by existing policies)
-- The existing policy "Users can update own profile" covers all columns usually, 
-- but ensuring it exists is good practice.
-- If you need to backfill existing users who log in again, the upsert in Onboarding will handle it.
