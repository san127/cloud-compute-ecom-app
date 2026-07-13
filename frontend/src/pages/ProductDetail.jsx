import { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingCart, CreditCard } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const PRODUCT_SERVICE_URL = import.meta.env.VITE_PRODUCT_SERVICE_URL || 'http://localhost:5001';

const ProductDetail = ({ productId, onBack, onAddToCart, onBuyNow }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!productId) return;
    
    setLoading(true);
    fetch(`${PRODUCT_SERVICE_URL}/api/products/${productId}`)
      .then(res => {
        if (!res.ok) throw new Error('Product not found');
        return res.json();
      })
      .then(data => {
        setProduct(data);
        setError('');
      })
      .catch(err => {
        console.error('Error fetching product detail:', err);
        setError('Unable to load product details.');
      })
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '10rem 0' }}>
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="detail-container">
        <button onClick={onBack} className="back-link">
          <ArrowLeft size={16} /> Back to Catalog
        </button>
        <div className="glass-pane empty-state">
          <div className="empty-state-title">Error</div>
          <div className="empty-state-subtitle">{error || 'Product could not be loaded.'}</div>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="detail-container">
      <button onClick={onBack} className="back-link">
        <ArrowLeft size={16} /> Back to Catalog
      </button>

      <div className="glass-pane detail-grid" style={{ padding: '2.5rem' }}>
        <div className="detail-image-pane">
          <img
            src={product.image_url}
            alt={product.name}
            className="detail-img"
          />
        </div>

        <div className="detail-info">
          <span className="product-cat">{product.categories?.name || 'Catalog Item'}</span>
          <h1 className="detail-name">{product.name}</h1>
          <div className="detail-price">₹{Number(product.price_in_rupees).toLocaleString('en-IN')}</div>
          
          <p className="detail-desc">{product.description}</p>

          <div className="detail-meta">
            <div className="meta-row">
              <span className="meta-label">Stock Status</span>
              <span className={`stock-pill ${isOutOfStock ? 'stock-out' : 'stock-in'}`}>
                {isOutOfStock ? 'Out of Stock' : `In Stock (${product.stock} units)`}
              </span>
            </div>
            <div className="meta-row" style={{ marginTop: '0.8rem' }}>
              <span className="meta-label">Delivery Estimate</span>
              <span className="meta-value">2 - 4 Business Days</span>
            </div>
          </div>

          <div className="detail-actions">
            <button
              onClick={() => onAddToCart(product)}
              disabled={isOutOfStock}
              className="btn-secondary"
            >
              <ShoppingCart size={18} /> Add to Cart
            </button>
            <button
              onClick={() => onBuyNow(product)}
              disabled={isOutOfStock}
              className="btn-primary"
            >
              <CreditCard size={18} /> Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
