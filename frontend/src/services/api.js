import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

export const assessmentAPI = {
  submit: (data) => api.post('/assessment/submit', data),
  getMyAssessments: () => api.get('/assessment/my'),
  getById: (id) => api.get(`/assessment/${id}`),
};

export const careerAPI = {
  getAll: () => api.get('/careers'),
  getById: (id) => api.get(`/careers/${id}`),
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  createCareer: (data) => api.post('/admin/careers', data),
  updateCareer: (id, data) => api.put(`/admin/careers/${id}`, data),
  deleteCareer: (id) => api.delete(`/admin/careers/${id}`),
  seedCareers: () => api.post('/admin/seed-careers'),
};

export default api;
