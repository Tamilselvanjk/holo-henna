const express = require('express');
const router = express.Router();
const { getProducts, getSingleProducts } = require('../controllers/productController');

router.route('/').get(getProducts)
router.route('/:id').get(getSingleProducts)

// Add test endpoint
router.get('/test', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Product routes are working'
    });
  });

  // GET all products
router.get('/', (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: 'Products retrieved successfully',
            data: [
                { id: 1, name: 'Test Product 1', price: 29.99 },
                { id: 2, name: 'Test Product 2', price: 39.99 }
            ]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// GET single product
router.get('/:id', (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: 'Product retrieved successfully',
            data: { id: req.params.id, name: 'Test Product', price: 29.99 }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});
  

module.exports = router;