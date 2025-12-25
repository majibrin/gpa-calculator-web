// src/components/Header.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import favicon from '../assets/favicon.ico'; // replace with your actual favicon path
import logo from '../assets/logo.png';        // replace with your actual logo path
import './Dashboard.css';

const Header = () => {
  const { user, logout } = useAuth();

  if (!user) {
    // Loading fallback with favicon
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80px',
        background: '#f8f9fa'
      }}>
        <img src={favicon} alt="Loading..." style={{ width: 32, height: 32 }} />
      </div>
    );
  }

  return (
    <header className="dashboard-header">
      <div className="logo-user">
        <img src={logo} alt="Thinkora Logo" className="header-logo" />
        <div className="user-info">
          Welcome, {user.username || user.email}
        </div>
      </div>

      <div className="header-actions">
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
