import { useState } from 'react';
import Stepper, { Step } from '../components/Stepper';
import confetti from 'canvas-confetti';
import { ArrowLeft, CreditCard } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const ORDER_SERVICE_URL = import.meta.env.VITE_ORDER_SERVICE_URL || 'http://localhost:5002';

const Checkout = ({ cart, onOrderSuccess, onBackToCart }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  const subtotal = cart.reduce((acc, item) => acc + (item.price_in_rupees * item.quantity), 0);
  const shipping = subtotal > 5000 ? 0 : 150;
  const totalAmount = subtotal + shipping;

  const handlePlaceOrder = async () => {
    if (!name || !email || !address) {
      setCheckoutError('Please fill out all contact and shipping details.');
      return;
    }
    if (!cardNumber || !cardExpiry || !cardCvv) {
      setCheckoutError('Please provide valid payment card details.');
      return;
    }

    setIsSubmitting(true);
    setCheckoutError('');

    try {
      const orderPayload = {
        customerName: name,
        customerEmail: email,
        totalAmount: totalAmount,
        cartItems: cart.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price_in_rupees,
          quantity: item.quantity
        }))
      };

      const response = await fetch(`${ORDER_SERVICE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Server error placing order');
      }

      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#00f2fe', '#4facfe', '#f857a6', '#ffffff']
      });

      onOrderSuccess(result.orderId);
    } catch (err) {
      console.error('Order submission error:', err);
      setCheckoutError(err.message || 'Failed to place your order. Please check backend connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '10rem 0' }}>
        <div className="loader-card">
          <LoadingSpinner size="55" />
          <span style={{ marginTop: '1rem', color: '#fff' }}>Securing payment and creating invoice...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-wrapper">
      <button onClick={onBackToCart} className="back-link">
        <ArrowLeft size={16} /> Edit Cart
      </button>

      <h1 className="cart-title" style={{ textAlign: 'center' }}>Secure Checkout</h1>

      {checkoutError && (
        <div className="glass-pane" style={{ padding: '1rem', marginBottom: '1.5rem', borderColor: 'var(--accent-pink)', background: 'rgba(248, 87, 166, 0.15)', color: '#fff' }}>
          {checkoutError}
        </div>
      )}

      <Stepper
        initialStep={1}
        onStepChange={(step) => {
          console.log("Stepper shifted to step: " + step);
        }}
        onFinalStepCompleted={handlePlaceOrder}
        backButtonText="Go Back"
        nextButtonText="Continue"
      >
        <Step>
          <h2>1. Contact & Shipping Details</h2>
          <p>Provide your delivery information so we can package and ship your premium goods.</p>
          
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Aditi Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="e.g. aditi@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Delivery Address</label>
            <textarea
              className="form-input"
              rows="3"
              placeholder="Enter full physical home or work address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{ resize: 'none', fontFamily: 'inherit' }}
              required
            />
          </div>
        </Step>

        <Step>
          <h2>2. Review Order Items</h2>
          <img
            style={{ height: '100px', width: '100%', objectFit: 'cover', objectPosition: 'center -70px', borderRadius: '15px', marginTop: '0.5em', marginBottom: '1.5em' }}
            src="https://www.purrfectcatgifts.co.uk/cdn/shop/collections/Funny_Cat_Cards_640x640.png?v=1663150894"
            alt="Funny Cat Review"
          />
          <p>Review the products you are about to buy:</p>
          
          <div style={{ maxHeight: '180px', overflowY: 'auto', marginBottom: '1.5rem', border: '1px solid var(--glass-border)', borderRadius: '10px', padding: '0.8rem' }}>
            {cart.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: '0.9rem' }}>{item.name} <strong>x{item.quantity}</strong></span>
                <span style={{ fontWeight: '600' }}>₹{(item.price_in_rupees * item.quantity).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', fontSize: '1.1rem', fontWeight: '700', borderTop: '1px solid var(--glass-border)' }}>
            <span>Final Total:</span>
            <span style={{ color: 'var(--accent-cyan)' }}>₹{totalAmount.toLocaleString('en-IN')}</span>
          </div>
        </Step>

        <Step>
          <h2>3. Secure Credit Card Payment</h2>
          <p>Payments are simulated safely. Enter card details below.</p>

          <div className="payment-card-visual">
            <div className="card-type">Goods4you premium</div>
            <div className="card-number">
              {cardNumber ? cardNumber.replace(/(\d{4})/g, '$1 ').trim() : '•••• •••• •••• ••••'}
            </div>
            <div className="card-meta-row">
              <div className="card-holder">
                <span>Cardholder</span>
                <span>{name || 'YOUR NAME'}</span>
              </div>
              <div className="card-expiry">
                <span>Expires</span>
                <span>{cardExpiry || 'MM/YY'}</span>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Card Number</label>
            <input
              type="text"
              maxLength="16"
              className="form-input"
              placeholder="1234567812345678"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
            />
          </div>

          <div className="payment-grid">
            <div className="form-group">
              <label className="form-label">Expiry Date</label>
              <input
                type="text"
                maxLength="5"
                className="form-input"
                placeholder="MM/YY"
                value={cardExpiry}
                onChange={(e) => setCardExpiry(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">CVV</label>
              <input
                type="password"
                maxLength="3"
                className="form-input"
                placeholder="•••"
                value={cardCvv}
                onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
              />
            </div>
          </div>
        </Step>

        <Step>
          <h2>4. Final Review & Place Order</h2>
          <p>Everything is set! Review details below and click "Place Order" to finalize your purchase.</p>
          
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)', marginBottom: '1.5rem', textAlign: 'left' }}>
            <div style={{ marginBottom: '0.6rem' }}><strong>Shipping to:</strong> {name}</div>
            <div style={{ marginBottom: '0.6rem' }}><strong>Email notification to:</strong> {email}</div>
            <div style={{ marginBottom: '0.6rem' }}><strong>Address:</strong> {address}</div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.6rem' }}>
              <strong>Total Invoice Amount:</strong> <span style={{ color: 'var(--accent-cyan)', fontWeight: '700' }}>₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </Step>
      </Stepper>
    </div>
  );
};

export default Checkout;
