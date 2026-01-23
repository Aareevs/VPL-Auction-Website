-- 1. Clear existing Tier 2 (Set 1) players to a generic "Unsold" state (e.g. Set 999 or NULL)
-- This ensures ONLY the players in the list below are in Set 1.
UPDATE players SET set_no = 999 WHERE set_no = 1;

-- 2. Move specific players to Tier 2 (Set 1) with STAGGERED timestamps to enforce order.
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
    -- Set updated_at to now + seconds corresponding to sort_order
    -- This ensures that when sorted by updated_at, they appear in this exact sequence.
    updated_at = NOW() + (t.sort_order || ' seconds')::interval
FROM tier2_list t
WHERE p.name = t.name;
