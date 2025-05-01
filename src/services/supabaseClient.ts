import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cuvhqtyslazvbwlbhqcn.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1dmhxdHlzbGF6dmJ3bGJocWNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3NzczMzYsImV4cCI6MjA2MTM1MzMzNn0.kHsHP3OjemeUCZ4Las4wS5xQJZO-944liOLvYiAPkog';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
