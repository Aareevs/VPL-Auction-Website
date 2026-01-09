-- Create players table
CREATE TABLE IF NOT EXISTS players (
  id text PRIMARY KEY,
  name text NOT NULL,
  country text,
  role text,
  base_price integer,
  status text DEFAULT 'UNSOLD',
  sold_price integer DEFAULT 0,
  team_id text,
  set_no integer,
  stats jsonb,
  image_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

-- Policies
-- Policies
DROP POLICY IF EXISTS "Public read players" ON players;
DROP POLICY IF EXISTS "Admin update players" ON players;
DROP POLICY IF EXISTS "Admin insert players" ON players;

CREATE POLICY "Public read players" ON players FOR SELECT USING (true);
CREATE POLICY "Admin update players" ON players FOR UPDATE USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Admin insert players" ON players FOR INSERT WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Seed Data
INSERT INTO players (id, set_no, name, country, role, base_price, status, stats) VALUES
-- SET 1
('s1-1', 1, 'Dewald Brevis', 'South Africa', 'Middle Order Batsman', 200, 'UNSOLD', '{"matches": 115, "runs": 2696, "highScore": "162", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s1-2', 1, 'Rovman Powell', 'West Indies', 'Middle Order Batsman', 200, 'UNSOLD', '{"matches": 317, "runs": 5750, "highScore": "107", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s1-3', 1, 'Harry Brook', 'England', 'Middle Order Batsman', 200, 'UNSOLD', '{"matches": 166, "runs": 3890, "highScore": "105*", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s1-4', 1, 'Travis Head', 'Australia', 'Opener Batsman', 200, 'UNSOLD', '{"matches": 168, "runs": 4414, "highScore": "102", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s1-5', 1, 'David Miller', 'South Africa', 'Middle Order Batsman', 200, 'UNSOLD', '{"matches": 543, "runs": 11612, "highScore": "120*", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s1-6', 1, 'Kane Williamson', 'New Zealand', 'Top Order Batter', 200, 'UNSOLD', '{"matches": 288, "runs": 7351, "highScore": "101*", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s1-7', 1, 'Reeza Hendricks', 'South Africa', 'Opener Batsman', 200, 'UNSOLD', '{"matches": 291, "runs": 8169, "highScore": "117", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s1-8', 1, 'Tim David', 'Australia', 'Middle Order Batsman', 200, 'UNSOLD', '{"matches": 313, "runs": 6136, "highScore": "102*", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s1-9', 1, 'Aiden Markram', 'South Africa', 'Opener Batsman', 200, 'UNSOLD', '{"matches": 210, "runs": 5154, "highScore": "100", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s1-10', 1, 'Joe Root', 'England', 'Top Order Batter', 200, 'UNSOLD', '{"matches": 129, "runs": 3062, "highScore": "92*", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s1-11', 1, 'Ibrahim Zadran', 'Afghanistan', 'Opener Batsman', 150, 'UNSOLD', '{"matches": 128, "runs": 3326, "highScore": "101*", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s1-12', 1, 'Shimron Hetmyer', 'West Indies', 'Middle Order Batsman', 150, 'UNSOLD', '{"matches": 309, "runs": 6053, "highScore": "100", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s1-13', 1, 'Pathum Nissanka', 'Sri Lanka', 'Top Order Batter', 150, 'UNSOLD', '{"matches": 155, "runs": 4310, "highScore": "119", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s1-14', 1, 'Sherfane Rutherford', 'West Indies', 'Middle Order Batsman', 150, 'UNSOLD', '{"matches": 232, "runs": 3868, "highScore": "86", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s1-15', 1, 'Steve Smith', 'Australia', 'Top Order Batter', 150, 'UNSOLD', '{"matches": 266, "runs": 5943, "highScore": "125*", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),

-- SET 2
('s2-1', 2, 'Shubman Gill', 'India', 'Opener Batsman', 200, 'UNSOLD', '{"matches": 175, "runs": 5412, "highScore": "129", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s2-2', 2, 'Ruturaj Gaikwad', 'India', 'Opener Batsman', 200, 'UNSOLD', '{"matches": 151, "runs": 5002, "highScore": "123*", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s2-3', 2, 'Suryakumar Yadav', 'India', 'Top Order Batter', 200, 'UNSOLD', '{"matches": 346, "runs": 8975, "highScore": "117", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s2-4', 2, 'Tilak Verma', 'India', 'Top Order Batter', 200, 'UNSOLD', '{"matches": 134, "runs": 4092, "highScore": "151", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s2-5', 2, 'Rinku Singh', 'India', 'Middle Order Batsman', 200, 'UNSOLD', '{"matches": 175, "runs": 3397, "highScore": "79", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s2-6', 2, 'Abhishek Sharma', 'India', 'Opener Batsman', 200, 'UNSOLD', '{"matches": 168, "runs": 4918, "highScore": "148", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s2-7', 2, 'Shreyas Iyer', 'India', 'Top Order Batter', 200, 'UNSOLD', '{"matches": 240, "runs": 6578, "highScore": "147", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s2-8', 2, 'Yashasvi Jaiswal', 'India', 'Opener Batsman', 200, 'UNSOLD', '{"matches": 121, "runs": 3682, "highScore": "124", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s2-9', 2, 'Nitesh Rana', 'India', 'Middle Order Batsman', 200, 'UNSOLD', '{"matches": 211, "runs": 5122, "highScore": "107", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s2-10', 2, 'Venkatesh Iyer', 'India', 'Top Order Batsman', 200, 'UNSOLD', '{"matches": 145, "runs": 3249, "highScore": "104", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s2-11', 2, 'Devdutt Paddikal', 'India', 'Top Order Batsman', 200, 'UNSOLD', '{"matches": 115, "runs": 3362, "highScore": "124*", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s2-12', 2, 'Manish Pandey', 'India', 'Top Order Batsman', 150, 'UNSOLD', '{"matches": 311, "runs": 7100, "highScore": "129*", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s2-13', 2, 'Prithvi Shaw', 'India', 'Opener Batsman', 150, 'UNSOLD', '{"matches": 124, "runs": 3085, "highScore": "134", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s2-14', 2, 'Ajinkya Rahane', 'India', 'Top Order Batsman', 150, 'UNSOLD', '{"matches": 294, "runs": 7633, "highScore": "105*", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s2-15', 2, 'Rahul Tripathi', 'India', 'Top Order Batsman', 100, 'UNSOLD', '{"matches": 172, "runs": 3807, "highScore": "93", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),

-- SET 3
('s3-1', 3, 'Romario Shephard', 'West Indies', 'All Rounder', 200, 'UNSOLD', '{"matches": 223, "runs": 2443, "highScore": "73*", "wickets": 206, "bestBowling": "4/13", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s3-2', 3, 'Mitchell Marsh', 'Australia', 'All Rounder', 200, 'UNSOLD', '{"matches": 222, "runs": 5633, "highScore": "117", "wickets": 85, "bestBowling": "4/6", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s3-3', 3, 'Axar Patel', 'India', 'All Rounder', 200, 'UNSOLD', '{"matches": 300, "runs": 3497, "highScore": "70*", "wickets": 255, "bestBowling": "4/21", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s3-4', 3, 'Mohammad Nabi', 'Afghanistan', 'All Rounder', 200, 'UNSOLD', '{"matches": 473, "runs": 6833, "highScore": "89", "wickets": 402, "bestBowling": "5/15", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s3-5', 3, 'Marco Jansen', 'South Africa', 'All Rounder', 200, 'UNSOLD', '{"matches": 123, "runs": 1040, "highScore": "71*", "wickets": 139, "bestBowling": "5/30", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s3-6', 3, 'Rachin Ravindra', 'New Zealand', 'All Rounder', 200, 'UNSOLD', '{"matches": 116, "runs": 1922, "highScore": "70", "wickets": 65, "bestBowling": "4/11", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s3-7', 3, 'Ravindra Jadeja', 'India', 'All Rounder', 200, 'UNSOLD', '{"matches": 346, "runs": 3985, "highScore": "77*", "wickets": 235, "bestBowling": "5/16", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s3-8', 3, 'Ben Stokes', 'England', 'All Rounder', 200, 'UNSOLD', '{"matches": 162, "runs": 3027, "highScore": "107*", "wickets": 93, "bestBowling": "4/16", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s3-9', 3, 'Glenn Phillips', 'New Zealand', 'All Rounder', 200, 'UNSOLD', '{"matches": 272, "runs": 6924, "highScore": "116*", "wickets": 29, "bestBowling": "3/6", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s3-10', 3, 'Hardik Pandya', 'India', 'All Rounder', 200, 'UNSOLD', '{"matches": 314, "runs": 5852, "highScore": "91", "wickets": 213, "bestBowling": "5/36", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s3-11', 3, 'Glenn Maxwell', 'Australia', 'All Rounder', 200, 'UNSOLD', '{"matches": 493, "runs": 10890, "highScore": "154*", "wickets": 195, "bestBowling": "3/10", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s3-12', 3, 'Mitchell Santner', 'New Zealand', 'All Rounder', 200, 'UNSOLD', '{"matches": 250, "runs": 2564, "highScore": "92*", "wickets": 253, "bestBowling": "4/11", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s3-13', 3, 'Marcus Stoinis', 'Australia', 'All Rounder', 200, 'UNSOLD', '{"matches": 353, "runs": 7073, "highScore": "147*", "wickets": 190, "bestBowling": "4/15", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s3-14', 3, 'Will Jacks', 'England', 'All Rounder', 150, 'UNSOLD', '{"matches": 240, "runs": 6120, "highScore": "108*", "wickets": 80, "bestBowling": "4/15", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s3-15', 3, 'Krunal Pandya', 'India', 'All Rounder', 150, 'UNSOLD', '{"matches": 228, "runs": 3017, "highScore": "86", "wickets": 165, "bestBowling": "4/15", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),

-- SET 4
('s4-1', 4, 'Bhuvneshwar Kumar', 'India', 'Right Arm Medium Pace', 200, 'UNSOLD', '{"matches": 316, "wickets": 335, "bestBowling": "5/4", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s4-2', 4, 'Ravi Bishnoi', 'India', 'Legbreak Googly', 200, 'UNSOLD', '{"matches": 166, "wickets": 194, "bestBowling": "4/13", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s4-3', 4, 'Thangarasu Natarajan', 'India', 'Left Arm Medium', 200, 'UNSOLD', '{"matches": 103, "wickets": 112, "bestBowling": "4/19", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s4-4', 4, 'Mohammed Siraj', 'India', 'Right Arm Fast', 200, 'UNSOLD', '{"matches": 160, "wickets": 183, "bestBowling": "4/17", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s4-5', 4, 'Yuzvendra Chahal', 'India', 'Legbreak Googly', 200, 'UNSOLD', '{"matches": 329, "wickets": 384, "bestBowling": "6/25", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s4-6', 4, 'Arshdeep Singh', 'India', 'Left Arm Medium Fast', 200, 'UNSOLD', '{"matches": 182, "wickets": 239, "bestBowling": "5/32", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s4-7', 4, 'Kuldeep Yadav', 'India', 'Left Arm Wrist Spin', 200, 'UNSOLD', '{"matches": 185, "wickets": 236, "bestBowling": "5/17", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s4-8', 4, 'Mohammed Shami', 'India', 'Right Arm Fast', 200, 'UNSOLD', '{"matches": 183, "wickets": 226, "bestBowling": "4/11", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s4-9', 4, 'Deepak Chahar', 'India', 'Right Arm Medium', 200, 'UNSOLD', '{"matches": 166, "wickets": 184, "bestBowling": "6/7", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s4-10', 4, 'Jasprit Bumrah', 'India', 'Right Arm Fast', 200, 'UNSOLD', '{"matches": 258, "wickets": 327, "bestBowling": "5/10", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s4-11', 4, 'Varun Chakravarthy', 'India', 'Legbreak Googly', 200, 'UNSOLD', '{"matches": 138, "wickets": 179, "bestBowling": "5/17", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s4-12', 4, 'Mukesh Kumar', 'India', 'Right Arm Medium', 150, 'UNSOLD', '{"matches": 80, "wickets": 84, "bestBowling": "4/22", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s4-13', 4, 'Harshit Rana', 'India', 'Right arm Fast', 150, 'UNSOLD', '{"matches": 44, "wickets": 50, "bestBowling": "3/24", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s4-14', 4, 'Rahul Chahar', 'India', 'Legbreak Googly', 150, 'UNSOLD', '{"matches": 140, "wickets": 142, "bestBowling": "5/14", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s4-15', 4, 'Shivam Mavi', 'India', 'Right Arm Fast Medium', 100, 'UNSOLD', '{"matches": 68, "wickets": 63, "bestBowling": "4/14", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),

-- SET 5
('s5-1', 5, 'Kagiso Rabada', 'South Africa', 'Right Arm Fast', 200, 'UNSOLD', '{"matches": 231, "wickets": 286, "bestBowling": "4/21", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s5-2', 5, 'Mitchell Starc', 'Australia', 'Left Arm Fast', 200, 'UNSOLD', '{"matches": 153, "wickets": 207, "bestBowling": "5/35", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s5-3', 5, 'Jofra Archer', 'England', 'Right Arm Fast', 200, 'UNSOLD', '{"matches": 182, "wickets": 225, "bestBowling": "4/18", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s5-4', 5, 'Keshav Maharaj', 'South Africa', 'Slow Left Arm Orthodox', 200, 'UNSOLD', '{"matches": 195, "wickets": 165, "bestBowling": "4/15", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s5-5', 5, 'Josh Hazlewood', 'Australia', 'Right Arm Fast Medium', 200, 'UNSOLD', '{"matches": 127, "wickets": 170, "bestBowling": "4/12", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s5-6', 5, 'Maheesh Theekshana', 'Sri Lanka', 'Right Arm Offbreak', 200, 'UNSOLD', '{"matches": 214, "wickets": 217, "bestBowling": "4/15", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s5-7', 5, 'Adil Rashid', 'England', 'Legbreak', 200, 'UNSOLD', '{"matches": 353, "wickets": 394, "bestBowling": "4/2", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s5-8', 5, 'Matt Henry', 'New Zealand', 'Right Arm Fast Medium', 200, 'UNSOLD', '{"matches": 174, "wickets": 211, "bestBowling": "5/18", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s5-9', 5, 'Lockie Ferguson', 'New Zealand', 'Right Arm Fast', 200, 'UNSOLD', '{"matches": 197, "wickets": 223, "bestBowling": "5/21", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s5-10', 5, 'Adam Zampa', 'Australia', 'Legbreak Googly', 200, 'UNSOLD', '{"matches": 318, "wickets": 393, "bestBowling": "6/19", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s5-11', 5, 'Lungi Ngidi', 'South Africa', 'Right arm Fast medium', 150, 'UNSOLD', '{"matches": 158, "wickets": 200, "bestBowling": "5/39", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s5-12', 5, 'Noor Ahmad', 'Afghanistan', 'Left Arm Wrist Spin', 150, 'UNSOLD', '{"matches": 188, "wickets": 226, "bestBowling": "5/11", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s5-13', 5, 'Matheesha Pathirana', 'Sri Lanka', 'Right Arm Fast', 150, 'UNSOLD', '{"matches": 102, "wickets": 137, "bestBowling": "4/20", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s5-14', 5, 'Akeal Hosein', 'West Indies', 'Slow Left Arm Orthodox', 100, 'UNSOLD', '{"matches": 257, "wickets": 241, "bestBowling": "5/11", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s5-15', 5, 'Josh Little', 'Ireland', 'Left Arm Fast Medium', 100, 'UNSOLD', '{"matches": 148, "wickets": 167, "bestBowling": "5/13", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),

-- SET 6
('s6-1', 6, 'Phil Salt', 'England', 'Wicketkeeper Batter', 200, 'UNSOLD', '{"matches": 322, "runs": 8135, "highScore": "141*", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s6-2', 6, 'Ishan Kishan', 'India', 'Wicketkeeper Batter', 200, 'UNSOLD', '{"matches": 216, "runs": 5787, "highScore": "113*", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s6-3', 6, 'Tim Seifert', 'New Zealand', 'Wicketkeeper Batter', 200, 'UNSOLD', '{"matches": 297, "runs": 6868, "highScore": "125*", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s6-4', 6, 'Quinton De Kock', 'South Africa', 'Wicketkeeper Batter', 200, 'UNSOLD', '{"matches": 421, "runs": 11734, "highScore": "140*", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s6-5', 6, 'Jos Buttler', 'England', 'Wicketkeeper Batter', 200, 'UNSOLD', '{"matches": 477, "runs": 13554, "highScore": "124", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s6-6', 6, 'Kusal Mendis', 'Sri Lanka', 'Wicketkeeper Batter', 200, 'UNSOLD', '{"matches": 194, "runs": 5212, "highScore": "105*", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s6-7', 6, 'Josh Inglis', 'Australia', 'Wicketkeeper Batter', 200, 'UNSOLD', '{"matches": 163, "runs": 3866, "highScore": "118*", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s6-8', 6, 'Rahmanullah Gurbaz', 'Afghanistan', 'Wicketkeeper Batter', 200, 'UNSOLD', '{"matches": 251, "runs": 6079, "highScore": "121*", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s6-9', 6, 'KL Rahul', 'India', 'Wicketkeeper Batter', 200, 'UNSOLD', '{"matches": 239, "runs": 8125, "highScore": "132*", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s6-10', 6, 'Heinrich Klaasen', 'South Africa', 'Wicketkeeper Batter', 200, 'UNSOLD', '{"matches": 271, "runs": 6102, "highScore": "105*", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s6-11', 6, 'Nicholas Pooran', 'West Indies', 'Wicketkeeper Batter', 200, 'UNSOLD', '{"matches": 437, "runs": 10271, "highScore": "108*", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s6-12', 6, 'Sanju Samson', 'India', 'Wicketkeeper Batter', 200, 'UNSOLD', '{"matches": 320, "runs": 8033, "highScore": "119", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s6-13', 6, 'Jitesh Sharma', 'India', 'Wicketkeeper Batter', 150, 'UNSOLD', '{"matches": 158, "runs": 3163, "highScore": "106*", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s6-14', 6, 'Ryan Rickleton', 'South Africa', 'Wicketkeeper Batter', 150, 'UNSOLD', '{"matches": 138, "runs": 3735, "highScore": "113", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s6-15', 6, 'Finn Allen', 'New Zealand', 'Wicketkeeper Batter', 150, 'UNSOLD', '{"matches": 166, "runs": 4580, "highScore": "151", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}')
,
-- SET 7
('s7-1', 7, 'Martin Guptill', 'New Zealand', 'Opener Batsman', 200, 'UNSOLD', '{"matches": 354, "runs": 9922, "highScore": "120*", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s7-2', 7, 'David Warner', 'Australia', 'Opener Batsman', 200, 'UNSOLD', '{"matches": 429, "runs": 13769, "highScore": "135*", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s7-3', 7, 'Rohit Sharma', 'India', 'Top Order Batsman', 200, 'UNSOLD', '{"matches": 463, "runs": 12248, "highScore": "121*", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s7-4', 7, 'Alex Hales', 'England', 'Opener Batsman', 200, 'UNSOLD', '{"matches": 528, "runs": 14449, "highScore": "119*", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s7-5', 7, 'Faf Du Plessis', 'South Africa', 'Opener Batsman', 200, 'UNSOLD', '{"matches": 428, "runs": 11958, "highScore": "120*", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s7-6', 7, 'Eoin Morgan', 'England', 'Middle Order Batsman', 200, 'UNSOLD', '{"matches": 374, "runs": 7780, "highScore": "91", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s7-7', 7, 'AB de Villiers', 'South Africa', 'Middle Order Batsman', 200, 'UNSOLD', '{"matches": 340, "runs": 9424, "highScore": "133*", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s7-8', 7, 'Virat Kohli', 'India', 'Top Order Batsman', 200, 'UNSOLD', '{"matches": 414, "runs": 13543, "highScore": "122*", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s7-9', 7, 'Dawid Malan', 'England', 'Top Order Batsman', 200, 'UNSOLD', '{"matches": 387, "runs": 10634, "highScore": "117", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s7-10', 7, 'Aaron Finch', 'Australia', 'Top Order Batsman', 200, 'UNSOLD', '{"matches": 387, "runs": 11458, "highScore": "172", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s7-11', 7, 'Shaun Marsh', 'Australia', 'Top Order Batsman', 200, 'UNSOLD', '{"matches": 215, "runs": 7050, "highScore": "115", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s7-12', 7, 'Shikhar Dhawan', 'India', 'Opener Batsman', 200, 'UNSOLD', '{"matches": 387, "runs": 11458, "highScore": "172", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s7-13', 7, 'Hashim Amla', 'South Africa', 'Top Order Batsman', 150, 'UNSOLD', '{"matches": 164, "runs": 4563, "highScore": "104*", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s7-14', 7, 'Ross Taylor', 'New Zealand', 'Middle order Batter', 150, 'UNSOLD', '{"matches": 302, "runs": 6604, "highScore": "111*", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s7-15', 7, 'Gautam Gambhir', 'India', 'Top Order Batsman', 150, 'UNSOLD', '{"matches": 251, "runs": 6402, "highScore": "93", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),

-- SET 8
('s8-1', 8, 'Cameron Green', 'Australia', 'All Rounder', 200, 'UNSOLD', '{"matches": 63, "runs": 1334, "highScore": "100*", "wickets": 28, "bestBowling": "3/35", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s8-2', 8, 'Wanindu Hasaranga', 'Sri Lanka', 'All Rounder', 200, 'UNSOLD', '{"matches": 238, "runs": 2463, "highScore": "77*", "wickets": 332, "bestBowling": "6/9", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s8-3', 8, 'Shivam Dube', 'India', 'All Rounder', 200, 'UNSOLD', '{"matches": 188, "runs": 3596, "highScore": "95*", "wickets": 69, "bestBowling": "3/4", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s8-4', 8, 'Rashid Khan', 'Afghanistan', 'All Rounder', 200, 'UNSOLD', '{"matches": 508, "runs": 2853, "highScore": "79*", "wickets": 687, "bestBowling": "6/17", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s8-5', 8, 'Sam Curran', 'England', 'All Rounder', 200, 'UNSOLD', '{"matches": 188, "runs": 3596, "highScore": "95*", "wickets": 69, "bestBowling": "3/4", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s8-6', 8, 'Riyan Parag', 'India', 'All Rounder', 200, 'UNSOLD', '{"matches": 143, "runs": 3168, "highScore": "95", "wickets": 48, "bestBowling": "3/5", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s8-7', 8, 'Sikandar Raza', 'Zimbabwe', 'All Rounder', 200, 'UNSOLD', '{"matches": 334, "runs": 6775, "highScore": "133*", "wickets": 219, "bestBowling": "5/18", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s8-8', 8, 'Michael Bracewell', 'New Zealand', 'All Rounder', 200, 'UNSOLD', '{"matches": 203, "runs": 3455, "highScore": "141*", "wickets": 96, "bestBowling": "4/28", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s8-9', 8, 'Liam Livingstone', 'England', 'All Rounder', 200, 'UNSOLD', '{"matches": 337, "runs": 7611, "highScore": "103", "wickets": 146, "bestBowling": "4/17", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s8-10', 8, 'Jason Holder', 'West Indies', 'All Rounder', 200, 'UNSOLD', '{"matches": 322, "runs": 3183, "highScore": "69", "wickets": 354, "bestBowling": "5/27", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s8-11', 8, 'Washington Sundar', 'India', 'All Rounder', 200, 'UNSOLD', '{"matches": 159, "runs": 1489, "highScore": "54*", "wickets": 118, "bestBowling": "3/3", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s8-12', 8, 'Gulabdin Naib', 'Afghanistan', 'All Rounder', 150, 'UNSOLD', '{"matches": 174, "runs": 2555, "highScore": "91", "wickets": 102, "bestBowling": "4/12", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s8-13', 8, 'Nitesh Kumar Reddy', 'India', 'All Rounder', 100, 'UNSOLD', '{"matches": 40, "runs": 737, "highScore": "76*", "wickets": 14, "bestBowling": "3/17", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s8-14', 8, 'Kamindu Mendis', 'Sri Lanka', 'All Rounder', 100, 'UNSOLD', '{"matches": 117, "runs": 2311, "highScore": "99*", "wickets": 28, "bestBowling": "3/21", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s8-15', 8, 'Jacob Bethell', 'England', 'All Rounder', 100, 'UNSOLD', '{"matches": 86, "runs": 1538, "highScore": "87", "wickets": 18, "bestBowling": "2/5", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),

-- SET 9
('s9-1', 9, 'Tim Southee', 'New Zealand', 'Right Arm Fast Medium', 200, 'UNSOLD', '{"matches": 295, "wickets": 348, "bestBowling": "6/16", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s9-2', 9, 'Ashish Nehra', 'India', 'Left Arm Fast Medium', 200, 'UNSOLD', '{"matches": 132, "wickets": 162, "bestBowling": "4/10", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s9-3', 9, 'Stuart Broad', 'England', 'Right Arm Fast Medium', 200, 'UNSOLD', '{"matches": 85, "wickets": 100, "bestBowling": "4/24", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s9-4', 9, 'Harbhajan Singh', 'India', 'Right Arm Offbreak', 200, 'UNSOLD', '{"matches": 268, "wickets": 235, "bestBowling": "5/18", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s9-5', 9, 'Piyush Chawla', 'India', 'Legbreak', 200, 'UNSOLD', '{"matches": 305, "wickets": 327, "bestBowling": "4/12", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s9-6', 9, 'Lasith Malinga', 'Sri Lanka', 'Right Arm Fast', 200, 'UNSOLD', '{"matches": 295, "wickets": 390, "bestBowling": "6/7", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s9-7', 9, 'Amit Mishra', 'India', 'Legbreak', 200, 'UNSOLD', '{"matches": 259, "wickets": 285, "bestBowling": "5/17", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s9-8', 9, 'Trent Boult', 'New Zealand', 'Left Arm Fast Medium', 200, 'UNSOLD', '{"matches": 286, "wickets": 332, "bestBowling": "4/13", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s9-9', 9, 'Dale Steyn', 'South Africa', 'Right Arm Fast', 200, 'UNSOLD', '{"matches": 228, "wickets": 263, "bestBowling": "4/9", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s9-10', 9, 'Imran Tahir', 'South Africa', 'Legbreak Googly', 200, 'UNSOLD', '{"matches": 446, "wickets": 570, "bestBowling": "5/21", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s9-11', 9, 'Mohit Sharma', 'India', 'Right Arm Medium', 150, 'UNSOLD', '{"matches": 172, "wickets": 167, "bestBowling": "5/10", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s9-12', 9, 'Vernon Philander', 'South Africa', 'Right Arm Fast Medium', 150, 'UNSOLD', '{"matches": 123, "wickets": 92, "bestBowling": "5/17", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s9-13', 9, 'James Faulkner', 'Australia', 'Left Arm Fast Medium', 150, 'UNSOLD', '{"matches": 223, "wickets": 262, "bestBowling": "5/16", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s9-14', 9, 'Pravin Tambe', 'India', 'Legbreak', 100, 'UNSOLD', '{"matches": 64, "wickets": 70, "bestBowling": "4/15", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s9-15', 9, 'James Anderson', 'England', 'Right Arm Fast Medium', 100, 'UNSOLD', '{"matches": 58, "wickets": 63, "bestBowling": "3/17", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),

-- SET 10
('s10-1', 10, 'Brian Lara', 'West Indies', 'Top Order Batsman', 200, 'UNSOLD', '{"matches": 429, "runs": 14602, "highScore": "169", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s10-2', 10, 'Kumar Sangakkara', 'Sri Lanka', 'Wicketkeeper Batter', 200, 'UNSOLD', '{"matches": 267, "runs": 6937, "highScore": "94", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s10-3', 10, 'Kevin Pieterson', 'England', 'Top Order Batsman', 200, 'UNSOLD', '{"matches": 200, "runs": 5695, "highScore": "115*", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s10-4', 10, 'Rahul Dravid', 'India', 'Wicketkeeper Batter', 200, 'UNSOLD', '{"matches": 109, "runs": 2586, "highScore": "75*", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s10-5', 10, 'Brendon McCullum', 'New Zealand', 'Opener Batsman', 200, 'UNSOLD', '{"matches": 308, "runs": 12051, "highScore": "181*", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s10-6', 10, 'Matthew Hayden', 'Australia', 'Opener Batsman', 200, 'UNSOLD', '{"matches": 161, "runs": 6133, "highScore": "181*", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s10-7', 10, 'Sachin Tendulkar', 'India', 'Top Order Batsman', 200, 'UNSOLD', '{"matches": 463, "runs": 18426, "highScore": "200*", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s10-8', 10, 'Adam Gilchrist', 'Australia', 'Wicketkeeper Batter', 200, 'UNSOLD', '{"matches": 262, "runs": 5500, "highScore": "109*", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s10-9', 10, 'Virender Sehwag', 'India', 'Opener Batsman', 200, 'UNSOLD', '{"matches": 159, "runs": 4061, "highScore": "122", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s10-10', 10, 'Jacques Kallis', 'South Africa', 'All Rounder', 200, 'UNSOLD', '{"matches": 176, "runs": 4416, "highScore": "97*", "wickets": 114, "bestBowling": "4/15", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s10-11', 10, 'Vivian Richards', 'West Indies', 'All Rounder', 200, 'UNSOLD', '{"matches": 187, "runs": 6721, "highScore": "189*", "wickets": 290, "bestBowling": "6/24", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s10-12', 10, 'Jonty Rhodes', 'South Africa', 'Middle Order Batsman', 200, 'UNSOLD', '{"matches": 245, "runs": 5935, "highScore": "121", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s10-13', 10, 'Vvs Laxman', 'India', 'Top Order Batsman', 200, 'UNSOLD', '{"matches": 173, "runs": 5078, "highScore": "131", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s10-14', 10, 'MS Dhoni', 'India', 'Wicketkeeper Batter', 200, 'UNSOLD', '{"matches": 405, "runs": 7628, "highScore": "84", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s10-15', 10, 'Ricky Ponting', 'Australia', 'Top Order Batsman', 200, 'UNSOLD', '{"matches": 375, "runs": 909, "highScore": "98", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),

-- SET 11
('s11-1', 11, 'Andre Russel', 'West Indies', 'All Rounder', 200, 'UNSOLD', '{"matches": 586, "runs": 9606, "highScore": "121", "wickets": 507, "bestBowling": "5/15", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s11-2', 11, 'Yuvraj Singh', 'India', 'All Rounder', 200, 'UNSOLD', '{"matches": 231, "runs": 4857, "highScore": "83", "wickets": 80, "bestBowling": "2/29", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s11-3', 11, 'Chris Gayle', 'West Indies', 'All Rounder', 200, 'UNSOLD', '{"matches": 463, "runs": 14562, "highScore": "175*", "wickets": 83, "bestBowling": "4/22", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s11-4', 11, 'Ravichandran Ashwin', 'India', 'All Rounder', 200, 'UNSOLD', '{"matches": 333, "runs": 8543, "highScore": "50", "wickets": 317, "bestBowling": "4/8", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s11-5', 11, 'Kieron Pollard', 'West Indies', 'All Rounder', 200, 'UNSOLD', '{"matches": 732, "runs": 14434, "highScore": "104", "wickets": 333, "bestBowling": "4/15", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s11-6', 11, 'Shane Watson', 'Australia', 'All Rounder', 200, 'UNSOLD', '{"matches": 343, "runs": 8821, "highScore": "124*", "wickets": 216, "bestBowling": "4/15", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s11-7', 11, 'Sunil Narine', 'West Indies', 'All Rounder', 200, 'UNSOLD', '{"matches": 579, "runs": 13516, "highScore": "109*", "wickets": 609, "bestBowling": "5/19", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s11-8', 11, 'Kapil Dev', 'India', 'All Rounder', 200, 'UNSOLD', '{"matches": 310, "runs": 14947, "highScore": "175*", "wickets": 335, "bestBowling": "5/43", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s11-9', 11, 'Moeen Ali', 'England', 'All Rounder', 200, 'UNSOLD', '{"matches": 413, "runs": 7711, "highScore": "121*", "wickets": 265, "bestBowling": "5/34", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s11-10', 11, 'Suresh Raina', 'India', 'All Rounder', 200, 'UNSOLD', '{"matches": 336, "runs": 8654, "highScore": "126*", "wickets": 54, "bestBowling": "4/26", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s11-11', 11, 'Dwayne Bravo', 'West Indies', 'All Rounder', 150, 'UNSOLD', '{"matches": 582, "runs": 6970, "highScore": "70*", "wickets": 631, "bestBowling": "5/23", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s11-12', 11, 'Andrew Flintoff', 'England', 'All Rounder', 150, 'UNSOLD', '{"matches": 141, "runs": 3394, "highScore": "123", "wickets": 169, "bestBowling": "5/19", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s11-13', 11, 'Irfan Pathan', 'India', 'All Rounder', 150, 'UNSOLD', '{"matches": 181, "runs": 2020, "highScore": "65*", "wickets": 173, "bestBowling": "5/13", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s11-14', 11, 'Chris Woakes', 'England', 'All Rounder', 150, 'UNSOLD', '{"matches": 170, "runs": 1031, "highScore": "57*", "wickets": 179, "bestBowling": "4/21", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s11-15', 11, 'Chris Morris', 'South Africa', 'All Rounder', 150, 'UNSOLD', '{"matches": 234, "runs": 1868, "highScore": "82*", "wickets": 290, "bestBowling": "4/9", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}')

ON CONFLICT (id) DO UPDATE 
SET 
  name = EXCLUDED.name,
  country = EXCLUDED.country,
  role = EXCLUDED.role,
  base_price = EXCLUDED.base_price,
  status = EXCLUDED.status,
  stats = EXCLUDED.stats;

-- SET 12
INSERT INTO players (id, set_no, name, country, role, base_price, status, stats) VALUES
('s12-1', 12, 'Muttiah Murlidharan', 'Sri Lanka', 'Right Arm Offbreak', 200, 'UNSOLD', '{"matches": 164, "wickets": 179, "bestBowling": "4/16", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s12-2', 12, 'Malcolm Marshall', 'West Indies', 'Right Arm Fast', 200, 'UNSOLD', '{"matches": 440, "wickets": 521, "bestBowling": "5/13", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s12-3', 12, 'Zaheer Khan', 'India', 'Left Arm Fast Medium', 200, 'UNSOLD', '{"matches": 138, "wickets": 139, "bestBowling": "4/17", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s12-4', 12, 'Dennis Lilee', 'Australia', 'Right Arm Fast', 200, 'UNSOLD', '{"matches": 102, "wickets": 165, "bestBowling": "5/34", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s12-5', 12, 'Brett Lee', 'Australia', 'Right Arm Fast', 200, 'UNSOLD', '{"matches": 120, "wickets": 109, "bestBowling": "4/28", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s12-6', 12, 'Curtly Ambrose', 'West Indies', 'Right Arm Fast', 200, 'UNSOLD', '{"matches": 329, "wickets": 401, "bestBowling": "5/17", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s12-7', 12, 'Shane Warne', 'Australia', 'Leg Break Googly', 200, 'UNSOLD', '{"matches": 73, "wickets": 70, "bestBowling": "4/21", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s12-8', 12, 'Glenn McGrath', 'Australia', 'Right Arm Fast', 200, 'UNSOLD', '{"matches": 19, "wickets": 20, "bestBowling": "4/29", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s12-9', 12, 'Javaglal Srinath', 'India', 'Right Arm Fast Medium', 200, 'UNSOLD', '{"matches": 290, "wickets": 407, "bestBowling": "5/23", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s12-10', 12, 'Anil Kumble', 'India', 'All Rounder', 200, 'UNSOLD', '{"matches": 54, "runs": 1839, "highScore": "8", "wickets": 57, "bestBowling": "5/5", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s12-11', 12, 'Andrew Flintoff', 'England', 'All Rounder', 200, 'UNSOLD', '{"matches": 39, "runs": 683, "highScore": "93", "wickets": 39, "bestBowling": "4/12", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s12-12', 12, 'Graeme Swann', 'England', 'Right Arm Offbreak', 200, 'UNSOLD', '{"matches": 80, "wickets": 98, "bestBowling": "3/13", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s12-13', 12, 'Andy Roberts', 'West Indies', 'Right Arm Fast', 150, 'UNSOLD', '{"matches": 195, "wickets": 274, "bestBowling": "5/13", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s12-14', 12, 'Courtney Walsh', 'West Indies', 'Right Arm Fast', 150, 'UNSOLD', '{"matches": 440, "wickets": 551, "bestBowling": "6/21", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s12-15', 12, 'Richard Hadlee', 'New Zealand', 'Right Arm Fast', 150, 'UNSOLD', '{"matches": 317, "wickets": 454, "bestBowling": "6/12", "runs": 0, "highScore": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),

-- SET 13
('s13-1', 13, 'Priyansh Arya', 'India', 'Opening Batsman', 200, 'UNSOLD', '{"matches": 46, "runs": 1319, "highScore": "103", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s13-2', 13, 'Prabhsimran Singh', 'India', 'Wicketkeeper Batter', 200, 'UNSOLD', '{"matches": 115, "runs": 3155, "highScore": "119", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s13-3', 13, 'Dhruv Jurel', 'India', 'Wicketkeeper Batter', 200, 'UNSOLD', '{"matches": 56, "runs": 784, "highScore": "70", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s13-4', 13, 'Karun Nair', 'India', 'Top Order Batsman', 200, 'UNSOLD', '{"matches": 177, "runs": 3731, "highScore": "111", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s13-5', 13, 'Vaibhav Suryavanshi', 'India', 'Opening Batsman', 200, 'UNSOLD', '{"matches": 18, "runs": 701, "highScore": "144", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s13-6', 13, 'Ayush Mhatre', 'India', 'Opening Batsman', 200, 'UNSOLD', '{"matches": 13, "runs": 565, "highScore": "110", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s13-7', 13, 'Devdutt Padikkal', 'India', 'Middle Order Batsman', 200, 'UNSOLD', '{"matches": 115, "runs": 3362, "highScore": "124", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s13-8', 13, 'Rajat Patidar', 'India', 'Middle Order Batsman', 200, 'UNSOLD', '{"matches": 98, "runs": 2888, "highScore": "112", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s13-9', 13, 'Sai Sudharshan', 'India', 'Top Order Batsman', 200, 'UNSOLD', '{"matches": 66, "runs": 2463, "highScore": "108", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s13-10', 13, 'Naman Dhir', 'India', 'Top Order Batsman', 150, 'UNSOLD', '{"matches": 47, "runs": 904, "highScore": "62", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s13-11', 13, 'Angkrish Raghuvanshi', 'India', 'Top Order Batsman', 150, 'UNSOLD', '{"matches": 37, "runs": 734, "highScore": "54", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s13-12', 13, 'Sarfaraz Khan', 'India', 'Middle Order Batsman', 150, 'UNSOLD', '{"matches": 103, "runs": 1517, "highScore": "100", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s13-13', 13, 'Ayush Badoni', 'India', 'Top Order Batsman', 150, 'UNSOLD', '{"matches": 96, "runs": 1788, "highScore": "80", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s13-14', 13, 'Deepak Hooda', 'India', 'All Rounder', 100, 'UNSOLD', '{"matches": 230, "runs": 3972, "highScore": "108", "wickets": 28, "bestBowling": "4/10", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'),
('s13-15', 13, 'Abishek Porel', 'India', 'Wicketkeeper Batter', 100, 'UNSOLD', '{"matches": 57, "runs": 1482, "highScore": "81", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s13-16', 13, 'Ashutosh Sharma', 'India', 'Middle Order Batsman', 100, 'UNSOLD', '{"matches": 54, "runs": 1106, "highScore": "84", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),

-- SET 14
('s14-1', 14, 'Devon Conway', 'New Zealand', 'Wicketkeeper Batter', 200, 'UNSOLD', '{"matches": 225, "runs": 6969, "highScore": "105", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s14-2', 14, 'Tristan Stubbs', 'South Africa', 'Batter', 200, 'UNSOLD', '{"matches": 148, "runs": 3087, "highScore": "80", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s14-3', 14, 'Jake Fraser-McGurk', 'Australia', 'Batter', 200, 'UNSOLD', '{"matches": 93, "runs": 1766, "highScore": "95", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s14-4', 14, 'Matthew Short', 'Australia', 'Top Order Batter', 200, 'UNSOLD', '{"matches": 145, "runs": 3615, "highScore": "109", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s14-5', 14, 'Rassie van der Dussen', 'South Africa', 'Top Order Batter', 200, 'UNSOLD', '{"matches": 249, "runs": 7151, "highScore": "112", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s14-6', 14, 'Chris Lynn', 'Australia', 'Batter', 200, 'UNSOLD', '{"matches": 216, "runs": 5397, "highScore": "96", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s14-7', 14, 'Colin Munro', 'New Zealand', 'Opening Batter', 200, 'UNSOLD', '{"matches": 460, "runs": 11733, "highScore": "120", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s14-8', 14, 'Jordon Cox', 'Australia', 'Wicketkeeper Batter', 200, 'UNSOLD', '{"matches": 169, "runs": 3902, "highScore": "139", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s14-9', 14, 'Marnus Labuschagne', 'Australia', 'Top Order Batter', 150, 'UNSOLD', '{"matches": 56, "runs": 1358, "highScore": "93", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s14-10', 14, 'Jonny Bairstow', 'England', 'Wicketkeeper Batter', 150, 'UNSOLD', '{"matches": 257, "runs": 6207, "highScore": "116", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s14-11', 14, 'Sam Billings', 'England', 'Wicketkeeper Batter', 150, 'UNSOLD', '{"matches": 390, "runs": 7360, "highScore": "106", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s14-12', 14, 'Ben Duckett', 'England', 'Top Order Batter', 100, 'UNSOLD', '{"matches": 216, "runs": 5397, "highScore": "96", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s14-13', 14, 'Lendl Simmons', 'West Indies', 'Top Order Batter', 100, 'UNSOLD', '{"matches": 292, "runs": 7756, "highScore": "116", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s14-14', 14, 'Usman Khawaja', 'Australia', 'Top Order Batter', 100, 'UNSOLD', '{"matches": 118, "runs": 3292, "highScore": "109", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}'),
('s14-15', 14, 'Tom Latham', 'New Zealand', 'Wicketkeeper Batter', 100, 'UNSOLD', '{"matches": 128, "runs": 3251, "highScore": "110", "avg": 0, "strikeRate": 0, "economy": 0, "wickets": 0, "bestBowling": "", "age": 0}')

ON CONFLICT (id) DO UPDATE 
SET 
  name = EXCLUDED.name,
  country = EXCLUDED.country,
  role = EXCLUDED.role,
  base_price = EXCLUDED.base_price,
  status = EXCLUDED.status,
  stats = EXCLUDED.stats;
