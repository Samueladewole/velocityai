import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  HelpCircle, 
  FileText, 
  Download, 
  X, 
  Info,
  TrendingUp,
  AlertTriangle,
  Target,
  BarChart3,
  Activity,
  Shield,
  DollarSign,
  Eye,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface ChartExplanation {
  id: string;
  title: string;
  purpose: string;
  howToRead: string;
  keyInsights: string[];
  relatedComponents: string[];
  actionableItems: string[];
  dataSource: string;
  updateFrequency: string;
  correlations?: {
    component: string;
    relationship: string;
    impact: string;
  }[];
}

interface ChartExplanationButtonProps {
  chartId: string;
  explanations: Record<string, ChartExplanation>;
  variant?: 'button' | 'inline';
}

export const ChartExplanationButton: React.FC<ChartExplanationButtonProps> = ({ 
  chartId, 
  explanations, 
  variant = 'button' 
}) => {
  const [showExplanation, setShowExplanation] = useState(false);
  const explanation = explanations[chartId];

  if (!explanation) return null;

  const IconComponent = getChartIcon(chartId);

  if (variant === 'inline') {
    return (
      <div className="mt-4 border-t border-slate-200 pt-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-slate-600 hover:text-blue-600"
          onClick={() => setShowExplanation(!showExplanation)}
        >
          <Info className="h-4 w-4 mr-2" />
          {showExplanation ? 'Hide' : 'Explain'} Chart
          {showExplanation ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
        </Button>
        
        {showExplanation && (
          <div className="mt-3 p-4 bg-blue-50 rounded-lg border border-blue-200 animate-in slide-in-from-top duration-200">
            <div className="flex items-start gap-3">
              <IconComponent className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">{explanation.title}</h4>
                  <p className="text-sm text-blue-800">{explanation.purpose}</p>
                </div>
                
                <div>
                  <h5 className="font-medium text-blue-900 mb-1">How to Read:</h5>
                  <p className="text-sm text-blue-700">{explanation.howToRead}</p>
                </div>
                
                {explanation.keyInsights.length > 0 && (
                  <div>
                    <h5 className="font-medium text-blue-900 mb-2">Key Insights:</h5>
                    <ul className="space-y-1">
                      {explanation.keyInsights.map((insight, index) => (
                        <li key={index} className="text-sm text-blue-700 flex items-start gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        className="text-slate-600 hover:text-blue-600"
        onClick={() => setShowExplanation(true)}
      >
        <HelpCircle className="h-4 w-4 mr-2" />
        Explain
      </Button>

      {showExplanation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4 shadow-xl">
            <CardHeader className="border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <IconComponent className="h-6 w-6 text-blue-600" />
                  <CardTitle className="text-xl">{explanation.title}</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowExplanation(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Purpose */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  Purpose
                </h3>
                <p className="text-slate-700">{explanation.purpose}</p>
              </div>

              {/* How to Read */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <Eye className="h-4 w-4 text-emerald-600" />
                  How to Read This Chart
                </h3>
                <p className="text-slate-700">{explanation.howToRead}</p>
              </div>

              {/* Key Insights */}
              {explanation.keyInsights.length > 0 && (
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-purple-600" />
                    Key Insights
                  </h3>
                  <ul className="space-y-2">
                    {explanation.keyInsights.map((insight, index) => (
                      <li key={index} className="flex items-start gap-3 text-slate-700">
                        <div className="h-2 w-2 rounded-full bg-purple-500 mt-2.5 flex-shrink-0" />
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Related Components */}
              {explanation.relatedComponents.length > 0 && (
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                    <Activity className="h-4 w-4 text-orange-600" />
                    Related ERIP Components
                  </h3>
                  <div className="flex gap-2 flex-wrap">
                    {explanation.relatedComponents.map((component, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm font-medium"
                      >
                        {component}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Component Correlations */}
              {explanation.correlations && explanation.correlations.length > 0 && (
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-indigo-600" />
                    Component Correlations
                  </h3>
                  <div className="space-y-3">
                    {explanation.correlations.map((correlation, index) => (
                      <div key={index} className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-indigo-900">{correlation.component}</span>
                        </div>
                        <p className="text-sm text-indigo-700 mb-2">{correlation.relationship}</p>
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-amber-700">{correlation.impact}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actionable Items */}
              {explanation.actionableItems.length > 0 && (
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    Recommended Actions
                  </h3>
                  <ul className="space-y-2">
                    {explanation.actionableItems.map((item, index) => (
                      <li key={index} className="flex items-start gap-3 text-slate-700">
                        <div className="h-2 w-2 rounded-full bg-red-500 mt-2.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Data Information */}
              <div className="border-t border-slate-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Data Source:</span>
                  <span className="font-medium text-slate-900">{explanation.dataSource}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Update Frequency:</span>
                  <span className="font-medium text-slate-900">{explanation.updateFrequency}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => exportChartExplanation(explanation)}
                >
                  <Download className="h-4 w-4" />
                  Export Explanation
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowExplanation(false)}
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

// Page-level explanations component
interface PageExplanationsProps {
  title: string;
  overview: string;
  charts: string[];
  explanations: Record<string, ChartExplanation>;
  componentFocus: string;
  correlations: {
    primary: string[];
    secondary: string[];
    insights: string[];
  };
}

export const PageExplanations: React.FC<PageExplanationsProps> = ({
  title,
  overview,
  charts,
  explanations,
  componentFocus,
  correlations
}) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Card className="border-0 bg-gradient-to-br from-slate-50 to-white shadow-lg">
      <CardHeader className="border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <FileText className="h-5 w-5 text-blue-600" />
              {title} - Analytics Overview
            </CardTitle>
            <p className="text-slate-600 mt-1">{overview}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
            >
              <Info className="h-4 w-4 mr-2" />
              {showDetails ? 'Hide Details' : 'View Details'}
            </Button>
            <Button
              size="sm"
              onClick={() => exportPageAnalysis({ title, overview, charts, explanations, componentFocus, correlations })}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </CardHeader>

      {showDetails && (
        <CardContent className="p-6 space-y-6 animate-in slide-in-from-top duration-300">
          {/* Component Focus */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">Primary Component Focus</h3>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-900">{componentFocus}</p>
            </div>
          </div>

          {/* Chart Correlations */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Cross-Chart Correlations</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <h4 className="font-medium text-slate-700 mb-2">Primary Relationships</h4>
                <ul className="space-y-1">
                  {correlations.primary.map((item, index) => (
                    <li key={index} className="text-sm text-slate-600 flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-slate-700 mb-2">Secondary Effects</h4>
                <ul className="space-y-1">
                  {correlations.secondary.map((item, index) => (
                    <li key={index} className="text-sm text-slate-600 flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-slate-700 mb-2">Key Insights</h4>
                <ul className="space-y-1">
                  {correlations.insights.map((item, index) => (
                    <li key={index} className="text-sm text-slate-600 flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Available Charts */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">Available Charts</h3>
            <div className="grid gap-2 md:grid-cols-2">
              {charts.map((chartId, index) => {
                const explanation = explanations[chartId];
                const IconComponent = getChartIcon(chartId);
                return explanation ? (
                  <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <IconComponent className="h-4 w-4 text-slate-600" />
                    <div>
                      <div className="font-medium text-slate-900 text-sm">{explanation.title}</div>
                      <div className="text-xs text-slate-600">{explanation.dataSource}</div>
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

// Helper functions
function getChartIcon(chartId: string) {
  const iconMap: Record<string, React.ComponentType<any>> = {
    'compliance-trend': TrendingUp,
    'risk-heatmap': BarChart3,
    'security-score': Shield,
    'financial-impact': DollarSign,
    'framework-coverage': Target,
    'activity-stream': Activity,
    'vulnerability-timeline': AlertTriangle,
    'risk-radar': Shield
  };
  return iconMap[chartId] || BarChart3;
}

function exportChartExplanation(explanation: ChartExplanation) {
  const content = `
# ${explanation.title} - Chart Analysis

## Purpose
${explanation.purpose}

## How to Read
${explanation.howToRead}

## Key Insights
${explanation.keyInsights.map(insight => `• ${insight}`).join('\n')}

## Related Components
${explanation.relatedComponents.join(', ')}

## Recommended Actions
${explanation.actionableItems.map(item => `• ${item}`).join('\n')}

## Data Information
- **Source**: ${explanation.dataSource}
- **Update Frequency**: ${explanation.updateFrequency}

---
Generated by ERIP Analytics Platform
${new Date().toLocaleDateString()}
`;

  downloadTextFile(content, `${explanation.title.replace(/\s+/g, '_')}_explanation.md`);
}

function exportPageAnalysis(data: any) {
  const content = `
# ${data.title} - Comprehensive Analytics Report

## Executive Summary
${data.overview}

## Component Focus
${data.componentFocus}

## Cross-Chart Correlations

### Primary Relationships
${data.correlations.primary.map((item: string) => `• ${item}`).join('\n')}

### Secondary Effects
${data.correlations.secondary.map((item: string) => `• ${item}`).join('\n')}

### Key Insights
${data.correlations.insights.map((item: string) => `• ${item}`).join('\n')}

## Available Charts
${data.charts.map((chartId: string) => {
  const explanation = data.explanations[chartId];
  return explanation ? `
### ${explanation.title}
- **Purpose**: ${explanation.purpose}
- **Data Source**: ${explanation.dataSource}
- **Update Frequency**: ${explanation.updateFrequency}
` : '';
}).join('\n')}

---
Generated by ERIP Analytics Platform
${new Date().toLocaleDateString()}
`;

  downloadTextFile(content, `${data.title.replace(/\s+/g, '_')}_analytics_report.md`);
}

function downloadTextFile(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}