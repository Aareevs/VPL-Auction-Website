-- Migration to update Team IDs from old (t2, t3...) to new (1, 2...)
-- This ensures existing data in 'players' and 'auction_state' matches the new constants.

BEGIN;

-- 1. The Dark Knight Riders (t2 -> 1)
UPDATE players SET team_id = '1' WHERE team_id = 't2';
UPDATE auction_state SET current_bidder_team_id = '1' WHERE current_bidder_team_id = 't2';

-- 2. B-1901 (t3 -> 2)
UPDATE players SET team_id = '2' WHERE team_id = 't3';
UPDATE auction_state SET current_bidder_team_id = '2' WHERE current_bidder_team_id = 't3';

-- 3. Kings XI Vedam (t4 -> 3)
UPDATE players SET team_id = '3' WHERE team_id = 't4';
UPDATE auction_state SET current_bidder_team_id = '3' WHERE current_bidder_team_id = 't4';

-- 4. Team 1404 (t5 -> 4)
UPDATE players SET team_id = '4' WHERE team_id = 't5';
UPDATE auction_state SET current_bidder_team_id = '4' WHERE current_bidder_team_id = 't5';

-- 5. Loser (t6 -> 5)
UPDATE players SET team_id = '5' WHERE team_id = 't6';
UPDATE auction_state SET current_bidder_team_id = '5' WHERE current_bidder_team_id = 't6';

-- 6. Justice League (t7 -> 6)
UPDATE players SET team_id = '6' WHERE team_id = 't7';
UPDATE auction_state SET current_bidder_team_id = '6' WHERE current_bidder_team_id = 't7';

-- 7. Alpha Executors (t8 -> 7)
UPDATE players SET team_id = '7' WHERE team_id = 't8';
UPDATE auction_state SET current_bidder_team_id = '7' WHERE current_bidder_team_id = 't8';

-- 8. Kartik Aryan (t9 -> 8)
UPDATE players SET team_id = '8' WHERE team_id = 't9';
UPDATE auction_state SET current_bidder_team_id = '8' WHERE current_bidder_team_id = 't9';

-- 9. Auction Bullies (t10 -> 9)
UPDATE players SET team_id = '9' WHERE team_id = 't10';
UPDATE auction_state SET current_bidder_team_id = '9' WHERE current_bidder_team_id = 't10';

-- 10. MoneyBall Mafia (t11 -> 10)
UPDATE players SET team_id = '10' WHERE team_id = 't11';
UPDATE auction_state SET current_bidder_team_id = '10' WHERE current_bidder_team_id = 't11';

COMMIT;
