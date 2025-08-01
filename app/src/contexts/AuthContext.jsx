import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('auth_token');
        if (storedToken) {
          setToken(storedToken);
          
          // Verify token is still valid
          try {
            const userInfo = await apiService.getUserInfo();
            setUser(userInfo.user);
          } catch (error) {
            console.error('Token validation failed:', error);
            // Token is invalid, clear it
            localStorage.removeItem('auth_token');
            setToken(null);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (usernameOrEmail, password) => {
    try {
      const response = await apiService.login(usernameOrEmail, password);
      
      if (response.success) {
        const { token: newToken, user: userData } = response;
        setToken(newToken);
        setUser(userData);
        localStorage.setItem('auth_token', newToken);
        return { success: true };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Extract the actual error message from the thrown error
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.message && error.message !== `HTTP error! status: ${error.status}`) {
        errorMessage = error.message;
      }
      
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await apiService.register(username, email, password);

      return { 
        success: true, 
        message: response.message,
        emailSent: response.emailSent 
      };
    } catch (error) {
      console.error('Registration error:', error);
      
      // Extract the actual error message from the thrown error
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.message && error.message !== `HTTP error! status: ${error.status}`) {
        errorMessage = error.message;
      }
      
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('auth_token');
  };

  const resendVerification = async (email) => {
    try {
      const response = await apiService.resendVerificationEmail(email);

      return { 
        success: true, 
        message: response.message 
      };
    } catch (error) {
      console.error('Resend verification error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to resend verification email' 
      };
    }
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    resendVerification
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
