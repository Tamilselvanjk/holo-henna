const PROD_URL = 'https://holo-henna-frontend.onrender.com/api/v1'
const DEV_URL = '/api/v1'; // Change to use consistent API path

class ProductService {
  static async getAllProducts(category = null) {
    try {
      const baseUrl = process.env.NODE_ENV === 'production' ? PROD_URL : DEV_URL;
      const urlString = `${baseUrl}/products${category ? `?category=${category}` : ''}`

      console.log('Fetching products from:', urlString) // Debug log

      const response = await fetch(urlString, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        credentials: 'include',
        mode: 'cors',
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
      const baseUrl = process.env.NODE_ENV === 'production' ? PROD_URL : DEV_URL;
      const response = await fetch(`${baseUrl}/products/${id}`, {
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
      const baseUrl = process.env.NODE_ENV === 'production' ? PROD_URL : DEV_URL;
      const response = await fetch(`${baseUrl}/orders/${orderId}`, {
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
    const baseUrl = process.env.NODE_ENV === 'production' ? PROD_URL : DEV_URL;
    const maxRetries = 3
    let attempt = 0

    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

    while (attempt < maxRetries) {
      try {
        const response = await fetch(`${baseUrl}/orders/create`, {
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
        console.error(`Attempt ${attempt} failed:`, error)

        if (attempt === maxRetries) {
          throw error
        }

        await wait(1000 * attempt)
      }
    }
  }
}

export { ProductService };