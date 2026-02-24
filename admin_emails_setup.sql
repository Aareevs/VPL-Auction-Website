-- ============================================
-- Admin Emails Table & Dynamic Admin Management
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Create the admin_emails table
CREATE TABLE IF NOT EXISTS admin_emails (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  added_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable RLS
ALTER TABLE admin_emails ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
-- Everyone can read (needed for onboarding check)
DROP POLICY IF EXISTS "Anyone can view admin emails" ON admin_emails;
CREATE POLICY "Anyone can view admin emails"
  ON admin_emails FOR SELECT
  USING (true);

-- Only admins can insert new admin emails
DROP POLICY IF EXISTS "Admins can add admin emails" ON admin_emails;
CREATE POLICY "Admins can add admin emails"
  ON admin_emails FOR INSERT
  WITH CHECK (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Only admins can delete admin emails
DROP POLICY IF EXISTS "Admins can remove admin emails" ON admin_emails;
CREATE POLICY "Admins can remove admin emails"
  ON admin_emails FOR DELETE
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- 4. Seed with the primary admin
INSERT INTO admin_emails (email) VALUES ('aareevs@gmail.com')
ON CONFLICT (email) DO NOTHING;

-- 5. Revoke admin from old hardcoded emails
-- Disable the trigger temporarily since running in SQL Editor doesn't have auth.uid()
ALTER TABLE profiles DISABLE TRIGGER prevent_role_change_trigger;

UPDATE profiles
SET role = 'spectator'
WHERE email IN ('kg3327949@gmail.com', 'divyanshgupta231@gmail.com')
  AND role = 'admin';

ALTER TABLE profiles ENABLE TRIGGER prevent_role_change_trigger;

-- 6. Update the force_admin_role trigger to use the table
CREATE OR REPLACE FUNCTION force_admin_role()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM admin_emails WHERE email = NEW.email) THEN
    NEW.role := 'admin';
    NEW.team_id := NULL; -- Admins shouldn't be on a team
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Ensure the trigger exists (recreate)
DROP TRIGGER IF EXISTS force_admin_role_trigger ON profiles;
CREATE TRIGGER force_admin_role_trigger
BEFORE INSERT OR UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION force_admin_role();

-- 8. Enable realtime for admin_emails (optional, for live updates)
ALTER PUBLICATION supabase_realtime ADD TABLE admin_emails;
