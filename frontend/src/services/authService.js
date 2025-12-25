// ~/Thinkora/src/services/authService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  timeout: import.meta.env.VITE_API_TIMEOUT || 10000,
  headers: { 'Content-Type': 'application/json' },
});

const authService = {
  // LOGIN with email + password
  login: async ({ email, password }) => {
    const response = await api.post('/token/', { email, password });

    const { access, refresh } = response.data;

    // Store tokens
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);

    // Minimal user object
    const user = { email };
    localStorage.setItem('user', JSON.stringify(user));

    return user;
  },

  // REGISTER new user
  register: async ({ username, email, password }) => {
    const response = await api.post('/register/', { username, email, password });

    // Auto-login after registration
    return await authService.login({ email, password });
  },

  // LOGOUT
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },

  // GET CURRENT USER
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // AUTH CHECK
  isAuthenticated: () => !!localStorage.getItem('access_token'),

  // REFRESH TOKEN
  refreshToken: async () => {
    const refresh = localStorage.getItem('refresh_token');
    if (!refresh) throw new Error('No refresh token');

    const response = await api.post('/token/refresh/', { refresh });
    const { access } = response.data;

    localStorage.setItem('access_token', access);
    return access;
  },
};

export default authService;
