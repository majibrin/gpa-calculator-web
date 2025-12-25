import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthForm.css';
import loader from '../assets/loader.png';

const AuthForm = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await login({ email: formData.email, password: formData.password });
      } else {
        await register({ username: formData.username, email: formData.email, password: formData.password });
      }
      navigate('/'); // redirect to dashboard
    } catch (err) {
      console.error(err.response?.data || err);
      setError(err.response?.data?.detail || err.response?.data?.error || err.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <img src={loader} alt="Thinkora Logo" className="auth-logo" />
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {!isLogin && (
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          )}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? (isLogin ? 'Logging in...' : 'Signing up...') : (isLogin ? 'Login' : 'Sign Up')}
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
