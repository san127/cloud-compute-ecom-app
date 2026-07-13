import { useState, useEffect } from 'react';
import ClickSpark from './components/ClickSpark';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import { ShoppingBag, Sparkles, CheckCircle2, Home } from 'lucide-react';

function App() {
  const [currentPage, setCurrentPage] = useState('list');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [cart, setCart] = useState([]);
  const [placedOrderId, setPlacedOrderId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const notify = (msg) => {
    setToastMessage(msg);
  };

  const handleAddToCart = (product) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        notify(`Increased ${product.name} quantity in cart!`);
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      notify(`Added ${product.name} to cart!`);
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const handleBuyNow = (product) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    setCurrentPage('checkout');
  };

  const handleUpdateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
    notify('Cart quantity updated.');
  };

  const handleRemoveFromCart = (productId) => {
    const item = cart.find(i => i.id === productId);
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
    if (item) {
      notify(`Removed ${item.name} from cart.`);
    }
  };

  const handleOrderSuccess = (orderId) => {
    setPlacedOrderId(orderId);
    setCart([]);
    setCurrentPage('success');
  };

  const cartBadgeCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <ClickSpark
      sparkColor="#00f2fe"
      sparkSize={12}
      sparkRadius={25}
      sparkCount={10}
      duration={400}
      extraScale={1.3}
    >
      {toastMessage && (
        <div className="toast-msg">
          <Sparkles size={16} style={{ color: 'var(--accent-cyan)' }} />
          <span>{toastMessage}</span>
        </div>
      )}

      <nav className="navbar">
        <div className="nav-brand" onClick={() => { setCurrentPage('list'); setSelectedProductId(null); }}>
          Goods4you
        </div>
        <div className="nav-links">
          <span
            className={`nav-link ${currentPage === 'list' || currentPage === 'detail' ? 'active' : ''}`}
            onClick={() => { setCurrentPage('list'); setSelectedProductId(null); }}
          >
            Catalog
          </span>
          <span
            className={`nav-link ${currentPage === 'cart' ? 'active' : ''}`}
            onClick={() => setCurrentPage('cart')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', position: 'relative' }}
          >
            <ShoppingBag size={18} />
            Cart
            {cartBadgeCount > 0 && (
              <span style={{
                background: 'var(--pink-gradient)',
                color: '#fff',
                fontSize: '0.7rem',
                fontWeight: '700',
                padding: '0.1rem 0.4rem',
                borderRadius: '10px',
                minWidth: '18px',
                textAlign: 'center',
                boxShadow: '0 0 10px rgba(248, 87, 166, 0.4)'
              }}>
                {cartBadgeCount}
              </span>
            )}
          </span>
        </div>
      </nav>

      <main style={{ flex: 1 }}>
        {currentPage === 'list' && (
          <ProductList
            onSelectProduct={(id) => {
              setSelectedProductId(id);
              setCurrentPage('detail');
            }}
            onAddToCart={handleAddToCart}
          />
        )}

        {currentPage === 'detail' && (
          <ProductDetail
            productId={selectedProductId}
            onBack={() => setCurrentPage('list')}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
          />
        )}

        {currentPage === 'cart' && (
          <Cart
            cart={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveFromCart={handleRemoveFromCart}
            onBackToCatalog={() => setCurrentPage('list')}
            onProceedToCheckout={() => setCurrentPage('checkout')}
          />
        )}

        {currentPage === 'checkout' && (
          <Checkout
            cart={cart}
            onOrderSuccess={handleOrderSuccess}
            onBackToCart={() => setCurrentPage('cart')}
          />
        )}

        {currentPage === 'success' && (
          <div className="cart-container" style={{ maxWidth: '600px', textAlign: 'center', marginTop: '4rem' }}>
            <div className="glass-pane" style={{ padding: '3.5rem 2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <CheckCircle2 size={70} style={{ color: 'var(--accent-cyan)', filter: 'drop-shadow(0 0 15px rgba(0, 242, 254, 0.4))' }} />
              </div>
              <h1 className="cart-title" style={{ marginBottom: '1rem', color: '#fff' }}>Order Completed!</h1>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '1.05rem', lineHeight: '1.6' }}>
                Thank you for shopping with Goods4you. Your order has been placed successfully and is currently being processed.
              </p>
              <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--glass-border)',
                borderRadius: '12px',
                padding: '1rem',
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                color: 'var(--accent-cyan)',
                marginBottom: '2.5rem'
              }}>
                Receipt ID: {placedOrderId}
              </div>
              <button
                onClick={() => setCurrentPage('list')}
                className="btn-primary"
                style={{ width: '100%', maxWidth: '280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                <Home size={18} /> Return to Home Catalog
              </button>
            </div>
          </div>
        )}
      </main>

      <footer style={{
        textAlign: 'center',
        padding: '2.5rem 0',
        marginTop: 'auto',
        color: 'var(--text-secondary)',
        fontSize: '0.9rem',
        borderTop: '1px solid var(--glass-border)',
        background: 'rgba(11, 15, 25, 0.4)'
      }}>
        <p>&copy; {new Date().getFullYear()} Goods4you Inc. Styled in premium Liquid Glass.</p>
        <p style={{ fontSize: '0.75rem', marginTop: '0.3rem', color: 'rgba(255,255,255,0.15)' }}>Powered by Node, Express, React, and Supabase Database.</p>
      </footer>
    </ClickSpark>
  );
}

export default App;
