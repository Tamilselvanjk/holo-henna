import React from 'react';
import './Toast.css';

const Toast = ({ show, message, onClose }) => {
  return (
    <div className={`toast-container ${show ? 'show' : ''}`}>
      <div className="toast-content">
        <span className="toast-message">{message}</span>
        <button className="toast-close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
      </div>
    </div>
  );
};

export default Toast;
