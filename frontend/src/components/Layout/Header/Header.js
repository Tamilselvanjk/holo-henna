import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { OrderService } from '../../../services/orderService'
import { toast } from 'react-toastify'
import './OrdersPage.css'
import { useAuth } from '../../../context/AuthContext'

const OrdersPage = () => {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user && !authLoading) {
      // Redirect to login if not authenticated
      navigate('/login')
    } else {
      getOrders()
    }
  }, [user, authLoading]) // Depend on user and authLoading

  const getOrders = async () => {
    try {
      setLoading(true)
      const result = await OrderService.getAllOrders()

      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch orders')
      }

      const sortedOrders = (result.orders || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )
      setOrders(sortedOrders)
    } catch (error) {
      console.error('Failed to fetch orders:', error)
      toast.error('Unable to load orders')
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusClass = (status) => {
    const statusMap = {
      processing: 'status-processing',
      shipped: 'status-shipped',
      delivered: 'status-delivered',
      cancelled: 'status-cancelled',
    }
    return statusMap[status?.toLowerCase()] || ''
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const renderShippingInfo = (address) => (
    <div className="shipping-details">
      <div className="shipping-header">
        <i className="fas fa-map-marker-alt"></i>
        <h4>Shipping Information</h4>
      </div>
      <div className="shipping-content">
        <div className="recipient-info">
          <p className="recipient-name">{address.name}</p>
          <p className="recipient-mobile">
            <i className="fas fa-phone"></i> {address.mobile}
          </p>
        </div>
        <div className="address-info">
          <p>{address.street}</p>
          <p>{address.city}</p>
          <p>
            {address.state} - {address.pincode}
          </p>
        </div>
      </div>
    </div>
  )

  const renderOrderItems = (items) => (
    <div className="items-list">
      {items.map((item, idx) => (
        <div key={idx} className="order-item">
          <div className="item-info">
            <span className="item-name">
              {item.product?.name || 'Product Unavailable'}
            </span>
            <span className="item-quantity">×{item.quantity || 0}</span>
          </div>
          <span className="item-price">
            ${((item.price || 0) * (item.quantity || 0)).toFixed(2)}
          </span>
        </div>
      ))}
    </div>
  )

  if (loading || authLoading) {
    return (
      <div className="orders-loading">
        <i className="fas fa-spinner fa-spin"></i>
        <p>Loading your orders...</p>
      </div>
    )
  }

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h2>Your Orders</h2>
        <div className="nav-buttons">
          <button onClick={() => navigate(-1)} className="back-btn">
            <i className="fas fa-arrow-left"></i> Back
          </button>
          <Link to="/" className="shop-btn">
            <i className="fas fa-shopping-cart"></i> Continue Shopping
          </Link>
        </div>
      </div>
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <div className="order-info">
                <span className="order-id">Order #{order._id.slice(-8)}</span>
                <span className="order-date">
                  {formatDate(order.createdAt)}
                </span>
              </div>
              <span className={`order-status ${getStatusClass(order.status)}`}>
                {order.status}
              </span>
            </div>

            <div className="order-main-content">
              <div className="order-items-section">
                <h4>Items Ordered</h4>
                {renderOrderItems(order.orderItems || [])}
              </div>

              {renderShippingInfo(order.shippingAddress)}
            </div>

            <div className="order-footer">
              <div className="order-total">
                <span>Order Total:</span>
                <span className="total-amount">
                  ${order.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default OrdersPage