// FILEPATH: c:/Users/ernag/Music/holohenna/project/frontend/src/components/ShopingPage/Cart/Cart.js

import React, { useState } from 'react'
import { useCart } from '../../../context/CartContext'
import './Cart.css'
import DeliveryForm from '../DeliveryForm/DeliveryForm'
import PaymentForm from './../PaymentForm/PaymentForm'
import PaymentService from '../../../services/paymentService'
import { toast } from 'react-toastify'

const Cart = ({ isOpen, onClose }) => {
  const { cartItems, updateQuantity, getCartTotal, clearCart } = useCart()
  const [checkoutStep, setCheckoutStep] = useState('cart')
  const [deliveryData, setDeliveryData] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleDeliverySubmit = (data) => {
    setDeliveryData(data)
    setCheckoutStep('payment')
  }

  const handlePaymentComplete = async (paymentData) => {
    try {
      // Clear cart after successful payment
      clearCart()
      onClose()
      setCheckoutStep('cart')

      toast.success('Order placed successfully! Your cart has been cleared.')
    } catch (error) {
      console.error('Order error:', error)
      toast.error('Failed to complete order')
    }
  }

  const getStepTitle = (step) => {
    switch (step) {
      case 'cart':
        return 'Your Cart'
      case 'delivery':
        return 'Delivery Information'
      case 'payment':
        return 'Payment'
      default:
        return 'Your Cart'
    }
  }

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

  const handleQuantityUpdate = (item, newQuantity) => {
    if (newQuantity <= 0) {
      updateQuantity(item._id, 0) // Remove item
      return
    }

    // Check stock limit
    if (newQuantity > item.stock) {
      toast.warning(`Only ${item.stock} items available in stock`)
      return
    }

    updateQuantity(item._id, newQuantity)
  }

  const renderCartItems = () => (
    <div className="cart-items">
      {!cartItems?.length ? (
        <div className="empty-cart">Your cart is empty</div>
      ) : (
        cartItems.map((item) => (
          <div key={item._id} className="cart-item">
            <img
              src={item.images?.[0]?.image || getFallbackImage(item.category)}
              alt={item.name}
              className="cart-item-image"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = getFallbackImage(item.category)
              }}
            />
            <div className="cart-item-details">
              <h4>{item.name}</h4>
              <p className="cart-item-price">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
              <span className="stock-info">
                {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
              </span>
            </div>
            <div className="cart-item-quantity">
              <button
                className="quantity-btn"
                onClick={() => handleQuantityUpdate(item, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                className="quantity-btn"
                onClick={() => handleQuantityUpdate(item, item.quantity + 1)}
                disabled={item.quantity >= item.stock}
              >
                +
              </button>
            </div>
            <button
              className="remove-item"
              onClick={() => updateQuantity(item._id, 0)}
            >
              <i className="fas fa-trash"></i>
            </button>
          </div>
        ))
      )}
    </div>
  )

  const renderCartFooter = () => (
    <div className="cart-footer">
      <div className="cart-total">
        <span>Total:</span>
        <span>${getCartTotal()?.toFixed(2) || '0.00'}</span>
      </div>
      <button
        className="checkout-btn"
        disabled={cartItems.length === 0 || loading}
        onClick={() => setCheckoutStep('delivery')}
      >
        Continue to Delivery
      </button>
    </div>
  )

  return (
    <div className={`cart-overlay ${isOpen ? 'open' : ''}`}>
      <div className="cart-panel">
        <div className="cart-header">
          <h3 className="cart-title">{getStepTitle(checkoutStep)}</h3>
          <button className="close-cart" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        {checkoutStep === 'cart' && (
          <>
            {renderCartItems()}
            {renderCartFooter()}
          </>
        )}

        {checkoutStep === 'delivery' && (
          <DeliveryForm
            cartItems={cartItems}
            onBack={() => setCheckoutStep('cart')}
            onNext={handleDeliverySubmit}
          />
        )}

        {checkoutStep === 'payment' && (
          <PaymentForm
            total={getCartTotal()}
            cartItems={cartItems}
            shippingAddress={deliveryData.shippingAddress}
            onBack={() => setCheckoutStep('delivery')}
            onComplete={handlePaymentComplete}
          />
        )}
      </div>
    </div>
  )
}

export default Cart
