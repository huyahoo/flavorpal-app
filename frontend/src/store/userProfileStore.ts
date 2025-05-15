// src/store/userProfileStore.ts
import { defineStore } from 'pinia';
import type { ApiBadge, DisplayBadge } from '../types';
import { fetchTastePoints, fetchUserApiBadges } from '../services/userProfileService'; // Ensure service path is correct

// Define the shape of the user profile state
export interface UserProfileState {
  tastePoints: number;
  badges: DisplayBadge[]; // Stores badges enhanced for display
  loading: boolean;       // Indicates if profile data is being fetched
  error: string | null;   // Stores any error messages related to fetching profile data
}

/**
 * Maps an ApiBadge object (raw data) to a DisplayBadge object (with UI properties).
 * This function assigns icons and colors based on badge names or IDs.
 * @param apiBadge - The badge data from the API.
 * @returns A DisplayBadge object ready for UI rendering.
 */
const mapApiBadgeToDisplayBadge = (apiBadge: ApiBadge): DisplayBadge => {
  let icon = '🏆'; // Default fallback icon
  let bgColor = '#E5E7EB'; // Tailwind's bg-gray-200
  let iconColor = '#4B5563'; // Tailwind's text-gray-600

  const lowerCaseName = apiBadge.name.toLowerCase();

  // Define badge presentation based on name (could also use ID)
  if (lowerCaseName.includes('first reviewer')) {
    icon = '🥇'; bgColor = '#FEF3C7'; iconColor = '#B45309'; // Amber
  } else if (lowerCaseName.includes('explorer')) {
    icon = '🧭'; bgColor = '#DBEAFE'; iconColor = '#1D4ED8'; // Blue
  } else if (lowerCaseName.includes('gourmand')) {
    icon = '🍕'; bgColor = '#FFE4E6'; iconColor = '#F43F5E'; // Rose
  } else if (lowerCaseName.includes('health scout')) {
    icon = '🥗'; bgColor = '#D1FAE5'; iconColor = '#047857'; // Emerald (FlavorPal Green Dark)
  } else if (lowerCaseName.includes('super scanner')) {
    icon = '📸'; bgColor = '#E0E7FF'; iconColor = '#4F46E5'; // Indigo
  }
  // Add more badge mappings as needed

  return {
    ...apiBadge, // Include all original properties from ApiBadge
    icon,
    bgColor,
    iconColor,
  };
};

// Define the userProfile store
export const useUserProfileStore = defineStore('userProfile', {
  state: (): UserProfileState => ({
    tastePoints: 0,
    badges: [],
    loading: false,
    error: null,
  }),

  getters: {
    /**
     * Retrieves a specific badge by its ID.
     * @param state - The current store state.
     * @returns A function that takes a badge ID and returns the DisplayBadge or undefined.
     */
    getBadgeById: (state) => (id: string): DisplayBadge | undefined => {
      return state.badges.find(badge => badge.id === id);
    },
    /**
     * Retrieves a limited number of badges, e.g., for a summary display.
     * @param state - The current store state.
     * @returns A function that takes a count and returns an array of DisplayBadge.
     */
    getProfileSummaryBadges: (state) => (count: number = 4): DisplayBadge[] => {
        return state.badges.slice(0, count);
    }
  },

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
        const [points, apiBadgesData] = await Promise.all([
          fetchTastePoints(),
          fetchUserApiBadges(),
        ]);

        this.tastePoints = points;
        // Map the raw API badge data to display-ready badge objects
        this.badges = apiBadgesData.map(mapApiBadgeToDisplayBadge);

        console.log('User profile data successfully loaded into store:', { points: this.tastePoints, badgesCount: this.badges.length });

      } catch (err: any) {
        console.error('Error loading user profile data:', err);
        this.error = err.message || 'Failed to load user profile data. Please try again.';
        // Optionally reset state on error to avoid showing stale data
        this.tastePoints = 0;
        this.badges = [];
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
      this.badges = [];
      this.error = null; // Clear any errors
      console.log('User profile data cleared from store.');
    }
  },
});
