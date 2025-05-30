import React from 'react'
import { Link } from 'react-router-dom'
import './OrderSuccess.css'

const OrderSuccess = ({ orderId, paymentId }) => {
  return (
    <div className="order-success">
      <div className="success-content">
        <div className="success-icon">
          <i className="fas fa-check-circle"></i>
        </div>
        <h2>Payment Successful!</h2>
        <p className="thank-you">Thank you for your purchase!</p>
        <div className="order-details">
          <p>
            Order ID: <span>{orderId}</span>
          </p>
          <p>
            Payment ID: <span>{paymentId}</span>
          </p>
        </div>
        <p className="confirmation">
          Your order has been placed and will be delivered soon. We have sent
          you an email with the order details.
        </p>
        <div className="action-buttons">
          <Link to="/shop" className="continue-shopping">
            Continue Shopping
          </Link>
          <Link to="/orders" className="view-order">
            View Order
          </Link>
        </div>
      </div>
    </div>
  )
}

export default OrderSuccess
