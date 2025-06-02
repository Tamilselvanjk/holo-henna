class OrderService {
  static async createOrder(orderData) {
    try {
      const response = await fetch(
        'http://localhost:5000/api/v1/order/create',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create order')
      }

      return data
    } catch (error) {
      console.error('Order creation error:', error)
      throw error
    }
  }
}

export default OrderService
