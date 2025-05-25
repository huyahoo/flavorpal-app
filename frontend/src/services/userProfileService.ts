// src/services/userProfileService.ts
import type { ApiBadge } from '../types';

/**
 * Simulates fetching the user's TastePoints from an API.
 * @returns A Promise that resolves to a number representing TastePoints.
 */
export const fetchTastePoints = async (): Promise<number> => {
  console.log('Mock API Call: Fetching TastePoints...');
  // Simulate a network delay
  await new Promise(resolve => setTimeout(resolve, 400));
  // Return a static mock value for demonstration
  return 157; // Dummy TastePoints value
};

/**
 * Simulates fetching the user's earned badges (in API format) from an API.
 * @returns A Promise that resolves to an array of ApiBadge objects.
 */
export const fetchUserApiBadges = async (): Promise<ApiBadge[]> => {
  console.log('Mock API Call: Fetching User Badges...');
  // Simulate a network delay
  await new Promise(resolve => setTimeout(resolve, 600));

  // Mock badge data as it would be structured from a backend
  const mockApiBadges: ApiBadge[] = [
    { id: '4', dateEarned: '2025-05-01' },
  ];
  return mockApiBadges;
};
