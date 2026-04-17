import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
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

export const authApi = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

export const skillsApi = {
  getAll: (categoryId?: number) => 
    categoryId ? api.get(`/skills?category_id=${categoryId}`) : api.get('/skills'),
  getCategories: () => api.get('/skills/categories'),
  getUserSkills: (userId: number) => api.get(`/skills/users/${userId}`),
  searchUsers: (params: { skill_id?: number; q?: string }) => api.get('/skills/users/search', { params }),
  addSkill: (data: any) => api.post('/skills', data),
  updateSkill: (id: number, data: any) => api.patch(`/skills/${id}`, data),
  deleteSkill: (id: number) => api.delete(`/skills/${id}`),
};

export const sessionsApi = {
  getAll: () => api.get('/sessions'),
  getById: (id: number) => api.get(`/sessions/${id}`),
  create: (data: any) => api.post('/sessions', data),
  updateStatus: (id: number, status: string) => api.patch(`/sessions/${id}/status`, { status }),
  getStats: () => api.get('/sessions/stats'),
};

export const reviewsApi = {
  create: (data: any) => api.post('/reviews', data),
  getMentorReviews: (mentorId: number) => api.get(`/reviews/mentor/${mentorId}`),
  getLeaderboard: () => api.get('/reviews/leaderboard'),
};

export const notificationsApi = {
  getAll: () => api.get('/notifications'),
  markAsRead: (id: number) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/read-all'),
};

export default api;
