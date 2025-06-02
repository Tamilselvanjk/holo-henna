const mongoose = require('mongoose')
const orderModel = require('../models/orderModel')
const User = require('../models/userModel')
const Product = require('../models/productModel')

exports.createOrder = async (req, res) => {
  try {
    const { orderItems, ...orderData } = req.body

    // Validate if orderItems exists and is not empty
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order items are required',
      })
    }

    // First verify all products exist before creating the order
    const productIds = orderItems.map((item) => item.product)
    const products = await Product.find({ _id: { $in: productIds } })

    // Check if all products were found
    const foundProductIds = products.map((p) => p._id.toString())
    const missingProducts = productIds.filter(
      (id) => !foundProductIds.includes(id)
    )

    if (missingProducts.length > 0) {
      return res.status(404).json({
        success: false,
        message: `Products not found: ${missingProducts.join(', ')}`,
      })
    }

    // Calculate total prices
    const orderItemsWithDetails = orderItems.map((item) => {
      const product = products.find(
        (p) => p._id.toString() === item.product
      )
      return {
        quantity: item.quantity,
        product: item.product,
        price: product.price,
      }
    })

    const totalPrices = orderItemsWithDetails.reduce((total, item) => {
      return total + item.price * item.quantity
    }, 0)

    const order = new orderModel({
      orderItems: orderItemsWithDetails,
      ...orderData,
      totalAmount: totalPrices,
    })

    const createdOrder = await order.save()

    res.status(201).json({
      success: true,
      data: createdOrder,
    })
  } catch (error) {
    console.error('Order creation error:', error)
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message,
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
