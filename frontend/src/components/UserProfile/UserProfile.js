// FILEPATH: c:/Users/ernag/Music/holohenna/project/frontend/src/components/UserProfile.js
import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { FaGoogle, FaSignOutAlt } from 'react-icons/fa'
import { toast } from 'react-toastify'
import './UserProfile.css'
import { useAuth } from '../../context/AuthContext'

const UserProfile = () => {
  const { initiateGoogleLogin } = useAuth()

  const handleGoogleLogin = async () => {
    try {
      await initiateGoogleLogin()
    } catch (error) {
      toast.error('Login failed. Please try again.')
    }
  }

  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login')
    } else {
      setProfile(user)
    }
  }, [isAuthenticated, user, navigate])

  const getProfileImage = (user) => {
    if (user?.photoURL) return user.photoURL
    if (user?.displayName) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(
        user.displayName
      )}&size=200&background=4285f4&color=fff`
    }
    return '/webimg/default-avatar.png'
  }

  const getDisplayName = (user) => {
    return user?.displayName || user?.email?.split('@')[0] || 'User'
  }

  if (!profile) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-image-container">
            <div className="floating-bubbles">
              <div className="bubble bubble-1"></div>
              <div className="bubble bubble-2"></div>
              <div className="bubble bubble-3"></div>
              <div className="bubble bubble-4"></div>
              <div className="bubble bubble-5"></div>
              <div className="bubble bubble-6"></div>
              <div className="bubble bubble-7"></div>
              <div className="bubble bubble-8"></div>
              <div className="bubble bubble-9"></div>
              <div className="bubble bubble-10"></div>
              <div className="bubble bubble-11"></div>
              <div className="bubble bubble-12"></div>
              <div className="bubble bubble-13"></div>
              <div className="bubble bubble-14"></div>
              <div className="bubble bubble-15"></div>
              <div className="bubble bubble-16"></div>
            </div>
            <img
              src={getProfileImage(profile)}
              alt={getDisplayName(profile)}
              className="profile-avatar"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = '/webimg/default-avatar.png'
              }}
            />
          </div>
          <h2>{getDisplayName(profile)}</h2>

          {profile?.email && (
            <div className="google-connected">
              <span className="google-badge">
                <FaGoogle /> Google Account
              </span>
              <p className="email">{profile.email}</p>
            </div>
          )}
        </div>
        <div className="profile-info">
          <button className="logout-button" onClick={logout}>
            <FaSignOutAlt /> Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserProfile
