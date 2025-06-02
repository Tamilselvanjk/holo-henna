const express = require('express')
const router = express.Router()
const {
  createOrder,
  getOrder,
  getAllOrders,
} = require('../controllers/orderController')

// POST /api/v1/order/create - Create new order
router.post('/create', createOrder)

// GET /api/v1/order/:id - Get single order
router.get('/:id', getOrder)

// GET /api/v1/orders - Get all orders
router.get('/', getAllOrders)

module.exports = router
