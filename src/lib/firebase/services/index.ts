/**
 * Firebase Services APIBook
 * Central export point for Firebase services
 */

// Import auth service
export { AuthService } from './auth.service';

// Import types
export type { AppUser } from './auth.service';
export type { ApiResponse } from '../handler';

// Re-export for convenience
import { AuthService } from './auth.service';

/**
 * Centralized APIBook for Firebase authentication
 * 
 * Usage:
 * import { APIBook } from '@/lib/firebase/services';
 * const result = await APIBook.auth.loginWithEmail(email, password);
 */
export const APIBook = {
  auth: AuthService,
} as const;

/**
 * Default export for direct service access
 */
export default APIBook;
