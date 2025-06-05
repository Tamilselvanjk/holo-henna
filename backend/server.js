const express = require('express')
const cors = require('cors')
const app = express()

// Middleware
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
)
app.use(express.json())

// Static files
app.use('/uploads', express.static('uploads'))
app.use(express.static('public'))

// Routes
app.use('/api/v1', require('./routes'))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
