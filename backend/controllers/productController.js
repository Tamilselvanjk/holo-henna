const Product = require('../models/productModel')

// Fetch products and send them as JSON
// Get Products API - /api/v1/products

exports.getProducts = async (req, res) => {
  try {
    // Fetch all products without any initial filter
    const products = await Product.find()
      .select('name price description ratings images category stock numOfReviews')
      .sort({ createdAt: -1 })
      .lean()

    // Format products consistently
    const formattedProducts = products.map((product) => ({
      _id: product._id,
      name: product.name,
      price: Number(product.price),
      description: product.description || '',
      ratings: Number(product.ratings || 0),
      numOfReviews: Number(product.numOfReviews || 0),
      images: product.images || [],
      category: product.category,
      stock: Number(product.stock || 0),
    }))

    res.setHeader('Content-Type', 'application/json')
    return res.status(200).json({
      success: true,
      products: formattedProducts,
    })
  } catch (error) {
    console.error('Product fetch error:', error)
    res.status(500).json({
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

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      })
    }

    res.status(200).json({
      success: true,
      product,
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    res.status(500).json({
      success: false,
      error: 'Server Error',
    })
  }
}
