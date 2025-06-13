const express = require('express')
const router = express.Router()
const { createBooking, getAllBookings } = require('../controllers/bookingController')

// Remove /bookings from route as it's already included in app.js
router.post('/', createBooking)
router.get('/', getAllBookings)

module.exports = router
