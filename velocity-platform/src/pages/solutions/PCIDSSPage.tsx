import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  CreditCard,
  Database,
  Bot,
  Eye,
  Lock,
  CheckCircle,
  ArrowRight,
  Trophy,
  Clock,
  Server,
  AlertTriangle,
  DollarSign
} from 'lucide-react';

const PCIDSSPage: React.FC = () => {
  const navigate = useNavigate();

  const agents = [
    { 
      name: "Payment Data Guardian", 
      task: "Monitors and protects cardholder data across all systems and networks",
      automation: "98%",
      icon: CreditCard
    },
    { 
      name: "Network Security Monitor", 
      task: "Validates firewall configurations and network segmentation requirements",
      automation: "97%", 
      icon: Shield
    },
    { 
      name: "Access Control Enforcer", 
      task: "Manages access controls and authentication for cardholder data systems",
      automation: "95%",
      icon: Lock
    },
    { 
      name: "Vulnerability Scanner", 
      task: "Continuous scanning and remediation of security vulnerabilities",
      automation: "99%",
      icon: AlertTriangle
    }
  ];

  const benefits = [
    "60-day PCI DSS compliance for payment processors",
    "Automated cardholder data discovery and classification",
    "Real-time network security monitoring and validation",
    "Continuous vulnerability scanning and remediation",
    "Automated compliance reporting for QSA assessments",
    "90% reduction in compliance audit preparation time"
  ];

  const stats = [
    { label: "Implementation", value: "60 days", description: "PCI DSS compliance" },
    { label: "Requirements", value: "12", description: "automatically validated" },
    { label: "Controls", value: "375+", description: "sub-requirements covered" },
    { label: "Cost Savings", value: "85%", description: "vs manual compliance" }
  ];

  const pciRequirements = [
    { req: "Req 1", title: "Install and maintain a firewall", coverage: "98%" },
    { req: "Req 2", title: "Do not use vendor-supplied system passwords", coverage: "97%" },
    { req: "Req 3", title: "Protect stored cardholder data", coverage: "99%" },
    { req: "Req 4", title: "Encrypt transmission of cardholder data", coverage: "96%" },
    { req: "Req 5", title: "Protect all systems against malware", coverage: "94%" },
    { req: "Req 6", title: "Develop secure systems and applications", coverage: "92%" },
    { req: "Req 7", title: "Restrict access by business need-to-know", coverage: "95%" },
    { req: "Req 8", title: "Identify and authenticate access", coverage: "97%" },
    { req: "Req 9", title: "Restrict physical access to cardholder data", coverage: "93%" },
    { req: "Req 10", title: "Track and monitor access to network resources", coverage: "98%" },
    { req: "Req 11", title: "Regularly test security systems", coverage: "96%" },
    { req: "Req 12", title: "Maintain information security policy", coverage: "94%" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-red-900">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 rounded-full text-red-400 text-sm font-medium mb-6">
              <CreditCard className="w-4 h-4" />
              PCI DSS Payment Security Automation
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 font-serif">
              PCI DSS Compliant
              <span className="text-red-400"> Payment Security</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              Automate payment card industry compliance with AI agents that secure cardholder data, 
              monitor networks, and maintain continuous PCI DSS validation across your entire payment ecosystem.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/velocity/assessment')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <DollarSign className="w-5 h-5" />
                Start PCI DSS Automation
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => navigate('/velocity/demo')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-medium border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <Bot className="w-5 h-5" />
                View Payment Security Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-black/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-red-400 mb-2">{stat.value}</div>
                <div className="text-white font-medium mb-1">{stat.label}</div>
                <div className="text-slate-400 text-sm">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 mb-20">
            {/* AI Agents */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-6 font-serif">
                💳 Payment Security AI Agents
              </h2>
              <p className="text-slate-300 mb-8">
                Our specialized AI agents protect cardholder data and maintain continuous 
                PCI DSS compliance across your entire payment processing infrastructure.
              </p>
              <div className="space-y-6">
                {agents.map((agent, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                    <div className="p-2 bg-red-500/20 rounded-lg">
                      <agent.icon className="w-5 h-5 text-red-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-white">{agent.name}</h3>
                        <span className="text-red-400 font-mono text-sm">{agent.automation}</span>
                      </div>
                      <p className="text-slate-400 text-sm">{agent.task}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Benefits */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-6 font-serif">
                🛡️ Payment Security Benefits
              </h2>
              <p className="text-slate-300 mb-8">
                Achieve and maintain PCI DSS compliance with automated cardholder data protection, 
                network security, and continuous monitoring.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-6 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="flex items-center gap-2 text-red-400 mb-2">
                  <Shield className="w-5 h-5" />
                  <span className="font-semibold">Payment Brand Approved</span>
                </div>
                <p className="text-red-100 text-sm">
                  Our PCI DSS automation meets all major payment brand requirements 
                  (Visa, Mastercard, American Express, Discover) for Level 1-4 merchants.
                </p>
              </div>
            </div>
          </div>
          
          {/* PCI DSS Requirements Coverage */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4 font-serif">
                Complete PCI DSS Requirements Coverage
              </h2>
              <p className="text-slate-300 max-w-2xl mx-auto">
                All 12 PCI DSS requirements and 375+ sub-requirements automatically 
                validated and monitored by our AI agents.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pciRequirements.map((requirement, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-red-400 font-mono text-sm font-medium">{requirement.req}</div>
                    <div className="text-red-400 font-bold">{requirement.coverage}</div>
                  </div>
                  <h3 className="font-medium text-white text-sm mb-2 leading-tight">
                    {requirement.title}
                  </h3>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: requirement.coverage }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-4 px-6 py-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <Trophy className="w-6 h-6 text-red-400" />
                <div className="text-left">
                  <div className="font-semibold text-white">96.2% Average Coverage</div>
                  <div className="text-red-200 text-sm">Across all 12 PCI DSS requirements</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Merchant Level Support */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4 font-serif">
                All PCI DSS Merchant Levels Supported
              </h2>
              <p className="text-slate-300 max-w-2xl mx-auto">
                From small businesses to enterprise payment processors, 
                our AI automation scales to meet any merchant level requirements.
              </p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { level: "Level 1", transactions: "6M+ annually", validation: "Annual on-site assessment", complexity: "High" },
                { level: "Level 2", transactions: "1M-6M annually", validation: "Annual self-assessment", complexity: "Medium" },
                { level: "Level 3", transactions: "20K-1M annually", validation: "Annual self-assessment", complexity: "Medium" },
                { level: "Level 4", transactions: "Under 20K annually", validation: "Annual self-assessment", complexity: "Low" }
              ].map((level, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 text-center">
                  <div className="text-red-400 font-bold text-xl mb-2">{level.level}</div>
                  <div className="text-white font-medium mb-2">{level.transactions}</div>
                  <div className="text-slate-400 text-sm mb-3">{level.validation}</div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium €{
                    level.complexity === 'High' ? 'bg-red-500/20 text-red-400' :
                    level.complexity === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {level.complexity} Complexity
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-red-900/50 to-orange-900/50 rounded-2xl p-12 border border-red-500/20">
            <h2 className="text-3xl font-bold text-white mb-4 font-serif">
              Ready to Secure Your Payment Processing?
            </h2>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
              Transform your PCI DSS compliance with AI automation. Protect cardholder data 
              and maintain continuous compliance across all payment systems.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/velocity/assessment')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Clock className="w-5 h-5" />
                Start PCI Assessment
              </button>
              
              <button
                onClick={() => navigate('/velocity/demo')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-medium border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <Server className="w-5 h-5" />
                Schedule Payment Security Demo
              </button>
            </div>
            
            <p className="text-sm text-slate-400 mt-6">
              QSA approved methodology • All merchant levels supported • Payment brand compliant
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PCIDSSPage;