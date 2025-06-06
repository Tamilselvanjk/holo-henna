const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

class ProductService {
  static async getAllProducts(category = null) {
    try {
      console.log('Fetching from:', `${BASE_URL}/products`) // Debug log
      const urlString = `${BASE_URL}/products${
        category && category !== 'All Products' ? `?category=${category}` : ''
      }`

      const response = await fetch(urlString, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        credentials: 'include',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        )
      }

      const data = await response.json()
      return data.products || []
    } catch (error) {
      console.error('Product service error:', error)
      throw new Error('Failed to fetch products. Please try again later.')
    }
  }

  static async getSingleProduct(id) {
    try {
      const response = await fetch(`${BASE_URL}/products/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        credentials: 'include',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Error: ${response.status}`)
      }

      const data = await response.json()
      return data.product
    } catch (error) {
      console.error('Product service error:', error)
      throw new Error('Failed to load product. Please try again later.')
    }
  }

  static async getOrder(orderId) {
    try {
      const response = await fetch(`${BASE_URL}/orders/${orderId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || `Error: ${response.status}`)
      }

      return data
    } catch (error) {
      console.error('Order fetch error:', error)
      throw error
    }
  }

  static async createOrder(orderData) {
    const maxRetries = 3
    let attempt = 0

    while (attempt < maxRetries) {
      try {
        const response = await fetch(`${BASE_URL}/orders/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(orderData),
        })

        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.message || `Error: ${response.status}`)
        }

        return data
      } catch (error) {
        attempt++
        console.error(`Order creation attempt ${attempt} failed:`, error)
        if (attempt === maxRetries) throw error
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt))
      }
    }
  }
}

export { ProductService };