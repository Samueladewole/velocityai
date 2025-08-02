import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  redirectTo = '/velocity/login'
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 flex items-center justify-center">
        <div className="text-white text-xl">Authenticating...</div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role-based access if required
  if (requiredRole && user?.role !== requiredRole) {
    const roleHierarchy = {
      'viewer': 1,
      'agent_operator': 2,
      'evidence_reviewer': 3,
      'security_analyst': 4,
      'compliance_officer': 5,
      'risk_analyst': 6,
      'audit_manager': 7,
      'security_lead': 8,
      'compliance_manager': 9,
      'org_admin': 10,
      'org_owner': 11,
      'platform_admin': 12,
      'super_admin': 13
    };

    const userLevel = roleHierarchy[user?.role as keyof typeof roleHierarchy] || 0;
    const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 999;

    if (userLevel < requiredLevel) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-8">
            <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
            <p className="text-slate-300 mb-6">
              You don't have permission to access this page. Required role: {requiredRole}
            </p>
            <button 
              onClick={() => window.history.back()}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      );
    }
  }

  // Render children if all checks pass
  return <>{children}</>;
};

export default ProtectedRoute;