/**
 * Enhanced Tab System for Component Page Template
 * Supports conditional rendering, progress indicators, tab-specific actions, and more
 */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  CheckCircle,
  AlertCircle,
  Clock,
  Lock,
  Eye,
  EyeOff,
  Settings,
  RefreshCw
} from 'lucide-react';
import { AdvancedTabConfiguration } from '@/types/componentTemplate';

interface EnhancedTabsProps {
  tabs: AdvancedTabConfiguration[];
  defaultTab?: string;
  activeTab?: string;
  onTabChange?: (tabId: string, previousTab: string) => void;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'pills' | 'underline' | 'cards';
  scrollable?: boolean;
  closable?: boolean;
  reorderable?: boolean;
  persistState?: boolean;
  className?: string;
  tabListClassName?: string;
  tabContentClassName?: string;
}

interface TabState {
  activeTab: string;
  tabOrder: string[];
  hiddenTabs: Set<string>;
  tabProgress: Record<string, number>;
  tabErrors: Record<string, string>;
}

interface TabMetrics {
  viewTime: Record<string, number>;
  switchCount: number;
  lastAccessed: Record<string, Date>;
}

export const EnhancedTabs: React.FC<EnhancedTabsProps> = ({
  tabs,
  defaultTab,
  activeTab: controlledActiveTab,
  onTabChange,
  orientation = 'horizontal',
  variant = 'default',
  scrollable = true,
  closable = false,
  reorderable = false,
  persistState = false,
  className,
  tabListClassName,
  tabContentClassName
}) => {
  const [tabState, setTabState] = useState<TabState>(() => {
    const initialTab = controlledActiveTab || defaultTab || tabs[0]?.id;
    return {
      activeTab: initialTab,
      tabOrder: tabs.map(tab => tab.id),
      hiddenTabs: new Set(),
      tabProgress: {},
      tabErrors: {}
    };
  });

  const [tabMetrics, setTabMetrics] = useState<TabMetrics>({
    viewTime: {},
    switchCount: 0,
    lastAccessed: {}
  });

  const [scrollPosition, setScrollPosition] = useState(0);
  const [showTabMenu, setShowTabMenu] = useState(false);

  // Load persisted state
  useEffect(() => {
    if (persistState) {
      const saved = localStorage.getItem('enhanced-tabs-state');
      if (saved) {
        try {
          const parsedState = JSON.parse(saved);
          setTabState(prev => ({ ...prev, ...parsedState }));
        } catch (error) {
          console.error('Failed to load tab state:', error);
        }
      }
    }
  }, [persistState]);

  // Save state to localStorage
  useEffect(() => {
    if (persistState) {
      localStorage.setItem('enhanced-tabs-state', JSON.stringify(tabState));
    }
  }, [tabState, persistState]);

  // Update controlled active tab
  useEffect(() => {
    if (controlledActiveTab && controlledActiveTab !== tabState.activeTab) {
      setTabState(prev => ({ ...prev, activeTab: controlledActiveTab }));
    }
  }, [controlledActiveTab, tabState.activeTab]);

  // Filter visible tabs
  const visibleTabs = useMemo(() => {
    return tabs
      .filter(tab => !tab.hidden && !tabState.hiddenTabs.has(tab.id))
      .sort((a, b) => {
        const aIndex = tabState.tabOrder.indexOf(a.id);
        const bIndex = tabState.tabOrder.indexOf(b.id);
        return aIndex - bIndex;
      });
  }, [tabs, tabState.hiddenTabs, tabState.tabOrder]);

  // Get current tab
  const currentTab = useMemo(() => {
    return tabs.find(tab => tab.id === tabState.activeTab);
  }, [tabs, tabState.activeTab]);

  // Check if tab is accessible
  const isTabAccessible = useCallback((tab: AdvancedTabConfiguration) => {
    if (tab.disabled) return false;
    if (tab.requirements) {
      // Check if all requirements are met
      return tab.requirements.every(req => {
        // This would typically check against some state or context
        // For now, we'll assume requirements are met
        return true;
      });
    }
    return true;
  }, []);

  // Handle tab change
  const handleTabChange = useCallback((newTabId: string) => {
    const newTab = tabs.find(tab => tab.id === newTabId);
    if (!newTab || !isTabAccessible(newTab)) return;

    const previousTab = tabState.activeTab;
    
    // Update tab state
    setTabState(prev => ({ ...prev, activeTab: newTabId }));
    
    // Update metrics
    setTabMetrics(prev => ({
      ...prev,
      switchCount: prev.switchCount + 1,
      lastAccessed: {
        ...prev.lastAccessed,
        [newTabId]: new Date()
      }
    }));

    // Call tab-specific handler
    newTab.onTabChange?.(newTabId);
    
    // Call global handler
    onTabChange?.(newTabId, previousTab);
  }, [tabs, tabState.activeTab, isTabAccessible, onTabChange]);

  // Handle tab close
  const handleTabClose = useCallback((tabId: string) => {
    if (!closable) return;

    setTabState(prev => ({
      ...prev,
      hiddenTabs: new Set([...prev.hiddenTabs, tabId]),
      activeTab: prev.activeTab === tabId 
        ? visibleTabs.find(tab => tab.id !== tabId)?.id || prev.activeTab
        : prev.activeTab
    }));
  }, [closable, visibleTabs]);

  // Handle tab reorder
  const handleTabReorder = useCallback((fromIndex: number, toIndex: number) => {
    if (!reorderable) return;

    setTabState(prev => {
      const newOrder = [...prev.tabOrder];
      const [moved] = newOrder.splice(fromIndex, 1);
      newOrder.splice(toIndex, 0, moved);
      return { ...prev, tabOrder: newOrder };
    });
  }, [reorderable]);

  // Scroll tabs
  const scrollTabs = useCallback((direction: 'left' | 'right') => {
    const scrollAmount = 200;
    setScrollPosition(prev => {
      const newPosition = direction === 'left' 
        ? Math.max(0, prev - scrollAmount)
        : prev + scrollAmount;
      return newPosition;
    });
  }, []);

  // Update tab progress
  const updateTabProgress = useCallback((tabId: string, progress: number) => {
    setTabState(prev => ({
      ...prev,
      tabProgress: { ...prev.tabProgress, [tabId]: progress }
    }));
  }, []);

  // Set tab error
  const setTabError = useCallback((tabId: string, error: string | null) => {
    setTabState(prev => ({
      ...prev,
      tabErrors: error 
        ? { ...prev.tabErrors, [tabId]: error }
        : Object.fromEntries(Object.entries(prev.tabErrors).filter(([id]) => id !== tabId))
    }));
  }, []);

  // Get tab status icon
  const getTabStatusIcon = useCallback((tab: AdvancedTabConfiguration) => {
    const error = tabState.tabErrors[tab.id];
    const progress = tabState.tabProgress[tab.id];
    
    if (error) {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
    
    if (tab.loading) {
      return <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />;
    }
    
    if (progress === 100) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    
    if (progress && progress > 0) {
      return <Clock className="h-4 w-4 text-yellow-500" />;
    }
    
    if (tab.disabled) {
      return <Lock className="h-4 w-4 text-gray-400" />;
    }
    
    return null;
  }, [tabState.tabErrors, tabState.tabProgress]);

  // Render tab button
  const renderTabButton = useCallback((tab: AdvancedTabConfiguration, index: number) => {
    const isActive = tab.id === tabState.activeTab;
    const isAccessible = isTabAccessible(tab);
    const statusIcon = getTabStatusIcon(tab);
    const progress = tabState.tabProgress[tab.id];
    
    const baseClasses = `
      relative flex items-center gap-2 px-4 py-2 text-sm font-medium
      transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500
    `;
    
    let variantClasses = '';
    switch (variant) {
      case 'pills':
        variantClasses = `
          rounded-full
          €{isActive 
            ? 'bg-blue-600 text-white shadow-lg' 
            : 'text-slate-600 hover:bg-slate-100'
          }
        `;
        break;
      case 'underline':
        variantClasses = `
          border-b-2 rounded-none
          €{isActive 
            ? 'border-blue-600 text-blue-600' 
            : 'border-transparent text-slate-600 hover:text-slate-900'
          }
        `;
        break;
      case 'cards':
        variantClasses = `
          rounded-t-lg border border-b-0
          €{isActive 
            ? 'bg-white border-slate-200 text-slate-900' 
            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
          }
        `;
        break;
      default:
        variantClasses = `
          rounded-lg
          €{isActive 
            ? 'bg-blue-50 text-blue-700 border border-blue-200' 
            : 'text-slate-600 hover:bg-slate-50 border border-transparent'
          }
        `;
    }
    
    const button = (
      <button
        key={tab.id}
        onClick={() => handleTabChange(tab.id)}
        disabled={!isAccessible}
        className={`€{baseClasses} €{variantClasses} €{!isAccessible ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-selected={isActive}
        role="tab"
      >
        {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
        
        <span className="truncate">{tab.label}</span>
        
        {tab.badge && (
          <Badge variant="secondary" className="ml-1 text-xs">
            {tab.badge}
          </Badge>
        )}
        
        {statusIcon && <span className="flex-shrink-0">{statusIcon}</span>}
        
        {closable && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleTabClose(tab.id);
            }}
            className="flex-shrink-0 p-1 rounded hover:bg-black/10"
          >
            <EyeOff className="h-3 w-3" />
          </button>
        )}
        
        {/* Progress indicator */}
        {progress && progress > 0 && progress < 100 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `€{progress}%` }}
            />
          </div>
        )}
      </button>
    );

    // Wrap with tooltip if tab has one
    if (tab.tooltip) {
      return (
        <TooltipProvider key={tab.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              {button}
            </TooltipTrigger>
            <TooltipContent>
              <p>{tab.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return button;
  }, [
    tabState.activeTab,
    tabState.tabProgress,
    variant,
    isTabAccessible,
    getTabStatusIcon,
    handleTabChange,
    closable,
    handleTabClose
  ]);

  // Render tab list
  const renderTabList = () => {
    const listClasses = `
      flex gap-1 p-1
      €{orientation === 'vertical' ? 'flex-col' : 'flex-row'}
      €{scrollable && orientation === 'horizontal' ? 'overflow-x-auto' : ''}
      €{tabListClassName || ''}
    `;

    return (
      <div className="relative">
        {/* Scroll buttons */}
        {scrollable && orientation === 'horizontal' && (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md"
              onClick={() => scrollTabs('left')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md"
              onClick={() => scrollTabs('right')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        <div 
          className={listClasses}
          style={scrollable && orientation === 'horizontal' ? {
            transform: `translateX(-€{scrollPosition}px)`
          } : undefined}
          role="tablist"
        >
          {visibleTabs.map((tab, index) => renderTabButton(tab, index))}
          
          {/* Tab menu button */}
          {tabs.length > visibleTabs.length && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTabMenu(!showTabMenu)}
              className="flex items-center gap-2"
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="text-xs">More</span>
            </Button>
          )}
        </div>

        {/* Hidden tabs menu */}
        {showTabMenu && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-20 min-w-48">
            {tabs
              .filter(tab => tab.hidden || tabState.hiddenTabs.has(tab.id))
              .map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setTabState(prev => ({
                      ...prev,
                      hiddenTabs: new Set([...prev.hiddenTabs].filter(id => id !== tab.id))
                    }));
                    setShowTabMenu(false);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-slate-50"
                >
                  <Eye className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
          </div>
        )}
      </div>
    );
  };

  // Render tab content
  const renderTabContent = () => {
    const contentClasses = `
      tab-content
      €{tabContentClassName || ''}
    `;

    return (
      <div className={contentClasses} role="tabpanel">
        {/* Tab-specific header actions */}
        {currentTab?.headerActions && (
          <div className="flex items-center justify-between mb-4 p-4 bg-slate-50 rounded-lg">
            <h3 className="font-medium text-slate-900">{currentTab.label}</h3>
            <div className="flex items-center gap-2">
              {currentTab.headerActions}
            </div>
          </div>
        )}

        {/* Loading state */}
        {currentTab?.loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 mx-auto mb-4 animate-spin text-blue-500" />
              <p className="text-slate-600">Loading {currentTab.label}...</p>
            </div>
          </div>
        ) : (
          currentTab?.content
        )}

        {/* Tab progress */}
        {currentTab && tabState.tabProgress[currentTab.id] && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-900">
                Progress: {tabState.tabProgress[currentTab.id]}%
              </span>
            </div>
            <Progress value={tabState.tabProgress[currentTab.id]} className="h-2" />
          </div>
        )}

        {/* Tab error */}
        {currentTab && tabState.tabErrors[currentTab.id] && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium text-red-900">Error</span>
            </div>
            <p className="text-sm text-red-700 mt-1">
              {tabState.tabErrors[currentTab.id]}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`enhanced-tabs €{className || ''}`}>
      <div className={`
        €{orientation === 'vertical' ? 'flex gap-6' : 'space-y-4'}
      `}>
        {/* Tab List */}
        <div className={orientation === 'vertical' ? 'w-64 flex-shrink-0' : ''}>
          {renderTabList()}
        </div>
        
        {/* Tab Content */}
        <div className={orientation === 'vertical' ? 'flex-1' : ''}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

// Hook for managing enhanced tabs
export const useEnhancedTabs = (tabs: AdvancedTabConfiguration[]) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '');
  const [tabProgress, setTabProgress] = useState<Record<string, number>>({});
  const [tabErrors, setTabErrors] = useState<Record<string, string>>({});

  const updateProgress = useCallback((tabId: string, progress: number) => {
    setTabProgress(prev => ({ ...prev, [tabId]: progress }));
  }, []);

  const setError = useCallback((tabId: string, error: string | null) => {
    setTabErrors(prev => 
      error 
        ? { ...prev, [tabId]: error }
        : Object.fromEntries(Object.entries(prev).filter(([id]) => id !== tabId))
    );
  }, []);

  const switchToTab = useCallback((tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    if (tab && !tab.disabled) {
      setActiveTab(tabId);
    }
  }, [tabs]);

  const isTabComplete = useCallback((tabId: string) => {
    return tabProgress[tabId] === 100;
  }, [tabProgress]);

  const hasTabError = useCallback((tabId: string) => {
    return !!tabErrors[tabId];
  }, [tabErrors]);

  return {
    activeTab,
    setActiveTab: switchToTab,
    tabProgress,
    updateProgress,
    tabErrors,
    setError,
    isTabComplete,
    hasTabError
  };
};

export default EnhancedTabs;