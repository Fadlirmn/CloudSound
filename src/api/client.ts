import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { ENDPOINTS } from './endpoints';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
client.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor for Auto-Logout and Token Refresh logic
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const currentToken = useAuthStore.getState().token;
        // Attempt to refresh token (endpoint from PRD)
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}${ENDPOINTS.AUTH.REFRESH}`, {}, {
          headers: { Authorization: `Bearer ${currentToken}` }
        });
        
        const { token, user } = response.data;
        useAuthStore.getState().login(user, token);
        
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return client(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout
        useAuthStore.getState().logout();
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default client;
export { client };
