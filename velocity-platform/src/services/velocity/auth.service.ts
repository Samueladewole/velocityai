import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import velocityApi, { User, AuthTokens } from './api.service';
import velocityWebSocket from './websocket.service';
import velocityConfig from '@/config/velocity.config';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string, mfa_code?: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
  clearError: () => void;
  updateUser: (updates: Partial<User>) => void;
}

interface SignupData {
  email: string;
  password: string;
  name: string;
  company: string;
  tier: 'starter' | 'growth' | 'enterprise';
}

export const useVelocityAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string, mfa_code?: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await velocityApi.login(email, password, mfa_code);
          
          if (response.success) {
            set({
              user: response.data.user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            
            // Connect WebSocket after successful login
            velocityWebSocket.connect();
            
            // Set up auto-refresh
            get().scheduleTokenRefresh(response.data.expires_in);
          } else {
            throw new Error(response.error || 'Login failed');
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.error || error.message || 'Login failed',
          });
          throw error;
        }
      },

      signup: async (data: SignupData) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await velocityApi.signup(data);
          
          if (response.success) {
            set({
              user: response.data.user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            
            // Connect WebSocket after successful signup
            velocityWebSocket.connect();
            
            // Set up auto-refresh
            get().scheduleTokenRefresh(response.data.expires_in);
          } else {
            throw new Error(response.error || 'Signup failed');
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.error || error.message || 'Signup failed',
          });
          throw error;
        }
      },

      logout: () => {
        // Clear auth state
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
        
        // Clear API tokens
        velocityApi.logout();
        
        // Disconnect WebSocket
        velocityWebSocket.disconnect();
        
        // Clear any scheduled refresh
        get().clearTokenRefresh();
      },

      refreshAuth: async () => {
        try {
          const tokens = await velocityApi.refreshAuthToken();
          
          // Schedule next refresh
          get().scheduleTokenRefresh(tokens.expires_in);
        } catch (error) {
          // If refresh fails, logout user
          get().logout();
          throw error;
        }
      },

      clearError: () => {
        set({ error: null });
      },

      updateUser: (updates: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { ...currentUser, ...updates };
          set({ user: updatedUser });
          
          // Update localStorage
          localStorage.setItem(
            velocityConfig.auth.userKey,
            JSON.stringify(updatedUser)
          );
        }
      },

      // Private helper methods
      scheduleTokenRefresh: (expiresIn: number) => {
        // Clear any existing refresh timer
        get().clearTokenRefresh();
        
        // Schedule refresh 5 minutes before expiry
        const refreshTime = (expiresIn - 300) * 1000;
        
        if (refreshTime > 0) {
          const refreshTimer = setTimeout(() => {
            get().refreshAuth().catch(() => {
              // If refresh fails, it will logout automatically
            });
          }, refreshTime);
          
          // Store timer ID for cleanup
          (window as any).__velocityRefreshTimer = refreshTimer;
        }
      },

      clearTokenRefresh: () => {
        const timer = (window as any).__velocityRefreshTimer;
        if (timer) {
          clearTimeout(timer);
          delete (window as any).__velocityRefreshTimer;
        }
      },
    }),
    {
      name: 'velocity-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // On rehydration, check if user is still valid
        if (state?.isAuthenticated && state.user) {
          // Verify token is still valid
          const token = localStorage.getItem(velocityConfig.auth.tokenKey);
          if (!token) {
            state.logout();
          } else {
            // Connect WebSocket
            velocityWebSocket.connect();
            
            // Refresh auth to ensure token is valid
            state.refreshAuth().catch(() => {
              // Will logout if refresh fails
            });
          }
        }
      },
    }
  )
);

// Helper hooks
export const useVelocityUser = () => {
  const user = useVelocityAuth((state) => state.user);
  return user;
};

export const useIsVelocityAuthenticated = () => {
  const isAuthenticated = useVelocityAuth((state) => state.isAuthenticated);
  return isAuthenticated;
};

// Permission checking utilities
export const hasVelocityPermission = (permission: string): boolean => {
  const user = useVelocityAuth.getState().user;
  if (!user) return false;
  
  // Define permissions based on tier
  const tierPermissions: Record<string, string[]> = {
    starter: ['basic_agents', 'basic_integrations', 'basic_reports'],
    growth: ['basic_agents', 'advanced_agents', 'all_integrations', 'advanced_reports', 'api_access'],
    enterprise: ['all_features', 'custom_agents', 'white_label', 'priority_support'],
  };
  
  const userPermissions = tierPermissions[user.tier] || [];
  return userPermissions.includes(permission) || userPermissions.includes('all_features');
};

export default useVelocityAuth;