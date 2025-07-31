import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Zap,
  Database,
  Bot,
  Eye,
  Lock,
  CheckCircle,
  ArrowRight,
  Trophy,
  Clock,
  TrendingUp,
  Users,
  Activity,
  Home,
  BarChart3,
  Building,
  Calculator,
  FileText,
  Briefcase,
  DollarSign,
  AlertTriangle,
  Settings,
  Server,
  Layers,
  Play,
  Pause,
  RefreshCw,
  Download,
  Upload,
  Monitor,
  Cpu,
  HardDrive,
  Network,
  ChevronRight,
  Loader
} from 'lucide-react';

interface EvidenceItem {
  id: string;
  source: string;
  type: string;
  category: string;
  timestamp: Date;
  status: 'collecting' | 'validating' | 'completed' | 'failed';
  description: string;
  controlId: string;
}

interface SystemMetrics {
  connections: number;
  evidenceItems: number;
  completionRate: number;
  processingSpeed: number;
}

const EvidenceAutomation: React.FC = () => {
  const navigate = useNavigate();
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [evidenceItems, setEvidenceItems] = useState<EvidenceItem[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics>({
    connections: 0,
    evidenceItems: 0,
    completionRate: 0,
    processingSpeed: 0
  });

  const demoSteps = [
    "Connecting to banking systems...",
    "Authenticating with core banking platform...",
    "Scanning loan management system...",
    "Analyzing general ledger entries...",
    "Collecting payment processing logs...",
    "Categorizing evidence by ISAE 3000 standards...",
    "Validating control effectiveness...",
    "Generating audit trail...",
    "Preparing management reports...",
    "Demo complete - Evidence package ready!"
  ];

  const bankingSystems = [
    { name: "Temenos T24", status: "connected", evidenceCount: 847 },
    { name: "Finastra Loan IQ", status: "connected", evidenceCount: 623 },
    { name: "Oracle Financial", status: "connected", evidenceCount: 934 },
    { name: "SWIFT Network", status: "connected", evidenceCount: 456 },
    { name: "SAS Risk Engine", status: "connected", evidenceCount: 289 },
    { name: "Moody's Analytics", status: "connected", evidenceCount: 178 }
  ];

  const realtimeEvidenceData = [
    {
      id: "TXN-001",
      source: "Core Banking",
      type: "Transaction Log",
      category: "Processing Controls",
      description: "Daily transaction processing validation - $2.4M processed",
      controlId: "ISAE-CC6.1"
    },
    {
      id: "LN-045",
      source: "Loan System",
      type: "Approval Workflow",
      category: "Credit Controls",
      description: "Loan approval process - Credit committee decision log",
      controlId: "ISAE-CC7.2"
    },
    {
      id: "GL-892",
      source: "General Ledger",
      type: "Reconciliation",
      category: "Financial Controls",
      description: "Daily GL reconciliation - All accounts balanced",
      controlId: "ISAE-CC5.3"
    },
    {
      id: "PAY-334",
      source: "Payment System",
      type: "Settlement Record",
      category: "Operational Controls",
      description: "SWIFT payment settlement - $890K processed securely",
      controlId: "ISAE-CC8.1"
    },
    {
      id: "RSK-156",
      source: "Risk Engine",
      type: "Model Validation",
      category: "Risk Controls",
      description: "Credit risk model validation - Monte Carlo simulation",
      controlId: "ISAE-CC4.1"
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < demoSteps.length - 1) {
            return prev + 1;
          } else {
            setIsRunning(false);
            return prev;
          }
        });
        
        // Simulate evidence collection
        if (currentStep < realtimeEvidenceData.length) {
          const newEvidence = {
            ...realtimeEvidenceData[currentStep],
            timestamp: new Date(),
            status: Math.random() > 0.1 ? 'completed' : 'validating' as const
          };
          
          setEvidenceItems(prev => [newEvidence, ...prev.slice(0, 9)]);
        }
        
        // Update metrics
        setMetrics(prev => ({
          connections: Math.min(6, prev.connections + 1),
          evidenceItems: prev.evidenceItems + Math.floor(Math.random() * 15) + 5,
          completionRate: Math.min(100, prev.completionRate + Math.random() * 8),
          processingSpeed: 150 + Math.random() * 50
        }));
        
      }, 2000);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, currentStep]);

  const startDemo = () => {
    setIsRunning(true);
    setCurrentStep(0);
    setEvidenceItems([]);
    setMetrics({ connections: 0, evidenceItems: 0, completionRate: 0, processingSpeed: 0 });
  };

  const stopDemo = () => {
    setIsRunning(false);
  };

  const resetDemo = () => {
    setIsRunning(false);
    setCurrentStep(0);
    setEvidenceItems([]);
    setMetrics({ connections: 0, evidenceItems: 0, completionRate: 0, processingSpeed: 0 });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center mb-16">
            {/* Navigation Button */}
            <div className="flex justify-start mb-8">
              <button
                onClick={() => navigate('/velocity/solutions/isae-3000')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg font-medium border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                Back to ISAE 3000 Solutions
              </button>
            </div>
            
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium mb-6">
              <Database className="w-4 h-4" />
              Live Evidence Collection Demo
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 font-serif">
              Banking Evidence
              <span className="text-emerald-400"> Automation</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              Watch our AI agents collect, categorize, and validate ISAE 3000 evidence 
              from live banking systems in real-time.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isRunning ? (
                <button
                  onClick={startDemo}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Play className="w-5 h-5" />
                  Start Live Demo
                </button>
              ) : (
                <button
                  onClick={stopDemo}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Pause className="w-5 h-5" />
                  Stop Demo
                </button>
              )}
              
              <button
                onClick={resetDemo}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-medium border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <RefreshCw className="w-5 h-5" />
                Reset Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Metrics Dashboard */}
      <div className="py-16 bg-black/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 text-center">
              <div className="text-3xl font-bold text-emerald-400 mb-2">{metrics.connections}/6</div>
              <div className="text-white font-medium mb-1">System Connections</div>
              <div className="text-slate-400 text-sm">Banking Platforms</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">{metrics.evidenceItems.toLocaleString()}</div>
              <div className="text-white font-medium mb-1">Evidence Items</div>
              <div className="text-slate-400 text-sm">Collected Today</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 text-center">
              <div className="text-3xl font-bold text-amber-400 mb-2">{metrics.completionRate.toFixed(1)}%</div>
              <div className="text-white font-medium mb-1">Completion Rate</div>
              <div className="text-slate-400 text-sm">ISAE 3000 Coverage</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">{metrics.processingSpeed.toFixed(0)}</div>
              <div className="text-white font-medium mb-1">Processing Speed</div>
              <div className="text-slate-400 text-sm">Items/minute</div>
            </div>
          </div>

          {/* Demo Progress */}
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Collection Progress</h3>
              {isRunning && <Loader className="w-5 h-5 text-emerald-400 animate-spin" />}
            </div>
            <div className="space-y-3">
              {demoSteps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                    index <= currentStep
                      ? 'bg-emerald-500/10 border border-emerald-500/20'
                      : 'bg-white/5 border border-white/10'
                  }`}
                >
                  {index < currentStep ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  ) : index === currentStep && isRunning ? (
                    <Loader className="w-5 h-5 text-emerald-400 animate-spin" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-slate-600"></div>
                  )}
                  <span className={`${index <= currentStep ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Demo Content */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Banking Systems Status */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 font-serif flex items-center gap-2">
                <Server className="w-6 h-6 text-emerald-400" />
                Connected Banking Systems
              </h2>
              <div className="space-y-4">
                {bankingSystems.map((system, index) => (
                  <div key={index} className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                        <h3 className="font-medium text-white">{system.name}</h3>
                      </div>
                      <div className="text-right">
                        <div className="text-emerald-400 font-mono text-sm">{system.evidenceCount} items</div>
                        <div className="text-slate-400 text-xs">Connected</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Export Controls */}
              <div className="mt-6 bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <h3 className="font-medium text-white mb-3">Evidence Export</h3>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm hover:bg-emerald-500/30 transition-colors">
                    <Download className="w-4 h-4" />
                    Export to Excel
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm hover:bg-blue-500/30 transition-colors">
                    <FileText className="w-4 h-4" />
                    Generate Report
                  </button>
                </div>
              </div>
            </div>

            {/* Real-time Evidence Stream */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 font-serif flex items-center gap-2">
                <Activity className="w-6 h-6 text-blue-400" />
                Live Evidence Stream
              </h2>
              <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg border border-white/10 h-96 overflow-hidden">
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">Recent Collections</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                      <span className="text-emerald-400 text-sm">Live</span>
                    </div>
                  </div>
                </div>
                <div className="h-80 overflow-y-auto">
                  {evidenceItems.map((item, index) => (
                    <div
                      key={`${item.id}-${index}`}
                      className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors animate-fadeIn"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-white text-sm font-medium">{item.id}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          item.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                          item.status === 'validating' ? 'bg-amber-500/20 text-amber-400' :
                          item.status === 'collecting' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      <div className="text-slate-400 text-sm mb-1">{item.source} • {item.type}</div>
                      <div className="text-slate-300 text-sm mb-1">{item.description}</div>
                      <div className="text-blue-400 text-xs font-mono">{item.controlId}</div>
                    </div>
                  ))}
                  {evidenceItems.length === 0 && (
                    <div className="p-8 text-center text-slate-400">
                      <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Start the demo to see live evidence collection</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Demo Features */}
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <Zap className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Real-time Collection</h3>
              </div>
              <p className="text-slate-300 text-sm">
                Watch as evidence is collected from live banking systems automatically, 
                categorized by ISAE 3000 standards, and validated for audit readiness.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Shield className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Audit Trail</h3>
              </div>
              <p className="text-slate-300 text-sm">
                Every piece of evidence includes cryptographic verification, 
                timestamp validation, and complete audit trail for regulatory compliance.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Bot className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">AI Categorization</h3>
              </h3>
              <p className="text-slate-300 text-sm">
                Our AI automatically categorizes evidence by ISAE 3000 control categories 
                and prepares professional audit documentation packages.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center bg-gradient-to-r from-emerald-900/50 to-blue-900/50 rounded-2xl p-12 border border-emerald-500/20">
            <h2 className="text-3xl font-bold text-white mb-4 font-serif">
              Experience the Future of ISAE 3000 Audits
            </h2>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
              This demo shows a fraction of our capabilities. Schedule a personalized demo 
              with your actual banking systems and see the full power of automation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/velocity/contact')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Users className="w-5 h-5" />
                Schedule Banking Demo
              </button>
              
              <button
                onClick={() => navigate('/velocity/industries/banking-isae')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-medium border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <Building className="w-5 h-5" />
                Banking Specialization
              </button>
            </div>
            
            <p className="text-sm text-slate-400 mt-6">
              Demo environment • Safe sandbox • No production data • Full security compliance
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvidenceAutomation;