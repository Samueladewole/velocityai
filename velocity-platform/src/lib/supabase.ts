/**
 * Supabase Client Configuration for Velocity AI Platform
 * Enhanced authentication and real-time features
 */

import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';
import { Database } from './database.types';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client
export const supabase: SupabaseClient<Database> = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

// Authentication helpers
export class SupabaseAuth {
  /**
   * Sign up new user
   */
  static async signUp(email: string, password: string, metadata?: any) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Supabase signup error:', error);
      throw error;
    }
  }

  /**
   * Sign in user
   */
  static async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Supabase signin error:', error);
      throw error;
    }
  }

  /**
   * Sign out current user
   */
  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Supabase signout error:', error);
      throw error;
    }
  }

  /**
   * Get current user
   */
  static async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  /**
   * Get current session
   */
  static async getCurrentSession(): Promise<Session | null> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    } catch (error) {
      console.error('Get current session error:', error);
      return null;
    }
  }

  /**
   * Reset password
   */
  static async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (error) throw error;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }

  /**
   * Update user password
   */
  static async updatePassword(newPassword: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
    } catch (error) {
      console.error('Update password error:', error);
      throw error;
    }
  }

  /**
   * Update user metadata
   */
  static async updateUserMetadata(metadata: any) {
    try {
      const { error } = await supabase.auth.updateUser({
        data: metadata,
      });
      if (error) throw error;
    } catch (error) {
      console.error('Update user metadata error:', error);
      throw error;
    }
  }
}

// Database helpers with RLS
export class SupabaseDB {
  /**
   * Get organizations for current user
   */
  static async getOrganizations() {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get organizations error:', error);
      throw error;
    }
  }

  /**
   * Get agents for current user's organization
   */
  static async getAgents() {
    try {
      const { data, error } = await supabase
        .from('agents')
        .select(`
          *,
          organization:organizations(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get agents error:', error);
      throw error;
    }
  }

  /**
   * Get evidence items for current user's organization
   */
  static async getEvidenceItems(limit = 50, offset = 0) {
    try {
      const { data, error } = await supabase
        .from('evidence_items')
        .select(`
          *,
          agent:agents(name, platform),
          organization:organizations(name)
        `)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get evidence items error:', error);
      throw error;
    }
  }

  /**
   * Get trust scores for current user's organization
   */
  static async getTrustScores() {
    try {
      const { data, error } = await supabase
        .from('trust_scores')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;
      return data?.[0] || null;
    } catch (error) {
      console.error('Get trust scores error:', error);
      throw error;
    }
  }

  /**
   * Get integrations for current user's organization
   */
  static async getIntegrations() {
    try {
      const { data, error } = await supabase
        .from('integrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get integrations error:', error);
      throw error;
    }
  }

  /**
   * Create new agent
   */
  static async createAgent(agentData: any) {
    try {
      const { data, error } = await supabase
        .from('agents')
        .insert([agentData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Create agent error:', error);
      throw error;
    }
  }

  /**
   * Update agent
   */
  static async updateAgent(agentId: string, updates: any) {
    try {
      const { data, error } = await supabase
        .from('agents')
        .update(updates)
        .eq('id', agentId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Update agent error:', error);
      throw error;
    }
  }

  /**
   * Delete agent
   */
  static async deleteAgent(agentId: string) {
    try {
      const { error } = await supabase
        .from('agents')
        .delete()
        .eq('id', agentId);

      if (error) throw error;
    } catch (error) {
      console.error('Delete agent error:', error);
      throw error;
    }
  }
}

// Real-time subscriptions
export class SupabaseRealtime {
  /**
   * Subscribe to organization data changes
   */
  static subscribeToOrganizationData(
    organizationId: string,
    callback: (payload: any) => void
  ) {
    const tables = ['agents', 'evidence_items', 'trust_scores', 'integrations'];
    const subscriptions: any[] = [];

    tables.forEach(table => {
      const subscription = supabase
        .channel(`${table}_changes`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table,
            filter: `organization_id=eq.${organizationId}`,
          },
          (payload) => {
            callback({
              table,
              event: payload.eventType,
              data: payload.new || payload.old,
              old: payload.old,
            });
          }
        )
        .subscribe();

      subscriptions.push(subscription);
    });

    return subscriptions;
  }

  /**
   * Subscribe to agent status changes
   */
  static subscribeToAgentUpdates(callback: (payload: any) => void) {
    return supabase
      .channel('agent_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'agents',
        },
        callback
      )
      .subscribe();
  }

  /**
   * Subscribe to new evidence items
   */
  static subscribeToEvidenceUpdates(callback: (payload: any) => void) {
    return supabase
      .channel('evidence_updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'evidence_items',
        },
        callback
      )
      .subscribe();
  }

  /**
   * Unsubscribe from channel
   */
  static unsubscribe(subscription: any) {
    return supabase.removeChannel(subscription);
  }
}

// File storage helpers
export class SupabaseStorage {
  /**
   * Upload evidence file
   */
  static async uploadEvidenceFile(
    organizationId: string,
    fileName: string,
    file: File
  ) {
    try {
      const filePath = `${organizationId}/evidence/${Date.now()}-${fileName}`;
      
      const { data, error } = await supabase.storage
        .from('velocity-evidence')
        .upload(filePath, file);

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('velocity-evidence')
        .getPublicUrl(filePath);

      return {
        path: filePath,
        url: urlData.publicUrl,
        size: file.size,
      };
    } catch (error) {
      console.error('Upload evidence file error:', error);
      throw error;
    }
  }

  /**
   * Download evidence file
   */
  static async downloadEvidenceFile(filePath: string) {
    try {
      const { data, error } = await supabase.storage
        .from('velocity-evidence')
        .download(filePath);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Download evidence file error:', error);
      throw error;
    }
  }

  /**
   * Delete evidence file
   */
  static async deleteEvidenceFile(filePath: string) {
    try {
      const { error } = await supabase.storage
        .from('velocity-evidence')
        .remove([filePath]);

      if (error) throw error;
    } catch (error) {
      console.error('Delete evidence file error:', error);
      throw error;
    }
  }

  /**
   * List evidence files for organization
   */
  static async listEvidenceFiles(organizationId: string) {
    try {
      const { data, error } = await supabase.storage
        .from('velocity-evidence')
        .list(`${organizationId}/evidence`);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('List evidence files error:', error);
      throw error;
    }
  }
}

// Utility functions
export const getSupabaseClient = () => supabase;

export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};

// Export default client
export default supabase;