/**
 * Enhanced Component Page Template Types
 * Comprehensive type definitions for advanced ERIP platform features
 */
import React from 'react';

// Re-export existing interfaces for compatibility
export interface StatCard {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  description?: string;
  color?: string;
  // Enhanced features
  onClick?: () => void;
  loading?: boolean;
  animated?: boolean;
  badge?: string | number;
  tooltip?: string;
}

// Enhanced Tab Configuration
export interface AdvancedTabConfiguration {
  id: string;
  label: string;
  content: React.ReactNode;
  badge?: string | number;
  // Enhanced features
  icon?: React.ReactNode;
  disabled?: boolean;
  hidden?: boolean;
  loading?: boolean;
  progressValue?: number;
  onTabChange?: (tabId: string) => void;
  headerActions?: React.ReactNode;
  className?: string;
  requirements?: string[];
  tooltip?: string;
}

// Real-time Data Configuration
export interface RealTimeConfig {
  enabled: boolean;
  websocketUrl?: string;
  refreshInterval?: number;
  connectionIndicator?: boolean;
  onConnectionChange?: (status: 'connected' | 'disconnected' | 'error') => void;
  onDataUpdate?: (data: any) => void;
}

// Chart Configuration
export interface ChartConfig {
  type: 'line' | 'area' | 'bar' | 'pie' | 'radar' | 'radial' | 'scatter' | 'treemap';
  data: any[];
  options?: any;
  realTimeUpdates?: boolean;
  exportable?: boolean;
  interactive?: boolean;
  onChartEvent?: (event: string, data: any) => void;
}

// Modal Configuration
export interface ModalConfig {
  id: string;
  title: string;
  content: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closable?: boolean;
  backdrop?: boolean;
  onClose?: () => void;
  actions?: React.ReactNode;
  className?: string;
}

// Drawer Configuration
export interface DrawerConfig {
  id: string;
  title: string;
  content: React.ReactNode;
  position?: 'left' | 'right' | 'top' | 'bottom';
  size?: number | string;
  overlay?: boolean;
  onClose?: () => void;
  actions?: React.ReactNode;
}

// Export Configuration
export interface ExportConfig {
  enabled: boolean;
  formats: Array<'pdf' | 'csv' | 'excel' | 'json' | 'png'>;
  filename?: string;
  customExporter?: (format: string, data: any) => Promise<void>;
  watermark?: string;
  metadata?: Record<string, any>;
}

// Sharing Configuration
export interface SharingConfig {
  enabled: boolean;
  publicUrl?: string;
  qrCode?: boolean;
  socialMedia?: Array<'linkedin' | 'twitter' | 'email' | 'teams'>;
  accessControls?: {
    requireAuth?: boolean;
    expiration?: Date;
    permissions?: string[];
  };
  onShare?: (platform: string, url: string) => void;
}

// Interactive Element Configuration
export interface InteractiveConfig {
  dragAndDrop?: {
    enabled: boolean;
    zones: string[];
    onDrop?: (item: any, zone: string) => void;
  };
  inlineEditing?: {
    enabled: boolean;
    fields: string[];
    onEdit?: (field: string, value: any) => void;
  };
  contextMenu?: {
    enabled: boolean;
    items: Array<{
      label: string;
      icon?: React.ReactNode;
      action: () => void;
      separator?: boolean;
    }>;
  };
}

// Layout Configuration
export interface LayoutConfig {
  variant?: 'standard' | 'wide' | 'narrow' | 'fluid';
  sidebar?: {
    enabled: boolean;
    position: 'left' | 'right';
    collapsible: boolean;
    content: React.ReactNode;
    width?: number | string;
  };
  headerSticky?: boolean;
  footerContent?: React.ReactNode;
  customStyles?: Record<string, string>;
}

// Notification Configuration
export interface NotificationConfig {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center';
  autoClose?: number;
  showProgress?: boolean;
  types?: Array<'success' | 'error' | 'warning' | 'info'>;
}

// Analytics Configuration
export interface AnalyticsConfig {
  trackPageViews?: boolean;
  trackInteractions?: boolean;
  trackTimeOnPage?: boolean;
  customEvents?: Record<string, any>;
  onEvent?: (event: string, data: any) => void;
}

// Enhanced Component Page Template Props
export interface EnhancedComponentPageTemplateProps {
  // Basic properties (backward compatible)
  title: string;
  subtitle?: string;
  description?: string;
  trustScore?: number;
  trustPoints?: number;
  quickStats: StatCard[];
  tabs?: AdvancedTabConfiguration[];
  actions?: React.ReactNode;
  children?: React.ReactNode;
  headerGradient?: string;
  className?: string;

