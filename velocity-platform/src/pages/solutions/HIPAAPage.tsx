import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Heart,
  Database,
  Bot,
  Eye,
  Lock,
  CheckCircle,
  ArrowRight,
  Trophy,
  Clock,
  Activity
} from 'lucide-react';

const HIPAAPage: React.FC = () => {
  const navigate = useNavigate();

  const agents = [
    { name: "PHI Guardian", task: "Monitors and protects all Protected Health Information", automation: "96%" },
    { name: "Access Controller", task: "Manages minimum necessary access to patient data", automation: "98%" },
    { name: "Audit Trail Monitor", task: "Tracks all PHI access and generates audit logs", automation: "99%" },
    { name: "Breach Detector", task: "Identifies potential PHI breaches and automates reporting", automation: "97%" }
  ];

  const benefits = [
    "45-day HIPAA compliance for healthcare organizations",
    "Automated PHI discovery and classification",
    "Real-time access controls and audit logging",
    "Business Associate Agreement (BAA) automation",
    "Continuous monitoring of patient data protection",
    "OCR audit readiness with complete documentation"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-orange-900">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 rounded-full text-orange-400 text-sm font-medium mb-6">
            <Heart className="w-4 h-4" />
            HIPAA Healthcare Automation
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 font-serif">
            HIPAA Compliant
            <span className="text-orange-400"> Healthcare</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            Protect patient data with AI agents that automate PHI discovery, access controls, 
            and continuous compliance monitoring for healthcare organizations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-16 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">🏥 Healthcare AI Agents</h2>
            <div className="space-y-4">
              {agents.map((agent, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
                  <Heart className="w-5 h-5 text-orange-400" />
                  <div>
                    <h3 className="font-semibold text-white">{agent.name}</h3>
                    <p className="text-slate-400 text-sm">{agent.task}</p>
                  </div>
                  <span className="text-orange-400 font-mono text-sm ml-auto">{agent.automation}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-white mb-6">🔒 Patient Protection</h2>
            <div className="space-y-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-orange-400 mt-0.5" />
                  <span className="text-slate-300">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center bg-orange-900/30 rounded-2xl p-12 border border-orange-500/20">
          <h2 className="text-3xl font-bold text-white mb-4">Ready for HIPAA Automation?</h2>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/velocity/assessment')}
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium hover:from-orange-600 hover:to-orange-700"
            >
              Start Healthcare Assessment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HIPAAPage;