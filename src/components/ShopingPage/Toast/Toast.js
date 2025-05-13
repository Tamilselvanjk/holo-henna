import React from 'react'
import './Toast.css'

const Toast = ({ show, message, onClose }) => {
  return (
    <div className={`popup-overlay ${show ? 'show' : ''}`}>
      <div className="popup-box">
        <span className="close-btn" onClick={onClose}>
          &times;
        </span>
        <p className="popup-message">{message}</p>
      </div>
    </div>
  )
}

export default Toast
