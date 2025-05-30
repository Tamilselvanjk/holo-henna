const express = require('express');
const router = express.Router();
const { createOrder, getOrder } = require('../controllers/orderController');
const validateOrder = require('../middleware/validateOrder');

router.post('/create', createOrder);
router.get('/:id', getOrder);

module.exports = router;
