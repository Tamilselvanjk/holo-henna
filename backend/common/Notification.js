import React from 'react';
import { createRoot } from 'react-dom/client';
import { FaCheckCircle, FaExclamationCircle, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Notification = ({ title, message, type = 'success', onClose }) => {
  return (
    <div className={`notification ${type}`}>
      <div className="notification-icon">
        {type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />}
      </div>
      <div className="notification-content">
        <h4>{title}</h4>
        <p>{message}</p>
      </div>
      <button className="notification-close" onClick={onClose}>
        <FaTimes />
      </button>
    </div>
  );
};

export const showNotification = (title, message, type = 'success') => {
  toast[type](
    <div>
      <strong>{title}</strong>
      <div>{message}</div>
    </div>,
    {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    }
  );
};

export default Notification;
