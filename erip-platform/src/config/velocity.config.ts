// Velocity Platform Configuration
export const velocityConfig = {
  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_VELOCITY_API_URL || 
             (import.meta.env.PROD 
               ? 'https://api.velocity.eripapp.com' 
               : 'http://localhost:8000'),
    version: 'v1',
    timeout: 30000,
  },

  // WebSocket Configuration
  websocket: {
    url: import.meta.env.VITE_VELOCITY_WS_URL || 
         (import.meta.env.PROD 
           ? 'wss://ws.velocity.eripapp.com' 
           : 'ws://localhost:8000/ws'),
    reconnectInterval: 5000,
    maxReconnectAttempts: 5,
  },

  // Authentication Configuration
  auth: {
    tokenKey: 'velocity_auth_token',
    refreshTokenKey: 'velocity_refresh_token',
    userKey: 'velocity_user',
    tokenExpiry: 3600000, // 1 hour
    refreshTokenExpiry: 604800000, // 7 days
  },

  // Feature Flags
  features: {
    mfa: true,
    socialAuth: true,
    advancedAnalytics: true,
    customAgents: true,
    teamCollaboration: true,
    apiAccess: true,
  },

  // Branding
  branding: {
    name: 'Velocity',
    tagline: 'AI-Powered Compliance Automation',
    logo: '/velocity-logo.svg',
    favicon: '/velocity-favicon.ico',
    primaryColor: '#7C3AED', // Purple
    secondaryColor: '#EC4899', // Pink
  },

  // Compliance Frameworks
  frameworks: {
    soc2: {
      name: 'SOC 2 Type II',
      controls: 64,
      description: 'Service Organization Control 2 security, availability, processing integrity, confidentiality, and privacy',
    },
    iso27001: {
      name: 'ISO 27001',
      controls: 114,
      description: 'Information Security Management System standard',
    },
    cisControls: {
      name: 'CIS Controls',
      controls: 153,
      description: 'Center for Internet Security Critical Security Controls v8.1',
      version: '8.1',
    },
    gdpr: {
      name: 'GDPR',
      controls: 47,
      description: 'General Data Protection Regulation compliance',
    },
    hipaa: {
      name: 'HIPAA',
      controls: 42,
      description: 'Health Insurance Portability and Accountability Act',
    },
    pciDss: {
      name: 'PCI DSS',
      controls: 78,
      description: 'Payment Card Industry Data Security Standard',
    },
  },

  // Pricing Tiers
  pricing: {
    currency: 'USD',
    tiers: {
      starter: {
        monthly: 249,
        annual: 2490,
        limits: {
          users: 5,
          frameworks: 10,
          evidenceItems: 500,
          apiCalls: 10000,
          storage: 50, // GB
        },
      },
      growth: {
        monthly: 549,
        annual: 5490,
        limits: {
          users: 20,
          frameworks: 25,
          evidenceItems: 2000,
          apiCalls: 50000,
          storage: 200,
        },
      },
      enterprise: {
        monthly: 1249,
        annual: 12490,
        limits: {
          users: 'unlimited',
          frameworks: 'unlimited',
          evidenceItems: 10000,
          apiCalls: 'unlimited',
          storage: 1000,
        },
      },
    },
  },

  // Cloud Integrations
  integrations: {
    aws: {
      enabled: true,
      regions: ['us-east-1', 'us-west-2', 'eu-west-1'],
    },
    gcp: {
      enabled: true,
      regions: ['us-central1', 'europe-west1'],
    },
    azure: {
      enabled: true,
      regions: ['eastus', 'westeurope'],
    },
    github: {
      enabled: true,
      scopes: ['repo', 'read:org'],
    },
    googleWorkspace: {
      enabled: true,
      scopes: ['drive.readonly', 'admin.directory.user.readonly'],
    },
  },

  // Monitoring & Analytics
  monitoring: {
    sentryDsn: import.meta.env.VITE_SENTRY_DSN,
    googleAnalyticsId: import.meta.env.VITE_GA_ID,
    posthogApiKey: import.meta.env.VITE_POSTHOG_KEY,
    posthogHost: import.meta.env.VITE_POSTHOG_HOST,
  },

  // Security Configuration
  security: {
    enableCSP: true,
    enableHSTS: true,
    enableXFrameOptions: true,
    allowedOrigins: [
      'https://velocity.eripapp.com',
      'https://api.velocity.eripapp.com',
    ],
  },
};

export default velocityConfig;