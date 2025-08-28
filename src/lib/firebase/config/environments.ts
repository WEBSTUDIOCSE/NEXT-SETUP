import type { FirebaseConfig, EnvironmentConfig } from './types';

/**
 * UAT Environment Configuration
 */
const UAT_CONFIG: FirebaseConfig = {
    apiKey: "AIzaSyDr2GEwj5O4AMQF6JCAu0nhNhlezsgxHS8",
    authDomain: "env-uat-cd3c5.firebaseapp.com",
    projectId: "env-uat-cd3c5",
    storageBucket: "env-uat-cd3c5.firebasestorage.app",
    messagingSenderId: "614576728087",
    appId: "1:614576728087:web:6337d07f43cb3674001452",
    measurementId: "G-RMHPEET5ZY",
    vapidKey: "BPdx9XtofjSoMHlUewHoxrV2IcWwz3jsJY7Rl0byzte4EDYOnMfxtJogdOXlCKRAL5tYSsHc-7iuWkxWjnwo1TA"
};

/**
 * PROD Environment Configuration
 */
const PROD_CONFIG: FirebaseConfig = {
 apiKey: "AIzaSyDP7goPvbKrk1utbKISF2tJU-SwyuJdm2E",
  authDomain: "breathe-free-c1566.firebaseapp.com",
  projectId: "breathe-free-c1566",
  storageBucket: "breathe-free-c1566.firebasestorage.app",
  messagingSenderId: "169689352647",
  appId: "1:169689352647:web:00fafecc859873d4eb31e2",
  measurementId: "G-DTQR8G46W0",
  vapidKey: "BMSqnRUaslFNE6JtlzBem_04MMSmaYVAGF3IkC2xFnqJ5MMcshy3GOTbnF4TIJzURpXJ1uYzatIktOavO2ka2NE"
};

/**
 * Environment configurations map
 */
export const ENVIRONMENTS: Record<'UAT' | 'PROD', EnvironmentConfig> = {
  UAT: {
    name: 'UAT',
    config: UAT_CONFIG
  },
  PROD: {
    name: 'PROD',
    config: PROD_CONFIG
  }
};

/**
 * Boolean environment switcher
 * Set to true for PROD, false for UAT
 */
export const IS_PRODUCTION = true;

/**
 * Get current environment configuration
 */
export const getCurrentEnvironment = (): EnvironmentConfig => {
  return IS_PRODUCTION ? ENVIRONMENTS.PROD : ENVIRONMENTS.UAT;
};

/**
 * Get current Firebase config
 */
export const getCurrentFirebaseConfig = (): FirebaseConfig => {
  return getCurrentEnvironment().config;
};


/**
 * Verify and log current environment configuration
 */
export const verifyEnvironmentConfiguration = (): void => {
  const environment = getCurrentEnvironment();
  const config = getCurrentFirebaseConfig();
  
  console.log('\n🔍 ENVIRONMENT VERIFICATION:');
  console.log(`IS_PRODUCTION flag: ${IS_PRODUCTION}`);
  console.log(`Selected Environment: ${environment.name}`);
  console.log(`Project ID: ${config.projectId}`);
  console.log(`Auth Domain: ${config.authDomain}`);
  console.log(`API Key: ${config.apiKey.substring(0, 10)}...`);
  console.log(`App ID: ${config.appId}`);
  console.log(`Messaging Sender ID: ${config.messagingSenderId}`);
  
  // Verify the configuration matches the expected environment
  if (IS_PRODUCTION && environment.name !== 'PROD') {
    console.error('❌ MISMATCH: IS_PRODUCTION is true but environment is not PROD!');
  } else if (!IS_PRODUCTION && environment.name !== 'UAT') {
    console.error('❌ MISMATCH: IS_PRODUCTION is false but environment is not UAT!');
  } else {
    console.log('✅ Environment configuration is consistent');
  }
  
  console.log(''); // Empty line for readability
}; 