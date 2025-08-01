import { getApiUrl } from '../utils/apiDiscovery';

class ApiService {
  constructor() {
    this.baseUrl = null;
  }

  async initializeApi() {
    try {
      this.baseUrl = await getApiUrl();
    } catch (error) {
      console.error('Failed to initialize API:', error);
      this.baseUrl = 'http://localhost:3000'; // Fallback
    }
  }

  async ensureApiUrl() {
    if (!this.baseUrl) {
      await this.initializeApi();
    }
    return this.baseUrl;
  }

  async request(endpoint, options = {}) {
    const baseUrl = await this.ensureApiUrl();
    const url = `${baseUrl}${endpoint}`;
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Add authorization header if token exists
    const token = localStorage.getItem('token');
    if (token) {
      defaultOptions.headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return { success: true };
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication endpoints
  async register(username, email, password) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
  }

  async login(usernameOrEmail, password) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ usernameOrEmail, password }),
    });
  }

  async verifyEmail(token) {
    return this.request('/api/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  async resendVerificationEmail(email) {
    return this.request('/api/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async getUserInfo() {
    return this.request('/api/auth/me');
  }

  async logout() {
    return this.request('/api/auth/logout', {
      method: 'POST',
    });
  }

  // Card search endpoints
  async searchCards(query) {
    return this.request(`/api/cards/search?q=${encodeURIComponent(query)}`);
  }

  // Health check
  async healthCheck() {
    return this.request('/api/health');
  }
}

// Create and export a singleton instance
export const apiService = new ApiService();

// Export the class for testing purposes
export default ApiService;
