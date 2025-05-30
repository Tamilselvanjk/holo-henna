import React, { useState, useEffect } from 'react'
import { ProductService } from '../../../services/productService'
import { useCart } from '../../../context/CartContext'
import './ProductCards.css'

const ProductCards = ({ category = 'All Products', searchTerm = '' }) => {
  const { addToCart } = useCart()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating || 0)
    const hasHalfStar = rating % 1 !== 0
    const stars = []
    const starColor =
      rating >= 4
        ? '#FFD700'
        : rating >= 3
        ? '#FFA500'
        : rating >= 2
        ? '#FF8C00'
        : '#FF4500'

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <i
            key={i}
            className="fas fa-star filled"
            style={{ color: starColor }}
          />
        )
      } else {
        stars.push(
          <i key={i} className="far fa-star" style={{ color: '#FFD700' }} />
        )
      }
    }
    return stars
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await ProductService.getAllProducts(category)

        if (!response || !response.success) {
          throw new Error(response?.error || 'Failed to fetch products')
        }

        const productsData = response.products || []
        const mappedProducts = productsData.map((product) => ({
          _id: product._id || `temp-${Math.random()}`,
          name: product.name || 'Unnamed Product',
          price: Number(product.price) || 0,
          description: product.description || '',
          ratings: Number(product.ratings || product.rating || 0),
          numOfReviews: Number(product.numOfReviews || product.reviews || 0),
          images: Array.isArray(product.images) ? product.images : [],
          category: product.category || 'Uncategorized',
          stock: Number(product.stock || 0),
        }))

        setProducts(mappedProducts)
      } catch (error) {
        console.error('Fetch error:', error)
        setError('Failed to load products. Please try again later.')
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [category])

  const filteredProducts = products.filter((product) => {
    return (
      searchTerm === '' ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  const imagePaths = {
    Traditional: '/webimg/product1.jpg',
    'Bridal Henna': '/webimg/product2.webp',
    Modern: '/webimg/product3.png',
    Arabic: '/webimg/product4.webp',
    Floral: '/webimg/product5.jpg',
    'Custom Designs': '/webimg/product6.jpg',
  }

  const getFallbackImage = (category) => {
    return imagePaths[category] || '/webimg/product1.jpg'
  }

  return (
    <div className="products-section">
      {loading ? (
        <div className="loading">Loading products...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : filteredProducts.length === 0 ? (
        <div className="no-results">
          <p>No products found matching your search.</p>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <div key={product._id} className="product-card">
              <div className="product-image">
                <img
                  src={
                    product.images?.[0]?.image ||
                    getFallbackImage(product.category)
                  }
                  alt={product.name}
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = getFallbackImage(product.category)
                  }}
                />
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <div className="product-rating">
                  <div className="product-stars">
                    {renderStars(product.ratings)}
                  </div>
                  <span className="review-count">({product.numOfReviews})</span>
                </div>
                <div className="product-price">
                  <span className="price">${product.price.toFixed(2)}</span>
                </div>
                <button
                  className="add-to-cart-btn"
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductCards
