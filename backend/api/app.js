const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const path = require('path')
const cors = require('cors')

// Load env config
dotenv.config({ path: path.join(__dirname, '..', 'config', 'config.env') })

// Initialize express app
const app = express()

// Connect MongoDB
mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB error:', err)
    process.exit(1)
  })

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://holo-henna-frontend.onrender.com',
    'https://holo-henna.onrender.com',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
}

// Apply middlewares
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Add request logging in development
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, req.body)
    next()
  })
}

// Add JSON parsing error handler
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON payload',
    })
  }
  next(err)
})

// API routes with better error handling
app.use('/api/v1/bookings', async (req, res, next) => {
  try {
    await require('../routes/booking')(req, res, next)
  } catch (error) {
    console.error('Booking route error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error in booking route',
    })
  }
})
app.use('/api/v1/products', require('../routes/product'))
app.use('/api/v1/orders', require('../routes/order'))

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('API Error:', err)
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  })
})

// API root route
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'HoloHenna API is running',
    endpoints: {
      products: '/api/v1/products',
      orders: '/api/v1/orders',
    },
  })
})

// Root route handler
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'HoloHenna API is running',
  })
})

// Catch-all route to send index.html for React routes
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
})

module.exports = app
