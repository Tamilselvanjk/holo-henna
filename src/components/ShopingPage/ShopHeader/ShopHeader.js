import React, { useMemo } from 'react'
import { useCart } from '../../../context/CartContext'
import { useShop } from '../../../context/ShopContext'
import AddressSelector from '../Address/AddressSelector'
import { FaSearch, FaShoppingCart } from 'react-icons/fa'
import './ShopHeader.css'

const ShopHeader = ({ onCartClick }) => {
  const { searchTerm, setSearchTerm } = useShop()
  const { cartCount } = useCart()

  const formattedCartCount = useMemo(() => {
    return cartCount > 99 ? '99+' : cartCount
  }, [cartCount])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const clearSearch = () => {
    setSearchTerm('')
  }

  return (
    <div className="header">
      <div className="container">
        <div className="header-actions">
          <AddressSelector />

          <div className="search-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search products..."
              aria-label="Search products"
              className="search-input"
            />
            {searchTerm && (
              <button
                className="clear-search"
                onClick={clearSearch}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          <button
            className={`cart-button ${cartCount > 0 ? 'has-items' : ''}`}
            onClick={onCartClick}
          >
            <FaShoppingCart />
            <span className="cart-text">Cart</span>
            {cartCount > 0 && (
              <span className="cart-badge" data-count={formattedCartCount}>
                {formattedCartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ShopHeader
