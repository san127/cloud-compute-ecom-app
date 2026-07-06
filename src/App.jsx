import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import { fetchProducts } from './lib/products'
import { fetchCartItems, removeCartItem, upsertCartItem } from './lib/cart'

function getSessionId() {
  let sessionId = window.localStorage.getItem('webcomm_session')
  if (!sessionId) {
    sessionId = crypto.randomUUID()
    window.localStorage.setItem('webcomm_session', sessionId)
  }
  return sessionId
}

function AppShell() {
  const [products, setProducts] = useState([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [cartItems, setCartItems] = useState([])
  const sessionId = useMemo(() => getSessionId(), [])

  useEffect(() => {
    fetchProducts().then((data) => setProducts(data))
    fetchCartItems(sessionId).then((items) => setCartItems(items))
  }, [sessionId])

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  )

  const syncCart = async (updatedItems) => {
    setCartItems(updatedItems)

    for (const item of updatedItems) {
      await upsertCartItem(sessionId, item.id, item.quantity)
    }
  }

  const addToCart = async (product) => {
    const existing = cartItems.find((item) => item.id === product.id)
    const updatedItems = existing
      ? cartItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      : [...cartItems, { ...product, quantity: 1 }]

    setCartItems(updatedItems)
    const res = await upsertCartItem(sessionId, product.id, existing ? existing.quantity + 1 : 1)
    if (!res) console.warn('Failed to upsert cart item for', product.id)
  }

  const updateQuantity = async (id, quantity) => {
    const updatedItems = quantity <= 0
      ? cartItems.filter((item) => item.id !== id)
      : cartItems.map((item) => (item.id === id ? { ...item, quantity } : item))

    setCartItems(updatedItems)
    if (quantity <= 0) {
      const res = await removeCartItem(sessionId, id)
      if (!res) console.warn('Failed to remove cart item', id)
    } else {
      const res = await upsertCartItem(sessionId, id, quantity)
      if (!res) console.warn('Failed to upsert quantity for', id)
    }
  }

  const removeItem = async (id) => {
    const updatedItems = cartItems.filter((item) => item.id !== id)
    setCartItems(updatedItems)
    const res = await removeCartItem(sessionId, id)
    if (!res) console.warn('Failed to remove cart item', id)
  }

  return (
    <Layout cartCount={cartCount}>
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              products={products}
              activeCategory={activeCategory}
              onChangeCategory={setActiveCategory}
            />
          }
        />
        <Route path="/product/:id" element={<ProductPage products={products} onAddToCart={addToCart} />} />
        <Route
          path="/cart"
          element={<CartPage cartItems={cartItems} onUpdateQuantity={updateQuantity} onRemoveItem={removeItem} />}
        />
      </Routes>
    </Layout>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}
