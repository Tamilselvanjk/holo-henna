const BASE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/api/v1'
    : 'https://holo-henna-frontend.onrender.com/api/v1'

export class OrderService {
  static async createOrder(orderData) {
    try {
      console.log('Creating order:', orderData)

      const response = await fetch(`${BASE_URL}/orders/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...orderData,
          updateStock: true, // Add flag to update stock
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData?.message || 'Failed to create order')
      }

      const data = await response.json()

      if (!data || !data.data) {
        throw new Error('Invalid response format')
      }

      return {
        success: true,
        data: data.data,
      }
    } catch (error) {
      console.error('Order creation failed:', error)
      throw error
    }
  }

  static async getOrderById(orderId) {
    try {
      const response = await fetch(`${BASE_URL}/orders/${orderId}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        credentials: 'include',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to fetch order')
      }

      const result = await response.json()
      return {
        success: true,
        data: result.data,
      }
    } catch (error) {
      console.error('Order fetch failed:', error)
      throw error
    }
  }

  static async getAllOrders() {
    try {
      const response = await fetch(`${BASE_URL}/orders`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch orders')
      }

      return {
        success: true,
        orders: Array.isArray(data.orders) ? data.orders : [],
      }
    } catch (error) {
      console.error('Orders fetch failed:', error)
      return {
        success: false,
        message: error.message,
        orders: [],
      }
    }
  }
}
