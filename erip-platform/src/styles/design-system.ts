/**
 * ERIP Enterprise Design System
 * Consistent spacing, typography, and design tokens for the platform
 */

// Spacing Scale (based on 4px base unit)
export const spacing = {
  0: '0',
  px: '1px',
  0.5: '0.125rem', // 2px
  1: '0.25rem',    // 4px
  1.5: '0.375rem', // 6px
  2: '0.5rem',     // 8px
  2.5: '0.625rem', // 10px
  3: '0.75rem',    // 12px
  3.5: '0.875rem', // 14px
  4: '1rem',       // 16px
  5: '1.25rem',    // 20px
  6: '1.5rem',     // 24px
  7: '1.75rem',    // 28px
  8: '2rem',       // 32px
  9: '2.25rem',    // 36px
  10: '2.5rem',    // 40px
  11: '2.75rem',   // 44px
  12: '3rem',      // 48px
  14: '3.5rem',    // 56px
  16: '4rem',      // 64px
  20: '5rem',      // 80px
  24: '6rem',      // 96px
  28: '7rem',      // 112px
  32: '8rem',      // 128px
  36: '9rem',      // 144px
  40: '10rem',     // 160px
  44: '11rem',     // 176px
  48: '12rem',     // 192px
  52: '13rem',     // 208px
  56: '14rem',     // 224px
  60: '15rem',     // 240px
  64: '16rem',     // 256px
  72: '18rem',     // 288px
  80: '20rem',     // 320px
  96: '24rem',     // 384px
} as const;

// Typography Scale
export const typography = {
  // Font Families
  fontFamily: {
    sans: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: '"SF Mono", "Monaco", "Inconsolata", "Fira Code", "Fira Mono", "Droid Sans Mono", "Courier New", monospace',
  },

  // Font Sizes
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.01em' }],       // 12px
    sm: ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.005em' }],  // 14px
    base: ['1rem', { lineHeight: '1.5rem', letterSpacing: '0' }],           // 16px
    lg: ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.005em' }], // 18px
    xl: ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }],   // 20px
    '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.015em' }],   // 24px
    '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.02em' }], // 30px
    '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.025em' }],  // 36px
    '5xl': ['3rem', { lineHeight: '1', letterSpacing: '-0.03em' }],           // 48px
    '6xl': ['3.75rem', { lineHeight: '1', letterSpacing: '-0.035em' }],       // 60px
    '7xl': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.04em' }],         // 72px
    '8xl': ['6rem', { lineHeight: '1', letterSpacing: '-0.045em' }],          // 96px
    '9xl': ['8rem', { lineHeight: '1', letterSpacing: '-0.05em' }],           // 128px
  },

  // Font Weights
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },

  // Line Heights
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },

  // Letter Spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const;

// Border Radius
export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  default: '0.25rem', // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',
} as const;

// Shadows
export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  default: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  
  // Premium shadows for elevated components
  premium: {
    sm: '0 2px 8px -2px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06)',
    md: '0 12px 16px -4px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
    lg: '0 20px 24px -4px rgba(0, 0, 0, 0.08), 0 8px 8px -4px rgba(0, 0, 0, 0.03)',
    xl: '0 24px 48px -12px rgba(0, 0, 0, 0.18)',
  },
  
  // Colored shadows for accent elements
  colored: {
    blue: '0 4px 14px 0 rgba(59, 130, 246, 0.5)',
    purple: '0 4px 14px 0 rgba(139, 92, 246, 0.5)',
    emerald: '0 4px 14px 0 rgba(16, 185, 129, 0.5)',
    orange: '0 4px 14px 0 rgba(251, 146, 60, 0.5)',
    rose: '0 4px 14px 0 rgba(244, 63, 94, 0.5)',
  },
} as const;

// Transitions
export const transitions = {
  duration: {
    75: '75ms',
    100: '100ms',
    150: '150ms',
    200: '200ms',
    300: '300ms',
    500: '500ms',
    700: '700ms',
    1000: '1000ms',
  },
  timing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
} as const;

// Z-Index Scale
export const zIndex = {
  0: 0,
  10: 10,
  20: 20,
  30: 30,
  40: 40,
  50: 50,
  auto: 'auto',
  // Semantic z-indexes
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
} as const;

