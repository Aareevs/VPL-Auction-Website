CREATE TABLE IF NOT EXISTS auction_settings (
    id INTEGER PRIMARY KEY,
    valuation_mode TEXT NOT NULL DEFAULT 'currency' CHECK (valuation_mode IN ('currency', 'points')),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE auction_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read auction_settings" ON auction_settings
    FOR SELECT USING (true);

CREATE POLICY "Auth write auction_settings" ON auction_settings
    FOR ALL USING (auth.role() = 'authenticated');

INSERT INTO auction_settings (id, valuation_mode)
VALUES (1, 'currency')
ON CONFLICT (id) DO NOTHING;
