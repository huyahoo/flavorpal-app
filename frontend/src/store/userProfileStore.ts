// src/store/userProfileStore.ts
import { defineStore } from 'pinia';
import type { ApiBadge, DisplayBadge } from '../types';
import { fetchTastePoints, fetchUserApiBadges } from '../services/userProfileService'; // Ensure service path is correct

// Define the shape of the user profile state
export interface UserProfileState {
  tastePoints: number;
  loading: boolean;       // Indicates if profile data is being fetched
  error: string | null;   // Stores any error messages related to fetching profile data
}


// Define the userProfile store
export const useUserProfileStore = defineStore('userProfile', {
  state: (): UserProfileState => ({
    tastePoints: 0,
    loading: false,
    error: null,
  }),

  actions: {
    /**
     * Fetches all user profile data (TastePoints and Badges) from the service.
     * Updates the store state with the fetched and processed data.
     */
    async loadUserProfile() {
      // Optional: Prevent re-fetching if data is already loaded and not stale
      // if (this.badges.length > 0 && this.tastePoints > 0 && !this.error && !forceReload) {
      //   console.log('User profile data already available in store.');
      //   return;
      // }

      this.loading = true;
      this.error = null; // Clear previous errors
      try {
        // Fetch TastePoints and API badges concurrently
        const points = await fetchTastePoints()

        this.tastePoints = points;
        // Map the raw API badge data to display-ready badge objects

        console.log('User profile data successfully loaded into store:', { points: this.tastePoints });

      } catch (err: any) {
        console.error('Error loading user profile data:', err);
        this.error = err.message || 'Failed to load user profile data. Please try again.';
        // Optionally reset state on error to avoid showing stale data
        this.tastePoints = 0;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Clears all user profile data from the store.
     * Typically called on user logout.
     */
    clearUserProfile() {
      this.tastePoints = 0;
      this.error = null; // Clear any errors
      console.log('User profile data cleared from store.');
    }
  },
});
