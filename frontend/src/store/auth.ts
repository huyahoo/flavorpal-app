// src/store/auth.ts
import { defineStore } from 'pinia';
import type { User, UserCreatePayload, UserUpdatePayload, LoginCredentials } from '../types';
import { registerUserApi, loginUserApi, fetchCurrentUserApi, updateUserApi } from '../services/authService';
import apiClient from '../services/apiClient';

import { useUserProfileStore } from './userProfileStore';
import { useHistoryStore } from './historyStore';
import { useScanStore } from './scanStore';

export interface AuthState {
  user: User | null;          // Holds the authenticated user object from the backend
  token: string | null;       // Holds the JWT or session token
  loading: boolean;
  error: string | null;       // Stores API error messages
  isAuthenticatedInitiallyChecked: boolean; // To track if initial auth check is done
}

const AUTH_TOKEN_KEY = 'flavorpal_auth_token_v1';
const USER_DATA_KEY = 'flavorpal_user_data_v1';

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null, 
    token: null, 
    loading: false,
    error: null,
    isAuthenticatedInitiallyChecked: false,
  }),

  getters: {
    isAuthenticated: (state): boolean => !!state.token && !!state.user,
    currentUsername: (state): string | null => state.user?.username || null,
    healthFlags: (state): string[] => {
        return state.user?.health_flags || [];
    },
    userId: (state): number => state.user?.id || -1,
  },

  actions: {
    setAuthHeader(token: string | null) {
      if (token) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } else {
        delete apiClient.defaults.headers.common['Authorization'];
      }
    },

    async initializeAuth() {
      this.loading = true;
      this.isAuthenticatedInitiallyChecked = false;

      const response = await fetchCurrentUserApi(); 
      
      if (response.code === 200 && response.data) {
        this.user = response.data;
        this.token = localStorage.getItem('flavorpal_app_auth_token_v11'); // Service's key
      } else {
        this.user = null;
        this.token = null;
      }

      this.isAuthenticatedInitiallyChecked = true;
      this.loading = false;
    },

    async register(payload: UserCreatePayload): Promise<{ success: boolean; message?: string }> {
      this.loading = true;
      this.error = null;

      try {
        const response = await registerUserApi(payload);
        if (response.code === 201 && response.data) {
          this.loading = false;
          return { success: true, message: response.msg || "Registration successful!" };
        } else {
          throw new Error(response.msg || 'Registration failed due to server error.');
        }
      } catch (err: any) {
        this.error = err.response.data.detail || err.message || err.msg || err.detail ||'An unknown registration error occurred.';
        console.error('Registration error in store:', err);
        this.loading = false;
        return { success: false, message: this.error ?? undefined };
      }
    },

    async login(credentials: LoginCredentials): Promise<boolean> {
      this.loading = true;
      this.error = null;

      try {
        const tokenResponse = await loginUserApi(credentials);

        if (tokenResponse.code === 200 && tokenResponse.data.access_token) {
          this.token = tokenResponse.data.access_token;

          this.setAuthHeader(this.token);

          // After getting token, fetch user details
          const userResponse = await fetchCurrentUserApi();
          console.log('User response:', userResponse);
          if (userResponse.code === 200 && userResponse.data) {
            this.user = userResponse.data;

            localStorage.setItem(USER_DATA_KEY, JSON.stringify(this.user));

            // Load data for other stores now that user is authenticated
            const userProfileStore = useUserProfileStore();
            const historyStore = useHistoryStore();
            userProfileStore.loadUserProfile(); 
            historyStore.loadInitialData(); 
            return true;
          } else {
            throw new Error(userResponse.msg || "Failed to fetch user details after login.");
          }
        } else {
          throw new Error(tokenResponse.msg || 'Login failed: Could not get token.');
        }
      } catch (err: any) {
        this.error = err.msg || err.detail || err.message || 'Login error.';
        console.error('Login error:', err);
        this.token = null;
        this.user = null;
        this.setAuthHeader(null);
        return false;
      } finally {
        this.loading = false;
      }
    },

    async logout(): Promise<void> {
      // Clear other stores' data
      const userProfileStore = useUserProfileStore();
      const historyStore = useHistoryStore();
      const scanStore = useScanStore();
      userProfileStore.clearUserProfile();
      historyStore.clearHistoryData();
      scanStore.clearScanDataOnLogout();

      this.user = null;
      this.token = null;
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(USER_DATA_KEY);
      this.setAuthHeader(null); // Clear auth header in apiClient
    },

    async updateUsername(newUsername: string): Promise<boolean> {
      if (!this.user || !this.token || this.userId === null) { return false; }
      this.loading = true; this.error = null;
      try {
        const response = await updateUserApi(this.userId, { username: newUsername });
        if (response.code === 200 && response.data) {
          this.user = response.data;
          localStorage.setItem(USER_DATA_KEY, JSON.stringify(this.user));
          return true;
        } else { throw new Error(response.msg); }
      } catch (err: any) { this.error = err.msg || "Update username failed."; return false; }
      finally { this.loading = false; }
    },

    async updateHealthFlags(flags: string[]): Promise<boolean> {
      if (!this.user || !this.token) { return false; }
      this.loading = true; this.error = null;
      try {
        const response = await updateUserApi(this.userId, { health_flags: flags });
         if (response.code === 200 && response.data) {
          this.user = response.data;
          localStorage.setItem(USER_DATA_KEY, JSON.stringify(this.user));
          return true;
        } else { throw new Error(response.msg); }
      } catch (err: any) { this.error = err.msg || "Update health flags failed."; return false; }
      finally { this.loading = false; }
    },
  },
});