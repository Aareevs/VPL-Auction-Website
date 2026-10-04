-- Create auction_sets table
CREATE TABLE IF NOT EXISTS auction_sets (
  id serial PRIMARY KEY,
  name text NOT NULL UNIQUE,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE auction_sets ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Public read sets" ON auction_sets;
DROP POLICY IF EXISTS "Admin all sets" ON auction_sets;

CREATE POLICY "Public read sets" ON auction_sets FOR SELECT USING (true);
CREATE POLICY "Admin all sets" ON auction_sets FOR ALL USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Seed Data from Constants
INSERT INTO auction_sets (id, name, display_order) VALUES
(0, 'Tier 1', 0),
(1, 'Tier 2', 1),
(2, 'Tier 3', 2),
(3, 'Overseas Capped Batters I', 1),
(4, 'Indian Capped Batters', 2),
(5, 'All Rounders I', 3),
(6, 'Capped Indian Bowlers I', 4),
(7, 'Capped Overseas Bowlers I', 5),
(8, 'Wicketkeeper Batsman I', 6),
(9, 'Uncapped Batsman I', 7),
(10, 'All Rounders II', 8),
(11, 'Retired Bowlers', 9),
(12, 'Legends Batsman', 10),
(13, 'Legends All Rounders', 11),
(14, 'Legends Bowlers', 12),
(15, 'Uncapped Indian Batsman II', 13),
(16, 'Indian Batsman II', 14)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, display_order = EXCLUDED.display_order;

-- Reset sequence to avoid id 15 collision if new sets are added
SELECT setval('auction_sets_id_seq', (SELECT MAX(id) FROM auction_sets));
