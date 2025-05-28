// src/store/badgeStore.ts
import { defineStore } from 'pinia';
import type { ApiBadge, BadgeStatistic, DisplayBadge } from '../types';
import { getAllBadgesApi, getAllUserBadgesApi, updateUserBadgeApi } from '@/services/badgeService';
import { processBadgesData } from './badgeLogic';

export interface BadgeStoreState {
  badges: DisplayBadge[]
  selectedPopupBadges: DisplayBadge[]
  isLoading: boolean
  error: string | null
}

export const useBadgeStore = defineStore('badge', {
  state: (): BadgeStoreState => ({
    badges: [],
    selectedPopupBadges: [],
    isLoading: false,
    error: null
  }),

  getters: {
    // Getter to access the list selected badges to show popup
    getSelectedBadges: (state): DisplayBadge[] => state.selectedPopupBadges,

    /**
   * Retrieves a limited number of badges, e.g., for a summary display.
   * @param state - The current store state.
   * @returns A function that takes a count and returns an array of DisplayBadge.
   */
    getProfileSummaryBadges: (state: BadgeStoreState) => (count: number = 4): DisplayBadge[] => {
      return state.badges.filter(badge => badge.createdAt).slice(0, count);
    },
  },

  actions: {
    /**
     * Push badges to show on popup
     */
    async loadAllUserBadges() {
      this.isLoading = true
      try {
        const allApiBadges = await getAllBadgesApi()
        const currentUserBadges = await getAllUserBadgesApi()
        this.badges = processBadgesData(allApiBadges.data, currentUserBadges.data)
      } catch (err: any) {
        console.error('Error loading user badges', err);
        this.error = err.message || 'Failed to fetch user badges data. Please try again.';
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Push badges to show on popup
     */
    pushBadgeToShow(badge: DisplayBadge) {
      this.selectedPopupBadges.push(badge)
    },

    /**
     * Pop badges on popup
     */
    popBadgeToShow() {
      this.selectedPopupBadges.pop()
    },

    /**
     * Check all badges logic to display popup
     * @return array of ApiBadge objects to update on user profile
     */
    checkAllBadgesLogic(value: BadgeStatistic, userBadges: DisplayBadge[]) {
      userBadges.forEach((badge) => {
        // Skip earned badges and badges that are not unlocked
        if (badge.createdAt || !badge.isUnlockable(value) || !badge.id) {
          return
        }
        // Badges that went up to this part can be assumed as a new one
        updateUserBadgeApi(badge.id)
          .then(response => {
            this.pushBadgeToShow({
              ...badge,
              createdAt: response.data.createdAt?.slice(0, 10) ?? null
            })
            this.loadAllUserBadges()
          })
      })
    },

    /**
     * Clears all discover page data. Typically called on user logout.
     */
    clearBadgesData() {
      this.selectedPopupBadges = [];
      this.badges = [];
      this.isLoading = false;
      this.error = null;
    }
  },
});
