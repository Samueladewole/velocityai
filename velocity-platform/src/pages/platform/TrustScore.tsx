import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Shield, 
  BarChart3, 
  Target, 
  Activity, 
  CheckCircle, 
  ArrowRight, 
  AlertTriangle, 
  Clock, 
  Award,
  Eye,
  Zap,
  Server,
  Globe,
  Users,
  Lock
} from 'lucide-react';
import { PublicHeader } from '../../components/common/PublicHeader';

const TrustScore: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'calculation' | 'monitoring' | 'reporting'>('overview');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-12">
            {/* Trust Score Overview */}
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">
                  Real-Time Trust Score
                </h2>
                <p className="text-lg text-slate-600 mb-6">
                  Get a dynamic, real-time view of your organization's compliance posture with our AI-powered Trust Score that updates as your infrastructure changes.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-emerald-500 mt-1" />
                    <div>
                      <h3 className="font-semibold text-slate-900">Dynamic Scoring</h3>
                      <p className="text-slate-600 text-sm">Score updates in real-time as controls and evidence change</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <BarChart3 className="w-5 h-5 text-blue-500 mt-1" />
                    <div>
                      <h3 className="font-semibold text-slate-900">Multi-Framework Analysis</h3>
                      <p className="text-slate-600 text-sm">Comprehensive scoring across all compliance frameworks</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Target className="w-5 h-5 text-purple-500 mt-1" />
                    <div>
                      <h3 className="font-semibold text-slate-900">Predictive Insights</h3>
                      <p className="text-slate-600 text-sm">AI predicts score changes and recommends improvements</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Trust Score Metrics</h3>
                
                {/* Mock Trust Score Display */}
                <div className="text-center mb-8">
                  <div className="relative">
                    <div className="w-32 h-32 mx-auto">
                      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                        <circle cx="50" cy="50" r="40" stroke="#10b981" strokeWidth="8" fill="none" 
                                strokeDasharray="251.2" strokeDashoffset="62.8" strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-emerald-600">87.5</div>
                          <div className="text-xs text-slate-500">Trust Score</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-slate-600">+2.3 points this week</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-white rounded-lg border">
                    <div className="text-lg font-bold text-blue-600">342</div>
                    <div className="text-xs text-slate-600">Active Controls</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg border">
                    <div className="text-lg font-bold text-emerald-600">96.8%</div>
                    <div className="text-xs text-slate-600">Coverage</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg border">
                    <div className="text-lg font-bold text-purple-600">1,247</div>
                    <div className="text-xs text-slate-600">Evidence Items</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg border">
                    <div className="text-lg font-bold text-amber-600">3</div>
                    <div className="text-xs text-slate-600">Open Issues</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Framework Breakdown */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
                Framework-Specific Trust Scores
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-900">SOC 2 Type II</h3>
                    <div className="text-2xl font-bold text-emerald-600">91.2</div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Security</span>
                      <span className="font-medium text-emerald-600">94%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Availability</span>
                      <span className="font-medium text-blue-600">89%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Processing Integrity</span>
                      <span className="font-medium text-purple-600">92%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Confidentiality</span>
                      <span className="font-medium text-amber-600">90%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-900">ISO 27001</h3>
                    <div className="text-2xl font-bold text-blue-600">88.7</div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Information Security</span>
                      <span className="font-medium text-emerald-600">91%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Risk Management</span>
                      <span className="font-medium text-blue-600">87%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Asset Management</span>
                      <span className="font-medium text-purple-600">89%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Access Control</span>
                      <span className="font-medium text-amber-600">88%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-900">GDPR</h3>
                    <div className="text-2xl font-bold text-purple-600">93.4</div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Data Protection</span>
                      <span className="font-medium text-emerald-600">95%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Consent Management</span>
                      <span className="font-medium text-blue-600">92%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Data Subject Rights</span>
                      <span className="font-medium text-purple-600">94%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Privacy by Design</span>
                      <span className="font-medium text-amber-600">92%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'calculation':
        return (
          <div className="space-y-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">How Trust Score is Calculated</h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Our AI-powered Trust Score algorithm analyzes multiple factors across your compliance posture to provide an accurate, real-time assessment.
              </p>
            </div>

            {/* Calculation Components */}
            <div className="grid lg:grid-cols-4 gap-8">
              <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">
                <div className="p-3 bg-blue-100 rounded-lg w-fit mx-auto mb-4">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Control Effectiveness</h3>
                <div className="text-2xl font-bold text-blue-600 mb-2">40%</div>
                <p className="text-sm text-slate-600">Weight in overall score</p>
                <div className="mt-4 text-xs text-slate-500">
                  Based on automated control testing and evidence collection
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">
                <div className="p-3 bg-emerald-100 rounded-lg w-fit mx-auto mb-4">
                  <Activity className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Evidence Quality</h3>
                <div className="text-2xl font-bold text-emerald-600 mb-2">25%</div>
                <p className="text-sm text-slate-600">Weight in overall score</p>
                <div className="mt-4 text-xs text-slate-500">
                  Quality, completeness, and timeliness of evidence
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">
                <div className="p-3 bg-purple-100 rounded-lg w-fit mx-auto mb-4">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Coverage Depth</h3>
                <div className="text-2xl font-bold text-purple-600 mb-2">20%</div>
                <p className="text-sm text-slate-600">Weight in overall score</p>
                <div className="mt-4 text-xs text-slate-500">
                  Percentage of framework requirements covered
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">
                <div className="p-3 bg-amber-100 rounded-lg w-fit mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Trend Analysis</h3>
                <div className="text-2xl font-bold text-amber-600 mb-2">15%</div>
                <p className="text-sm text-slate-600">Weight in overall score</p>
                <div className="mt-4 text-xs text-slate-500">
                  Historical trends and improvement trajectory
                </div>
              </div>
            </div>

            {/* Detailed Calculation */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">
                AI-Powered Scoring Algorithm
              </h3>
              
              <div className="grid lg:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-4">Real-Time Factors</h4>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500 mt-1" />
                      <div>
                        <h5 className="font-semibold text-slate-900">Active Controls</h5>
                        <p className="text-sm text-slate-600">Number and effectiveness of implemented controls</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500 mt-1" />
                      <div>
                        <h5 className="font-semibold text-slate-900">Evidence Freshness</h5>
                        <p className="text-sm text-slate-600">How recent and relevant collected evidence is</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500 mt-1" />
                      <div>
                        <h5 className="font-semibold text-slate-900">Gap Analysis</h5>
                        <p className="text-sm text-slate-600">Identified gaps and remediation progress</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500 mt-1" />
                      <div>
                        <h5 className="font-semibold text-slate-900">Risk Indicators</h5>
                        <p className="text-sm text-slate-600">Emerging risks and vulnerability trends</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-6">
                  <h4 className="text-xl font-bold text-slate-900 mb-4">Score Calculation</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Control Effectiveness (40%)</span>
                      <span className="font-mono">92.5 × 0.40 = 37.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Evidence Quality (25%)</span>
                      <span className="font-mono">89.2 × 0.25 = 22.3</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Coverage Depth (20%)</span>
                      <span className="font-mono">94.1 × 0.20 = 18.8</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Trend Analysis (15%)</span>
                      <span className="font-mono">88.0 × 0.15 = 13.2</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between font-bold">
                      <span>Final Trust Score</span>
                      <span className="font-mono text-emerald-600">91.3</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Score Ranges */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <div className="text-2xl font-bold text-red-600 mb-2">0-60</div>
                <h4 className="font-bold text-slate-900 mb-2">Critical</h4>
                <p className="text-sm text-slate-600">Immediate attention required</p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
                <div className="text-2xl font-bold text-amber-600 mb-2">61-75</div>
                <h4 className="font-bold text-slate-900 mb-2">Needs Work</h4>
                <p className="text-sm text-slate-600">Significant improvements needed</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-2">76-89</div>
                <h4 className="font-bold text-slate-900 mb-2">Good</h4>
                <p className="text-sm text-slate-600">Strong compliance posture</p>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
                <div className="text-2xl font-bold text-emerald-600 mb-2">90-100</div>
                <h4 className="font-bold text-slate-900 mb-2">Excellent</h4>
                <p className="text-sm text-slate-600">Industry-leading compliance</p>
              </div>
            </div>
          </div>
        );

      case 'monitoring':
        return (
          <div className="space-y-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Continuous Trust Score Monitoring</h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Monitor your Trust Score in real-time with automated alerts, trend analysis, and predictive insights to maintain optimal compliance posture.
              </p>
            </div>

            {/* Monitoring Features */}
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="p-3 bg-blue-100 rounded-lg w-fit mb-4">
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Real-Time Updates</h3>
                <p className="text-slate-600 mb-4">
                  Your Trust Score updates automatically as controls change, evidence is collected, and infrastructure evolves.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm text-slate-700">Live score calculations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm text-slate-700">Instant change notifications</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm text-slate-700">Historical tracking</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="p-3 bg-amber-100 rounded-lg w-fit mb-4">
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Smart Alerts</h3>
                <p className="text-slate-600 mb-4">
                  Receive intelligent alerts when your Trust Score drops below thresholds or trends indicate potential issues.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm text-slate-700">Threshold-based alerts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm text-slate-700">Trend-based warnings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm text-slate-700">Multi-channel notifications</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="p-3 bg-purple-100 rounded-lg w-fit mb-4">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Predictive Analysis</h3>
                <p className="text-slate-600 mb-4">
                  AI predicts future Trust Score changes based on current trends and planned infrastructure changes.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm text-slate-700">7-day forecasting</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm text-slate-700">Impact predictions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm text-slate-700">Improvement recommendations</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Score Timeline */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">
                Trust Score Timeline & Trends
              </h3>
              
              {/* Mock Timeline Chart */}
              <div className="bg-slate-50 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-slate-900">Last 30 Days</h4>
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                      <span>Trust Score</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span>Target</span>
                    </div>
                  </div>
                </div>
                
                <div className="h-48 bg-white rounded-lg border border-slate-200 flex items-center justify-center">
                  <div className="text-center text-slate-500">
                    <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Interactive Trust Score Chart</p>
                    <p className="text-sm">Real-time data visualization</p>
                  </div>
                </div>
              </div>

              {/* Key Events */}
              <div className="grid lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-slate-900 mb-4">Recent Score Changes</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      <div className="flex-1">
                        <div className="font-medium text-slate-900">+2.3 points</div>
                        <div className="text-sm text-slate-600">New AWS CloudTrail integration</div>
                      </div>
                      <div className="text-xs text-slate-500">2 days ago</div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <Shield className="w-4 h-4 text-blue-600" />
                      <div className="flex-1">
                        <div className="font-medium text-slate-900">+1.8 points</div>
                        <div className="text-sm text-slate-600">Enhanced access controls deployed</div>
                      </div>
                      <div className="text-xs text-slate-500">5 days ago</div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <div className="flex-1">
                        <div className="font-medium text-slate-900">-0.5 points</div>
                        <div className="text-sm text-slate-600">Certificate renewal pending</div>
                      </div>
                      <div className="text-xs text-slate-500">1 week ago</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 mb-4">Upcoming Predictions</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <Target className="w-4 h-4 text-purple-600" />
                      <div className="flex-1">
                        <div className="font-medium text-slate-900">+3.2 points expected</div>
                        <div className="text-sm text-slate-600">Vulnerability remediation completion</div>
                      </div>
                      <div className="text-xs text-slate-500">In 3 days</div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <Award className="w-4 h-4 text-green-600" />
                      <div className="flex-1">
                        <div className="font-medium text-slate-900">+1.5 points expected</div>
                        <div className="text-sm text-slate-600">Security training completion</div>
                      </div>
                      <div className="text-xs text-slate-500">Next week</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'reporting':
        return (
          <div className="space-y-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Trust Score Reporting</h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Generate comprehensive Trust Score reports for stakeholders, auditors, and compliance teams with detailed insights and recommendations.
              </p>
            </div>

            {/* Report Types */}
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="p-3 bg-blue-100 rounded-lg w-fit mb-4">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Executive Summary</h3>
                <p className="text-slate-600 mb-4">
                  High-level Trust Score overview perfect for board presentations and executive briefings.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm text-slate-700">Overall Trust Score trends</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm text-slate-700">Key achievements</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm text-slate-700">Strategic recommendations</span>
                  </div>
                </div>
                <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                  Generate Report →
                </button>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="p-3 bg-emerald-100 rounded-lg w-fit mb-4">
                  <Shield className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Technical Deep Dive</h3>
                <p className="text-slate-600 mb-4">
                  Detailed technical analysis for compliance teams and technical stakeholders.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm text-slate-700">Framework-specific scores</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm text-slate-700">Control effectiveness analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm text-slate-700">Evidence quality metrics</span>
                  </div>
                </div>
                <button className="text-emerald-600 text-sm font-medium hover:text-emerald-700">
                  Generate Report →
                </button>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="p-3 bg-purple-100 rounded-lg w-fit mb-4">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Auditor Package</h3>
                <p className="text-slate-600 mb-4">
                  Comprehensive package designed specifically for external auditors and assessors.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm text-slate-700">Cryptographic evidence proofs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm text-slate-700">Independent verification links</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm text-slate-700">Methodology documentation</span>
                  </div>
                </div>
                <button className="text-purple-600 text-sm font-medium hover:text-purple-700">
                  Generate Report →
                </button>
              </div>
            </div>

            {/* Report Features */}
            <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">
                Report Features & Customization
              </h3>
              
              <div className="grid lg:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-4">
                    Advanced Customization
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500 mt-1" />
                      <div>
                        <h5 className="font-semibold text-slate-900">Custom Branding</h5>
                        <p className="text-sm text-slate-600">Add your logo, colors, and company branding to all reports</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500 mt-1" />
                      <div>
                        <h5 className="font-semibold text-slate-900">Flexible Timeframes</h5>
                        <p className="text-sm text-slate-600">Generate reports for any date range or specific time periods</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500 mt-1" />
                      <div>
                        <h5 className="font-semibold text-slate-900">Framework Filtering</h5>
                        <p className="text-sm text-slate-600">Focus reports on specific compliance frameworks or combinations</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-4">
                    Export Options
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4 border border-slate-200 text-center">
                      <div className="text-red-600 mb-2">📄</div>
                      <div className="font-medium text-slate-900">PDF Reports</div>
                      <div className="text-xs text-slate-600">Professional formatting</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-slate-200 text-center">
                      <div className="text-green-600 mb-2">📊</div>
                      <div className="font-medium text-slate-900">Excel Data</div>
                      <div className="text-xs text-slate-600">Raw data analysis</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-slate-200 text-center">
                      <div className="text-blue-600 mb-2">🔗</div>
                      <div className="font-medium text-slate-900">API Access</div>
                      <div className="text-xs text-slate-600">Programmatic integration</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-slate-200 text-center">
                      <div className="text-purple-600 mb-2">📱</div>
                      <div className="font-medium text-slate-900">Dashboard</div>
                      <div className="text-xs text-slate-600">Interactive viewing</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Automated Reporting */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">
                Automated Report Delivery
              </h3>
              
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="p-3 bg-blue-100 rounded-lg w-fit mx-auto mb-4">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2">Scheduled Reports</h4>
                  <p className="text-sm text-slate-600">Set up daily, weekly, or monthly automatic report generation and delivery</p>
                </div>
                <div className="text-center">
                  <div className="p-3 bg-emerald-100 rounded-lg w-fit mx-auto mb-4">
                    <Users className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2">Stakeholder Distribution</h4>
                  <p className="text-sm text-slate-600">Automatically distribute reports to different stakeholder groups with role-based content</p>
                </div>
                <div className="text-center">
                  <div className="p-3 bg-purple-100 rounded-lg w-fit mx-auto mb-4">
                    <AlertTriangle className="w-6 h-6 text-purple-600" />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2">Alert-Based Reports</h4>
                  <p className="text-sm text-slate-600">Trigger special reports when Trust Score changes or thresholds are reached</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <PublicHeader />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-teal-900 to-blue-900 pt-16">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-emerald-500 rounded-full mr-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <span className="text-emerald-400 font-semibold text-lg">Trust Score</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Real-Time Trust
              <span className="block text-emerald-400">Score Monitoring</span>
            </h1>
            
            <p className="text-xl text-slate-200 mb-8 max-w-3xl mx-auto">
              Get a dynamic, AI-powered view of your compliance posture with our Trust Score 
              that updates in real-time as your infrastructure and controls evolve.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() => navigate('/velocity/demo')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-colors"
              >
                <Eye className="w-5 h-5" />
                View Trust Score Demo
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => navigate('/velocity/assessment')}
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-slate-300 text-slate-200 font-semibold rounded-lg hover:border-white hover:text-white transition-colors"
              >
                <Target className="w-5 h-5" />
                Get Your Score
              </button>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400 mb-2">87.5</div>
                <div className="text-sm text-slate-300">Average Trust Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">Real-Time</div>
                <div className="text-sm text-slate-300">Score Updates</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">12+</div>
                <div className="text-sm text-slate-300">Frameworks</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-400 mb-2">96.8%</div>
                <div className="text-sm text-slate-300">Accuracy Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'calculation', label: 'How It Works', icon: BarChart3 },
            { id: 'monitoring', label: 'Monitoring', icon: Activity },
            { id: 'reporting', label: 'Reporting', icon: Target }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 €{
                  activeTab === tab.id
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {renderTabContent()}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-emerald-900/50 to-teal-900/50 rounded-2xl p-12 border border-emerald-500/20">
          <h2 className="text-3xl font-bold text-white mb-6">
            Start Monitoring Your Trust Score
          </h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Get real-time visibility into your compliance posture with AI-powered Trust Score monitoring and insights.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/velocity/demo')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-colors"
            >
              <Eye className="w-5 h-5" />
              View Demo
              <ArrowRight className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => navigate('/velocity/assessment')}
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-slate-400 text-slate-300 font-semibold rounded-lg hover:border-white hover:text-white transition-colors"
            >
              <Target className="w-5 h-5" />
              Free Assessment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustScore;