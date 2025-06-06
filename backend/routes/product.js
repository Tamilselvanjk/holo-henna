const express = require('express');
const router = express.Router();
const { getProducts, getSingleProducts } = require('../controllers/productController');

router.get('/', getProducts);
router.get('/:id', getSingleProducts);

// Debug middleware for product routes
router.use((req, res, next) => {
  console.log('Product Route:', req.method, req.url);
  next();
});

module.exports = router;