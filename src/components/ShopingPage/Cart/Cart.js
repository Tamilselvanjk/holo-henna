import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faShoppingBag,
  faTimes,
  faShoppingCart,
  faMinus,
  faPlus,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons'
import { API_BASE_URL } from '../../../config/api.config'
import './Cart.css'

const Cart = ({
  isOpen,
  onClose,
  items,
  total,
  onUpdateQuantity,
  onRemoveItem,
  selectedAddress,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const formatPrice = (price) => `$${price.toFixed(2)}`

  const handleQuantityChange = (item, newQuantity) => {
    // Prevent negative quantities
    if (newQuantity >= 0) {
      onUpdateQuantity(item.id, newQuantity)
    }
  }

  const calculateItemTotal = (item) => item.price * item.quantity

  const getTotalItems = () =>
    items.reduce((sum, item) => sum + item.quantity, 0)

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  const placeOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address')
      return
    }

    setIsLoading(true)
    try {
      const response = await axios.post(`${API_BASE_URL}/api/orders/create`, {
        items,
        total,
        address: selectedAddress,
      })

      if (response.status === 201) {
        toast.success('Order placed successfully!')
        onClose()
        navigate('/profile')
      }
    } catch (error) {
      toast.error('Failed to place order')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`cart-overlay ${isOpen ? 'open' : ''}`}>
      <div className="cart-panel">
        <div className="cart-header">
          <h3>
            <FontAwesomeIcon icon={faShoppingBag} /> Shopping Cart
          </h3>
          <button className="close-cart" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="cart-items">
          {items.length === 0 ? (
            <div className="empty-cart">
              <FontAwesomeIcon icon={faShoppingCart} size="3x" />
              <p>Your cart is empty</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="cart-item">
                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <h4>{item.name}</h4>
                  <p className="cart-item-price">
                    <span className="unit-price"></span>
                    <span className="item-total">
                      {formatPrice(calculateItemTotal(item))}
                    </span>
                  </p>
                </div>
                <div className="cart-item-quantity">
                  <button
                    className="quantity-btn"
                    onClick={() =>
                      handleQuantityChange(item, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    <FontAwesomeIcon icon={faMinus} />
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    className="quantity-btn"
                    onClick={() =>
                      handleQuantityChange(item, item.quantity + 1)
                    }
                    aria-label="Increase quantity"
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
                <button
                  className="remove-item"
                  onClick={() => onUpdateQuantity(item.id, 0)}
                  aria-label="Remove item"
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="cart-footer">
          <div className="cart-summary">
            {items.map((item) => (
              <div key={item.id} className="summary-row item-summary">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className="summary-row subtotal">
              <span>Subtotal ({getTotalItems()} items):</span>
              <span>{formatPrice(calculateSubtotal())}</span>
            </div>
            <div className="summary-row total">
              <span>Total Amount:</span>
              <span>{formatPrice(calculateSubtotal())}</span>
            </div>
          </div>
          <button
            className="checkout-btn"
            onClick={placeOrder}
            disabled={items.length === 0 || isLoading}
          >
            {isLoading ? 'Processing...' : 'Proceed to Checkout'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Cart
