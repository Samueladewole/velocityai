import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  ExternalLink, 
  Mail, 
  ArrowRight,
  Twitter,
  Linkedin,
  Github,
  Award,
  Brain,
  FileCheck,
  Users,
  Globe,
  Calculator,
  BookOpen,
  MessageSquare,
  Video,
  Briefcase,
  Phone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const NavigationFooter: React.FC = () => {
  const productLinks = [
    { name: 'QIE - Questionnaire Intelligence', href: '/qie-enhanced', icon: Brain },
    { name: 'ISACA DTEF Automation', href: '/dtef-automation', icon: FileCheck },
    { name: 'Industry Certifications', href: '/certifications', icon: Award },
    { name: 'AI Governance', href: '/ai-governance', icon: Brain },
    { name: 'Privacy Management', href: '/privacy-management', icon: Shield },
    { name: 'Trust Score Sharing', href: '/trust-score-share', icon: ExternalLink },
    { name: 'Framework Management', href: '/framework-management', icon: FileCheck },
    { name: 'Policy Management', href: '/policy-management', icon: FileCheck }
  ];

  const solutionLinks = [
    { name: 'Compliance Automation', href: '/solutions/compliance-automation' },
    { name: 'Risk Quantification', href: '/solutions/risk-quantification' },
    { name: 'Sales Acceleration', href: '/solutions/sales-acceleration' },
    { name: 'AI Governance', href: '/solutions/ai-governance' },
    { name: 'Privacy Management', href: '/solutions/privacy-management' },
    { name: 'Financial Services', href: '/solutions/financial-services' },
    { name: 'Healthcare', href: '/solutions/healthcare' },
    { name: 'Technology/SaaS', href: '/solutions/technology' }
  ];

  const resourceLinks = [
    { name: 'Documentation', href: '/docs', icon: BookOpen },
    { name: 'API Reference', href: '/api-docs', icon: FileCheck },
    { name: 'Trust Academy', href: '/academy', icon: Users },
    { name: 'Blog & Insights', href: '/blog', icon: MessageSquare },
    { name: 'Webinars', href: '/webinars', icon: Video },
    { name: 'Case Studies', href: '/case-studies', icon: Briefcase },
    { name: 'ROI Calculator', href: '/roi-calculator', icon: Calculator },
    { name: 'Help Center', href: '/help', icon: MessageSquare }
  ];

  const companyLinks = [
    { name: 'About ERIP', href: '/company/about' },
    { name: 'Our Story', href: '/company/story' },
    { name: 'Team', href: '/company/team' },
    { name: 'Careers', href: '/company/careers' },
    { name: 'Press', href: '/company/press' },
    { name: 'Contact', href: '/company/contact' },
    { name: 'Seed Pitch (€2M)', href: '/company/seed-pitch' },
    { name: 'Partners', href: '/company/partners' },
    { name: 'Investors', href: '/company/investors' }
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '/legal/privacy' },
    { name: 'Terms of Service', href: '/legal/terms' },
    { name: 'Data Processing Agreement', href: '/legal/dpa' },
    { name: 'Cookie Policy', href: '/legal/cookies' },
    { name: 'Security', href: '/legal/security' },
    { name: 'Compliance', href: '/legal/compliance' }
  ];

  const trustBadges = [
    { name: 'SOC 2 Type II', href: '/certifications/soc2' },
    { name: 'ISO 27001', href: '/certifications/iso27001' },
    { name: 'GDPR Compliant', href: '/certifications/gdpr' },
    { name: 'TISAX', href: '/certifications/tisax' }
  ];

  return (
    <footer className="bg-slate-900 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-slate-800">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">
              Stay ahead of compliance trends
            </h2>
            <p className="text-slate-300 mb-6">
              Get weekly insights on trust platform innovation, compliance automation, and industry best practices.
            </p>
            <div className="flex max-w-md mx-auto gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
              />
              <Button className="erip-gradient-primary">
                Subscribe
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-slate-400 mt-3">
              Join 10,000+ compliance professionals. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-700 shadow-lg">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">ERIP</h1>
                <p className="text-xs text-slate-400 font-medium">Trust Intelligence Platform</p>
              </div>
            </Link>
            <p className="text-slate-300 text-sm mb-6 max-w-sm">
              The only platform that transforms compliance costs into competitive advantage through 
              Trust Equity™ automation and sales acceleration.
            </p>
            
            <div className="flex items-center gap-3 mb-6">
              <Link 
                to="https://twitter.com/erip" 
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </Link>
              <Link 
                to="https://linkedin.com/company/erip" 
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <Linkedin className="h-4 w-4" />
              </Link>
              <Link 
                to="https://github.com/erip" 
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <Github className="h-4 w-4" />
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-white">Security & Compliance</h4>
              <div className="flex flex-wrap gap-2">
                {trustBadges.map((badge) => (
                  <Link
                    key={badge.name}
                    to={badge.href}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-xs font-medium transition-colors"
                  >
                    {badge.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-2">
              {productLinks.slice(0, 8).map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-slate-300 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <link.icon className="h-3 w-3" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Solutions</h3>
            <ul className="space-y-2">
              {solutionLinks.slice(0, 8).map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-slate-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-slate-300 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <link.icon className="h-3 w-3" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-slate-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Contact Info */}
            <div className="mt-6 pt-6 border-t border-slate-800">
              <h4 className="text-sm font-semibold text-white mb-2">Contact</h4>
              <div className="space-y-1">
                <Link 
                  to="mailto:samuel@digitalsecurityinsights.com" 
                  className="text-sm text-slate-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  <Mail className="h-3 w-3" />
                  samuel@digitalsecurityinsights.com
                </Link>
                <Link 
                  to="tel:+46735457681" 
                  className="text-sm text-slate-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  <Phone className="h-3 w-3" />
                  +46 735 457 681
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-slate-400">
              © 2025 ERIP Trust Intelligence Platform. All rights reserved.
            </div>
            
            <div className="flex items-center gap-6">
              {legalLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-sm text-slate-400 hover:text-slate-300 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};