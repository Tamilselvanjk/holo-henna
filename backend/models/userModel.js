const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required']
  },
  mobile: {
    type: String,
    default: null, // Allow null values
    sparse: true // Important: allows multiple null values
  },
  isGuest: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Important: Remove all indexes to prevent duplicate key errors
if (process.env.NODE_ENV !== 'production') {
  userSchema.set('autoIndex', false);
}

module.exports = mongoose.model('User', userSchema);
