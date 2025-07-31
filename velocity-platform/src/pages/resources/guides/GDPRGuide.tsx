import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PublicHeader } from '../../../components/common/PublicHeader';

const GDPRGuide: React.FC = () => {
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
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Start GDPR Assessment
            </button>
          </div>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="text-5xl">🔒</div>
            <div>
              <h1 className="text-4xl font-bold text-white font-serif">
                GDPR Compliance Automation
              </h1>
              <p className="text-slate-300 mt-2">
                AI-powered GDPR compliance with automated data mapping and privacy controls
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full">
              12 min read
            </span>
            <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full">
              Advanced
            </span>
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full">
              87% Automation Rate
            </span>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full">
              8 AI Agents
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="prose prose-invert prose-blue max-w-none">
          
          {/* Executive Summary */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span>🇪🇺</span>
              GDPR at a Glance
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-2">Traditional GDPR Compliance</h3>
                <ul className="text-slate-300 space-y-1 text-sm">
                  <li>• 12-18 months implementation</li>
                  <li>• €100K-€500K+ in costs</li>
                  <li>• Manual data mapping processes</li>
                  <li>• High risk of €20M fines</li>
                  <li>• Complex consent management</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-2">Velocity AI Approach</h3>
                <ul className="text-blue-300 space-y-1 text-sm">
                  <li>• 8-10 weeks to compliant</li>
                  <li>• 75% cost reduction</li>
                  <li>• Automated data discovery</li>
                  <li>• Continuous compliance monitoring</li>
                  <li>• Intelligent consent automation</li>
                </ul>
              </div>
            </div>
          </div>

          {/* GDPR Requirements Overview */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <span>📋</span>
              GDPR Key Requirements
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Data Subject Rights</h3>
                <ul className="text-slate-300 space-y-2">
                  <li>• Right to be informed</li>
                  <li>• Right of access</li>
                  <li>• Right to rectification</li>
                  <li>• Right to erasure</li>
                  <li>• Right to restrict processing</li>
                  <li>• Right to data portability</li>
                  <li>• Right to object</li>
                </ul>
              </div>
              
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Compliance Obligations</h3>
                <ul className="text-slate-300 space-y-2">
                  <li>• Lawful basis for processing</li>
                  <li>• Privacy by design & default</li>
                  <li>• Data Protection Impact Assessments</li>
                  <li>• Breach notification (72 hours)</li>
                  <li>• Records of processing activities</li>
                  <li>• Data Protection Officer (DPO)</li>
                  <li>• International transfer safeguards</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Velocity AI Agents for GDPR */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <span>🤖</span>
              8 AI Agents for GDPR Compliance
            </h2>
            
            <div className="grid gap-6">
              {/* CIPHER - Data Discovery */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">🔐</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">
                      CIPHER - Intelligent Data Discovery
                    </h3>
                    <p className="text-slate-300 mb-4">
                      Automatically discovers, classifies, and maps personal data across your entire infrastructure.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-blue-400 mb-2">GDPR Articles Covered:</h4>
                        <ul className="text-sm text-slate-300 space-y-1">
                          <li>• Article 30 - Records of processing</li>
                          <li>• Article 35 - Data protection impact assessment</li>
                          <li>• Article 25 - Data protection by design</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-400 mb-2">Automation Benefits:</h4>
                        <ul className="text-sm text-slate-300 space-y-1">
                          <li>• AI-powered data classification</li>
                          <li>• Real-time data lineage mapping</li>
                          <li>• Automated data inventory</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CLEARANCE - Consent Management */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">✅</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">
                      CLEARANCE - Consent & Access Management
                    </h3>
                    <p className="text-slate-300 mb-4">
                      Automated consent collection, management, and data subject access request handling.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-blue-400 mb-2">GDPR Articles Covered:</h4>
                        <ul className="text-sm text-slate-300 space-y-1">
                          <li>• Article 7 - Conditions for consent</li>
                          <li>• Article 15 - Right of access</li>
                          <li>• Article 20 - Right to data portability</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-400 mb-2">Automation Benefits:</h4>
                        <ul className="text-sm text-slate-300 space-y-1">
                          <li>• Intelligent consent workflows</li>
                          <li>• Automated DSAR processing</li>
                          <li>• Real-time consent tracking</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ATLAS - Data Mapping */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">🗺️</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">
                      ATLAS - Data Flow Mapping
                    </h3>
                    <p className="text-slate-300 mb-4">
                      Comprehensive mapping of data flows, cross-border transfers, and processing activities.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-blue-400 mb-2">GDPR Articles Covered:</h4>
                        <ul className="text-sm text-slate-300 space-y-1">
                          <li>• Article 44-49 - International transfers</li>
                          <li>• Article 30 - Records of processing</li>
                          <li>• Article 28 - Processor obligations</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-400 mb-2">Automation Benefits:</h4>
                        <ul className="text-sm text-slate-300 space-y-1">
                          <li>• Automated data flow discovery</li>
                          <li>• Cross-border transfer monitoring</li>
                          <li>• Dynamic processing records</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* BEACON - Breach Detection */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">🚨</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">
                      BEACON - Breach Detection & Response
                    </h3>
                    <p className="text-slate-300 mb-4">
                      Automated data breach detection, assessment, and 72-hour notification compliance.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-blue-400 mb-2">GDPR Articles Covered:</h4>
                        <ul className="text-sm text-slate-300 space-y-1">
                          <li>• Article 33 - Notification to authority</li>
                          <li>• Article 34 - Communication to data subject</li>
                          <li>• Article 32 - Security of processing</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-400 mb-2">Automation Benefits:</h4>
                        <ul className="text-sm text-slate-300 space-y-1">
                          <li>• Real-time breach detection</li>
                          <li>• Automated risk assessment</li>
                          <li>• 72-hour notification workflows</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* COMPASS - Privacy Impact Assessment */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">🧭</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">
                      COMPASS - Automated DPIA
                    </h3>
                    <p className="text-slate-300 mb-4">
                      Intelligent Data Protection Impact Assessments with automated risk scoring.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-blue-400 mb-2">GDPR Articles Covered:</h4>
                        <ul className="text-sm text-slate-300 space-y-1">
                          <li>• Article 35 - Data protection impact assessment</li>
                          <li>• Article 36 - Prior consultation</li>
                          <li>• Article 25 - Data protection by design</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-400 mb-2">Automation Benefits:</h4>
                        <ul className="text-sm text-slate-300 space-y-1">
                          <li>• AI-powered risk assessment</li>
                          <li>• Automated DPIA generation</li>
                          <li>• Continuous privacy monitoring</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* NEXUS - Vendor Management */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">🔗</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">
                      NEXUS - Processor Management
                    </h3>
                    <p className="text-slate-300 mb-4">
                      Automated data processor agreements and third-party privacy compliance monitoring.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-blue-400 mb-2">GDPR Articles Covered:</h4>
                        <ul className="text-sm text-slate-300 space-y-1">
                          <li>• Article 28 - Processor obligations</li>
                          <li>• Article 44-49 - International transfers</li>
                          <li>• Article 46 - Appropriate safeguards</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-400 mb-2">Automation Benefits:</h4>
                        <ul className="text-sm text-slate-300 space-y-1">
                          <li>• Automated DPA management</li>
                          <li>• Real-time processor monitoring</li>
                          <li>• Transfer impact assessments</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* PRISM - Evidence Collection */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">📊</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">
                      PRISM - Compliance Documentation
                    </h3>
                    <p className="text-slate-300 mb-4">
                      Automated evidence collection and documentation for GDPR accountability requirements.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-blue-400 mb-2">GDPR Articles Covered:</h4>
                        <ul className="text-sm text-slate-300 space-y-1">
                          <li>• Article 5 - Principles relating to processing</li>
                          <li>• Article 24 - Responsibility of controller</li>
                          <li>• Article 30 - Records of processing</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-400 mb-2">Automation Benefits:</h4>
                        <ul className="text-sm text-slate-300 space-y-1">
                          <li>• Continuous compliance evidence</li>
                          <li>• Automated audit trails</li>
                          <li>• Real-time accountability reports</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* GENESIS - Cryptographic Verification */}
              <div className="bg-slate-800/50 border border-blue-500/30 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">🔗</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">
                      GENESIS - Immutable Compliance Records
                    </h3>
                    <p className="text-slate-300 mb-4">
                      Blockchain-verified GDPR compliance records that cannot be altered or disputed.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-blue-400 mb-2">GDPR Articles Covered:</h4>
                        <ul className="text-sm text-slate-300 space-y-1">
                          <li>• Article 5 - Accountability principle</li>
                          <li>• Article 24 - Responsibility of controller</li>
                          <li>• All evidence integrity</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-400 mb-2">Unique Advantages:</h4>
                        <ul className="text-sm text-blue-300 space-y-1">
                          <li>• Cryptographic proof of compliance</li>
                          <li>• Immutable consent records</li>
                          <li>• Tamper-proof audit trails</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* GDPR Implementation Roadmap */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <span>🗺️</span>
              8-Week GDPR Implementation
            </h2>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center font-bold text-white">
                  1-2
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">Weeks 1-2: Data Discovery & Mapping</h3>
                  <ul className="text-slate-300 space-y-1">
                    <li>• CIPHER deployment for data discovery</li>
                    <li>• ATLAS mapping of data flows and transfers</li>
                    <li>• Initial data inventory and classification</li>
                    <li>• Processing activity records generation</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center font-bold text-white">
                  3-4
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">Weeks 3-4: Rights & Consent Management</h3>
                  <ul className="text-slate-300 space-y-1">
                    <li>• CLEARANCE setup for consent management</li>
                    <li>• Automated DSAR workflow implementation</li>
                    <li>• Data subject rights portal deployment</li>
                    <li>• Consent tracking and audit systems</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center font-bold text-white">
                  5-6
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">Weeks 5-6: Privacy Controls & Assessments</h3>
                  <ul className="text-slate-300 space-y-1">
                    <li>• COMPASS automated DPIA implementation</li>
                    <li>• BEACON breach detection deployment</li>
                    <li>• Privacy by design controls</li>
                    <li>• Risk assessment automation</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center font-bold text-white">
                  7-8
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">Weeks 7-8: Verification & Go-Live</h3>
                  <ul className="text-slate-300 space-y-1">
                    <li>• NEXUS processor compliance verification</li>
                    <li>• PRISM evidence collection validation</li>
                    <li>• GENESIS cryptographic verification</li>
                    <li>• Final compliance assessment and certification</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Cost Comparison */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <span>💰</span>
              GDPR Compliance Costs
            </h2>
            
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">75%</div>
                  <div className="text-slate-300">Cost Reduction</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">90%</div>
                  <div className="text-slate-300">Faster Implementation</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">99%</div>
                  <div className="text-slate-300">Accuracy Rate</div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-white mb-3">Traditional GDPR Costs:</h4>
                  <ul className="text-slate-300 space-y-2">
                    <li>• Privacy consultants: €150K-€300K</li>
                    <li>• Legal review: €50K-€100K</li>
                    <li>• Internal resources: €100K-€200K</li>
                    <li>• Tool licensing: €30K-€60K</li>
                    <li><strong>Total: €330K-€660K</strong></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-400 mb-3">Velocity AI Costs:</h4>
                  <ul className="text-blue-300 space-y-2">
                    <li>• Velocity platform: €48K/year</li>
                    <li>• Implementation: €25K</li>
                    <li>• Legal review: €15K</li>
                    <li>• Internal oversight: €30K</li>
                    <li><strong>Total: €118K</strong></li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Risk Mitigation */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <span>⚡</span>
              Risk & Fine Mitigation
            </h2>
            
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-bold text-white mb-4">GDPR Fine Risk</h3>
              <p className="text-slate-300 mb-4">
                GDPR fines can reach <strong>€20 million or 4% of annual global turnover</strong>, whichever is higher. 
                Recent fines have exceeded €700 million for major violations.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-red-400 mb-2">Common Violation Areas:</h4>
                  <ul className="text-slate-300 space-y-1 text-sm">
                    <li>• Insufficient lawful basis for processing</li>
                    <li>• Inadequate consent mechanisms</li>
                    <li>• Late breach notifications (&gt;72 hours)</li>
                    <li>• Lack of data subject rights processes</li>
                    <li>• Invalid international transfers</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-emerald-400 mb-2">Velocity AI Protection:</h4>
                  <ul className="text-emerald-300 space-y-1 text-sm">
                    <li>• Automated lawful basis validation</li>
                    <li>• Intelligent consent management</li>
                    <li>• Real-time breach detection & notification</li>
                    <li>• Automated DSAR processing</li>
                    <li>• Transfer impact assessments</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Getting Started */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <span>🚀</span>
              Start Your GDPR Journey
            </h2>
            
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
              <p className="text-slate-300 mb-6">
                Transform your GDPR compliance with AI automation. Get compliant 90% faster and 75% cheaper 
                while reducing fine risk to near zero.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/velocity/assessment')}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  Start Free GDPR Assessment
                </button>
                <button
                  onClick={() => navigate('/velocity/demo')}
                  className="px-6 py-3 border border-blue-500 text-blue-400 rounded-lg hover:bg-blue-500/10 transition-colors font-medium"
                >
                  Watch GDPR Demo
                </button>
                <button
                  onClick={() => navigate('/velocity/contact')}
                  className="px-6 py-3 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-800 transition-colors font-medium"
                >
                  Talk to Privacy Expert
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default GDPRGuide;