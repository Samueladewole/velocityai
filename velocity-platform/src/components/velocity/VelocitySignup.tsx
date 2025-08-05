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
  Globe,
  Star,
  Play,
  Home
} from 'lucide-react';

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
    tier: 'growth',
    acceptTerms: false,
    acceptMarketing: true
  });

  const tiers = [
    {
      value: 'starter',
      label: 'Starter',
      price: '€999/month',
      description: 'Perfect for small teams',
      features: ['Up to 5 users', 'SOC2 Type I & GDPR basics', '95% evidence automation', 'Email support']
    },
    {
      value: 'growth',
      label: 'Growth', 
      price: '€2,499/month',
      description: 'For growing organizations',
      popular: true,
      features: ['Up to 15 users', 'SOC2, ISO 27001, GDPR, HIPAA', 'Advanced monitoring', 'Priority support']
    },
    {
      value: 'enterprise',
      label: 'Enterprise',
      price: 'Custom pricing',
      description: 'For large enterprises',
      features: ['Unlimited users', 'All frameworks + custom', 'Dedicated CSM', 'White-glove onboarding']
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'Name is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!formData.password || formData.password.length < 8) return 'Password must be at least 8 characters';
    if (!formData.company.trim()) return 'Company name is required';
    if (!formData.acceptTerms) return 'You must accept the terms of service';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Call the actual registration API
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.name.split(' ')[0],
          lastName: formData.name.split(' ').slice(1).join(' ') || '',
          email: formData.email,
          password: formData.password,
          organizationName: formData.company,
          domain: formData.email.split('@')[1], // Extract domain from email
          plan: formData.tier,
          acceptTerms: formData.acceptTerms,
          acceptMarketing: formData.acceptMarketing
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Store authentication token securely
      if (data.token) {
        localStorage.setItem('velocity_auth_token', data.token);
        localStorage.setItem('velocity_user', JSON.stringify({
          id: data.user.id,
          email: data.user.email,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          organizationId: data.organization?.id,
          plan: formData.tier
        }));
      }

      // Redirect to onboarding wizard for new users
      navigate('/onboarding');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 font-sans">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital,wght@0,400;0,700;1,400&family=Manrope:wght@300;400;500;600;700&display=swap');
        
        .font-serif {
          font-family: 'Instrument Serif', serif;
        }
        
        .font-sans {
          font-family: 'Manrope', sans-serif;
        }
      `}</style>

      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Back to Home Button */}
      <div className="absolute top-8 left-8 z-20">
        <button
          onClick={() => navigate('/velocity')}
          className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors duration-200 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20"
        >
          <Home className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4">
        <div className="max-w-6xl w-full mx-auto">
          
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-amber-400 rounded-lg"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-amber-400 rounded-lg blur-sm opacity-50"></div>
              </div>
              <span className="text-2xl font-bold text-white font-serif">Velocity</span>
            </div>
            
            <h1 className="font-serif text-4xl lg:text-5xl font-light text-white mb-4 leading-tight">
              Start Your 
              <span className="block font-bold bg-gradient-to-r from-emerald-400 to-amber-400 bg-clip-text text-transparent">
                Digital Trust Journey
              </span>
            </h1>
            
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Join hundreds of companies automating their compliance with AI-powered intelligence
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            
            {/* Main Signup Form */}
            <div className="lg:col-span-3">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                
                {/* Plan Selection */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-white mb-6 font-serif">Choose Your Plan</h2>
                  <div className="grid md:grid-cols-3 gap-4">
                    {tiers.map((tier) => (
                      <div
                        key={tier.value}
                        className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 €{
                          formData.tier === tier.value
                            ? 'border-emerald-400 bg-emerald-500/10'
                            : 'border-white/20 hover:border-white/40 bg-white/5'
                        }`}
                        onClick={() => setFormData(prev => ({ ...prev, tier: tier.value }))}
                      >
                        {tier.popular && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                            <span className="bg-gradient-to-r from-emerald-400 to-amber-400 text-slate-900 text-xs font-semibold px-3 py-1 rounded-full">
                              Popular
                            </span>
                          </div>
                        )}
                        
                        <div className="text-center">
                          <input
                            type="radio"
                            name="tier"
                            value={tier.value}
                            checked={formData.tier === tier.value}
                            onChange={handleInputChange}
                            className="sr-only"
                          />
                          <h3 className="font-bold text-white mb-1">{tier.label}</h3>
                          <p className="text-2xl font-bold text-emerald-400 mb-1">{tier.price}</p>
                          <p className="text-sm text-slate-400 mb-3">{tier.description}</p>
                          <ul className="text-xs text-slate-400 space-y-1">
                            {tier.features.map((feature, index) => (
                              <li key={index} className="flex items-center">
                                <CheckCircle className="w-3 h-3 text-emerald-400 mr-1 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Signup Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl backdrop-blur-sm">
                      <p className="text-sm text-red-300">{error}</p>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent backdrop-blur-sm"
                          placeholder="Your full name"
                        />
                      </div>
                    </div>

                    {/* Company */}
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-slate-300 mb-2">
                        Company Name
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent backdrop-blur-sm"
                          placeholder="Your company name"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                      Work Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent backdrop-blur-sm"
                        placeholder="you@yourcompany.com"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent backdrop-blur-sm"
                        placeholder="Create a strong password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-slate-400">Minimum 8 characters</p>
                  </div>

                  {/* Terms */}
                  <div className="space-y-3">
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        name="acceptTerms"
                        checked={formData.acceptTerms}
                        onChange={handleInputChange}
                        required
                        className="mt-0.5 rounded border-white/20 bg-white/10 text-emerald-400 focus:ring-emerald-400"
                      />
                      <span className="ml-2 text-sm text-slate-300">
                        I agree to the{' '}
                        <a href="/terms" className="text-emerald-400 hover:text-emerald-300 underline">
                          Terms of Service
                        </a>{' '}
                        and{' '}
                        <a href="/privacy" className="text-emerald-400 hover:text-emerald-300 underline">
                          Privacy Policy
                        </a>
                      </span>
                    </label>

                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        name="acceptMarketing"
                        checked={formData.acceptMarketing}
                        onChange={handleInputChange}
                        className="mt-0.5 rounded border-white/20 bg-white/10 text-emerald-400 focus:ring-emerald-400"
                      />
                      <span className="ml-2 text-sm text-slate-300">
                        Send me product updates and compliance insights (optional)
                      </span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative overflow-hidden w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-emerald-500/25"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Creating account...
                        </>
                      ) : (
                        <>
                          Start Free Trial
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  </button>

                  {/* SSO Options */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/20"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-slate-900 text-slate-400">Or continue with SSO</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => window.location.href = '/api/auth/sso/okta'}
                      className="inline-flex justify-center items-center py-2 px-4 border border-white/20 rounded-lg bg-white/10 text-sm font-medium text-white hover:bg-white/20 transition-colors"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                      </svg>
                      <span className="ml-2">Okta</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => window.location.href = '/api/auth/sso/azure'}
                      className="inline-flex justify-center items-center py-2 px-4 border border-white/20 rounded-lg bg-white/10 text-sm font-medium text-white hover:bg-white/20 transition-colors"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      <span className="ml-2">Azure</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => window.location.href = '/api/auth/sso/google'}
                      className="inline-flex justify-center items-center py-2 px-4 border border-white/20 rounded-lg bg-white/10 text-sm font-medium text-white hover:bg-white/20 transition-colors"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span className="ml-2">Google</span>
                    </button>
                  </div>

                  {/* Login Link */}
                  <div className="text-center">
                    <p className="text-sm text-slate-400">
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => navigate('/velocity/login')}
                        className="font-medium text-emerald-400 hover:text-emerald-300"
                      >
                        Sign in
                      </button>
                    </p>
                  </div>
                </form>
              </div>
            </div>

            {/* Benefits Sidebar */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Trust Score Preview */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-300 font-medium">Your Trust Score</span>
                  <span className="text-xs text-slate-400 bg-slate-800/50 px-2 py-1 rounded">Live Preview</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="8" fill="none" className="text-slate-700" />
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="35" 
                        stroke="currentColor" 
                        strokeWidth="8" 
                        fill="none" 
                        className="text-emerald-400"
                        strokeDasharray="206 220"
                        style={{ transition: 'stroke-dasharray 2s ease-out' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-bold text-white">94</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-white">Excellent</p>
                    <p className="text-sm text-slate-400">Ready for enterprise sales</p>
                  </div>
                </div>
              </div>

              {/* Key Benefits */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <h3 className="font-semibold text-white mb-4 font-serif">Why Choose Velocity?</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-white">95% Automation</p>
                      <p className="text-sm text-slate-400">Reduce manual compliance work</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-white">Enterprise Security</p>
                      <p className="text-sm text-slate-400">SOC 2 Type II certified</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-white">Multi-Cloud Support</p>
                      <p className="text-sm text-slate-400">AWS, GCP, Azure, and more</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonial */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
                  ))}
                </div>
                <p className="text-white text-sm italic mb-4">
                  "Velocity reduced our SOC 2 prep time from 6 months to 3 weeks. The AI agents work around the clock."
                </p>
                <div>
                  <div className="font-semibold text-white text-sm">Sarah Chen</div>
                  <div className="text-emerald-400 text-sm">CISO, TechFlow</div>
                </div>
              </div>

              {/* Security Badge */}
              <div className="bg-gradient-to-br from-emerald-500/10 to-amber-500/10 rounded-2xl p-6 border border-emerald-500/20">
                <h3 className="font-semibold text-emerald-400 mb-2">Enterprise-Grade Security</h3>
                <p className="text-sm text-slate-300 mb-4">
                  Your data is protected with bank-level encryption and industry-leading security practices.
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-emerald-400">
                  <span className="bg-emerald-500/10 px-2 py-1 rounded">SOC 2 Compliant</span>
                  <span className="bg-emerald-500/10 px-2 py-1 rounded">GDPR Ready</span>
                  <span className="bg-emerald-500/10 px-2 py-1 rounded">256-bit SSL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VelocitySignup;