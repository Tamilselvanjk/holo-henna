import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Profile.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <img src={user.photoURL} alt={user.displayName} className="profile-avatar" />
          <h2>{user.displayName}</h2>
          <p>{user.email}</p>
        </div>
        
        <div className="profile-actions">
          <button onClick={() => navigate('/orders')} className="profile-btn orders-btn">
            <i className="fas fa-shopping-bag"></i> My Orders
          </button>
          <button onClick={handleLogout} className="profile-btn logout-btn">
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
