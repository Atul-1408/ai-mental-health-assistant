import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  User,
  UserRegister,
  UserLogin,
  AuthResponse,
  EmotionRequest,
  EmotionResponse,
  ApiResponse
} from '../types';

class ApiService {
  private api: AxiosInstance;
  private baseURL = 'http://localhost:8001';

  constructor() {
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.clearToken();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Token management
  private getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private setToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  private clearToken(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  }

  // Auth endpoints
  async register(userData: UserRegister): Promise<AuthResponse> {
    try {
      const response = await this.api.post<AuthResponse>('/api/v1/auth/register', userData);
      if (response.data.success && response.data.data.access_token) {
        this.setToken(response.data.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Registration failed');
    }
  }

  async login(credentials: UserLogin): Promise<AuthResponse> {
    try {
      const response = await this.api.post<AuthResponse>('/api/v1/auth/login', credentials);
      if (response.data.success && response.data.data.access_token) {
        this.setToken(response.data.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Login failed');
    }
  }

  logout(): void {
    this.clearToken();
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getCurrentUser();
  }
  
  // Test method to verify backend connectivity
  async testConnection(): Promise<void> {
    try {
      const response = await axios.get(`${this.baseURL}/health`);
      alert(`Backend connection test successful!\nStatus: ${response.status}\nData: ${JSON.stringify(response.data)}`);
    } catch (error: any) {
      alert(`Backend connection test failed!\nError: ${error.message}\nStatus: ${error.response?.status}`);
    }
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<any>> {
    try {
      const response = await this.api.get<ApiResponse<any>>('/health');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Health check failed');
    }
  }

  // Chat endpoints
  async sendMessage(message: string): Promise<any> {
    try {
      console.log('Sending message to:', `${this.baseURL}/api/v1/chat/send`);
      console.log('Message payload:', { message });
      
      // Try without authentication first (for simplified backend) with timeout
      const response = await axios.post(`${this.baseURL}/api/v1/chat/send`, { message }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 seconds timeout
      });
      
      console.log('Chat API response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Chat API error:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      console.error('Error code:', error.code);
      
      throw new Error(error.response?.data?.detail || error.message || 'Failed to send message');
    }
  }

  // Emotion analysis
  async analyzeEmotion(request: EmotionRequest): Promise<EmotionResponse> {
    try {
      const response = await this.api.post<EmotionResponse>('/api/v1/emotions/analyze', request);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Emotion analysis failed');
    }
  }

  // Get supported emotions
  async getSupportedEmotions(): Promise<ApiResponse<{ emotions: string[]; total_count: number }>> {
    try {
      const response = await this.api.get<ApiResponse<{ emotions: string[]; total_count: number }>>('/api/v1/emotions/list');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch supported emotions');
    }
  }

  // Profile Management
  async getUserProfile(userId: string): Promise<any> {
    try {
      const response = await this.api.get(`/api/v1/profile/${userId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch user profile');
    }
  }

  async updateUserProfile(userId: string, profileData: any): Promise<any> {
    try {
      const response = await this.api.put(`/api/v1/profile/${userId}`, profileData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to update profile');
    }
  }

  async updateUserAvatar(userId: string, avatarUrl: string): Promise<any> {
    try {
      const response = await this.api.post(`/api/v1/profile/${userId}/avatar`, { avatar_url: avatarUrl });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to update avatar');
    }
  }

  async getUserStats(userId: string): Promise<any> {
    try {
      const response = await this.api.get(`/api/v1/profile/${userId}/stats`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch user stats');
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
