const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const path = require('path')
const cors = require('cors')

// Load env config
dotenv.config({ path: path.join(__dirname, '..', 'config', 'config.env') })

const app = express()
z
// Connect MongoDB
mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB error:', err)
    process.exit(1)
  })

// Update CORS configuration
const corsOptions = {
  origin: ['http://localhost:3000', 'https://holo-henna-frontend.onrender.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
  credentials: true,
  maxAge: 86400,
}

app.use(cors(corsOptions))

// Add preflight handler for all routes
app.options('*', cors(corsOptions))

// Add headers middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin)
  res.header('Access-Control-Allow-Credentials', true)
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization')
  next()
})

// Debug middleware to log requests
app.use((req, res, next) => {
  console.log(`[API] ${req.method} ${req.url}`)
  next()
})

// API routes first
app.use('/api/v1/orders', require('../routes/order'))
app.use('/api/v1/products', require('../routes/product'))
app.use('/api/v1/bookings', require('../routes/booking')) // Add booking routes

// Serve frontend build
app.use(express.static(path.join(__dirname, 'frontend', 'build')))


// URL decode middleware
app.use((req, res, next) => {
  if (req.path.includes('%PUBLIC_URL%')) {
    const newPath = req.path.replace('%PUBLIC_URL%', '')
    if (newPath.endsWith('favicon.ico')) {
      res.sendFile(path.join(__dirname, 'public', 'favicon.ico'))
    } else if (newPath.endsWith('manifest.json')) {
      res.sendFile(path.join(__dirname, 'public', 'manifest.json'))
    } else {
      res.status(404).send('Not found')
    }
  } else {
    next()
  }
})

// Add health check endpoint
app.get('/api/v1/health', (req, res) => {
  if (mongoose.connection.readyState === 1) {
    res.status(200).json({ status: 'healthy', message: 'Server is running' })
  } else {
    res
      .status(503)
      .json({ status: 'unhealthy', message: 'Database connection issue' })
  }
})

// Improve error handling middleware
app.use((err, req, res, next) => {
  console.error('API Error:', err)
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
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
  res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
});

module.exports = app
