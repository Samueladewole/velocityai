import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PublicHeader } from '../../components/common/PublicHeader';
import CaseStudies from '../../components/resources/CaseStudies';
import BlogContent from '../../components/resources/BlogContent';

// Cookie Banner Component
const CookieBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: true,
    marketing: false,
    functional: true
  });

  useEffect(() => {
    const cookieConsent = localStorage.getItem('velocity-cookie-consent');
    if (!cookieConsent) {
      setShowBanner(true);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem('velocity-cookie-consent', JSON.stringify({
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
      timestamp: Date.now()
    }));
    setShowBanner(false);
  };

  const savePreferences = () => {
    localStorage.setItem('velocity-cookie-consent', JSON.stringify({
      ...preferences,
      timestamp: Date.now()
    }));
    setShowBanner(false);
    setShowPreferences(false);
  };

  const rejectAll = () => {
    localStorage.setItem('velocity-cookie-consent', JSON.stringify({
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
      timestamp: Date.now()
    }));
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Main Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-t border-slate-700 p-4 z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-white font-medium mb-2">We value your privacy</h3>
            <p className="text-slate-300 text-sm">
              We use cookies to enhance your experience, analyze site usage, and provide personalized content. 
              By continuing to browse, you consent to our use of cookies.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowPreferences(true)}
              className="px-4 py-2 text-slate-300 border border-slate-600 rounded-lg hover:bg-slate-800 transition-colors text-sm"
            >
              Preferences
            </button>
            <button
              onClick={rejectAll}
              className="px-4 py-2 text-slate-300 border border-slate-600 rounded-lg hover:bg-slate-800 transition-colors text-sm"
            >
              Reject All
            </button>
            <button
              onClick={acceptAll}
              className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm font-medium"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>

      {/* Preferences Modal */}
      {showPreferences && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white mb-2">Cookie Preferences</h2>
              <p className="text-slate-300 text-sm">
                Customize your cookie settings. Some cookies are essential for basic site functionality.
              </p>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Necessary Cookies */}
              <div className="flex justify-between items-start">
                <div className="flex-1 mr-4">
                  <h3 className="text-white font-medium mb-1">Necessary Cookies</h3>
                  <p className="text-slate-400 text-sm">
                    Essential for basic website functionality, security, and remembering your preferences.
                  </p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={true}
                    disabled
                    className="w-4 h-4 text-emerald-500 bg-slate-700 border-slate-600 rounded focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="flex justify-between items-start">
                <div className="flex-1 mr-4">
                  <h3 className="text-white font-medium mb-1">Analytics Cookies</h3>
                  <p className="text-slate-400 text-sm">
                    Help us understand how visitors interact with our website to improve user experience.
                  </p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences({...preferences, analytics: e.target.checked})}
                    className="w-4 h-4 text-emerald-500 bg-slate-700 border-slate-600 rounded focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Marketing Cookies */}
              <div className="flex justify-between items-start">
                <div className="flex-1 mr-4">
                  <h3 className="text-white font-medium mb-1">Marketing Cookies</h3>
                  <p className="text-slate-400 text-sm">
                    Used to track visitors across websites to display relevant advertisements.
                  </p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) => setPreferences({...preferences, marketing: e.target.checked})}
                    className="w-4 h-4 text-emerald-500 bg-slate-700 border-slate-600 rounded focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Functional Cookies */}
              <div className="flex justify-between items-start">
                <div className="flex-1 mr-4">
                  <h3 className="text-white font-medium mb-1">Functional Cookies</h3>
                  <p className="text-slate-400 text-sm">
                    Enable enhanced functionality like live chat, social media integration, and personalization.
                  </p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.functional}
                    onChange={(e) => setPreferences({...preferences, functional: e.target.checked})}
                    className="w-4 h-4 text-emerald-500 bg-slate-700 border-slate-600 rounded focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-700 flex justify-end gap-3">
              <button
                onClick={() => setShowPreferences(false)}
                className="px-4 py-2 text-slate-300 border border-slate-600 rounded-lg hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={savePreferences}
                className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Tab Interface Component
const TabInterface: React.FC<{
  activeTab: string;
  onTabChange: (tab: string) => void;
}> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'guides', label: 'Compliance Guides', icon: '📚', count: 7 },
    { id: 'case-studies', label: 'Case Studies', icon: '📊', count: 5 },
    { id: 'blog', label: 'Blog & Insights', icon: '📝', count: 12 },
    { id: 'tools', label: 'AI Tools', icon: '🤖', count: 10 },
  ];

  return (
    <div className="border-b border-slate-700 mb-8">
      <nav className="flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
              activeTab === tab.id
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-600'
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span>{tab.label}</span>
            <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded-full text-xs">
              {tab.count}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
};

