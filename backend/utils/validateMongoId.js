const mongoose = require('mongoose')

const validateMongoId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error(`Invalid ID format: ${id}`)
  }
  return new mongoose.Types.ObjectId(id)
}

module.exports = validateMongoId
