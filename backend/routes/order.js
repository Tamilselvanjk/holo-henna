const express = require('express')
const router = express.Router()
const {
  createOrder,
  getOrder,
  getAllOrders,
} = require('../controllers/orderController')

// Get all orders
router.get('/orders', getAllOrders)
router.get('/order/:id', getOrder)
router.post('/orders/create', createOrder)

// Alternative paths
router.get('/', getAllOrders)
router.get('/:id', getOrder)
router.post('/create', createOrder)

module.exports = router
