-- Migration to add Tier 1 players (Set 0)

-- 1. Delete existing entries for players moving to Tier 1 (Set 0) to avoid duplicates
-- We delete by ID.
DELETE FROM players WHERE id IN (
  's1-1', 's3-2', 's6-1', 's2-4', 's4-11', 's5-2', 's6-9', 's3-5', 's2-7', 's5-8', 's4-4', 's8-7', 's1-4', 's7-3', 's6-4', 's5-5', 's4-7', 's9-9', 's4-10', 's3-10', 's6-5', 's2-6', 's3-3', 's4-6', 's6-12', 's7-7', 's5-7', 's7-8', 's5-10', 's3-1'
);

-- 2. Insert Tier 1 players with new IDs (t1-1 to t1-31) and set_no = 0
INSERT INTO players (id, set_no, name, country, role, base_price, status, stats) VALUES
('t1-1', 0, 'Dewald Brevis', 'South Africa', 'Middle Order Batsman', 200, 'UNSOLD', '{"matches": 115, "runs": 2696, "highScore": "162", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('t1-2', 0, 'Mitchell Marsh', 'Australia', 'All Rounder', 200, 'UNSOLD', '{"matches": 222, "runs": 5633, "highScore": "117", "wickets": 85, "bestBowling": "4/6", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('t1-3', 0, 'Phil Salt', 'England', 'Wicketkeeper Batter', 200, 'UNSOLD', '{"matches": 322, "runs": 8135, "highScore": "141*", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('t1-4', 0, 'Tilak Verma', 'India', 'Top Order Batter', 200, 'UNSOLD', '{"matches": 134, "runs": 4092, "highScore": "151", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('t1-5', 0, 'Varun Chakravarthy', 'India', 'Legbreak Googly', 200, 'UNSOLD', '{"matches": 138, "wickets": 179, "bestBowling": "5/17", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('t1-6', 0, 'Mitchell Starc', 'Australia', 'Left Arm Fast', 200, 'UNSOLD', '{"matches": 153, "wickets": 207, "bestBowling": "5/35", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('t1-7', 0, 'KL Rahul', 'India', 'Wicketkeeper Batter', 200, 'UNSOLD', '{"matches": 239, "runs": 8125, "highScore": "132*", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('t1-8', 0, 'Marco Jansen', 'South Africa', 'All Rounder', 200, 'UNSOLD', '{"matches": 123, "runs": 1040, "highScore": "71*", "wickets": 139, "bestBowling": "5/30", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('t1-9', 0, 'Shreyas Iyer', 'India', 'Top Order Batter', 200, 'UNSOLD', '{"matches": 240, "runs": 6578, "highScore": "147", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('t1-10', 0, 'Matt Henry', 'New Zealand', 'Right Arm Fast Medium', 200, 'UNSOLD', '{"matches": 174, "wickets": 211, "bestBowling": "5/18", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('t1-11', 0, 'Mohammed Siraj', 'India', 'Right Arm Fast', 200, 'UNSOLD', '{"matches": 160, "wickets": 183, "bestBowling": "4/17", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('t1-12', 0, 'Sikandar Raza', 'Zimbabwe', 'All Rounder', 200, 'UNSOLD', '{"matches": 334, "runs": 6775, "highScore": "133*", "wickets": 219, "bestBowling": "5/18", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('t1-13', 0, 'Travis Head', 'Australia', 'Opener Batsman', 200, 'UNSOLD', '{"matches": 168, "runs": 4414, "highScore": "102", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('t1-14', 0, 'Rohit Sharma', 'India', 'Top Order Batsman', 200, 'UNSOLD', '{"matches": 463, "runs": 12248, "highScore": "121*", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('t1-15', 0, 'Quinton De Kock', 'South Africa', 'Wicketkeeper Batter', 200, 'UNSOLD', '{"matches": 421, "runs": 11734, "highScore": "140*", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('t1-16', 0, 'Josh Hazlewood', 'Australia', 'Right Arm Fast Medium', 200, 'UNSOLD', '{"matches": 127, "wickets": 170, "bestBowling": "4/12", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('t1-17', 0, 'Kuldeep Yadav', 'India', 'Left Arm Wrist Spin', 200, 'UNSOLD', '{"matches": 185, "wickets": 236, "bestBowling": "5/17", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('t1-18', 0, 'Dale Steyn', 'South Africa', 'Right Arm Fast', 200, 'UNSOLD', '{"matches": 228, "wickets": 263, "bestBowling": "4/9", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('t1-19', 0, 'Jasprit Bumrah', 'India', 'Right Arm Fast', 200, 'UNSOLD', '{"matches": 258, "wickets": 327, "bestBowling": "5/10", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('t1-20', 0, 'Hardik Pandya', 'India', 'All Rounder', 200, 'UNSOLD', '{"matches": 314, "runs": 5852, "highScore": "91", "wickets": 213, "bestBowling": "5/36", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('t1-21', 0, 'Jos Buttler', 'England', 'Wicketkeeper Batter', 200, 'UNSOLD', '{"matches": 477, "runs": 13554, "highScore": "124", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('t1-22', 0, 'Abhishek Sharma', 'India', 'Opener Batsman', 200, 'UNSOLD', '{"matches": 168, "runs": 4918, "highScore": "148", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('t1-23', 0, 'Axar Patel', 'India', 'All Rounder', 200, 'UNSOLD', '{"matches": 300, "runs": 3497, "highScore": "70*", "wickets": 255, "bestBowling": "4/21", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('t1-24', 0, 'Arshdeep Singh', 'India', 'Left Arm Medium Fast', 200, 'UNSOLD', '{"matches": 182, "wickets": 239, "bestBowling": "5/32", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('t1-25', 0, 'Pat Cummins', 'Australia', 'All Rounder', 200, 'UNSOLD', '{"matches": 171, "runs": 1001, "highScore": "66*", "wickets": 192, "bestBowling": "4/16", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('t1-26', 0, 'Sanju Samson', 'India', 'Wicketkeeper Batter', 200, 'UNSOLD', '{"matches": 320, "runs": 8033, "highScore": "119", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('t1-27', 0, 'AB de Villiers', 'South Africa', 'Middle Order Batsman', 200, 'UNSOLD', '{"matches": 340, "runs": 9424, "highScore": "133*", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('t1-28', 0, 'Adil Rashid', 'England', 'Legbreak', 200, 'UNSOLD', '{"matches": 353, "wickets": 394, "bestBowling": "4/2", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('t1-29', 0, 'Virat Kohli', 'India', 'Top Order Batsman', 200, 'UNSOLD', '{"matches": 414, "runs": 13543, "highScore": "122*", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('t1-30', 0, 'Adam Zampa', 'Australia', 'Legbreak Googly', 200, 'UNSOLD', '{"matches": 318, "wickets": 393, "bestBowling": "6/19", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}')
ON CONFLICT (id) DO UPDATE 
SET 
  name = EXCLUDED.name,
  country = EXCLUDED.country,
  role = EXCLUDED.role,
  base_price = EXCLUDED.base_price,
  status = EXCLUDED.status,
  set_no = EXCLUDED.set_no,
  stats = EXCLUDED.stats;
