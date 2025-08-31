/**
 * Firebase Authentication Service
 * Handles all client-side authentication operations
 */

import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
  AuthError
} from 'firebase/auth';
import { auth } from './firebase';
import { AUTH_CONFIG } from '@/lib/auth/config';

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

/**
 * Email/Password Authentication
 */
export const loginWithEmail = async (email: string, password: string): Promise<AuthResult> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    const authError = error as AuthError;
    console.error('Login Error:', {
      code: authError.code,
      message: authError.message,
      email: email,
      timestamp: new Date().toISOString()
    });
    return { success: false, error: getAuthErrorMessage(authError.code) };
  }
};

/**
 * User Registration with configurable email verification
 */
export const signupWithEmail = async (
  email: string, 
  password: string, 
  displayName?: string
): Promise<AuthResult> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update user profile if display name provided
    if (displayName && userCredential.user) {
      await updateProfile(userCredential.user, { displayName });
    }
    
    // Send email verification based on project configuration
    if (AUTH_CONFIG.emailVerification.sendOnSignup && userCredential.user) {
      await sendEmailVerification(userCredential.user);
    }
    
    return { success: true, user: userCredential.user };
  } catch (error) {
    const authError = error as AuthError;
    return { success: false, error: getAuthErrorMessage(authError.code) };
  }
};

/**
 * Google OAuth Authentication
 */
export const loginWithGoogle = async (): Promise<AuthResult> => {
  try {
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    
    const userCredential = await signInWithPopup(auth, provider);
    return { success: true, user: userCredential.user };
  } catch (error) {
    const authError = error as AuthError;
    return { success: false, error: getAuthErrorMessage(authError.code) };
  }
};

/**
 * Password Reset Email
 */
export const resetPassword = async (email: string): Promise<Omit<AuthResult, 'user'>> => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    const authError = error as AuthError;
    return { success: false, error: getAuthErrorMessage(authError.code) };
  }
};

/**
 * User Logout
 */
export const logout = async (): Promise<Omit<AuthResult, 'user'>> => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    const authError = error as AuthError;
    return { success: false, error: getAuthErrorMessage(authError.code) };
  }
};

/**
 * Get Currently Authenticated User
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

/**
 * Convert Firebase error codes to user-friendly messages
 */
const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/invalid-email':
      return 'Invalid email address.';
    case 'auth/too-many-requests':
      return 'Too many failed login attempts. Please try again later.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in was cancelled.';
    case 'auth/popup-blocked':
      return 'Pop-up was blocked by the browser. Please allow pop-ups and try again.';
    case 'auth/configuration-not-found':
    case 'auth/project-not-found':
      return 'Authentication service is not properly configured. Please contact support.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    case 'auth/internal-error':
      return 'Internal error occurred. Please try again later.';
    default:
      console.error('Firebase Auth Error:', errorCode);
      return `Authentication error: ${errorCode}. Please contact support if this persists.`;
  }
};
