const express = require('express')
const router = express.Router()
const { createBooking, getAllBookings } = require('../controllers/bookingController')

// Ensure routes are properly defined
router.post('/', createBooking)
router.get('/', getAllBookings)

module.exports = router
