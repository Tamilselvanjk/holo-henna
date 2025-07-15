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
      console.error('Payment processing error:', error)
      return {
        success: false,
        message: 'Payment processing failed. Please try again.',
      }
    }
  },

  createOrder: async (orderData) => {
    try {
      const response = await fetch('/api/v1/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Order creation failed:', errorText)
        throw new Error('Order creation failed: ' + errorText)
      }
      return response.json()
    } catch (error) {
      console.error('Create order error:', error)
      return {
        success: false,
        message: 'Order creation failed. Please check your details and try again.',
        error: error.message,
      }
    }
  },
}

export default PaymentService
