-- EMERGENCY PERMISSIONS FIX
-- Run this if "Start Auction" / "Bid" / "Sell" are not working.

-- 1. Unlock Players Table (Allow anyone to update/insert)
DROP POLICY IF EXISTS "Admin update players" ON players;
DROP POLICY IF EXISTS "Admin insert players" ON players;
DROP POLICY IF EXISTS "Everyone update players" ON players;
DROP POLICY IF EXISTS "Everyone insert players" ON players;

CREATE POLICY "Everyone update players" ON players FOR UPDATE USING (true);
CREATE POLICY "Everyone insert players" ON players FOR INSERT WITH CHECK (true);

-- 2. Unlock Auction State Table (Allow anyone to update)
DROP POLICY IF EXISTS "Admins can update auction state" ON auction_state;
DROP POLICY IF EXISTS "Everyone update auction state" ON auction_state;

CREATE POLICY "Everyone update auction state" ON auction_state FOR UPDATE USING (true);

-- 3. Force Admin Role (Case Insensitive) just in case
UPDATE profiles
SET role = 'admin'
WHERE email ILIKE 'aareevs@gmail.com';

-- 4. Reset Auction State to be safe
INSERT INTO auction_state (id, status, current_player_id, current_bid, current_bidder_team_id)
VALUES (1, 'waiting', NULL, 0, NULL)
ON CONFLICT (id) DO UPDATE 
SET 
  status = 'waiting',
  current_player_id = NULL,
  current_bid = 0,
  current_bidder_team_id = NULL;
