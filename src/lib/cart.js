import { supabase, isSupabaseConnected } from './supabase'

export async function fetchCartItems(sessionId) {
  if (!isSupabaseConnected()) return []

  const { data, error } = await supabase
    .from('cart_items')
    .select('id, quantity, product_id, products(name, price, image, category, description)')
    .eq('session_id', sessionId)

  if (error || !Array.isArray(data)) {
    console.error('fetchCartItems error', error)
    return []
  }

  return data.map((item) => ({
    id: String(item.product_id),
    cartItemId: item.id,
    quantity: item.quantity,
    name: item.products?.name ?? 'Product',
    price: Number(item.products?.price ?? 0),
    image: item.products?.image ?? '',
    category: item.products?.category ?? 'tech',
    description: item.products?.description ?? '',
  }))
}

export async function upsertCartItem(sessionId, productId, quantity) {
  if (!isSupabaseConnected()) return null

  const pid = Number(productId)
  if (Number.isNaN(pid)) return null

  if (quantity <= 0) {
    return removeCartItem(sessionId, pid)
  }

  // Upsert the row using the unique constraint on (session_id, product_id)
  const payload = {
    session_id: sessionId,
    product_id: pid,
    quantity,
  }

  const { data, error } = await supabase
    .from('cart_items')
    .upsert(payload, { onConflict: ['session_id', 'product_id'] })
    .select()

  if (error) {
    console.error('upsertCartItem error', error)
    return null
  }

  return data
}

export async function removeCartItem(sessionId, productId) {
  if (!isSupabaseConnected()) return null

  const pid = Number(productId)
  if (Number.isNaN(pid)) return null

  const { data, error } = await supabase
    .from('cart_items')
    .delete()
    .eq('session_id', sessionId)
    .eq('product_id', pid)

  if (error) {
    console.error('removeCartItem error', error)
    return null
  }

  return data
}
