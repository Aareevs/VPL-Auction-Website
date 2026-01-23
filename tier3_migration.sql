-- 1. Clear existing Tier 3 (Set 2) players to "Unsold" (Set 999)
UPDATE players SET set_no = 999 WHERE set_no = 2;

-- 2. Ensure all Tier 3 players exist. Insert missing ones with stats from image.
-- We use a generic ID pattern 't3-new-X' if inserting. Existing players keep their ID.

-- Sherfane Rutherford
INSERT INTO players (id, set_no, name, country, role, base_price, status, stats)
SELECT 't3-new-1', 999, 'Sherfane Rutherford', 'West Indies', 'Middle Order Batsman', 100, 'UNSOLD', '{"matches": 232, "runs": 3868, "highScore": "86", "wickets": 0, "bestBowling": "", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'
WHERE NOT EXISTS (SELECT 1 FROM players WHERE name = 'Sherfane Rutherford');

-- Mohammed Shami
INSERT INTO players (id, set_no, name, country, role, base_price, status, stats)
SELECT 't3-new-2', 999, 'Mohammed Shami', 'India', 'Right Arm Fast', 100, 'UNSOLD', '{"matches": 183, "runs": 0, "highScore": "", "wickets": 226, "bestBowling": "4/11", "avg": 24, "strikeRate": 18, "economy": 8.3, "age": 33}'
WHERE NOT EXISTS (SELECT 1 FROM players WHERE name = 'Mohammed Shami');

-- Rahmanullah Gurbaz
INSERT INTO players (id, set_no, name, country, role, base_price, status, stats)
SELECT 't3-new-3', 999, 'Rahmanullah Gurbaz', 'Afghanistan', 'Wicketkeeper Batter', 100, 'UNSOLD', '{"matches": 251, "runs": 6079, "highScore": "121*", "wickets": 0, "bestBowling": "", "avg": 26, "strikeRate": 150, "economy": 0, "age": 22}'
WHERE NOT EXISTS (SELECT 1 FROM players WHERE name = 'Rahmanullah Gurbaz');

-- Sam Curran
INSERT INTO players (id, set_no, name, country, role, base_price, status, stats)
SELECT 't3-new-4', 999, 'Sam Curran', 'England', 'All Rounder', 100, 'UNSOLD', '{"matches": 188, "runs": 3596, "highScore": "95*", "wickets": 69, "bestBowling": "3/4", "avg": 25, "strikeRate": 135, "economy": 8.5, "age": 25}'
WHERE NOT EXISTS (SELECT 1 FROM players WHERE name = 'Sam Curran');

-- Vaibhav Suryavanshi
INSERT INTO players (id, set_no, name, country, role, base_price, status, stats)
SELECT 't3-new-5', 999, 'Vaibhav Suryavanshi', 'India', 'Opening Batsman', 100, 'UNSOLD', '{"matches": 18, "runs": 701, "highScore": "144", "wickets": 0, "bestBowling": "", "avg": 41, "strikeRate": 140, "economy": 0, "age": 14}'
WHERE NOT EXISTS (SELECT 1 FROM players WHERE name = 'Vaibhav Suryavanshi');

-- Maheesh Theekshana
INSERT INTO players (id, set_no, name, country, role, base_price, status, stats)
SELECT 't3-new-6', 999, 'Maheesh Theekshana', 'Sri Lanka', 'Right Arm Offbreak', 100, 'UNSOLD', '{"matches": 214, "runs": 0, "highScore": "", "wickets": 217, "bestBowling": "4/15", "avg": 26, "strikeRate": 22, "economy": 6.7, "age": 23}'
WHERE NOT EXISTS (SELECT 1 FROM players WHERE name = 'Maheesh Theekshana');

-- Sai Sudharshan
INSERT INTO players (id, set_no, name, country, role, base_price, status, stats)
SELECT 't3-new-7', 999, 'Sai Sudharshan', 'India', 'Top Order Batsman', 100, 'UNSOLD', '{"matches": 66, "runs": 2463, "highScore": "108", "wickets": 0, "bestBowling": "", "avg": 38, "strikeRate": 130, "economy": 0, "age": 22}'
WHERE NOT EXISTS (SELECT 1 FROM players WHERE name = 'Sai Sudharshan');

