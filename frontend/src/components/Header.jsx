import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, UserCircle, LayoutDashboard } from 'lucide-react';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="dashboard-header">
      <div className="logo-user">
        <div className="brand-wrapper">
          <LayoutDashboard size={24} color="#3b82f6" />
          <span className="brand-text">Study Assistant</span>
        </div>
        
        <div className="user-info">
          <UserCircle size={18} />
          <span>Welcome, <span>{user?.username || 'Student'}</span></span>
        </div>
      </div>

      <div className="header-actions">
        <button className="logout-btn" onClick={logout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
