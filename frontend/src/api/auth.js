import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

// Create axios instance with default config
const authAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
authAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth functions
export const authService = {
  // Sign up new user
  signup: async (userData) => {
    try {
      console.log('Making signup request to:', `${API_BASE_URL}/auth/signup`);
      console.log('With data:', userData);
      
      const response = await authAPI.post('/auth/signup', userData);
      console.log('Signup response:', response.data);
      
      if (response.data.access_token) {
        localStorage.setItem('authToken', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Signup error:', error);
      console.error('Error response:', error.response);
      
      if (error.response) {
        // Server responded with error
        throw error.response.data || { detail: error.response.statusText || 'Signup failed' };
      } else if (error.request) {
        // Request made but no response
        throw { detail: 'Cannot connect to server. Please make sure the backend is running on http://localhost:8000' };
      } else {
        // Something else happened
        throw { detail: error.message || 'Signup failed' };
      }
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      console.log('Making login request to:', `${API_BASE_URL}/auth/login`);
      console.log('With email:', credentials.email);
      
      const response = await authAPI.post('/auth/login', credentials);
      console.log('Login response:', response.data);
      
      if (response.data.access_token) {
        localStorage.setItem('authToken', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error response:', error.response);
      
      if (error.response) {
        // Server responded with error
        throw error.response.data || { detail: error.response.statusText || 'Login failed' };
      } else if (error.request) {
        // Request made but no response
        throw { detail: 'Cannot connect to server. Please make sure the backend is running on http://localhost:8000' };
      } else {
        // Something else happened
        throw { detail: error.message || 'Login failed' };
      }
    }
  },

  // Get OAuth providers readiness
  getProviders: async () => {
    try {
      const response = await authAPI.get('/auth/providers');
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to load auth providers' };
    }
  },

  // Google OAuth
  googleAuth: async () => {
    try {
      const response = await authAPI.post('/auth/google');
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Google authentication failed' };
    }
  },

  // GitHub OAuth
  githubAuth: async () => {
    try {
      const response = await authAPI.post('/auth/github');
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'GitHub authentication failed' };
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await authAPI.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to get user info' };
    }
  },

  // Logout
  logout: async () => {
    try {
      await authAPI.post('/auth/logout');
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      return { success: true };
    } catch (error) {
      // Even if API call fails, clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      return { success: true };
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  // Get stored user data
  getStoredUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Get stored token
  getStoredToken: () => {
    return localStorage.getItem('authToken');
  }
};

export default authService;
