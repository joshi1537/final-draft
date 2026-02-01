import { createClient } from '@supabase/supabase-js';

const url = 'https://dwleharfanytrbnjjzjm.supabase.co';
const anonKey = 'sb_publishable_IB2hUdF8gbKLqbQEkPFqFA_6c-5FIoY'

if (!anonKey) {
	throw new Error('Missing VITE_SUPABASE_ANON_KEY in env');
}

export const supabase = createClient(url, anonKey);
