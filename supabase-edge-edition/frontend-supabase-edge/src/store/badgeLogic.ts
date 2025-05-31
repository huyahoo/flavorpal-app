import type { ApiBadge, BadgeMapping, BadgeStatistic, DisplayBadge, UserBadge } from "@/types";

const isAchievedFirstReviewer = (value: BadgeStatistic): boolean => {
  const reviewsCount = value.totalReviewCount
  if (reviewsCount >= 1) {
    return true
  }
  return false
}

const isAchievedExplorer = (value: BadgeStatistic): boolean => {
  const reviewsCount = value.totalReviewCount
  if (reviewsCount >= 5) {
    return true
  }
  return false
}

const isAchievedGourmand = (value: BadgeStatistic): boolean => {
  const reviewsCount = value.totalReviewCount
  if (reviewsCount >= 10) {
    return true
  }
  return false
}

export const badgeMappings: BadgeMapping[] = [
  {
    ref: "1REVIEW",
    name: "First Reviewer",
    description: "Reviewed your first product",
    imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f369.png",
    isUnlockable: isAchievedFirstReviewer
  },
  {
    ref: "5REVIEW",
    name: "Explorer",
    description: "Reviewed 5 products",
    imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f950.png",
    isUnlockable: isAchievedExplorer
  },
  {
    ref: "10REVIEW",
    name: "Gourmand",
    description: "Reviewed 10 products",
    imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f363.png",
    isUnlockable: isAchievedGourmand
  },
  {
    ref: "5AIHELP",
    name: "Health Scout",
    description: "Use AI Ingredient Helper 5 times",
    imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f957.png",
    isUnlockable: () => false
  }
]

/**
 * Maps all badges data to user-specific data for display
 * @param apiBadge - The badge data from the API.
 * @returns A DisplayBadge object ready for UI rendering.
 */
export const processBadgesData = (apiBadges: ApiBadge[], userBadges: UserBadge[]): DisplayBadge[] => {
  // Match badge ID with the data
  const mappedBadgeData: DisplayBadge[] = badgeMappings.map(
    badgeMapping => {
      const matchingApiBadge = apiBadges.find(apiBadge => apiBadge.ref == badgeMapping.ref) ?? null
      const matchingUserBadge = userBadges.find(userBadge => userBadge.badge.ref === badgeMapping.ref) ?? null
      if (!matchingUserBadge) {
        // User hasn't achieved this badge yet
        return {
          ...badgeMapping,
          id: matchingApiBadge?.id ?? 0,
          createdAt: null
        }
      }
      // Map createdAt into the badge
      return {
        ...badgeMapping,
        id: matchingApiBadge?.id ?? 0,
        createdAt: matchingUserBadge.createdAt
      }
    }
  )
  return mappedBadgeData
};
