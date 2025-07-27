# Enhanced ComponentPageTemplate Migration Guide

## Overview

The Enhanced ComponentPageTemplate provides sophisticated ERIP platform features while maintaining 100% backward compatibility with existing implementations. This guide shows how to migrate from the basic template to unlock advanced capabilities.

## Backward Compatibility

**✅ Zero Breaking Changes**: All existing `ComponentPageTemplate` usage continues to work without any modifications.

```typescript
// This continues to work exactly as before
import { ComponentPageTemplate } from '@/components/templates/ComponentPageTemplate';

const MyPage = () => (
  <ComponentPageTemplate
    title="My Page"
    quickStats={stats}
    tabs={tabs}
  />
);
```

## Migration Path

### Step 1: Basic Enhancement (Optional)

Start using the enhanced template with minimal changes:

```typescript
// Before
import { ComponentPageTemplate } from '@/components/templates/ComponentPageTemplate';

// After - Enhanced template with same props
import { EnhancedComponentPageTemplate } from '@/components/templates/ComponentPageTemplate';

const MyPage = () => (
  <EnhancedComponentPageTemplate
    title="My Page"
    quickStats={stats}
    tabs={tabs}
    // Everything works exactly the same
  />
);
```

### Step 2: Add Real-time Features

Enable live data updates:

```typescript
<EnhancedComponentPageTemplate
  title="Dashboard"
  quickStats={stats}
  tabs={tabs}
  
  // Add real-time capabilities
  realTime={{
    enabled: true,
    websocketUrl: 'wss://api.erip.io/ws/dashboard',
    refreshInterval: 30000,
    connectionIndicator: true,
    onDataUpdate: (data, source) => {
      // Handle real-time data updates
      console.log('New data from:', source, data);
    }
  }}
/>
```

### Step 3: Add Advanced Charts

Integrate sophisticated data visualizations:

```typescript
const charts = {
  trustTrend: {
    type: 'line' as const,
    data: trendData,
    realTimeUpdates: true,
    exportable: true,
    interactive: true,
    options: {
      title: 'Trust Score Trend',
      height: 350,
      lines: [
        { dataKey: 'score', color: '#3b82f6', strokeWidth: 3 },
        { dataKey: 'target', color: '#10b981', strokeWidth: 2 }
      ]
    }
  }
};

<EnhancedComponentPageTemplate
  title="Analytics Dashboard"
  quickStats={stats}
  tabs={tabs}
  charts={charts}
/>
```

### Step 4: Add Export & Sharing

Enable data export and social sharing:

```typescript
<EnhancedComponentPageTemplate
  title="Trust Score"
  quickStats={stats}
  tabs={tabs}
  
  export={{
    enabled: true,
    formats: ['pdf', 'csv', 'excel'],
    filename: 'trust-score-report',
    watermark: 'ERIP Platform - Confidential'
  }}
  
  sharing={{
    enabled: true,
    publicUrl: 'https://trust.erip.io/profile/company',
    qrCode: true,
    socialMedia: ['linkedin', 'email'],
    accessControls: {
      requireAuth: true,
      expiration: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  }}
/>
```

### Step 5: Add Interactive Elements

Implement modals, drawers, and advanced interactions:

```typescript
const modals = {
  details: {
    id: 'details',
    title: 'Detailed Analysis',
    content: <DetailedAnalysisComponent />,
    size: 'lg' as const
  }
};

const drawers = {
  settings: {
    id: 'settings',
    title: 'Configuration',
    content: <SettingsPanel />,
    position: 'right' as const,
    size: 320
  }
};

<EnhancedComponentPageTemplate
  title="Interactive Dashboard"
  quickStats={stats}
  tabs={tabs}
  modals={modals}
  drawers={drawers}
/>
```

## Enhanced Stat Cards

Upgrade your stat cards with new capabilities:

```typescript
// Before
const basicStats = [
  {
    label: 'Trust Score',
    value: 92,
    icon: <Shield className="h-6 w-6" />
  }
];

// After - Enhanced with interactions and animations
const enhancedStats = [
  {
    label: 'Trust Score',
    value: 92,
    change: '+5%',
    trend: 'up' as const,
    icon: <Shield className="h-6 w-6 text-blue-600" />,
    description: 'Overall platform trust rating',
    animated: true,
    loading: false,
    badge: 'Gold Tier',
    tooltip: 'Click for detailed breakdown',
    onClick: () => openTrustScoreModal()
  }
];
```

## Enhanced Tab System

Upgrade to advanced tab features:

```typescript
// Before
const basicTabs = [
  {
    id: 'overview',
    label: 'Overview',
    content: <OverviewContent />
  }
];

// After - Enhanced with progress, requirements, and actions
const enhancedTabs = [
  {
    id: 'overview',
    label: 'Overview',
    icon: <BarChart3 className="h-4 w-4" />,
    content: <OverviewContent />,
    progressValue: 85,
    badge: 'New',
    tooltip: 'Platform overview and key metrics',
    requirements: ['view_overview'],
    headerActions: (
      <Button variant="outline" size="sm">
        <RefreshCw className="h-4 w-4 mr-2" />
        Refresh
      </Button>
    ),
    onTabChange: (tabId) => trackTabView(tabId)
  }
];
```

## Hooks Integration

Use the enhanced hooks for better state management:

