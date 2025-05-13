import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Add editHistory to track field edits
  const [editHistory, setEditHistory] = useState(() => {
    const savedHistory = localStorage.getItem('editHistory');
    return savedHistory ? JSON.parse(savedHistory) : {
      name: false,
      email: false,
      phone: false
    };
  });

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = () => {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const loginWithGoogle = async (code) => {
    try {
      // Mock successful login for testing
      const mockUser = {
        id: '123',
        name: 'Test User',
        email: 'test@gmail.com',
        picture: 'https://lh3.googleusercontent.com/a/default-user'
      };

      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('editHistory');
    localStorage.removeItem('profileConfirmed');
    localStorage.removeItem('profileData');
    setEditHistory({
      name: false,
      email: false,
      phone: false
    });
  };

  const updateUserProfile = async (updates) => {
    try {
      const updatedUser = {
        ...user,
        ...updates
      };
      
      // Update edit history for the field being edited
      const updatedHistory = {
        ...editHistory,
        ...Object.keys(updates).reduce((acc, key) => ({
          ...acc,
          [key]: true
        }), {})
      };
      
      // Save both user data and edit history
      localStorage.setItem('user', JSON.stringify(updatedUser));
      localStorage.setItem('editHistory', JSON.stringify(updatedHistory));
      
      setUser(updatedUser);
      setEditHistory(updatedHistory);
      
      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: error.message };
    }
  };

  if (isLoading) {
    return null; // or a loading spinner
  }

  const value = {
    user,
    isAuthenticated,
    loginWithGoogle,
    logout,
    updateUserProfile,
    editHistory
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
