require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const authRoutes = require('./routes/auth')

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err))

// Routes
app.use('/api/auth', authRoutes)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
