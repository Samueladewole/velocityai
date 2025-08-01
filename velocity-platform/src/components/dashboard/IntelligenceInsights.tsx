import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Sparkle, 
  TrendingUp, 
  AlertCircle, 
  Award,
  Clock,
  DollarSign,
  Target,
  ChevronRight,
  Brain,
  LineChart,
  Users
} from 'lucide-react';

interface Recommendation {
  type: 'quick-win' | 'strategic' | 'compliance' | 'efficiency';
  title: string;
  impact: string;
  effort: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

interface Prediction {
  title: string;
  prediction: string;
  confidence: number;
  timeframe: string;
  icon: React.ReactNode;
}

interface Benchmark {
  metric: string;
  position: string;
  percentile: number;
  trend: 'up' | 'down' | 'stable';
}

const recommendations: Recommendation[] = [
  {
    type: 'quick-win',
    title: 'Complete ISO 27001 assessment',
    impact: '+200 Trust Points',
    effort: '2 hours',
    value: '€45K risk reduction',
    icon: <Award className="h-5 w-5" />,
    color: 'from-green-400 to-green-600'
  },
  {
    type: 'strategic',
    title: 'Enable DORA compliance',
    impact: 'Unlock 3 new deals',
    effort: '1 week',
    value: '€2.1M pipeline',
    icon: <Target className="h-5 w-5" />,
    color: 'from-blue-400 to-blue-600'
  },
  {
    type: 'compliance',
    title: 'Update GDPR data retention',
    impact: 'Avoid €50K fine',
    effort: '4 hours',
    value: 'Critical compliance',
    icon: <AlertCircle className="h-5 w-5" />,
    color: 'from-amber-400 to-amber-600'
  },
  {
    type: 'efficiency',
    title: 'Automate vendor assessments',
    impact: 'Save 40 hours/month',
    effort: '3 days',
    value: '€15K monthly savings',
    icon: <Clock className="h-5 w-5" />,
    color: 'from-purple-400 to-purple-600'
  }
];

const predictions: Prediction[] = [
  {
    title: 'Trust Score Trajectory',
    prediction: 'Platinum tier in 45 days',
    confidence: 87,
    timeframe: 'Next 6 weeks',
    icon: <TrendingUp className="h-5 w-5" />
  },
  {
    title: 'Compliance Risk',
    prediction: 'SOC2 renewal attention needed',
    confidence: 92,
    timeframe: 'Next 30 days',
    icon: <AlertCircle className="h-5 w-5" />
  },
  {
    title: 'Sales Impact',
    prediction: '2 deals at risk without action',
    confidence: 78,
    timeframe: 'Next 2 weeks',
    icon: <DollarSign className="h-5 w-5" />
  }
];

const benchmarks: Benchmark[] = [
  {
    metric: 'Industry Position',
    position: 'Top 10% in FinTech',
    percentile: 91,
    trend: 'up'
  },
  {
    metric: 'Company Size',
    position: 'Leading mid-market',
    percentile: 85,
    trend: 'stable'
  },
  {
    metric: 'Improvement Rate',
    position: '3x faster than average',
    percentile: 95,
    trend: 'up'
  }
];

const typeConfig = {
  'quick-win': { bg: 'bg-green-50', text: 'text-green-700', label: 'Quick Win' },
  'strategic': { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Strategic' },
  'compliance': { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Compliance' },
  'efficiency': { bg: 'bg-purple-50', text: 'text-purple-700', label: 'Efficiency' }
};

export const IntelligenceInsights: React.FC = () => {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* AI Recommendations */}
      <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg lg:col-span-2">
        <CardHeader className="border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-400 to-indigo-600">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-slate-900">AI-Powered Recommendations</CardTitle>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div 
                key={index}
                className="group p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg bg-gradient-to-r €{rec.color} text-white flex-shrink-0`}>
                    {rec.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-1">{rec.title}</h4>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-slate-600">Impact: <span className="font-semibold text-slate-900">{rec.impact}</span></span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-600">Effort: <span className="font-semibold text-slate-900">{rec.effort}</span></span>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium €{typeConfig[rec.type].bg} €{typeConfig[rec.type].text}`}>
                        {typeConfig[rec.type].label}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-slate-600">{rec.value}</p>
                      <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Predictions & Benchmarks */}
      <div className="space-y-6">
        {/* Predictions */}
        <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
          <CardHeader className="border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-purple-400 to-purple-600">
                <LineChart className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-slate-900 text-lg">Predictive Analytics</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {predictions.map((pred, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="text-slate-600">{pred.icon}</div>
                      <h5 className="font-medium text-slate-900 text-sm">{pred.title}</h5>
                    </div>
                    <span className="text-xs text-slate-500">{pred.confidence}% confidence</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-800">{pred.prediction}</p>
                  <p className="text-xs text-slate-500">{pred.timeframe}</p>
                  <div className="w-full bg-slate-100 rounded-full h-1">
                    <div 
                      className="bg-gradient-to-r from-purple-400 to-purple-600 h-1 rounded-full"
                      style={{ width: `€{pred.confidence}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Benchmarks */}
        <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
          <CardHeader className="border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-teal-400 to-teal-600">
                <Users className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-slate-900 text-lg">Industry Benchmarks</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {benchmarks.map((bench, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">{bench.metric}</span>
                    <div className="flex items-center gap-1">
                      {bench.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-600" />}
                      {bench.trend === 'down' && <TrendingUp className="h-3 w-3 text-red-600 rotate-180" />}
                      {bench.trend === 'stable' && <div className="h-3 w-3 bg-slate-400 rounded-full" />}
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{bench.position}</p>
                  <div className="relative">
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-teal-400 to-teal-600 h-2 rounded-full"
                        style={{ width: `€{bench.percentile}%` }}
                      />
                    </div>
                    <div className="absolute right-0 top-0 h-2 w-px bg-slate-300" />
                  </div>
                  <span className="text-xs text-slate-500">Top {100 - bench.percentile}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};