const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy

// Google OAuth Configuration
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      clientSecret: process.env.REACT_APP_GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.REACT_APP_GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await User.findOne({ email: profile.emails[0].value })

        if (!user) {
          // Create new user if doesn't exist
          user = await User.create({
            email: profile.emails[0].value,
            name: profile.displayName,
            googleId: profile.id,
          })
        }

        return done(null, user)
      } catch (error) {
        return done(error, null)
      }
    }
  )
)

// Google auth routes
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
)

router.post('/google/callback', async (req, res) => {
  try {
    const { code } = req.body

    if (!code) {
      return res.status(400).json({ message: 'Authorization code is required' })
    }

    // Exchange code for user data (simplified for example)
    const user = {
      id: Date.now(),
      name: 'Test User',
      email: 'user@gmail.com',
      provider: 'google',
      picture: null,
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    })

    res.json({
      success: true,
      token,
      user: {
        ...user,
        verified: true,
      },
    })
  } catch (error) {
    console.error('Google callback error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to authenticate with Google',
      error: error.message,
    })
  }
})

module.exports = router
