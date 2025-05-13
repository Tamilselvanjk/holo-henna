import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'
import { FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { API_BASE_URL } from '../../config/api.config'
import { handleAuthError } from '../../utils/errorHandler'
import './Login.css'

const Login = () => {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      navigate('/profile', { replace: true })
    }
  }, [user, navigate])

  useEffect(() => {
    // Load Google API script
    const loadGoogleScript = () => {
      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      document.body.appendChild(script)
      return script
    }
    const script = loadGoogleScript()
    return () => script.remove()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSendOTP = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, formData)
      if (response.data?.token) {
        const userData = await login(response.data.token)
        if (userData) {
          toast.success('Login successful!')
          navigate('/profile', { replace: true })
        }
      }
    } catch (err) {
      setError('Login failed. Please try again.')
      toast.error('Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleAuth = () => {
    try {
      setIsLoading(true)
      const redirectUri = `${window.location.origin}/auth/google/callback`

      const client = window.google.accounts.oauth2.initCodeClient({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        scope: 'email profile openid',
        ux_mode: 'redirect',
        redirect_uri: redirectUri,
        state: btoa(
          JSON.stringify({
            timestamp: Date.now(),
            returnTo: '/profile',
          })
        ),
        callback: (response) => {
          if (response.error) {
            toast.error('Google login failed')
          }
        },
      })

      client.requestCode()
    } catch (error) {
      console.error('Google auth error:', error)
      toast.error('Failed to start Google login')
      setIsLoading(false)
    }
  }

  if (user) return null

  return (
    <div className="login-container">
      <div className="welcome-section">
        <h1>Welcome to Holo Henna</h1>
        <p>Experience the beauty of traditional henna artistry</p>
      </div>

      <div className="auth-section">
        <div className="auth-container">
          <h2>Sign In</h2>
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSendOTP}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className={`phone-input ${error ? 'error' : ''}`}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <a href="#forgot" className="forgot-link">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className="send-otp-button"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="social-buttons">
            <button
              type="button"
              className="google-btn"
              onClick={handleGoogleAuth}
              disabled={isLoading}
            >
              <FaGoogle className="google-icon" />
              <span>Continue with Google</span>
            </button>
          </div>

          <p className="signup-text">
            Don't have an account? <a href="#signup">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
