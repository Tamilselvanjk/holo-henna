import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { OrderService } from '../../../services/orderService'
import { initializeRazorpay } from '../../../services/razorpayService'
import './PaymentForm.css'
import { useNavigate } from 'react-router-dom'

const PaymentForm = ({ total = 0, onBack, cartItems = [], shippingAddress = {}, onOrderComplete }) => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleRazorpayPayment = async () => {
    setLoading(true)
    const processingToast = toast.loading('Initializing payment...', {
      position: 'top-center'
    })

    try {
      if (!cartItems.length) {
        throw new Error('No items in cart')
      }

      const orderItems = cartItems.map(item => ({
        product: item._id,
        quantity: Number(item.quantity || 1),
        price: Number(item.price || 0),
      }))

      const orderData = {
        orderItems,
        shippingAddress,
        totalAmount: Number(total),
        paymentMethod: 'razorpay'
      }

      const paymentResult = await initializeRazorpay(total, {
        prefill: {
          name: shippingAddress.name,
          email: shippingAddress.email,
          contact: shippingAddress.mobile
        },
        notes: {
          order_type: 'mehndi_service',
          shipping_address: JSON.stringify(shippingAddress)
        },
        order_data: orderData
      })

      if (paymentResult?.success) {
        const result = await OrderService.createOrder({
          ...orderData,
          paymentDetails: {
            razorpay_payment_id: paymentResult.razorpay_payment_id,
            razorpay_order_id: paymentResult.razorpay_order_id
          }
        })

        if (result.success) {
          toast.dismiss(processingToast)
          toast.success('Payment successful!')
          // Call onOrderComplete to clear the cart
          onOrderComplete && onOrderComplete()
          navigate(`/order-success/${result.data._id}`, { replace: true })
        }
      }
    } catch (error) {
      console.error('Payment error:', error)
      toast.dismiss(processingToast)
      toast.error(error.message || 'Payment failed. Please try again.')
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
                    e.target.onerror = null;
                    e.target.src = "https://razorpay.com/favicon.png";
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
