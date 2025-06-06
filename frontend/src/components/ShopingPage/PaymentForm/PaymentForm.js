import React, { useState } from 'react'
import { toast } from 'react-toastify'
import PaymentService from '../../../services/paymentService'
import { OrderService } from '../../../services/orderService'
import './PaymentForm.css'

const PaymentForm = ({
  total = 0,
  onBack,
  cartItems = [], // Add default empty array
  shippingAddress = {}, // Add default empty object
}) => {
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [upiApp, setUpiApp] = useState('')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    upiId: '',
  })

  const upiApps = [
    { id: 'gpay', name: 'Google Pay', logo: '/webimg/gpay.jpg' },
    { id: 'phonepe', name: 'PhonePe', logo: '/webimg/phonepe.jpg' },
    { id: 'paytm', name: 'Paytm', logo: '/webimg/paytm.jpg' },
  ]

  const TEST_PAYMENT_METHODS = {
    card: {
      number: '4111111111111111',
      cvv: '123',
      expiry: '12/25',
    },
    upi: {
      gpay: 'test@gpay',
      phonepe: 'test@phonepe',
      paytm: 'test@paytm',
    },
  }

  const formatUpiId = (value, app) => {
    // Remove existing app suffix if any
    const baseId = value.split('@')[0]
    return baseId + '@' + app
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name === 'upiId') {
      // Strip any existing @provider suffix
      const cleanValue = value.split('@')[0]
      setFormData((prev) => ({
        ...prev,
        [name]: cleanValue,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const validatePayment = (paymentData) => {
    if (paymentMethod === 'card') {
      if (paymentData.cardNumber !== TEST_PAYMENT_METHODS.card.number) {
        throw new Error(
          `For testing, use card number: ${TEST_PAYMENT_METHODS.card.number}`
        )
      }
      if (paymentData.cvv !== TEST_PAYMENT_METHODS.card.cvv) {
        throw new Error(
          `For testing, use CVV: ${TEST_PAYMENT_METHODS.card.cvv}`
        )
      }
      if (paymentData.expiryDate !== TEST_PAYMENT_METHODS.card.expiry) {
        throw new Error(
          `For testing, use expiry: ${TEST_PAYMENT_METHODS.card.expiry}`
        )
      }
    } else if (paymentMethod === 'upi') {
      if (!upiApp) {
        throw new Error('Please select a UPI app')
      }
      const expectedUpiId = TEST_PAYMENT_METHODS.upi[upiApp]
      const actualUpiId = formatUpiId(paymentData.upiId, upiApp)

      if (actualUpiId !== expectedUpiId) {
        throw new Error(
          `For testing, use UPI ID: ${expectedUpiId.split('@')[0]}`
        )
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const processingToast = toast.loading('Processing payment...')

    try {
      validatePayment(formData)

      const orderItems = cartItems
        .map((item) => ({
          product: item._id,
          quantity: Number(item.quantity || 1),
          price: Number(item.price || 0),
        }))
        .filter(item => item.product && item.quantity > 0)

      const orderData = {
        orderItems,
        shippingAddress: {
          name: shippingAddress.name,
          street: shippingAddress.street,
          city: shippingAddress.city,
          state: shippingAddress.state,
          pincode: shippingAddress.pincode,
          mobile: shippingAddress.mobile
        },
        totalAmount: Number(total),
        paymentMethod,
        paymentDetails: formData
      }

      const result = await OrderService.createOrder(orderData)
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to create order')
      }

      toast.update(processingToast, {
        render: 'Order placed successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 2000,
      })

      const orderId = result.data?._id
      if (orderId) {
        // Use absolute URL for order success page
        const baseUrl = process.env.NODE_ENV === 'production' 
          ? 'https://holo-henna.onrender.com'
          : window.location.origin;
        window.location.href = `${baseUrl}/order-success/${orderId}`
      }
    } catch (error) {
      console.error('Payment error:', error)
      toast.update(processingToast, {
        render: error.message || 'Payment failed. Please try again.',
        type: 'error',
        isLoading: false,
        autoClose: 5000,
      })
    } finally {
      setLoading(false)
    }
  }

  // Add this helper function to show test payment details
  const getTestPaymentDetails = () => {
    if (paymentMethod === 'card') {
      return (
        <div className="test-payment-info">
          <small>For testing, use these details:</small>
          <small>Card: {TEST_PAYMENT_METHODS.card.number}</small>
          <small>CVV: {TEST_PAYMENT_METHODS.card.cvv}</small>
          <small>Expiry: {TEST_PAYMENT_METHODS.card.expiry}</small>
        </div>
      )
    }
    if (paymentMethod === 'upi' && upiApp) {
      return (
        <div className="test-payment-info">
          <small>
            For testing, use UPI ID:{' '}
            {TEST_PAYMENT_METHODS.upi[upiApp].split('@')[0]}
          </small>
        </div>
      )
    }
    return null
  }

  return (
    <div className="payment-form">
      <h3>Payment Details</h3>
      <div className="payment-summary">
        <div className="amount-display">
          <span>Total Amount:</span>
          <span className="amount">${total.toFixed(2)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="payment-methods">
          <label className="payment-method">
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <span>Credit/Debit Card</span>
          </label>

          <label className="payment-method">
            <input
              type="radio"
              name="paymentMethod"
              value="upi"
              checked={paymentMethod === 'upi'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <span>UPI Payment</span>
          </label>
        </div>

        {paymentMethod === 'card' && (
          <div className="card-details">
            {getTestPaymentDetails()}
            <div className="form-group">
              <label>Card Number</label>
              <input
                type="text"
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber}
                onChange={handleInputChange}
                maxLength="16"
                required
              />
            </div>
            <div className="form-group">
              <label>Cardholder Name</label>
              <input
                type="text"
                name="cardName"
                placeholder="Name on card"
                value={formData.cardName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Expiry Date</label>
                <input
                  type="text"
                  name="expiryDate"
                  placeholder="MM/YY"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  maxLength="5"
                  required
                />
              </div>
              <div className="form-group">
                <label>CVV</label>
                <input
                  type="password"
                  name="cvv"
                  placeholder="123"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  maxLength="3"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {paymentMethod === 'upi' && (
          <div className="upi-details">
            <div className="upi-apps">
              {upiApps.map((app) => (
                <button
                  key={app.id}
                  type="button"
                  className={`upi-app-btn ${
                    upiApp === app.id ? 'selected' : ''
                  }`}
                  onClick={() => setUpiApp(app.id)}
                >
                  <img src={app.logo} alt={app.name} className="upi-app-logo" />
                  <span>{app.name}</span>
                </button>
              ))}
            </div>

            {upiApp && (
              <div className="form-group">
                <label>UPI ID</label>
                <div className="upi-input-wrapper">
                  <input
                    type="text"
                    name="upiId"
                    placeholder="Enter your UPI ID"
                    value={formData.upiId}
                    onChange={handleInputChange}
                    required
                  />
                  <span className="upi-handle">@{upiApp}</span>
                </div>
                <small className="upi-hint">Example: username@{upiApp}</small>
              </div>
            )}
            {getTestPaymentDetails()}
          </div>
        )}

        <div className="button-group">
          <button
            type="button"
            className="back-btn"
            onClick={onBack}
            disabled={loading}
          >
            Back
          </button>
          <button type="submit" className="pay-btn" disabled={loading}>
            {loading ? 'Processing...' : `Pay $${total.toFixed(2)}`}
          </button>
        </div>
      </form>
    </div>
  )
}

export default PaymentForm
