const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true,
    },
    service: {
      type: {
        type: String,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      details: String,
    },
    bookingDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Booking', bookingSchema)
