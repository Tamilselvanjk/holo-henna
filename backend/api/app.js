const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const path = require('path')
const cors = require('cors')

// Load env config
dotenv.config({ path: path.join(__dirname, '..', 'config', 'config.env') })

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
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'https://holo-henna-frontend.onrender.com',
      'https://holo-henna.onrender.com',
    ]

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Access-Control-Allow-Origin'],
  maxAge: 86400, // 24 hours
}
// Mount routes
app.use('/api/v1/products', require('../routes/product'))
app.use('/api/v1/orders', require('../routes/order'))

// Error handling
app.use((err, req, res, next) => {
  console.error('API Error:', err)
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  })
})

// API root route
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'HoloHenna API is running',
    endpoints: {
      products: '/api/v1/products',
      orders: '/api/v1/orders'
    }
  })
})

// Root route handler
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'HoloHenna API is running'
  })
})

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/build', 'index.html'))
})

app.use('/api/v1/products', require('../routes/product'))


module.exports = app
