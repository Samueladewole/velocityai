/**
 * Enhanced Component Page Template Usage Examples
 * Demonstrates how to use advanced features for complex ERIP platform pages
 */
import React, { useState } from 'react';
import { 
  EnhancedComponentPageTemplate,
  ComponentPageTemplate // Legacy compatibility
} from '@/components/templates/ComponentPageTemplate';
import { 
  EnhancedComponentPageTemplateProps,
  AdvancedTabConfiguration,
  ChartConfig,
  StatCard
} from '@/types/componentTemplate';
import { 
  Activity, 
  BarChart3, 
  Shield, 
  Users, 
  Target,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Clock,
  Download,
  Share2,
  Settings,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Example 1: Advanced Dashboard with Real-time Data
export const AdvancedDashboardExample: React.FC = () => {
  const [realTimeEnabled, setRealTimeEnabled] = useState(true);

  const quickStats: StatCard[] = [
    {
      label: 'Trust Score',
      value: 92,
      change: '+5%',
      trend: 'up',
      icon: <Shield className="h-6 w-6 text-blue-600" />,
      description: 'Overall platform trust rating',
      animated: true,
      onClick: () => console.log('Trust Score clicked')
    },
    {
      label: 'Active Users',
      value: '2,847',
      change: '+12%',
      trend: 'up',
      icon: <Users className="h-6 w-6 text-green-600" />,
      description: 'Users active in last 24h',
      loading: false
    },
    {
      label: 'Risk Events',
      value: 23,
      change: '-8%',
      trend: 'down',
      icon: <AlertTriangle className="h-6 w-6 text-yellow-600" />,
      description: 'Events requiring attention',
      badge: 'Critical: 2'
    },
    {
      label: 'Compliance Rate',
      value: 98.5,
      change: '+1.2%',
      trend: 'up',
      icon: <CheckCircle className="h-6 w-6 text-green-600" />,
      description: 'Framework compliance percentage'
    }
  ];

  const charts: Record<string, ChartConfig> = {
    trustTrend: {
      type: 'line',
      data: [
        { date: 'Jan', score: 85, target: 90 },
        { date: 'Feb', score: 87, target: 90 },
        { date: 'Mar', score: 89, target: 90 },
        { date: 'Apr', score: 91, target: 90 },
        { date: 'May', score: 92, target: 90 }
      ],
      realTimeUpdates: realTimeEnabled,
      exportable: true,
      interactive: true,
      options: {
        title: 'Trust Score Trend',
        height: 350,
        lines: [
          { dataKey: 'score', color: '#3b82f6', strokeWidth: 3 },
          { dataKey: 'target', color: '#10b981', strokeWidth: 2, strokeDasharray: '5 5' }
        ]
      }
    },
    riskDistribution: {
      type: 'pie',
      data: [
        { name: 'Low Risk', value: 45, color: '#10b981' },
        { name: 'Medium Risk', value: 30, color: '#f59e0b' },
        { name: 'High Risk', value: 20, color: '#ef4444' },
        { name: 'Critical Risk', value: 5, color: '#991b1b' }
      ],
      exportable: true,
      options: {
        title: 'Risk Distribution'
      }
    }
  };

  const tabs: AdvancedTabConfiguration[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <BarChart3 className="h-4 w-4" />,
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Executive Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Platform health is strong with a trust score of 92%. Recent improvements in compliance monitoring have driven a 5% increase this month.</p>
            </CardContent>
          </Card>
        </div>
      ),
      progressValue: 100,
      headerActions: (
        <Button variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      )
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <Activity className="h-4 w-4" />,
      content: (
        <div className="space-y-6">
          <p>Advanced analytics and insights will be displayed here.</p>
        </div>
      ),
      progressValue: 75,
      requirements: ['analytics_access'],
      tooltip: 'Advanced analytics dashboard'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="h-4 w-4" />,
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Real-time Updates</span>
                  <Button
                    variant={realTimeEnabled ? "default" : "outline"}
                    size="sm"
                    onClick={() => setRealTimeEnabled(!realTimeEnabled)}
                  >
                    {realTimeEnabled ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ),
      disabled: false
    }
  ];

  const dashboardProps: EnhancedComponentPageTemplateProps = {
    title: 'ERIP Platform Dashboard',
    subtitle: 'Real-time intelligence and risk management',
    description: 'Monitor your organization\'s trust score, compliance status, and risk posture in real-time.',
    trustScore: 92,
    trustPoints: 15847,
    quickStats,
    tabs,
    
    // Enhanced features
    realTime: {
      enabled: realTimeEnabled,
      websocketUrl: 'wss://api.erip.io/ws/dashboard',
      refreshInterval: 30000,
      connectionIndicator: true,
      onConnectionChange: (status) => console.log('Connection status:', status),
      onDataUpdate: (data, source) => console.log('Data update from:', source, data)
    },
    
    charts,
    
    export: {
      enabled: true,
      formats: ['pdf', 'csv', 'excel'],
      filename: 'erip-dashboard-report',
      watermark: 'ERIP Platform - Confidential'
    },
    
    sharing: {
      enabled: true,
      publicUrl: 'https://dashboard.erip.io/shared/acme-corp',
      qrCode: true,
      socialMedia: ['linkedin', 'email'],
      accessControls: {
        requireAuth: true,
        expiration: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        permissions: ['view_dashboard']
      }
    },
    
    layout: {
      variant: 'wide',
      headerSticky: true
    },
    
    analytics: {
      trackPageViews: true,
      trackInteractions: true,
      onEvent: (event, data) => console.log('Analytics event:', event, data)
    },
    
    onPageLoad: () => console.log('Dashboard loaded'),
    onUserInteraction: (interaction, data) => console.log('User interaction:', interaction, data)
  };

  return <EnhancedComponentPageTemplate {...dashboardProps} />;
};

