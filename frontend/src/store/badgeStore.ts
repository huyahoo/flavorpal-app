// src/store/badgeStore.ts
import { defineStore } from 'pinia';
import type { ApiBadge, BadgeStatistic, DisplayBadge } from '../types';
import { formatDateForDisplay } from './historyStore';

export interface BadgeStoreState {
  selectedPopupBadges: DisplayBadge[]
}

export const useBadgeStore = defineStore('badge', {
  state: (): BadgeStoreState => ({
    selectedPopupBadges: []
  }),

  getters: {
    // Getter to access the list selected badges to show popup
    getSelectedBadges: (state): DisplayBadge[] => state.selectedPopupBadges,
  },

  actions: {
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
    async checkAllBadgesLogic(value: BadgeStatistic, userBadges: DisplayBadge[]): Promise<ApiBadge[]> {
      userBadges.forEach(badge => {
        // Skip earned badges and badges that are not unlocked
        if (badge.dateEarned || !badge.isUnlockable(value)) {
          return
        }
        // Badges that went up to this part can be assumed as a new one
        const todayISO = new Date().toISOString();
        const dateEarned = formatDateForDisplay(todayISO);
        this.pushBadgeToShow({
          ...badge,
          dateEarned
        })
      })
      return this.selectedPopupBadges.map(badge => ({ id: badge.id, dateEarned: badge.dateEarned }))
    },

    /**
     * Clears all discover page data. Typically called on user logout.
     */
    clearBadgesData() {
      this.selectedPopupBadges = [];
    }
  },
});
