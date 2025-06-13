const Booking = require('../models/bookingModel')

exports.createBooking = async (req, res) => {
  try {
    console.log('Received booking data:', req.body)

    // Validate request body
    if (!req.body || !req.body.fullName || !req.body.email || !req.body.phone || !req.body.service) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      })
    }

    const bookingData = {
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      service: {
        type: req.body.service.type,
        amount: req.body.service.amount,
        details: req.body.service.details,
      },
      bookingDate: req.body.bookingDate,
      status: 'pending',
    }

    const booking = await Booking.create(bookingData)

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking,
    })
  } catch (error) {
    console.error('Booking creation error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create booking',
    })
  }
}

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 })
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}
