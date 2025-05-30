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
              src={
                profile.picture ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  profile.name
                )}&size=200&background=4285f4&color=fff`
              }
              alt={profile.name}
              className="profile-avatar"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  profile.name
                )}&size=200&background=4285f4&color=fff`
              }}
            />
          </div>
          <h2>{profile.name}</h2>
          <div className="google-connected">
            <button
              className="google-button"
              type="button"
              onClick={handleGoogleLogin}
            >
              <FaGoogle /> Connected with Google
            </button>
          </div>
        </div>
        <div className="profile-info">
          <p className="email">{profile.email}</p>
          <button className="logout-button" onClick={logout}>
            <FaSignOutAlt /> Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserProfile
