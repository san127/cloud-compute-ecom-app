import { Link } from 'react-router-dom'

export default function CartPage({ cartItems, onUpdateQuantity, onRemoveItem }) {
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (cartItems.length === 0) {
    return (
      <section className="empty-state">
        <h2>Your cart is empty</h2>
        <p>Add a few bold picks and come back here for a quick checkout.</p>
        <Link to="/">Start shopping</Link>
      </section>
    )
  }

  return (
    <section className="cart-page">
      <div className="cart-list">
        {cartItems.map((item) => (
          <article key={item.id} className="cart-item">
            <img src={item.image} alt={item.name} />
            <div>
              <h3>{item.name}</h3>
              <p>${item.price}</p>
            </div>
            <div className="quantity-controls">
              <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>+</button>
            </div>
            <button className="remove-btn" onClick={() => onRemoveItem(item.id)}>
              Remove
            </button>
          </article>
        ))}
      </div>
      <aside className="checkout-card">
        <h3>Order summary</h3>
        <p>Total amount to pay</p>
        <h2>${total.toFixed(2)}</h2>
        <button className="checkout-btn">Checkout</button>
      </aside>
    </section>
  )
}
