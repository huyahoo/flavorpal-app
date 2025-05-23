// src/services/badgeService.ts
import type { Badge } from "@/types";

// Mock data for badges page, TODO: Remove this
const mockBadgesData: Badge[] = [
  {
    id: "1",
    title: "First Reviewer",
    description: "Reviewed your first product",
    imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f369.png",
    achievedAt: "2025-05-21"
  },
  {
    id: "2",
    title: "Explorer",
    description: "Reviewed 5 products",
    imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f950.png",
    achievedAt: "2025-05-23"
  },
  {
    id: "3",
    title: "Gourmand",
    description: "Reviewed 10 products",
    imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f363.png",
    achievedAt: null
  },
  {
    id: "4",
    title: "Health Scout",
    description: "Use AI Ingredient Helper 5 times",
    imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f957.png",
    achievedAt: null
  }
]

/**
 * Simulates fetching badges data from backend
 * @returns A Promise that resolves to an array of Badge object
 */
export const fetchBadgesApi = async (): Promise<Badge[] | null> => {
  console.log('Mock API Call: Badges')
  await new Promise(resolve => setTimeout(resolve, 300)); // Mock fetch time, TODO: Remove this
  return mockBadgesData
}
