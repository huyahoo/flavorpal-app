// src/store/auth.ts
import { defineStore } from 'pinia';
import router from '../router'; // Import router for navigation. Ensure router.ts is created.
import type { MockUser } from '../types'; // Import the MockUser type

// Define the structure of the authentication state
export interface AuthState {
  user: MockUser | null;    // Holds the currently authenticated user object, or null if no one is logged in
  loading: boolean;         // Flag to indicate if an authentication operation (login, register) is in progress
  error: string | null;     // Stores any error message related to authentication
}

// Define unique keys for storing data in localStorage
const MOCK_USERS_STORAGE_KEY = 'flavorpal_mock_users_v4';    // Key for the list of all registered mock users
const CURRENT_USER_STORAGE_KEY = 'flavorpal_current_user_v4'; // Key for the currently logged-in user

// --- localStorage Helper Functions ---

/**
 * Retrieves all mock users from localStorage.
 * @returns An array of MockUser objects. Returns an empty array if no users are found or if there's a parsing error.
 */
const getMockUsers = (): MockUser[] => {
  const usersJson = localStorage.getItem(MOCK_USERS_STORAGE_KEY);
  try {
    return usersJson ? JSON.parse(usersJson) : [];
  } catch (e) {
    console.error("Error parsing mock users from localStorage:", e);
    return []; // Safeguard against corrupted data
  }
};

/**
 * Saves the array of all mock users to localStorage.
 * @param users - The array of MockUser objects to save.
 */
const saveMockUsers = (users: MockUser[]) => {
  localStorage.setItem(MOCK_USERS_STORAGE_KEY, JSON.stringify(users));
};

/**
 * Retrieves the currently logged-in mock user from localStorage.
 * @returns A MockUser object if a user is logged in and stored, otherwise null.
 */
const getCurrentUser = (): MockUser | null => {
  const userJson = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
  try {
    return userJson ? JSON.parse(userJson) : null;
  } catch (e) {
    console.error("Error parsing current user from localStorage:", e);
    return null; // Safeguard against corrupted data
  }
};

/**
 * Saves the currently logged-in mock user to localStorage, or removes it if null.
 * @param user - The MockUser object to save, or null to clear the current user session.
 */
const saveCurrentUser = (user: MockUser | null) => {
  if (user) {
    localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
  }
};
// --- End localStorage Helper Functions ---

