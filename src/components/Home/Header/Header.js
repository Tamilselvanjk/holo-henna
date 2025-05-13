import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaGoogle } from 'react-icons/fa'
import { useAuth } from '../../../context/AuthContext'
import { useMobileMenu } from '../../hooks/useMobileMenu'
import { toast } from 'react-toastify'
import './Header.css'

const Header = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { isMenuOpen, toggleMenu, closeMenuOnLinkClick } = useMobileMenu()

  const handleProfileClick = () => {
    closeMenuOnLinkClick()
    navigate(user ? '/profile' : '/login')
  }

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Logged out successfully')
      navigate('/login')
    } catch (error) {
      toast.error('Logout failed')
    }
  }

  const isActive = (path) => location.pathname === path

  const renderProfileSection = () => (
    <div className="profile-section">
      <div className="profile-icon" onClick={handleProfileClick}>
        {user?.picture ? (
          <img
            src={user.picture}
            alt={user.name}
            className="header-profile-image"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                user.name || 'User'
              )}&background=4285f4&color=fff`
            }}
          />
        ) : (
          <FaUser className="user-icon" />
        )}
        <span className="profile-name">
          {user?.name || 'Profile'}
          {user?.provider === 'google' && (
            <FaGoogle className="google-verified" />
          )}
        </span>
      </div>
      <button onClick={handleLogout} className="logout-btn">
        <FaSignOutAlt />
      </button>
    </div>
  )

  return (
    <header>
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
              <Link
                to="#contact"
                className={isActive('#contact') ? 'active' : ''}
                onClick={closeMenuOnLinkClick}
              >
                CONTACT
              </Link>
            </li>
          </ul>

          <div className="icons">
            {user ? (
              renderProfileSection()
            ) : (
              <button onClick={handleProfileClick} className="auth-button">
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
