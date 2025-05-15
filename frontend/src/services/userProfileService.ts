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
    { id: 'b001', name: 'First Reviewer', description: 'Awarded for logging your very first product review.', dateEarned: '2025-05-01' },
    { id: 'b002', name: 'Explorer', description: 'Awarded for reviewing 5 products from different categories.', dateEarned: '2025-05-10' },
    { id: 'b003', name: 'Gourmand', description: 'Awarded for reviewing 10 products.', dateEarned: '2025-05-14' },
    { id: 'b004', name: 'Health Scout', description: 'Awarded for using the AI ingredient helper 5 times.', dateEarned: '2025-05-12' },
    { id: 'b005', name: 'Super Scanner', description: 'Awarded for scanning 20 unique products.', dateEarned: '2025-05-15' },
  ];
  return mockApiBadges;
};