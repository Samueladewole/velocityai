import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Database, 
  Shield, 
  Search, 
  FileText, 
  Lock, 
  CheckCircle, 
  ArrowRight, 
  Target, 
  Clock, 
  AlertTriangle,
  Download,
  Eye,
  Zap,
  Server,
  Globe,
  Activity,
  Hash
} from 'lucide-react';
import { PublicHeader } from '../../components/common/PublicHeader';

const EvidenceCollection: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'automation' | 'verification' | 'integration'>('overview');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-12">
            {/* Evidence Hub Overview */}
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">
                  Automated Evidence Collection
                </h2>
                <p className="text-lg text-slate-600 mb-6">
                  AI agents continuously collect, verify, and organize compliance evidence from across your entire infrastructure, making audit preparation effortless.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Database className="w-5 h-5 text-blue-500 mt-1" />
                    <div>
                      <h3 className="font-semibold text-slate-900">Centralized Repository</h3>
                      <p className="text-slate-600 text-sm">All evidence stored in one secure, organized location</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Hash className="w-5 h-5 text-purple-500 mt-1" />
                    <div>
                      <h3 className="font-semibold text-slate-900">Cryptographic Verification</h3>
                      <p className="text-slate-600 text-sm">Blockchain-based evidence integrity and authenticity</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-emerald-500 mt-1" />
                    <div>
                      <h3 className="font-semibold text-slate-900">Real-Time Collection</h3>
                      <p className="text-slate-600 text-sm">Evidence collected automatically as events occur</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Evidence Metrics</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">1M+</div>
                    <div className="text-sm text-slate-600">Evidence Items Collected</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-600 mb-2">95%</div>
                    <div className="text-sm text-slate-600">Automation Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
                    <div className="text-sm text-slate-600">Continuous Collection</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-amber-600 mb-2">100%</div>
                    <div className="text-sm text-slate-600">Cryptographically Verified</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Evidence Types */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
                Types of Evidence We Collect
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <Server className="w-8 h-8 text-blue-500 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Infrastructure Evidence</h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li>• Cloud configuration snapshots</li>
                    <li>• Network security policies</li>
                    <li>• Access control matrices</li>
                    <li>• Encryption key management</li>
                    <li>• Backup and recovery logs</li>
                  </ul>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <Activity className="w-8 h-8 text-emerald-500 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Operational Evidence</h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li>• Security incident reports</li>
                    <li>• Change management records</li>
                    <li>• Vulnerability scan results</li>
                    <li>• User access reviews</li>
                    <li>• Training completion records</li>
                  </ul>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <FileText className="w-8 h-8 text-purple-500 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Policy Evidence</h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li>• Policy acknowledgments</li>
                    <li>• Risk assessment reports</li>
                    <li>• Vendor security reviews</li>
                    <li>• Business continuity tests</li>
                    <li>• Compliance certifications</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 'automation':
        return (
          <div className="space-y-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">AI-Powered Evidence Automation</h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Our specialized AI agents work 24/7 to automatically collect, categorize, and verify evidence across your entire technology stack.
              </p>
            </div>

            {/* AI Agents for Evidence */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: 'Infrastructure Monitoring Agent',
                  description: 'Continuously monitors cloud infrastructure for compliance evidence',
                  automation: 98,
                  icon: Server,
                  capabilities: ['AWS/Azure/GCP monitoring', 'Configuration tracking', 'Security posture assessment']
                },
                {
                  name: 'Access Control Agent',
                  description: 'Tracks user access, permissions, and identity management',
                  automation: 96,
                  icon: Lock,
                  capabilities: ['Identity provider integration', 'Permission auditing', 'Access review automation']
                },
                {
                  name: 'Security Events Agent',
                  description: 'Collects and correlates security events and incidents',
                  automation: 94,
                  icon: Shield,
                  capabilities: ['SIEM integration', 'Incident tracking', 'Threat intelligence']
                },
                {
                  name: 'Change Management Agent',
                  description: 'Documents all system and process changes',
                  automation: 92,
                  icon: Activity,
                  capabilities: ['Version control integration', 'Deployment tracking', 'Rollback documentation']
                },
                {
                  name: 'Vulnerability Assessment Agent',
                  description: 'Automated vulnerability scanning and remediation tracking',
                  automation: 90,
                  icon: Search,
                  capabilities: ['Continuous scanning', 'Risk prioritization', 'Patch management']
                },
                {
                  name: 'Policy Compliance Agent',
                  description: 'Monitors policy adherence and compliance violations',
                  automation: 88,
                  icon: FileText,
                  capabilities: ['Policy enforcement', 'Violation detection', 'Compliance reporting']
                }
              ].map((agent, index) => (
                <div key={index} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <agent.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900">{agent.name}</h3>
                      <p className="text-sm text-slate-600">{agent.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-emerald-600">{agent.automation}%</div>
                      <div className="text-xs text-slate-500">Automation</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {agent.capabilities.map((capability, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span className="text-sm text-slate-700">{capability}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Collection Process */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">
                Automated Collection Process
              </h3>
              
              <div className="grid lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="p-4 bg-blue-100 rounded-full w-fit mx-auto mb-4">
                    <Search className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2">1. Discovery</h4>
                  <p className="text-sm text-slate-600">AI agents discover and catalog all evidence sources across your infrastructure</p>
                </div>
                <div className="text-center">
                  <div className="p-4 bg-emerald-100 rounded-full w-fit mx-auto mb-4">
                    <Database className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2">2. Collection</h4>
                  <p className="text-sm text-slate-600">Continuous automated collection of evidence items with real-time monitoring</p>
                </div>
                <div className="text-center">
                  <div className="p-4 bg-purple-100 rounded-full w-fit mx-auto mb-4">
                    <Hash className="w-8 h-8 text-purple-600" />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2">3. Verification</h4>
                  <p className="text-sm text-slate-600">Cryptographic verification and integrity checking of all collected evidence</p>
                </div>
                <div className="text-center">
                  <div className="p-4 bg-amber-100 rounded-full w-fit mx-auto mb-4">
                    <FileText className="w-8 h-8 text-amber-600" />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2">4. Organization</h4>
                  <p className="text-sm text-slate-600">Smart categorization and organization for easy audit access and reporting</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'verification':
        return (
          <div className="space-y-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Cryptographic Evidence Verification</h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Every piece of evidence is cryptographically verified and timestamped, ensuring integrity and authenticity for audit purposes.
              </p>
            </div>

            {/* Verification Features */}
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-6">
                  Blockchain-Based Integrity
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                      <Hash className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">Immutable Evidence Chain</h4>
                      <p className="text-slate-600">
                        Each evidence item is hashed and stored on blockchain, creating an immutable audit trail that proves authenticity.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">Tamper Detection</h4>
                      <p className="text-slate-600">
                        Any attempt to modify or tamper with evidence is immediately detected and flagged for investigation.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-emerald-100 rounded-lg flex-shrink-0">
                      <Shield className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">Auditor Verification</h4>
                      <p className="text-slate-600">
                        Auditors can independently verify evidence authenticity using cryptographic proofs without accessing your systems.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8">
                <h4 className="text-xl font-bold text-slate-900 mb-6">Verification Process</h4>
                
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-sm">1</span>
                      </div>
                      <span className="font-semibold text-slate-900">Evidence Collection</span>
                    </div>
                    <p className="text-sm text-slate-600 ml-11">Evidence item is collected from source system</p>
                  </div>

                  <div className="bg-white rounded-lg p-4 border">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-bold text-sm">2</span>
                      </div>
                      <span className="font-semibold text-slate-900">Cryptographic Hash</span>
                    </div>
                    <p className="text-sm text-slate-600 ml-11">SHA-256 hash generated with timestamp</p>
                  </div>

                  <div className="bg-white rounded-lg p-4 border">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <span className="text-emerald-600 font-bold text-sm">3</span>
                      </div>
                      <span className="font-semibold text-slate-900">Blockchain Storage</span>
                    </div>
                    <p className="text-sm text-slate-600 ml-11">Hash stored on immutable blockchain ledger</p>
                  </div>

                  <div className="bg-white rounded-lg p-4 border">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                        <span className="text-amber-600 font-bold text-sm">4</span>
                      </div>
                      <span className="font-semibold text-slate-900">Verification Certificate</span>
                    </div>
                    <p className="text-sm text-slate-600 ml-11">Digital certificate issued for auditor verification</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">
                Benefits of Cryptographic Verification
              </h3>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="p-3 bg-green-100 rounded-lg w-fit mx-auto mb-4">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2">Auditor Trust</h4>
                  <p className="text-sm text-slate-600">Auditors have complete confidence in evidence authenticity and integrity</p>
                </div>
                <div className="text-center">
                  <div className="p-3 bg-blue-100 rounded-lg w-fit mx-auto mb-4">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2">Tamper Proof</h4>
                  <p className="text-sm text-slate-600">Impossible to modify evidence without detection, ensuring compliance integrity</p>
                </div>
                <div className="text-center">
                  <div className="p-3 bg-purple-100 rounded-lg w-fit mx-auto mb-4">
                    <Globe className="w-6 h-6 text-purple-600" />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2">Global Standards</h4>
                  <p className="text-sm text-slate-600">Meets international standards for digital evidence and forensic requirements</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'integration':
        return (
          <div className="space-y-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Seamless Integration</h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Connect with your existing tools and systems for comprehensive evidence collection across your entire technology stack.
              </p>
            </div>

            {/* Integration Categories */}
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="p-3 bg-blue-100 rounded-lg w-fit mb-4">
                  <Server className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Cloud Platforms</h3>
                <div className="space-y-2">
                  {['AWS CloudTrail', 'Azure Activity Log', 'GCP Cloud Logging', 'Kubernetes Events', 'Docker Registry'].map((integration, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm text-slate-700">{integration}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="p-3 bg-emerald-100 rounded-lg w-fit mb-4">
                  <Shield className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Security Tools</h3>
                <div className="space-y-2">
                  {['Splunk SIEM', 'Okta Identity', 'CrowdStrike EDR', 'Qualys VMDR', 'Tenable Nessus'].map((integration, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm text-slate-700">{integration}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="p-3 bg-purple-100 rounded-lg w-fit mb-4">
                  <Activity className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">DevOps Tools</h3>
                <div className="space-y-2">
                  {['GitHub Actions', 'Jenkins CI/CD', 'Jira Service Desk', 'PagerDuty Alerts', 'Slack Notifications'].map((integration, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm text-slate-700">{integration}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* API and Custom Integrations */}
            <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-8">
              <div className="grid lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">
                    REST API & Custom Integrations
                  </h3>
                  <p className="text-slate-600 mb-6">
                    Use our comprehensive REST API to build custom integrations with your unique tools and systems.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm text-slate-700">RESTful API with OpenAPI documentation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm text-slate-700">Webhook support for real-time updates</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm text-slate-700">SDK libraries for major programming languages</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm text-slate-700">Custom agent development framework</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-4">Example API Usage</h4>
                  <div className="bg-slate-900 rounded-lg p-4 text-sm">
                    <div className="text-green-400">POST /api/v1/evidence</div>
                    <div className="text-slate-300 mt-2">{`{
  "type": "access_log",
  "source": "okta",
  "data": {...},
  "timestamp": "2024-01-15T10:30:00Z"
}`}</div>
                  </div>
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
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 pt-16">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-purple-500 rounded-full mr-4">
                <Database className="w-8 h-8 text-white" />
              </div>
              <span className="text-purple-400 font-semibold text-lg">Evidence Collection</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Automated Evidence
              <span className="block text-purple-400">Collection Hub</span>
            </h1>
            
            <p className="text-xl text-slate-200 mb-8 max-w-3xl mx-auto">
              AI agents work 24/7 to collect, verify, and organize compliance evidence 
              from across your entire infrastructure with cryptographic integrity.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() => navigate('/velocity/demo')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 transition-colors"
              >
                <Eye className="w-5 h-5" />
                See Evidence Hub Demo
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => navigate('/velocity/assessment')}
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-slate-300 text-slate-200 font-semibold rounded-lg hover:border-white hover:text-white transition-colors"
              >
                <Target className="w-5 h-5" />
                Free Assessment
              </button>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400 mb-2">1M+</div>
                <div className="text-sm text-slate-300">Evidence Items</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">95%</div>
                <div className="text-sm text-slate-300">Automation Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">24/7</div>
                <div className="text-sm text-slate-300">Collection</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-400 mb-2">100%</div>
                <div className="text-sm text-slate-300">Verified</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {[
            { id: 'overview', label: 'Overview', icon: Database },
            { id: 'automation', label: 'AI Automation', icon: Zap },
            { id: 'verification', label: 'Verification', icon: Hash },
            { id: 'integration', label: 'Integrations', icon: Globe }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white'
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
        <div className="mt-16 text-center bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-2xl p-12 border border-purple-500/20">
          <h2 className="text-3xl font-bold text-white mb-6">
            Experience Automated Evidence Collection
          </h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            See how AI agents can transform your compliance evidence management with continuous, verified collection.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/velocity/demo')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 transition-colors"
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

export default EvidenceCollection;