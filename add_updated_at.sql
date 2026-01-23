-- Add updated_at column to players table
ALTER TABLE players 
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone;

-- Optional: Create a trigger to automatically update updated_at
-- For now, we can just update it manually from the frontend when moving sets to be explicit
-- or we can add a trigger for all updates.
-- Let's stick to manual update or trigger. Trigger is safer for all updates.

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_players_updated_at
    BEFORE UPDATE ON players
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
