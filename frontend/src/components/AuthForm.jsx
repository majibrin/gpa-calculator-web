// ~/Thinkora/src/components/AuthForm.jsx
import React, { useState } from 'react';
import authService from '../services/authService';
import './AuthForm.css';

const AuthForm = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let userData;
      if (isLogin) {
        // Login requires email + password
        const payload = {
          email: formData.email,
          password: formData.password
        };
        userData = await authService.login(payload);
      } else {
        // Registration
        userData = await authService.register(formData);
      }

      // Callback to parent with user info
      onAuthSuccess(userData, localStorage.getItem('access_token'));
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          )}

          {isLogin && (
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          )}

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required={!isLogin} // username only required for signup
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading
              ? isLogin ? 'Logging in...' : 'Signing up...'
              : isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-toggle">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <span
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
