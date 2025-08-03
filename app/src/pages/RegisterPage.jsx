import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/auth.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (formData.username.length > 50) {
      newErrors.username = 'Username must be less than 50 characters';
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, underscores, and hyphens';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else {
      // Additional password strength checks
      const hasUpperCase = /[A-Z]/.test(formData.password);
      const hasLowerCase = /[a-z]/.test(formData.password);
      const hasNumbers = /\d/.test(formData.password);

      if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
        newErrors.password = 'Password must contain uppercase, lowercase, and numbers';
      }
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, text: '' };

    let score = 0;
    const checks = [
      { test: /.{8,}/, text: '8+ characters' },
      { test: /[A-Z]/, text: 'uppercase' },
      { test: /[a-z]/, text: 'lowercase' },
      { test: /\d/, text: 'number' },
      { test: /[!@#$%^&*(),.?":{}|<>]/, text: 'special character' }
    ];

    checks.forEach(check => {
      if (check.test.test(password)) score++;
    });

    const strengthLevels = [
      { strength: 0, text: 'Very Weak', color: 'var(--cg-danger)' },
      { strength: 1, text: 'Weak', color: 'var(--cg-danger)' },
      { strength: 2, text: 'Fair', color: 'var(--cg-warning)' },
      { strength: 3, text: 'Good', color: 'var(--cg-warning)' },
      { strength: 4, text: 'Strong', color: 'var(--cg-success)' },
      { strength: 5, text: 'Very Strong', color: 'var(--cg-success)' }
    ];

    return strengthLevels[score];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const result = await register(formData.username, formData.email, formData.password);
      
      if (result.success) {
        // Redirect to email verification page, passing email as query param
        navigate(`/verify-email?email=${encodeURIComponent(formData.email)}`);
      } else {
        setErrors({ general: result.error });
      }
    } catch (err) {
      console.error('Registration error:', err);
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join Cardboard Garden to manage your collection</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {errors.general && (
            <div className="auth-error" role="alert">
              {errors.general}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className={`form-input ${errors.username ? 'form-input-error' : ''}`}
              placeholder="Choose a unique username"
              autoComplete="username"
              disabled={isLoading}
              required
            />
            {errors.username && (
              <div className="form-error">{errors.username}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`form-input ${errors.email ? 'form-input-error' : ''}`}
              placeholder="Enter your email address"
              autoComplete="email"
              disabled={isLoading}
              required
            />
            {errors.email && (
              <div className="form-error">{errors.email}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`form-input ${errors.password ? 'form-input-error' : ''}`}
                placeholder="Create a strong password"
                autoComplete="new-password"
                disabled={isLoading}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {formData.password && (
              <div className="password-strength">
                <div 
                  className="password-strength-bar"
                  style={{ 
                    width: `${(passwordStrength.strength / 5) * 100}%`,
                    backgroundColor: passwordStrength.color 
                  }}
                />
                <span 
                  className="password-strength-text"
                  style={{ color: passwordStrength.color }}
                >
                  {passwordStrength.text}
                </span>
              </div>
            )}
            {errors.password && (
              <div className="form-error">{errors.password}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`form-input ${errors.confirmPassword ? 'form-input-error' : ''}`}
              placeholder="Confirm your password"
              autoComplete="new-password"
              disabled={isLoading}
              required
            />
            {errors.confirmPassword && (
              <div className="form-error">{errors.confirmPassword}</div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p className="auth-footer-text">
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
