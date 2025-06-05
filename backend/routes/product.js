const express = require('express');
const router = express.Router();
const { getProducts, getSingleProducts } = require('../controllers/productController');

router.get('/', getProducts);
router.get('/:id', getSingleProducts);

// Add test endpoint
router.get('/test', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Product routes are working'
    });
  });
  

module.exports = router;