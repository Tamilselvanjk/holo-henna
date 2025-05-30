import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../utils/firebase';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userData = {
          name: user.displayName,
          email: user.email,
          picture: user.photoURL,
          googleId: user.uid,
        };
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    });

    return () => unsubscribe();
  }, []);

  const initiateGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const { user } = result;

      const userData = {
        name: user.displayName,
        email: user.email,
        picture: user.photoURL,
        googleId: user.uid,
      };

      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Store the token
      const token = await user.getIdToken();
      localStorage.setItem('token', token);
      
      navigate('/profile');
      toast.success('Successfully logged in!');
    } catch (error) {
      console.error('Google login failed:', error);
      toast.error('Login failed');
      throw error;
    }
  };

  const logout = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
        toast.success('Successfully logged out!');
      })
      .catch((error) => {
        console.error('Logout failed:', error);
        toast.error('Logout failed');
      });
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, initiateGoogleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};