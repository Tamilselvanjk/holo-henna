const BASE_URL = '/api/v1'

class ProductService {
  static async getAllProducts(category = null) {
    try {
      const url = new URL('http://localhost:5000/api/v1/products')
      if (category) {
        url.searchParams.append('category', category)
      }

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      return await response.json()
    } catch (error) {
      console.error('Product service error:', error)
      return { success: false, error: error.message }
    }
  }
}

export { ProductService }