// Search and Filter Component
const SearchFilter: React.FC<{
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
}> = ({ searchTerm, onSearchChange, selectedCategory, onCategoryChange, categories }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <div className="flex-1">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
      </div>
      <div className="md:w-64">
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="block w-full px-3 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

// Main Resource Center Component
const ResourceCenter: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('guides');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = [
    'Security & Compliance',
    'AI & Automation',
    'Risk Management',
    'Audit & Governance',
    'Data Privacy',
    'Financial Services',
    'Healthcare',
    'Technology'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <PublicHeader />
      <CookieBanner />
      
      {/* Header */}
      <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700 pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate('/velocity')}
              className="text-slate-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </button>
            <button
              onClick={() => navigate('/velocity/dashboard')}
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium"
            >
              Go to Dashboard
            </button>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white font-serif mb-4">
              Velocity AI Resource Center
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Comprehensive guides, case studies, and insights to accelerate your compliance journey with AI automation
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <TabInterface activeTab={activeTab} onTabChange={setActiveTab} />
        
        <SearchFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories}
        />

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === 'guides' && <ComplianceGuides searchTerm={searchTerm} selectedCategory={selectedCategory} />}
          {activeTab === 'case-studies' && <CaseStudiesWrapper searchTerm={searchTerm} selectedCategory={selectedCategory} />}
          {activeTab === 'blog' && <BlogContentWrapper searchTerm={searchTerm} selectedCategory={selectedCategory} />}
          {activeTab === 'tools' && <AITools searchTerm={searchTerm} selectedCategory={selectedCategory} />}
        </div>
      </div>
    </div>
  );
};

