import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const itemsAPI = {
  getAll: (params) => api.get('/items', { params }),
  getById: (id) => api.get(`/items/${id}`),
  create: (data) => api.post('/items', data),
  update: (id, data) => api.patch(`/items/${id}`, data),
  delete: (id) => api.delete(`/items/${id}`),
};

export const offersAPI = {
  create: (data) => api.post('/offers', data),
  getForItem: (itemId) => api.get(`/offers/item/${itemId}`),
  accept: (id) => api.patch(`/offers/${id}/accept`),
  reject: (id, data) => api.patch(`/offers/${id}/reject`, data),
};

export const usersAPI = {
  getProfile: (id) => api.get(`/users/${id}`),
  updateProfile: (id, data) => api.patch(`/users/${id}`, data),
  getItems: (id) => api.get(`/users/${id}/items`),
};

export const adminAPI = {
  approveItem: (id) => api.patch(`/admin/items/${id}/approve`),
  rejectItem: (id, data) => api.patch(`/admin/items/${id}/reject`, data),
  verifyJewelry: (id) => api.patch(`/admin/jewelry/${id}/verify`),
  getPendingItems: () => api.get('/admin/items/pending'),
  getPendingJewelry: () => api.get('/admin/jewelry/pending'),
  getStats: () => api.get('/admin/stats'),
};

export default api;
