// routes/authRoutes.js
const express = require('express')
const router = express.Router()
const passport = require('passport')

// Initiate Google auth
router.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account', // Forces account selection
  })
)

// Google callback
router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: false,
  }),
  (req, res) => {
    // Successful authentication
    const token = generateJWT(req.user) // Implement your JWT generation
    res.redirect(`http://localhost:3000/auth-success?token=${token}`)
  }
)
