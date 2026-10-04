CREATE TABLE IF NOT EXISTS public.auction_settings (
    id INTEGER PRIMARY KEY,
    valuation_mode TEXT NOT NULL DEFAULT 'currency' CHECK (valuation_mode IN ('currency', 'points')),
    captain_spotlight_enabled BOOLEAN NOT NULL DEFAULT false,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.auction_settings ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.auction_settings
ADD COLUMN IF NOT EXISTS captain_spotlight_enabled BOOLEAN NOT NULL DEFAULT false;

DROP POLICY IF EXISTS "Public read auction_settings" ON public.auction_settings;
CREATE POLICY "Public read auction_settings" ON public.auction_settings
    FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Auth write auction_settings" ON public.auction_settings;
CREATE POLICY "Auth write auction_settings" ON public.auction_settings
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

INSERT INTO public.auction_settings (id, valuation_mode, captain_spotlight_enabled)
VALUES (1, 'currency', false)
ON CONFLICT (id) DO NOTHING;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_publication_tables
        WHERE pubname = 'supabase_realtime'
          AND schemaname = 'public'
          AND tablename = 'auction_settings'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.auction_settings;
    END IF;
END $$;
