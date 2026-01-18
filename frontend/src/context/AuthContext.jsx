import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

  useEffect(() => {
    const initAuth = () => {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      }
      axios.defaults.baseURL = API_URL;
      setLoading(false);
    };
    initAuth();
  }, [API_URL]);

  const login = async ({ email, password }) => {
    try {
      const res = await axios.post('/token/', { email, password });
      const { access, refresh, user: userData } = res.data;

      localStorage.setItem('token', access);
      if (refresh) localStorage.setItem('refresh_token', refresh);
      
      const userObj = userData || { email, username: email.split('@')[0] };
      localStorage.setItem('user', JSON.stringify(userObj));

      axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      setUser(userObj);
      setToken(access);
      return userObj;
    } catch (error) {
      logout();
      throw new Error(error.response?.data?.detail || 'Login failed');
    }
  };

  const register = async (data) => {
    try {
      await axios.post('/register/', data);
      return await login({ email: data.email, password: data.password });
    } catch (error) {
      const msg = error.response?.data?.error || error.response?.data?.detail || 'Registration failed';
      throw new Error(typeof msg === 'object' ? JSON.stringify(msg) : msg);
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setToken(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <Loader2 className="animate-spin" size={48} color="#3b82f6" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isAuthenticated: !!user && !!token }}>
      {children}
    </AuthContext.Provider>
  );
};
