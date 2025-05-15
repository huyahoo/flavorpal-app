// src/store/auth.ts
import { defineStore } from 'pinia';
import router from '../router'; // Import router for navigation. Ensure router.ts is created.
import type { MockUser } from '../types'; // Import our MockUser type

// Define the shape of the authentication state
export interface AuthState {
  user: MockUser | null;    // The currently authenticated user, or null
  loading: boolean;         // True if an auth operation is in progress
  error: string | null;     // Stores any authentication error messages
}

// Keys for localStorage
const MOCK_USERS_STORAGE_KEY = 'flavorpal_mock_users_v4';    // Stores all registered mock users
const CURRENT_USER_STORAGE_KEY = 'flavorpal_current_user_v4'; // Stores the currently logged-in user

// --- localStorage Helper Functions ---
/**
 * Retrieves all mock users from localStorage.
 * @returns An array of MockUser objects.
 */
const getMockUsers = (): MockUser[] => {
  const usersJson = localStorage.getItem(MOCK_USERS_STORAGE_KEY);
  try {
    return usersJson ? JSON.parse(usersJson) : [];
  } catch (e) {
    console.error("Error parsing mock users from localStorage:", e);
    return []; 
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
 * @returns A MockUser object or null if no user is logged in.
 */
const getCurrentUser = (): MockUser | null => {
  const userJson = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
  try {
    return userJson ? JSON.parse(userJson) : null;
  } catch (e) {
    console.error("Error parsing current user from localStorage:", e);
    return null; 
  }
};

/**
 * Saves the currently logged-in mock user to localStorage, or removes it if null.
 * @param user - The MockUser object to save, or null to clear.
 */
const saveCurrentUser = (user: MockUser | null) => {
  if (user) {
    localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
  }
};
// --- End localStorage Helper Functions ---

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,        
    loading: false,    
    error: null,       
  }),

  getters: {
    isAuthenticated: (state): boolean => !!state.user,
    healthFlags: (state): string[] => state.user?.healthFlags || [],
    // Getter for username for convenience in components
    currentUsername: (state): string | null => state.user?.username || null,
  },

  actions: {
    /**
     * Initializes the auth state from localStorage.
     * This should be called when the application starts.
     */
    initializeAuth() {
      this.loading = true;
      const storedUser = getCurrentUser(); 
      if (storedUser) {
        this.user = storedUser; 
      }
      this.loading = false;

      const currentRoute = router.currentRoute.value; 
      if (this.user && currentRoute.meta.requiresGuest) {
        router.push({ name: 'Home' }); 
      } else if (!this.user && currentRoute.meta.requiresAuth) {
        if(currentRoute.name !== 'Login' && currentRoute.name !== 'Register') {
            router.push({ name: 'Login' });
        }
      }
    },

    /**
     * Registers a new mock user.
     * WARNING: Stores password in plain text in localStorage. For mock/hackathon ONLY.
     * Sets an initial username based on the email.
     * @param email - User's email address.
     * @param password - User's password (must be provided).
     * @param healthFlags - Optional array of user's dietary flags.
     * @returns True if registration was successful, false otherwise.
     */
    async register(email: string, password?: string, healthFlags: string[] = []): Promise<boolean> {
      this.loading = true;
      this.error = null; 

      if (!password || password.length < 6) {
        this.error = password ? 'Password must be at least 6 characters long.' : 'Password is required.';
        this.loading = false;
        return false;
      }

      await new Promise(resolve => setTimeout(resolve, 500)); 

      let users = getMockUsers();
      if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        this.error = 'An account with this email already exists.';
        this.loading = false;
        return false;
      }

      // Derive initial username from the part of the email before "@"
      const emailNamePart = email.split('@')[0];
      // Capitalize the first letter of the derived username
      const initialUsername = emailNamePart.charAt(0).toUpperCase() + emailNamePart.slice(1);

      const newUser: MockUser = {
        id: `mock_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        username: initialUsername, // Set initial username
        email,
        password, 
        healthFlags,
      };

      users.push(newUser); 
      saveMockUsers(users); 

      this.user = newUser; // Automatically log in the new user
      saveCurrentUser(newUser);

      this.loading = false;
      console.log('Mock registration: User', newUser.email, 'Username:', newUser.username);
      if (router.currentRoute.value.name !== 'Home') router.push({ name: 'Home' });
      return true;
    },

    /**
     * Logs in a mock user.
     * Checks email and password against stored mock users.
     * @param email - User's email address.
     * @param password - User's password.
     * @returns True if login was successful, false otherwise.
     */
    async login(email: string, password?: string): Promise<boolean> {
      this.loading = true;
      this.error = null; 

      if (!password) {
        this.error = 'Password is required to log in.';
        this.loading = false;
        return false;
      }
      await new Promise(resolve => setTimeout(resolve, 500)); 
      const users = getMockUsers();
      const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (foundUser) {
        if (foundUser.password === password) { 
          this.user = foundUser; // User object includes username
          saveCurrentUser(foundUser); 
          this.loading = false;
          const redirectPath = router.currentRoute.value.query.redirect as string || { name: 'Home' };
          router.push(redirectPath);
          return true;
        } else { this.error = 'Invalid email or password.'; }
      } else { this.error = 'Invalid email or password.'; }
      this.loading = false;
      return false;
    },

    /**
     * Logs out the current mock user.
     * Clears user state and localStorage for the current user.
     * Also clears the userProfileStore.
     */
    async logout(): Promise<void> {
      // Dynamically import userProfileStore to call its clear action
      // This avoids circular dependency issues if userProfileStore ever imports authStore
      const { useUserProfileStore } = await import('./userProfileStore'); 
      const userProfileStore = useUserProfileStore();
      userProfileStore.clearUserProfile(); // Clear related profile data

      this.loading = true;
      await new Promise(resolve => setTimeout(resolve, 300));
      this.user = null;
      saveCurrentUser(null);
      this.loading = false;
      if (router.currentRoute.value.name !== 'Login') router.push({ name: 'Login' });
    },

    /**
     * Updates health flags for the currently authenticated mock user.
     * @param flags - New array of health flags.
     * @returns True if update was successful, false otherwise.
     */
    async updateHealthFlags(flags: string[]): Promise<boolean> {
      if (!this.user) { this.error = "User not authenticated."; return false; }
      this.loading = true;
      await new Promise(resolve => setTimeout(resolve, 300)); 
      const updatedUser = { ...this.user, healthFlags: flags };
      this.user = updatedUser; 
      saveCurrentUser(this.user); 
      let users = getMockUsers();
      const userIndex = users.findIndex(u => u.id === this.user?.id);
      if (userIndex !== -1) { users[userIndex] = this.user; saveMockUsers(users); }
      this.loading = false;
      return true;
    },

    /**
     * Updates the username for the currently authenticated mock user.
     * @param newUsername - The new username.
     * @returns A Promise that resolves to true if the update is successful, false otherwise.
     */
    async updateUsername(newUsername: string): Promise<boolean> {
      if (!this.user) {
        this.error = "User not authenticated. Cannot update username.";
        return false;
      }
      const trimmedUsername = newUsername.trim();
      if (!trimmedUsername) {
        this.error = "Username cannot be empty.";
        return false;
      }
      if (trimmedUsername.length < 3) {
        this.error = "Username must be at least 3 characters long.";
        return false;
      }
      // Optional: Add more validation like checking for uniqueness if needed,
      // though for a mock, this might be overkill.
      // const users = getMockUsers();
      // if (users.some(u => u.username.toLowerCase() === trimmedUsername.toLowerCase() && u.id !== this.user.id)) {
      //   this.error = "This username is already taken.";
      //   return false;
      // }


      this.loading = true;
      this.error = null; // Clear previous errors
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API call

      // Create a new user object to ensure reactivity when state is updated
      const updatedUser = { ...this.user, username: trimmedUsername };
      this.user = updatedUser; // Update username in Pinia state
      saveCurrentUser(this.user); // Persist updated user to localStorage (current user session)

      // Also update the username in the main list of mock users for consistency across sessions
      let users = getMockUsers();
      const userIndex = users.findIndex(u => u.id === this.user?.id);
      if (userIndex !== -1) {
        users[userIndex].username = trimmedUsername; // Update username in the array
        saveMockUsers(users); // Save the updated array of all users
      } else {
        // This case should ideally not happen if a user is logged in and their data is consistent
        console.warn("User not found in the global mock users list to update username.");
        // For this mock, we'll proceed with the local update being considered successful.
        // In a real app, this might trigger a more complex error handling or sync mechanism.
      }

      this.loading = false;
      console.log(`Username updated to: ${trimmedUsername} for user ID: ${this.user.id}`);
      return true;
    }
  }
});
