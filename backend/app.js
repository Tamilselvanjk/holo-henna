const express = require('express')
const dotenv = require('dotenv')
const path = require('path')
const cors = require('cors')
const connectDatabase = require('./config/connectDatabase')
const mongooseErrorHandler = require('./middleware/mongooseErrorHandler')

// Import routes
const products = require('./routes/product')
const orders = require('./routes/order')

const app = express()

dotenv.config({ path: path.join(__dirname, 'config', 'config.env') })

connectDatabase()
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
)
app.use(express.json())

// Routes
app.use('/api/v1', products) // Products routes
app.use('/api/v1/order', orders) // Order routes

// Add mongoose error handler before generic error handler
app.use(mongooseErrorHandler)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    error: 'Something went wrong!',
  })
})

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
