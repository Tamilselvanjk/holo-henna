const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const path = require('path')
const cors = require('cors')

// Load env config
dotenv.config({ path: path.join(__dirname, '..', 'config', 'config.env') });




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
const corsOptions = Object.assign(
  {},
  {
    origin: function (origin, callback) {
      const allowedOrigins = [
        'http://localhost:3000',
        'https://holo-henna-frontend.onrender.com',
        'https://holo-henna.onrender.com',
      ]

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Access-Control-Allow-Origin'],
    maxAge: 86400,
  }
)

app.use(cors(corsOptions))
app.use(express.json())


// Add OPTIONS handling for preflight requests
app.options('*', cors(corsOptions));

// Debug middleware to log requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Mount routes
app.use('/api/v1/products', require('../routes/product'))
app.use('/api/v1/orders', require('../routes/order'))

// Add health check endpoint
app.get('/api/v1/health', (req, res) => {
  if (mongoose.connection.readyState === 1) {
    res.status(200).json({ status: 'healthy', message: 'Server is running' });
  } else {
    res.status(503).json({ status: 'unhealthy', message: 'Database connection issue' });
  }
});

// Improve error handling middleware
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : ''
  });
});

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
