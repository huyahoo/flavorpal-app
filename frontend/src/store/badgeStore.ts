// src/store/badgeStore.ts
import { defineStore } from 'pinia';
import type { BadgeStatistic, DisplayBadge } from '../types';

export interface BadgeStoreState {
  selectedBadges: DisplayBadge[]
}

export const useBadgeStore = defineStore('badge', {
  state: (): BadgeStoreState => ({
    selectedBadges: []
  }),

  getters: {
    // Getter to access the list selected badges to show popup
    getSelectedBadges: (state): DisplayBadge[] => state.selectedBadges,
  },

  actions: {
    /**
     * Push badges to show on popup
     */
    pushBadgeToShow(badge: DisplayBadge) {
      this.selectedBadges.push(badge)
    },

    /**
     * Pop badges on popup
     */
    popBadgeToShow() {
      this.selectedBadges.pop()
    },

    /**
     * Check all badges logic to display popup
     */
    checkAllBadgesLogic(value: BadgeStatistic, userBadges: DisplayBadge[]) {
      return userBadges.forEach(badge => {
        // Skip earned badges and badges that are not unlocked
        if (badge.dateEarned || !badge.isUnlockable(value)) {
          return
        }

        this.pushBadgeToShow({
          ...badge,
          dateEarned: "2025-05-11" // TODO: Make it parse actual date today
        })
      })
    },

    /**
     * Clears all discover page data. Typically called on user logout.
     */
    clearBadgesData() {
      this.selectedBadges = [];
    }
  },
});
