/**
 * Velocity AI Platform API Service
 * Real backend integration for all 13 AI agents and compliance evidence collection
 */

const API_BASE_URL = 'http://localhost:8000';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  company?: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    access_token: string;
    token_type: string;
    user: {
      id: string;
      email: string;
      name: string;
      organization_id: string;
    };
  };
}

export interface Agent {
  id: string;
  name: string;
  platform: string;
  framework: string;
  status: string;
  evidence_collected: number;
  success_rate: number;
  last_run?: string;
  next_run?: string;
  description?: string;
  avg_collection_time?: number;
}

export interface Evidence {
  id: string;
  title: string;
  description: string;
  evidence_type: string;
  status: string;
  framework: string;
  control_id: string;
  confidence_score: number;
  trust_points: number;
  created_at: string;
  data: any;
  evidence_metadata: any;
}

export interface TrustScore {
  total_score: number;
  framework_scores: Record<string, number>;
  score_change: number;
  evidence_count: number;
  automation_rate: number;
  coverage_percentage: number;
  last_updated: string;
}

export interface DashboardData {
  trust_score: {
    current: number;
    trend: string;
    target: number;
    last_updated: string;
  };
  agents: {
    total: number;
    active: number;
    success_rate: number;
    agents_list: Agent[];
  };
  evidence: {
    total_collected: number;
    today_collected: number;
    recent_items: Evidence[];
    automation_rate: number;
  };
  frameworks: Record<string, any>;
  notifications: any[];
  system_health: {
    status: string;
    uptime: string;
    last_check: string;
  };
}

class VelocityApiService {
  private token: string | null = null;

  constructor() {
    // Load token from localStorage on initialization
    this.token = localStorage.getItem('velocity_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Authentication
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    // Store token
    this.token = response.data.access_token;
    localStorage.setItem('velocity_token', this.token);

    return response;
  }

  async signup(data: SignupData): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/api/v1/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    // Store token
    this.token = response.data.access_token;
    localStorage.setItem('velocity_token', this.token);

    return response;
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('velocity_token');
  }

  // Agents - All 13 AI Agents
  async getAgents(): Promise<Agent[]> {
    const response = await this.request<any>('/api/v1/agents');
    return response.data || response;
  }

  async runAgent(agentId: string): Promise<any> {
    return this.request(`/api/v1/agents/${agentId}/run`, {
      method: 'POST',
    });
  }

  // Evidence Collection
  async getEvidence(): Promise<Evidence[]> {
    return this.request('/api/v1/evidence');
  }

  async validateEvidence(evidenceId: string, approved: boolean, notes?: string): Promise<any> {
    return this.request(`/api/v1/evidence/${evidenceId}/validate`, {
      method: 'POST',
      body: JSON.stringify({ approved, notes }),
    });
  }

  // Dashboard - Real-time Data
  async getDashboardData(): Promise<DashboardData> {
    const response = await this.request<any>('/api/v1/dashboard');
    return response.data || response;
  }

  // Trust Score - Real Calculations
  async getTrustScore(): Promise<TrustScore> {
    return this.request('/api/v1/trust-score');
  }

  // Cloud Integrations
  async getIntegrations(): Promise<any[]> {
    return this.request('/api/v1/integrations');
  }

  async connectAWSIntegration(credentials: any): Promise<any> {
    return this.request('/api/v1/integrations/cloud/aws/connect', {
      method: 'POST',
      body: JSON.stringify({
        credentials,
        test_connection: true,
        configuration: {}
      }),
    });
  }

  async connectGCPIntegration(credentials: any): Promise<any> {
    return this.request('/api/v1/integrations/cloud/gcp/connect', {
      method: 'POST',
      body: JSON.stringify({
        credentials,
        test_connection: true,
        configuration: {}
      }),
    });
  }

  async connectAzureIntegration(credentials: any): Promise<any> {
    return this.request('/api/v1/integrations/cloud/azure/connect', {
      method: 'POST',
      body: JSON.stringify({
        credentials,
        test_connection: true,
        configuration: {}
      }),
    });
  }

  // Performance Metrics
  async getPerformanceMetrics(): Promise<any> {
    return this.request('/api/v1/metrics/performance');
  }

  // Real-time Monitoring
  async getMonitoringMetrics(): Promise<any> {
    return this.request('/api/v1/monitoring/metrics');
  }

  async getActiveAlerts(): Promise<any> {
    return this.request('/api/v1/monitoring/alerts');
  }

  // Health Check
  async healthCheck(): Promise<{ status: string; service: string }> {
    return this.request('/health');
  }

  // WebSocket Connection for Real-time Updates
  connectWebSocket(onMessage?: (data: any) => void): WebSocket | null {
    if (!this.token) return null;

    try {
      const ws = new WebSocket(`ws://localhost:8000/ws?token=${this.token}`);
      
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (onMessage) onMessage(data);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      return ws;
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      return null;
    }
  }
}

export const velocityApi = new VelocityApiService();
export default velocityApi;