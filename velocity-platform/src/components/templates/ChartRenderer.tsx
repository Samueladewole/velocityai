/**
 * Enhanced Chart Renderer for Component Page Template
 * Supports all chart types with real-time updates, export, and interactivity
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Maximize2, 
  RefreshCw, 
  Settings, 
  TrendingUp,
  Activity,
  AlertCircle,
  Play,
  Pause 
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  RadarChart,
  Radar,
  ScatterChart,
  Scatter,
  TreemapChart,
  Treemap,
  ComposedChart,
  RadialBarChart,
  RadialBar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import { ChartConfig } from '@/types/componentTemplate';

interface ChartRendererProps {
  id: string;
  title?: string;
  subtitle?: string;
  config: ChartConfig;
  className?: string;
  onChartEvent?: (event: string, data: any) => void;
  realTimeData?: any[];
  loading?: boolean;
  error?: string;
}

interface ChartState {
  data: any[];
  isPlaying: boolean;
  lastUpdate: Date | null;
  animationSpeed: number;
  zoom: number;
  selectedDataPoint: any;
}

const CHART_COLORS = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', 
  '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
];

const ANIMATION_SPEEDS = {
  slow: 2000,
  normal: 1000,
  fast: 500,
  realtime: 100
};

export const ChartRenderer: React.FC<ChartRendererProps> = ({
  id,
  title,
  subtitle,
  config,
  className,
  onChartEvent,
  realTimeData,
  loading = false,
  error
}) => {
  const [chartState, setChartState] = useState<ChartState>({
    data: config.data || [],
    isPlaying: config.realTimeUpdates || false,
    lastUpdate: null,
    animationSpeed: ANIMATION_SPEEDS.normal,
    zoom: 1,
    selectedDataPoint: null
  });

  const chartRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Update data when realTimeData changes
  useEffect(() => {
    if (realTimeData && realTimeData.length > 0) {
      setChartState(prev => ({
        ...prev,
        data: realTimeData,
        lastUpdate: new Date()
      }));
    }
  }, [realTimeData]);

  // Handle real-time updates
  useEffect(() => {
    if (config.realTimeUpdates && chartState.isPlaying) {
      intervalRef.current = setInterval(() => {
        // Simulate real-time data updates for demo
        if (!realTimeData) {
          setChartState(prev => {
            const newData = [...prev.data];
            // Add some simulated variation to the last data point
            if (newData.length > 0) {
              const lastPoint = newData[newData.length - 1];
              const keys = Object.keys(lastPoint).filter(k => typeof lastPoint[k] === 'number');
              keys.forEach(key => {
                if (key !== 'timestamp' && key !== 'date') {
                  const variation = (Math.random() - 0.5) * 0.1; // 10% variation
                  lastPoint[key] = Math.max(0, lastPoint[key] * (1 + variation));
                }
              });
            }
            return {
              ...prev,
              data: newData,
              lastUpdate: new Date()
            };
          });
        }
        onChartEvent?.('dataUpdate', { chartId: id, timestamp: new Date() });
      }, chartState.animationSpeed);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [config.realTimeUpdates, chartState.isPlaying, chartState.animationSpeed, id, onChartEvent, realTimeData]);

  const handleExport = useCallback(async (format: 'png' | 'pdf' | 'csv') => {
    onChartEvent?.('export', { chartId: id, format, data: chartState.data });
    
    if (format === 'csv') {
      // Export data as CSV
      const csv = convertToCSV(chartState.data);
      downloadFile(csv, `€{title || id}-data.csv`, 'text/csv');
    } else if (format === 'png' && chartRef.current) {
      // Export chart as PNG (simplified implementation)
      try {
        const canvas = await html2canvas(chartRef.current);
        const url = canvas.toDataURL('image/png');
        downloadFile(url, `€{title || id}-chart.png`, 'image/png');
      } catch (error) {
        console.error('Export failed:', error);
      }
    }
  }, [chartState.data, id, title, onChartEvent]);

  const handleTogglePlayback = useCallback(() => {
    setChartState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
    onChartEvent?.('playbackToggle', { chartId: id, isPlaying: !chartState.isPlaying });
  }, [id, chartState.isPlaying, onChartEvent]);

  const handleRefresh = useCallback(() => {
    onChartEvent?.('refresh', { chartId: id });
  }, [id, onChartEvent]);

  const handleDataPointClick = useCallback((data: any) => {
    setChartState(prev => ({ ...prev, selectedDataPoint: data }));
    onChartEvent?.('dataPointClick', { chartId: id, data });
  }, [id, onChartEvent]);

  const renderChart = () => {
    const { data } = chartState;
    const commonProps = {
      data,
      margin: { top: 20, right: 30, left: 20, bottom: 20 }
    };

    switch (config.type) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey={config.options?.xAxis || 'name'} 
              stroke="#64748b"
              fontSize={12}
            />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            {config.options?.lines?.map((line: any, index: number) => (
              <Line
                key={line.dataKey}
                type="monotone"
                dataKey={line.dataKey}
                stroke={line.color || CHART_COLORS[index % CHART_COLORS.length]}
                strokeWidth={line.strokeWidth || 2}
                dot={line.showDots !== false}
                activeDot={{ r: 6, onClick: handleDataPointClick }}
                animationDuration={chartState.animationSpeed}
              />
            )) || (
              <Line
                type="monotone"
                dataKey="value"
                stroke={CHART_COLORS[0]}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6, onClick: handleDataPointClick }}
                animationDuration={chartState.animationSpeed}
              />
            )}
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id={`gradient-€{id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_COLORS[0]} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={CHART_COLORS[0]} stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey={config.options?.xAxis || 'name'} stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e2e8f0',
                borderRadius: '8px'
              }}
            />
            <Area 
              type="monotone" 
              dataKey={config.options?.dataKey || 'value'} 
              stroke={CHART_COLORS[0]}
              fillOpacity={1}
              fill={`url(#gradient-€{id})`}
              animationDuration={chartState.animationSpeed}
            />
          </AreaChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey={config.options?.xAxis || 'name'} stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e2e8f0',
                borderRadius: '8px'
              }}
            />
            <Bar 
              dataKey={config.options?.dataKey || 'value'} 
              fill={CHART_COLORS[0]}
              radius={[4, 4, 0, 0]}
              onClick={handleDataPointClick}
              animationDuration={chartState.animationSpeed}
            />
          </BarChart>
        );

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `€{name}: €{(percent * 100).toFixed(0)}%`}
              outerRadius={120}
              fill="#8884d8"
              dataKey={config.options?.dataKey || 'value'}
              onClick={handleDataPointClick}
              animationDuration={chartState.animationSpeed}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-€{index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        );

      case 'radar':
        return (
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis dataKey={config.options?.angleKey || 'name'} tick={{ fontSize: 12 }} />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
            <Radar
              name={config.options?.seriesName || 'Value'}
              dataKey={config.options?.dataKey || 'value'}
              stroke={CHART_COLORS[0]}
              fill={CHART_COLORS[0]}
              fillOpacity={0.3}
              animationDuration={chartState.animationSpeed}
            />
            <Tooltip />
          </RadarChart>
        );

      case 'radial':
        return (
          <RadialBarChart cx="50%" cy="50%" innerRadius="40%" outerRadius="90%" data={data}>
            <RadialBar
              dataKey={config.options?.dataKey || 'value'}
              cornerRadius={10}
              fill={CHART_COLORS[0]}
              animationDuration={chartState.animationSpeed}
            />
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <Tooltip />
          </RadialBarChart>
        );

      case 'scatter':
        return (
          <ScatterChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey={config.options?.xAxis || 'x'} stroke="#64748b" fontSize={12} />
            <YAxis dataKey={config.options?.yAxis || 'y'} stroke="#64748b" fontSize={12} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter 
              name={config.options?.seriesName || 'Data'} 
              data={data} 
              fill={CHART_COLORS[0]}
              onClick={handleDataPointClick}
            />
          </ScatterChart>
        );

      default:
        return (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 mx-auto mb-2" />
              <p>Unsupported chart type: {config.type}</p>
            </div>
          </div>
        );
    }
  };

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-500" />
            <p className="text-red-600">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`chart-renderer €{className || ''}`} ref={chartRef}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              {title || `Chart €{id}`}
              {config.realTimeUpdates && (
                <Badge variant={chartState.isPlaying ? "default" : "secondary"} className="text-xs">
                  <Activity className="h-3 w-3 mr-1" />
                  {chartState.isPlaying ? 'Live' : 'Paused'}
                </Badge>
              )}
            </CardTitle>
            {subtitle && (
              <p className="text-sm text-slate-600">{subtitle}</p>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {chartState.lastUpdate && (
              <span className="text-xs text-slate-500">
                Updated: {chartState.lastUpdate.toLocaleTimeString()}
              </span>
            )}
            
            {config.realTimeUpdates && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleTogglePlayback}
                className="h-8 w-8 p-0"
              >
                {chartState.isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            
            {config.exportable && (
              <div className="relative group">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg py-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button
                    onClick={() => handleExport('png')}
                    className="block w-full text-left px-3 py-1 text-sm hover:bg-slate-50"
                  >
                    PNG Image
                  </button>
                  <button
                    onClick={() => handleExport('csv')}
                    className="block w-full text-left px-3 py-1 text-sm hover:bg-slate-50"
                  >
                    CSV Data
                  </button>
                </div>
              </div>
            )}
            
            {config.interactive && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
              >
                <Settings className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 mx-auto mb-2 animate-spin text-blue-500" />
              <p className="text-slate-600">Loading chart data...</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={config.options?.height || 300}>
            {renderChart()}
          </ResponsiveContainer>
        )}
        
        {chartState.selectedDataPoint && (
          <div className="mt-4 p-3 bg-slate-50 rounded-lg border">
            <h4 className="text-sm font-medium text-slate-700 mb-2">Selected Data Point</h4>
            <pre className="text-xs text-slate-600 overflow-auto">
              {JSON.stringify(chartState.selectedDataPoint, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Utility functions
function convertToCSV(data: any[]): string {
  if (!data || data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => `"€{row[header] || ''}"`).join(','))
  ].join('\n');
  
  return csvContent;
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Mock html2canvas for TypeScript - in real implementation, install html2canvas package
declare global {
  function html2canvas(element: HTMLElement): Promise<HTMLCanvasElement>;
}

export default ChartRenderer;