/**
 * API Service Layer for Velocity AI Platform
 * Centralized API client with authentication and error handling
 */

import { VelocityUser, SignupData } from '@/contexts/AuthContext';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_VERSION = 'v1';

// Types
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

// API Client Class
class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseURL = `${API_BASE_URL}/api/${API_VERSION}`;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  /**
   * Get authorization headers
   */
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('velocity_auth_token');
    if (token) {
      return {
        ...this.defaultHeaders,
        'Authorization': `Bearer ${token}`,
      };
    }
    return this.defaultHeaders;
  }

  /**
   * Make HTTP request with error handling
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getAuthHeaders(),
          ...options.headers,
        },
      });

      const contentType = response.headers.get('content-type');
      let data: any;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('velocity_auth_token');
          localStorage.removeItem('velocity_user');
          window.location.href = '/velocity/login';
          throw new Error('Authentication required');
        }

        throw new Error(data?.detail || data?.message || 'API request failed');
      }

      return {
        data,
        status: response.status,
      };
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error',
        status: 500,
      };
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Create API client instance
const apiClient = new ApiClient();

// Authentication API
export const authApi = {
  /**
   * Register new user
   */
  register: async (signupData: SignupData): Promise<ApiResponse<{ user: VelocityUser; access_token: string; refresh_token: string }>> => {
    return apiClient.post('/auth/register', signupData);
  },

  /**
   * Login user
   */
  login: async (email: string, password: string): Promise<ApiResponse<{ user: VelocityUser; access_token: string; refresh_token: string }>> => {
    return apiClient.post('/auth/login', { email, password });
  },

  /**
   * Logout user
   */
  logout: async (): Promise<ApiResponse<void>> => {
    return apiClient.post('/auth/logout');
  },

  /**
   * Get current user profile
   */
  getProfile: async (): Promise<ApiResponse<VelocityUser>> => {
    return apiClient.get('/auth/me');
  },

  /**
   * Update user profile
   */
  updateProfile: async (profileData: Partial<VelocityUser>): Promise<ApiResponse<VelocityUser>> => {
    return apiClient.put('/auth/me', profileData);
  },

  /**
   * Refresh access token
   */
  refreshToken: async (refreshToken: string): Promise<ApiResponse<AuthTokens>> => {
    return apiClient.post(`/auth/refresh?refresh_token=${refreshToken}`);
  },

  /**
   * Get auth health
   */
  getAuthHealth: async (): Promise<ApiResponse<any>> => {
    return apiClient.get('/auth/health');
  },
};

// Dashboard API
export const dashboardApi = {
  /**
   * Get dashboard overview
   */
  getOverview: async (): Promise<ApiResponse<any>> => {
    return apiClient.get('/dashboard/overview');
  },

  /**
   * Get trust score
   */
  getTrustScore: async (): Promise<ApiResponse<any>> => {
    return apiClient.get('/trust-score');
  },

  /**
   * Get system health
   */
  getHealth: async (): Promise<ApiResponse<any>> => {
    return apiClient.get('/health');
  },
};

// Export default API client
export default apiClient;