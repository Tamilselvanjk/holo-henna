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
      const response = await fetch('/api/v1/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) throw new Error('Order creation failed')
      return response.json()
    } catch (error) {
      console.error('Create order error:', error)
      throw error
    }
  },
}

export default PaymentService
