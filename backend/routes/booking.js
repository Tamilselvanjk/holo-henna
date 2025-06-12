const express = require('express');
const router = express.Router();
const { createBooking, getBookings } = require('../controllers/bookingController');

router.post('/create', createBooking);
router.get('/', getBookings);

module.exports = router;
