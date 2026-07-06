import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import { fetchProducts } from './lib/products'

function AppShell() {
  const [products, setProducts] = useState([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [cartItems, setCartItems] = useState([])

  useEffect(() => {
    fetchProducts().then((data) => setProducts(data))
  }, [])

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  )

  const addToCart = (product) => {
    setCartItems((current) => {
      const existing = current.find((item) => item.id === product.id)
      if (existing) {
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }
      return [...current, { ...product, quantity: 1 }]
    })
  }

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }

    setCartItems((current) =>
      current.map((item) => (item.id === id ? { ...item, quantity } : item)),
    )
  }

  const removeItem = (id) => {
    setCartItems((current) => current.filter((item) => item.id !== id))
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
