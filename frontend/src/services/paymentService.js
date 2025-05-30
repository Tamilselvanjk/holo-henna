const BASE_URL = '/api/v1'

const PaymentService = {
  processPayment: async (paymentData) => {
    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 1500))

      return {
        success: true,
        transactionId: `TXN${Date.now()}`,
        amount: paymentData.amount,
      }
    } catch (error) {
      throw new Error('Payment processing failed')
    }
  },

  createOrder: async (orderData) => {
    try {
      const response = await fetch('/api/v1/order/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create order')
      }

      const data = await response.json()
      console.log('Order created successfully:', data)
      return data
    } catch (error) {
      console.error('Order creation error:', error)
      throw error
    }
  },
}

export default PaymentService
