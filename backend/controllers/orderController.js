const mongoose = require('mongoose')
const orderModel = require('../models/orderModel')
const User = require('../models/userModel')
const Product = require('../models/productModel')

exports.createOrder = async (req, res) => {
  try {
    const { cartItems, shippingAddress, totalAmount } = req.body

    if (!cartItems?.length || !shippingAddress) {
      return res.status(400).json({
        success: false,
        message: 'Missing required order information',
      })
    }

    // Create guest user if needed
    let userId
    if (req.body.userId) {
      userId = req.body.userId
    } else {
      const guestUser = await User.create({
        name: shippingAddress.name,
        email: `guest_${Date.now()}@temp.com`,
        mobile: shippingAddress.mobile,
        isGuest: true,
      })
      userId = guestUser._id
    }

    // Format order items
    const orderItems = await Promise.all(
      cartItems.map(async (item) => {
        const product = await Product.findById(item.product._id)
        if (!product) {
          throw new Error(`Product not found: ${item.product._id}`)
        }
        return {
          productId: product._id,
          quantity: item.quantity,
          price: product.price,
        }
      })
    )

    // Create order
    const order = await orderModel.create({
      userId,
      orderItems,
      shippingAddress,
      totalAmount,
      status: 'processing',
      paymentStatus: 'pending',
    })

    // Populate product details for response
    const populatedOrder = await orderModel
      .findById(order._id)
      .populate({
        path: 'orderItems.productId',
        select: 'name price images',
      })
      .lean()

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: populatedOrder,
    })
  } catch (error) {
    console.error('Order creation error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create order',
    })
  }
}

// Get order by ID - /api/v1/order/:id
exports.getOrder = async (req, res) => {
  try {
    const order = await orderModel
      .findById(req.params.id)
      .populate({
        path: 'orderItems.productId',
        model: 'Product',
        select: 'name price images',
      })
      .lean()

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      })
    }

    // Format order data
    const formattedOrder = {
      ...order,
      orderItems: order.orderItems.map((item) => ({
        ...item,
        product: item.productId, // Include product details
        productId: undefined, // Remove duplicate info
      })),
    }

    res.status(200).json({
      success: true,
      order: formattedOrder,
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
        path: 'orderItems.productId',
        model: 'Product',
        select: 'name price images',
      })
      .sort({ createdAt: -1 })
      .lean()

    const formattedOrders = orders.map((order) => ({
      ...order,
      orderItems: order.orderItems.map((item) => ({
        ...item,
        product: item.productId,
        productId: undefined,
      })),
    }))

    res.status(200).json({
      success: true,
      orders: formattedOrders,
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
