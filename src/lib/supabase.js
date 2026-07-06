import { createClient } from '@supabase/supabase-js'

const rawUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

function normalizeUrl(url) {
  if (!url) return url
  try {
    const u = new URL(url)
    // use origin only (strip any trailing /rest/v1 or path)
    return u.origin
  } catch (e) {
    // fallback: strip common suffix
    return url.replace(/\/rest\/v1\/?$/i, '').replace(/\/$/, '')
  }
}

const supabaseUrl = normalizeUrl(rawUrl)

export const supabase =
  supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('https://')
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null

export const isSupabaseConnected = () => {
  if (!supabase) return false
  // quick check: has project URL and anon key
  return Boolean(supabaseUrl && supabaseAnonKey)
}
