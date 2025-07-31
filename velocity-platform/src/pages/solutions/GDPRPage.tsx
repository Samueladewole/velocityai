import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Users,
  Database,
  Bot,
  Eye,
  Lock,
  CheckCircle,
  ArrowRight,
  Trophy,
  Clock,
  Euro,
  Globe
} from 'lucide-react';

const GDPRPage: React.FC = () => {
  const navigate = useNavigate();

  const agents = [
    { name: "Privacy Data Mapper", task: "Maps personal data flows and processing activities", automation: "94%" },
    { name: "Consent Manager", task: "Tracks and validates consent across all touchpoints", automation: "97%" },
    { name: "Rights Fulfillment", task: "Automates subject access requests and data portability", automation: "92%" },
    { name: "Breach Detection", task: "Monitors data breaches and automates 72-hour reporting", automation: "99%" }
  ];

  const benefits = [
    "30-day GDPR compliance implementation",
    "Automated data mapping and privacy impact assessments",
    "Real-time consent management and tracking",
    "Automated subject rights fulfillment (SAR, erasure, portability)",
    "Continuous monitoring for data processing compliance",
    "€20M fine protection with audit-ready documentation"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full text-purple-400 text-sm font-medium mb-6">
            <Euro className="w-4 h-4" />
            GDPR Privacy Automation
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 font-serif">
            GDPR Compliant
            <span className="text-purple-400"> in 30 Days</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            Automate privacy by design with AI agents that handle data mapping, consent management, 
            and subject rights fulfillment across your entire organization.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-16 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">🔒 Privacy AI Agents</h2>
            <div className="space-y-4">
              {agents.map((agent, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
                  <Users className="w-5 h-5 text-purple-400" />
                  <div>
                    <h3 className="font-semibold text-white">{agent.name}</h3>
                    <p className="text-slate-400 text-sm">{agent.task}</p>
                  </div>
                  <span className="text-purple-400 font-mono text-sm ml-auto">{agent.automation}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-white mb-6">🛡️ Privacy Benefits</h2>
            <div className="space-y-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-purple-400 mt-0.5" />
                  <span className="text-slate-300">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center bg-purple-900/30 rounded-2xl p-12 border border-purple-500/20">
          <h2 className="text-3xl font-bold text-white mb-4">Ready for GDPR Automation?</h2>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/velocity/assessment')}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-medium hover:from-purple-600 hover:to-purple-700"
            >
              Start Privacy Assessment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GDPRPage;