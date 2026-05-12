import { createClient } from '@supabase/supabase-js'

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim()
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim()

console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Key exists:', !!supabaseAnonKey)

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env or .env.local files and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.'
  )
}

let parsedUrl: URL
try {
  parsedUrl = new URL(supabaseUrl)
} catch (error) {
  throw new Error(
    `Invalid Supabase URL in environment config: ${supabaseUrl}. Expected a valid URL such as https://<project-ref>.supabase.co.`
  )
}

const validSupabaseHost = /\.(supabase\.co|supabase\.in|supabase\.red)$/i.test(parsedUrl.hostname)
if (!validSupabaseHost) {
  throw new Error(
    `Invalid Supabase host: ${parsedUrl.hostname}. Please set VITE_SUPABASE_URL to your Supabase project URL (for example https://<project-ref>.supabase.co).`
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})






// Clear corrupted sessions from localStorage
const clearCorruptedSessions = () => {
  try {
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith('sb-') && key.includes('-auth-token')) {
        const value = localStorage.getItem(key)
        if (value) {
          try {
            const session = JSON.parse(value)
            // Remove sessions that don't have valid tokens
            if (!session?.access_token || !session?.refresh_token) {
              localStorage.removeItem(key)
              console.log('Removed corrupted session:', key)
            }
          } catch (e) {
            // Remove invalid JSON
            localStorage.removeItem(key)
            console.log('Removed invalid session data:', key)
          }
        }
      }
    })
  } catch (e) {
    console.warn('Error clearing corrupted sessions:', e)
  }
}

// Clear corrupted sessions on initialization
clearCorruptedSessions()
