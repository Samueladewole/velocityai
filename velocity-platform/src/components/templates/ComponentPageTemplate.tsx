import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrustPointsDisplay } from '@/components/shared/TrustPointsDisplay';
import { cn } from '@/lib/utils';
import { Star, TrendingUp, TrendingDown, Wifi, WifiOff, Settings, Download, Share2 } from 'lucide-react';

// Enhanced components
import { ChartRenderer } from './ChartRenderer';
import { ModalSystem, useModalSystem } from './ModalSystem';
import { ExportSystem } from './ExportSystem';
import { EnhancedTabs, useEnhancedTabs } from './EnhancedTabs';
import { useRealTimeData } from '@/hooks/useRealTimeData';

// Enhanced types
import { 
  EnhancedComponentPageTemplateProps,
  StatCard,
  AdvancedTabConfiguration,
  UseComponentPageTemplate
} from '@/types/componentTemplate';

// Legacy interfaces for backward compatibility
export interface TabConfiguration {
  id: string;
  label: string;
  content: React.ReactNode;
  badge?: string | number;
}

export interface ComponentPageTemplateProps {
  title: string;
  subtitle?: string;
  description?: string;
  trustScore?: number;
  trustPoints?: number;
  quickStats: StatCard[];
  tabs?: TabConfiguration[];
  actions?: React.ReactNode;
  children?: React.ReactNode;
  headerGradient?: string;
  className?: string;
}

// Re-export StatCard from types
export type { StatCard };

