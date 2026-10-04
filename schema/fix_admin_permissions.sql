-- =====================================================
-- Fix Admin Permissions & Automatic Profile Sync
-- Run this script in the Supabase SQL Editor
-- =====================================================

-- 1. Temporarily disable the role lock trigger while running in SQL Editor
ALTER TABLE profiles DISABLE TRIGGER prevent_role_change_trigger;

-- 2. Backfill existing profiles for all admin emails
UPDATE profiles
SET role = 'admin', team_id = NULL
WHERE LOWER(email) IN (SELECT LOWER(email) FROM admin_emails);

-- 3. Re-enable the trigger
ALTER TABLE profiles ENABLE TRIGGER prevent_role_change_trigger;

-- 4. Update force_admin_role to be case-insensitive
CREATE OR REPLACE FUNCTION force_admin_role()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM admin_emails WHERE LOWER(email) = LOWER(NEW.email)) THEN
    NEW.role := 'admin';
    NEW.team_id := NULL; -- Admins cannot be on a team
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS force_admin_role_trigger ON profiles;
CREATE TRIGGER force_admin_role_trigger
BEFORE INSERT OR UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION force_admin_role();

-- 5. Update prevent_role_change so it permits admin role updates for admin emails
CREATE OR REPLACE FUNCTION prevent_role_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Allow admins to change anything
  IF (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin' THEN
    RETURN NEW;
  END IF;

  -- Allow role change if the email is in admin_emails
  IF EXISTS (SELECT 1 FROM admin_emails WHERE LOWER(email) = LOWER(NEW.email)) THEN
    RETURN NEW;
  END IF;

  -- For everyone else:
  -- If old role was NOT null, and new role is DIFFERENT, block it.
  IF OLD.role IS NOT NULL AND NEW.role IS DISTINCT FROM OLD.role THEN
    RAISE EXCEPTION 'Role cannot be changed once selected.';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS prevent_role_change_trigger ON profiles;
CREATE TRIGGER prevent_role_change_trigger
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION prevent_role_change();

-- 6. Trigger on admin_emails to automatically update profiles when an email is added or removed
CREATE OR REPLACE FUNCTION sync_admin_email_to_profiles()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE profiles
    SET role = 'admin', team_id = NULL
    WHERE LOWER(email) = LOWER(NEW.email);
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE profiles
    SET role = 'spectator'
    WHERE LOWER(email) = LOWER(OLD.email)
      AND LOWER(email) != 'aareevs@gmail.com';
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_admin_email ON admin_emails;
CREATE TRIGGER trg_sync_admin_email
AFTER INSERT OR DELETE ON admin_emails
FOR EACH ROW
EXECUTE FUNCTION sync_admin_email_to_profiles();
