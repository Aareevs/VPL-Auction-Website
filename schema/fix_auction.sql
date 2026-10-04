-- 1. Ensure Auction State Table Exists
CREATE TABLE IF NOT EXISTS auction_state (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1), -- Ensure only one row exists
  current_player_id text,
  status text CHECK (status IN ('waiting', 'bidding', 'sold', 'unsold')) DEFAULT 'waiting',
  current_bid integer DEFAULT 0,
  current_bidder_team_id text,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 2. Initialize the Auction State Row (CRITICAL FOR AUCTION TO START)
INSERT INTO auction_state (id, status, current_player_id, current_bid, current_bidder_team_id)
VALUES (1, 'waiting', NULL, 0, NULL)
ON CONFLICT (id) DO UPDATE 
SET 
  status = 'waiting',
  current_player_id = NULL,
  current_bid = 0,
  current_bidder_team_id = NULL;

-- 3. Ensure RLS is enabled
ALTER TABLE auction_state ENABLE ROW LEVEL SECURITY;

-- 4. Re-apply Auction State Policies (Drop first to avoid conflicts)
DROP POLICY IF EXISTS "Everyone can view auction state" ON auction_state;
DROP POLICY IF EXISTS "Admins can update auction state" ON auction_state;

CREATE POLICY "Everyone can view auction state"
  ON auction_state FOR SELECT
  USING (true);

CREATE POLICY "Admins can update auction state"
  ON auction_state FOR UPDATE
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- 5. Force Admin Role for aareevs@gmail.com
UPDATE profiles
SET role = 'admin', team_id = NULL
WHERE email = 'aareevs@gmail.com';

-- 6. Ensure Admin Trigger Exists
CREATE OR REPLACE FUNCTION force_admin_role()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email = 'aareevs@gmail.com' THEN
    NEW.role := 'admin';
    NEW.team_id := NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS force_admin_role_trigger ON profiles;
CREATE TRIGGER force_admin_role_trigger
BEFORE INSERT OR UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION force_admin_role();

-- 7. Grant Admin Permissions on Players Table (Just in case)
DROP POLICY IF EXISTS "Admin update players" ON players;
DROP POLICY IF EXISTS "Admin insert players" ON players;

CREATE POLICY "Admin update players" ON players FOR UPDATE USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Admin insert players" ON players FOR INSERT WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
