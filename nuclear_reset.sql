-- NUCLEAR RESET - Use this to completely clean the auction state
-- Run this, then REFRESH the app (Ctrl+Shift+R or Cmd+Shift+R for hard refresh)

-- 1. Completely wipe and recreate auction_state table
DROP TABLE IF EXISTS auction_state CASCADE;

CREATE TABLE auction_state (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  current_player_id text,
  status text CHECK (status IN ('waiting', 'bidding', 'sold', 'unsold')) DEFAULT 'waiting',
  current_bid integer DEFAULT 0,
  current_bidder_team_id text,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 2. Insert clean state
INSERT INTO auction_state (id, status, current_player_id, current_bid, current_bidder_team_id)
VALUES (1, 'waiting', NULL, 0, NULL);

-- 3. Enable RLS
ALTER TABLE auction_state ENABLE ROW LEVEL SECURITY;

-- 4. Create PERMISSIVE policies (anyone can read/write for now)
CREATE POLICY "Everyone can view auction state" ON auction_state FOR SELECT USING (true);
CREATE POLICY "Everyone can update auction state" ON auction_state FOR UPDATE USING (true);

-- 5. Reset ALL players to UNSOLD (clean slate)
UPDATE players SET status = 'UNSOLD', sold_price = 0, team_id = NULL;

-- 6. Verify the state (should return: id=1, status=waiting, current_player_id=NULL)
SELECT * FROM auction_state;
