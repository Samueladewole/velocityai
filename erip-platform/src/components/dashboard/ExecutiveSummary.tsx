import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Shield, 
  TrendingUp, 
  TrendingDown,
  Award,
  AlertTriangle,
  CheckCircle,
  Target,
  Clock,
  Sparkle
} from 'lucide-react';

interface ExecutiveSummaryProps {
  trustScore: {
    current: number;
    trend: 'up' | 'down' | 'stable';
    percentile: string;
    tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
    change: number;
  };
  keyMetrics: Array<{
    label: string;
    value: string;
    change: string;
    period: string;
    sparkline?: number[];
    color: string;
  }>;
  alerts: {
    critical: number;
    warnings: number;
    opportunities: number;
  };
}

const tierConfig = {
  Bronze: { color: 'from-amber-600 to-amber-700', bg: 'bg-amber-50', text: 'text-amber-700' },
  Silver: { color: 'from-gray-400 to-gray-500', bg: 'bg-gray-50', text: 'text-gray-700' },
  Gold: { color: 'from-yellow-400 to-yellow-600', bg: 'bg-yellow-50', text: 'text-yellow-700' },
  Platinum: { color: 'from-purple-400 to-purple-600', bg: 'bg-purple-50', text: 'text-purple-700' }
};

export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({
  trustScore,
  keyMetrics,
  alerts
}) => {
  const tierStyle = tierConfig[trustScore.tier];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8 text-white mb-8">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
      <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-xl" />
      <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-purple-500/20 blur-xl" />
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Enterprise Command Center</h1>
            <p className="text-blue-100 text-lg">Real-time trust intelligence and business impact overview</p>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-100">All systems operational</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-200" />
              <span className="text-blue-100">Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        {/* Trust Score Hero Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div className="md:col-span-1">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white" data-tour="trust-score">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${tierStyle.color}`}>
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Trust Score</h3>
                    <p className="text-blue-100 text-sm">{trustScore.tier} Tier</p>
                  </div>
                </div>
                
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-5xl font-bold">{trustScore.current}</span>
                  <div className="flex items-center gap-1">
                    {trustScore.trend === 'up' ? (
                      <TrendingUp className="h-5 w-5 text-green-400" />
                    ) : trustScore.trend === 'down' ? (
                      <TrendingDown className="h-5 w-5 text-red-400" />
                    ) : (
                      <Target className="h-5 w-5 text-blue-400" />
                    )}
                    <span className={`text-sm font-medium ${
                      trustScore.trend === 'up' ? 'text-green-400' : 
                      trustScore.trend === 'down' ? 'text-red-400' : 
                      'text-blue-400'
                    }`}>
                      {trustScore.change > 0 ? '+' : ''}{trustScore.change}
                    </span>
                  </div>
                </div>
                
                <p className="text-blue-100 text-sm mb-4">{trustScore.percentile}</p>
                
                {/* Trust Score Progress */}
                <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                  <div 
                    className={`bg-gradient-to-r ${tierStyle.color} h-2 rounded-full transition-all duration-1000`}
                    style={{ width: `${trustScore.current}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-blue-200">
                  <span>Bronze</span>
                  <span>Silver</span>
                  <span>Gold</span>
                  <span>Platinum</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Key Metrics */}
          <div className="md:col-span-2">
            <div className="grid grid-cols-2 gap-4">
              {keyMetrics.map((metric, index) => (
                <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-medium text-blue-100">{metric.label}</h4>
                      <div className={`w-2 h-2 rounded-full bg-${metric.color}-400`} />
                    </div>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-2xl font-bold">{metric.value}</span>
                      <span className="text-sm text-green-400">{metric.change}</span>
                    </div>
                    <p className="text-xs text-blue-200">{metric.period}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Alerts Summary */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <span className="text-sm font-medium">{alerts.critical} Critical</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-amber-400" />
              <span className="text-sm font-medium">{alerts.warnings} Warnings</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkle className="h-5 w-5 text-green-400" />
              <span className="text-sm font-medium">{alerts.opportunities} Quick Wins</span>
            </div>
          </div>
          <button className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors text-sm font-medium">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};