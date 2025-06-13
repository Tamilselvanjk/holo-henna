const express = require('express');
const router = express.Router();
const { createOrder, getOrder, getAllOrders } = require('../controllers/orderController');

// Change route method to POST
router.post('/create', createOrder);
router.get('/', getAllOrders); // Add this route
router.get('/:id', getOrder);

module.exports = router;
router.get('/order/:id', getOrder)
router.post('/orders/create', createOrder)



module.exports = router