-- Finn Allen
INSERT INTO players (id, set_no, name, country, role, base_price, status, stats)
SELECT 't3-new-8', 999, 'Finn Allen', 'New Zealand', 'Wicketkeeper Batter', 100, 'UNSOLD', '{"matches": 166, "runs": 4580, "highScore": "151", "wickets": 0, "bestBowling": "", "avg": 29, "strikeRate": 165, "economy": 0, "age": 24}'
WHERE NOT EXISTS (SELECT 1 FROM players WHERE name = 'Finn Allen');

-- Prabhsimran Singh
INSERT INTO players (id, set_no, name, country, role, base_price, status, stats)
SELECT 't3-new-9', 999, 'Prabhsimran Singh', 'India', 'Wicketkeeper Batter', 100, 'UNSOLD', '{"matches": 115, "runs": 3155, "highScore": "119", "wickets": 0, "bestBowling": "", "avg": 28, "strikeRate": 140, "economy": 0, "age": 23}'
WHERE NOT EXISTS (SELECT 1 FROM players WHERE name = 'Prabhsimran Singh');

-- Akeal Hosein
INSERT INTO players (id, set_no, name, country, role, base_price, status, stats)
SELECT 't3-new-10', 999, 'Akeal Hosein', 'West Indies', 'Slow Left Arm Orthodox', 100, 'UNSOLD', '{"matches": 257, "runs": 0, "highScore": "", "wickets": 241, "bestBowling": "5/11", "avg": 25, "strikeRate": 21, "economy": 6.9, "age": 30}'
WHERE NOT EXISTS (SELECT 1 FROM players WHERE name = 'Akeal Hosein');

-- Riyan Parag
INSERT INTO players (id, set_no, name, country, role, base_price, status, stats)
SELECT 't3-new-11', 999, 'Riyan Parag', 'India', 'All Rounder', 100, 'UNSOLD', '{"matches": 143, "runs": 3168, "highScore": "95", "wickets": 48, "bestBowling": "3/5", "avg": 30, "strikeRate": 139, "economy": 8.1, "age": 22}'
WHERE NOT EXISTS (SELECT 1 FROM players WHERE name = 'Riyan Parag');

-- Jake Fraser-McGurk
INSERT INTO players (id, set_no, name, country, role, base_price, status, stats)
SELECT 't3-new-12', 999, 'Jake Fraser-McGurk', 'Australia', 'Batter', 100, 'UNSOLD', '{"matches": 93, "runs": 1766, "highScore": "95", "wickets": 0, "bestBowling": "", "avg": 21, "strikeRate": 180, "economy": 0, "age": 21}'
WHERE NOT EXISTS (SELECT 1 FROM players WHERE name = 'Jake Fraser-McGurk');

-- Washington Sundar
INSERT INTO players (id, set_no, name, country, role, base_price, status, stats)
SELECT 't3-new-13', 999, 'Washington Sundar', 'India', 'All Rounder', 100, 'UNSOLD', '{"matches": 159, "runs": 1489, "highScore": "54*", "wickets": 118, "bestBowling": "3/3", "avg": 18, "strikeRate": 110, "economy": 7.4, "age": 24}'
WHERE NOT EXISTS (SELECT 1 FROM players WHERE name = 'Washington Sundar');

-- Priyansh Arya
INSERT INTO players (id, set_no, name, country, role, base_price, status, stats)
SELECT 't3-new-14', 999, 'Priyansh Arya', 'India', 'Opening Batsman', 100, 'UNSOLD', '{"matches": 46, "runs": 1319, "highScore": "103", "wickets": 0, "bestBowling": "", "avg": 29, "strikeRate": 145, "economy": 0, "age": 23}'
WHERE NOT EXISTS (SELECT 1 FROM players WHERE name = 'Priyansh Arya');

