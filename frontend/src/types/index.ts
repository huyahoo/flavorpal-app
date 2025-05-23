// src/types/index.ts

/**
 * Represents a user object, aligning with the backend schema.
 */
export interface User {
  id: number;
  username: string;
  email: string;
  health_flags: string[];
  badges: string[];
  created_at?: string; // Optional, from GET response
  updated_at?: string; // Optional, from GET response
}

/**
 * Payload for creating a new user (matches backend's UserCreate schema).
 */
export interface UserCreatePayload {
  username: string;
  email: string;
  health_flags: string[];
  badges: string[];
  password: string;
}

/**
 * Payload for updating an existing user (matches backend's UserUpdate schema).
 * Note: Fields are optional to allow partial updates.
 */
export interface UserUpdatePayload {
  username?: string;
  health_flags?: string[];
  badges?: string[];
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
    code: number;
    data: T;
    msg: string;
    details?: any;
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
export type AiHealthConclusion = 'good' | 'caution' | 'avoid' | 'neutral' | 'info_needed' | 'error_analyzing';

/**
 * Represents a user's interaction with a product.
 * This can be a scan, a review, or both.
 */
export interface ProductInteraction {
  id: string;                    // Unique identifier (can be barcode for scanned items from OFF)
  name: string;                  // Name of the product
  imageUrl?: string;             // Optional URL for the product image
  
  // Scanning-related data
  dateScanned: string;           // Date when the product was first scanned/encountered
  barcode?: string;              // Barcode if scanned
  
  // Data from Open Food Facts (or similar API)
  ingredientsText?: string;      // Raw ingredients string
  categories?: string[];         // Product categories
  brands?: string[];             // Product brands
  genericName?: string;          // Generic name from OFF

  // AI-generated insights (can be client-side mock based on ingredientsText and healthFlags)
  aiHealthSummary?: string;      
  aiHealthConclusion?: AiHealthConclusion; 

  // User Review Details
  isReviewed: boolean;           
  userRating?: number;           
  userNotes?: string;            
  dateReviewed?: string;
  
  // For local UI state in ProductDetailView for "Is this a new product for you?"
  isNewForUser?: boolean; 
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
