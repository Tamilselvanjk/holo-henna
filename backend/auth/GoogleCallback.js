import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './GoogleCallback.css';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();
  const [status, setStatus] = useState('Authenticating...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        
        if (!code) {
          throw new Error('No authorization code received');
        }

        setStatus('Processing login...');
        const result = await loginWithGoogle(code);
        
        if (result.success) {
          setStatus('Success! Redirecting...');
          setTimeout(() => navigate('/profile'), 1000);
        } else {
          throw new Error(result.error || 'Authentication failed');
        }
      } catch (error) {
        console.error('Login error:', error);
        setStatus('Login failed. Redirecting...');
        setTimeout(() => {
          navigate('/login', { 
            state: { error: 'Google login failed. Please try again.' }
          });
        }, 2000);
      }
    };

    handleCallback();
  }, [navigate, loginWithGoogle]);

  return (
    <div className="google-callback-container">
      <div className="callback-content">
        <div className="loading-spinner"></div>
        <p>{status}</p>
      </div>
    </div>
  );
};

export default GoogleCallback;
