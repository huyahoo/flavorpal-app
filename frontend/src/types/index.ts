// src/types/index.ts

/**
 * Interface for a mock user for the FlavorPal application.
 */
export interface MockUser {
  id: string;
  username: string;
  email: string;
  password?: string;
  healthFlags: string[];
}

/**
 * Interface for badge data as it might come from an API or database.
 */
export interface ApiBadge {
  id: string;          // Unique identifier for the badge
  name: string;        // Name of the badge (e.g., "First Reviewer", "Explorer")
  description: string; // A short description of how the badge is earned
  dateEarned: string;  // Date the badge was earned (e.g., "2025-05-15")
}

/**
 * Interface for badge data enhanced for display in the frontend.
 * Includes UI-specific properties like icon and colors.
 */
export interface DisplayBadge extends ApiBadge {
  icon: string;        // Emoji or SVG string for the badge icon
  bgColor?: string;    // Optional background color for the badge display
  iconColor?: string;  // Optional color for the icon itself
}