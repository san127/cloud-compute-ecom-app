import { Plus, Minus, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';

const Cart = ({ cart, onUpdateQuantity, onRemoveFromCart, onBackToCatalog, onProceedToCheckout }) => {
  const isCartEmpty = cart.length === 0;

  const subtotal = cart.reduce((acc, item) => acc + (item.price_in_rupees * item.quantity), 0);
  const shipping = subtotal > 5000 || subtotal === 0 ? 0 : 150;
  const total = subtotal + shipping;

  return (
    <div className="cart-container">
      <button onClick={onBackToCatalog} className="back-link">
        <ArrowLeft size={16} /> Continue Shopping
      </button>

      <h1 className="cart-title">Your Premium Cart</h1>

      {isCartEmpty ? (
        <div className="glass-pane empty-state">
          <div className="empty-state-title">Your cart is empty</div>
          <div className="empty-state-subtitle">Explore our collections and add something special!</div>
          <button onClick={onBackToCatalog} className="btn-primary" style={{ maxWidth: '250px', margin: '0 auto' }}>
            Go Shopping
          </button>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="glass-pane cart-items-pane">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="cart-item-image"
                />
                
                <div className="cart-item-info">
                  <h3 className="cart-item-name">{item.name}</h3>
                  <div className="cart-item-price">₹{Number(item.price_in_rupees).toLocaleString('en-IN')}</div>
                </div>

                <div className="cart-item-qty">
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    className="qty-btn"
                    title="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="qty-val">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    className="qty-btn"
                    title="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => onRemoveFromCart(item.id)}
                  className="btn-remove"
                  title="Remove item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="glass-pane summary-pane">
            <h2 className="summary-title">Order Summary</h2>
            
            <div className="summary-row">
              <span>Items Total</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            
            <div className="summary-row">
              <span>Shipping Fee</span>
              <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
            </div>
            
            {shipping > 0 && (
              <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', textAlign: 'right', marginTop: '-0.5rem', marginBottom: '1rem' }}>
                Add ₹{(5000 - subtotal).toLocaleString('en-IN')} more for FREE shipping!
              </div>
            )}

            <div className="summary-row total">
              <span>Total Amount</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>

            <button
              onClick={onProceedToCheckout}
              className="btn-primary btn-checkout"
            >
              Proceed to Checkout <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
