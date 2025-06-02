import React, { useState, useEffect } from 'react'
import { ProductService } from '../../../services/productService'
import { useCart } from '../../../context/CartContext'
import { categories } from '../../../constants/categories'
import './ProductCards.css'

const ProductCards = ({ category = null, searchTerm = '' }) => {
  const { addToCart } = useCart()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)

        // Always fetch all products initially
        const response = await ProductService.getAllProducts()

        if (!response || !response.success) {
          throw new Error(response?.error || 'Failed to fetch products')
        }

        const productsData = response.products || []
        const mappedProducts = productsData.map((product) => ({
          _id: product._id || `temp-${Math.random()}`,
          name: product.name || 'Unnamed Product',
          price: Number(product.price) || 0,
          description: product.description || '',
          ratings: Number(product.ratings || 0),
          numOfReviews: Number(product.numOfReviews || 0),
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
  }, []) // Remove category dependency

  const getCategoryDisplay = (categoryValue) => {
    const category = categories.find((cat) => cat.value === categoryValue)
    return category ? category.name : categoryValue
  }

  // Filter products client-side
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      !category || category === 'All Products' || product.category === category
    const matchesSearch =
      !searchTerm ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesCategory && matchesSearch
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

  const getStockStatus = (stock) => {
    if (stock > 10) return { label: 'In Stock', className: 'in-stock' }
    if (stock > 0) return { label: 'Low Stock', className: 'low-stock' }
    return { label: 'Out of Stock', className: 'out-of-stock' }
  }

  const renderRatingStars = (rating) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

    return (
      <>
        {/* Full stars */}
        {[...Array(fullStars)].map((_, i) => (
          <i
            key={`full-${i}`}
            className="fas fa-star"
            style={{ color: '#FFD700' }}
          />
        ))}

        {/* Half star */}
        {hasHalfStar && (
          <i className="fas fa-star-half-alt" style={{ color: '#FFD700' }} />
        )}

        {/* Empty stars */}
        {[...Array(emptyStars)].map((_, i) => (
          <i
            key={`empty-${i}`}
            className="far fa-star"
            style={{ color: '#E0E0E0' }}
          />
        ))}
      </>
    )
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
                <div className="product-category">
                  {getCategoryDisplay(product.category)}
                </div>
                <div className="product-rating">
                  <div className="product-stars">
                    {renderRatingStars(product.ratings)}
                  </div>
                  <span className="review-count">({product.numOfReviews})</span>
                </div>
                <div className="product-price">
                  <span className="price">${product.price.toFixed(2)}</span>
                </div>
                <div className="stock-status">
                  <span className={getStockStatus(product.stock).className}>
                    {getStockStatus(product.stock).label}
                  </span>
                </div>
                <button
                  className={`add-to-cart-btn ${
                    product.stock <= 0 ? 'out-of-stock' : ''
                  }`}
                  onClick={() => addToCart(product)}
                  disabled={product.stock <= 0}
                >
                  {product.stock > 0 ? (
                    <>
                      Add to Cart <i className="fas fa-cart-plus"></i>
                    </>
                  ) : (
                    <>
                      Out of Stock <i className="fas fa-ban"></i>
                    </>
                  )}
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
