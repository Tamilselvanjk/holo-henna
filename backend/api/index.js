const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const path = require('path')
const cors = require('cors')
const serverless = require('serverless-http')

// Load env config
dotenv.config({ path: path.join(__dirname, '../config/config.env') })

const app = express()

// Database connection
mongoose.connect(process.env.DB_URL)
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:3000', 'https://holohenna-host.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions))
app.use(express.json())

// Import routes
const products = require('../routes/product')
const orders = require('../routes/order')

// Routes
app.use('/api/v1/products', products)
app.use('/api/v1/orders', orders)

app.get("/", (req, res) => {
    res.json("Hello");
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    error: 'Something went wrong!'
  })
})

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

// For Vercel
module.exports = app
module.exports.handler = serverless(app)
