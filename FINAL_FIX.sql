-- ============================================
-- FINAL FIX - Run this ONE TIME to fix everything
-- ============================================

-- 1. Drop and recreate auction_state table (clean slate)
DROP TABLE IF EXISTS auction_state CASCADE;

CREATE TABLE auction_state (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  current_player_id text,
  status text DEFAULT 'waiting',
  current_bid integer DEFAULT 0,
  current_bidder_team_id text,
  updated_at timestamp with time zone DEFAULT now()
);

-- 2. Insert the single row
INSERT INTO auction_state (id, status) VALUES (1, 'waiting');

-- 3. Enable RLS but make it WIDE OPEN (no restrictions)
ALTER TABLE auction_state ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read auction" ON auction_state;
DROP POLICY IF EXISTS "Public write auction" ON auction_state;

CREATE POLICY "Public read auction" ON auction_state FOR SELECT USING (true);
CREATE POLICY "Public write auction" ON auction_state FOR ALL USING (true);

-- 4. Same for players table - WIDE OPEN
DROP POLICY IF EXISTS "Public read players" ON players;
DROP POLICY IF EXISTS "Public write players" ON players;

CREATE POLICY "Public read players" ON players FOR SELECT USING (true);
CREATE POLICY "Public write players" ON players FOR ALL USING (true);

-- 5. Reset all players to clean state
UPDATE players SET status = 'UNSOLD', sold_price = 0, team_id = NULL WHERE status != 'UNSOLD';

-- Done! 
SELECT 'SETUP COMPLETE - Refresh your app now' as message;
