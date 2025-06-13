import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { OrderService } from '../../../services/orderService'
import { initializeRazorpay } from '../../../services/razorpayService'
import { useNavigate } from 'react-router-dom'
import './PaymentForm.css'

const PaymentForm = ({
  total,
  onBack,
  cartItems,
  shippingAddress,
  onOrderComplete,
}) => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleRazorpayPayment = async () => {
    setLoading(true)
    const processingToast = toast.loading('Processing payment...', {
      position: 'top-center',
    })

    try {
      // Initialize Razorpay
      const razorpayResponse = await initializeRazorpay(total, {
        prefill: {
          name: shippingAddress.name,
          email: shippingAddress.email,
          contact: shippingAddress.mobile,
        },
      })

      if (!razorpayResponse?.success) {
        throw new Error('Payment initialization failed')
      }

      // Create order
      const orderData = {
        orderItems: cartItems.map((item) => ({
          product: item._id,
          quantity: item.quantity,
          price: item.price,
          name: item.name,
        })),
        shippingAddress,
        totalAmount: total,
        paymentMethod: 'razorpay',
        paymentDetails: {
          razorpay_payment_id: razorpayResponse.razorpay_payment_id,
          razorpay_order_id: razorpayResponse.razorpay_order_id,
        },
      }

      console.log('Sending order data:', orderData)

      const orderResponse = await OrderService.createOrder(orderData)
      console.log('Order response:', orderResponse)

      if (!orderResponse?.success || !orderResponse?.data?._id) {
        throw new Error('Order creation failed')
      }

      // Clear loading and show success
      toast.dismiss(processingToast)
      toast.success('Payment successful!')
      onOrderComplete && onOrderComplete()

      // Navigate to success page
      navigate(`/order-success/${orderResponse.data._id}`, { replace: true })
    } catch (error) {
      console.error('Payment error:', error)
      toast.dismiss(processingToast)
      toast.error(error.message || 'Payment failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="payment-form">
      <h3>Payment Details</h3>
      <div className="payment-summary">
        <div className="amount-display">
          <span>Total Amount:</span>
          <span className="amount">₹{total.toFixed(2)}</span>
        </div>
      </div>

      <div className="payment-options">
        <div className="razorpay-section">
          <button
            className="razorpay-button"
            onClick={handleRazorpayPayment}
            disabled={loading}
          >
            {loading ? (
              <div className="button-content">
                <span className="loading-spinner"></span>
                <span>Processing...</span>
              </div>
            ) : (
              <div className="button-content">
                <img
                  src="/webimg/razorpay-icon.png"
                  alt="Razorpay"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = 'https://razorpay.com/favicon.png'
                  }}
                  className="razorpay-logo"
                />
                <span>Pay Securely with Razorpay</span>
              </div>
            )}
          </button>
          <p className="payment-note">
            Secured by Razorpay • UPI, Cards, Netbanking accepted
          </p>
        </div>
      </div>

      <div className="button-group">
        <button
          type="button"
          className="back-btn"
          onClick={onBack}
          disabled={loading}
        >
          Back
        </button>
      </div>
    </div>
  )
}

export default PaymentForm
