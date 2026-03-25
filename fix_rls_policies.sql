-- =====================================================
-- RLS Policies for VPL Auction Dashboard
-- Run this in the Supabase SQL Editor
-- =====================================================

-- 1. PROFILES: Add full_name column if missing
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS full_name text;

-- 2. PLAYERS table
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Players are viewable by everyone" ON players;
CREATE POLICY "Players are viewable by everyone"
  ON players FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert players" ON players;
CREATE POLICY "Authenticated users can insert players"
  ON players FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update players" ON players;
CREATE POLICY "Authenticated users can update players"
  ON players FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can delete players" ON players;
CREATE POLICY "Authenticated users can delete players"
  ON players FOR DELETE TO authenticated USING (true);

-- 3. AUCTION_STATE table
ALTER TABLE auction_state ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Auction state is viewable by everyone" ON auction_state;
CREATE POLICY "Auction state is viewable by everyone"
  ON auction_state FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert auction state" ON auction_state;
CREATE POLICY "Authenticated users can insert auction state"
  ON auction_state FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update auction state" ON auction_state;
CREATE POLICY "Authenticated users can update auction state"
  ON auction_state FOR UPDATE TO authenticated USING (true);

-- 4. AUCTION_SETS table
ALTER TABLE auction_sets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Auction sets are viewable by everyone" ON auction_sets;
CREATE POLICY "Auction sets are viewable by everyone"
  ON auction_sets FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert auction sets" ON auction_sets;
CREATE POLICY "Authenticated users can insert auction sets"
  ON auction_sets FOR INSERT TO authenticated WITH CHECK (true);

-- 5. ADMIN_EMAILS table
ALTER TABLE admin_emails ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin emails are viewable by everyone" ON admin_emails;
CREATE POLICY "Admin emails are viewable by everyone"
  ON admin_emails FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert admin emails" ON admin_emails;
CREATE POLICY "Authenticated users can insert admin emails"
  ON admin_emails FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete admin emails" ON admin_emails;
CREATE POLICY "Authenticated users can delete admin emails"
  ON admin_emails FOR DELETE TO authenticated USING (true);
