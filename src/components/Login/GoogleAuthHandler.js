import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const GoogleAuthHandler = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.search)
        const code = params.get('code')

        console.log('API URL:', process.env.REACT_APP_API_URL)
        console.log('Code received:', code)

        if (!code) {
          throw new Error('Authorization code missing')
        }

        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/auth/google/callback`,
          { 
            code,
            redirect_uri: `${window.location.origin}/auth/google/callback`
          },
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
          }
        )

        if (!response.data?.token) {
          throw new Error('No token received')
        }

        const userData = await login(response.data.token)
        if (userData) {
          navigate('/profile', { replace: true })
        }
      } catch (error) {
        console.error('Auth Error:', {
          url: `${process.env.REACT_APP_API_URL}/auth/google/callback`,
          error
        })
        toast.error('Authentication failed')
        setTimeout(() => navigate('/login'), 1500)
      } finally {
        setIsLoading(false)
      }
    }

    handleCallback()
  }, [login, navigate])

  return (
    <div className="auth-container">
      {isLoading ? (
        <div className="loading-spinner" />
      ) : (
        <div>Redirecting to profile...</div>
      )}
    </div>
  )
}

export default GoogleAuthHandler
