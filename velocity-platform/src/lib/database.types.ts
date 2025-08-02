export type Database = {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          domain: string;
          tier: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          domain: string;
          tier?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          domain?: string;
          tier?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: string;
          organization_id: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          role?: string;
          organization_id: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          role?: string;
          organization_id?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      agents: {
        Row: {
          id: string;
          name: string;
          description: string;
          platform: string;
          status: string;
          organization_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string;
          platform: string;
          status?: string;
          organization_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          platform?: string;
          status?: string;
          organization_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      evidence_items: {
        Row: {
          id: string;
          title: string;
          description: string;
          status: string;
          agent_id: string;
          organization_id: string;
          file_path: string | null;
          metadata: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string;
          status?: string;
          agent_id: string;
          organization_id: string;
          file_path?: string | null;
          metadata?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          status?: string;
          agent_id?: string;
          organization_id?: string;
          file_path?: string | null;
          metadata?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      integrations: {
        Row: {
          id: string;
          name: string;
          platform: string;
          status: string;
          organization_id: string;
          configuration: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          platform: string;
          status?: string;
          organization_id: string;
          configuration?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          platform?: string;
          status?: string;
          organization_id?: string;
          configuration?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      trust_scores: {
        Row: {
          id: string;
          organization_id: string;
          overall_score: number;
          security_score: number;
          compliance_score: number;
          governance_score: number;
          risk_score: number;
          calculated_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          overall_score: number;
          security_score: number;
          compliance_score: number;
          governance_score: number;
          risk_score: number;
          calculated_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          overall_score?: number;
          security_score?: number;
          compliance_score?: number;
          governance_score?: number;
          risk_score?: number;
          calculated_at?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: 'super_admin' | 'platform_admin' | 'org_owner' | 'org_admin' | 'compliance_manager' | 'security_lead' | 'audit_manager' | 'risk_analyst' | 'compliance_officer' | 'security_analyst' | 'evidence_reviewer' | 'agent_operator' | 'viewer' | 'external_auditor';
      agent_status: 'active' | 'inactive' | 'error' | 'deploying' | 'scanning';
      evidence_status: 'pending' | 'verified' | 'rejected' | 'archived';
      integration_status: 'connected' | 'disconnected' | 'error' | 'configuring';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};