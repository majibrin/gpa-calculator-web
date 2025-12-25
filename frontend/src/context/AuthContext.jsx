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
    if (authService.isAuthenticated()) {
      setUser(authService.getCurrentUser());
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const currentUser = await authService.login(credentials);
      setUser(currentUser);
      return { success: true, user: currentUser };
    } catch (err) {
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const currentUser = await authService.register(userData);
      setUser(currentUser);
      return { success: true, user: currentUser };
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
    logout,
  };

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <img src="/favicon.ico" alt="Loading..." style={{ width: 64, height: 64 }} />
        <span style={{ marginLeft: 10 }}>Loading Thinkora...</span>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
