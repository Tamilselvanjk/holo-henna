import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa'

import { useMobileMenu } from '../../hooks/useMobileMenu'
import { toast } from 'react-toastify'
import './Header.css'
import { useAuth } from '../../../context/AuthContext'

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const location = useLocation()
  const { isMenuOpen, toggleMenu, closeMenuOnLinkClick } = useMobileMenu()
  const navigate = useNavigate()

  const isActive = (path) => location.pathname === path

  const scrollToContact = (e) => {
    e.preventDefault()
    const footerSection = document.getElementById('contact')
    if (footerSection) {
      footerSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
      closeMenuOnLinkClick()
    }
  }

  // Always prefer Google account image if available

  const getProfileImage = (user) => {
    // Prefer Google account image from providerData
    if (user?.providerData && user.providerData.length > 0) {
      const googleProfile = user.providerData.find(
        (provider) => provider.providerId === 'google.com' && provider.photoURL
      );
      if (googleProfile && googleProfile.photoURL) {
        return googleProfile.photoURL;
      }
    }
    // Fallback to user.photoURL if present
    if (user?.photoURL) return user.photoURL;
    // If no image, return null (we'll handle this in the img tag)
    return null;
  }

   const getDisplayName = (user) => {
    return user?.displayName || user?.email?.split('@')[0] || 'User';
  }


  const handleLogin = () => {
    navigate('/login', { replace: true })
  }

  return (
    <header className="header">
      <div className="top-bar">
        <h1>HOLO HENNA MEHNDI ART</h1>
      </div>
      <nav className="navbar-head">
        <div className="menu">
          <span className="brand">Mehndi Artistry</span>

          <div className="menu-icon" onClick={toggleMenu}>
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </div>

          <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
            <li>
              <Link
                to="/home"
                className={isActive('/home') ? 'active' : ''}
                onClick={closeMenuOnLinkClick}
              >
                HOME
              </Link>
            </li>
            <li>
              <Link
                to="/gallery"
                className={isActive('/gallery') ? 'active' : ''}
                onClick={closeMenuOnLinkClick}
              >
                GALLERY
              </Link>
            </li>
            <li>
              <Link
                to="/shop"
                className={isActive('/shop') ? 'active' : ''}
                onClick={closeMenuOnLinkClick}
              >
                SHOP
              </Link>
            </li>
            <li>
              <a
                href="#contact"
                onClick={scrollToContact}
                className={isActive('/contact') ? 'active' : ''}
              >
                CONTACT
              </a>
            </li>
          </ul>

          <div className="nav-right">
            {isAuthenticated && user ? (
              <div className="profile-section">
                <div
                  className="profile-icon"
                  onClick={() => navigate('/profile', { replace: true })}
                >
                  <img
                    src={getProfileImage(user)}
                    alt={getDisplayName(user)}
                    className="profile-avatar"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(getDisplayName(user))}&size=200`;
                    }}
                  />
                </div>
                <button onClick={logout} className="logout-btn">
                  <FaSignOutAlt />
                </button>
              </div>
            ) : (
              <button onClick={handleLogin} className="login-button">
                <FaUser /> Login
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
