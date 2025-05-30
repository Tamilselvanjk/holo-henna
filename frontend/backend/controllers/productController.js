const Product = require('../models/productModel')

// Fetch products and send them as JSON
// Get Products API - /api/v1/products

exports.getProducts = async (req, res) => {
  try {
    const query = {}
    if (req.query.category && req.query.category !== 'All Products') {
      query.category = req.query.category
    }

    const products = await Product.find(query)
      .select('name price description ratings images category stock numOfReviews')
      .lean()

    const formattedProducts = products.map(product => ({
      _id: product._id.toString(),
      name: product.name,
      price: product.price,
      description: product.description,
      ratings: Number(product.ratings || 0),
      numOfReviews: Number(product.numOfReviews || 0),
      images: product.images || [],
      category: product.category,
      stock: product.stock
    }))

    res.setHeader('Content-Type', 'application/json')
    return res.status(200).json({
      success: true,
      products: formattedProducts
    })
  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({
      success: false,
      error: 'Server Error'
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