  // Enhanced features
  realTime?: RealTimeConfig;
  charts?: Record<string, ChartConfig>;
  modals?: Record<string, ModalConfig>;
  drawers?: Record<string, DrawerConfig>;
  export?: ExportConfig;
  sharing?: SharingConfig;
  interactive?: InteractiveConfig;
  layout?: LayoutConfig;
  notifications?: NotificationConfig;
  analytics?: AnalyticsConfig;

  // Event handlers
  onPageLoad?: () => void;
  onPageUnload?: () => void;
  onUserInteraction?: (interaction: string, data: any) => void;
  onError?: (error: Error) => void;

  // Advanced layout options
  headerActions?: React.ReactNode;
  headerContent?: React.ReactNode;
  footerContent?: React.ReactNode;
  sidebarContent?: React.ReactNode;
  overlayContent?: React.ReactNode;

  // Performance options
  lazyLoading?: boolean;
  virtualizeTabContent?: boolean;
  optimizeReRenders?: boolean;

  // Accessibility options
  a11y?: {
    announceChanges?: boolean;
    skipToContent?: boolean;
    highContrast?: boolean;
    screenReaderOptimized?: boolean;
  };

  // Theme and styling
  theme?: 'light' | 'dark' | 'auto';
  customTheme?: Record<string, any>;
  cssVariables?: Record<string, string>;
}

// Component-specific configurations
export interface DashboardConfig extends EnhancedComponentPageTemplateProps {
  widgets?: Array<{
    id: string;
    type: string;
    config: any;
    position: { x: number; y: number; w: number; h: number };
  }>;
  refreshInterval?: number;
  autoRefresh?: boolean;
}

export interface ReportConfig extends EnhancedComponentPageTemplateProps {
  reportId: string;
  filters?: Record<string, any>;
  dateRange?: { start: Date; end: Date };
  scheduledExport?: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    recipients: string[];
  };
}

export interface AssessmentConfig extends EnhancedComponentPageTemplateProps {
  assessmentId: string;
  questions?: any[];
  progress?: number;
  timeLimit?: number;
  autoSave?: boolean;
  onProgress?: (progress: number) => void;
  onComplete?: (results: any) => void;
}

// Hook return types
export interface UseComponentPageTemplate {
  // State management
  activeTab: string;
  setActiveTab: (tabId: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: Error | null;
  setError: (error: Error | null) => void;

  // Modal management
  openModal: (modalId: string) => void;
  closeModal: (modalId: string) => void;
  isModalOpen: (modalId: string) => boolean;

  // Drawer management
  openDrawer: (drawerId: string) => void;
  closeDrawer: (drawerId: string) => void;
  isDrawerOpen: (drawerId: string) => boolean;

  // Export functions
  exportData: (format: string, data?: any) => Promise<void>;
  generateShareLink: () => string;
  generateQRCode: () => string;

  // Real-time functions
  connectWebSocket: () => void;
  disconnectWebSocket: () => void;
  isConnected: boolean;

  // Notification functions
  showNotification: (type: string, message: string, options?: any) => void;
  hideNotification: (id: string) => void;

  // Analytics functions
  trackEvent: (event: string, data?: any) => void;
  trackPageView: () => void;
}

// Context types
export interface ComponentPageTemplateContext {
  config: EnhancedComponentPageTemplateProps;
  state: any;
  actions: UseComponentPageTemplate;
}

// Utility types
export type TabChangeHandler = (previousTab: string, newTab: string) => void;
export type DataUpdateHandler = (data: any, source: 'websocket' | 'poll' | 'manual') => void;
export type ExportHandler = (format: string, data: any) => Promise<Blob | string>;
export type ShareHandler = (platform: string, url: string) => Promise<void>;

// Component variants
export type ComponentPageVariant = 
  | 'dashboard'
  | 'report'
  | 'assessment' 
  | 'analysis'
  | 'configuration'
  | 'standard';

// Theme configuration
export interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  spacing: Record<string, string>;
  typography: Record<string, any>;
  shadows: Record<string, string>;
  borderRadius: Record<string, string>;
}

// Performance monitoring
export interface PerformanceMetrics {
  renderTime: number;
  loadTime: number;
  interactionDelay: number;
  memoryUsage: number;
  bundleSize: number;
}

export default EnhancedComponentPageTemplateProps;