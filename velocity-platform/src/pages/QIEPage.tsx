import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Bot,
  Zap,
  CheckCircle,
  ArrowRight,
  Clock,
  TrendingUp,
  Brain,
  Target,
  BarChart3
} from 'lucide-react';

const QIEPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          {/* Navigation Button */}
          <div className="flex justify-start mb-8">
            <button
              onClick={() => navigate('/velocity/dashboard')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg font-medium border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <BarChart3 className="w-4 h-4" />
              Back to Dashboard
            </button>
          </div>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full text-purple-400 text-sm font-medium mb-6">
            <Brain className="w-4 h-4" />
            Questionnaire Intelligence Engine
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 font-serif">
            QIE Intelligence
            <span className="text-purple-400"> Engine</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            Transform questionnaire responses from weeks to minutes with AI. Our QIE agent 
            processes compliance questionnaires with 96.7% accuracy across all frameworks.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-16 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">🧠 AI-Powered Processing</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
                <FileText className="w-5 h-5 text-purple-400" />
                <div>
                  <h3 className="font-semibold text-white">Multi-Framework Support</h3>
                  <p className="text-slate-400 text-sm">SOC 2, ISO 27001, GDPR, HIPAA questionnaires</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
                <Bot className="w-5 h-5 text-purple-400" />
                <div>
                  <h3 className="font-semibold text-white">Intelligent Responses</h3>
                  <p className="text-slate-400 text-sm">Context-aware answers based on your evidence</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
                <Zap className="w-5 h-5 text-purple-400" />
                <div>
                  <h3 className="font-semibold text-white">Instant Processing</h3>
                  <p className="text-slate-400 text-sm">Same-day questionnaire completion</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-white mb-6">📊 Results & Benefits</h2>
            <div className="space-y-6">
              <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <div className="text-3xl font-bold text-purple-400 mb-1">96.7%</div>
                <div className="text-white font-medium">Response Accuracy</div>
                <div className="text-purple-200 text-sm">AI validation with evidence backing</div>
              </div>
              <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <div className="text-3xl font-bold text-blue-400 mb-1">95%</div>
                <div className="text-white font-medium">Time Reduction</div>
                <div className="text-blue-200 text-sm">From weeks to same-day completion</div>
              </div>
              <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                <div className="text-3xl font-bold text-emerald-400 mb-1">100%</div>
                <div className="text-white font-medium">Evidence Backing</div>
                <div className="text-emerald-200 text-sm">Every answer supported by evidence</div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center bg-purple-900/30 rounded-2xl p-12 border border-purple-500/20">
          <h2 className="text-3xl font-bold text-white mb-4">Ready for QIE Intelligence?</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Transform your questionnaire process with AI automation. Never spend weeks 
            on compliance questionnaires again.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/velocity/assessment')}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-medium hover:from-purple-600 hover:to-purple-700"
            >
              Try QIE Intelligence
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QIEPage;