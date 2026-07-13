import { useState, useEffect } from 'react';
import { Search, ShoppingCart } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const PRODUCT_SERVICE_URL = import.meta.env.VITE_PRODUCT_SERVICE_URL || 'http://localhost:5001';

const ProductList = ({ onSelectProduct, onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${PRODUCT_SERVICE_URL}/api/products/categories`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch categories');
        return res.json();
      })
      .then(data => setCategories(data))
      .catch(err => console.error('Error fetching categories:', err));
  }, []);

  useEffect(() => {
    setLoading(true);
    let url = `${PRODUCT_SERVICE_URL}/api/products`;
    const params = [];
    if (selectedCategory) params.push(`category=${selectedCategory}`);
    if (searchQuery) params.push(`search=${encodeURIComponent(searchQuery)}`);
    
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      })
      .then(data => {
        setProducts(data);
        setError('');
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setError('Could not load products. Please ensure the Product Service is running.');
      })
      .finally(() => setLoading(false));
  }, [selectedCategory, searchQuery]);

  return (
    <div className="home-container">
      <div className="search-wrapper">
        <Search className="search-icon" size={20} />
        <input
          type="text"
          placeholder="Search products in Goods4you catalog..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="category-tabs">
        <button
          className={`category-tab ${selectedCategory === '' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('')}
        >
          All Premium
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`category-tab ${selectedCategory === cat.slug ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.slug)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem 0' }}>
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="glass-pane empty-state">
          <div className="empty-state-title">Connection Status</div>
          <div className="empty-state-subtitle">{error}</div>
        </div>
      ) : products.length === 0 ? (
        <div className="glass-pane empty-state">
          <div className="empty-state-title">No products found</div>
          <div className="empty-state-subtitle">Try adjusting your search criteria or selecting another category.</div>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <div
              key={product.id}
              className="glass-pane product-card"
              onClick={() => onSelectProduct(product.id)}
            >
              <div className="product-image-container">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="product-img"
                  loading="lazy"
                />
              </div>
              <div className="product-cat">
                {categories.find(c => c.id === product.category_id)?.name || 'Catalog Item'}
              </div>
              <h3 className="product-title">{product.name}</h3>
              <p className="product-desc-short">{product.description}</p>
              <div className="product-footer">
                <div className="product-price">₹{Number(product.price_in_rupees).toLocaleString('en-IN')}</div>
                <button
                  className="btn-add-cart-icon"
                  title="Add to Cart"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(product);
                  }}
                >
                  <ShoppingCart size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
