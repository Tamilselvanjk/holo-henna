const Booking = require('../models/bookingModel');

exports.createBooking = async (req, res) => {
  try {
    const { fullName, email, phone, service, bookingDate, amount } = req.body;

    // Validate required fields
    if (!fullName || !email || !phone || !service) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Create booking
    const booking = await Booking.create({
      fullName,
      email,
      phone,
      service,
      bookingDate: new Date(bookingDate),
      amount,
      status: 'pending'
    });

    // Send success response
    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });

  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating booking'
    });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .sort({ bookingDate: -1 });

    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
