import { createClient } from '@supabase/supabase-js'

const fallbackProducts = [
  {
    id: '1',
    name: 'Nova Headphones',
    title: 'Nova Headphones',
    price: 129,
    description: 'Immersive sound with deep bass and all-day comfort.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
    category: 'tech',
  },
  {
    id: '2',
    name: 'Glow Desk Lamp',
    title: 'Glow Desk Lamp',
    price: 79,
    description: 'A warm, adjustable lamp for focused evenings and cozy corners.',
    image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=900&q=80',
    category: 'home',
  },
  {
    id: '3',
    name: 'Canvas Tote',
    title: 'Canvas Tote',
    price: 49,
    description: 'Stylish everyday carry for books, errands, and weekend plans.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
    category: 'lifestyle',
  },
  {
    id: '4',
    name: 'Saffron Spice Box',
    title: 'Saffron Spice Box',
    price: 34,
    description: 'A chef-inspired blend box that brightens every dinner table.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80',
    category: 'food',
  },
  {
    id: '5',
    name: 'Pulse Smart Watch',
    title: 'Pulse Smart Watch',
    price: 189,
    description: 'Track workouts, sleep, and notifications in a sleek frame.',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=900&q=80',
    category: 'tech',
  },
  {
    id: '6',
    name: 'Velvet Throw Blanket',
    title: 'Velvet Throw Blanket',
    price: 59,
    description: 'Cloud-soft comfort for movie nights and weekend lounging.',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
    category: 'home',
  },
  {
    id: '7',
    name: 'Metro Sneakers',
    title: 'Metro Sneakers',
    price: 89,
    description: 'Lightweight sneakers built for city strolls and late coffee runs.',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=80',
    category: 'lifestyle',
  },
  {
    id: '8',
    name: 'Golden Honey Jar',
    title: 'Golden Honey Jar',
    price: 24,
    description: 'Small-batch honey with floral notes for tea, toast, and baking.',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=900&q=80',
    category: 'food',
  },
  {
    id: '9',
    name: 'Arc Laptop Stand',
    title: 'Arc Laptop Stand',
    price: 69,
    description: 'Elevate your setup with a compact stand that improves comfort.',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80',
    category: 'tech',
  },
  {
    id: '10',
    name: 'Mosaic Ceramic Mug',
    title: 'Mosaic Ceramic Mug',
    price: 19,
    description: 'A bold daily mug in a hand-finished glaze for your morning ritual.',
    image: 'https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=900&q=80',
    category: 'home',
  },
]

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabase =
  supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('https://')
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null

export async function fetchProducts() {
  if (supabase) {
    const { data, error } = await supabase.from('products').select('*').order('id')

    if (!error && Array.isArray(data) && data.length > 0) {
      return data.map(normalizeProduct)
    }
  }

  return fallbackProducts
}

function normalizeProduct(product) {
  return {
    id: String(product.id ?? product.slug ?? product.name),
    name: product.name ?? product.title ?? 'Product',
    title: product.title ?? product.name ?? 'Product',
    price: Number(product.price ?? 0),
    description: product.description ?? 'A premium pick from the collection.',
    image: product.image ?? product.img ?? '',
    category: String(product.category ?? 'tech').toLowerCase(),
  }
}
