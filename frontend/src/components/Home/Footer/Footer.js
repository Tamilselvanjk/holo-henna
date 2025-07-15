import React from 'react'
import { Link } from 'react-router-dom'
import {
  FaHands,
  FaChevronRight,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaPaperPlane,
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
} from 'react-icons/fa'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer" id="contact">
      <div className="footer-content container">
        {/* Brand Info */}
        <div className="footer-section brand-info">
          <h3 className="footer-title">
            <FaHands className="icon" /> Mehndi Artistry
          </h3>
          <p className="brand-description">
            Professional Mehndi services for all your special occasions.
          </p>
          <div className="social-icons">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://www.instagram.com/holo_henna01?igsh=ZDJkbXd2ZXpzNDlm"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.youtube.com/@bridalmehndi9401"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <FaYoutube />
            </a>
            <a
              href="https://wa.me/919600846892"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <FaWhatsapp />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section quick-links">
          <h3 className="footer-title">Quick Links</h3>
          <ul className="footer-links">
            <li>
              <Link to="/">
                <FaChevronRight className="icon" /> Home
              </Link>
            </li>
            <li>
              <Link to="/gallery">
                <FaChevronRight className="icon" /> Gallery
              </Link>
            </li>
            <li>
              <Link to="/shop">
                <FaChevronRight className="icon" /> Shop
              </Link>
            </li>
            <li>
              <Link
                to="#contact"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById('contact').scrollIntoView({
                    behavior: 'smooth',
                  })
                }}
              >
                <FaChevronRight className="icon" /> Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section contact-info">
          <h3 className="footer-title">Contact Info</h3>
          <ul className="contact-details">
            <li>
              <FaMapMarkerAlt className="icon" />
              <span>Holo Henna Art, HSR Layout, Bengaluru</span>
            </li>
            <li>
              <FaEnvelope className="icon" />
              <span>info@mehndiartistry.com</span>
            </li>
            <li>
              <FaPhone className="icon" />
              <span>(+91) 96008-46892</span>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="footer-section newsletter">
          <h3 className="footer-title">Newsletter</h3>
          <p>Subscribe to get updates on special offers and events.</p>
          <div className="newsletter-form">
            <div className="newsletter-input">
              <FaEnvelope className="icon" />
              <input type="email" placeholder="Your email address" />
            </div>
            <button className="subscribe-btn">
              Subscribe <FaPaperPlane className="icon" />
            </button>
          </div>
        </div>
      </div>

      <div className="copyright">
        <div className="container">
          <p>&copy; 2025 Mehndi Artistry. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
