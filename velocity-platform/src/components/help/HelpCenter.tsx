import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  QuestionMarkCircleIcon,
  BookOpenIcon,
  VideoCameraIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  PlayIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

interface HelpArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  lastUpdated: Date;
  views: number;
  helpful: number;
  rating: number;
}

interface HelpCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  articles: HelpArticle[];
  expanded?: boolean;
}

interface VideoTutorial {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const HelpCenter: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedArticle, setSelectedArticle] = useState<HelpArticle | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['getting-started']);
  const [showVideos, setShowVideos] = useState(false);

  const categories: HelpCategory[] = [
    {
      id: 'getting-started',
      name: 'Getting Started',
      description: 'Everything you need to know to get up and running',
      icon: BookOpenIcon,
      articles: [
        {
          id: '1',
          title: 'Quick Start Guide',
          content: `# Quick Start Guide

Welcome to Velocity AI! This guide will help you get started with your compliance automation platform.

## Step 1: Complete Your Profile
First, make sure your profile is complete with your organization details.

## Step 2: Select Compliance Frameworks
Choose the frameworks your organization needs to comply with:
- GDPR
- SOC 2
- ISO 27001
- HIPAA
- CCPA

## Step 3: Connect Your Cloud Platforms
Integrate with your existing infrastructure:
- AWS
- Google Cloud Platform
- Microsoft Azure
- GitHub

## Step 4: Configure AI Agents
Set up automated agents to collect evidence and monitor compliance.

## Next Steps
Once setup is complete, you can:
- View your compliance dashboard
- Monitor agent activities
- Generate reports
- Set up notifications`,
          category: 'getting-started',
          tags: ['setup', 'onboarding', 'basics'],
          lastUpdated: new Date('2024-01-15'),
          views: 1250,
          helpful: 198,
          rating: 4.8
        },
        {
          id: '2',
          title: 'Understanding Your Dashboard',
          content: `# Understanding Your Dashboard

Your Velocity AI dashboard provides a comprehensive overview of your compliance status.

## Main Components

### Trust Score
Your overall compliance health represented as a percentage.

### Active Agents
Shows the status of all your AI agents and their recent activities.

### Evidence Collection
Real-time view of evidence being collected from your infrastructure.

### Compliance Frameworks
Status and progress for each framework you're tracking.

## Navigation
Use the sidebar to access:
- Different dashboard views
- Compliance reports
- Agent management
- Integration settings

## Customization
You can customize your dashboard by:
- Rearranging widgets
- Setting refresh intervals
- Filtering by framework
- Creating custom views`,
          category: 'getting-started',
          tags: ['dashboard', 'navigation', 'overview'],
          lastUpdated: new Date('2024-01-12'),
          views: 892,
          helpful: 156,
          rating: 4.6
        }
      ]
    },
    {
      id: 'agents',
      name: 'AI Agents',
      description: 'Learn how to configure and manage your AI agents',
      icon: ChatBubbleLeftRightIcon,
      articles: [
        {
          id: '3',
          title: 'Agent Configuration Guide',
          content: `# Agent Configuration Guide

AI Agents are the core of Velocity AI's automation capabilities.

## Types of Agents

### Evidence Collectors
Automatically gather compliance evidence from your infrastructure.

### Compliance Monitors
Continuously monitor your systems for compliance violations.

### Report Generators
Create automated compliance reports.

### Security Scanners
Scan for security vulnerabilities and compliance gaps.

## Configuration Steps

1. **Select Agent Type**: Choose the appropriate agent for your needs
2. **Connect Platforms**: Link to your cloud platforms
3. **Set Schedule**: Configure when the agent should run
4. **Define Scope**: Specify what resources to monitor
5. **Configure Notifications**: Set up alerts and reporting

## Best Practices

- Start with basic configurations
- Test agents in a sandbox environment
- Monitor agent performance regularly
- Update configurations as your infrastructure changes`,
          category: 'agents',
          tags: ['agents', 'configuration', 'automation'],
          lastUpdated: new Date('2024-01-10'),
          views: 756,
          helpful: 134,
          rating: 4.7
        }
      ]
    },
    {
      id: 'integrations',
      name: 'Integrations',
      description: 'Connect Velocity AI with your existing tools',
      icon: DocumentTextIcon,
      articles: [
        {
          id: '4',
          title: 'AWS Integration Setup',
          content: `# AWS Integration Setup

Connect Velocity AI to your AWS infrastructure for automated evidence collection.

## Prerequisites

- AWS account with appropriate permissions
- IAM role or access keys
- Knowledge of your AWS resources

## Setup Steps

### 1. Create IAM Policy
Create a policy with the following permissions:
- ec2:DescribeInstances
- s3:ListBuckets
- cloudtrail:LookupEvents
- config:GetComplianceDetailsByConfigRule

### 2. Create IAM Role
Create a role for Velocity AI with the policy attached.

### 3. Configure Integration
In Velocity AI:
1. Go to Integrations
2. Select AWS
3. Enter your credentials or role ARN
4. Test the connection

### 4. Select Resources
Choose which AWS resources to monitor:
- EC2 instances
- S3 buckets
- RDS databases
- Lambda functions

## Troubleshooting

Common issues and solutions:
- Permission errors: Check IAM policy
- Connection timeouts: Verify network access
- Resource not found: Ensure resources exist`,
          category: 'integrations',
          tags: ['aws', 'integration', 'setup'],
          lastUpdated: new Date('2024-01-08'),
          views: 623,
          helpful: 112,
          rating: 4.5
        }
      ]
    },
    {
      id: 'compliance',
      name: 'Compliance',
      description: 'Understanding compliance frameworks and reports',
      icon: QuestionMarkCircleIcon,
      articles: [
        {
          id: '5',
          title: 'GDPR Compliance Overview',
          content: `# GDPR Compliance Overview

The General Data Protection Regulation (GDPR) is a comprehensive privacy law.

## Key Requirements

### Data Protection Principles
- Lawfulness, fairness, and transparency
- Purpose limitation
- Data minimization
- Accuracy
- Storage limitation
- Integrity and confidentiality

### Individual Rights
- Right to be informed
- Right of access
- Right to rectification
- Right to erasure
- Right to restrict processing
- Right to data portability
- Right to object
- Rights related to automated decision making

## Velocity AI GDPR Features

### Automated Evidence Collection
- Privacy policy documentation
- Data processing records
- Consent management evidence
- Security measure documentation

### Monitoring
- Data breach detection
- Consent tracking
- Data retention monitoring
- Cross-border transfer tracking

### Reporting
- Article 30 records
- Data protection impact assessments
- Breach notification reports
- Rights request tracking`,
          category: 'compliance',
          tags: ['gdpr', 'privacy', 'compliance'],
          lastUpdated: new Date('2024-01-05'),
          views: 1,
          helpful: 189,
          rating: 4.9
        }
      ]
    }
  ];

  const videoTutorials: VideoTutorial[] = [
    {
      id: '1',
      title: 'Getting Started with Velocity AI',
      description: 'A complete walkthrough of setting up your first compliance project',
      duration: '8:32',
      thumbnail: '/api/placeholder/320/180',
      category: 'getting-started',
      difficulty: 'beginner'
    },
    {
      id: '2',
      title: 'Configuring AWS Integration',
      description: 'Step-by-step guide to connecting your AWS infrastructure',
      duration: '12:45',
      thumbnail: '/api/placeholder/320/180',
      category: 'integrations',
      difficulty: 'intermediate'
    },
    {
      id: '3',
      title: 'Advanced Agent Configuration',
      description: 'Learn how to configure complex automation scenarios',
      duration: '15:20',
      thumbnail: '/api/placeholder/320/180',
      category: 'agents',
      difficulty: 'advanced'
    }
  ];

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const filteredArticles = categories
    .flatMap(category => category.articles)
    .filter(article => {
      const matchesSearch = searchQuery === '' || 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

  const popularArticles = categories
    .flatMap(category => category.articles)
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  if (selectedArticle) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-6">
          <button
            onClick={() => setSelectedArticle(null)}
            className="flex items-center text-purple-600 hover:text-purple-800 mb-4"
          >
            <ArrowRightIcon className="w-4 h-4 mr-2 rotate-180" />
            Back to Help Center
          </button>
          
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{selectedArticle.title}</h1>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <span>Last updated: {selectedArticle.lastUpdated.toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{selectedArticle.views} views</span>
                  <span>•</span>
                  <span>⭐ {selectedArticle.rating}/5</span>
                </div>
              </div>
            </div>
            
            <div className="prose max-w-none">
              <div dangerouslySetInnerHTML={{
                __html: selectedArticle.content.replace(/\n/g, '<br>').replace(/#{1,6}\s*/g, match => {
                  const level = match.trim().length;
                  return `<h${level} class="text-${4-level}xl font-bold mt-6 mb-3">`;
                }).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              }} />
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Was this helpful?</span>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200">
                      👍 Yes ({selectedArticle.helpful})
                    </button>
                    <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                      👎 No
                    </button>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  {selectedArticle.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
        <p className="text-xl text-gray-600 mb-8">
          Find answers, learn best practices, and get the most out of Velocity AI
        </p>
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto relative">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for help articles, guides, and tutorials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <BookOpenIcon className="w-8 h-8 mb-3" />
          <h3 className="text-lg font-semibold mb-2">Documentation</h3>
          <p className="text-purple-100 text-sm mb-4">
            Comprehensive guides and API documentation
          </p>
          <button 
            onClick={() => setShowVideos(false)}
            className="text-white hover:text-purple-200 text-sm font-medium"
          >
            Browse Articles →
          </button>
        </div>
        
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <VideoCameraIcon className="w-8 h-8 mb-3" />
          <h3 className="text-lg font-semibold mb-2">Video Tutorials</h3>
          <p className="text-blue-100 text-sm mb-4">
            Step-by-step video guides and demonstrations
          </p>
          <button 
            onClick={() => setShowVideos(true)}
            className="text-white hover:text-blue-200 text-sm font-medium"
          >
            Watch Videos →
          </button>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <ChatBubbleLeftRightIcon className="w-8 h-8 mb-3" />
          <h3 className="text-lg font-semibold mb-2">Contact Support</h3>
          <p className="text-green-100 text-sm mb-4">
            Get help from our support team
          </p>
          <button className="text-white hover:text-green-200 text-sm font-medium">
            Contact Us →
          </button>
        </div>
      </div>

      {showVideos ? (
        /* Video Tutorials */
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Video Tutorials</h2>
            <button
              onClick={() => setShowVideos(false)}
              className="text-purple-600 hover:text-purple-800 text-sm font-medium"
            >
              View Articles Instead
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videoTutorials.map((video) => (
              <div key={video.id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <div className="aspect-video bg-gray-200 flex items-center justify-center">
                    <PlayIcon className="w-12 h-12 text-gray-400" />
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                    {video.duration}
                  </div>
                  <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs text-white ${
                    video.difficulty === 'beginner' ? 'bg-green-500' :
                    video.difficulty === 'intermediate' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}>
                    {video.difficulty}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{video.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{video.description}</p>
                  <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                    Watch Video →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-8">
              <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
              
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-3 py-2 rounded-lg mb-2 transition-colors ${
                  selectedCategory === 'all' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                All Articles
              </button>
              
              {categories.map((category) => (
                <div key={category.id} className="mb-2">
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full flex items-center justify-between px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center">
                      <category.icon className="w-4 h-4 mr-2" />
                      <span className="text-sm">{category.name}</span>
                    </div>
                    {expandedCategories.includes(category.id) ? (
                      <ChevronDownIcon className="w-4 h-4" />
                    ) : (
                      <ChevronRightIcon className="w-4 h-4" />
                    )}
                  </button>
                  
                  {expandedCategories.includes(category.id) && (
                    <div className="ml-6 mt-1 space-y-1">
                      {category.articles.map((article) => (
                        <button
                          key={article.id}
                          onClick={() => setSelectedArticle(article)}
                          className="block w-full text-left px-2 py-1 text-sm text-gray-600 hover:text-purple-600 rounded"
                        >
                          {article.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {searchQuery ? (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Search Results for "{searchQuery}"
                </h2>
                <div className="space-y-4">
                  {filteredArticles.map((article) => (
                    <div key={article.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <button
                            onClick={() => setSelectedArticle(article)}
                            className="text-lg font-semibold text-gray-900 hover:text-purple-600 text-left"
                          >
                            {article.title}
                          </button>
                          <p className="text-gray-600 mt-2 line-clamp-2">
                            {article.content.substring(0, 200)}...
                          </p>
                          <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                            <span>{article.views} views</span>
                            <span>⭐ {article.rating}/5</span>
                            <span>{article.lastUpdated.toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Popular Articles</h2>
                <div className="space-y-4">
                  {popularArticles.map((article) => (
                    <div key={article.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <button
                            onClick={() => setSelectedArticle(article)}
                            className="text-lg font-semibold text-gray-900 hover:text-purple-600 text-left"
                          >
                            {article.title}
                          </button>
                          <p className="text-gray-600 mt-2">
                            {article.content.substring(0, 200)}...
                          </p>
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>{article.views} views</span>
                              <span>⭐ {article.rating}/5</span>
                              <span>{article.lastUpdated.toLocaleDateString()}</span>
                            </div>
                            <div className="flex space-x-2">
                              {article.tags.slice(0, 2).map(tag => (
                                <span key={tag} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpCenter;