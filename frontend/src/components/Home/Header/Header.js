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

  const getProfileImage = (user) => {
    if (user?.photoURL) return user.photoURL
    if (user?.displayName) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(
        user.displayName
      )}&size=80&background=4285f4&color=fff`
    }
    return '/webimg/default-avatar.png'
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
                    alt={user.displayName || 'Profile'}
                    className="header-profile-image"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = '/webimg/default-avatar.png'
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
