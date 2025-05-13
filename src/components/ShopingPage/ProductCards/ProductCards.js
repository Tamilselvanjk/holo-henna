import React, { useState, useEffect } from 'react'
import { useCart } from '../../../context/CartContext'
import { toast } from 'react-toastify'
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaShoppingCart,
} from 'react-icons/fa'
import './ProductCards.css'

const ProductCards = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { addToCart, cartItems } = useCart()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${process.env.PUBLIC_URL}/data/products.json`
        )
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format')
        }
        setProducts(data)
      } catch (error) {
        setError(error.message)
        toast.error(`Failed to load products: ${error.message}`)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleAddToCart = (product) => {
    addToCart(product)
    toast.success(`${product.name} added to cart`)
  }

  const isProductInCart = (productId) => {
    return cartItems.some((item) => item._id === productId)
  }

  const renderStarRating = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="star filled" />)
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="star half-filled" />)
      } else {
        stars.push(<FaRegStar key={i} className="star" />)
      }
    }

    return stars
  }

  if (loading) {
    return <div className="loading-spinner">Loading products...</div>
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>
  }

  if (!products.length) {
    return <div className="no-products">No products available</div>
  }

  return (
    <div className="products-grid">
      {products.map((product) => (
        <div key={product._id} className="product-card">
          <div className="product-image">
            <img
              src={process.env.PUBLIC_URL + product.image}
              alt={product.name}
            />
          </div>
          <div className="product-info">
            <h3>{product.name}</h3>
            <div className="product-rating">
              <div className="stars-container">
                {renderStarRating(product.rating)}
              </div>
              <span className="rating-text">
                <span className="rating-number">{product.rating}</span>
                <span className="review-count">({product.reviews})</span>
              </span>
            </div>
            <p className="product-description">{product.description}</p>
            <div className="product-price">
              <span className="price">₹{product.price}</span>
            </div>
            <button
              className={`add-to-cart-btn ${
                isProductInCart(product._id) ? 'added' : ''
              }`}
              onClick={() => handleAddToCart(product)}
              disabled={isProductInCart(product._id)}
            >
              {isProductInCart(product._id) ? 'Added to Cart' : 'Add to Cart'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ProductCards
