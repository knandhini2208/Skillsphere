import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // for refresh token cookie
});

// ── Request interceptor: attach access token ──────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: handle 401 and refresh ──────────────────────
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await api.post('/auth/refresh-token');
        const newToken = data.accessToken;
        localStorage.setItem('accessToken', newToken);
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Show error toast (except 401 handled above)
    if (error.response?.status !== 401) {
      const message = error.response?.data?.message || 'Something went wrong';
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

// ── Auth API ──────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.get('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  verifyEmail: (token) => api.get(`/auth/verify-email/${token}`),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.put(`/auth/reset-password/${token}`, { password }),
  setup2FA: () => api.get('/auth/2fa/setup'),
  enable2FA: (data) => api.post('/auth/2fa/enable', data),
  verify2FA: (data) => api.post('/auth/2fa/verify', data),
};

// ── Users API ─────────────────────────────────────────────────────────
export const userAPI = {
  updateProfile: (data) => api.put('/users/profile', data),
  updateFreelancerProfile: (data) => api.put('/users/freelancer', data),
  getFreelancerProfile: (userId) => api.get(`/users/freelancer/${userId}`),
  searchFreelancers: (params) => api.get('/users/freelancers/search', { params }),
  changePassword: (data) => api.put('/users/change-password', data),
};

// ── Gigs API ──────────────────────────────────────────────────────────
export const gigAPI = {
  getGigs: (params) => api.get('/gigs', { params }),
  getGigById: (id) => api.get(`/gigs/${id}`),
  createGig: (data) => api.post('/gigs', data),
  updateGig: (id, data) => api.put(`/gigs/${id}`, data),
  deleteGig: (id) => api.delete(`/gigs/${id}`),
  getMyGigs: () => api.get('/gigs/my'),
  inviteFreelancer: (gigId, freelancerId) => api.put(`/gigs/${gigId}/invite`, { freelancerId }),
};

// ── Proposals API ─────────────────────────────────────────────────────
export const proposalAPI = {
  submit: (data) => api.post('/proposals', data),
  getMyProposals: () => api.get('/proposals/my'),
  getProposalsForGig: (gigId) => api.get(`/proposals/gig/${gigId}`),
  accept: (id, note) => api.put(`/proposals/${id}/accept`, { note }),
  reject: (id, note) => api.put(`/proposals/${id}/reject`, { note }),
};

// ── Payments API ──────────────────────────────────────────────────────
export const paymentAPI = {
  createOrder: (data) => api.post('/payments/create-order', data),
  verify: (data) => api.post('/payments/verify', data),
  release: (paymentId) => api.post(`/payments/release/${paymentId}`),
  getHistory: () => api.get('/payments/history'),
};

// ── Reviews API ───────────────────────────────────────────────────────
export const reviewAPI = {
  create: (data) => api.post('/reviews', data),
  getForUser: (userId) => api.get(`/reviews/user/${userId}`),
};

// ── Messages API ──────────────────────────────────────────────────────
export const messageAPI = {
  getConversations: () => api.get('/messages/conversations'),
  createConversation: (data) => api.post('/messages/conversations', data),
  getMessages: (conversationId) => api.get(`/messages/${conversationId}`),
  sendMessage: (conversationId, data) => api.post(`/messages/${conversationId}`, data),
};

// ── Notifications API ─────────────────────────────────────────────────
export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
};

// ── Admin API ─────────────────────────────────────────────────────────
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  suspendUser: (id, reason) => api.put(`/admin/users/${id}/suspend`, { reason }),
  unsuspendUser: (id) => api.put(`/admin/users/${id}/unsuspend`),
  approveGig: (id) => api.put(`/admin/gigs/${id}/approve`),
  verifyFreelancer: (userId) => api.put(`/admin/freelancers/${userId}/verify`),
};

export default api;
