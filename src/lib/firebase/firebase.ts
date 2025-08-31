/**
 * Firebase App Initialization
 * Uses existing environment configuration system
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getCurrentFirebaseConfig, verifyEnvironmentConfiguration } from './config/environments';

// Verify environment configuration in development mode
if (process.env.NODE_ENV === 'development') {
  verifyEnvironmentConfiguration();
}

// Initialize Firebase with existing environment-aware config
const firebaseConfig = getCurrentFirebaseConfig();
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
