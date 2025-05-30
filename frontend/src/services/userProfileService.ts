// src/services/userProfileService.ts
import type { ApiBadge } from '../types';
import { fetchCurrentUserApi } from './authService';

/**
 * Simulates fetching the user's TastePoints from an API.
 * @returns A Promise that resolves to a number representing TastePoints.
 */
export const fetchTastePoints = async (): Promise<number> => {
  console.log('Mock API Call: Fetching TastePoints...');
  // Simulate a network delay
  await new Promise(resolve => setTimeout(resolve, 400));
  // Return a static mock value for demonstration
  return 520; // Dummy TastePoints value
};

/**
 * Simulates fetching the user's earned badges (in API format) from an API.
 * @returns A Promise that resolves to an array of ApiBadge objects.
 */
export const fetchUserApiBadges = async (): Promise<ApiBadge[]> => {
  console.log('Mock API Call: Fetching User Badges...');
  // Simulate a network delay
  await new Promise(resolve => setTimeout(resolve, 600));

  // Get badges data from user API
  const userResponse = await fetchCurrentUserApi()

  return userResponse.data.badges;
};
