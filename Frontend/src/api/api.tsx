import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5173/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchStories = (page = 1, limit = 10) =>
  API.get(`/stories?page=${page}&limit=${limit}`);

export const fetchStoryById = (id) => API.get(`/stories/${id}`);

export const toggleBookmark = (id) => API.post(`/stories/${id}/bookmark`);

export const registerUser = (data) => API.post('/auth/register', data);

export const loginUser = (data) => API.post('/auth/login', data);

export const getMe = () => API.get('/auth/me');

export const triggerScrape = () => API.post('/scrape');

export default API;
