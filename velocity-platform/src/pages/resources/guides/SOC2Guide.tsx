import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PublicHeader } from '../../../components/common/PublicHeader';

const SOC2Guide: React.FC = () => {
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
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium"
            >
              Start SOC 2 Assessment
            </button>
          </div>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="text-5xl">🛡️</div>
            <div>
              <h1 className="text-4xl font-bold text-white font-serif">
                SOC 2 Type II Compliance Guide
              </h1>
              <p className="text-slate-300 mt-2">
                Complete automation framework with Velocity's 10 AI agents
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full">
              15 min read
            </span>
            <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full">
              Intermediate
            </span>
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full">
              95% Automation Rate
            </span>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full">
              All 10 AI Agents
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="prose prose-invert prose-emerald max-w-none">
          
          {/* Executive Summary */}
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span>📋</span>
              Executive Summary
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-emerald-400 mb-2">Traditional SOC 2</h3>
                <ul className="text-slate-300 space-y-1 text-sm">
                  <li>• 6-12 months implementation</li>
                  <li>• €50K-€200K+ in costs</li>
                  <li>• 80% manual evidence collection</li>
                  <li>• High risk of audit findings</li>
                  <li>• Requires 2-3 FTE resources</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-emerald-400 mb-2">Velocity AI Approach</h3>
                <ul className="text-emerald-300 space-y-1 text-sm">
                  <li>• 6-8 weeks to audit-ready</li>
                  <li>• 70% cost reduction</li>
                  <li>• 95% automated evidence</li>
                  <li>• Continuous compliance</li>
                  <li>• 0.5 FTE oversight required</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Velocity's 10 AI Agents for SOC 2 */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <span>🤖</span>
              Velocity's 10 AI Agents for SOC 2
            </h2>
            
            <div className="grid gap-6">
              {/* Agent 1: ATLAS */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">🗺️</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">
                      Agent 1: ATLAS - Infrastructure Discovery
                    </h3>
                    <p className="text-slate-300 mb-4">
                      Automatically discovers and maps your entire IT infrastructure for comprehensive SOC 2 scoping.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-emerald-400 mb-2">SOC 2 Controls Covered:</h4>
                        <ul className="text-sm text-slate-300 space-y-1">
                          <li>• CC6.1 - Logical Access</li>
                          <li>• CC6.7 - Data Transmission</li>
                          <li>• CC7.1 - System Operations</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-emerald-400 mb-2">Automation Benefits:</h4>
                        <ul className="text-sm text-slate-300 space-y-1">
                          <li>• Real-time asset inventory</li>
                          <li>• Automated network mapping</li>
                          <li>• Continuous scope validation</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Agent 2: BEACON */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">🚨</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">
                      Agent 2: BEACON - Security Monitoring
                    </h3>
                    <p className="text-slate-300 mb-4">
                      Continuous security monitoring and incident detection for SOC 2 security requirements.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-emerald-400 mb-2">SOC 2 Controls Covered:</h4>
                        <ul className="text-sm text-slate-300 space-y-1">
                          <li>• CC7.2 - System Monitoring</li>
                          <li>• CC7.3 - Incident Response</li>
                          <li>• CC7.4 - Recovery Procedures</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-emerald-400 mb-2">Automation Benefits:</h4>
                        <ul className="text-sm text-slate-300 space-y-1">
                          <li>• 24/7 security monitoring</li>
                          <li>• Automated incident logging</li>
                          <li>• Real-time alert management</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Agent 3: CIPHER */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">🔐</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">
                      Agent 3: CIPHER - Data Classification
                    </h3>
                    <p className="text-slate-300 mb-4">
                      Intelligent data discovery, classification, and protection for confidentiality requirements.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-emerald-400 mb-2">SOC 2 Controls Covered:</h4>
                        <ul className="text-sm text-slate-300 space-y-1">
                          <li>• CC6.3 - Data Protection</li>
                          <li>• CC6.4 - Data Classification</li>
                          <li>• CC6.5 - Data Retention</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-emerald-400 mb-2">Automation Benefits:</h4>
                        <ul className="text-sm text-slate-300 space-y-1">
                          <li>• Automated data discovery</li>
                          <li>• Smart classification rules</li>
                          <li>• Continuous data monitoring</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Agent 4: CLEARANCE */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">👤</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">
                      Agent 4: CLEARANCE - Access Management
                    </h3>
                    <p className="text-slate-300 mb-4">
                      Automated user access reviews, provisioning, and de-provisioning for logical access controls.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-emerald-400 mb-2">SOC 2 Controls Covered:</h4>
                        <ul className="text-sm text-slate-300 space-y-1">
                          <li>• CC6.1 - Logical Access</li>
                          <li>• CC6.2 - Authentication</li>
                          <li>• CC6.3 - Authorization</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-emerald-400 mb-2">Automation Benefits:</h4>
                        <ul className="text-sm text-slate-300 space-y-1">
                          <li>• Automated access reviews</li>
                          <li>• Smart provisioning workflows</li>
                          <li>• Real-time access monitoring</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Agent 5: COMPASS */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">🧭</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">
                      Agent 5: COMPASS - Risk Assessment
                    </h3>
                    <p className="text-slate-300 mb-4">
                      Continuous risk assessment and management aligned with SOC 2 risk criteria.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-emerald-400 mb-2">SOC 2 Controls Covered:</h4>
                        <ul className="text-sm text-slate-300 space-y-1">
                          <li>• CC3.1 - Risk Assessment</li>
                          <li>• CC3.2 - Risk Response</li>
                          <li>• CC9.1 - Risk Monitoring</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-emerald-400 mb-2">Automation Benefits:</h4>
                        <ul className="text-sm text-slate-300 space-y-1">
                          <li>• Dynamic risk scoring</li>
                          <li>• Automated risk responses</li>
                          <li>• Continuous risk monitoring</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Agent 6: NEXUS */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">🔗</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">
                      Agent 6: NEXUS - Vendor Management
                    </h3>
                    <p className="text-slate-300 mb-4">
                      Automated vendor risk assessment and third-party compliance monitoring.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-emerald-400 mb-2">SOC 2 Controls Covered:</h4>
                        <ul className="text-sm text-slate-300 space-y-1">
                          <li>• CC9.2 - Vendor Management</li>
                          <li>• CC2.1 - Communication</li>
                          <li>• CC5.1 - Control Activities</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-emerald-400 mb-2">Automation Benefits:</h4>
                        <ul className="text-sm text-slate-300 space-y-1">
                          <li>• Automated vendor assessments</li>
                          <li>• Real-time compliance tracking</li>
                          <li>• Smart contract management</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Agent 7: PRISM */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">📊</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">
                      Agent 7: PRISM - Evidence Collection
                    </h3>
                    <p className="text-slate-300 mb-4">
                      Automated evidence collection and documentation for all SOC 2 controls.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-emerald-400 mb-2">SOC 2 Controls Covered:</h4>
                        <ul className="text-sm text-slate-300 space-y-1">
                          <li>• All 64 SOC 2 Controls</li>
                          <li>• CC5.1 - Documentation</li>
                          <li>• CC4.1 - Monitoring Activities</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-emerald-400 mb-2">Automation Benefits:</h4>
                        <ul className="text-sm text-slate-300 space-y-1">
                          <li>• Continuous evidence collection</li>
                          <li>• Automated documentation</li>
                          <li>• Real-time audit trails</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Agent 8: PULSE */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">💓</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">
                      Agent 8: PULSE - Performance Monitoring
                    </h3>
                    <p className="text-slate-300 mb-4">
                      System availability and performance monitoring for processing integrity and availability.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-emerald-400 mb-2">SOC 2 Controls Covered:</h4>
                        <ul className="text-sm text-slate-300 space-y-1">
                          <li>• A1.1 - System Availability</li>
                          <li>• PI1.1 - Processing Integrity</li>
                          <li>• CC7.1 - System Operations</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-emerald-400 mb-2">Automation Benefits:</h4>
                        <ul className="text-sm text-slate-300 space-y-1">
                          <li>• Real-time performance metrics</li>
                          <li>• Automated alerting</li>
                          <li>• Predictive maintenance</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Agent 9: SENTINEL */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">👁️</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">
                      Agent 9: SENTINEL - Change Management
                    </h3>
                    <p className="text-slate-300 mb-4">
                      Automated change detection, approval workflows, and configuration management.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-emerald-400 mb-2">SOC 2 Controls Covered:</h4>
                        <ul className="text-sm text-slate-300 space-y-1">
                          <li>• CC8.1 - Change Management</li>
                          <li>• CC7.2 - System Monitoring</li>
                          <li>• CC5.2 - Control Activities</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-emerald-400 mb-2">Automation Benefits:</h4>
                        <ul className="text-sm text-slate-300 space-y-1">
                          <li>• Automated change detection</li>
                          <li>• Smart approval workflows</li>
                          <li>• Configuration drift monitoring</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Agent 10: GENESIS */}
              <div className="bg-slate-800/50 border border-emerald-500/30 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">🔗</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">
                      Agent 10: GENESIS - Cryptographic Verification
                    </h3>
                    <p className="text-slate-300 mb-4">
                      World's first cryptographically verified compliance platform with immutable audit trails.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-emerald-400 mb-2">SOC 2 Controls Covered:</h4>
                        <ul className="text-sm text-slate-300 space-y-1">
                          <li>• CC4.1 - Monitoring Activities</li>
                          <li>• CC5.1 - Control Activities</li>
                          <li>• All Evidence Integrity</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-emerald-400 mb-2">Unique Advantages:</h4>
                        <ul className="text-sm text-emerald-300 space-y-1">
                          <li>• Blockchain-verified evidence</li>
                          <li>• Immutable audit trails</li>
                          <li>• Zero evidence tampering</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Implementation Timeline */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <span>⏱️</span>
              6-Week Implementation Timeline
            </h2>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center font-bold text-white">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">Week 1-2: Discovery & Setup</h3>
                  <ul className="text-slate-300 space-y-1">
                    <li>• ATLAS agent deployment and infrastructure discovery</li>
                    <li>• Initial risk assessment with COMPASS</li>
                    <li>• Data classification setup with CIPHER</li>
                    <li>• Velocity platform configuration</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center font-bold text-white">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">Week 3-4: Control Implementation</h3>
                  <ul className="text-slate-300 space-y-1">
                    <li>• Access management automation with CLEARANCE</li>
                    <li>• Security monitoring setup with BEACON</li>
                    <li>• Vendor management integration with NEXUS</li>
                    <li>• Change management workflows with SENTINEL</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center font-bold text-white">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">Week 5-6: Evidence & Validation</h3>
                  <ul className="text-slate-300 space-y-1">
                    <li>• Automated evidence collection with PRISM</li>
                    <li>• Performance monitoring with PULSE</li>
                    <li>• Cryptographic verification with GENESIS</li>
                    <li>• Pre-audit readiness assessment</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* ROI Analysis */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <span>💰</span>
              ROI Analysis
            </h2>
            
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-400 mb-2">70%</div>
                  <div className="text-slate-300">Cost Reduction</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-400 mb-2">85%</div>
                  <div className="text-slate-300">Time Savings</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-400 mb-2">99.5%</div>
                  <div className="text-slate-300">Evidence Accuracy</div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-white mb-3">Traditional SOC 2 Costs:</h4>
                  <ul className="text-slate-300 space-y-2">
                    <li>• External consultants: €80K-€150K</li>
                    <li>• Internal resources: €60K-€100K</li>
                    <li>• Audit fees: €25K-€50K</li>
                    <li>• Tool licensing: €20K-€40K</li>
                    <li><strong>Total: €185K-€340K</strong></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-emerald-400 mb-3">Velocity AI Costs:</h4>
                  <ul className="text-emerald-300 space-y-2">
                    <li>• Velocity platform: €36K/year</li>
                    <li>• Implementation: €15K</li>
                    <li>• Audit fees: €25K-€50K</li>
                    <li>• Internal oversight: €20K</li>
                    <li><strong>Total: €96K-€121K</strong></li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Getting Started */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <span>🚀</span>
              Getting Started
            </h2>
            
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6">
              <p className="text-slate-300 mb-6">
                Ready to transform your SOC 2 compliance with AI automation? Start with our free assessment 
                to see how Velocity's 10 AI agents can accelerate your compliance journey.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/velocity/assessment')}
                  className="px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium"
                >
                  Start Free SOC 2 Assessment
                </button>
                <button
                  onClick={() => navigate('/velocity/demo')}
                  className="px-6 py-3 border border-emerald-500 text-emerald-400 rounded-lg hover:bg-emerald-500/10 transition-colors font-medium"
                >
                  Watch Demo
                </button>
                <button
                  onClick={() => navigate('/velocity/contact')}
                  className="px-6 py-3 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-800 transition-colors font-medium"
                >
                  Talk to Expert
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SOC2Guide;