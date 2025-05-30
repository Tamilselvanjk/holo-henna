const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Make it optional for guest checkout
    },
    orderItems: [
      {
        productId: {
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
          min: 0,
        },
      },
    ],
    shippingAddress: {
      name: String,
      mobile: String,
      street: String,
      city: String,
      state: String,
      pincode: String,
    },
    totalAmount: Number,
    status: {
      type: String,
      enum: ['processing', 'shipped', 'delivered', 'cancelled'],
      default: 'processing',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
)

// Add pre-save middleware to handle guest users
orderSchema.pre('save', async function (next) {
  if (!this.userId || this.userId === 'temp-user-id') {
    const User = mongoose.model('User')
    try {
      const guestUser = await User.create({
        name: this.shippingAddress.name,
        email: `guest_${Date.now()}@example.com`,
        isGuest: true,
      })
      this.userId = guestUser._id
    } catch (error) {
      next(error)
    }
  }
  next()
})

// Add index for faster queries
orderSchema.index({ userId: 1, createdAt: -1 })

module.exports = mongoose.model('Order', orderSchema)
