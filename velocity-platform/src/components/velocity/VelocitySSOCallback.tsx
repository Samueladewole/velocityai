import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

const VelocitySSOCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing SSO authentication...');

  useEffect(() => {
    const handleSSOCallback = async () => {
      try {
        const ssoParam = searchParams.get('sso');
        const provider = searchParams.get('provider');
        const token = searchParams.get('token');
        const error = searchParams.get('error');

        if (error) {
          setStatus('error');
          setMessage(`SSO authentication failed: ${error}`);
          return;
        }

        if (ssoParam === 'success' && provider) {
          // Try token from URL first
          if (token) {
            try {
              // Store the token in localStorage for frontend use
              localStorage.setItem('velocity_auth_token', token);
              
              // Create user data based on the demo token
              const demoUserData = {
                id: 'demo-sso-user',
                email: `demo.user@${provider}sso.com`,
                firstName: 'Demo',
                lastName: 'User',
                organizationId: 'demo-org',
                role: 'user',
                ssoProvider: provider
              };

              // Store user data in localStorage for frontend use
              localStorage.setItem('velocity_user', JSON.stringify(demoUserData));

              setStatus('success');
              setMessage(`Successfully authenticated with ${provider.charAt(0).toUpperCase() + provider.slice(1)}`);
              
              // Clear token from URL for security
              window.history.replaceState({}, document.title, window.location.pathname);
              
              // Redirect after short delay
              setTimeout(() => {
                navigate('/dashboard');
              }, 1500);
              return;
            } catch (err) {
              console.error('Token handling error:', err);
              setStatus('error');
              setMessage('Failed to process authentication token');
              return;
            }
          }

          // Try cookie-based validation as fallback
          try {
            const response = await fetch('/api/auth/validate', {
              method: 'GET',
              credentials: 'include', // Include cookies for HttpOnly token
              headers: {
                'Content-Type': 'application/json'
              }
            });

            if (response.ok) {
              const data = await response.json();
              if (data.valid) {
                // Store user data in localStorage for frontend use
                localStorage.setItem('velocity_user', JSON.stringify({
                  id: data.user.id,
                  email: data.user.email,
                  organizationId: data.user.organizationId,
                  role: data.user.role,
                  ssoProvider: provider
                }));

                setStatus('success');
                setMessage(`Successfully authenticated with ${provider.charAt(0).toUpperCase() + provider.slice(1)}`);
                
                // Redirect after short delay
                setTimeout(() => {
                  navigate('/dashboard');
                }, 1500);
                return;
              }
            }
          } catch (err) {
            console.error('Cookie validation error:', err);
          }

          // If all attempts fail
          setStatus('error');
          setMessage('Authentication failed - please try again');
        } else {
          setStatus('error');
          setMessage('Invalid SSO callback parameters');
        }

      } catch (error) {
        console.error('SSO callback error:', error);
        setStatus('error');
        setMessage('An unexpected error occurred during SSO authentication');
      }
    };

    handleSSOCallback();
  }, [searchParams, navigate]);

  const handleRetry = () => {
    navigate('/velocity/signup');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 font-sans flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-8">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl text-center">
          
          {/* Status Icon */}
          <div className="flex justify-center mb-6">
            {status === 'loading' && (
              <div className="relative">
                <Loader className="w-16 h-16 text-emerald-400 animate-spin" />
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-amber-400 rounded-full blur-sm opacity-50"></div>
              </div>
            )}
            {status === 'success' && (
              <div className="relative">
                <CheckCircle className="w-16 h-16 text-emerald-400" />
                <div className="absolute inset-0 bg-emerald-400 rounded-full blur-sm opacity-50"></div>
              </div>
            )}
            {status === 'error' && (
              <div className="relative">
                <XCircle className="w-16 h-16 text-red-400" />
                <div className="absolute inset-0 bg-red-400 rounded-full blur-sm opacity-50"></div>
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-white mb-4 font-serif">
            {status === 'loading' && 'Authenticating...'}
            {status === 'success' && 'Authentication Successful!'}
            {status === 'error' && 'Authentication Failed'}
          </h1>

          {/* Message */}
          <p className="text-slate-300 mb-8">
            {message}
          </p>

          {/* Action Buttons */}
          <div className="space-y-4">
            {status === 'success' && (
              <div className="text-sm text-emerald-400">
                Redirecting to onboarding...
              </div>
            )}
            
            {status === 'error' && (
              <div className="space-y-3">
                <button
                  onClick={handleRetry}
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-emerald-500/25"
                >
                  Try Again
                </button>
                
                <button
                  onClick={() => navigate('/velocity')}
                  className="w-full bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-medium transition-colors border border-white/20"
                >
                  Back to Home
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VelocitySSOCallback;