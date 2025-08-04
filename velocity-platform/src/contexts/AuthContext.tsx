import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';

// Types
export interface VelocityUser {
  id: string;
  email: string;
  name: string;
  role: string;
  organization_id: string;
  organization_name: string;
  is_active: boolean;
  created_at: string;
}

export interface AuthContextType {
  user: VelocityUser | null;
  supabaseUser: SupabaseUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ user: VelocityUser; token: string }>;
  signup: (data: SignupData) => Promise<{ user: VelocityUser; token: string }>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  updateProfile: (data: Partial<VelocityUser>) => Promise<VelocityUser>;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  company_name: string;
  tier?: string;
  role?: string;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<VelocityUser | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated
  const isAuthenticated = !!user && !!supabaseUser;

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check Supabase session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setIsLoading(false);
          return;
        }

        if (session?.user) {
          setSupabaseUser(session.user);
          
          // Get Velocity user data from localStorage or API
          const velocityUserData = localStorage.getItem('velocity_user');
          if (velocityUserData) {
            try {
              const userData = JSON.parse(velocityUserData);
              setUser(userData);
            } catch (e) {
              console.error('Error parsing user data:', e);
              await logout();
            }
          } else {
            // Fetch user data from backend
            await fetchUserProfile(session.access_token);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (event === 'SIGNED_IN' && session?.user) {
          setSupabaseUser(session.user);
          await fetchUserProfile(session.access_token);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setSupabaseUser(null);
          localStorage.removeItem('velocity_user');
          localStorage.removeItem('velocity_auth_token');
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          setSupabaseUser(session.user);
          localStorage.setItem('velocity_auth_token', session.access_token);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Fetch user profile from backend
  const fetchUserProfile = async (token: string) => {
    try {
      const response = await fetch('/api/v1/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const userData = await response.json();
      setUser(userData);
      localStorage.setItem('velocity_user', JSON.stringify(userData));
      localStorage.setItem('velocity_auth_token', token);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      await logout();
    }
  };

  // Login function
  const login = async (email: string, password: string): Promise<{ user: VelocityUser; token: string }> => {
    try {
      setIsLoading(true);

      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.session?.access_token) {
        throw new Error('No access token received');
      }

      // Fetch user profile from backend
      await fetchUserProfile(data.session.access_token);

      if (!user) {
        throw new Error('Failed to load user profile');
      }

      return {
        user,
        token: data.session.access_token,
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function
  const signup = async (signupData: SignupData): Promise<{ user: VelocityUser; token: string }> => {
    try {
      setIsLoading(true);

      // First, register with our backend
      const response = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Registration failed');
      }

      const { access_token, refresh_token, user: userData } = await response.json();

      // Set the session in Supabase (if using Supabase auth)
      const { error: sessionError } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });

      if (sessionError) {
        console.error('Session error:', sessionError);
      }

      // Set user data
      setUser(userData);
      localStorage.setItem('velocity_user', JSON.stringify(userData));
      localStorage.setItem('velocity_auth_token', access_token);

      return {
        user: userData,
        token: access_token,
      };
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);

      // Sign out from Supabase
      await supabase.auth.signOut();

      // Clear local state
      setUser(null);
      setSupabaseUser(null);
      localStorage.removeItem('velocity_user');
      localStorage.removeItem('velocity_auth_token');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh token function
  const refreshToken = async (): Promise<void> => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        throw new Error(error.message);
      }

      if (data.session?.access_token) {
        localStorage.setItem('velocity_auth_token', data.session.access_token);
        await fetchUserProfile(data.session.access_token);
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      await logout();
    }
  };

  // Update profile function
  const updateProfile = async (profileData: Partial<VelocityUser>): Promise<VelocityUser> => {
    try {
      const token = localStorage.getItem('velocity_auth_token');
      if (!token) {
        throw new Error('No auth token found');
      }

      const response = await fetch('/api/v1/auth/me', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      localStorage.setItem('velocity_user', JSON.stringify(updatedUser));

      return updatedUser;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    supabaseUser,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
    refreshToken,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// useAuth hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;