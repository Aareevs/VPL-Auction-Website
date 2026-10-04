-- ============================================
-- ENABLE REALTIME - Safe Version
-- ============================================

BEGIN;
  -- 1. Enable Realtime for players table (Ignore if already exists)
  DO $$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'players') THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE players;
    END IF;
  END
  $$;

  -- 2. Enable Realtime for auction_state table (Ignore if already exists)
  DO $$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'auction_state') THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE auction_state;
    END IF;
  END
  $$;
COMMIT;

SELECT 'REALTIME ENABLED - Refresh app to see instant updates' as message;
