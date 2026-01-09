-- ============================================
-- ENABLE REALTIME - Run this to make updates instant
-- ============================================

-- This tells Supabase to broadcast changes to the browser in real-time

-- 1. Enable Realtime for players table
ALTER PUBLICATION supabase_realtime ADD TABLE players;

-- 2. Enable Realtime for auction_state table
ALTER PUBLICATION supabase_realtime ADD TABLE auction_state;

-- Done!
SELECT 'REALTIME ENABLED - Refresh app to see instant updates' as message;
