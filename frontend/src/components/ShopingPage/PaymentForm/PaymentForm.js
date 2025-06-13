import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { OrderService } from '../../../services/orderService'
import { initializeRazorpay } from '../../../services/razorpayService'
import './PaymentForm.css'
import { useNavigate } from 'react-router-dom'

const PaymentForm = ({ total, onBack, cartItems, shippingAddress, onOrderComplete }) => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleRazorpayPayment = async () => {
    setLoading(true)
    const processingToast = toast.loading('Initializing payment...', {
      position: 'top-center',
    })

    try {
      // First initialize Razorpay
      const razorpayResponse = await initializeRazorpay(total, {
        prefill: {
          name: shippingAddress.name,
          email: shippingAddress.email,
          contact: shippingAddress.mobile,
        },
      })

      if (!razorpayResponse.success) {
        throw new Error('Payment initialization failed')
      }

      // Then create order
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
        status: 'confirmed',
      }

      const response = await OrderService.createOrder(orderData)

      if (response.success) {
        toast.dismiss(processingToast)
        toast.success('Order placed successfully!')
        onOrderComplete && onOrderComplete()
        navigate(`/order-success/${response.data._id}`, { replace: true })
      } else {
        throw new Error('Order creation failed')
      }
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
