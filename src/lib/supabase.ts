import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xfaiwyhupehbgvmiqjfi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmYWl3eWh1cGVoYmd2bWlxamZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMTQyMjAsImV4cCI6MjA4NDU5MDIyMH0.fOgU6EqBScwqbUviWoWSKAWs11b7LRFcjc4QQU26nH4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
