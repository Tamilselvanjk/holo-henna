import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth'
import { auth, googleProvider } from '../../firebase/config'
import { toast } from 'react-toastify'
import {
  FaGoogle,
  FaEye,
  FaEyeSlash,
  FaExclamationTriangle,
} from 'react-icons/fa'

import './Login.css'

const Login = () => {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    // Redirect to profile if already logged in
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate('/profile', { replace: true })
      }
    })
    return () => unsubscribe()
  }, [navigate])

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      const result = await signInWithPopup(auth, googleProvider)
      if (result.user) {
        toast.success('Successfully logged in!')
        navigate('/profile', { replace: true })
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error(error.message || 'Failed to sign in with Google')
    } finally {
      setLoading(false)
    }
  }

  const handleEmailLogin = async (e) => {
    e.preventDefault()
    setError('')
    try {
      setLoading(true)
      const result = await signInWithEmailAndPassword(auth, email, password)
      if (result.user) {
        toast.success('Successfully logged in!')
        navigate('/profile', { replace: true })
      }
    } catch (error) {
      console.error('Login error:', error)
      switch (error.code) {
        case 'auth/user-not-found':
          setError('No account found with this email. Please sign in with Google to create one.')
          break
        case 'auth/wrong-password':
          setError('Incorrect password. Please try again.')
          break
        case 'auth/invalid-email':
          setError('Invalid email address. Please check your input.')
          break
        case 'auth/operation-not-allowed':
          setError('Email login is not enabled. Please use Google Sign-in.')
          break
        default:
          setError('Login failed. Please try again or use Google Sign-in.')
      }
      toast.error(error.message)
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
          <form onSubmit={handleEmailLogin}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError('')
                }}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError('')
                  }}
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
            {error && (
              <div className="error-message">
                <FaExclamationTriangle className="error-icon" />
                {error}
              </div>
            )}
            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="#forgot" className="forgot-link">
                Forgot Password?
              </a>
            </div>
            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
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
            Don't have an account? <span style={{ color: '#4285f4', fontWeight: 500 }}>Sign in with Google to create one.</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
  