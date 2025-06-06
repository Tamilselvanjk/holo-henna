const express = require('express')
const dotenv = require('dotenv')
const path = require('path')
const serverless = require('serverless-http')

// Load env config
dotenv.config({ path: path.join(__dirname, '../config/config.env') })

const app = require('./app')

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

// For Vercel
module.exports = app
module.exports.handler = serverless(app)
