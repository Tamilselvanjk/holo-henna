import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaGoogle, FaSignOutAlt, FaEnvelope, FaUser, FaPalette, FaMagic } from 'react-icons/fa'
import { IoSparkles } from 'react-icons/io5'
import { toast } from 'react-toastify'
import './UserProfile.css'
import { useAuth } from '../../context/AuthContext'

const UserProfile = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [animate, setAnimate] = useState(false)
  const [hoverEffect, setHoverEffect] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login')
    } else {
      setProfile(user)
      setTimeout(() => setAnimate(true), 100)
    }
  }, [isAuthenticated, user, navigate])

  const getProfileImage = (user) => {
    if (user?.providerData && user.providerData.length > 0) {
      const googleProfile = user.providerData.find(
        (provider) => provider.providerId === 'google.com' && provider.photoURL
      );
      if (googleProfile && googleProfile.photoURL) {
        return googleProfile.photoURL;
      }
    }
    if (user?.photoURL) return user.photoURL;
    return null;
  }

  const getDisplayName = (user) => {
    return user?.displayName || user?.email?.split('@')[0] || 'User'
  }

  const handleLogout = () => {
    toast.info('Logging out...', {
      position: "top-center",
      autoClose: 1500,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
    setTimeout(() => {
      logout();
    }, 1500);
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
    <div className={`profile-container ${animate ? 'animate' : ''}`}>
      <div className="profile-card">
        {/* Floating particles background */}
        <div className="particles">
          {[...Array(30)].map((_, i) => (
            <div key={i} className="particle" style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`
            }}></div>
          ))}
        </div>
        
        {/* Glow effect */}
        <div className={`profile-glow ${hoverEffect ? 'active' : ''}`}></div>
        
        <div className="profile-header">
          <div 
            className="profile-image-container"
            onMouseEnter={() => setHoverEffect(true)}
            onMouseLeave={() => setHoverEffect(false)}
          >
            <div className="avatar-border"></div>
            <div className="avatar-sparkles">
              {[...Array(8)].map((_, i) => (
                <IoSparkles key={i} className={`sparkle sparkle-${i}`} />
              ))}
            </div>
            <img
              src={getProfileImage(profile)}
              alt={getDisplayName(profile)}
              className="profile-avatar"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(getDisplayName(profile))}&size=200`;
              }}
            />
          </div>
          <h2>
            {getDisplayName(profile)}
            <span className="name-underline"></span>
          </h2>
          <p className="profile-subtitle">Welcome back!</p>
        </div>
        
        <div className="profile-info">
          {profile?.email && (
            <div className="info-item">
              <div className="info-icon-container">
                <FaEnvelope className="info-icon" />
              </div>
              <span>{profile.email}</span>
            </div>
          )}
          {profile?.displayName && (
            <div className="info-item">
              <div className="info-icon-container">
                <FaUser className="info-icon" />
              </div>
              <span>{profile.displayName}</span>
            </div>
          )}
          {profile?.providerData && profile.providerData.some(provider => provider.providerId === 'google.com') && (
            <div className="info-item google-connected">
              <div className="info-icon-container">
                <FaGoogle className="info-icon" />
              </div>
              <span>Connected with Google</span>
            </div>
          )}
          <div className="info-item">
            <div className="info-icon-container">
              <FaPalette className="info-icon" />
            </div>
            <span>Henna Artist</span>
          </div>
        </div>
        
        <div className="profile-actions">
          <button className="logout-button" onClick={handleLogout}>
            <FaSignOutAlt /> Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserProfile