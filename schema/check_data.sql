-- Check player counts
SELECT count(*) as total_players FROM players;

-- Check status distribution
SELECT status, count(*) FROM players GROUP BY status;

-- Check if any players exist
SELECT * FROM players LIMIT 5;
