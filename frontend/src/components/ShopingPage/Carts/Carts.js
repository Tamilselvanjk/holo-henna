// src/components/Cart.js
import React from 'react'
import './Carts.css'

const Cart = ({ isOpen, onClose, items, total, onUpdateQuantity }) => {
  return (
    <div className={`cart-overlay ${isOpen ? 'open' : ''}`}>
      <div className="cart-panel">
        <div className="cart-header">
          <h3 className="cart-title">Your Cart</h3>
          <button className="close-cart" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="cart-items">
          {items.length === 0 ? (
            <div className="empty-cart">Your cart is empty</div>
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
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                <div className="cart-item-quantity">
                  <button
                    className="quantity-btn"
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    className="quantity-btn"
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <button
                  className="remove-item"
                  onClick={() => onUpdateQuantity(item.id, 0)}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            ))
          )}
        </div>

        <div className="cart-footer">
          <div className="cart-total">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button
            className="checkout-btn"
            disabled={items.length === 0}
            onClick={() => {
              // Handle checkout logic here
              alert('Checkout functionality coming soon!')
            }}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  )
}

export default Cart
