const BASE_URL = '/api/v1'

export const ProductService = {
  getAllProducts: async (category = 'All Products') => {
    try {
      const response = await fetch(`${BASE_URL}/products`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      return {
        success: true,
        products: Array.isArray(data.products) ? data.products : [],
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      return {
        success: false,
        products: [],
        error: error.message,
      }
    }
  },
}
