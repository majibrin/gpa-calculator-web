import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, ArrowRight, Loader2, AlertTriangle } from 'lucide-react';
import './AuthForm.css';

const AuthForm = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        await login({ email: formData.email, password: formData.password });
      } else {
        await register({ 
          username: formData.username, 
          email: formData.email, 
          password: formData.password 
        });
      }
      navigate('/');
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="logo-container">
          <div className="logo-subtitle">Study Assistant GPA Tool</div>
        </div>

        <header className="auth-header">
          <h1>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
          <p className="auth-subtitle">
            {isLogin ? 'Sign in to access your GPA Calculator' : 'Join the Study Assistant community'}
          </p>
        </header>

        {error && (
          <div className="auth-error" role="alert">
            <AlertTriangle size={18} className="error-icon" />
            <div className="error-content"><strong>Error:</strong> {error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                type="email" name="email" placeholder="you@example.com"
                value={formData.email} onChange={handleChange} required
                disabled={loading} className="form-input"
              />
            </div>
          </div>

          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Username</label>
              <div className="input-wrapper">
                <User size={18} className="input-icon" />
                <input
                  type="text" name="username" placeholder="Choose a username"
                  value={formData.username} onChange={handleChange} required
                  disabled={loading} className="form-input"
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                type="password" name="password" placeholder="••••••••"
                value={formData.password} onChange={handleChange} required
                disabled={loading} className="form-input"
              />
            </div>
          </div>

          <div className="submit-container">
            <button type="submit" disabled={loading} className="submit-button">
              {loading ? (
                <Loader2 className="button-spinner animate-spin" size={20} />
              ) : (
                <div className="btn-content">
                  <span>{isLogin ? 'Login' : 'Register'}</span>
                  <ArrowRight size={18} />
                </div>
              )}
            </button>
          </div>
        </form>

        <div className="auth-toggle">
          <p>{isLogin ? "Don't have an account?" : 'Already have an account?'}</p>
          <button
            type="button" className="toggle-button"
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
          >
            {isLogin ? 'Sign Up' : 'Back to Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
