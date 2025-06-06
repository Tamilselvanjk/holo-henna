const Product = require('../models/productModel')

// Fetch products and send them as JSON
// Get Products API - /api/v1/products

exports.getProducts = async (req, res) => {
  try {
    console.log('Fetching products with query:', req.query)

    const queryObj = { ...req.query }
    const excludeFields = ['page', 'sort', 'limit', 'fields']
    excludeFields.forEach((el) => delete queryObj[el])

    let query = Product.find(queryObj)

    // Add category filter if provided
    if (req.query.category && req.query.category !== 'All Products') {
      query = query.where('category').equals(req.query.category)
    }

    const products = await query
      .select('name price description ratings numOfReviews images category stock')
      .lean()

    // Add sample review counts if not present
    const formattedProducts = products.map((product) => {
      // Ensure numOfReviews exists with a sample value if not set
      const reviews = Math.floor(Math.random() * 50) // temporary solution

      return {
        _id: product._id,
        name: product.name,
        price: Number(product.price),
        description: product.description || '',
        ratings: Number(product.ratings || 0),
        numOfReviews: Number(product.numOfReviews || reviews), // Use existing or sample value
        images: product.images || [],
        category: product.category,
        stock: Number(product.stock || 0),
      }
    })

    res.setHeader('Content-Type', 'application/json')
    return res.status(200).json({
      success: true,
      count: formattedProducts.length,
      products: formattedProducts,
    })
  } catch (error) {
    console.error('Product fetch error:', error)
    return res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message,
    })
  }
}

// Get SingleProducts API - /api/v1/products/:id
exports.getSingleProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .select('+numOfReviews')
      .lean()

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      })
    }

    res.status(200).json({
      success: true,
      product: {
        ...product,
        numOfReviews: Number(product.numOfReviews || 0),
      },
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    res.status(500).json({
      success: false,
      error: 'Server Error',
    })
  }
}
