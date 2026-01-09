-- 1. ROLE PERSISTENCE
-- Prevent regular users from changing their role after it's set
CREATE OR REPLACE FUNCTION prevent_role_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Allow admins to change anything
  IF (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin' THEN
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


-- 2. LIVE AUCTION INFRASTRUCTURE
-- Create a singleton table to hold the current auction state
CREATE TABLE IF NOT EXISTS auction_state (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1), -- Ensure only one row exists
  current_player_id text, -- Can be a UUID or just a Name/JSON blob depending on complexity
  status text CHECK (status IN ('waiting', 'bidding', 'sold', 'unsold')) DEFAULT 'waiting',
  current_bid integer DEFAULT 0,
  current_bidder_team_id text,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Initialize the single row if it doesn't exist
INSERT INTO auction_state (id, status)
VALUES (1, 'waiting')
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE auction_state ENABLE ROW LEVEL SECURITY;

-- Policies for auction_state
-- Everyone can VIEW the state (Realtime updates)
CREATE POLICY "Everyone can view auction state"
  ON auction_state FOR SELECT
  USING (true);

-- Only ADMINS can UPDATE the state
CREATE POLICY "Admins can update auction state"
  ON auction_state FOR UPDATE
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );
