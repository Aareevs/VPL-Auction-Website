import { supabase } from './lib/supabaseClient.ts';

async function check() {
  const { data, error } = await supabase.from('players').select('*').limit(1);
  console.log('Columns:', Object.keys(data?.[0] || {}));
}
check();
