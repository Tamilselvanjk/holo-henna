const mongoose = require('mongoose')
const Order = require('../models/orderModel')
const User = require('../models/userModel')
const Product = require('../models/productModel')

exports.createOrder = async (req, res) => {
  try {
    // Accept both cartItems and items for compatibility
    let { userId, cartItems, items, shippingAddress, paymentStatus } = req.body
    cartItems =
      Array.isArray(cartItems) && cartItems.length > 0
        ? cartItems
        : Array.isArray(items) && items.length > 0
        ? items
        : null

    // Validate cart items first
    if (!cartItems) {
      return res.status(400).json({
        success: false,
        message: 'Cart items are required',
      })
    }

    // Handle user validation
    let user
    if (userId === 'temp-user-id') {
      // Create guest user
      try {
        user = await User.create({
          name: shippingAddress.name,
          email: `guest_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 9)}@example.com`,
          mobile: shippingAddress.mobile,
          isGuest: true,
        })
        userId = user._id
        console.log('Created guest user with ID:', userId.toString())
      } catch (userError) {
        console.error('Guest user creation error:', userError)
        return res.status(400).json({
          success: false,
          message: 'Failed to create guest user',
        })
      }
    } else {
      // Validate existing user
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid user ID format',
        })
      }

      user = await User.findById(userId)
      if (!user) {
        return res.status(404).json({
          success: false,
          message: `User not found with id: ${userId}`,
        })
      }
    }

    // Validate and check products exist
    const validatedItems = []
    for (const item of cartItems) {
      if (!item.product || !item.product._id || !item.qty) {
        return res.status(400).json({
          success: false,
          message: 'Invalid cart item format',
        })
      }

      if (!mongoose.Types.ObjectId.isValid(item.product._id)) {
        return res.status(400).json({
          success: false,
          message: `Invalid product ID format: ${item.product._id}`,
        })
      }

      const product = await Product.findById(item.product._id)
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found with id: ${item.product._id}`,
        })
      }

      validatedItems.push({
        productId: product._id,
        quantity: item.qty,
        price: product.price, // Use price from database
      })
    }

    // Create order with validated items
    const orderData = {
      userId,
      orderItems: validatedItems,
      shippingAddress,
      totalAmount: validatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
      status: 'processing',
      paymentStatus: paymentStatus || 'pending',
    }

    const order = await Order.create(orderData)

    // Update product stock
    await Promise.all(
      orderData.orderItems.map(async (item) => {
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { stock: -item.quantity } },
          { new: true }
        )
      })
    )

    // Return success with order details
    res.status(201).json({
      success: true,
      order: {
        _id: order._id,
        userId: order.userId,
        orderItems: order.orderItems,
        shippingAddress: order.shippingAddress,
        totalAmount: order.totalAmount,
        status: order.status,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      },
      message: 'Order created successfully',
    })
  } catch (error) {
    console.error('Order creation error:', error)
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create order',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    })
  }
}

// Get order by ID - /api/v1/order/:id
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('cartItems.product')

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      })
    }

    res.status(200).json({
      success: true,
      order,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message,
    })
  }
}
