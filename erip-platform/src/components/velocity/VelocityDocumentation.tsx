/**
 * Velocity AI Documentation and Customer Success Center
 * Comprehensive guides, tutorials, and help resources
 */

import React, { useState } from 'react';
import { 
  Search,
  BookOpen,
  Video,
  HelpCircle,
  MessageSquare,
  Zap,
  Bot,
  Shield,
  Cloud,
  Target,
  Clock,
  CheckCircle,
  ArrowRight,
  ExternalLink,
  Download,
  Play,
  Users,
  Lightbulb,
  Settings,
  AlertCircle,
  Star,
  ThumbsUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DocSection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  articles: Article[];
}

interface Article {
  id: string;
  title: string;
  description: string;
  readTime: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  type: 'guide' | 'tutorial' | 'reference' | 'video' | 'faq';
  tags: string[];
  popular: boolean;
  content?: string;
}

interface Tutorial {
  id: string;
  title: string;
  description: string;
  duration: number;
  steps: number;
  difficulty: string;
  thumbnail: string;
  completed?: boolean;
}

const VelocityDocumentation: React.FC = () => {
  const [activeSection, setActiveSection] = useState('getting-started');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const docSections: DocSection[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      description: 'Quick setup and initial configuration',
      icon: <Zap className="w-5 h-5" />,
      articles: [
        {
          id: 'quick-start',
          title: '5-Minute Quick Start Guide',
          description: 'Get up and running with Velocity AI in just 5 minutes',
          readTime: 5,
          difficulty: 'beginner',
          type: 'guide',
          tags: ['setup', 'quickstart', 'beginner'],
          popular: true,
          content: `# 5-Minute Quick Start Guide

## Welcome to Velocity AI! 🚀

This guide will have you up and running with automated compliance monitoring in just 5 minutes.

### Step 1: Connect Your First Platform (2 minutes)
1. Navigate to **Velocity AI** → **AI Agents** in the sidebar
2. Click **"Add Agent"** 
3. Select your primary cloud platform (AWS, GCP, Azure, or GitHub)
4. Enter your credentials securely
5. Click **"Test Connection"** to verify

### Step 2: Choose Your Framework (1 minute)
1. Select your compliance framework:
   - **SOC 2** for service organizations
   - **ISO 27001** for international compliance
   - **GDPR** for data protection
   - **CIS Controls** for cybersecurity
2. Velocity will automatically configure relevant controls

### Step 3: Deploy Your First Agent (2 minutes)
1. Review the auto-generated agent configuration
2. Click **"Deploy Agent"**
3. Watch as your agent starts collecting evidence automatically
4. Your initial Trust Score will appear within minutes!

### 🎉 You're Done!
Your Velocity AI platform is now actively monitoring your infrastructure and collecting compliance evidence 24/7.

### Next Steps
- Visit the **Live Dashboard** to see real-time monitoring
- Explore **Evidence Review** to see collected compliance artifacts
- Use **Agent Creator** to build custom monitoring agents

Need help? Check out our [detailed setup guide](#detailed-setup) or [contact support](#support).`
        },
        {
          id: 'detailed-setup',
          title: 'Detailed Setup Guide',
          description: 'Comprehensive walkthrough of all Velocity features',
          readTime: 15,
          difficulty: 'beginner',
          type: 'guide',
          tags: ['setup', 'comprehensive', 'features'],
          popular: true
        },
        {
          id: 'platform-connections',
          title: 'Connecting Cloud Platforms',
          description: 'Step-by-step guides for AWS, GCP, Azure, and GitHub',
          readTime: 12,
          difficulty: 'intermediate',
          type: 'tutorial',
          tags: ['aws', 'gcp', 'azure', 'github', 'connections'],
          popular: false
        }
      ]
    },
    {
      id: 'ai-agents',
      title: 'AI Agents',
      description: 'Managing and customizing your AI agents',
      icon: <Bot className="w-5 h-5" />,
      articles: [
        {
          id: 'agent-overview',
          title: 'Understanding AI Agents',
          description: 'How Velocity AI agents work and what they monitor',
          readTime: 8,
          difficulty: 'beginner',
          type: 'guide',
          tags: ['agents', 'overview', 'monitoring'],
          popular: true
        },
        {
          id: 'custom-agents',
          title: 'Creating Custom Agents',
          description: 'Build specialized agents with natural language',
          readTime: 10,
          difficulty: 'intermediate',
          type: 'tutorial',
          tags: ['custom', 'nlp', 'advanced'],
          popular: true
        },
        {
          id: 'agent-scheduling',
          title: 'Agent Scheduling & Automation',
          description: 'Configure when and how often agents run',
          readTime: 6,
          difficulty: 'intermediate',
          type: 'guide',
          tags: ['scheduling', 'automation', 'configuration'],
          popular: false
        }
      ]
    },
    {
      id: 'compliance',
      title: 'Compliance Frameworks',
      description: 'Framework-specific guidance and best practices',
      icon: <Shield className="w-5 h-5" />,
      articles: [
        {
          id: 'soc2-guide',
          title: 'SOC 2 Compliance with Velocity',
          description: 'Complete guide to SOC 2 Type II automation',
          readTime: 20,
          difficulty: 'intermediate',
          type: 'guide',
          tags: ['soc2', 'compliance', 'automation'],
          popular: true
        },
        {
          id: 'gdpr-compliance',
          title: 'GDPR Data Protection Monitoring',
          description: 'Automated GDPR compliance and privacy controls',
          readTime: 18,
          difficulty: 'intermediate',
          type: 'guide',
          tags: ['gdpr', 'privacy', 'data protection'],
          popular: true
        },
        {
          id: 'iso27001-setup',
          title: 'ISO 27001 Implementation',
          description: 'Implementing ISO 27001 with AI-powered monitoring',
          readTime: 25,
          difficulty: 'advanced',
          type: 'guide',
          tags: ['iso27001', 'security', 'implementation'],
          popular: false
        }
      ]
    },
    {
      id: 'evidence',
      title: 'Evidence Management',
      description: 'Collecting, validating, and managing compliance evidence',
      icon: <Target className="w-5 h-5" />,
      articles: [
        {
          id: 'evidence-types',
          title: 'Types of Evidence',
          description: 'Understanding different evidence types and their uses',
          readTime: 7,
          difficulty: 'beginner',
          type: 'reference',
          tags: ['evidence', 'types', 'reference'],
          popular: false
        },
        {
          id: 'evidence-validation',
          title: 'AI-Powered Evidence Validation',
          description: 'How Velocity validates evidence quality and authenticity',
          readTime: 12,
          difficulty: 'intermediate',
          type: 'guide',
          tags: ['validation', 'ai', 'quality'],
          popular: true
        },
        {
          id: 'evidence-export',
          title: 'Exporting Evidence for Audits',
          description: 'Prepare evidence packages for auditors and assessors',
          readTime: 9,
          difficulty: 'beginner',
          type: 'tutorial',
          tags: ['export', 'audits', 'packages'],
          popular: true
        }
      ]
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      description: 'Common issues and their solutions',
      icon: <HelpCircle className="w-5 h-5" />,
      articles: [
        {
          id: 'connection-issues',
          title: 'Connection & Authentication Issues',
          description: 'Resolving common connection problems',
          readTime: 8,
          difficulty: 'beginner',
          type: 'faq',
          tags: ['troubleshooting', 'connections', 'auth'],
          popular: true
        },
        {
          id: 'agent-failures',
          title: 'Agent Execution Failures',
          description: 'Diagnosing and fixing agent execution problems',
          readTime: 12,
          difficulty: 'intermediate',
          type: 'guide',
          tags: ['troubleshooting', 'agents', 'failures'],
          popular: true
        },
        {
          id: 'performance-optimization',
          title: 'Performance Optimization',
          description: 'Optimizing agent performance and resource usage',
          readTime: 15,
          difficulty: 'advanced',
          type: 'guide',
          tags: ['performance', 'optimization', 'resources'],
          popular: false
        }
      ]
    }
  ];

  const videoTutorials: Tutorial[] = [
    {
      id: 'intro-video',
      title: 'Introduction to Velocity AI',
      description: 'Overview of features and capabilities',
      duration: 8,
      steps: 5,
      difficulty: 'Beginner',
      thumbnail: '/api/placeholder/320/180',
      completed: false
    },
    {
      id: 'aws-setup',
      title: 'Setting up AWS Monitoring',
      description: 'Complete AWS integration walkthrough',
      duration: 12,
      steps: 8,
      difficulty: 'Beginner',
      thumbnail: '/api/placeholder/320/180',
      completed: false
    },
    {
      id: 'custom-agents',
      title: 'Building Custom AI Agents',
      description: 'Create specialized monitoring agents',
      duration: 15,
      steps: 10,
      difficulty: 'Intermediate',
      thumbnail: '/api/placeholder/320/180',
      completed: false
    },
    {
      id: 'evidence-review',
      title: 'Evidence Review Workflow',
      description: 'Managing and validating collected evidence',
      duration: 10,
      steps: 6,
      difficulty: 'Beginner',
      thumbnail: '/api/placeholder/320/180',
      completed: false
    }
  ];

  const faqs = [
    {
      question: 'How does Velocity AI ensure the security of my credentials?',
      answer: 'All credentials are encrypted at rest using AES-256 encryption and transmitted over TLS 1.3. We use AWS KMS for key management and never store credentials in plain text. Your data is isolated in dedicated, encrypted storage.'
    },
    {
      question: 'Can I customize which controls are monitored?',
      answer: 'Yes! While Velocity automatically selects relevant controls based on your chosen framework, you can customize the control set through the Agent Creator or by editing existing agents. You can add, remove, or modify controls as needed.'
    },
    {
      question: 'How often do agents collect evidence?',
      answer: 'By default, agents run every 4 hours, but this is fully customizable. You can set continuous monitoring, hourly checks, daily scans, or create custom schedules. Critical controls can be monitored more frequently than others.'
    },
    {
      question: 'What happens if an agent fails to collect evidence?',
      answer: 'Velocity uses smart retry logic with exponential backoff. Failed agents are automatically retried up to 5 times with increasing delays. You receive notifications about persistent failures, and the system provides detailed error logs for troubleshooting.'
    },
    {
      question: 'Can I export evidence for external audits?',
      answer: 'Absolutely! Velocity provides multiple export formats including PDF reports, Excel spreadsheets, and JSON data. Evidence packages include timestamps, validation scores, and audit trails that meet compliance requirements.'
    },
    {
      question: 'How accurate is the AI evidence validation?',
      answer: 'Our ML validation system achieves 95%+ accuracy by analyzing multiple factors: completeness, authenticity, timeliness, and consistency. Each piece of evidence receives a confidence score, and low-confidence items are flagged for manual review.'
    }
  ];

  const filteredSections = docSections.map(section => ({
    ...section,
    articles: section.articles.filter(article =>
      searchQuery === '' ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  })).filter(section => section.articles.length > 0 || searchQuery === '');

  const currentSection = docSections.find(section => section.id === activeSection);

  const renderArticleContent = (article: Article) => {
    if (article.content) {
      return (
        <div className="prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br/>').replace(/###/g, '<h3>').replace(/##/g, '<h2>').replace(/#/g, '<h1>') }} />
        </div>
      );
    }
    
    return (
      <div className="text-center py-12">
        <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">{article.title}</h3>
        <p className="text-gray-600 mb-4">{article.description}</p>
        <Button variant="outline">
          <ExternalLink className="w-4 h-4 mr-2" />
          Open Full Article
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Velocity AI Documentation</h1>
              <p className="text-gray-600 mt-1">Everything you need to master AI-powered compliance</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline">
                <MessageSquare className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
              <Button>
                <Download className="w-4 h-4 mr-2" />
                Download Guides
              </Button>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="mt-6 relative max-w-lg">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedArticle ? (
          <div className="flex">
            {/* Sidebar Navigation */}
            <div className="w-64 flex-shrink-0 mr-8">
              <nav className="space-y-2">
                {filteredSections.map(section => (
                  <div key={section.id}>
                    <button
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeSection === section.id
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {section.icon}
                      <div>
                        <div className="font-medium">{section.title}</div>
                        <div className="text-xs text-gray-500">{section.articles.length} articles</div>
                      </div>
                    </button>
                  </div>
                ))}
              </nav>

              {/* Quick Links */}
              <div className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border">
                <h3 className="font-semibold text-gray-900 mb-3">Quick Links</h3>
                <div className="space-y-2 text-sm">
                  <a href="/velocity/onboarding" className="flex items-center text-purple-600 hover:text-purple-700">
                    <Zap className="w-3 h-3 mr-1" />
                    Start Setup Wizard
                  </a>
                  <a href="/velocity/live" className="flex items-center text-blue-600 hover:text-blue-700">
                    <Target className="w-3 h-3 mr-1" />
                    Live Dashboard
                  </a>
                  <a href="/velocity/creator" className="flex items-center text-green-600 hover:text-green-700">
                    <Bot className="w-3 h-3 mr-1" />
                    Agent Creator
                  </a>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {searchQuery ? (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Search Results for "{searchQuery}"
                  </h2>
                  <div className="space-y-4">
                    {filteredSections.flatMap(section => 
                      section.articles.map(article => (
                        <div key={article.id} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                             onClick={() => setSelectedArticle(article)}>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-2">{article.title}</h3>
                              <p className="text-gray-600 text-sm mb-3">{article.description}</p>
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <span className="flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {article.readTime} min read
                                </span>
                                <span className={`px-2 py-1 rounded-full ${
                                  article.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                                  article.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-red-100 text-red-700'
                                }`}>
                                  {article.difficulty}
                                </span>
                                {article.popular && (
                                  <span className="flex items-center text-orange-600">
                                    <Star className="w-3 h-3 mr-1" />
                                    Popular
                                  </span>
                                )}
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-400 ml-4" />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                <>
                  {/* Section Header */}
                  {currentSection && (
                    <div className="mb-8">
                      <div className="flex items-center space-x-3 mb-4">
                        {currentSection.icon}
                        <h2 className="text-2xl font-bold text-gray-900">{currentSection.title}</h2>
                      </div>
                      <p className="text-gray-600">{currentSection.description}</p>
                    </div>
                  )}

                  {/* Popular Articles */}
                  {currentSection && currentSection.articles.some(a => a.popular) && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Star className="w-4 h-4 mr-2 text-orange-500" />
                        Popular Articles
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentSection.articles.filter(a => a.popular).map(article => (
                          <div 
                            key={article.id}
                            className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => setSelectedArticle(article)}
                          >
                            <h4 className="font-semibold text-gray-900 mb-2">{article.title}</h4>
                            <p className="text-gray-600 text-sm mb-3">{article.description}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3 text-xs text-gray-500">
                                <span className="flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {article.readTime} min
                                </span>
                                <span className={`px-2 py-1 rounded-full ${
                                  article.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                                  article.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-red-100 text-red-700'
                                }`}>
                                  {article.difficulty}
                                </span>
                              </div>
                              <ArrowRight className="w-4 h-4 text-gray-400" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* All Articles */}
                  {currentSection && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">All Articles</h3>
                      <div className="space-y-3">
                        {currentSection.articles.map(article => (
                          <div 
                            key={article.id}
                            className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => setSelectedArticle(article)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  {article.type === 'video' && <Video className="w-4 h-4 text-red-500" />}
                                  {article.type === 'tutorial' && <Settings className="w-4 h-4 text-blue-500" />}
                                  {article.type === 'guide' && <BookOpen className="w-4 h-4 text-green-500" />}
                                  {article.type === 'reference' && <Target className="w-4 h-4 text-purple-500" />}
                                  {article.type === 'faq' && <HelpCircle className="w-4 h-4 text-orange-500" />}
                                  <h4 className="font-semibold text-gray-900">{article.title}</h4>
                                  {article.popular && <Star className="w-4 h-4 text-orange-500" />}
                                </div>
                                <p className="text-gray-600 text-sm mb-2">{article.description}</p>
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                  <span className="flex items-center">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {article.readTime} min read
                                  </span>
                                  <span className={`px-2 py-1 rounded-full ${
                                    article.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                                    article.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-red-100 text-red-700'
                                  }`}>
                                    {article.difficulty}
                                  </span>
                                  <div className="flex flex-wrap gap-1">
                                    {article.tags.slice(0, 3).map(tag => (
                                      <span key={tag} className="px-1 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <ArrowRight className="w-4 h-4 text-gray-400 ml-4" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Video Tutorials */}
                  {activeSection === 'getting-started' && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Video className="w-4 h-4 mr-2 text-red-500" />
                        Video Tutorials
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {videoTutorials.map(tutorial => (
                          <div key={tutorial.id} className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                            <div className="relative">
                              <img 
                                src={tutorial.thumbnail} 
                                alt={tutorial.title}
                                className="w-full h-40 object-cover bg-gray-200"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                                <Play className="w-12 h-12 text-white" />
                              </div>
                              <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                                {tutorial.duration} min
                              </div>
                            </div>
                            <div className="p-4">
                              <h4 className="font-semibold text-gray-900 mb-2">{tutorial.title}</h4>
                              <p className="text-gray-600 text-sm mb-3">{tutorial.description}</p>
                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <span>{tutorial.steps} steps</span>
                                <span>{tutorial.difficulty}</span>
                                {tutorial.completed && <CheckCircle className="w-4 h-4 text-green-500" />}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* FAQ Section */}
                  {activeSection === 'troubleshooting' && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <HelpCircle className="w-4 h-4 mr-2 text-blue-500" />
                        Frequently Asked Questions
                      </h3>
                      <div className="space-y-4">
                        {faqs.map((faq, index) => (
                          <div key={index} className="bg-white border rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 mb-2 flex items-start">
                              <AlertCircle className="w-4 h-4 mr-2 mt-0.5 text-blue-500 flex-shrink-0" />
                              {faq.question}
                            </h4>
                            <p className="text-gray-600 ml-6">{faq.answer}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ) : (
          /* Article View */
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Button 
                variant="ghost" 
                onClick={() => setSelectedArticle(null)}
                className="mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Documentation
              </Button>
              
              <div className="bg-white border rounded-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedArticle.title}</h1>
                    <p className="text-gray-600 mb-4">{selectedArticle.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {selectedArticle.readTime} min read
                      </span>
                      <span className={`px-2 py-1 rounded-full ${
                        selectedArticle.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                        selectedArticle.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {selectedArticle.difficulty}
                      </span>
                      <div className="flex items-center space-x-1">
                        {selectedArticle.tags.map(tag => (
                          <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      Helpful
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      Export
                    </Button>
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  {renderArticleContent(selectedArticle)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VelocityDocumentation;