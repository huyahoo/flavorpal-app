// src/store/auth.ts
import { defineStore } from 'pinia';
import type { User, UserCreatePayload, UserUpdatePayload, LoginCredentials } from '../types';
import { registerUserApi, loginUserApi, fetchCurrentUserApi, updateUserApi } from '../services/authService';
import apiClient from '../services/apiClient';

// Import other stores if needed for clearing data on logout
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

const AUTH_TOKEN_KEY = 'flavorpal_auth_token_v1'; // Use a new key if structure changes
const USER_DATA_KEY = 'flavorpal_user_data_v1';

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: JSON.parse(localStorage.getItem(USER_DATA_KEY) || 'null'),
    token: localStorage.getItem(AUTH_TOKEN_KEY),
    loading: false,
    error: null,
    isAuthenticatedInitiallyChecked: false,
  }),

  getters: {
    isAuthenticated: (state): boolean => !!state.token && !!state.user,
    currentUsername: (state): string | null => state.user?.name || null, // Use 'name'
    healthFlags: (state): string[] => {
        // Assuming health_flags in User type is List[UserHealthFlagOut]
        // and UserHealthFlagOut is { id: number, name: string }
        return state.user?.health_flags.map(flag => flag.name) || [];
    },
    userId: (state): number | null => state.user?.id || null, // Backend ID is integer
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
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      const userDataJson = localStorage.getItem(USER_DATA_KEY);

      if (token && userDataJson) {
        try {
          this.token = token;
          this.user = JSON.parse(userDataJson);
          this.setAuthHeader(token); // Set auth header for subsequent API calls
          console.log('AuthStore: Session initialized from localStorage.');
          // Optional: Validate token with backend by fetching current user
          // await this.fetchCurrentUser(); // This would also update user data
        } catch (e) {
          console.error("Error initializing auth from localStorage", e);
          await this.logout(); // Clear corrupted data
        }
      }
      this.isAuthenticatedInitiallyChecked = true;
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
        return { success: false, message: this.error };
      }
    },

    async login(credentials: LoginCredentials): Promise<boolean> {
      this.loading = true;
      this.error = null;
      try {
        const tokenResponse = await loginUserApi(credentials); // API call for token
        if (tokenResponse.code === 200 && tokenResponse.data.access_token) {
          this.token = tokenResponse.data.access_token;
          localStorage.setItem(AUTH_TOKEN_KEY, this.token);
          this.setAuthHeader(this.token);

          // After getting token, fetch user details
          const userResponse = await fetchCurrentUserApi();
          if (userResponse.code === 200 && userResponse.data) {
            this.user = userResponse.data;
            localStorage.setItem(USER_DATA_KEY, JSON.stringify(this.user));

            // Load data for other stores now that user is authenticated
            const userProfileStore = useUserProfileStore();
            const historyStore = useHistoryStore();
            userProfileStore.loadUserProfile();
            historyStore.loadInitialData(); // Loads interactions and stats

            router.push({ name: 'Home' });
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
        this.token = null; // Clear token on error
        this.user = null;
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(USER_DATA_KEY);
        this.setAuthHeader(null);
        return false;
      } finally {
        this.loading = false;
      }
    },

    async fetchCurrentUser() { // Action to refresh user data if needed
        if (!this.token) return; // No token, can't fetch
        this.loading = true;
        try {
            const response = await fetchCurrentUserApi();
            if (response.code === 200 && response.data) {
                this.user = response.data;
                localStorage.setItem(USER_DATA_KEY, JSON.stringify(this.user));
            } else {
                throw new Error(response.msg || "Failed to fetch current user.");
            }
        } catch (error) {
            console.error("Error fetching current user, possibly invalid token:", error);
            // If token is invalid, logout
            await this.logout();
        } finally {
            this.loading = false;
        }
    },

    async logout(): Promise<void> {
      console.log('Logging out user...');

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

      if (router.currentRoute.value.name !== 'Login') {
        router.push({ name: 'Login' });
      }
    },

    async updateUsername(newUsername: string): Promise<boolean> {
      if (!this.user || !this.token) { /* ... */ return false; }
      this.loading = true; this.error = null;
      try {
        const response = await updateUserApi(this.user.id, { name: newUsername });
        if (response.code === 200 && response.data) {
          this.user = response.data;
          localStorage.setItem(USER_DATA_KEY, JSON.stringify(this.user));
          return true;
        } else { throw new Error(response.msg); }
      } catch (err: any) { this.error = err.msg || "Update username failed."; return false; }
      finally { this.loading = false; }
    },

    async updateHealthFlags(flags: string[]): Promise<boolean> {
      if (!this.user || !this.token) { /* ... */ return false; }
      this.loading = true; this.error = null;
      try {
        const response = await updateUserApi(this.user.id, { health_flags: flags });
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