// Breakpoints
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Component-specific tokens
export const components = {
  card: {
    padding: {
      sm: spacing[3],
      md: spacing[4],
      lg: spacing[6],
    },
    borderRadius: borderRadius.xl,
    shadow: shadows.md,
  },
  
  button: {
    padding: {
      xs: `${spacing[2]} ${spacing[3]}`,
      sm: `${spacing[2.5]} ${spacing[3.5]}`,
      md: `${spacing[2.5]} ${spacing[4]}`,
      lg: `${spacing[3]} ${spacing[6]}`,
    },
    borderRadius: borderRadius.lg,
    fontSize: {
      xs: typography.fontSize.xs,
      sm: typography.fontSize.sm,
      md: typography.fontSize.sm,
      lg: typography.fontSize.base,
    },
  },
  
  input: {
    padding: {
      sm: `${spacing[2]} ${spacing[3]}`,
      md: `${spacing[2.5]} ${spacing[3]}`,
      lg: `${spacing[3]} ${spacing[4]}`,
    },
    borderRadius: borderRadius.lg,
    fontSize: {
      sm: typography.fontSize.sm,
      md: typography.fontSize.base,
      lg: typography.fontSize.lg,
    },
  },
  
  badge: {
    padding: {
      sm: `${spacing[0.5]} ${spacing[2]}`,
      md: `${spacing[1]} ${spacing[2.5]}`,
      lg: `${spacing[1.5]} ${spacing[3]}`,
    },
    borderRadius: borderRadius.full,
    fontSize: {
      sm: typography.fontSize.xs,
      md: typography.fontSize.sm,
      lg: typography.fontSize.base,
    },
  },
} as const;

// Animation Keyframes
export const animations = {
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  fadeOut: {
    from: { opacity: 1 },
    to: { opacity: 0 },
  },
  slideInUp: {
    from: { transform: 'translateY(100%)', opacity: 0 },
    to: { transform: 'translateY(0)', opacity: 1 },
  },
  slideInDown: {
    from: { transform: 'translateY(-100%)', opacity: 0 },
    to: { transform: 'translateY(0)', opacity: 1 },
  },
  slideInLeft: {
    from: { transform: 'translateX(-100%)', opacity: 0 },
    to: { transform: 'translateX(0)', opacity: 1 },
  },
  slideInRight: {
    from: { transform: 'translateX(100%)', opacity: 0 },
    to: { transform: 'translateX(0)', opacity: 1 },
  },
  scaleIn: {
    from: { transform: 'scale(0.95)', opacity: 0 },
    to: { transform: 'scale(1)', opacity: 1 },
  },
  scaleOut: {
    from: { transform: 'scale(1)', opacity: 1 },
    to: { transform: 'scale(0.95)', opacity: 0 },
  },
  pulse: {
    '0%, 100%': { opacity: 1 },
    '50%': { opacity: 0.5 },
  },
  bounce: {
    '0%, 100%': { transform: 'translateY(0)' },
    '50%': { transform: 'translateY(-25%)' },
  },
  spin: {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
  },
  shimmer: {
    from: { backgroundPosition: '-200% 0' },
    to: { backgroundPosition: '200% 0' },
  },
} as const;

// Semantic Colors (for use with CSS variables)
export const semanticColors = {
  background: {
    primary: 'hsl(var(--background))',
    secondary: 'hsl(var(--secondary))',
    muted: 'hsl(var(--muted))',
    card: 'hsl(var(--card))',
    popover: 'hsl(var(--popover))',
  },
  foreground: {
    primary: 'hsl(var(--foreground))',
    secondary: 'hsl(var(--secondary-foreground))',
    muted: 'hsl(var(--muted-foreground))',
    card: 'hsl(var(--card-foreground))',
    popover: 'hsl(var(--popover-foreground))',
  },
  border: {
    default: 'hsl(var(--border))',
    input: 'hsl(var(--input))',
  },
  primary: {
    default: 'hsl(var(--primary))',
    foreground: 'hsl(var(--primary-foreground))',
  },
  secondary: {
    default: 'hsl(var(--secondary))',
    foreground: 'hsl(var(--secondary-foreground))',
  },
  accent: {
    default: 'hsl(var(--accent))',
    foreground: 'hsl(var(--accent-foreground))',
  },
  destructive: {
    default: 'hsl(var(--destructive))',
    foreground: 'hsl(var(--destructive-foreground))',
  },
  muted: {
    default: 'hsl(var(--muted))',
    foreground: 'hsl(var(--muted-foreground))',
  },
  ring: 'hsl(var(--ring))',
} as const;

// Utility function to create consistent class names
export const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ');
};

// Export all design tokens as a single object
export const designSystem = {
  spacing,
  typography,
  borderRadius,
  shadows,
  transitions,
  zIndex,
  breakpoints,
  components,
  animations,
  semanticColors,
} as const;

export default designSystem;