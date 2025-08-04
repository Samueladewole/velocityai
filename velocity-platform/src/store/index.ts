import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { User } from '@/types';
import { SubscriptionPlan, SubscriptionStatus } from '@/types';
import { SupabaseAuth, supabase } from '@/lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: any) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  initializeAuth: () => Promise<void>;
  clearError: () => void;
}

interface AppState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  activeComponent: string;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleSidebar: () => void;
  setActiveComponent: (component: string) => void;
}

interface NotificationState {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  timestamp: Date;
}

// Helper to convert Supabase user to app user
const supabaseToAppUser = (supabaseUser: SupabaseUser): User => ({
  id: supabaseUser.id,
  email: supabaseUser.email!,
  name: supabaseUser.user_metadata?.name || supabaseUser.email!.split('@')[0],
  organization: {
    id: supabaseUser.user_metadata?.organizationId || 'default_org',
    name: supabaseUser.user_metadata?.organizationName || 'Default Organization',
    industry: supabaseUser.user_metadata?.industry || 'Technology',
    size: supabaseUser.user_metadata?.organizationSize || 'STARTUP',
    subscription: {
      plan: SubscriptionPlan.STARTER,
      status: SubscriptionStatus.ACTIVE,
      startDate: new Date(supabaseUser.created_at),
    },
  },
  role: supabaseUser.user_metadata?.role || 'ADMIN',
  permissions: supabaseUser.user_metadata?.permissions || [],
});

// Auth Store
export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        supabaseUser: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        
        initializeAuth: async () => {
          set({ isLoading: true });
          try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
              const appUser = supabaseToAppUser(session.user);
              set({ 
                user: appUser, 
                supabaseUser: session.user,
                isAuthenticated: true,
                error: null 
              });
            }
          } catch (error) {
            console.error('Auth initialization error:', error);
            set({ error: 'Failed to initialize authentication' });
          } finally {
            set({ isLoading: false });
          }
        },

        login: async (email: string, password: string) => {
          set({ isLoading: true, error: null });
          try {
            const { user: supabaseUser } = await SupabaseAuth.signIn(email, password);
            if (supabaseUser) {
              const appUser = supabaseToAppUser(supabaseUser);
              set({ 
                user: appUser, 
                supabaseUser,
                isAuthenticated: true,
                error: null 
              });
            }
          } catch (error: any) {
            console.error('Login error:', error);
            set({ error: error.message || 'Login failed' });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },

        signUp: async (email: string, password: string, metadata?: any) => {
          set({ isLoading: true, error: null });
          try {
            const { user: supabaseUser } = await SupabaseAuth.signUp(email, password, metadata);
            if (supabaseUser) {
              const appUser = supabaseToAppUser(supabaseUser);
              set({ 
                user: appUser, 
                supabaseUser,
                isAuthenticated: true,
                error: null 
              });
            }
          } catch (error: any) {
            console.error('Signup error:', error);
            set({ error: error.message || 'Signup failed' });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },

        logout: async () => {
          set({ isLoading: true });
          try {
            await SupabaseAuth.signOut();
            set({ 
              user: null, 
              supabaseUser: null,
              isAuthenticated: false,
              error: null 
            });
          } catch (error: any) {
            console.error('Logout error:', error);
            set({ error: error.message || 'Logout failed' });
          } finally {
            set({ isLoading: false });
          }
        },

        updateUser: (updates) =>
          set((state) => ({
            user: state.user ? { ...state.user, ...updates } : null,
          })),

        clearError: () => set({ error: null }),
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({ 
          user: state.user,
          isAuthenticated: state.isAuthenticated 
        }),
      }
    )
  )
);

// App Store
export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        theme: 'light',
        sidebarOpen: true,
        activeComponent: 'dashboard',
        setTheme: (theme) => {
          set({ theme });
          if (theme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        },
        toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
        setActiveComponent: (component) => set({ activeComponent: component }),
      }),
      {
        name: 'app-storage',
      }
    )
  )
);

// Notification Store
export const useNotificationStore = create<NotificationState>()(
  devtools((set) => ({
    notifications: [],
    addNotification: (notification) =>
      set((state) => ({
        notifications: [
          ...state.notifications,
          {
            ...notification,
            id: `notif_€{Date.now()}`,
            timestamp: new Date(),
          },
        ],
      })),
    removeNotification: (id) =>
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      })),
    clearNotifications: () => set({ notifications: [] }),
  }))
);

// Development mode is now handled within the auth store with proper Supabase integration