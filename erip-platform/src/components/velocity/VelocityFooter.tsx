import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Mail, Phone, MapPin } from 'lucide-react';

const VelocityFooter: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">Velocity AI</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Accelerate compliance with AI-powered automation. Build trust faster than ever before.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/velocity" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Overview
                </Link>
              </li>
              <li>
                <Link to="/velocity/pricing" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/velocity/docs" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link to="/velocity/integration" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Integrations
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/velocity/dashboard" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/velocity/live" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Live Monitoring
                </Link>
              </li>
              <li>
                <Link to="/velocity/creator" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Agent Creator
                </Link>
              </li>
              <li>
                <Link to="/velocity/evidence" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Evidence Review
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="mailto:support@eripapp.com" className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-2">
                  <Mail className="w-3 h-3" />
                  Contact Support
                </a>
              </li>
              <li>
                <Link to="/company/contact" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Sales
                </Link>
              </li>
              <li>
                <Link to="/company/about" className="text-gray-400 hover:text-white text-sm transition-colors">
                  About ERIP
                </Link>
              </li>
              <li>
                <Link to="/legal/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm">
            © 2024 ERIP Technologies. All rights reserved.
          </div>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <span className="text-gray-400 text-sm">
              Powered by ERIP Platform
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default VelocityFooter;