// Compliance Guides Component
const ComplianceGuides: React.FC<{ searchTerm: string; selectedCategory: string }> = ({ searchTerm, selectedCategory }) => {
  const guides = [
    {
      id: 'soc2',
      title: 'SOC 2 Type II Compliance Guide',
      description: 'Complete automation framework for SOC 2 compliance with Velocity\'s 10 AI agents',
      category: 'Security & Compliance',
      readTime: '15 min',
      difficulty: 'Intermediate',
      agentCount: 10,
      automationRate: '95%',
      icon: '🛡️',
      color: 'emerald'
    },
    {
      id: 'gdpr-compliance',
      title: 'GDPR International Transfer Solutions',
      description: 'AI-powered cross-border transfer compliance with Transfer Impact Assessments and post-Schrems II automation',
      category: 'Data Privacy',
      readTime: '14 min',
      difficulty: 'Advanced',
      agentCount: 12,
      automationRate: '94%',
      icon: '🌍',
      color: 'blue'
    },
    {
      id: 'iso27001',
      title: 'ISO 27001 Implementation',
      description: 'Systematic approach to ISO 27001 certification with intelligent evidence collection',
      category: 'Security & Compliance',
      readTime: '18 min',
      difficulty: 'Advanced',
      agentCount: 10,
      automationRate: '92%',
      icon: '📋',
      color: 'purple'
    },
    {
      id: 'pci-dss',
      title: 'PCI DSS Automation',
      description: 'Payment card industry compliance made simple with continuous monitoring',
      category: 'Financial Services',
      readTime: '10 min',
      difficulty: 'Intermediate',
      agentCount: 7,
      automationRate: '89%',
      icon: '💳',
      color: 'amber'
    },
    {
      id: 'hipaa',
      title: 'HIPAA Compliance Framework',
      description: 'Healthcare compliance automation with PHI protection and audit trails',
      category: 'Healthcare',
      readTime: '14 min',
      difficulty: 'Advanced',
      agentCount: 9,
      automationRate: '91%',
      icon: '🏥',
      color: 'red'
    },
    {
      id: 'iso42001',
      title: 'ISO 42001 AI Management',
      description: 'AI management system standard compliance with governance automation',
      category: 'AI & Automation',
      readTime: '16 min',
      difficulty: 'Expert',
      agentCount: 10,
      automationRate: '94%',
      icon: '🤖',
      color: 'green'
    },
    {
      id: 'dora-nis2',
      title: 'DORA & NIS2 EU Compliance',
      description: 'European digital resilience and network security compliance automation',
      category: 'Risk Management',
      readTime: '20 min',
      difficulty: 'Expert',
      agentCount: 10,
      automationRate: '93%',
      icon: '🇪🇺',
      color: 'indigo'
    }
  ];

  const filteredGuides = guides.filter(guide => {
    const matchesSearch = guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guide.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || guide.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const colorClasses = {
    emerald: 'border-emerald-500/30 bg-emerald-500/5',
    blue: 'border-blue-500/30 bg-blue-500/5',
    purple: 'border-purple-500/30 bg-purple-500/5',
    amber: 'border-amber-500/30 bg-amber-500/5',
    red: 'border-red-500/30 bg-red-500/5',
    green: 'border-green-500/30 bg-green-500/5',
    indigo: 'border-indigo-500/30 bg-indigo-500/5'
  };

  const difficultyColors = {
    'Beginner': 'text-green-400 bg-green-400/10',
    'Intermediate': 'text-amber-400 bg-amber-400/10',
    'Advanced': 'text-red-400 bg-red-400/10',
    'Expert': 'text-purple-400 bg-purple-400/10'
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredGuides.map((guide) => (
        <div
          key={guide.id}
          className={`bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border hover:border-emerald-500/50 transition-all duration-300 cursor-pointer transform hover:scale-105 ${colorClasses[guide.color as keyof typeof colorClasses]}`}
          onClick={() => navigate(`/velocity/resources/guides/${guide.id}`)}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="text-3xl">{guide.icon}</div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[guide.difficulty as keyof typeof difficultyColors]}`}>
              {guide.difficulty}
            </span>
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2">{guide.title}</h3>
          <p className="text-slate-300 text-sm mb-4 line-clamp-2">{guide.description}</p>
          
          <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
            <span>{guide.readTime} read</span>
            <span className="text-emerald-400">{guide.category}</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">AI Agents</span>
              <span className="text-white font-medium">{guide.agentCount}/10</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Automation Rate</span>
              <span className="text-emerald-400 font-medium">{guide.automationRate}</span>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-slate-700">
            <button className="text-emerald-400 text-sm font-medium hover:text-emerald-300 transition-colors">
              Read Guide →
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// Case Studies Component wrapper 
const CaseStudiesWrapper: React.FC<{ searchTerm: string; selectedCategory: string }> = ({ searchTerm, selectedCategory }) => {
  return <CaseStudies searchTerm={searchTerm} selectedCategory={selectedCategory} />;
};

// Blog Content Component wrapper
const BlogContentWrapper: React.FC<{ searchTerm: string; selectedCategory: string }> = ({ searchTerm, selectedCategory }) => {
  return <BlogContent searchTerm={searchTerm} selectedCategory={selectedCategory} />;
};

// AI Tools Component
const AITools: React.FC<{ searchTerm: string; selectedCategory: string }> = ({ searchTerm, selectedCategory }) => {
  const navigate = useNavigate();
  
  const tools = [
    {
      id: 'interactive-demos',
      title: 'Interactive Compliance Demos',
      description: 'Experience Velocity\'s AI-powered compliance automation through realistic industry scenarios',
      category: 'AI & Automation',
      duration: '15-30 min',
      scenarios: 6,
      icon: '🎮',
      color: 'emerald',
      featured: true
    },
    {
      id: 'roi-calculator',
      title: 'Banking ROI Calculator',
      description: 'Calculate cost savings and efficiency gains for banking compliance automation',
      category: 'Financial Services',
      duration: '5 min',
      scenarios: 1,
      icon: '💰',
      color: 'blue'
    },
    {
      id: 'trust-score',
      title: 'Trust Score Engine',
      description: 'Real-time compliance scoring and risk assessment visualization',
      category: 'Risk Management',
      duration: '10 min',
      scenarios: 1,
      icon: '📊',
      color: 'purple'
    },
    {
      id: 'evidence-collector',
      title: 'Evidence Collection Preview',
      description: 'See how AI agents automatically collect compliance evidence from your systems',
      category: 'AI & Automation',
      duration: '8 min',
      scenarios: 1,
      icon: '🔍',
      color: 'amber'
    }
  ];

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const colorClasses = {
    emerald: 'border-emerald-500/30 bg-emerald-500/5',
    blue: 'border-blue-500/30 bg-blue-500/5',
    purple: 'border-purple-500/30 bg-purple-500/5',
    amber: 'border-amber-500/30 bg-amber-500/5'
  };

  const handleToolClick = (toolId: string) => {
    switch (toolId) {
      case 'interactive-demos':
        navigate('/velocity/demo');
        break;
      case 'roi-calculator':
        navigate('/calculators/banking-roi');
        break;
      case 'trust-score':
        navigate('/platform/trust-score');
        break;
      case 'evidence-collector':
        navigate('/platform/evidence-collection');
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">AI Tools & Interactive Experiences</h3>
        <p className="text-slate-400">Hands-on tools to explore Velocity's AI-powered compliance capabilities</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        {filteredTools.map((tool) => (
          <div
            key={tool.id}
            className={`bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border hover:border-emerald-500/50 transition-all duration-300 cursor-pointer transform hover:scale-105 relative ${colorClasses[tool.color as keyof typeof colorClasses]}`}
            onClick={() => handleToolClick(tool.id)}
          >
            {tool.featured && (
              <div className="absolute -top-2 -right-2">
                <span className="bg-emerald-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  Featured
                </span>
              </div>
            )}
            
            <div className="flex items-start justify-between mb-4">
              <div className="text-3xl">{tool.icon}</div>
              <div className="text-right">
                <div className="text-emerald-400 text-sm font-medium">{tool.duration}</div>
                <div className="text-slate-500 text-xs">{tool.scenarios} scenario{tool.scenarios > 1 ? 's' : ''}</div>
              </div>
            </div>
            
            <h4 className="text-xl font-bold text-white mb-2">{tool.title}</h4>
            <p className="text-slate-300 text-sm mb-4">{tool.description}</p>
            
            <div className="flex items-center justify-between">
              <span className="text-emerald-400 text-sm">{tool.category}</span>
              <button className="text-emerald-400 text-sm font-medium hover:text-emerald-300 transition-colors">
                Try Tool →
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {filteredTools.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-white mb-2">No tools found</h3>
          <p className="text-slate-400">Try adjusting your search or category filter.</p>
        </div>
      )}
    </div>
  );
};

export default ResourceCenter;