-- Rashid Khan
INSERT INTO players (id, set_no, name, country, role, base_price, status, stats)
SELECT 't3-new-15', 999, 'Rashid Khan', 'Afghanistan', 'All Rounder', 100, 'UNSOLD', '{"matches": 508, "runs": 2853, "highScore": "79*", "wickets": 687, "bestBowling": "6/17", "avg": 15, "strikeRate": 150, "economy": 6.8, "age": 25}'
WHERE NOT EXISTS (SELECT 1 FROM players WHERE name = 'Rashid Khan');

-- Shivam Mavi
INSERT INTO players (id, set_no, name, country, role, base_price, status, stats)
SELECT 't3-new-16', 999, 'Shivam Mavi', 'India', 'Right Arm Fast Medium', 100, 'UNSOLD', '{"matches": 68, "runs": 0, "highScore": "", "wickets": 63, "bestBowling": "4/14", "avg": 30, "strikeRate": 21, "economy": 8.7, "age": 25}'
WHERE NOT EXISTS (SELECT 1 FROM players WHERE name = 'Shivam Mavi');

-- Suresh Raina
INSERT INTO players (id, set_no, name, country, role, base_price, status, stats)
SELECT 't3-new-17', 999, 'Suresh Raina', 'India', 'All Rounder', 100, 'UNSOLD', '{"matches": 336, "runs": 8654, "highScore": "126*", "wickets": 54, "bestBowling": "4/26", "avg": 32, "strikeRate": 137, "economy": 7.3, "age": 37}'
WHERE NOT EXISTS (SELECT 1 FROM players WHERE name = 'Suresh Raina');

-- Nitesh Kumar Reddy
INSERT INTO players (id, set_no, name, country, role, base_price, status, stats)
SELECT 't3-new-18', 999, 'Nitesh Kumar Reddy', 'India', 'All Rounder', 100, 'UNSOLD', '{"matches": 40, "runs": 737, "highScore": "76*", "wickets": 14, "bestBowling": "3/17", "avg": 35, "strikeRate": 150, "economy": 8.5, "age": 20}'
WHERE NOT EXISTS (SELECT 1 FROM players WHERE name = 'Nitesh Kumar Reddy');

-- Rahul Chahar
INSERT INTO players (id, set_no, name, country, role, base_price, status, stats)
SELECT 't3-new-19', 999, 'Rahul Chahar', 'India', 'Legbreak Googly', 100, 'UNSOLD', '{"matches": 140, "runs": 0, "highScore": "", "wickets": 142, "bestBowling": "5/14", "avg": 27, "strikeRate": 21, "economy": 7.5, "age": 24}'
WHERE NOT EXISTS (SELECT 1 FROM players WHERE name = 'Rahul Chahar');

-- Devon Conway
INSERT INTO players (id, set_no, name, country, role, base_price, status, stats)
SELECT 't3-new-20', 999, 'Devon Conway', 'New Zealand', 'Wicketkeeper Batter', 100, 'UNSOLD', '{"matches": 225, "runs": 6969, "highScore": "105", "wickets": 0, "bestBowling": "", "avg": 42, "strikeRate": 128, "economy": 0, "age": 32}'
WHERE NOT EXISTS (SELECT 1 FROM players WHERE name = 'Devon Conway');

-- Dhruv Jurel
INSERT INTO players (id, set_no, name, country, role, base_price, status, stats)
SELECT 't3-new-21', 999, 'Dhruv Jurel', 'India', 'Wicketkeeper Batter', 100, 'UNSOLD', '{"matches": 56, "runs": 784, "highScore": "70", "wickets": 0, "bestBowling": "", "avg": 25, "strikeRate": 139, "economy": 0, "age": 23}'
WHERE NOT EXISTS (SELECT 1 FROM players WHERE name = 'Dhruv Jurel');

-- Rajat Patidar
INSERT INTO players (id, set_no, name, country, role, base_price, status, stats)
SELECT 't3-new-22', 999, 'Rajat Patidar', 'India', 'Middle Order Batsman', 100, 'UNSOLD', '{"matches": 98, "runs": 2888, "highScore": "112", "wickets": 0, "bestBowling": "", "avg": 34, "strikeRate": 145, "economy": 0, "age": 30}'
WHERE NOT EXISTS (SELECT 1 FROM players WHERE name = 'Rajat Patidar');

