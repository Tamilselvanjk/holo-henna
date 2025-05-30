import React from 'react'
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
              href="https://wa.me/918618439883"
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
              <a href="/">
                <FaChevronRight className="icon" /> Home
              </a>
            </li>
            <li>
              <a href="/gallery">
                <FaChevronRight className="icon" /> Gallery
              </a>
            </li>
            <li>
              <a href="/shop">
                <FaChevronRight className="icon" /> Shop
              </a>
            </li>
            <li>
              <a href="#contact">
                <FaChevronRight className="icon" /> Contact
              </a>
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
              <span>(+91) 86184-39883</span>
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
