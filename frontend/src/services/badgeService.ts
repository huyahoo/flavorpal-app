// frontend/src/services/badgeService.ts
import apiClient from './apiClient';
import type {
    ApiResponse,
    ApiBadge,
    UserBadge
} from '../types';

/**
 * Fetches all badges.
 * Endpoint: GET /badges/all
 * @returns The badges.
 */
export const getAllBadgesApi = async (): Promise<ApiResponse<ApiBadge[]>> => {
  console.log("SERVICE (getAllBadgesApi): Fetching all products...");
  const response = await apiClient.get<ApiResponse<ApiBadge[]>>('/badges/all');
  console.log("SERVICE (getAllBadgesApi): API call response:", response);
  return response.data;
};

/**
 * Fetches all badges specific to current user.
 * Endpoint: GET /badges/
 * @returns The badges belong to that user.
 */
export const getAllUserBadgesApi = async (): Promise<ApiResponse<UserBadge[]>> => {
  console.log("SERVICE (getAllUserBadgesApi): Fetching all products...");
  const response = await apiClient.get<ApiResponse<UserBadge[]>>('/badges/');
  console.log("SERVICE (getAllUserBadgesApi): API call response:", response);
  return response.data;
};

/**
 * Updates a user badge.
 * Endpoint: PATCH /badges/{badge_id}
 * @param badgeId - The ID of the badge to update.
 * @returns The updated badge.
 */
export const updateUserBadgeApi = async (badgeId: number): Promise<ApiResponse<UserBadge>> => {
  console.log(`SERVICE (updateUserBadgeApi): Updating badge ID ${badgeId} for current user`);
  const response = await apiClient.patch<ApiResponse<UserBadge>>(`/badges/update/${badgeId}`);
  return response.data;
};
