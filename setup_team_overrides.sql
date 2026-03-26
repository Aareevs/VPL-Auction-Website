-- Create a table to store admin overrides for team properties.
-- This table stores only the CHANGED fields. Defaults come from constants.ts.
CREATE TABLE IF NOT EXISTS team_overrides (
    team_id TEXT PRIMARY KEY,
    name TEXT,
    short_name TEXT,
    logo_url TEXT,
    primary_color TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Allow public read
ALTER TABLE team_overrides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read team_overrides" ON team_overrides
    FOR SELECT USING (true);

CREATE POLICY "Auth write team_overrides" ON team_overrides
    FOR ALL USING (auth.role() = 'authenticated');

-- Seed rows for all 10 teams so we can UPDATE them later
INSERT INTO team_overrides (team_id) VALUES
    ('1'), ('2'), ('3'), ('4'), ('5'), ('6'), ('7'), ('8'), ('9'), ('10')
ON CONFLICT (team_id) DO NOTHING;
