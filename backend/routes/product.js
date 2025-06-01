const express = require('express');
const router = express.Router();
const { getProducts, getSingleProducts } = require('../controllers/productController');

// GET /api/v1/products
router.get('/', getProducts);

// GET /api/v1/products/:id
router.get('/:id', getSingleProducts);

module.exports = router;