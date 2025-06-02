const BASE_URL = 'http://localhost:3000/api/v1'

class OrderService {
  static async createOrder(orderData) {
    try {
      const response = await fetch(`${BASE_URL}/order/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
        credentials: 'include',
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || `Error: ${response.status}`)
      }

      return data
    } catch (error) {
      console.error('Order creation error:', error)
      throw error
    }
  }
}

export { OrderService }
