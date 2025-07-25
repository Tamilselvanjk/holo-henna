import React, { useEffect, useState } from 'react'
import { useCart } from '../../../context/CartContext'
import AddressSelector from '../AddressSelector/AddressSelector'
import './ShopHeader.css'

const ShopHeader = ({ onCartClick, onSearch }) => {
  const { cartItems } = useCart()
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)
  const [isSticky, setIsSticky] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Make header sticky when scrolling down past 100px
      if (currentScrollY > 100) {
        setIsSticky(true)
      } else {
        setIsSticky(false)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase()
    if (typeof onSearch === 'function') {
      onSearch(searchTerm)
    }
  }

  return (
    <div className={`header ${isSticky ? 'sticky' : ''}`}>
      <div className="shop-container">
        <div className="header-actions">
          <AddressSelector />

          <div className="search-wrapper">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search products..."
              aria-label="Search products"
              onChange={handleSearch}
            />
          </div>

          <button className="cart-button  mobile-bottom-row " onClick={onCartClick}>
            <i className="fas fa-shopping-cart"></i>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ShopHeader
