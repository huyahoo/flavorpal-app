import type { BadgeMapping, BadgeStatistic } from "@/types";

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
    id: "1",
    name: "First Reviewer",
    description: "Reviewed your first product",
    imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f369.png",
    isUnlockable: isAchievedFirstReviewer
  },
  {
    id: "2",
    name: "Explorer",
    description: "Reviewed 5 products",
    imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f950.png",
    isUnlockable: isAchievedExplorer
  },
  {
    id: "3",
    name: "Gourmand",
    description: "Reviewed 10 products",
    imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f363.png",
    isUnlockable: isAchievedGourmand
  },
  {
    id: "4",
    name: "Health Scout",
    description: "Use AI Ingredient Helper 5 times",
    imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f957.png",
    isUnlockable: () => false
  }
]

