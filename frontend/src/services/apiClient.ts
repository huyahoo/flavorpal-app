// src/services/apiClient.ts
import axios from 'axios';
import { useAuthStore } from '@/store/auth';

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = 'https://54.238.179.149:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request Interceptor: To add Authorization token to requests
apiClient.interceptors.request.use(
  (config) => {
    // Get token from Pinia store if user is logged in
    // Must be done carefully to avoid issues if store is not yet initialized
    // or if this runs outside Vue setup context.
    // A common pattern is for service functions to get the token and add it.
    // However, for a global interceptor:
    try {
      const authStore = useAuthStore(); // Get store instance
      if (authStore.token) {
        config.headers.Authorization = `Bearer ${authStore.token}`;
      }
    } catch (e) {
      // This can happen if the interceptor runs before Pinia is fully initialized,
      // or if called from outside a component setup context.
      // Fallback to localStorage if store access fails here, though store should be source of truth.
      const tokenFromStorage = localStorage.getItem('flavorpal_auth_token');
      if (tokenFromStorage) {
        config.headers.Authorization = `Bearer ${tokenFromStorage}`;
      }
      console.warn('AuthStore not available in apiClient interceptor, using localStorage token if present.');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: To handle global errors like 401 Unauthorized
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark to prevent infinite loops
      console.error('API Error: 401 Unauthorized. Attempting to handle...');
      try {
        const authStore = useAuthStore();
        // Here could implement token refresh logic if backend supports it.
        // For now, we'll just log out the user.
        console.log('Logging out due to 401 error.');
        await authStore.logout(); // Ensure logout clears token and redirects
        // router.push('/login'); // Or directly navigate if logout doesn't always redirect
        return Promise.reject(error); // Important to reject after handling
      } catch (e) {
        console.error('Error during 401 handling logout:', e);
        return Promise.reject(error);
      }
    }
    // For other errors, log them
    if (error.response) {
      console.error('API Error Response:', error.response.data);
    } else if (error.request) {
      console.error('API No Response:', error.request);
    } else {
      console.error('API Request Setup Error:', error.message);
    }
    return error.response;
  }
);

export default apiClient;