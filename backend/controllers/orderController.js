const mongoose = require('mongoose')
const orderModel = require('../models/orderModel')
const User = require('../models/userModel')
const Product = require('../models/productModel')

exports.createOrder = async (req, res) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    console.log('Creating order with data:', req.body)

    if (!req.body.orderItems?.length || !req.body.shippingAddress) {
      return res.status(400).json({
        success: false,
        message: 'Missing required order data',
      })
    }

    // Check stock availability
    for (const item of req.body.orderItems) {
      const product = await Product.findById(item.product).session(session)
      if (!product) {
        throw new Error(`Product ${item.product} not found`)
      }
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product ${product.name}`)
      }
    }

    // Create order
    const orderData = {
      orderItems: req.body.orderItems,
      shippingAddress: req.body.shippingAddress,
      totalAmount: req.body.totalAmount,
      paymentMethod: req.body.paymentMethod,
      status: 'processing',
    }

    const order = await orderModel.create([orderData], { session })

    // Update stock
    if (req.body.updateStock) {
      for (const item of req.body.orderItems) {
        await Product.findByIdAndUpdate(
          item.product,
          { $inc: { stock: -item.quantity } },
          { session, new: true }
        )
      }
    }

    await session.commitTransaction()

    const populatedOrder = await orderModel
      .findById(order[0]._id)
      .populate('orderItems.product')

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: populatedOrder,
    })
  } catch (error) {
    await session.abortTransaction()
    console.error('Order creation error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create order',
    })
  } finally {
    session.endSession()
  }
}

// Get order by ID - /api/v1/order/:id
exports.getOrder = async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format',
      })
    }

    const order = await orderModel
      .findById(id)
      .populate('orderItems.product')
      .lean()

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      })
    }

    res.status(200).json({
      success: true,
      data: order,
    })
  } catch (error) {
    console.error('Get order error:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching order details',
      error: error.message,
    })
  }
}

// Get all orders - /api/v1/orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find()
      .populate({
        path: 'orderItems.product',
        model: 'Product',
        select: 'name price images',
      })
      .sort({ createdAt: -1 })
      .lean()

    // Add safety checks for product data
    const safeOrders = orders.map((order) => ({
      ...order,
      orderItems: order.orderItems.map((item) => ({
        ...item,
        product: item.product || { name: 'Product Unavailable', price: 0 },
      })),
    }))

    res.status(200).json({
      success: true,
      orders: safeOrders,
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message,
    })
  }
}
