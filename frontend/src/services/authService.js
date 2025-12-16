// frontend/src/services/authService.js

import axios from 'axios';
import { API_BASE_URL } from '../config.js';

export const registerUser = async (userData) => {
    const url = `${API_BASE_URL}/register/`;
    return axios.post(url, userData);
};

export const loginUser = async (credentials) => {
    const url = `${API_BASE_URL}/token/`;
    const response = await axios.post(url, credentials);
    
    if (response.data.access && response.data.refresh) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
    }
    return response;
};

export const logoutUser = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
};

export const getAccessToken = () => {
    return localStorage.getItem('access_token');
};
