const express = require('express');
const router = express.Router();
const { getProducts, getSingleProducts } = require('../controllers/productController');

router.get('/', getProducts);
router.get('/:id', getSingleProducts);

module.exports = router;