const mongoose = require('mongoose')

function mongooseErrorHandler(err, req, res, next) {
  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      success: false,
      message: `Invalid ${err.path}: ${err.value}`,
    })
  }
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      success: false,
      message: err.message,
    })
  }
  next(err)
}

module.exports = mongooseErrorHandler
