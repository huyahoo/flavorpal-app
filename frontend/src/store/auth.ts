// frontend/src/store/auth.ts
import { defineStore } from 'pinia';
import type { User, UserCreatePayload, LoginCredentials, ApiBadge } from '../types';
import {
    registerUserApi,
    loginUserApi,
    fetchCurrentUserApi,
    logoutUserApi,
    updateUserApi
} from '../services/authService';
import apiClient from '../services/apiClient';

import { useUserProfileStore } from './userProfileStore';
import { useHistoryStore } from './historyStore';
import { useScanStore } from './scanStore';
import { useBadgeStore } from './badgeStore';

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticatedInitiallyChecked: boolean;
}

const AUTH_STORE_TOKEN_KEY = 'flavorpal_jwt_token_v1';
const AUTH_STORE_USER_KEY = 'flavorpal_user_v1';

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: JSON.parse(localStorage.getItem(AUTH_STORE_USER_KEY) || 'null'),
    token: localStorage.getItem(AUTH_STORE_TOKEN_KEY),
    loading: false,
    error: null,
    isAuthenticatedInitiallyChecked: false,
  }),

  getters: {
    isAuthenticated: (state): boolean => !!state.token && !!state.user,
    currentUsername: (state): string | null => state.user?.name || null,
    healthFlags: (state): string[] => state.user?.health_flags || [],
    userId: (state): number | null => state.user?.id || null,
  },

  actions: {
    setTokenInApiClient(token: string | null) {
      if (token) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } else {
        delete apiClient.defaults.headers.common['Authorization'];
      }
    },

    async initializeAuth() {
      if (this.isAuthenticatedInitiallyChecked && this.token && this.user) {
        this.setTokenInApiClient(this.token);
        return;
      }
      this.loading = true;
      const tokenFromStorage = localStorage.getItem(AUTH_STORE_TOKEN_KEY);
      const userJsonFromStorage = localStorage.getItem(AUTH_STORE_USER_KEY);

      if (tokenFromStorage) {
        this.token = tokenFromStorage;
        this.setTokenInApiClient(this.token);
        if (userJsonFromStorage) {
            try {
                this.user = JSON.parse(userJsonFromStorage) as User;
            } catch (e) {
                console.error("Failed to parse stored user, fetching from API:", e);
                await this.fetchAndSetCurrentUser();
            }
        } else {
            await this.fetchAndSetCurrentUser();
        }
      } else {
        this.user = null;
        this.token = null;
        this.setTokenInApiClient(null);
      }
      this.isAuthenticatedInitiallyChecked = true;
      this.loading = false;
    },

    async register(payload: UserCreatePayload): Promise<{ success: boolean; message?: string }> {
      this.loading = true;
      this.error = null;
      const response = await registerUserApi(payload);

      if (response.code === 201 && response.data) {
        this.loading = false;
        return { success: true, message: response.msg };
      } else {
        this.error = response.msg || response.detail || 'Registration failed.';
        this.loading = false;
        return { success: false, message: this.error ?? undefined };
      }
    },

    async login(credentials: LoginCredentials): Promise<boolean> {
      this.loading = true;
      this.error = null;

      try {
        const tokenResponse = await loginUserApi(credentials);
        if (tokenResponse && tokenResponse.access_token) {
          this.token = tokenResponse.access_token;
          localStorage.setItem(AUTH_STORE_TOKEN_KEY, this.token);
          this.setTokenInApiClient(this.token);

          const userResponse = await fetchCurrentUserApi();
          if (userResponse.code === 200 && userResponse.data) {
            this.user = userResponse.data;
            localStorage.setItem(AUTH_STORE_USER_KEY, JSON.stringify(this.user));
            this.isAuthenticatedInitiallyChecked = true;

            const userProfileStore = useUserProfileStore();
            const historyStore = useHistoryStore();
            userProfileStore.loadUserProfile();
            historyStore.loadInitialData();

            this.loading = false;
            return true;
          } else {
            this.error = userResponse.msg || "Failed to fetch user details after login.";
          }
        } else {
          this.error = tokenResponse.msg || 'Login failed: Could not get token.';
        }
      } catch (err: any) {
        this.error = err.msg || err.detail || err.message || 'Login error.';
        console.error('Login error in store:', err);
      }

      this.token = null;
      this.user = null;
      localStorage.removeItem(AUTH_STORE_TOKEN_KEY);
      localStorage.removeItem(AUTH_STORE_USER_KEY);
      this.setTokenInApiClient(null);
      this.loading = false;
      return false;
    },

    async fetchAndSetCurrentUser() { // Helper for initializeAuth
        if (!this.token) {
            this.user = null;
            localStorage.removeItem(AUTH_STORE_USER_KEY);
            return;
        }
        const userResponse = await fetchCurrentUserApi();
        if (userResponse.code === 200 && userResponse.data) {
            this.user = userResponse.data;
            localStorage.setItem(AUTH_STORE_USER_KEY, JSON.stringify(this.user));
        } else {
            console.warn("Failed to fetch current user with stored token, clearing session.", userResponse.msg);
            this.user = null;
            this.token = null;
            localStorage.removeItem(AUTH_STORE_TOKEN_KEY);
            localStorage.removeItem(AUTH_STORE_USER_KEY);
            this.setTokenInApiClient(null);
        }
    },

    async logout(): Promise<void> {
      this.loading = true;

      if (this.token) {
        try {
          await logoutUserApi();
        } catch (e) {
          console.error("Error during backend logout, proceeding with client-side cleanup:", e);
        }
      }

      // Clear other stores' data
      const userProfileStore = useUserProfileStore();
      const historyStore = useHistoryStore();
      const scanStore = useScanStore();
      const badgeStore = useBadgeStore();
      userProfileStore.clearUserProfile();
      historyStore.clearHistoryData();
      scanStore.clearScanDataOnLogout();
      badgeStore.clearBadgesData();

      this.user = null;
      this.token = null;
      this.isAuthenticatedInitiallyChecked = false;
      localStorage.removeItem(AUTH_STORE_TOKEN_KEY);
      localStorage.removeItem(AUTH_STORE_USER_KEY);
      this.setTokenInApiClient(null);
      this.loading = false;

      console.log('AuthStore: User logged out, state and localStorage cleared.');
    },

    async updateUsername(newUsername: string): Promise<boolean> {
      if (!this.user || !this.token || this.user.id === null) {
        this.error = "Not authenticated or user ID missing.";
        return false;
      }
      this.loading = true;
      this.error = null;
      try {
        const response = await updateUserApi(this.user.id, { name: newUsername });
        if (response.code === 200 && response.data) {
          this.user = response.data;
          localStorage.setItem(AUTH_STORE_USER_KEY, JSON.stringify(this.user));
          this.loading = false;
          return true;
        } else {
          throw new Error(response.msg || "Update username failed.");
        }
      } catch (err: any) {
        this.error = err.msg || err.detail || "Could not update username.";
        this.loading = false;
        return false;
      }
    },

    async updateHealthFlags(flags: string[]): Promise<boolean> {
      if (!this.user || !this.token || this.user.id === null) {
        this.error = "Not authenticated or user ID missing.";
        return false;
      }
      this.loading = true;
      this.error = null;
      try {
        const response = await updateUserApi(this.user.id, { health_flags: flags });
         if (response.code === 200 && response.data) {
          this.user = response.data;
          localStorage.setItem(AUTH_STORE_USER_KEY, JSON.stringify(this.user));
          this.loading = false;
          return true;
        } else {
            throw new Error(response.msg || "Failed to update health flags.");
        }
      } catch (err: any) {
        this.error = err.msg || err.detail || "Could not update health flags.";
        this.loading = false;
        return false;
      }
    },

    async updateBadges(badges: ApiBadge[]): Promise<boolean> {
      if (!this.user || !this.token) { return false; }
      this.loading = true; this.error = null;
      try {
        const response = await updateUserApi(
          this.user.id,
          { badges }
        );
         if (response.code === 200 && response.data) {
          this.user = response.data;
          return true;
        } else { throw new Error(response.msg); }
      } catch (err: any) { this.error = err.msg || "Update badges failed."; return false; }
      finally { this.loading = false; }
    },
  },
});
