import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, 
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
  Globe,
  ChevronRight
} from 'lucide-react';

const VelocityFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  // Check if we're in subdomain mode or main app
  const isSubdomain = window.location.hostname.includes('velocity.') || 
                     (window.location.hostname === 'localhost' && window.location.pathname.startsWith('/velocity'));
  const routePrefix = isSubdomain ? '' : '/velocity';

  const footerSections = [
    {
      title: 'Product',
      links: [
        { name: 'Features', path: `${routePrefix}/features`, icon: Zap },
        { name: 'Pricing', path: `${routePrefix}/pricing`, icon: Award },
        { name: 'Integrations', path: `${routePrefix}/integrations`, icon: Globe },
        { name: 'Security', path: `${routePrefix}/security`, icon: Shield },
        { name: 'Roadmap', path: `${routePrefix}/roadmap`, icon: ChevronRight },
      ],
    },
    {
      title: 'Solutions',
      links: [
        { name: 'SOC 2 Compliance', path: `${routePrefix}/solutions/soc2` },
        { name: 'ISO 27001', path: `${routePrefix}/solutions/iso27001` },
        { name: 'CIS Controls', path: `${routePrefix}/solutions/cis-controls` },
        { name: 'GDPR', path: `${routePrefix}/solutions/gdpr` },
        { name: 'HIPAA', path: `${routePrefix}/solutions/hipaa` },
      ],
    },
    {
      title: 'Resources',
      links: [
        { name: 'Documentation', path: `${routePrefix}/docs`, icon: BookOpen },
        { name: 'API Reference', path: `${routePrefix}/api`, icon: FileText },
        { name: 'Blog', path: `${routePrefix}/blog`, icon: FileText },
        { name: 'Case Studies', path: `${routePrefix}/case-studies`, icon: Briefcase },
        { name: 'Support', path: `${routePrefix}/support`, icon: HelpCircle },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About', path: `${routePrefix}/about`, icon: Users },
        { name: 'Careers', path: `${routePrefix}/careers`, icon: Briefcase },
        { name: 'Contact', path: `${routePrefix}/contact`, icon: Mail },
        { name: 'Partners', path: `${routePrefix}/partners`, icon: Users },
        { name: 'Press', path: `${routePrefix}/press`, icon: FileText },
      ],
    },
  ];

  const socialLinks = [
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/velocityai' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/velocity-ai' },
    { name: 'GitHub', icon: Github, href: 'https://github.com/velocity-ai' },
  ];

  const legalLinks = [
    { name: 'Privacy Policy', path: `${routePrefix}/privacy` },
    { name: 'Terms of Service', path: `${routePrefix}/terms` },
    { name: 'Cookie Policy', path: `${routePrefix}/cookies` },
    { name: 'DPA', path: `${routePrefix}/dpa` },
    { name: 'Security', path: `${routePrefix}/security` },
  ];

  const certifications = [
    { name: 'SOC 2 Type II', icon: Shield },
    { name: 'ISO 27001', icon: Award },
    { name: 'GDPR Compliant', icon: Lock },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Velocity</h3>
                <p className="text-xs text-gray-400">AI Compliance Automation</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Transform manual quarterly compliance into continuous AI-powered monitoring. 
              90% time reduction, 95% automation rate.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-white font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-sm hover:text-white transition-colors flex items-center gap-2"
                    >
                      {link.icon && <link.icon className="w-4 h-4" />}
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-wrap items-center justify-center gap-6">
            {certifications.map((cert) => (
              <div key={cert.name} className="flex items-center gap-2">
                <cert.icon className="w-5 h-5 text-purple-400" />
                <span className="text-sm text-gray-400">{cert.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">
              © {currentYear} Velocity AI. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              {legalLinks.map((link, index) => (
                <React.Fragment key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                  {index < legalLinks.length - 1 && (
                    <span className="text-gray-600">•</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-white font-semibold mb-1">
                Stay updated on compliance automation
              </h4>
              <p className="text-sm text-gray-400">
                Get the latest insights on AI-powered compliance delivered to your inbox.
              </p>
            </div>
            <form className="flex gap-2 w-full sm:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 bg-gray-700 text-white rounded-lg flex-1 sm:w-64 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default VelocityFooter;