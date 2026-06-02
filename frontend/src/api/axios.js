import axios from 'axios';

const api = axios.create({
  baseURL: 'https://skillsphere-hs0k.onrender.com/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    return Promise.reject(error);
  }
);

export default api;