-- Abishek Porel
INSERT INTO players (id, set_no, name, country, role, base_price, status, stats)
SELECT 't3-new-23', 999, 'Abishek Porel', 'India', 'Wicketkeeper Batter', 100, 'UNSOLD', '{"matches": 57, "runs": 1482, "highScore": "81", "wickets": 0, "bestBowling": "", "avg": 28, "strikeRate": 140, "economy": 0, "age": 21}'
WHERE NOT EXISTS (SELECT 1 FROM players WHERE name = 'Abishek Porel');

-- Chris Lynn
INSERT INTO players (id, set_no, name, country, role, base_price, status, stats)
SELECT 't3-new-24', 999, 'Chris Lynn', 'Australia', 'Batter', 100, 'UNSOLD', '{"matches": 216, "runs": 5397, "highScore": "96", "wickets": 0, "bestBowling": "", "avg": 31, "strikeRate": 140, "economy": 0, "age": 34}'
WHERE NOT EXISTS (SELECT 1 FROM players WHERE name = 'Chris Lynn');

-- Jonny Bairstow
INSERT INTO players (id, set_no, name, country, role, base_price, status, stats)
SELECT 't3-new-25', 999, 'Jonny Bairstow', 'England', 'Wicketkeeper Batter', 100, 'UNSOLD', '{"matches": 257, "runs": 6207, "highScore": "116", "wickets": 0, "bestBowling": "", "avg": 31, "strikeRate": 139, "economy": 0, "age": 34}'
WHERE NOT EXISTS (SELECT 1 FROM players WHERE name = 'Jonny Bairstow');

-- Thangarasu Natarajan
INSERT INTO players (id, set_no, name, country, role, base_price, status, stats)
SELECT 't3-new-26', 999, 'Thangarasu Natarajan', 'India', 'Left Arm Medium', 100, 'UNSOLD', '{"matches": 103, "runs": 0, "highScore": "", "wickets": 112, "bestBowling": "4/19", "avg": 28, "strikeRate": 19, "economy": 8.1, "age": 32}'
WHERE NOT EXISTS (SELECT 1 FROM players WHERE name = 'Thangarasu Natarajan');
-- (Note: He might be in Set 4 in DB, but we move him here)

-- Sarfaraz Khan
INSERT INTO players (id, set_no, name, country, role, base_price, status, stats)
SELECT 't3-new-27', 999, 'Sarfaraz Khan', 'India', 'Middle Order Batsman', 100, 'UNSOLD', '{"matches": 103, "runs": 1517, "highScore": "100", "wickets": 0, "bestBowling": "", "avg": 25, "strikeRate": 130, "economy": 0, "age": 26}'
WHERE NOT EXISTS (SELECT 1 FROM players WHERE name = 'Sarfaraz Khan');

-- Sam Billings
INSERT INTO players (id, set_no, name, country, role, base_price, status, stats)
SELECT 't3-new-28', 999, 'Sam Billings', 'England', 'Wicketkeeper Batter', 100, 'UNSOLD', '{"matches": 390, "runs": 7360, "highScore": "106", "wickets": 0, "bestBowling": "", "avg": 25, "strikeRate": 133, "economy": 0, "age": 32}'
WHERE NOT EXISTS (SELECT 1 FROM players WHERE name = 'Sam Billings');

-- Piyush Chawla
INSERT INTO players (id, set_no, name, country, role, base_price, status, stats)
SELECT 't3-new-29', 999, 'Piyush Chawla', 'India', 'Legbreak', 100, 'UNSOLD', '{"matches": 305, "runs": 0, "highScore": "", "wickets": 327, "bestBowling": "4/12", "avg": 26, "strikeRate": 20, "economy": 7.8, "age": 35}'
WHERE NOT EXISTS (SELECT 1 FROM players WHERE name = 'Piyush Chawla');

