import React from 'react';
import { Shield, Eye, Lock, Database, UserCheck, Globe } from 'lucide-react';

const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-600">
            Last updated: July 28, 2025
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          
          {/* Introduction */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900">Introduction</h2>
            </div>
            <p className="text-gray-600 mb-4">
              ERIP Trust Intelligence Platform ("we," "our," or "us") respects your privacy and is committed 
              to protecting your personal data. This privacy policy explains how we collect, use, disclose, 
              and safeguard your information when you use our services.
            </p>
            <p className="text-gray-600">
              By using our services, you consent to the data practices described in this policy.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Database className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900">Information We Collect</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Personal Information</h3>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Name, email address, phone number</li>
                  <li>Company information and job title</li>
                  <li>Account credentials and authentication data</li>
                  <li>Payment and billing information</li>
                  <li>Communication preferences</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Technical Information</h3>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>IP address, browser type, and device information</li>
                  <li>Usage data and analytics</li>
                  <li>Cookies and similar tracking technologies</li>
                  <li>Log files and system performance data</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Business Information</h3>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Compliance frameworks and certifications</li>
                  <li>Risk assessments and audit data</li>
                  <li>Trust scores and performance metrics</li>
                  <li>Integration and configuration data</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <UserCheck className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900">How We Use Your Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">Service Delivery</h3>
                <ul className="text-blue-800 space-y-2 text-sm">
                  <li>• Provide and maintain our services</li>
                  <li>• Process transactions and billing</li>
                  <li>• Generate Trust Scores and analytics</li>
                  <li>• Facilitate integrations and automation</li>
                </ul>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-green-900 mb-3">Communication</h3>
                <ul className="text-green-800 space-y-2 text-sm">
                  <li>• Send service updates and notifications</li>
                  <li>• Provide customer support</li>
                  <li>• Share relevant content and insights</li>
                  <li>• Conduct surveys and feedback collection</li>
                </ul>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-900 mb-3">Improvement</h3>
                <ul className="text-purple-800 space-y-2 text-sm">
                  <li>• Analyze usage patterns and performance</li>
                  <li>• Develop new features and capabilities</li>
                  <li>• Enhance security and reliability</li>
                  <li>• Conduct research and development</li>
                </ul>
              </div>

              <div className="bg-orange-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-orange-900 mb-3">Legal & Compliance</h3>
                <ul className="text-orange-800 space-y-2 text-sm">
                  <li>• Comply with legal obligations</li>
                  <li>• Protect against fraud and abuse</li>
                  <li>• Enforce terms and conditions</li>
                  <li>• Respond to legal requests</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Data Protection */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900">Data Protection & Security</h2>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Measures</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <strong>Encryption:</strong> AES-256 encryption at rest and TLS 1.3 in transit
                </div>
                <div>
                  <strong>Access Control:</strong> Role-based permissions and multi-factor authentication
                </div>
                <div>
                  <strong>Monitoring:</strong> 24/7 security monitoring and incident response
                </div>
                <div>
                  <strong>Compliance:</strong> SOC 2 Type II, ISO 27001, and GDPR compliance
                </div>
              </div>
            </div>

            <p className="text-gray-600">
              We implement industry-standard security measures to protect your personal information against 
              unauthorized access, alteration, disclosure, or destruction. However, no method of transmission 
              over the internet is 100% secure.
            </p>
          </section>

          {/* Data Sharing */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Eye className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900">Data Sharing & Disclosure</h2>
            </div>
            
            <p className="text-gray-600 mb-4">
              We do not sell, trade, or rent your personal information to third parties. 
              We may share your information in the following circumstances:
            </p>

            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <strong className="text-gray-900">Service Providers:</strong>
                <span className="text-gray-600"> With trusted third-party service providers who assist in delivering our services.</span>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <strong className="text-gray-900">Legal Requirements:</strong>
                <span className="text-gray-600"> When required by law, regulation, or legal process.</span>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <strong className="text-gray-900">Business Transfers:</strong>
                <span className="text-gray-600"> In connection with a merger, acquisition, or sale of assets.</span>
              </div>
              <div className="border-l-4 border-orange-500 pl-4">
                <strong className="text-gray-900">Consent:</strong>
                <span className="text-gray-600"> With your explicit consent for specific purposes.</span>
              </div>
            </div>
          </section>

          {/* Your Rights */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900">Your Privacy Rights</h2>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg">
              <p className="text-blue-900 font-semibold mb-4">You have the right to:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-800">
                <div>• Access your personal information</div>
                <div>• Correct inaccurate data</div>
                <div>• Delete your personal information</div>
                <div>• Restrict processing of your data</div>
                <div>• Data portability</div>
                <div>• Object to processing</div>
                <div>• Withdraw consent</div>
                <div>• Lodge complaints with authorities</div>
              </div>
            </div>

            <p className="text-gray-600 mt-4">
              To exercise your rights, contact us at{' '}
              <a href="mailto:privacy@eripapp.com" className="text-blue-600 hover:underline">
                privacy@eripapp.com
              </a>
            </p>
          </section>

          {/* Contact */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Contact Us</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-600 mb-4">
                If you have questions about this Privacy Policy, please contact us:
              </p>
              <div className="space-y-2 text-gray-600">
                <p><strong>Email:</strong> privacy@eripapp.com</p>
                <p><strong>Address:</strong> ERIP Trust Intelligence Platform</p>
                <p><strong>Phone:</strong> +46 735 457 681</p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default Privacy;