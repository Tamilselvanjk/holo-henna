  import React from 'react'
  import { Link, useNavigate, useLocation } from 'react-router-dom'
  import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaShoppingCart } from 'react-icons/fa'
  import { useMobileMenu } from '../../hooks/useMobileMenu'
  import { toast } from 'react-toastify'
  import './Header.css'
  import { useAuth } from '../../../context/AuthContext'

  const Header = () => {
    const { user, isAuthenticated, logout } = useAuth()
    const location = useLocation()
    const { isMenuOpen, toggleMenu, closeMenuOnLinkClick } = useMobileMenu()
    const navigate = useNavigate()
    const [isHovering, setIsHovering] = React.useState(false)

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
      if (user?.providerData && user.providerData.length > 0) {
        const googleProfile = user.providerData.find(
          (provider) => provider.providerId === 'google.com' && provider.photoURL
        )
        if (googleProfile && googleProfile.photoURL) {
          return googleProfile.photoURL
        }
      }
      if (user?.photoURL) return user.photoURL
      return null
    }

    const getDisplayName = (user) => {
      return user?.displayName || user?.email?.split('@')[0] || 'User'
    }

    const handleLogin = () => {
      navigate('/login', { replace: true })
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
      })
      setTimeout(() => {
        logout()
      }, 1500)
    }

    return (
      <header className="header">
        <div className="top-bar">
          <h1 className="logo-text">HOLO HENNA MEHNDI ART</h1>
        </div>
        <nav className="navbar-head">
          <div className="menu">
            <Link to="/" className="brand">
              <span className="brand-text">Mehndi Artistry</span>
              <span className="brand-decoration"></span>
            </Link>

            <div 
              className={`menu-icon ${isMenuOpen ? 'open' : ''}`} 
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <div className="menu-line top"></div>
              <div className="menu-line middle"></div>
              <div className="menu-line bottom"></div>
            </div>

            <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
              <li>
                <Link
                  to="/home"
                  className={`nav-link ${isActive('/home') ? 'active' : ''}`}
                  onClick={closeMenuOnLinkClick}
                >
                  <span className="link-text">HOME</span>
                  <span className="link-underline"></span>
                </Link>
              </li>
              <li>
                <Link
                  to="/gallery"
                  className={`nav-link ${isActive('/gallery') ? 'active' : ''}`}
                  onClick={closeMenuOnLinkClick}
                >
                  <span className="link-text">GALLERY</span>
                  <span className="link-underline"></span>
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  className={`nav-link ${isActive('/shop') ? 'active' : ''}`}
                  onClick={closeMenuOnLinkClick}
                >
                  <span className="link-text">SHOP</span>
                  <span className="link-underline"></span>
                </Link>
              </li>
              <li>
                <a
                  href="#contact"
                  className={`nav-link ${isActive('/contact') ? 'active' : ''}`}
                  onClick={scrollToContact}
                >
                  <span className="link-text">CONTACT</span>
                  <span className="link-underline"></span>
                </a>
              </li>
            </ul>

            <div className="nav-right">
              {isAuthenticated && user ? (
                <div className="profile-section">
                  <div
                    className="profile-icon"
                    onClick={() => navigate('/profile', { replace: true })}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    <img
                      src={getProfileImage(user)}
                      alt={getDisplayName(user)}
                      className="profile-avatar"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(getDisplayName(user))}&size=200`
                      }}
                    />
                    {isHovering && (
                      <div className="profile-tooltip">
                        {getDisplayName(user)}
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={handleLogout} 
                    className="logout-btn"
                    aria-label="Logout"
                  >
                    <FaSignOutAlt />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={handleLogin} 
                  className="login-button"
                  aria-label="Login"
                >
                  <FaUser className="login-icon" />
                  <span>Login</span>
                </button>
              )}
            </div>
          </div>
        </nav>
      </header>
    )
  }

  export default Header