// Example 2: Trust Score Page with Advanced Sharing
export const TrustScorePageExample: React.FC = () => {
  const quickStats: StatCard[] = [
    {
      label: 'Current Score',
      value: 78,
      trend: 'up',
      change: '+3 points',
      icon: <Target className="h-6 w-6 text-purple-600" />,
      color: 'text-purple-600'
    },
    {
      label: 'Tier Ranking',
      value: 'Gold',
      icon: <Shield className="h-6 w-6 text-yellow-600" />,
      badge: 'Top 15%'
    }
  ];

  const tabs: AdvancedTabConfiguration[] = [
    {
      id: 'score',
      label: 'Trust Score',
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Trust Score Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Your organization has achieved a Gold tier trust score of 78/100.</p>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: 'breakdown',
      label: 'Score Breakdown',
      content: (
        <div>
          <p>Detailed breakdown of trust score components.</p>
        </div>
      )
    }
  ];

  return (
    <EnhancedComponentPageTemplate
      title="Trust Score Command Center"
      subtitle="Monitor and share your digital trust credentials"
      trustScore={78}
      trustPoints={12450}
      quickStats={quickStats}
      tabs={tabs}
      
      export={{
        enabled: true,
        formats: ['pdf', 'png'],
        filename: 'trust-score-report'
      }}
      
      sharing={{
        enabled: true,
        publicUrl: 'https://trust.erip.io/profile/acme-corp',
        qrCode: true,
        socialMedia: ['linkedin', 'twitter', 'email'],
        onShare: (platform, url) => console.log(`Shared on €{platform}: €{url}`)
      }}
      
      headerActions={
        <Button variant="outline">
          <Share2 className="h-4 w-4 mr-2" />
          Share Profile
        </Button>
      }
    />
  );
};

