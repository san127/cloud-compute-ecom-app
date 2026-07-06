import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

function normalizeUrl(url) {
  if (!url) return url
  try {
    const u = new URL(url)
    return u.origin
  } catch (e) {
    return url.replace(/\/rest\/v1\/?$/i, '').replace(/\/$/, '')
  }
}

const rawUrl = process.env.VITE_SUPABASE_URL
const anon = process.env.VITE_SUPABASE_ANON_KEY
const url = normalizeUrl(rawUrl)

if (!url || !anon) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in environment')
  process.exit(1)
}

const supabase = createClient(url, anon)

async function run() {
  try {
    const sessionId = 'test-session-' + Date.now()
    const productId = 1
    const quantity = 1

    console.log('Inserting cart row for session', sessionId)
    const { data: upsertData, error: upsertError } = await supabase
      .from('cart_items')
      .upsert(
        { session_id: sessionId, product_id: productId, quantity },
        { onConflict: ['session_id', 'product_id'], returning: 'representation' },
      )

    if (upsertError) {
      console.error('Upsert error:', upsertError)
    } else {
      console.log('Upsert success:', upsertData)
    }

    const { data: rows, error: selErr } = await supabase
      .from('cart_items')
      .select('id, session_id, product_id, quantity, created_at, updated_at')
      .eq('session_id', sessionId)

    if (selErr) {
      console.error('Select error:', selErr)
    } else {
      console.log('Select result:', rows)
    }
  } catch (e) {
    console.error('Unexpected error', e)
  }
}

run()
