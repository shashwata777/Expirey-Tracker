import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Attach JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('expiryguard_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // If payload is FormData, remove Content-Type header so browser generates multipart boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling 401 auth expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('expiryguard_token');
      localStorage.removeItem('expiryguard_user');
      if (
        window.location.pathname !== '/login' &&
        window.location.pathname !== '/register'
      ) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Item Service Layer connected to backend & MongoDB
export const itemService = {
  async getItems(params = {}) {
    const res = await api.get('/items', { params });
    return res.data;
  },

  async getStats() {
    const res = await api.get('/items/stats');
    return res.data;
  },

  async getItemById(id) {
    const res = await api.get(`/items/${id}`);
    return res.data;
  },

  async extractDetails(formData) {
    const res = await api.post('/items/extract', formData);
    return res.data;
  },

  async createItem(itemData) {
    const res = await api.post('/items', itemData);
    return res.data;
  },

  async updateItem(id, itemData) {
    const res = await api.put(`/items/${id}`, itemData);
    return res.data;
  },

  async deleteItem(id) {
    const res = await api.delete(`/items/${id}`);
    return res.data;
  },
};

// Auth Service Layer
export const authService = {
  async login(email, password) {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },

  async register(name, email, password) {
    const res = await api.post('/auth/register', { name, email, password });
    return res.data;
  },

  async googleLogin(googleData) {
    const res = await api.post('/auth/google', googleData);
    return res.data;
  },

  async getMe() {
    const res = await api.get('/auth/me');
    return res.data;
  },

  async updateProfile(profileData) {
    const res = await api.put('/users/profile', profileData);
    return res.data;
  },

  async updatePassword(passwords) {
    const res = await api.put('/users/password', passwords);
    return res.data;
  },

  async updatePreferences(preferences) {
    const res = await api.put('/users/preferences', { preferences });
    return res.data;
  },
};

export default api;
