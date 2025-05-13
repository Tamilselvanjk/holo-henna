import React, { Suspense } from 'react'
import Footer from '../components/Home/Footer/Footer'
import HeroBanner from '../components/ShopingPage/HeroBanner/HeroBanner'
import ShopHeader from '../components/ShopingPage/ShopHeader/ShopHeader'
import Categories from '../components/ShopingPage/Categories/Categories'
import ProductCards from '../components/ShopingPage/ProductCards/ProductCards'
import Cart from '../components/ShopingPage/Cart/Cart'
import Toast from '../components/ShopingPage/Toast/Toast'
import { useShoppingCart } from '../components/hooks/useShoppingCart'
import { useAddress } from '../components/hooks/useAddress'
import './Shop.css'

const Shop = () => {
  const {
    carts = [],
    showCart,
    showToast,
    toastMessage,
    cartTotal,
    addToCart,
    updateQuantity,
    removeFromCart,
    toggleCart,
  } = useShoppingCart() || {}

  const { selectedAddress } = useAddress()

  const handleCartUpdate = (cartCount) => {
    // This will automatically update the header through useShoppingCart
    toggleCart()
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="shop-page">
        <main>
          <HeroBanner />
          <div className="container">
            <ShopHeader
              cartCount={
                carts?.reduce((sum, item) => sum + item.quantity, 0) || 0
              }
              onCartClick={toggleCart}
            />
            <Categories />
            <ProductCards
              onAddToCart={addToCart}
              onCartUpdate={handleCartUpdate}
            />
          </div>
          <Cart
            isOpen={showCart}
            onClose={toggleCart}
            items={carts || []}
            total={cartTotal || 0}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeFromCart}
            selectedAddress={selectedAddress}
          />
          {showToast && (
            <Toast
              show={showToast}
              message={toastMessage.message}
              title={toastMessage.title}
            />
          )}
        </main>
        <Footer />
      </div>
    </Suspense>
  )
}

export default Shop
