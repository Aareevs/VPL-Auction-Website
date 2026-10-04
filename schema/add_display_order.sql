-- Add display_order column to players table
ALTER TABLE players 
ADD COLUMN IF NOT EXISTS display_order integer DEFAULT NULL;

-- Initial cleanup: Set display_order to ID-suffix for existing players as a default? 
-- No, let's leave it NULL and handle NULLs as "unsorted" (or sort by ID).

-- If you want to index it:
-- CREATE INDEX idx_players_display_order ON players(display_order);
