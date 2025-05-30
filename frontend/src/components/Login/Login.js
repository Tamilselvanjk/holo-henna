import React, { useState } from 'react'
import {
  FaGoogle,
  FaEye,
  FaEyeSlash,
  FaWifi,
  FaExclamationTriangle,
} from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'

import './Login.css'

const Login = () => {
  const { initiateGoogleLogin } = useAuth()

  const handleGoogleLogin = async () => {
    try {
      toast.info('Connecting to Google...', {
        position: 'top-center',
        autoClose: 2000,
      })
      await initiateGoogleLogin()
      toast.success('Successfully logged in!', {
        position: 'top-center',
        autoClose: 3000,
      })
    } catch (error) {
      toast.error('Login failed. Please try again.', {
        position: 'top-center',
        autoClose: 4000,
      })
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
            >
              <FaGoogle className="google-icon" />
              Sign in with Google
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
