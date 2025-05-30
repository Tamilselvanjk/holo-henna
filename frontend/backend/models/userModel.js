const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  mobile: {
    type: String,
    sparse: true // Allows multiple null/undefined values
    // Do NOT set unique: true here!
  },
  isGuest: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  strict: false
});

// Remove all indexes to prevent duplicate key errors
userSchema.set('autoIndex', false);

module.exports = mongoose.model('User', userSchema);
