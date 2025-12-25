// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(authService.getCurrentUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token exists
    if (authService.isAuthenticated()) {
      setUser(authService.getCurrentUser());
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const userData = await authService.login(credentials);
      setUser(userData);
      return { success: true };
    } catch (err) {
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      await authService.register(userData);
      // Auto-login after registration
      return await login({
        username: userData.username,
        password: userData.password
      });
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout
  };

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        Loading Thinkora...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
