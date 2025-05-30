const mongoose = require('mongoose');

const validateOrder = (req, res, next) => {
  const { userId, cartItems, shippingAddress } = req.body;

  // Validate cart items
  if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Cart items are required'
    });
  }

  // Validate shipping address
  if (
    !shippingAddress ||
    !shippingAddress.name ||
    !shippingAddress.mobile ||
    !shippingAddress.street ||
    !shippingAddress.city ||
    !shippingAddress.state ||
    !shippingAddress.pincode
  ) {
    return res.status(400).json({
      success: false,
      message: 'shippingAddress is required and must include name, mobile, street, city, state, and pincode'
    });
  }

  // Validate userId if provided (allow guest/undefined)
  if (userId && userId !== 'temp-user-id' && !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user ID format'
    });
  }

  next();
};

module.exports = validateOrder;
