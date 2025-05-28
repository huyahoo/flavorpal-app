// src/types/index.ts

/**
 * Represents a user object, aligning with the backend schema.
 */
export interface User {
  id: number;
  name: string;
  email: string;
  health_flags: string[];
  badges: ApiBadge[];
  created_at?: string; // Optional, from GET response
  updated_at?: string; // Optional, from GET response
}

/**
 * Payload for creating a new user (matches backend's UserCreate schema).
 */
export interface UserCreatePayload {
  name: string;
  email: string;
  health_flags: string[];
  badges: ApiBadge[];
  password: string;
}

/**
 * Payload for updating an existing user (matches backend's UserUpdate schema).
 * Note: Fields are optional to allow partial updates.
 */
export interface UserUpdatePayload {
  name?: string;
  health_flags?: string[];
  badges?: ApiBadge[];
  password?: string;
}

/**
 * Credentials for user login.
 */
export interface LoginCredentials {
    username: string; // FastAPI's OAuth2PasswordRequestForm expects 'username' (which will be our email)
    password: string;
}

/**
 * Expected response data from the /auth/token endpoint.
 */
export interface TokenResponse {
    access_token: string;
    token_type: string;
}

/**
 * Generic API response structure from backend.
 */
export interface ApiResponse<T = any> {
    access_token: string | null;
    token_type: string;
    code: number;
    data: T;
    msg: string;
    detail?: any;
}

/**
 * Interface for review data payload
 */
export interface ReViewDataPayload {
  name: string;
  rating: number;
  note: string;
}

/**
 * Interface for badge data as it might come from an API or database.
 */
export interface ApiBadge {
  id: number;
  ref: string;
}

/**
 * Interface for badge data as it might come from an API or database.
 */
export interface UserBadge {
  id: number;
  badge: ApiBadge;
  createdAt: string | null;
}

/**
 * Interface for mapping other badge data apart from API badge data
 */
export interface BadgeMapping {
  ref: string
  name: string
  description: string
  imageUrl: string
  isUnlockable: (value: BadgeStatistic) => boolean
}

/**
 * Interface for badge data for frontend display
 */
export interface DisplayBadge extends BadgeMapping {
  id: number
  createdAt: string | null;
}

/**
 * Interface for value to pass into badge checking logic
 */
export interface BadgeStatistic {
  totalReviewCount: number
}

/**
 * Defines the possible AI health conclusions for a scanned product.
 */
export type AiHealthConclusion = 'ok' | 'neutral' | 'avoid' | 'unknown' | 'error_analyzing';

/**
 * Represents a user's interaction with a product.
 * This can be a scan, a review, or both.
 */
export interface ProductInteraction {
  id: number;                    // Unique identifier (can be barcode for scanned items from OFF)
  name: string;                  // Name of the product
  imageUrl?: string;             // Optional URL for the product image
  barcode?: string;              // Barcode if scanned
  brands?: string[];             // Product brands -> TODO: Should be string
  categories?: string[];         // Product categories -> TODO:Should be string

  // Data from Open Food Facts (or similar API)
  ingredientsText?: string;      // Raw ingredients string
  genericName?: string;          // Generic name from OFF

  // AI-generated insights (can be client-side mock based on ingredientsText and healthFlags)
  aiHealthSummary?: string;
  aiHealthConclusion?: AiHealthConclusion;

  // User Review Details
  isReviewed: boolean;
  userRating?: number;
  userNotes?: string;
  dateReviewed?: string;

  // Scanning-related data
  dateScanned: string;           // Date when the product was first scanned/encountered
}

export interface PublicReviewItem {
  reviewId: string;          // Unique ID for this public review entry
  productId: string;         // ID of the product being reviewed
  productName: string;
  productImageUrl?: string;

  reviewerId: string;        // ID of the user who wrote the review
  reviewerUsername: string;
  reviewerAvatarUrl?: string; // Optional

  userRating: number;        // The rating given by this reviewer
  userNotes: string;         // The review notes from this reviewer
  dateReviewed: string;      // ISO date string

  likeCount: number;
  // Potentially other fields like comments count, etc.
}

export interface PointConversionGift {
  id: string;                // Unique identifier for the gift
  name: string;              // Name of the gift
  requiredPoints: number;    // Points required to redeem the gift
  icon: "coin" | "drink" | "shopping-cart" // Define icon
}