// Enhanced Component Page Template
export const EnhancedComponentPageTemplate: React.FC<EnhancedComponentPageTemplateProps> = ({
  // Basic props
  title,
  subtitle,
  description,
  trustScore,
  trustPoints,
  quickStats,
  tabs = [],
  actions,
  children,
  headerGradient = 'from-slate-50 to-white',
  className,
  
  // Enhanced props
  realTime,
  charts = {},
  modals = {},
  drawers = {},
  export: exportConfig,
  sharing: sharingConfig,
  interactive,
  layout,
  notifications,
  analytics,
  
  // Event handlers
  onPageLoad,
  onPageUnload,
  onUserInteraction,
  onError,
  
  // Advanced layout options
  headerActions,
  headerContent,
  footerContent,
  sidebarContent,
  overlayContent,
  
  // Performance options
  lazyLoading = false,
  virtualizeTabContent = false,
  optimizeReRenders = false,
  
  // Accessibility options
  a11y,
  
  // Theme options
  theme = 'light',
  customTheme,
  cssVariables
}) => {
  const pageRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Enhanced tabs management
  const enhancedTabsHook = useEnhancedTabs(tabs as AdvancedTabConfiguration[]);
  
  // Modal and drawer management
  const modalSystem = useModalSystem();
  
  // Real-time data management
  const realTimeData = useRealTimeData(realTime || { enabled: false });
  
  // Connection status indicator
  const ConnectionIndicator = () => {
    if (!realTime?.enabled || !realTime.connectionIndicator) return null;
    
    return (
      <div className={`fixed bottom-4 right-4 px-3 py-1 rounded-full text-xs font-medium transition-colors z-50 ${
        realTimeData.state.isConnected
          ? 'bg-green-100 text-green-800 border border-green-200' 
          : 'bg-red-100 text-red-800 border border-red-200'
      }`}>
        {realTimeData.state.isConnected ? (
          <>
            <Wifi className="h-3 w-3 inline mr-1" />
            Live
          </>
        ) : (
          <>
            <WifiOff className="h-3 w-3 inline mr-1" />
            Offline
          </>
        )}
      </div>
    );
  };
  
  // Page lifecycle effects
  useEffect(() => {
    onPageLoad?.();
    analytics?.onEvent?.('page_view', { title, timestamp: new Date() });
    
    return () => {
      onPageUnload?.();
    };
  }, [onPageLoad, onPageUnload, analytics, title]);
  
  // Error boundary effect
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      const error = new Error(event.message);
      setError(error);
      onError?.(error);
    };
    
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, [onError]);
  
  // Apply custom CSS variables
  useEffect(() => {
    if (cssVariables) {
      Object.entries(cssVariables).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value);
      });
    }
  }, [cssVariables]);
  
  // Render quick stats with enhanced features
  const renderQuickStats = () => {
    if (quickStats.length === 0) return null;
    
    return (
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="quick-stats-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <Card 
              key={index} 
              className={cn(
                "card-professional border-0 shadow-lg hover:shadow-xl transition-all duration-300",
                stat.onClick && "cursor-pointer"
              )}
              onClick={stat.onClick}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-slate-600">{stat.label}</p>
                      {stat.loading && (
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      )}
                    </div>
                    <p className={cn(
                      "text-2xl font-bold transition-all duration-300",
                      stat.color || "text-slate-900",
                      stat.animated && "animate-pulse"
                    )}>
                      {typeof stat.value === 'number' && stat.label.toLowerCase().includes('score') 
                        ? `${stat.value}%` 
                        : stat.value
                      }
                    </p>
                    {stat.change && (
                      <div className="flex items-center gap-1 text-sm">
                        {stat.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-600" />}
                        {stat.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-600" />}
                        <span className={cn(
                          "font-medium",
                          stat.trend === 'up' ? "text-green-600" : 
                          stat.trend === 'down' ? "text-red-600" : "text-slate-600"
                        )}>
                          {stat.change}
                        </span>
                      </div>
                    )}
                    {stat.description && (
                      <p className="text-xs text-slate-500">{stat.description}</p>
                    )}
                    {stat.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {stat.badge}
                      </Badge>
                    )}
                  </div>
                  {stat.icon && (
                    <div className="p-3 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50">
                      {stat.icon}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };
  
  // Render charts
  const renderCharts = () => {
    if (Object.keys(charts).length === 0) return null;
    
    return (
      <div className="space-y-6">
        {Object.entries(charts).map(([chartId, chartConfig]) => (
          <ChartRenderer
            key={chartId}
            id={chartId}
            title={chartConfig.title}
            config={chartConfig}
            realTimeData={realTimeData.state.data?.[chartId]}
            onChartEvent={(event, data) => {
              onUserInteraction?.(`chart_${event}`, { chartId, ...data });
              analytics?.onEvent?.(`chart_${event}`, { chartId, ...data });
            }}
          />
        ))}
      </div>
    );
  };
  
  // Render main content
  const renderMainContent = () => {
    if (tabs && tabs.length > 0) {
      return (
        <EnhancedTabs
          tabs={tabs as AdvancedTabConfiguration[]}
          activeTab={enhancedTabsHook.activeTab}
          onTabChange={(tabId, previousTab) => {
            enhancedTabsHook.setActiveTab(tabId);
            onUserInteraction?.('tab_change', { from: previousTab, to: tabId });
            analytics?.onEvent?.('tab_change', { from: previousTab, to: tabId });
          }}
          variant="default"
          scrollable={true}
          className="space-y-6"
        />
      );
    }
    
    return children;
  };
  
  return (
    <div 
      ref={pageRef}
      className={cn(
        "component-page-layout min-h-screen",
        theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-gradient-to-br from-slate-50 to-slate-100',
        layout?.variant === 'wide' && 'max-w-none',
        layout?.variant === 'narrow' && 'max-w-4xl mx-auto',
        layout?.variant === 'fluid' && 'w-full',
        className
      )}
      style={customTheme}
    >
      {/* Page Header */}
      <div className={cn(
        "component-page-header border-b border-slate-200",
        layout?.headerSticky && "sticky top-0 z-40 backdrop-blur-sm",
        theme === 'dark' ? 'bg-slate-800 border-slate-700' : `bg-gradient-to-br ${headerGradient}`
      )}>
        <div className="container mx-auto px-6 py-8 max-w-7xl">
          <div className="flex items-start justify-between mb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <h1 className={cn(
                  "text-3xl font-bold",
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                )}>
                  {title}
                </h1>
                {trustScore && (
                  <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    Trust Score: {trustScore}%
                  </Badge>
                )}
                {realTime?.enabled && realTimeData.state.isConnected && (
                  <Badge className="bg-green-100 text-green-800 border border-green-200">
                    <Wifi className="h-3 w-3 mr-1" />
                    Live
                  </Badge>
                )}
              </div>
              {subtitle && (
                <h2 className={cn(
                  "text-xl",
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                )}>
                  {subtitle}
                </h2>
              )}
              {description && (
                <p className={cn(
                  "max-w-3xl",
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                )}>
                  {description}
                </p>
              )}
              {trustPoints && (
                <div className="flex items-center gap-2 text-sm">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <TrustPointsDisplay points={trustPoints} />
                </div>
              )}
              {headerContent}
            </div>
            
            {/* Header Actions */}
            <div className="flex items-center gap-3">
              {headerActions}
              {actions}
              
              {/* Built-in export/share actions */}
              {exportConfig?.enabled && (
                <button
                  onClick={() => modalSystem.openModal('export')}
                  className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Export
                </button>
              )}
              
              {sharingConfig?.enabled && (
                <button
                  onClick={() => modalSystem.openModal('share')}
                  className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      {layout?.sidebar?.enabled && (
        <div className={cn(
          "fixed top-0 h-full bg-white border-r border-slate-200 z-30 transition-transform duration-300",
          layout.sidebar.position === 'left' ? 'left-0' : 'right-0'
        )}>
          <div className="p-4">
            {sidebarContent || layout.sidebar.content}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className={cn(
        layout?.sidebar?.enabled && `${layout.sidebar.position === 'left' ? 'ml-64' : 'mr-64'}`
      )}>
        {/* Quick Stats */}
        {renderQuickStats()}
        
        {/* Charts */}
        {Object.keys(charts).length > 0 && (
          <div className="container mx-auto px-6 py-4 max-w-7xl">
            {renderCharts()}
          </div>
        )}

        {/* Main Content */}
        <div className="container mx-auto px-6 pb-8 max-w-7xl">
          {error ? (
            <div className="flex items-center justify-center h-64 text-red-600">
              <div className="text-center">
                <p className="text-lg font-semibold mb-2">Something went wrong</p>
                <p className="text-sm">{error.message}</p>
              </div>
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-slate-600">Loading...</p>
              </div>
            </div>
          ) : (
            renderMainContent()
          )}
        </div>
      </div>

      {/* Footer */}
      {footerContent && (
        <footer className={cn(
          "border-t",
          theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'
        )}>
          <div className="container mx-auto px-6 py-8 max-w-7xl">
            {footerContent}
          </div>
        </footer>
      )}

      {/* Modal System */}
      <ModalSystem
        modals={{
          ...modals,
          ...(exportConfig?.enabled && {
            export: {
              id: 'export',
              title: 'Export Data',
              content: exportConfig && (
                <ExportSystem
                  title={title}
                  data={realTimeData.state.data || quickStats}
                  exportConfig={exportConfig}
                  sharingConfig={sharingConfig || { enabled: false }}
                  pageElement={pageRef}
                  onExport={(format, success) => {
                    analytics?.onEvent?.('export', { format, success });
                    if (success) {
                      modalSystem.closeModal('export');
                    }
                  }}
                />
              )
            }
          }),
          ...(sharingConfig?.enabled && {
            share: {
              id: 'share',
              title: 'Share Page',
              content: exportConfig && sharingConfig && (
                <ExportSystem
                  title={title}
                  data={realTimeData.state.data || quickStats}
                  exportConfig={{ enabled: false, formats: [] }}
                  sharingConfig={sharingConfig}
                  onShare={(platform, url) => {
                    analytics?.onEvent?.('share', { platform, url });
                    modalSystem.closeModal('share');
                  }}
                />
              )
            }
          })
        }}
        drawers={drawers}
        activeModal={modalSystem.activeModal}
        activeDrawer={modalSystem.activeDrawer}
        onModalChange={(modalId) => {
          if (modalId) {
            modalSystem.openModal(modalId);
          } else {
            modalSystem.closeModal();
          }
        }}
        onDrawerChange={(drawerId) => {
          if (drawerId) {
            modalSystem.openDrawer(drawerId);
          } else {
            modalSystem.closeDrawer();
          }
        }}
      />

      {/* Overlay Content */}
      {overlayContent}

      {/* Connection Indicator */}
      <ConnectionIndicator />
    </div>
  );
};

// Legacy Component (backward compatible)
export const ComponentPageTemplate: React.FC<ComponentPageTemplateProps> = (props) => {
  // Convert legacy props to enhanced props
  const enhancedProps: EnhancedComponentPageTemplateProps = {
    ...props,
    // Set sensible defaults for enhanced features
    realTime: { enabled: false },
    charts: {},
    modals: {},
    drawers: {},
    export: { enabled: false, formats: [] },
    sharing: { enabled: false },
    interactive: {},
    layout: { variant: 'standard' },
    notifications: {},
    analytics: {}
  };
  
  return <EnhancedComponentPageTemplate {...enhancedProps} />;
};