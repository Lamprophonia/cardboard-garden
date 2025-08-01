import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function EmailVerificationPage() {
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const { user, resendVerificationEmail } = useAuth();
  const navigate = useNavigate();

  const handleResendEmail = async () => {
    if (!user?.email) return;
    
    setIsResending(true);
    setResendMessage('');
    
    try {
      await resendVerificationEmail(user.email);
      setResendMessage('Verification email sent! Please check your inbox.');
    } catch (error) {
      setResendMessage('Failed to send verification email. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  // If no user, redirect to login
  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Verify Your Email</h1>
          <p className="auth-subtitle">
            We've sent a verification link to <strong>{user.email}</strong>
          </p>
        </div>

        <div className="email-verification-content">
          <div className="verification-icon">📧</div>
          
          <div className="verification-instructions">
            <h3>Check your email</h3>
            <p>
              Click the verification link in the email we sent to activate your account.
              The link will expire in 24 hours.
            </p>
            
            <div className="verification-steps">
              <ol>
                <li>Check your inbox for an email from Cardboard Garden</li>
                <li>Click the "Verify Email" button in the email</li>
                <li>Return here and log in to access your account</li>
              </ol>
            </div>
          </div>

          <div className="verification-actions">
            <button
              onClick={handleResendEmail}
              disabled={isResending}
              className="btn btn-outline btn-full"
            >
              {isResending ? 'Sending...' : 'Resend Verification Email'}
            </button>
            
            {resendMessage && (
              <div className={`verification-message ${resendMessage.includes('sent') ? 'success' : 'error'}`}>
                {resendMessage}
              </div>
            )}
          </div>
        </div>

        <div className="auth-footer">
          <p className="auth-footer-text">
            Already verified? <Link to="/login" className="auth-link">Sign in</Link>
          </p>
          <p className="auth-footer-text">
            Wrong email? <Link to="/register" className="auth-link">Sign up again</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default EmailVerificationPage;
