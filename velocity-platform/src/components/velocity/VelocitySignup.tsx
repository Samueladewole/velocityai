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
  Play
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
      price: '€249/month',
      description: 'Perfect for small teams',
      features: ['Up to 5 integrations', 'Basic compliance frameworks', 'Email support']
    },
    {
      value: 'growth',
      label: 'Growth',
      price: '€549/month',
      description: 'For growing organizations',
      popular: true,
      features: ['Unlimited integrations', 'All compliance frameworks', 'Priority support', 'Custom agents']
    },
    {
      value: 'enterprise',
      label: 'Enterprise',
      price: '€1,249/month',
      description: 'For large enterprises',
      features: ['White-label solution', 'Dedicated success manager', 'SLA guarantee', 'Custom deployment']
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
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect to onboarding
      // Store auth token for new signup
      const authData = {
        token: 'user_token_' + Date.now(),
        role: 'user',
        email: formData.email,
        name: formData.name,
        company: formData.company,
        tier: formData.tier,
        loginTime: new Date().toISOString()
      };
      
      localStorage.setItem('velocity_auth_token', authData.token);
      localStorage.setItem('velocity_user', JSON.stringify(authData));
      
      // Redirect to dashboard after signup
      navigate('/dashboard');
    } catch (err: any) {
      setError('Signup failed. Please try again.');
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
                          placeholder="John Doe"
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
                          placeholder="Acme Corp"
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
                        placeholder="john@company.com"
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