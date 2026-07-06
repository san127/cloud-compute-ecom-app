import { Link, useParams } from 'react-router-dom'

export default function ProductPage({ products, onAddToCart }) {
  const { id } = useParams()
  const product = products.find((item) => item.id === id)

  if (!product) {
    return (
      <section className="empty-state">
        <h2>Product not found</h2>
        <Link to="/">Back to shop</Link>
      </section>
    )
  }

  return (
    <section className="product-page">
      <Link className="back-link" to="/">
        ← Back to collection
      </Link>
      <div className="product-detail-card">
        <img src={product.image} alt={product.name} />
        <div>
          <p className="category-pill">{product.category}</p>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <div className="price-row">
            <strong>${product.price}</strong>
            <button onClick={() => onAddToCart(product)}>Add to cart</button>
          </div>
        </div>
      </div>
    </section>
  )
}
