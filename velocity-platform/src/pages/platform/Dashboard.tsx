import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Shield, 
  Users, 
  Database, 
  Activity, 
  CheckCircle, 
  ArrowRight, 
  Target, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  Eye,
  Zap,
  Server,
  Globe,
  Settings
} from 'lucide-react';
import { PublicHeader } from '../../components/common/PublicHeader';
import BackToTopButton from '@/components/ui/BackToTopButton';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <PublicHeader />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 pt-16">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-blue-500 rounded-full mr-4">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <span className="text-blue-400 font-semibold text-lg">Velocity Dashboard</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Unified Compliance
              <span className="block text-blue-400">Command Center</span>
            </h1>
            
            <p className="text-xl text-slate-200 mb-8 max-w-3xl mx-auto">
              Get a complete view of your compliance posture across all frameworks, 
              with real-time monitoring, automated evidence collection, and AI-powered insights.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() => navigate('/velocity/demo')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Eye className="w-5 h-5" />
                View Live Demo
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => navigate('/velocity/assessment')}
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-slate-300 text-slate-200 font-semibold rounded-lg hover:border-white hover:text-white transition-colors"
              >
                <Target className="w-5 h-5" />
                Start Assessment
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">
            Everything You Need in One Dashboard
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Monitor, manage, and maintain compliance across all your frameworks with AI-powered automation and real-time insights.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-xl transition-shadow">
            <div className="p-3 bg-blue-100 rounded-lg w-fit mb-6">
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Real-Time Trust Score</h3>
            <p className="text-slate-600 mb-6">
              Monitor your compliance posture with a dynamic trust score that updates in real-time as your infrastructure changes.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span className="text-sm text-slate-700">Live compliance scoring</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span className="text-sm text-slate-700">Framework-specific breakdowns</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span className="text-sm text-slate-700">Historical trend analysis</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-xl transition-shadow">
            <div className="p-3 bg-emerald-100 rounded-lg w-fit mb-6">
              <Shield className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">12 AI Agents</h3>
            <p className="text-slate-600 mb-6">
              Specialized AI agents working 24/7 to collect evidence, monitor controls, and maintain compliance across all frameworks.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span className="text-sm text-slate-700">Automated evidence collection</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span className="text-sm text-slate-700">Continuous monitoring</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span className="text-sm text-slate-700">Intelligent recommendations</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-xl transition-shadow">
            <div className="p-3 bg-purple-100 rounded-lg w-fit mb-6">
              <Database className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Evidence Hub</h3>
            <p className="text-slate-600 mb-6">
              Centralized repository for all compliance evidence with cryptographic verification and audit-ready organization.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span className="text-sm text-slate-700">Cryptographic verification</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span className="text-sm text-slate-700">Audit-ready organization</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span className="text-sm text-slate-700">Smart categorization</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Screenshot Mockup */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 mb-16">
          <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">
            Dashboard Overview
          </h3>
          
          {/* Mock Dashboard Interface */}
          <div className="bg-slate-50 rounded-xl p-6 border-2 border-dashed border-slate-300">
            <div className="grid lg:grid-cols-4 gap-6 mb-8">
              {/* Trust Score Card */}
              <div className="bg-white rounded-lg p-4 border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Trust Score</span>
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-2xl font-bold text-emerald-600">87.5</div>
                <div className="text-xs text-slate-500">+2.3 this week</div>
              </div>

              {/* Active Controls */}
              <div className="bg-white rounded-lg p-4 border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Active Controls</span>
                  <Shield className="w-4 h-4 text-blue-500" />
                </div>
                <div className="text-2xl font-bold text-blue-600">342</div>
                <div className="text-xs text-slate-500">98% automated</div>
              </div>

              {/* Evidence Items */}
              <div className="bg-white rounded-lg p-4 border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Evidence Items</span>
                  <Database className="w-4 h-4 text-purple-500" />
                </div>
                <div className="text-2xl font-bold text-purple-600">1,247</div>
                <div className="text-xs text-slate-500">+45 today</div>
              </div>

              {/* Open Issues */}
              <div className="bg-white rounded-lg p-4 border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Open Issues</span>
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-2xl font-bold text-amber-600">3</div>
                <div className="text-xs text-slate-500">-2 resolved</div>
              </div>
            </div>

            {/* Framework Status */}
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-4 border">
                <h4 className="font-semibold text-slate-900 mb-3">SOC 2 Type II</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Coverage</span>
                    <span className="font-medium">96.8%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{width: '96.8%'}}></div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border">
                <h4 className="font-semibold text-slate-900 mb-3">ISO 27001</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Coverage</span>
                    <span className="font-medium">94.2%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{width: '94.2%'}}></div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border">
                <h4 className="font-semibold text-slate-900 mb-3">GDPR</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Coverage</span>
                    <span className="font-medium">98.1%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{width: '98.1%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h3 className="text-3xl font-bold text-slate-900 mb-6">
              Why Teams Choose Velocity Dashboard
            </h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Real-Time Visibility</h4>
                  <p className="text-slate-600">
                    See your compliance status update in real-time as infrastructure changes. No more waiting for weekly reports.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-emerald-100 rounded-lg flex-shrink-0">
                  <Zap className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">95% Automation</h4>
                  <p className="text-slate-600">
                    AI agents handle evidence collection, control testing, and compliance monitoring automatically.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                  <Globe className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Multi-Framework Support</h4>
                  <p className="text-slate-600">
                    Single dashboard for SOC 2, ISO 27001, GDPR, HIPAA, PCI DSS, and more compliance frameworks.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
            <h4 className="text-xl font-bold text-slate-900 mb-6">Dashboard Features</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span className="text-sm text-slate-700">Live trust scoring</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span className="text-sm text-slate-700">Evidence automation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span className="text-sm text-slate-700">Control monitoring</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span className="text-sm text-slate-700">Audit preparation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span className="text-sm text-slate-700">Risk assessment</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span className="text-sm text-slate-700">Compliance reporting</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span className="text-sm text-slate-700">Team collaboration</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span className="text-sm text-slate-700">Integration hub</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-slate-900/50 to-blue-900/50 rounded-2xl p-12 border border-blue-500/20">
          <h2 className="text-3xl font-bold text-white mb-6">
            Experience the Velocity Dashboard
          </h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            See how our unified compliance dashboard can transform your compliance operations with AI-powered automation.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/velocity/demo')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Eye className="w-5 h-5" />
              View Live Demo
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
      
      <BackToTopButton variant="blue" />
    </div>
  );
};

export default Dashboard;