const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    description: String,
    ratings: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    images: [
      {
        image: String,
      },
    ],
    category: {
      type: String,
      required: true,
      enum: [
        'All Products',
        'Bridal Henna',
        'Traditional',
        'Arabic',
        'Modern',
        'Floral',
        'Custom Designs',
      ],
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Product', productSchema)
