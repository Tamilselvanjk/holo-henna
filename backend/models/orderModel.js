const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema(
  {
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    shippingAddress: {
      name: String,
      street: String,
      city: String,
      state: String,
      pincode: String,
      mobile: String,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: 'processing',
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Order', orderSchema)
