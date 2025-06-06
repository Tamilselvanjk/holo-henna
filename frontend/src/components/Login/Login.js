import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '../../firebase/config'
import { toast } from 'react-toastify'
import {
  FaGoogle,
  FaEye,
  FaEyeSlash,
  FaWifi,
  FaExclamationTriangle,
} from 'react-icons/fa'

import './Login.css'

const Login = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      const result = await signInWithPopup(auth, googleProvider)

      if (result.user) {
        toast.success('Successfully logged in!')
        navigate(process.env.REACT_APP_AUTH_REDIRECT_URL || '/profile')
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error(error.message || 'Failed to sign in with Google')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="welcome-section">
        <h1>Welcome to Holo Henna</h1>
        <p>Experience the beauty of traditional henna artistry</p>
      </div>
      <div className="auth-section">
        <div className="auth-container">
          <h2>Sign In</h2>

          <form>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" placeholder="Enter your email" />
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="password-input-wrapper">
                <input name="password" placeholder="Enter your password" />
                <button type="button" className="password-toggle-btn"></button>
              </div>
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="#forgot" className="forgot-link">
                Forgot Password?
              </a>
            </div>

            <button type="submit" className="login-button">
              signin
            </button>
          </form>

          <div className="social-buttons">
            <button
              type="button"
              className="google-btn"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <FaGoogle className="google-icon" />
              {loading ? 'Connecting...' : 'Sign in with Google'}
            </button>
          </div>
          <div className="signup-text">
            Don't have an account? Sign in with Google to create one.
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
