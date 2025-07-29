import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Shield,
  Zap,
  CheckCircle
} from 'lucide-react';

const VelocityLogin: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });

  // Admin credentials for development
  const ADMIN_CREDENTIALS = {
    email: 'admin@velocity.ai',
    password: 'admin123'
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }
    if (!formData.password) {
      setError('Password is required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check admin credentials
      if (formData.email === ADMIN_CREDENTIALS.email && formData.password === ADMIN_CREDENTIALS.password) {
        // Store auth token with admin role
        const authData = {
          token: 'admin_token_' + Date.now(),
          role: 'admin',
          email: formData.email,
          name: 'Admin User',
          loginTime: new Date().toISOString()
        };
        
        localStorage.setItem('velocity_auth_token', authData.token);
        localStorage.setItem('velocity_user', JSON.stringify(authData));
        
        // Redirect to dashboard
        navigate('/velocity/dashboard');
        window.location.reload(); // Force refresh to update auth state
      } else {
        setError('Invalid email or password. For admin access, use admin@velocity.ai');
      }
    } catch (err: any) {
      setError('Login failed. Please try again.');
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
        <div className="max-w-lg w-full mx-auto">
          
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-amber-400 rounded-lg"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-amber-400 rounded-lg blur-sm opacity-50"></div>
              </div>
              <span className="text-2xl font-bold text-white font-serif">Velocity</span>
            </div>
            
            <h1 className="font-serif text-3xl lg:text-4xl font-light text-white mb-4">
              Welcome 
              <span className="block font-bold bg-gradient-to-r from-emerald-400 to-amber-400 bg-clip-text text-transparent">
                Back
              </span>
            </h1>
            
            <p className="text-lg text-slate-300">
              Continue your compliance automation journey
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
            {/* Admin Credentials Info */}
            <div className="mb-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                <h4 className="text-emerald-400 font-semibold">Development Admin Access</h4>
              </div>
              <p className="text-sm text-slate-300 mb-2">Use these credentials to access the admin dashboard:</p>
              <div className="font-mono text-sm space-y-1">
                <p className="text-slate-200">Email: <span className="text-emerald-400">admin@velocity.ai</span></p>
                <p className="text-slate-200">Password: <span className="text-emerald-400">admin123</span></p>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl backdrop-blur-sm">
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}

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
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={formData.remember}
                    onChange={handleInputChange}
                    className="rounded border-white/20 bg-white/10 text-emerald-400 focus:ring-emerald-400"
                  />
                  <span className="ml-2 text-sm text-slate-300">Remember me</span>
                </label>
                
                <button
                  type="button"
                  className="text-sm text-emerald-400 hover:text-emerald-300"
                >
                  Forgot password?
                </button>
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
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </button>

              {/* Signup Link */}
              <div className="text-center pt-4 border-t border-white/10">
                <p className="text-sm text-slate-400">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/velocity/signup')}
                    className="font-medium text-emerald-400 hover:text-emerald-300"
                  >
                    Start free trial
                  </button>
                </p>
              </div>
            </form>
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="text-center">
              <Zap className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              <p className="text-xs text-slate-400">95% Automation</p>
            </div>
            <div className="text-center">
              <Shield className="w-6 h-6 text-amber-400 mx-auto mb-2" />
              <p className="text-xs text-slate-400">SOC 2 Certified</p>
            </div>
            <div className="text-center">
              <CheckCircle className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <p className="text-xs text-slate-400">500+ Companies</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VelocityLogin;