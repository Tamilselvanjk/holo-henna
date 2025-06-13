import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { OrderService } from '../../../services/orderService'
import './OrderSuccess.css'

const OrderSuccess = () => {
  const [orderDetails, setOrderDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const { orderId } = useParams()
  const navigate = useNavigate()

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatStatus = (status) => {
    if (!status) return 'Processing'
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
  }

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/webimg/placeholder.jpg'
    if (imagePath.startsWith('http')) return imagePath
    return process.env.NODE_ENV === 'development'
      ? `http://localhost:3000${imagePath}`
      : `https://holo-henna-frontend.onrender.com${imagePath}`
  }

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true)
        const result = await OrderService.getOrderById(orderId)

        if (!result.success || !result.data) {
          throw new Error('Failed to fetch order details')
        }

        setOrderDetails(result.data)
        toast.success('Order confirmed!')
      } catch (error) {
        console.error('Error fetching order:', error)
        toast.error('Error loading order details')
        navigate('/orders')
      } finally {
        setLoading(false)
      }
    }

    if (orderId) {
      fetchOrderDetails()
    }
  }, [orderId, navigate])

  if (loading) {
    return (
      <div className="loading-spinner-container">
        <div className="loading-spinner"></div>
        <p>Loading order details...</p>
      </div>
    )
  }

  if (!orderDetails) {
    return (
      <div className="error-container">
        <h2>Order Not Found</h2>
        <Link to="/" className="back-to-home">Return to Home</Link>
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

          {orderDetails?.orderItems?.length > 0 && (
            <div className="order-items-section">
              <h4>Order Items</h4>
              {orderDetails.orderItems.map((item, index) => (
                <div key={index} className="order-item">
                  <div className="item-image">
                    <img
                      src={getImageUrl(item.product?.images?.[0]?.image)}
                      alt={item.product?.name || 'Product'}
                      onError={(e) => {
                        e.target.onerror = null
                        
                      }}
                    />
                  </div>
                  <div className="item-info">
                    <h5>{item.product?.name || 'Product Unavailable'}</h5>
                    <p>Quantity: {item.quantity}</p>
                    <p className="price">{formatCurrency(item.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="shipping-info">
            <h4>Shipping Address</h4>
            <div className="address-details">
              <p><strong>{orderDetails?.shippingAddress?.name}</strong></p>
              <p>{orderDetails?.shippingAddress?.street}</p>
              <p>
                {orderDetails?.shippingAddress?.city}, {orderDetails?.shippingAddress?.state}
              </p>
              <p>PIN: {orderDetails?.shippingAddress?.pincode}</p>
              <p>Mobile: {orderDetails?.shippingAddress?.mobile}</p>
            </div>
          </div>

          <div className="order-total">
            Total Amount: <span>{formatCurrency(orderDetails?.totalAmount || 0)}</span>
          </div>
        </div>

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
