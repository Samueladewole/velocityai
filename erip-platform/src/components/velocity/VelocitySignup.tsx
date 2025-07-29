import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  User, 
  Building, 
  Eye, 
  EyeOff, 
  ArrowRight,
  CheckCircle,
  Shield,
  Zap,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import velocityApi from '@/services/velocity/api.service';
import velocityConfig from '@/config/velocity.config';

const VelocitySignup: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    company: '',
    tier: 'starter',
    agreeToTerms: false
  });

  // Check if we're on velocity subdomain or dev path
  const isSubdomain = window.location.hostname.includes('velocity.') || 
                     (window.location.hostname === 'localhost' && window.location.pathname.startsWith('/velocity'));
  const routePrefix = isSubdomain ? '' : '/velocity';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!formData.agreeToTerms) {
        throw new Error('Please agree to the terms and conditions');
      }

      const response = await velocityApi.signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        company: formData.company,
        tier: formData.tier
      });

      if (response.success) {
        // Redirect to dashboard after successful signup
        navigate(`${routePrefix}/dashboard`);
      } else {
        throw new Error(response.error || 'Signup failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    { icon: Shield, text: "Enterprise-grade security", color: "text-green-500" },
    { icon: Zap, text: "30-minute setup", color: "text-yellow-500" },
    { icon: Globe, text: "Multi-cloud support", color: "text-blue-500" }
  ];

  const tiers = [
    { value: 'starter', label: 'Starter', price: '$249/month', description: 'Perfect for small teams' },
    { value: 'growth', label: 'Growth', price: '$549/month', description: 'For growing organizations', popular: true },
    { value: 'enterprise', label: 'Enterprise', price: '$1,249/month', description: 'For large enterprises' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Velocity</h1>
            <p className="text-gray-600">Start automating your compliance in 30 minutes</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Work Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  placeholder="john@company.com"
                  required
                />
              </div>
            </div>

            {/* Company Field */}
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  placeholder="Acme Inc."
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 h-5 w-5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
            </div>

            {/* Tier Selection */}
            <div>
              <label htmlFor="tier" className="block text-sm font-medium text-gray-700 mb-2">
                Choose Your Plan
              </label>
              <select
                id="tier"
                name="tier"
                value={formData.tier}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
              >
                {tiers.map(tier => (
                  <option key={tier.value} value={tier.value}>
                    {tier.label} - {tier.price} ({tier.description})
                  </option>
                ))}
              </select>
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                required
              />
              <label htmlFor="agreeToTerms" className="ml-3 text-sm text-gray-600">
                I agree to the{' '}
                <a href="/legal/terms" className="text-purple-600 hover:text-purple-700 underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/legal/privacy" className="text-purple-600 hover:text-purple-700 underline">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-lg font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:scale-100"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </div>
              )}
            </Button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => navigate(`${routePrefix}/login`)}
                className="text-purple-600 hover:text-purple-700 font-semibold"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Benefits */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-8">
        <div className="max-w-md text-white">
          <h2 className="text-4xl font-bold mb-6">
            Automate Compliance
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-400">
              In Minutes
            </span>
          </h2>
          
          <p className="text-xl text-purple-100 mb-8">
            Join 500+ companies using Velocity to achieve continuous compliance 
            with AI-powered automation.
          </p>

          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center">
                <div className={`p-2 rounded-lg bg-white/10 mr-4`}>
                  <benefit.icon className={`h-6 w-6 ${benefit.color}`} />
                </div>
                <span className="text-lg">{benefit.text}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
            <p className="text-sm text-purple-100">
              "Velocity reduced our SOC 2 prep time from 6 months to 3 weeks."
            </p>
            <p className="text-sm text-purple-300 mt-2">
              — Sarah Chen, CTO at TechFlow
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VelocitySignup;