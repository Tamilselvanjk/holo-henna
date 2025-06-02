const mongoose = require('mongoose')
const orderModel = require('../models/orderModel')
const User = require('../models/userModel')
const Product = require('../models/productModel')

exports.createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, totalAmount, paymentMethod } = req.body

    if (!Array.isArray(orderItems) || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order items are required',
      })
    }

    // Validate products and check stock
    const productIds = orderItems.map((item) => item.product)
    const products = await Product.find({ _id: { $in: productIds } })

    // Verify all products exist and have sufficient stock
    for (const item of orderItems) {
      const product = products.find(
        (p) => p._id.toString() === item.product
      )
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product ${item.product} not found`,
        })
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`,
        })
      }
    }

    // Update product stock
    const bulkOps = orderItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { stock: -item.quantity } },
      },
    }))

    await Product.bulkWrite(bulkOps)

    // Create order
    const order = new orderModel({
      orderItems,
      shippingAddress,
      totalAmount,
      paymentMethod,
      status: 'processing',
    })

    const savedOrder = await order.save()
    const populatedOrder = await orderModel
      .findById(savedOrder._id)
      .populate('orderItems.product', 'name price images')

    res.status(201).json({
      success: true,
      data: populatedOrder,
    })
  } catch (error) {
    console.error('Order creation error:', error)
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Get order by ID - /api/v1/order/:id
exports.getOrder = async (req, res) => {
  try {
    const order = await orderModel
      .findById(req.params.id)
      .populate({
        path: 'orderItems.product',
        select: 'name price images',
      })
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
    console.error('Error fetching order:', error)
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
