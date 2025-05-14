// src/services/apiClient.ts
import axios from 'axios';

// Your Supabase URL will go here.
// It's good practice to use environment variables for this.
const API_URL = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_PROJECT_URL_HERE/rest/v1'; // Example REST endpoint
const API_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY_HERE';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'apikey': API_KEY,
    'Authorization': `Bearer ${API_KEY}`, // For Supabase, anon key can be used for some public data or auth endpoints
    'Content-Type': 'application/json'
  }
});

// You might want to add interceptors for handling auth tokens
apiClient.interceptors.request.use((config: any) => {
  // Example: Get token from Pinia store if user is logged in
  // const authStore = useAuthStore(); // Assuming you have an authStore
  // if (authStore.token) {
  //   config.headers.Authorization = `Bearer ${authStore.token}`;
  // }
  return config;
}, (error: any) => {
  return Promise.reject(error);
});

export default apiClient;