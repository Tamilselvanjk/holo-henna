const PROD_URL = 'https://holo-henna.onrender.com/api/v1'
const DEV_URL = '/api/v1'

class OrderService {
  static getBaseUrl() {
    return process.env.NODE_ENV === 'production' ? PROD_URL : DEV_URL
  }

  static async createOrder(orderData) {
    let baseUrl = this.getBaseUrl()
    const maxRetries = 3
    let attempt = 0

    while (attempt < maxRetries) {
      try {
        const response = await fetch(`${baseUrl}/orders/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(orderData),
        })

        const data = await response.json()
        if (!response.ok) {
          throw new Error(
            data.message || `Order creation failed: ${response.status}`
          )
        }
        return data
      } catch (error) {
        attempt++
        console.error(`Attempt ${attempt} failed:`, error)

        // If local server fails, try production URL
        if (error.message.includes('Failed to fetch') && baseUrl !== PROD_URL) {
          baseUrl = PROD_URL
          continue
        }

        if (attempt === maxRetries) throw error
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt))
      }
    }
  }

  static async getOrder(orderId) {
    let baseUrl = this.getBaseUrl()
    const maxRetries = 3
    let attempt = 0

    while (attempt < maxRetries) {
      try {
        const response = await fetch(`${baseUrl}/orders/${orderId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        })

        if (!response.ok) {
          if (baseUrl !== PROD_URL) {
            baseUrl = PROD_URL
            attempt++
            continue
          }
          throw new Error(`Failed to fetch order: ${response.status}`)
        }

        return response.json()
      } catch (error) {
        attempt++
        if (attempt === maxRetries) throw error
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt))
      }
    }
  }

  static async getAllOrders() {
    let baseUrl = this.getBaseUrl()
    const maxRetries = 3
    let attempt = 0

    while (attempt < maxRetries) {
      try {
        const response = await fetch(`${baseUrl}/orders`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          credentials: 'include',
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch orders: ${response.status}`)
        }

        const data = await response.json()
        if (!data.success) {
          throw new Error(data.message || 'Failed to fetch orders')
        }

        return data
      } catch (error) {
        attempt++
        if (baseUrl !== PROD_URL) {
          baseUrl = PROD_URL
          continue
        }
        if (attempt === maxRetries) throw error
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt))
      }
    }
  }
}

export { OrderService }
