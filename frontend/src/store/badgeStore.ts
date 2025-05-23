// src/store/badgeStore.ts

import { fetchBadgesApi } from "@/services/badgeService";
import type { Badge } from "@/types";
import { defineStore } from "pinia";

export interface BadgeStoreState {
  badges: Badge[]
  isLoading: boolean
  error: string | null
}

export const useBadgeStore = defineStore('badge', {
  state: (): BadgeStoreState => ({
    badges: [],
    isLoading: false,
    error: null
  }),

  getters: {
    // Get all badges to display on this page
    getBadges: (state): Badge[] => state.badges
  },

  actions: {
    async loadBadges() {
      this.isLoading = true
      try {
        const badges = await fetchBadgesApi()
        if (badges) {
          this.badges = badges
        } else {
          this.error = 'Cannot fetch badges'
        }
      } catch (err: any) {
        this.error = err.message || 'Failed to fetch badges'
        console.error('Error loading badges', err)
      } finally {
        this.isLoading = false
      }
    },

    /**
    * Clears all badge data, call on logout
    */
    clearBadgeData() {
      this.badges = []
      this.isLoading = false
      this.error = null
      console.log('Badges data cleared from the store')
    }
  }
})
