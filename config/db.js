import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI)
    return connection
  } catch (error) {
    throw error
  }
}

export default connectDB
