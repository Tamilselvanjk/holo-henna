import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import './OrderSuccess.css'

const OrderSuccess = () => {
  const [orderDetails, setOrderDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const { orderId } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`/api/v1/orders/${orderId}`)
        const data = await response.json()

        if (!data.success) {
          throw new Error(data.message || 'Failed to fetch order')
        }

        setOrderDetails(data.data || data.order)
      } catch (error) {
        console.error('Error fetching order:', error)
        navigate('/orders', {
          replace: true,
          state: { error: 'Failed to load order details' },
        })
      } finally {
        setLoading(false)
      }
    }

    if (orderId) {
      fetchOrderDetails()
    }
  }, [orderId, navigate])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatStatus = (status) => {
    return status?.charAt(0).toUpperCase() + status?.slice(1) || 'Processing'
  }

  const getImageUrl = (imagePath) => {
    if (!imagePath) return ''
    if (imagePath.startsWith('http')) return imagePath
    return process.env.NODE_ENV === 'production'
      ? `https://holo-henna.onrender.com${imagePath}`
      : `${window.location.origin}${imagePath}`
  }

  if (loading) {
    return (
      <div className="loading-spinner-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">Loading</div>
        <div className="loading-progress">
          <div className="loading-progress-bar"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="order-success">
      <div className="success-content">
        <div className="success-icon">
          <i className="fas fa-check-circle"></i>
        </div>
        <h2>Order Placed Successfully!</h2>

        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="order-id">
            Order ID: <span>#{orderDetails?._id?.slice(-8)}</span>
          </div>

          {/* Order Items List */}
          <div className="order-items-section">
            <h4>Order Items</h4>
            {orderDetails?.orderItems?.map((item, index) => (
              <div key={index} className="order-item">
                <div className="item-image">
                  {item.product?.images?.[0]?.image && (
                    <img
                      src={getImageUrl(item.product.images[0].image)}
                      alt={item.product.name || 'Product image'}
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = '/webimg/placeholder.jpg'
                      }}
                    />
                  )}
                </div>
                <div className="item-info">
                  <h5>{item.product?.name}</h5>
                  <p>Quantity: {item.quantity}</p>
                  <p className="price">{formatCurrency(item.price)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Shipping Details */}
          <div className="shipping-info">
            <h4>Shipping Address</h4>
            <div className="address-details">
              <p>
                <strong>{orderDetails?.shippingAddress?.name}</strong>
              </p>
              <p>{orderDetails?.shippingAddress?.street}</p>
              <p>
                {orderDetails?.shippingAddress?.city},{' '}
                {orderDetails?.shippingAddress?.state}
              </p>
              <p>PIN: {orderDetails?.shippingAddress?.pincode}</p>
              <p>Mobile: {orderDetails?.shippingAddress?.mobile}</p>
            </div>
          </div>

          <div className="order-status">
            Status:{' '}
            <span className={`status ${orderDetails?.status}`}>
              {formatStatus(orderDetails?.status)}
            </span>
          </div>

          <div className="total-section">
            Total Amount:{' '}
            <span>{formatCurrency(orderDetails?.totalAmount)}</span>
          </div>
        </div>

        <p className="confirmation">
          Your order has been successfully placed. You can track your order in
          the Orders section.
        </p>

        <div className="action-buttons">
          <Link to="/" className="action-btn continue-shopping">
            <i className="fas fa-shopping-cart"></i>
            Continue Shopping
          </Link>
          <Link to="/orders" className="action-btn view-orders">
            <i className="fas fa-list-ul"></i>
            View Orders
          </Link>
        </div>
      </div>
    </div>
  )
}

export default OrderSuccess
