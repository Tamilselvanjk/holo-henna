import React, { useState, useEffect } from 'react'
import Footer from '../components/Home/Footer/Footer'
import HeroBanner from '../components/ShopingPage/HeroBanner/HeroBanner'
import ShopHeader from '../components/ShopingPage/ShopHeader/ShopHeader'
import Categories from '../components/ShopingPage/Categories/Categories'
import ProductCards from '../components/ShopingPage/ProductCards/ProductCards'
import Cart from '../components/ShopingPage/Cart/Cart'
import Toast from '../components/ShopingPage/Toast/Toast'
import './Shop.css'
import Header from '../components/Home/Header/Header'

const Shop = () => {
  const [cartItems, setCartItems] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [currentCategory, setCurrentCategory] = useState('All Products')
  const [cartTotal, setCartTotal] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )
    setCartTotal(total)
  }, [cartItems])

  const handleAddToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id)
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prevItems, { ...product, quantity: 1 }]
    })
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.id !== productId)
      )
    } else {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      )
    }
  }

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  return (
    <div className="shop-page">
      <ShopHeader
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
        onSearch={handleSearch}
      />
      <HeroBanner />
      <Categories onCategoryChange={setCurrentCategory} />
      <ProductCards
        category={currentCategory}
        onAddToCart={handleAddToCart}
        searchTerm={searchTerm}
      />
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        total={cartTotal}
        onUpdateQuantity={handleUpdateQuantity}
      />
      <Toast
        show={showToast}
        message="Item added to cart!"
        onClose={() => setShowToast(false)}
      />
      <Footer />
    </div>
  )
}

export default Shop