// Define the authentication store using Pinia
export const useAuthStore = defineStore('auth', {
  // Define the initial state of the store
  state: (): AuthState => ({
    user: null,        // Initially, no user is logged in
    loading: false,    // Initially, no authentication operations are in progress
    error: null,       // Initially, there are no authentication errors
  }),

  // Define getters to compute derived state values
  getters: {
    /**
     * Checks if a user is currently authenticated.
     * @returns True if a user object exists in the state, false otherwise.
     */
    isAuthenticated: (state): boolean => !!state.user,

    /**
     * Gets the health flags of the currently authenticated user.
     * @returns An array of strings representing health flags. Returns an empty array if no user is logged in or if the user has no flags.
     */
    healthFlags: (state): string[] => state.user?.healthFlags || [],
  },

  // Define actions to perform operations that can modify the state
  actions: {
    /**
     * Initializes the authentication state from localStorage.
     * This action should be called when the application starts to restore any existing session.
     */
    initializeAuth() {
      this.loading = true;
      const storedUser = getCurrentUser(); // Attempt to retrieve user from localStorage
      if (storedUser) {
        this.user = storedUser; // Restore the user session into the store's state
      }
      this.loading = false;

      // After initializing, check routing requirements
      const currentRoute = router.currentRoute.value;
      if (this.user && currentRoute.meta.requiresGuest) {
        router.push({ name: 'Home' }); // If logged in and on a guest-only page (e.g., Login), redirect to Home
      } else if (!this.user && currentRoute.meta.requiresAuth) {
        // If not logged in and on a page that requires auth (and not already on Login/Register)
        if(currentRoute.name !== 'Login' && currentRoute.name !== 'Register') {
            router.push({ name: 'Login' }); // Redirect to Login
        }
      }
    },

    /**
     * Registers a new mock user and stores their details in localStorage.
     * WARNING: Stores password in plain text. For mock/hackathon purposes ONLY.
     * @param email - The user's email address.
     * @param password - The user's password (must be provided and meet length requirements).
     * @param healthFlags - Optional array of the user's dietary health flags.
     * @returns A Promise that resolves to true if registration is successful, false otherwise.
     */
    async register(email: string, password?: string, healthFlags: string[] = []): Promise<boolean> {
      this.loading = true;
      this.error = null; // Clear any previous errors

      // Validate input
      if (!password) {
        this.error = 'Password is required for registration.';
        this.loading = false;
        return false;
      }
      if (password.length < 6) {
        this.error = 'Password must be at least 6 characters long.';
        this.loading = false;
        return false;
      }

      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call delay

      let users = getMockUsers();
      // Check if email already exists
      if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        this.error = 'An account with this email already exists.';
        this.loading = false;
        return false;
      }

      // Create new user object
      const newUser: MockUser = {
        id: `mock_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`, // Generate a simple unique ID
        email,
        password, // Storing password directly - ONLY FOR MOCK/HACKATHON
        healthFlags,
      };

      users.push(newUser); // Add new user to the list
      saveMockUsers(users); // Save updated list to localStorage

      // Automatically log in the new user
      this.user = newUser;
      saveCurrentUser(newUser);

      this.loading = false;
      console.log('Mock registration successful for:', newUser.email);
      // Redirect to home page after successful registration
      if (router.currentRoute.value.name !== 'Home') {
         router.push({ name: 'Home' });
      }
      return true;
    },

    /**
     * Logs in an existing mock user by checking credentials against localStorage.
     * @param email - The user's email address.
     * @param password - The user's password.
     * @returns A Promise that resolves to true if login is successful, false otherwise.
     */
    async login(email: string, password?: string): Promise<boolean> {
      this.loading = true;
      this.error = null; // Clear previous errors

      if (!password) {
        this.error = 'Password is required to log in.';
        this.loading = false;
        return false;
      }

      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call delay

      const users = getMockUsers();
      const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (foundUser) {
        // Direct password comparison - ONLY FOR MOCK/HACKATHON
        if (foundUser.password === password) {
          this.user = foundUser; // Set the authenticated user in the store
          saveCurrentUser(foundUser); // Persist login state to localStorage
          this.loading = false;
          console.log('Mock login successful for:', foundUser.email);
          // Redirect to the intended page (if any) or to Home
          const redirectPath = router.currentRoute.value.query.redirect as string || { name: 'Home' };
          router.push(redirectPath);
          return true;
        } else {
          this.error = 'Invalid email or password.'; // Keep error message generic for security
        }
      } else {
        this.error = 'Invalid email or password.'; // User not found
      }

      this.loading = false;
      return false;
    },

    /**
     * Logs out the currently authenticated mock user.
     * Clears the user state and removes the session from localStorage.
     */
    async logout(): Promise<void> {
      this.loading = true;
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API call delay

      this.user = null; // Clear user from Pinia state
      saveCurrentUser(null); // Clear user from localStorage
      this.loading = false;
      console.log('Mock logout successful.');
      // Redirect to login page after logout
      if (router.currentRoute.value.name !== 'Login') {
          router.push({ name: 'Login' });
      }
    },

    /**
     * Updates the health flags for the currently authenticated mock user.
     * @param flags - An array of new health flags.
     * @returns A Promise that resolves to true if the update is successful, false otherwise.
     */
    async updateHealthFlags(flags: string[]): Promise<boolean> {
      if (!this.user) {
        this.error = "User not authenticated. Cannot update health flags.";
        return false;
      }
      this.loading = true;
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API call delay

      // Create a new user object to ensure reactivity when state is updated
      const updatedUser = { ...this.user, healthFlags: flags };
      this.user = updatedUser; // Update user in Pinia state
      saveCurrentUser(this.user); // Persist updated user to localStorage

      // Also update the user in the main list of mock users for consistency
      let users = getMockUsers();
      const userIndex = users.findIndex(u => u.id === this.user?.id);
      if (userIndex !== -1) {
        users[userIndex] = this.user;
        saveMockUsers(users);
      }

      this.loading = false;
      console.log('Mock health flags updated for:', this.user.email);
      return true;
    }
  }
});
