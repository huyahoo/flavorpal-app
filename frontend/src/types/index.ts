// src/types/index.ts

/**
 * Interface for a mock user for the FlavorPal application.
 * For hackathon purposes, the password will be stored as plain text in localStorage.
 * WARNING: This is highly insecure and should NEVER be done in a real application.
 */
export interface MockUser {
  id: string;          // Unique identifier for the user
  username: string;      // User's display name
  email: string;       // User's email address (acts as the username)
  password?: string;   // User's password (stored directly for mock purposes ONLY)
  healthFlags: string[]; // Array of user's dietary preferences or restrictions (e.g., "nuts", "gluten")
}
