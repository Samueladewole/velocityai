import axios, { AxiosInstance, AxiosError } from 'axios';
import velocityConfig from '@/config/velocity.config';

// Types for API responses
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  company: string;
  role: string;
  tier: 'starter' | 'growth' | 'enterprise';
  mfa_enabled: boolean;
  created_at: string;
}

// API Service Class
class VelocityApiService {
  private api: AxiosInstance;
  private refreshPromise: Promise<AuthTokens> | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: velocityConfig.api.baseUrl,
      timeout: velocityConfig.api.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem(velocityConfig.auth.tokenKey);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        } else if (import.meta.env.DEV) {
          // For development, use a mock token
          config.headers.Authorization = `Bearer dev-token`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && originalRequest) {
          if (!this.refreshPromise) {
            this.refreshPromise = this.refreshAuthToken();
          }

          try {
            const tokens = await this.refreshPromise;
            this.setAuthTokens(tokens);
            originalRequest.headers.Authorization = `Bearer ${tokens.access_token}`;
            return this.api(originalRequest);
          } catch (refreshError) {
            this.logout();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          } finally {
            this.refreshPromise = null;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Auth Methods
  async login(email: string, password: string, mfa_code?: string): Promise<ApiResponse<AuthTokens & { user: User }>> {
    const response = await this.api.post('/auth/login', {
      email,
      password,
      mfa_code,
    });
    
    if (response.data.success) {
      this.setAuthTokens(response.data.data);
      this.setUser(response.data.data.user);
    }
    
    return response.data;
  }

  async signup(data: {
    email: string;
    password: string;
    name: string;
    company: string;
    tier: string;
  }): Promise<ApiResponse<AuthTokens & { user: User }>> {
    const response = await this.api.post('/auth/signup', data);
    
    if (response.data.success) {
      this.setAuthTokens(response.data.data);
      this.setUser(response.data.data.user);
    }
    
    return response.data;
  }

  async refreshAuthToken(): Promise<AuthTokens> {
    const refreshToken = localStorage.getItem(velocityConfig.auth.refreshTokenKey);
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await this.api.post('/auth/refresh', {
      refresh_token: refreshToken,
    });

    return response.data.data;
  }

  logout(): void {
    localStorage.removeItem(velocityConfig.auth.tokenKey);
    localStorage.removeItem(velocityConfig.auth.refreshTokenKey);
    localStorage.removeItem(velocityConfig.auth.userKey);
  }

  // Agent Management
  async getAgents(): Promise<ApiResponse<any[]>> {
    const response = await this.api.get('/api/v1/agents');
    return { data: response.data, success: true };
  }

  async createAgent(data: any): Promise<ApiResponse<any>> {
    const response = await this.api.post('/api/v1/agents', data);
    return { data: response.data, success: true };
  }

  async updateAgent(id: string, data: any): Promise<ApiResponse<any>> {
    const response = await this.api.put(`/api/v1/agents/${id}`, data);
    return { data: response.data, success: true };
  }

  async deleteAgent(id: string): Promise<ApiResponse<void>> {
    const response = await this.api.delete(`/api/v1/agents/${id}`);
    return { data: response.data, success: true };
  }

  async runAgent(id: string): Promise<ApiResponse<any>> {
    const response = await this.api.post(`/api/v1/agents/${id}/run`);
    return { data: response.data, success: true };
  }

  // Evidence Management
  async getEvidence(filters?: any): Promise<ApiResponse<any[]>> {
    const response = await this.api.get('/api/v1/evidence', { params: filters });
    return { data: response.data, success: true };
  }

  async validateEvidence(id: string): Promise<ApiResponse<any>> {
    const response = await this.api.post(`/api/v1/evidence/${id}/validate`);
    return { data: response.data, success: true };
  }

  async exportEvidence(format: 'pdf' | 'csv' | 'json', filters?: any): Promise<Blob> {
    const response = await this.api.get('/evidence/export', {
      params: { format, ...filters },
      responseType: 'blob',
    });
    return response.data;
  }

  // Integration Management
  async getIntegrations(): Promise<ApiResponse<any[]>> {
    const response = await this.api.get('/api/v1/integrations');
    return { data: response.data, success: true };
  }

  async connectIntegration(type: string, config: any): Promise<ApiResponse<any>> {
    const response = await this.api.post(`/api/v1/integrations/${type}/connect`, config);
    return { data: response.data, success: true };
  }

  async disconnectIntegration(type: string): Promise<ApiResponse<void>> {
    const response = await this.api.delete(`/api/v1/integrations/${type}`);
    return { data: response.data, success: true };
  }

  async testIntegration(type: string): Promise<ApiResponse<any>> {
    const response = await this.api.post(`/api/v1/integrations/${type}/test`);
    return { data: response.data, success: true };
  }

  // Compliance & Reporting
  async getTrustScore(): Promise<ApiResponse<any>> {
    const response = await this.api.get('/api/v1/trust-score');
    return { data: response.data, success: true };
  }

  async getComplianceReport(framework: string): Promise<ApiResponse<any>> {
    const response = await this.api.get(`/api/v1/compliance/reports/${framework}`);
    return { data: response.data, success: true };
  }

  async getPerformanceMetrics(period: string): Promise<ApiResponse<any>> {
    const response = await this.api.get('/api/v1/metrics/performance', {
      params: { period },
    });
    return { data: response.data, success: true };
  }

  // Billing & Subscription
  async getBillingInfo(): Promise<ApiResponse<any>> {
    const response = await this.api.get('/billing/info');
    return response.data;
  }

  async updateSubscription(tier: string): Promise<ApiResponse<any>> {
    const response = await this.api.post('/billing/subscription', { tier });
    return response.data;
  }

  async getInvoices(): Promise<ApiResponse<any[]>> {
    const response = await this.api.get('/billing/invoices');
    return response.data;
  }

  // Helper Methods
  private setAuthTokens(tokens: AuthTokens): void {
    localStorage.setItem(velocityConfig.auth.tokenKey, tokens.access_token);
    localStorage.setItem(velocityConfig.auth.refreshTokenKey, tokens.refresh_token);
  }

  private setUser(user: User): void {
    localStorage.setItem(velocityConfig.auth.userKey, JSON.stringify(user));
  }

  getUser(): User | null {
    const userStr = localStorage.getItem(velocityConfig.auth.userKey);
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    // For development, always return true to bypass auth
    if (import.meta.env.DEV) {
      return true;
    }
    return !!localStorage.getItem(velocityConfig.auth.tokenKey);
  }
}

// Export singleton instance
export const velocityApi = new VelocityApiService();
export default velocityApi;