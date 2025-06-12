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
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    service: {
      type: String,
      required: [true, 'Service selection is required'],
      enum: [
        'full-bridal',
        'elite-bridal',
        'traditional',
        'engagement',
        'pre-wedding',
        'party',
        'custom-arabic',
        'custom-minimal',
        'custom-portrait',
      ],
    },
    bookingDate: {
      type: Date,
      required: [true, 'Booking date is required'],
    },
    status: {
      type: String,
      default: 'pending',
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    },
    amount: {
      type: Number,
      required: [true, 'Booking amount is required'],
    },
    notes: {
      type: String,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Booking', bookingSchema)
