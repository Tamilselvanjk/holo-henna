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
  origin: ['http://localhost:3000', 'https://holohenna-host.vercel.app','https://holo-henna.onrender.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}

app.use(cors(corsOptions))

app.use(express.json())

// Debug middleware
app.use((req, res, next) => {

  next()
})

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

// 404 handler - must be last
app.use((req, res) => {
 
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.path,
  })
})

module.exports = app