-- Tom Latham
INSERT INTO players (id, set_no, name, country, role, base_price, status, stats)
SELECT 't3-new-30', 999, 'Tom Latham', 'New Zealand', 'Wicketkeeper Batter', 100, 'UNSOLD', '{"matches": 128, "runs": 3251, "highScore": "110", "wickets": 0, "bestBowling": "", "avg": 30, "strikeRate": 130, "economy": 0, "age": 32}'
WHERE NOT EXISTS (SELECT 1 FROM players WHERE name = 'Tom Latham');


-- Ishant Sharma (User Request)
INSERT INTO players (id, set_no, name, country, role, base_price, status, stats)
SELECT 't3-new-31', 999, 'Ishant Sharma', 'India', 'Right Arm Fast', 100, 'UNSOLD', '{"matches": 179, "runs": 0, "highScore": "", "wickets": 155, "bestBowling": "5/12", "avg": 33, "strikeRate": 26, "economy": 7.8, "age": 35}'
WHERE NOT EXISTS (SELECT 1 FROM players WHERE name = 'Ishant Sharma');

-- Harshal Patel (User Request)
INSERT INTO players (id, set_no, name, country, role, base_price, status, stats)
SELECT 't3-new-32', 999, 'Harshal Patel', 'India', 'Right Arm Medium Fast', 100, 'UNSOLD', '{"matches": 200, "runs": 0, "highScore": "", "wickets": 230, "bestBowling": "5/27", "avg": 24, "strikeRate": 17, "economy": 8.5, "age": 33}'
WHERE NOT EXISTS (SELECT 1 FROM players WHERE name = 'Harshal Patel');

-- Jaydev Unadkat (User Request)
INSERT INTO players (id, set_no, name, country, role, base_price, status, stats)
SELECT 't3-new-33', 999, 'Jaydev Unadkat', 'India', 'Left Arm Fast Medium', 100, 'UNSOLD', '{"matches": 185, "runs": 0, "highScore": "", "wickets": 218, "bestBowling": "5/25", "avg": 28, "strikeRate": 20, "economy": 8.8, "age": 32}'
WHERE NOT EXISTS (SELECT 1 FROM players WHERE name = 'Jaydev Unadkat');

-- 3. Move specific players to Tier 3 (Set 2) with explicit display_order
WITH tier3_list(name, sort_order) AS (
    VALUES
    ('Sherfane Rutherford', 1),
    ('Mohammed Shami', 2),
    ('Rahmanullah Gurbaz', 3),
    ('Sam Curran', 4),
    ('Vaibhav Suryavanshi', 5),
    ('Maheesh Theekshana', 6),
    ('Sai Sudharshan', 7),
    ('Finn Allen', 8),
    ('Prabhsimran Singh', 9),
    ('Akeal Hosein', 10),
    ('Riyan Parag', 11),
    ('Jake Fraser-McGurk', 12),
    ('Washington Sundar', 13),
    ('Priyansh Arya', 14),
    ('Rashid Khan', 15),
    ('Shivam Mavi', 16),
    ('Suresh Raina', 17),
    ('Nitesh Kumar Reddy', 18),
    ('Rahul Chahar', 19),
    ('Devon Conway', 20),
    ('Dhruv Jurel', 21),
    ('Rajat Patidar', 22),
    ('Abishek Porel', 23),
    ('Chris Lynn', 24),
    ('Jonny Bairstow', 25),
    ('Thangarasu Natarajan', 26),
    ('Sarfaraz Khan', 27),
    ('Sam Billings', 28),
    ('Piyush Chawla', 29),
    ('Tom Latham', 30),
    ('Ryan Rickleton', 31),
    ('Ishant Sharma', 32),
    ('Ayush Mhatre', 33),
    ('Deepak Hooda', 34),
    ('Nitesh Rana', 35),
    ('Karun Nair', 36),
    ('Harshal Patel', 37),
    ('Jaydev Unadkat', 38)
)
UPDATE players p
SET set_no = 2,
    display_order = t.sort_order,
    base_price = 100,
    image_url = NULL,
    updated_at = NOW()
FROM tier3_list t
WHERE p.name = t.name;
