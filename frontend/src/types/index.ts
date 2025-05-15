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
  id: string;
  name: string;
  description: string;
  dateEarned: string;
}

/**
 * Interface for badge data enhanced for display in the frontend.
 */
export interface DisplayBadge extends ApiBadge {
  icon: string;
  bgColor?: string;
  iconColor?: string;
}

/**
 * Defines the possible AI health conclusions for a scanned product.
 */
export type AiHealthConclusion = 'good' | 'caution' | 'avoid' | 'neutral' | 'info_needed';

/**
 * Represents a user's interaction with a product.
 * This can be a scan, a review, or both.
 */
export interface ProductInteraction {
  id: string;                    // Unique identifier for this interaction or the underlying product
  name: string;                  // Name of the product
  imageUrl?: string;             // Optional URL for the product image
  
  // Scanning-related data (always present if it was scanned)
  dateScanned: string;           // Date when the product was first scanned/encountered
  barcode?: string;              // Barcode if scanned
  aiHealthSummary?: string;      // AI-generated summary of ingredients vs. user's health flags
  aiHealthConclusion?: AiHealthConclusion; // AI's overall conclusion

  // User Review Details (present if the user has reviewed this item)
  isReviewed: boolean;           // Flag indicating if the user has personally reviewed this item
  userRating?: number;           // User's star rating (1-5), only if isReviewed is true
  userNotes?: string;            // User's personal notes, only if isReviewed is true
  dateReviewed?: string;         // Date when the review was created/updated, only if isReviewed is true
  
  // Other potential fields
  // purchaseLocation?: string;
  // brand?: string;
  // category?: string;
}

// Note: The previous ScannedItem and ReviewedItem interfaces can be considered
// superseded by ProductInteraction for lists that combine both types of info.
// We might keep ReviewedItem if there's a specific "My Full Reviews" page that only shows those.
// For the combined history, ProductInteraction is more suitable.

