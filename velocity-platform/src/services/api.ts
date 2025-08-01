/**
 * API service for Velocity AI Platform
 * Handles all backend communication
 */

const API_BASE_URL = 'http://localhost:8001';

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
  access_token: string;
  token_type: string;
  user: {
    id: string;
    email: string;
    name: string;
    company?: string;
  };
}

export interface Agent {
  id: string;
  name: string;
  description?: string;
  platform: string;
  framework: string;
  automation_level: number;
  status: string;
  created_at: string;
  evidence_count: number;
  success_rate: number;
}

export interface AgentCreate {
  name: string;
  description?: string;
  platform: string;
  framework: string;
  automation_level: number;
}

export interface Evidence {
  id: string;
  control_id: string;
  control_name: string;
  evidence_type: string;
  status: string;
  confidence_score: number;
  collected_at: string;
}

export interface DashboardStats {
  total_agents: number;
  total_evidence: number;
  avg_automation: number;
  active_agents: number;
  trust_score: number;
  compliance_coverage: number;
}

class ApiService {
  private token: string | null = null;

  constructor() {
    // Load token from localStorage on initialization
    this.token = localStorage.getItem('velocity_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `€{API_BASE_URL}€{endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer €{this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP €{response.status}: €{response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error (€{endpoint}):`, error);
      throw error;
    }
  }

  // Authentication
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    // Store token
    this.token = response.access_token;
    localStorage.setItem('velocity_token', this.token);

    return response;
  }

  async signup(data: SignupData): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    // Store token
    this.token = response.access_token;
    localStorage.setItem('velocity_token', this.token);

    return response;
  }

  async getCurrentUser(): Promise<any> {
    return this.request('/auth/me');
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('velocity_token');
  }

  // Agents
  async getAgents(): Promise<Agent[]> {
    return this.request<Agent[]>('/agents');
  }

  async createAgent(agent: AgentCreate): Promise<Agent> {
    return this.request<Agent>('/agents', {
      method: 'POST',
      body: JSON.stringify(agent),
    });
  }

  async getAgentEvidence(agentId: string): Promise<Evidence[]> {
    return this.request<Evidence[]>(`/agents/€{agentId}/evidence`);
  }

  // Dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    return this.request<DashboardStats>('/dashboard/stats');
  }

  // Health check
  async healthCheck(): Promise<{ status: string; service: string }> {
    return this.request('/health');
  }
}

export const apiService = new ApiService();
export default apiService;