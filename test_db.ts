import { supabase } from './lib/supabaseClient';

async function check() {
  const { data, error } = await supabase.from('auction_sets').select('*').order('display_order', { ascending: true });
  console.log('Sets:', data);
  if (error) console.error('Error:', error);
}
check();
