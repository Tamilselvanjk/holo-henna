const express = require('express')
const dotenv = require('dotenv')
const path = require('path')
const cors = require('cors')
const connectDatabase = require('./config/connectDatabase')


// Import routes
const products = require('./routes/product')
const orders = require('./routes/order')

const app = express()

dotenv.config({ path: path.join(__dirname, 'config', 'config.env') })

connectDatabase()

// Use Object.assign instead of util._extend for configurations
const corsOptions = {
  origin: ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions))
app.use(express.json())

// Routes
app.use('/api/v1/products', products)
app.use('/api/v1/order', orders) // Keep this for backward compatibility
app.use('/api/v1/orders', orders) // Add this for consistent API routing


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    error: 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
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
