import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Globe, 
  MessageSquare, 
  Bookmark,
  Twitter, 
  Linkedin, 
  Github,
  Mail,
  Shield,
  Award,
  FileText,
  HelpCircle,
  Users,
  Briefcase,
  BookOpen,
  Lock,
  Bot,
  Database,
  BarChart3,
  Home
} from 'lucide-react';

const VelocityFooter: React.FC = () => {
  const navigate = useNavigate();
  
  // Check if we're in subdomain mode or main app
  const isSubdomain = window.location.hostname.includes('velocity.') || 
                     (window.location.hostname === 'localhost' && window.location.pathname.startsWith('/velocity'));
  const routePrefix = isSubdomain ? '' : '/velocity';
  
  return (
    <footer className="relative bg-slate-900/50 backdrop-blur-xl border-t border-slate-800/50 mt-16">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital,wght@0,400;0,700;1,400&family=Manrope:wght@300;400;500;600;700&display=swap');
        
        .font-serif {
          font-family: 'Instrument Serif', serif;
        }
        
        .font-sans {
          font-family: 'Manrope', sans-serif;
        }
      `}</style>
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-amber-400 rounded-lg"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-amber-400 rounded-lg blur-sm opacity-50"></div>
              </div>
              <span className="text-xl font-bold text-white font-serif">Velocity</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              AI-powered compliance automation for modern security teams.
            </p>
            <div className="flex items-center gap-4">
              <button className="text-slate-400 hover:text-emerald-400 transition-colors">
                <Globe className="w-5 h-5" />
              </button>
              <button className="text-slate-400 hover:text-emerald-400 transition-colors">
                <MessageSquare className="w-5 h-5" />
              </button>
              <button className="text-slate-400 hover:text-emerald-400 transition-colors">
                <Bookmark className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Product */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <div className="space-y-3">
              {[
                { label: 'Features', path: `${routePrefix}/features`, icon: Bot },
                { label: 'Integrations', path: `${routePrefix}/integrations`, icon: Globe },
                { label: 'Security', path: `${routePrefix}/security`, icon: Shield },
                { label: 'Pricing', path: `${routePrefix}/pricing`, icon: BarChart3 }
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Solutions */}
          <div>
            <h3 className="text-white font-semibold mb-4">Solutions</h3>
            <div className="space-y-3">
              {[
                { label: 'SOC 2', path: `${routePrefix}/solutions/soc2`, icon: Shield },
                { label: 'ISO 27001', path: `${routePrefix}/solutions/iso27001`, icon: Award },
                { label: 'GDPR', path: `${routePrefix}/solutions/gdpr`, icon: Lock },
                { label: 'HIPAA', path: `${routePrefix}/solutions/hipaa`, icon: FileText }
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <div className="space-y-3">
              {[
                { label: 'About', path: `${routePrefix}/about`, icon: Users },
                { label: 'Careers', path: `${routePrefix}/careers`, icon: Briefcase },
                { label: 'Contact', path: `${routePrefix}/contact`, icon: Mail },
                { label: 'Privacy', path: `${routePrefix}/privacy`, icon: Lock }
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <hr className="border-slate-800/50 my-8" />
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} Velocity. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-slate-500">Enterprise-grade security</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-slate-400">All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default VelocityFooter;