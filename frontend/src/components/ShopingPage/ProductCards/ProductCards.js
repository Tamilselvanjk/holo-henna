import React, { useState, useEffect } from 'react'
import { ProductService } from '../../../services/productService'
import { useCart } from '../../../context/CartContext'
import { categories } from '../../../constants/categories'
import './ProductCards.css'
import { toast } from 'react-toastify'

const ProductCards = ({ category = null, searchTerm = '' }) => {
  const { addToCart, cartItems } = useCart()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const data = await ProductService.getAllProducts()
        setProducts(data)
        
        const response = await ProductService.getAllProducts()
        
        if (!response || (!response.products && !Array.isArray(response))) {
          throw new Error('Invalid response format')
        }

        const productsData = response.products || response || []
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
        setError(error.message)
        toast.error('Failed to load products')
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
    if (stock > 10) {
      return { 
        label: 'In Stock', 
        className: 'in-stock',
        icon: 'fa-check-circle'
      };
    }
    if (stock > 0) {
      return { 
        label: `Only ${stock} left`, 
        className: 'low-stock',
        icon: 'fa-exclamation-circle'
      };
    }
    return { 
      label: 'Out of Stock', 
      className: 'out-of-stock',
      icon: 'fa-times-circle'
    };
  }

  const renderStockStatus = (stock) => {
    const status = getStockStatus(stock);
    return (
      <span className={`stock-badge ${status.className}`}>
        <i className={`fas ${status.icon}`}></i>
        {status.label}
      </span>
    );
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

  const handleAddToCart = (product) => {
    if (product.stock <= 0) {
      toast.error('Product is out of stock')
      return
    }

    const currentStock = product.stock
    const cartQty = getCartQuantity(product._id) // Add this helper function

    if (cartQty >= currentStock) {
      toast.warning(`Only ${currentStock} items available`)
      return
    }

    addToCart(product)
    toast.success('Added to cart!')
  }

  const getCartQuantity = (productId) => {
    const existingItem = cartItems?.find(item => item._id === productId)
    return existingItem?.quantity || 0
  }

  const getStockDisplay = (product) => {
    const cartQty = getCartQuantity(product._id);
    const remainingStock = product.stock - cartQty;
    
    if (remainingStock <= 0) return 'Out of Stock';
    if (remainingStock <= 5) return `${remainingStock} left`;
    return 'In Stock';
  };

  const getAddToCartButtonText = (product) => {
    if (product.stock <= 0) {
      return (
        <>
          Out of Stock <i className="fas fa-ban"></i>
        </>
      );
    }
    return (
      <>
        Add to Cart <i className="fas fa-cart-plus"></i>
      </>
    );
  };

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
                  {renderStockStatus(product.stock)}
                </div>
                <button
                  className={`add-to-cart-btn ${
                    product.stock <= 0 ? 'out-of-stock' : ''
                  }`}
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock <= 0}
                >
                  {getAddToCartButtonText(product)}
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
