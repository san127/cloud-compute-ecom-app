import { Link } from 'react-router-dom'
import { formatRupee } from '../lib/price'

const categories = ['tech', 'lifestyle', 'home', 'food']

export default function HomePage({ products, activeCategory, onChangeCategory }) {
  const visibleProducts = products.filter((product) => {
    if (!activeCategory || activeCategory === 'all') return true
    return product.category === activeCategory
  })

  return (
    <section className="home-page">
      <div className="hero-card">
        <div>
          <p className="eyebrow">New season essentials</p>
          <h2>Curated goods with a sharp yellow glow.</h2>
          <p>
            Discover ten standout products across tech, lifestyle, home, and food.
          </p>
        </div>
        <div className="hero-badge">Free shipping over ₹1000</div>
      </div>

      <div className="filters">
        <button className={activeCategory === 'all' ? 'chip active' : 'chip'} onClick={() => onChangeCategory('all')}>
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            className={activeCategory === category ? 'chip active' : 'chip'}
            onClick={() => onChangeCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="product-grid">
        {visibleProducts.map((product) => (
          <article key={product.id} className="product-card">
            <img src={product.image} alt={product.name} />
            <div className="product-card-body">
              <p className="category-pill">{product.category}</p>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <div className="product-card-footer">
                <strong>{formatRupee(product.price)}</strong>
                <Link to={`/product/${product.id}`}>View details</Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
