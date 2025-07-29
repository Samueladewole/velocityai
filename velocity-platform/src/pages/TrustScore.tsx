import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OnboardingFlow } from '@/components/tour/OnboardingFlow';
import { TourTrigger } from '@/components/tour/TourTrigger';
import { 
  Shield, 
  Award, 
  TrendingUp,
  TrendingDown,
  Share2,
  Download,
  ExternalLink,
  Trophy,
  Target,
  Zap,
  Clock,
  ChevronRight,
  Calendar,
  AlertCircle,
  CheckCircle,
  Sparkle,
  QrCode,
  Mail,
  Copy,
  Check,
  X
} from 'lucide-react';
import {
  RadialBarChart,
  RadialBar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

// Trust Score tier configuration
const tierConfig = {
  Bronze: { 
    range: [0, 25], 
    color: '#d97706', 
    gradient: 'from-amber-600 to-amber-700',
    next: 'Silver',
    benefits: ['Basic Trust Badge', 'Monthly Reports', 'Email Support']
  },
  Silver: { 
    range: [26, 50], 
    color: '#6b7280', 
    gradient: 'from-gray-400 to-gray-500',
    next: 'Gold',
    benefits: ['Silver Trust Badge', 'Weekly Reports', 'Priority Support', 'API Access']
  },
  Gold: { 
    range: [51, 75], 
    color: '#fbbf24', 
    gradient: 'from-yellow-400 to-yellow-600',
    next: 'Platinum',
    benefits: ['Gold Trust Badge', 'Daily Reports', 'Dedicated Support', 'Advanced Analytics', 'Custom Integrations']
  },
  Platinum: { 
    range: [76, 100], 
    color: '#7c3aed', 
    gradient: 'from-purple-400 to-purple-600',
    next: null,
    benefits: ['Platinum Trust Badge', 'Real-time Reports', 'Executive Support', 'White-label Options', 'Strategic Advisory']
  }
};

// Trust Score components breakdown
const scoreComponents = [
  { name: 'Compliance', score: 92, weight: 30, color: '#3b82f6' },
  { name: 'Security', score: 88, weight: 25, color: '#10b981' },
  { name: 'Privacy', score: 85, weight: 20, color: '#8b5cf6' },
  { name: 'Governance', score: 78, weight: 15, color: '#f59e0b' },
  { name: 'Operations', score: 82, weight: 10, color: '#ef4444' }
];

// Historical trend data
const trendData = [
  { date: 'Jan', score: 45, events: 0 },
  { date: 'Feb', score: 52, events: 2 },
  { date: 'Mar', score: 58, events: 1 },
  { date: 'Apr', score: 65, events: 3 },
  { date: 'May', score: 71, events: 2 },
  { date: 'Jun', score: 78, events: 4 }
];

// Trust Point drivers
const trustDrivers = {
  positive: [
    { activity: 'Continuous compliance monitoring', points: '+50/day', impact: 'high' },
    { activity: 'Expert validation completed', points: '+100', impact: 'medium' },
    { activity: 'Framework automation enabled', points: '2x multiplier', impact: 'high' },
    { activity: 'Zero security incidents', points: '+25/week', impact: 'medium' }
  ],
  negative: [
    { activity: 'Overdue assessments', points: '-30/day', impact: 'high' },
    { activity: 'Failed security controls', points: '-50 each', impact: 'critical' },
    { activity: 'Incomplete documentation', points: '-20/item', impact: 'medium' }
  ]
};

// Achievements
const achievements = [
  { name: 'First Assessment', icon: Trophy, unlocked: true, date: '2024-01-15' },
  { name: 'Compliance Champion', icon: Award, unlocked: true, date: '2024-03-22' },
  { name: 'Security Master', icon: Shield, unlocked: true, date: '2024-05-10' },
  { name: 'Trust Leader', icon: Target, unlocked: false, requirement: 'Reach 85 Trust Score' }
];

export const TrustScore: React.FC = () => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const currentScore = 78;
  const currentTier = Object.entries(tierConfig).find(
    ([, config]) => currentScore >= config.range[0] && currentScore <= config.range[1]
  )?.[0] || 'Bronze';
  
  const tierData = tierConfig[currentTier as keyof typeof tierConfig];
  const nextTierScore = tierData.next ? tierConfig[tierData.next as keyof typeof tierConfig].range[0] : 100;
  const progressToNext = ((currentScore - tierData.range[0]) / (nextTierScore - tierData.range[0])) * 100;

  // Radial chart data
  const radialData = [
    {
      name: 'Trust Score',
      value: currentScore,
      fill: tierData.color
    }
  ];

  const shareUrl = `https://trust.erip.io/company/acme-corp`;
  
  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50">
      <OnboardingFlow page="trust-score" />
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Trust Score Command Center</h1>
            <p className="text-slate-600 mt-1">Monitor, analyze, and share your digital trust credentials</p>
          </div>
          <div className="flex items-center gap-3">
            <TourTrigger tourType="trust-score" variant="link" />
            <Button
              onClick={() => setShowShareModal(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              data-tour="share-trust"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share Trust Score
            </Button>
          </div>
        </div>

        {/* Main Trust Score Display */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Radial Score Chart */}
          <Card className="lg:col-span-2 border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Your Trust Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                {/* Radial Chart */}
                <div className="relative" data-tour="trust-radial">
                  <ResponsiveContainer width="100%" height={300}>
                    <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={radialData}>
                      <PolarGrid stroke="none" />
                      <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                      <PolarRadiusAxis angleAxisId={0} tick={false} />
                      <RadialBar
                        minAngle={15}
                        background
                        clockWise
                        dataKey="value"
                        cornerRadius={10}
                        fill={tierData.color}
                      />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-bold text-slate-900">{currentScore}</span>
                    <span className={`text-lg font-semibold bg-gradient-to-r ${tierData.gradient} bg-clip-text text-transparent`}>
                      {currentTier} Tier
                    </span>
                  </div>
                </div>

                {/* Score Details */}
                <div className="space-y-6" data-tour="score-breakdown">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">Score Breakdown</h3>
                    <div className="space-y-3">
                      {scoreComponents.map((component) => (
                        <div key={component.name} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-slate-700">{component.name}</span>
                            <span className="font-bold text-slate-900">{component.score}%</span>
                          </div>
                          <div className="relative">
                            <div className="w-full bg-slate-100 rounded-full h-2">
                              <div 
                                className="h-2 rounded-full transition-all duration-1000"
                                style={{ 
                                  width: `${component.score}%`,
                                  backgroundColor: component.color
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Progress to Next Tier */}
                  {tierData.next && (
                    <div className="p-4 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700">Progress to {tierData.next}</span>
                        <span className="text-sm font-bold text-slate-900">{nextTierScore - currentScore} points</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-3 mb-2">
                        <div 
                          className={`h-3 rounded-full bg-gradient-to-r ${tierConfig[tierData.next as keyof typeof tierConfig].gradient} transition-all duration-1000`}
                          style={{ width: `${progressToNext}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-600">Unlock: {tierConfig[tierData.next as keyof typeof tierConfig].benefits[tierConfig[tierData.next as keyof typeof tierConfig].benefits.length - 1]}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tier Benefits */}
          <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className={`h-5 w-5 text-${tierData.color}`} />
                {currentTier} Tier Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tierData.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm text-slate-700">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200">
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Achievements</h4>
                <div className="grid grid-cols-2 gap-3">
                  {achievements.map((achievement) => (
                    <div 
                      key={achievement.name}
                      className={`p-3 rounded-lg border ${
                        achievement.unlocked 
                          ? 'bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200' 
                          : 'bg-slate-50/50 border-slate-100'
                      }`}
                    >
                      <achievement.icon className={`h-5 w-5 mb-1 ${
                        achievement.unlocked ? 'text-amber-600' : 'text-slate-400'
                      }`} />
                      <p className={`text-xs font-medium ${
                        achievement.unlocked ? 'text-slate-700' : 'text-slate-400'
                      }`}>
                        {achievement.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trust Score Trend */}
        <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Trust Score Trend
              </CardTitle>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-600" />
                  <span className="text-slate-600">Trust Score</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-600" />
                  <span className="text-slate-600">Positive Events</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 5 }}
                  activeDot={{ r: 7 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="events" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: '#10b981', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Trust Drivers */}
        <div className="grid gap-6 lg:grid-cols-2" data-tour="trust-drivers">
          {/* Positive Drivers */}
          <Card className="border-0 bg-gradient-to-br from-white to-green-50/30 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Sparkle className="h-5 w-5" />
                Trust Point Drivers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {trustDrivers.positive.map((driver, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-green-50/50 border border-green-100">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-700">{driver.activity}</p>
                      <p className="text-xs text-slate-500 mt-1">Impact: {driver.impact}</p>
                    </div>
                    <span className="text-sm font-bold text-green-700">{driver.points}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Negative Drivers */}
          <Card className="border-0 bg-gradient-to-br from-white to-red-50/30 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-800">
                <AlertCircle className="h-5 w-5" />
                Risk Factors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {trustDrivers.negative.map((driver, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-red-50/50 border border-red-100">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-700">{driver.activity}</p>
                      <p className="text-xs text-slate-500 mt-1">Impact: {driver.impact}</p>
                    </div>
                    <span className="text-sm font-bold text-red-700">{driver.points}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Share Your Trust Score
                  <button 
                    onClick={() => setShowShareModal(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Public URL */}
                  <div>
                    <label className="text-sm font-medium text-slate-700">Public Trust Profile URL</label>
                    <div className="flex gap-2 mt-1">
                      <input 
                        type="text" 
                        value={shareUrl}
                        readOnly
                        className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopy}
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="flex justify-center p-6 bg-slate-50 rounded-lg">
                    <div className="w-32 h-32 bg-slate-200 rounded-lg flex items-center justify-center">
                      <QrCode className="h-16 w-16 text-slate-400" />
                    </div>
                  </div>

                  {/* Share Options */}
                  <div className="grid grid-cols-3 gap-3">
                    <Button variant="outline" className="flex flex-col items-center gap-1 h-auto py-3">
                      <Mail className="h-5 w-5" />
                      <span className="text-xs">Email</span>
                    </Button>
                    <Button variant="outline" className="flex flex-col items-center gap-1 h-auto py-3">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                      </svg>
                      <span className="text-xs">LinkedIn</span>
                    </Button>
                    <Button variant="outline" className="flex flex-col items-center gap-1 h-auto py-3">
                      <Download className="h-5 w-5" />
                      <span className="text-xs">Download</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};