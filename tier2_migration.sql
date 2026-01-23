-- 1. Clear existing Tier 2 (Set 1) players to a generic "Unsold" state (e.g. Set 999 or NULL)
-- This ensures ONLY the players in the list below are in Set 1.
UPDATE players SET set_no = 999 WHERE set_no = 1;

-- 2. Restore Romario Shephard (who was accidentally deleted in Tier 1 migration)
-- We check if he exists by name; if not, we insert him.
INSERT INTO players (id, set_no, name, country, role, base_price, status, stats)
SELECT 's3-1-restored', 999, 'Romario Shephard', 'West Indies', 'All Rounder', 200, 'UNSOLD', '{"matches": 223, "runs": 2443, "highScore": "73*", "wickets": 206, "bestBowling": "4/13", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'
WHERE NOT EXISTS (SELECT 1 FROM players WHERE name = 'Romario Shephard');



-- 3. Restore/Create Ashish Wadekar (User mentioned he is missing)
-- We check if he exists by name; if not, we insert him.
INSERT INTO players (id, set_no, name, country, role, base_price, status, stats)
SELECT 's36-new', 999, 'Ashish Wadekar', 'India', 'All Rounder', 200, 'UNSOLD', '{"matches": 0, "runs": 0, "highScore": "0", "wickets": 0, "bestBowling": "N/A", "avg": 0, "strikeRate": 0, "economy": 0, "age": 0}'
WHERE NOT EXISTS (SELECT 1 FROM players WHERE name = 'Ashish Wadekar');

-- 4. Move specific players to Tier 2 (Set 1) with STAGGERED timestamps to enforce order.
-- We use a CTE to define the order, then join and update.

WITH tier2_list(name, sort_order) AS (
    VALUES
    ('Aiden Markram', 1),
    ('Jofra Archer', 2),
    ('Romario Shephard', 3),
    ('Tim Southee', 4),
    ('Shubman Gill', 5),
    ('Tim David', 6),
    ('Ishan Kishan', 7),
    ('Josh Little', 8),
    ('Hashim Amla', 9),
    ('Marcus Stoinis', 10),
    ('Joe Root', 11),
    ('Kagiso Rabada', 12),
    ('Tim Seifert', 13),
    ('Ravindra Jadeja', 14),
    ('Pathum Nissanka', 15),
    ('Nicholas Pooran', 16),
    ('Harshit Rana', 17),
    ('Steve Smith', 18),
    ('Lungi Ngidi', 19),
    ('Heinrich Klaasen', 20),
    ('Yashasvi Jaiswal', 21),
    ('Ben Stokes', 22),
    ('Trent Boult', 23),
    ('Rinku Singh', 24),
    ('Josh Inglis', 25),
    ('Bhuvneshwar Kumar', 26),
    ('Ross Taylor', 27),
    ('Sunil Narine', 28),
    ('Ravichandran Ashwin', 29),
    ('Reeza Hendricks', 30),
    ('Noor Ahmad', 31),
    ('MS Dhoni', 32),
    ('Lasith Malinga', 33),
    ('Ruturaj Gaikwad', 34),
    ('Keshav Maharaj', 35),
    ('Ashish Wadekar', 36),
    ('Dwayne Bravo', 37),
    ('Deepak Chahar', 38),
    ('Ryan Rickleton', 39),
    ('Shikhar Dhawan', 40),
    ('Glenn Maxwell', 41),
    ('Faf Du Plessis', 42),
    ('Ravi Bishnoi', 43),
    ('Jitesh Sharma', 44),
    ('Kane Williamson', 45),
    ('Cameron Green', 46),
    ('Rovman Powell', 47),
    ('Imran Tahir', 48),
    ('Jacob Bethell', 49),
    ('Shivam Dube', 50)
)
UPDATE players p
SET set_no = 1,
    display_order = t.sort_order,
    base_price = 300,
    image_url = NULL,
    updated_at = NOW()
FROM tier2_list t
WHERE p.name = t.name;