// Example 3: PRISM Analysis Page with Monte Carlo Simulation
export const PrismAnalysisExample: React.FC = () => {
  const [simulationRunning, setSimulationRunning] = useState(false);

  const quickStats: StatCard[] = [
    {
      label: 'Expected Loss',
      value: '€2.3M',
      icon: <TrendingUp className="h-6 w-6 text-blue-600" />,
      loading: simulationRunning
    },
    {
      label: 'VaR 95%',
      value: '€4.7M',
      icon: <AlertTriangle className="h-6 w-6 text-orange-600" />,
      loading: simulationRunning
    },
    {
      label: 'Scenarios',
      value: 15,
      icon: <BarChart3 className="h-6 w-6 text-green-600" />
    },
    {
      label: 'Confidence',
      value: '95%',
      icon: <CheckCircle className="h-6 w-6 text-green-600" />
    }
  ];

  const charts: Record<string, ChartConfig> = {
    lossDistribution: {
      type: 'area',
      data: [
        { loss: 0, density: 0.1 },
        { loss: 1000000, density: 0.4 },
        { loss: 2000000, density: 0.6 },
        { loss: 3000000, density: 0.4 },
        { loss: 4000000, density: 0.2 },
        { loss: 5000000, density: 0.1 }
      ],
      realTimeUpdates: simulationRunning,
      exportable: true,
      options: {
        title: 'Loss Distribution',
        height: 400
      }
    }
  };

  const tabs: AdvancedTabConfiguration[] = [
    {
      id: 'simulation',
      label: 'Monte Carlo',
      icon: <Activity className="h-4 w-4" />,
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Simulation Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => setSimulationRunning(!simulationRunning)}
                className={simulationRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}
              >
                {simulationRunning ? 'Stop Simulation' : 'Start Simulation'}
              </Button>
            </CardContent>
          </Card>
        </div>
      ),
      loading: simulationRunning,
      progressValue: simulationRunning ? 45 : 0
    },
    {
      id: 'scenarios',
      label: 'Risk Scenarios',
      content: <div>Risk scenario configuration and management.</div>
    },
    {
      id: 'results',
      label: 'Results',
      content: <div>Detailed simulation results and analysis.</div>,
      disabled: !simulationRunning
    }
  ];

  return (
    <EnhancedComponentPageTemplate
      title="PRISM Risk Quantification"
      subtitle="Monte Carlo simulation and risk analysis"
      description="Quantify your organization's risk exposure using advanced statistical modeling."
      quickStats={quickStats}
      tabs={tabs}
      charts={charts}
      
      realTime={{
        enabled: simulationRunning,
        refreshInterval: 1000,
        connectionIndicator: true
      }}
      
      export={{
        enabled: true,
        formats: ['pdf', 'csv', 'json'],
        filename: 'prism-risk-analysis'
      }}
      
      modals={{
        scenarioBuilder: {
          id: 'scenarioBuilder',
          title: 'Risk Scenario Builder',
          content: <div>Advanced risk scenario configuration interface.</div>,
          size: 'xl'
        }
      }}
      
      headerActions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Results
          </Button>
        </div>
      }
    />
  );
};

// Example 4: Legacy Component Migration
export const LegacyMigrationExample: React.FC = () => {
  // This shows how existing pages can continue to work unchanged
  const legacyProps = {
    title: 'Legacy Page',
    subtitle: 'This page uses the original ComponentPageTemplate',
    quickStats: [
      {
        label: 'Status',
        value: 'Working',
        icon: <CheckCircle className="h-6 w-6 text-green-600" />
      }
    ],
    tabs: [
      {
        id: 'main',
        label: 'Main Content',
        content: <div>Legacy tab content works exactly as before.</div>
      }
    ]
  };

  // Legacy component still works with zero changes
  return <ComponentPageTemplate {...legacyProps} />;
};

// Example 5: Custom Modal and Drawer Integration
export const ModalDrawerExample: React.FC = () => {
  return (
    <EnhancedComponentPageTemplate
      title="Modal & Drawer Demo"
      subtitle="Advanced UI interaction patterns"
      quickStats={[]}
      
      modals={{
        details: {
          id: 'details',
          title: 'Detailed Information',
          content: (
            <div className="space-y-4">
              <p>This is a modal with detailed information.</p>
              <Card>
                <CardContent className="p-4">
                  <p>Modal content can include any React components.</p>
                </CardContent>
              </Card>
            </div>
          ),
          size: 'lg',
          closable: true
        },
        confirmation: {
          id: 'confirmation',
          title: 'Confirm Action',
          content: <p>Are you sure you want to proceed?</p>,
          size: 'sm',
          actions: (
            <div className="flex gap-2">
              <Button variant="outline">Cancel</Button>
              <Button>Confirm</Button>
            </div>
          )
        }
      }}
      
      drawers={{
        settings: {
          id: 'settings',
          title: 'Settings Panel',
          content: (
            <div className="space-y-4">
              <h3 className="font-semibold">Configuration Options</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" />
                  <span>Enable notifications</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" />
                  <span>Auto-refresh data</span>
                </label>
              </div>
            </div>
          ),
          position: 'right',
          size: 320
        }
      }}
      
      headerActions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Open Modal
          </Button>
          <Button variant="outline" size="sm">
            Open Drawer
          </Button>
        </div>
      }
    />
  );
};

export default {
  AdvancedDashboardExample,
  TrustScorePageExample,
  PrismAnalysisExample,
  LegacyMigrationExample,
  ModalDrawerExample
};