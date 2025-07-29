/**
 * Feature Flags Configuration
 * Strategy: Hide ERIP, Launch Velocity
 * Preserves all ERIP functionality while making Velocity the primary focus
 */

export const FEATURES = {
  // Primary strategy flags
  SHOW_FULL_ERIP: process.env.REACT_APP_SHOW_FULL_ERIP === 'true',
  VELOCITY_ONLY: process.env.REACT_APP_VELOCITY_ONLY !== 'false', // Default to Velocity-only
  
  // Domain redirects
  REDIRECT_TO_VELOCITY: process.env.REACT_APP_REDIRECT_TO_VELOCITY !== 'false',
  
  // Individual ERIP component flags (all hidden by default)
  SHOW_PRISM: process.env.REACT_APP_SHOW_PRISM === 'true',
  SHOW_COMPASS: process.env.REACT_APP_SHOW_COMPASS === 'true', 
  SHOW_ATLAS: process.env.REACT_APP_SHOW_ATLAS === 'true',
  SHOW_NEXUS: process.env.REACT_APP_SHOW_NEXUS === 'true',
  SHOW_BEACON: process.env.REACT_APP_SHOW_BEACON === 'true',
  SHOW_CIPHER: process.env.REACT_APP_SHOW_CIPHER === 'true',
  SHOW_CLEARANCE: process.env.REACT_APP_SHOW_CLEARANCE === 'true',
  SHOW_PULSE: process.env.REACT_APP_SHOW_PULSE === 'true',
  SHOW_SHEETS: process.env.REACT_APP_SHOW_SHEETS === 'true',
  
  // Velocity features (all enabled)
  SHOW_QIE: true,  // Keep QIE for Velocity
  SHOW_TRUST_SCORE: true,
  SHOW_AI_AGENTS: true,
  SHOW_VELOCITY_DASHBOARD: true,
  SHOW_VELOCITY_CREATOR: true,
  SHOW_VELOCITY_EVIDENCE: true,
  SHOW_VELOCITY_PRICING: true,
  
  // Navigation flags
  SHOW_PLATFORM_NAV: process.env.REACT_APP_SHOW_PLATFORM_NAV === 'true',
  SHOW_SOLUTIONS_NAV: process.env.REACT_APP_SHOW_SOLUTIONS_NAV === 'true',
  SHOW_TOOLS_NAV: process.env.REACT_APP_SHOW_TOOLS_NAV === 'true',
  
  // Company pages (keep these accessible)
  SHOW_ABOUT: true,
  SHOW_CAREERS: true,
  SHOW_CONTACT: true,
  SHOW_LEGAL: true,
} as const;

// Environment detection
export const ENV = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isVelocitySubdomain: typeof window !== 'undefined' && 
    (window.location.hostname.startsWith('velocity.') || 
     window.location.pathname.startsWith('/velocity')),
} as const;

// Computed flags based on environment
export const COMPUTED_FEATURES = {
  // Show full ERIP only in development OR if explicitly enabled
  showERIP: FEATURES.SHOW_FULL_ERIP || (ENV.isDevelopment && !FEATURES.VELOCITY_ONLY),
  
  // Always show Velocity features
  showVelocity: true,
  
  // Show debug info in development
  showDebugInfo: ENV.isDevelopment,
} as const;

// Helper functions
export const isFeatureEnabled = (feature: keyof typeof FEATURES): boolean => {
  return FEATURES[feature] === true;
};

export const shouldShowERIPComponent = (component: string): boolean => {
  if (COMPUTED_FEATURES.showERIP) return true;
  return isFeatureEnabled(`SHOW_${component.toUpperCase()}` as keyof typeof FEATURES);
};

// Debug logging in development
if (ENV.isDevelopment) {
  console.group('🚩 Feature Flags Configuration');
  console.log('Velocity Only Mode:', FEATURES.VELOCITY_ONLY);
  console.log('Show Full ERIP:', FEATURES.SHOW_FULL_ERIP);
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Hostname:', typeof window !== 'undefined' ? window.location.hostname : 'SSR');
  console.groupEnd();
}