```typescript
import { useComponentPageTemplate, usePageAnalytics } from '@/hooks/useComponentPageTemplate';

const MyEnhancedPage = () => {
  const {
    activeTab,
    setActiveTab,
    openModal,
    closeModal,
    exportData,
    showNotification,
    trackEvent
  } = useComponentPageTemplate();
  
  const { metrics, trackInteraction } = usePageAnalytics();
  
  const handleExport = async () => {
    try {
      await exportData('pdf', pageData);
      showNotification('success', 'Export completed successfully');
    } catch (error) {
      showNotification('error', 'Export failed');
    }
  };
  
  return (
    <EnhancedComponentPageTemplate
      title="My Enhanced Page"
      onPageLoad={() => trackEvent('page_loaded')}
      onUserInteraction={trackInteraction}
      // ... other props
    />
  );
};
```

## TypeScript Support

The enhanced template provides comprehensive type safety:

```typescript
import { 
  EnhancedComponentPageTemplateProps,
  AdvancedTabConfiguration,
  ChartConfig,
  ModalConfig,
  StatCard
} from '@/types/componentTemplate';

// Full type safety for all configurations
const pageConfig: EnhancedComponentPageTemplateProps = {
  title: 'Typed Page',
  quickStats: typedStats,
  tabs: typedTabs,
  charts: typedCharts,
  realTime: {
    enabled: true,
    websocketUrl: 'wss://api.example.com',
    onDataUpdate: (data: any, source: 'websocket' | 'poll' | 'manual') => {
      // Fully typed event handlers
    }
  }
};
```

## Performance Considerations

### Lazy Loading

Enable lazy loading for better performance:

```typescript
<EnhancedComponentPageTemplate
  title="Performance Optimized"
  quickStats={stats}
  tabs={tabs}
  
  // Performance optimizations
  lazyLoading={true}
  virtualizeTabContent={true}
  optimizeReRenders={true}
/>
```

### Real-time Data Management

Optimize real-time updates:

```typescript
const realTimeConfig = {
  enabled: true,
  refreshInterval: 30000, // 30 seconds
  messageQueue: true, // Queue messages when disconnected
  dataTransform: (data: any) => {
    // Transform data before rendering
    return processDataForUI(data);
  }
};
```

## Accessibility Features

Enable enhanced accessibility:

```typescript
<EnhancedComponentPageTemplate
  title="Accessible Page"
  quickStats={stats}
  tabs={tabs}
  
  a11y={{
    announceChanges: true,
    skipToContent: true,
    highContrast: false,
    screenReaderOptimized: true
  }}
/>
```

## Analytics Integration

Track user interactions and page performance:

```typescript
<EnhancedComponentPageTemplate
  title="Analytics Enabled"
  quickStats={stats}
  tabs={tabs}
  
  analytics={{
    trackPageViews: true,
    trackInteractions: true,
    trackTimeOnPage: true,
    onEvent: (event, data) => {
      // Send to your analytics service
      analytics.track(event, data);
    }
  }}
/>
```

## Common Migration Patterns

### Dashboard Enhancement

```typescript
// Before: Basic dashboard
<ComponentPageTemplate
  title="Dashboard"
  quickStats={stats}
  tabs={tabs}
/>

// After: Real-time dashboard with exports
<EnhancedComponentPageTemplate
  title="Live Dashboard"
  quickStats={enhancedStats}
  tabs={enhancedTabs}
  realTime={{ enabled: true }}
  export={{ enabled: true, formats: ['pdf', 'csv'] }}
  charts={chartConfigs}
/>
```

### Report Page Enhancement

```typescript
// Before: Static report
<ComponentPageTemplate
  title="Monthly Report"
  quickStats={stats}
  children={<ReportContent />}
/>

// After: Interactive report with sharing
<EnhancedComponentPageTemplate
  title="Interactive Report"
  quickStats={enhancedStats}
  export={{ enabled: true, formats: ['pdf', 'excel'] }}
  sharing={{ enabled: true, socialMedia: ['linkedin', 'email'] }}
  children={<InteractiveReportContent />}
/>
```

### Analysis Page Enhancement

```typescript
// Before: Basic analysis
<ComponentPageTemplate
  title="Risk Analysis"
  quickStats={stats}
  tabs={analysisTabs}
/>

// After: Real-time analysis with Monte Carlo
<EnhancedComponentPageTemplate
  title="Live Risk Analysis"
  quickStats={enhancedStats}
  tabs={enhancedAnalysisTabs}
  charts={monteCarloCharts}
  realTime={{ enabled: true }}
  modals={analysisModals}
/>
```

## Best Practices

### 1. Gradual Migration
- Start with the enhanced template using existing props
- Add one feature at a time
- Test thoroughly at each step

### 2. Performance Optimization
- Use lazy loading for complex tab content
- Implement data virtualization for large datasets
- Optimize real-time update frequency

### 3. User Experience
- Provide loading states for async operations
- Use progress indicators for long-running tasks
- Implement proper error handling and user feedback

### 4. Accessibility
- Test with screen readers
- Ensure keyboard navigation works
- Provide meaningful alt text and descriptions

### 5. Analytics
- Track key user interactions
- Monitor page performance
- Use data to drive feature improvements

## Troubleshooting

### Common Issues

1. **Type Errors**: Ensure you're using the correct types from `/types/componentTemplate`
2. **Real-time Connection Issues**: Check WebSocket URL and authentication
3. **Export Failures**: Verify data format and browser compatibility
4. **Performance Issues**: Enable lazy loading and optimize re-renders

### Getting Help

- Check the examples in `/examples/EnhancedTemplateExamples.tsx`
- Review type definitions in `/types/componentTemplate.ts`
- Test with the provided hook utilities

## Conclusion

The Enhanced ComponentPageTemplate provides a smooth migration path from basic to sophisticated functionality. Start with your existing implementation, then gradually add features as needed. The backward compatibility ensures your current pages continue working while you unlock powerful new capabilities for future development.