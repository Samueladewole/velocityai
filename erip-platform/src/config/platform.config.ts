/**
 * Platform Configuration
 * Controls which platform (ERIP or Velocity) is primary and how they interact
 */

export type PlatformMode = 'erip-primary' | 'velocity-primary' | 'dual-platform' | 'erip-only' | 'velocity-only';

export interface PlatformConfig {
  mode: PlatformMode;
  redirectMainDomain: boolean;
  showCrossPlatformLinks: boolean;
  enableFeatureMigration: boolean;
  allowPlatformSwitching: boolean;
}

// Environment-based configuration
const getPlatformMode = (): PlatformMode => {
  const envMode = import.meta.env.VITE_PLATFORM_MODE as PlatformMode;
  if (envMode) return envMode;
  
  // Default based on hostname
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  
  if (hostname.includes('velocity.')) return 'velocity-primary';
  if (hostname.includes('erip')) return 'erip-primary';
  
  return 'dual-platform'; // Default fallback
};

export const PLATFORM_CONFIG: PlatformConfig = {
  mode: getPlatformMode(),
  redirectMainDomain: import.meta.env.VITE_REDIRECT_MAIN_DOMAIN === 'true',
  showCrossPlatformLinks: import.meta.env.VITE_SHOW_CROSS_PLATFORM_LINKS !== 'false',
  enableFeatureMigration: import.meta.env.VITE_ENABLE_FEATURE_MIGRATION === 'true',
  allowPlatformSwitching: import.meta.env.VITE_ALLOW_PLATFORM_SWITCHING !== 'false',
};

// Platform-specific feature flags
export const ERIP_FEATURES = {
  // Core ERIP features
  PRISM: import.meta.env.VITE_ERIP_PRISM !== 'false',
  COMPASS: import.meta.env.VITE_ERIP_COMPASS !== 'false',
  ATLAS: import.meta.env.VITE_ERIP_ATLAS !== 'false',
  BEACON: import.meta.env.VITE_ERIP_BEACON !== 'false',
  CLEARANCE: import.meta.env.VITE_ERIP_CLEARANCE !== 'false',
  CIPHER: import.meta.env.VITE_ERIP_CIPHER !== 'false',
  NEXUS: import.meta.env.VITE_ERIP_NEXUS !== 'false',
  PULSE: import.meta.env.VITE_ERIP_PULSE !== 'false',
  
  // ERIP-specific tools
  QIE: import.meta.env.VITE_ERIP_QIE !== 'false',
  SHEETS: import.meta.env.VITE_ERIP_SHEETS !== 'false',
  TRUST_CENTER: import.meta.env.VITE_ERIP_TRUST_CENTER !== 'false',
  
  // Business features
  ENTERPRISE_SALES: import.meta.env.VITE_ERIP_ENTERPRISE_SALES !== 'false',
  MARKETPLACE: import.meta.env.VITE_ERIP_MARKETPLACE !== 'false',
  EXPERT_NETWORK: import.meta.env.VITE_ERIP_EXPERT_NETWORK !== 'false',
};

export const VELOCITY_FEATURES = {
  // Core Velocity features
  AI_AGENTS: import.meta.env.VITE_VELOCITY_AI_AGENTS !== 'false',
  LIVE_MONITORING: import.meta.env.VITE_VELOCITY_LIVE_MONITORING !== 'false',
  AUTO_EVIDENCE: import.meta.env.VITE_VELOCITY_AUTO_EVIDENCE !== 'false',
  CLOUD_INTEGRATIONS: import.meta.env.VITE_VELOCITY_CLOUD_INTEGRATIONS !== 'false',
  
  // Velocity-specific tools
  CUSTOM_AGENTS: import.meta.env.VITE_VELOCITY_CUSTOM_AGENTS !== 'false',
  CANVAS_DESIGN: import.meta.env.VITE_VELOCITY_CANVAS_DESIGN === 'true',
  COMPLIANCE_FLOWS: import.meta.env.VITE_VELOCITY_COMPLIANCE_FLOWS !== 'false',
  
  // Business features
  RAPID_ONBOARDING: import.meta.env.VITE_VELOCITY_RAPID_ONBOARDING !== 'false',
  SUBSCRIPTION_TIERS: import.meta.env.VITE_VELOCITY_SUBSCRIPTION_TIERS !== 'false',
};

// Shared features that both platforms can use
export const SHARED_FEATURES = {
  TRUST_SCORING: import.meta.env.VITE_SHARED_TRUST_SCORING !== 'false',
  COMPLIANCE_FRAMEWORKS: import.meta.env.VITE_SHARED_COMPLIANCE_FRAMEWORKS !== 'false',
  EVIDENCE_MANAGEMENT: import.meta.env.VITE_SHARED_EVIDENCE_MANAGEMENT !== 'false',
  REPORTING: import.meta.env.VITE_SHARED_REPORTING !== 'false',
  ANALYTICS: import.meta.env.VITE_SHARED_ANALYTICS !== 'false',
};

// Helper functions
export const isPlatformEnabled = (platform: 'erip' | 'velocity'): boolean => {
  const mode = PLATFORM_CONFIG.mode;
  
  if (platform === 'erip') {
    return mode === 'erip-primary' || mode === 'erip-only' || mode === 'dual-platform';
  }
  
  if (platform === 'velocity') {
    return mode === 'velocity-primary' || mode === 'velocity-only' || mode === 'dual-platform';
  }
  
  return false;
};

export const getPrimaryPlatform = (): 'erip' | 'velocity' | 'dual' => {
  const mode = PLATFORM_CONFIG.mode;
  
  if (mode === 'erip-primary' || mode === 'erip-only') return 'erip';
  if (mode === 'velocity-primary' || mode === 'velocity-only') return 'velocity';
  
  return 'dual';
};

export const shouldRedirectToPlatform = (): { redirect: boolean; target?: string } => {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  const mode = PLATFORM_CONFIG.mode;
  
  // Don't redirect if already on correct domain
  if (hostname.includes('velocity.') && (mode === 'velocity-primary' || mode === 'velocity-only')) {
    return { redirect: false };
  }
  
  if (hostname.includes('erip') && (mode === 'erip-primary' || mode === 'erip-only')) {
    return { redirect: false };
  }
  
  // Main domain redirect logic
  if ((hostname === 'eripapp.com' || hostname === 'www.eripapp.com') && PLATFORM_CONFIG.redirectMainDomain) {
    if (mode === 'velocity-primary' || mode === 'velocity-only') {
      return { redirect: true, target: 'https://velocity.eripapp.com' };
    }
    if (mode === 'erip-primary' || mode === 'erip-only') {
      return { redirect: true, target: 'https://app.eripapp.com' };
    }
  }
  
  return { redirect: false };
};

// Development mode overrides
export const DEV_CONFIG = {
  FORCE_PLATFORM: import.meta.env.VITE_FORCE_PLATFORM as 'erip' | 'velocity' | undefined,
  DISABLE_REDIRECTS: import.meta.env.VITE_DISABLE_REDIRECTS === 'true',
  SHOW_PLATFORM_SWITCHER: import.meta.env.VITE_SHOW_PLATFORM_SWITCHER === 'true',
  ENABLE_ALL_FEATURES: import.meta.env.VITE_ENABLE_ALL_FEATURES === 'true',
};

export default PLATFORM_CONFIG;