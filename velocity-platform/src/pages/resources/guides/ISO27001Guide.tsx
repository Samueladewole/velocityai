import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PublicHeader } from '../../../components/common/PublicHeader';

const ISO27001Guide: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <PublicHeader />
      {/* Header */}
      <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700 pt-16">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate('/velocity/resources')}
              className="text-slate-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Resource Center
            </button>
            <button
              onClick={() => navigate('/velocity/assessment')}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium"
            >
              Start ISO 27001 Assessment
            </button>
          </div>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="text-5xl">📋</div>
            <div>
              <h1 className="text-4xl font-bold text-white font-serif">
                ISO 27001 Implementation Guide
              </h1>
              <p className="text-slate-300 mt-2">
                Systematic approach to ISO 27001 certification with intelligent evidence collection
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full">
              18 min read
            </span>
            <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full">
              Advanced
            </span>
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full">
              92% Automation Rate
            </span>
            <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full">
              All 10 AI Agents
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="prose prose-invert prose-purple max-w-none">
          
          {/* Executive Summary */}
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span>🏛️</span>
              ISO 27001 Overview
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-purple-400 mb-2">Traditional ISO 27001</h3>
                <ul className="text-slate-300 space-y-1 text-sm">
                  <li>• 18-24 months implementation</li>
                  <li>• $150K-$400K+ in costs</li>
                  <li>• 114 controls to implement</li>
                  <li>• Complex documentation requirements</li>
                  <li>• 3-4 FTE resources required</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-purple-400 mb-2">Velocity AI Approach</h3>
                <ul className="text-purple-300 space-y-1 text-sm">
                  <li>• 10-12 weeks to certification</li>
                  <li>• 65% cost reduction</li>
                  <li>• 92% automated control implementation</li>
                  <li>• Continuous compliance monitoring</li>
                  <li>• 1 FTE oversight required</li>
                </ul>
              </div>
            </div>
          </div>

          {/* ISO 27001 Structure */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <span>🏗️</span>
              ISO 27001:2022 Structure
            </h2>
            
            <div className="grid gap-6">
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Annex A Controls (93 Controls)</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-purple-400 mb-2">Organizational (37 controls)</h4>
                    <ul className="text-slate-300 text-sm space-y-1">
                      <li>• Information security policies</li>
                      <li>• Organization of information security</li>
                      <li>• Human resource security</li>
                      <li>• Asset management</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-400 mb-2">People (8 controls)</h4>
                    <ul className="text-slate-300 text-sm space-y-1">
                      <li>• Access control</li>
                      <li>• Awareness and training</li>
                      <li>• Disciplinary process</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-400 mb-2">Physical (14 controls)</h4>
                    <ul className="text-slate-300 text-sm space-y-1">
                      <li>• Physical and environmental security</li>
                      <li>• Equipment security</li>
                      <li>• Secure disposal</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-400 mb-2">Technological (34 controls)</h4>
                    <ul className="text-slate-300 text-sm space-y-1">
                      <li>• System security</li>
                      <li>• Network security controls</li>
                      <li>• Application security</li>
                      <li>• Encryption</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* AI Agents Mapping */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <span>🤖</span>
              10 AI Agents for ISO 27001
            </h2>
            
            <div className="grid gap-6">
              {/* High-Level Agent Mapping */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Agent to Control Mapping</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-purple-400 mb-3">Organizational Controls</h4>
                    <ul className="text-slate-300 space-y-2 text-sm">
                      <li><strong>COMPASS:</strong> Risk assessment & management (5.8-5.10)</li>
                      <li><strong>NEXUS:</strong> Supplier relationships (5.19-5.23)</li>
                      <li><strong>CLEARANCE:</strong> Access control (8.1-8.6)</li>
                      <li><strong>PRISM:</strong> Information classification (5.12-5.14)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-400 mb-3">Technical Controls</h4>
                    <ul className="text-slate-300 space-y-2 text-sm">
                      <li><strong>ATLAS:</strong> Network security (8.20-8.23)</li>
                      <li><strong>BEACON:</strong> Monitoring & logging (8.15-8.16)</li>
                      <li><strong>CIPHER:</strong> Cryptography (8.24)</li>
                      <li><strong>SENTINEL:</strong> Configuration management (8.9)</li>
                      <li><strong>PULSE:</strong> Capacity management (8.6)</li>
                      <li><strong>GENESIS:</strong> Evidence integrity (All controls)</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Detailed Agent Examples */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">🧭</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">
                      COMPASS - Risk Management Automation
                    </h3>
                    <p className="text-slate-300 mb-4">
                      Automates ISO 27001 risk assessment, treatment, and monitoring requirements.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-purple-400 mb-2">ISO 27001 Controls:</h4>
                        <ul className="text-sm text-slate-300 space-y-1">
                          <li>• 5.8 - Information security in project management</li>
                          <li>• 5.9 - Inventory of information and assets</li>
                          <li>• 5.10 - Acceptable use of information</li>
                          <li>• 6.1 - Risk assessment process</li>
                          <li>• 6.2 - Risk treatment process</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-purple-400 mb-2">Automation Benefits:</h4>
                        <ul className="text-sm text-slate-300 space-y-1">
                          <li>• Continuous risk monitoring</li>
                          <li>• Automated threat intelligence</li>
                          <li>• Dynamic risk scoring</li>
                          <li>• Treatment plan automation</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">👤</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">
                      CLEARANCE - Access Control Management
                    </h3>
                    <p className="text-slate-300 mb-4">
                      Comprehensive access control automation for all ISO 27001 access requirements.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-purple-400 mb-2">ISO 27001 Controls:</h4>
                        <ul className="text-sm text-slate-300 space-y-1">
                          <li>• 8.1 - User access management</li>
                          <li>• 8.2 - Privileged access rights</li>
                          <li>• 8.3 - Information access restriction</li>
                          <li>• 8.5 - Secure authentication</li>
                          <li>• 8.6 - Capacity management</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-purple-400 mb-2">Automation Benefits:</h4>
                        <ul className="text-sm text-slate-300 space-y-1">
                          <li>• Automated provisioning/deprovisioning</li>
                          <li>• Regular access reviews</li>
                          <li>• Privileged access monitoring</li>
                          <li>• Multi-factor authentication enforcement</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">🚨</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">
                      BEACON - Security Monitoring & Incident Response
                    </h3>
                    <p className="text-slate-300 mb-4">
                      24/7 security monitoring and automated incident response for ISO 27001 compliance.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-purple-400 mb-2">ISO 27001 Controls:</h4>
                        <ul className="text-sm text-slate-300 space-y-1">
                          <li>• 8.15 - Logging</li>
                          <li>• 8.16 - Monitoring activities</li>
                          <li>• 5.24 - Information security incident management</li>
                          <li>• 5.25 - Assessment of information security events</li>
                          <li>• 5.26 - Response to information security incidents</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-purple-400 mb-2">Automation Benefits:</h4>
                        <ul className="text-sm text-slate-300 space-y-1">
                          <li>• Real-time threat detection</li>
                          <li>• Automated incident classification</li>
                          <li>• Response workflow automation</li>
                          <li>• Comprehensive audit logging</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Implementation Phases */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <span>📅</span>
              12-Week Implementation Plan
            </h2>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center font-bold text-white">
                  1-3
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">Phase 1: Foundation (Weeks 1-3)</h3>
                  <ul className="text-slate-300 space-y-1">
                    <li>• ISMS policy framework establishment</li>
                    <li>• ATLAS infrastructure discovery and asset inventory</li>
                    <li>• COMPASS initial risk assessment</li>
                    <li>• Scope definition and statement of applicability</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center font-bold text-white">
                  4-6
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">Phase 2: Core Controls (Weeks 4-6)</h3>
                  <ul className="text-slate-300 space-y-1">
                    <li>• CLEARANCE access control implementation</li>
                    <li>• CIPHER data classification and encryption</li>
                    <li>• BEACON security monitoring deployment</li>
                    <li>• NEXUS supplier security assessment</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center font-bold text-white">
                  7-9
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">Phase 3: Advanced Controls (Weeks 7-9)</h3>
                  <ul className="text-slate-300 space-y-1">
                    <li>• SENTINEL change management automation</li>
                    <li>• PULSE performance and capacity monitoring</li>
                    <li>• PRISM evidence collection and documentation</li>
                    <li>• Business continuity and disaster recovery planning</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center font-bold text-white">
                  10-12
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">Phase 4: Certification (Weeks 10-12)</h3>
                  <ul className="text-slate-300 space-y-1">
                    <li>• GENESIS cryptographic verification deployment</li>
                    <li>• Internal audit execution and remediation</li>
                    <li>• Management review and continuous improvement</li>
                    <li>• External certification audit preparation</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Business Benefits */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <span>📈</span>
              Business Impact & ROI
            </h2>
            
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">65%</div>
                  <div className="text-slate-300">Cost Reduction</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">75%</div>
                  <div className="text-slate-300">Faster Certification</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">40%</div>
                  <div className="text-slate-300">Revenue Increase</div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-white mb-3">Direct Benefits:</h4>
                  <ul className="text-slate-300 space-y-2">
                    <li>• Reduced cyber insurance premiums (15-30%)</li>
                    <li>• Faster RFP responses and win rates</li>
                    <li>• Enhanced customer trust and retention</li>
                    <li>• Competitive advantage in enterprise sales</li>
                    <li>• Reduced audit and compliance costs</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-purple-400 mb-3">Long-term Value:</h4>
                  <ul className="text-purple-300 space-y-2">
                    <li>• Continuous compliance monitoring</li>
                    <li>• Automated evidence collection</li>
                    <li>• Reduced human error and risk</li>
                    <li>• Scalable security operations</li>
                    <li>• Future-proof compliance framework</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Certification Process */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <span>🏆</span>
              Certification Process
            </h2>
            
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-purple-400 mb-3">Stage 1 Audit - Documentation Review</h3>
                  <ul className="text-slate-300 space-y-1 text-sm">
                    <li>• ISMS policies and procedures review</li>
                    <li>• Statement of Applicability validation</li>
                    <li>• Risk assessment methodology review</li>
                    <li>• Internal audit program assessment</li>
                  </ul>
                  <p className="text-emerald-400 text-sm mt-2">
                    ✓ Velocity AI automates all documentation and evidence collection
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-purple-400 mb-3">Stage 2 Audit - Implementation Review</h3>
                  <ul className="text-slate-300 space-y-1 text-sm">
                    <li>• Control effectiveness testing</li>
                    <li>• Evidence sampling and validation</li>
                    <li>• Management review assessment</li>
                    <li>• Continuous improvement evaluation</li>
                  </ul>
                  <p className="text-emerald-400 text-sm mt-2">
                    ✓ GENESIS provides cryptographic proof of compliance
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Getting Started */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <span>🚀</span>
              Begin ISO 27001 Journey
            </h2>
            
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-6">
              <p className="text-slate-300 mb-6">
                Achieve ISO 27001 certification 75% faster and 65% cheaper with Velocity's AI-powered approach. 
                Start with our comprehensive assessment to see your readiness score.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/velocity/assessment')}
                  className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium"
                >
                  Start ISO 27001 Assessment
                </button>
                <button
                  onClick={() => navigate('/velocity/demo')}
                  className="px-6 py-3 border border-purple-500 text-purple-400 rounded-lg hover:bg-purple-500/10 transition-colors font-medium"
                >
                  Watch Implementation Demo
                </button>
                <button
                  onClick={() => navigate('/velocity/contact')}
                  className="px-6 py-3 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-800 transition-colors font-medium"
                >
                  Talk to ISO Expert
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ISO27001Guide;