import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { FaGoogle, FaSpinner } from 'react-icons/fa'
import axios from 'axios'
import './UserProfile.css'

const UserProfile = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [profileData, setProfileData] = useState(null)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    const fetchProfileData = async () => {
      try {
        setIsLoading(true)
        const token = localStorage.getItem('token')
        
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/auth/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            withCredentials: true
          }
        )

        if (response.data) {
          setProfileData({
            ...response.data,
            picture: response.data.picture || user.picture,
            provider: response.data.googleId ? 'google' : 'email'
          })
        }
      } catch (error) {
        if (error.response?.status === 401) {
          toast.error('Session expired')
          navigate('/login')
        } else {
          toast.error('Failed to load profile')
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfileData()
  }, [user, navigate])

  const handleLogout = async () => {
    try {
      setIsLoading(true)
      await logout()
      toast.success('Logged out successfully')
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Logout failed')
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Welcome, {user.name}</h1>
      </div>

      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner" />
          <p className="loading-text">Loading profile...</p>
        </div>
      ) : (
        <div className="profile-content">
          <div className="profile-image">
            {user.picture ? (
              <img
                src={user.picture}
                alt="Profile"
                className="profile-avatar"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.name || 'User'
                  )}&background=4285f4&color=fff`
                }}
              />
            ) : (
              <div className="profile-avatar">
                {(user.name?.[0] || 'U').toUpperCase()}
              </div>
            )}
          </div>

          <div className="profile-details">
            <div className="profile-info">
              <h2>{user.name}</h2>
              <p className="email">{user.email}</p>

              {user.provider === 'google' && (
                <div className="google-connected">
                  <FaGoogle />
                  <span>Connected with Google</span>
                </div>
              )}

              {profileData?.joinedDate && (
                <p className="join-date">
                  Member since:{' '}
                  {new Date(profileData.joinedDate).toLocaleDateString()}
                </p>
              )}
            </div>

            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="logout-button"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="spinner" />
                  Logging out...
                </>
              ) : (
                'Logout'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserProfile
