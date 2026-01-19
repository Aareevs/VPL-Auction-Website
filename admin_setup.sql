-- 1. Immediately update the users if they already exist
UPDATE profiles
SET role = 'admin', team_id = NULL
WHERE email IN ('aareevs@gmail.com', 'kg3327949@gmail.com', 'divyanshgupta231@gmail.com');

-- 2. Create a function to automatically make these emails an admin on insert/update
CREATE OR REPLACE FUNCTION force_admin_role()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email IN ('aareevs@gmail.com', 'kg3327949@gmail.com', 'divyanshgupta231@gmail.com') THEN
    NEW.role := 'admin';
    NEW.team_id := NULL; -- Admins shouldn't be on a team
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Create the trigger to enforce this
DROP TRIGGER IF EXISTS force_admin_role_trigger ON profiles;
CREATE TRIGGER force_admin_role_trigger
BEFORE INSERT OR UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION force_admin_role();

-- 4. Ensure RLS policies allow the admin to seeing everything (if not already set)
-- (Existing policies might need adjustment if they are too restrictive)
-- For example, allowing admins to bypass team limits or view all data.

-- Allow admins to update any profile (e.g. to kick people)
-- Allow admins to update any profile (e.g. to kick people)
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
CREATE POLICY "Admins can update all profiles"
ON profiles
FOR UPDATE
USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- Allow admins to delete profiles
DROP POLICY IF EXISTS "Admins can delete profiles" ON profiles;
CREATE POLICY "Admins can delete profiles"
ON profiles
FOR DELETE
USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);
